import {Client, FileEntryWithStats} from "ssh2";
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
	public static instanceClient: Record<string, Client>;
	public static TIMEOUT: Record<string, number> = {};
	public static lastActive: Record<string, number> = {};
	public static sshConfig: Record<string, SSHConfig>;

	public static async getInstance(name: string): Promise<Client|null> {
		if (NetworkSFTP.instanceClient[name]) {
			return NetworkSFTP.instanceClient[name];
		}
		return await NetworkSFTP.connect(name);
	}

	public static setConfig(name: string,  config: SSHConfig) {
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

	public static async listFiles(name: string, path: string): Promise<FileEntryWithStats[]|null> {
		const conn = await this.getInstance(name);
		if (!conn) {
			return null;
		}
		return new Promise((resolve, reject) => {
			conn.sftp((err, sftp) => {
				if (err) {
					reject(err);
					return;
				}
				sftp.readdir(path, (err, list) => {
					if (err) {
						reject(null);
						return;
					}
					resolve(list);
				});
			});
		});
	}

	public static async readFile(name: string, path: string): Promise<string|null> {
		const conn = await this.getInstance(name);
		if (!conn) {
			return null;
		}
		return new Promise((resolve, reject) => {
			conn.sftp((err, sftp) => {
				if (err) {
					console.log(`[${name}] SFTP error:`, err);
					reject(null);
					return;
				}
				sftp.readFile(path, (err, data) => {
					if (err) {
						reject(null);
						return;
					}
					resolve(data.toString());
				});
			});
		});
	}

	public static async writeFile(name: string, path: string, data: string | Buffer): Promise<boolean> {
		const conn = await this.getInstance(name);
		if (!conn) {
			return false;
		}
		return new Promise((resolve, reject) => {
			conn.sftp((err, sftp) => {
				if (err) {
					console.log(`[${name}] SFTP error:`, err);
					reject(false);
					return;
				}
				const writeStream = sftp.createWriteStream(path);
				writeStream.on('close', () => {
					resolve(true);
				});
				writeStream.write(data);
				writeStream.end();
			});
		});
	}
}