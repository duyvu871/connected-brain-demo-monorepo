import { Client, FileEntryWithStats, SFTPWrapper } from 'ssh2';
import { fromEvent, timer, Subject } from 'rxjs';
import { switchMap, takeUntil, take, tap } from 'rxjs/operators';

export type SSHConfig = {
	host: string;
	port: number;
	username: string;
	privateKey: string | Buffer;
	proxy?: {
		sourceIP: string;
		sourcePort: number;
		destinationUsername: string;
		destinationIP: string;
		destinationPort: number;
		destinationPrivateKey: string | Buffer;
	}
}

export class NetworkSFTP {
	public static instanceClient: Record<string, Client> = {};
	public static TIMEOUT: Record<string, number> = {};
	public static lastActive: Record<string, number> = {};
	public static sshConfig: Record<string, SSHConfig> = {};

	public static async getInstance(name: string): Promise<Client|null> {
		if (NetworkSFTP.instanceClient[name]) {
			return NetworkSFTP.instanceClient[name];
		}
		return await NetworkSFTP.connect(name);
	}

	public static setConfig(name: string, config: SSHConfig) {
		NetworkSFTP.sshConfig[name] = config;
	}

	public static async connect(name: string): Promise<Client|null> {
		if (NetworkSFTP.instanceClient[name]) {
			// Reset timeout on successful connection
			NetworkSFTP.lastActive[name] = Date.now();
			return NetworkSFTP.instanceClient[name];
		}

		if (!NetworkSFTP.sshConfig[name]) {
			console.log('NetworkSFTP not configured');
			return null;
		}

		if (NetworkSFTP.sshConfig[name].proxy) {
			return await new Promise<Client|null>(async (resolve, reject) => {
				const proxyConfig = NetworkSFTP.sshConfig[name].proxy;
				if (!proxyConfig) {
					console.log(`Client ${name} not found`);
					reject(null);
					return;
				}
				const proxy = await NetworkSFTP.resolveConnect(name, new Client());
				if (!proxy) {
					console.log(`client ${name} connection failed`);
					reject(null);
					return;
				}
				const connection = new Client();
				proxy.forwardOut(
					proxyConfig.sourceIP,
					proxyConfig.sourcePort,
					proxyConfig.destinationIP,
					proxyConfig.destinationPort,
					(err, stream) => {
						if (err) {
							console.error(`[${name}] Proxy error:`, err);
							proxy.end();
							return;
						}
						connection.on('ready', () => {
							console.log(`[proxy:${name}] Client :: ready`);
							NetworkSFTP.lastActive[name] = Date.now();
							NetworkSFTP.instanceClient[name] = connection;
							resolve(connection);
						});
						connection.connect({
							sock: stream,
							username: proxyConfig.destinationUsername,
							privateKey: proxyConfig.destinationPrivateKey
						})
					}
				);
				NetworkSFTP.lastActive[name] = Date.now();
			});
		}

		const conn = new Client();

		return await NetworkSFTP.resolveConnect(name, conn);
	}

	public static async resolveConnect(name: string, client: Client) {
		client.on('ready', () => {
			console.log(`[${name}] Client :: ready`);
			NetworkSFTP.lastActive[name] = Date.now();
			NetworkSFTP.instanceClient[name] = client;

			const close$ = fromEvent(client, 'close');
			const timeout$ = timer(NetworkSFTP.TIMEOUT[name] || 10000).pipe(
				tap(() => console.log(`[${name}] Connection timeout, disconnecting...`))
			);

			timeout$
				.pipe(takeUntil(close$))
				.subscribe(() => {
					client.end();
					delete NetworkSFTP.instanceClient[name];
					console.log(`[${name}] SSH connection closed due to timeout`);
				});
		});

		client.on('error', (err) => {
			console.error(`[${name}] SSH connection error:`, err);
		});

		client.connect(NetworkSFTP.sshConfig[name]);

		return new Promise<Client|null>((resolve, reject) => {
			client.on('ready', () => resolve(client));
			client.on('error', () => {
				console.log(`[${name}] SSH connection error`);
				reject(null);
			});
		});
	}

	public static disconnect(name: string): boolean {
		try {
			if (NetworkSFTP.instanceClient[name]) {
				NetworkSFTP.instanceClient[name].end();
				delete NetworkSFTP.instanceClient[name];
				return true;
			} else {
				console.error(`Client ${name} not found`);
				return false;
			}
		} catch (e) {
			console.error(`Error disconnecting ${name} client: }`, e);
			return false;
		}
	}

	private static async executeSFTPCommand<T>(
		name: string,
		command: (sftp: SFTPWrapper) => Promise<T>
	): Promise<T | null> {
		const conn = await this.getInstance(name);
		if (!conn) {
			return null;
		}
		return new Promise<T | null>((resolve, reject) => {
			conn.sftp(async (err, sftp) => {
				if (err) {
					console.log(`[${name}] SFTP error:`, err);
					reject(err);
					return;
				}
				try {
					const result = await command(sftp);
					resolve(result);
				} catch (error) {
					console.log(`[${name}] SFTP command error:`, error);
					reject(error);
				}
			});
		});
	}

	// List files
	public static async listFiles(name: string, path: string): Promise<FileEntryWithStats[] | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.readdir(path, (err: any, list: FileEntryWithStats[] | PromiseLike<FileEntryWithStats[]>) => {
					if (err) reject(err);
					else resolve(list);
				});
			})
		);
	}

	// Read file
	public static async readFile(name: string, path: string, isBuffer: boolean = false): Promise<string | Buffer | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.readFile(path, (err: any, data: any) => {
					if (err) reject(err);
					else resolve(isBuffer ? data : data.toString());
				});
			})
		);
	}

	// Write file
	public static async writeFile(name: string, path: string, data: string | Buffer): Promise<boolean | null> {
		return this.executeSFTPCommand(name, async (sftp) => {
			return new Promise((resolve, reject) => {
				const writeStream = sftp.createWriteStream(path);
				writeStream.on('error', (e: any) => {
					console.log(e);
					resolve(false)
				});
				writeStream.on('close', () => resolve(true));
				writeStream.write(data);
				writeStream.end();
			});
		});
	}

	// Delete file
	public static async deleteFile(name: string, path: string): Promise<boolean | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.unlink(path, (err: any) => {
					if (err) reject(false);
					else resolve(true);
				});
			})
		);
	}

	public static async renameFile(name: string, oldPath: string, newPath: string): Promise<boolean | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.rename(oldPath, newPath, (err: any) => {
					if (err) reject(err);
					else resolve(true);
				});
			})
		);
	}

	// Create directory
	public static async createDirectory(name: string, path: string): Promise<boolean | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.mkdir(path, (err: any) => {
					if (err) reject(err);
					else resolve(true);
				});
			})
		);
	}

	// Delete directory
	public static async deleteDirectory(name: string, path: string): Promise<boolean | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.rmdir(path, (err: any) => {
					if (err) reject(err);
					else resolve(true);
				});
			})
		);
	}

	// Check file existence
	public static async accessFile(name: string, path: string): Promise<boolean | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.stat(path, (err: any) => {
					if (err) reject(err);
					else resolve(true);
				});
			})
		);
	}

	public static async copyToRemote(name: string, localPath: string, remotePath: string): Promise<boolean | null> {
		return this.executeSFTPCommand(name, (sftp) =>
			new Promise((resolve, reject) => {
				sftp.fastPut(localPath, remotePath, (err: any) => {
					if (err) reject(err);
					else resolve(true);
				});
			})
		);
	}
}