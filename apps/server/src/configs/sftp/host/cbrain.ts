import fs from 'fs';
import path from 'path';
import os from 'os';
const env_mode = process.env.NODE_ENV;

const homeDir = process.env.HOME || process.env.USERPROFILE;

export const sftpHostCbrain = {
	host: env_mode === "development" ? '' : "192.168.1.209",
	port: 22,
	username: env_mode === "development" ? 'brainx' : "cbrain",
	privateKey: env_mode === "development"
		? fs.readFileSync(path.join(os.homedir(),  ".ssh", "id_ed25519_cbrain"))
		: fs.readFileSync(path.join(os.homedir(),  ".ssh", "id_ed25519_cbrain")),
	...(env_mode === "development" ? {
		proxy: {
			sourceIP: '127.0.0.1',
			sourcePort: 22,
			destinationUsername: 'cbrain',
			destinationIP: '192.168.1.209',
			destinationPort: 22,
			destinationPrivateKey: fs.readFileSync('C:\\Users\\ASUS\\.ssh\\id_ed25519_cbrain'),
		}
	}: {})
}
export const sftpHostBrainx = {
	host: env_mode === "development" ? '' : "192.168.1.209",
	port: 22,
	username: env_mode === "development" ? 'brainx' : "brainx",
	privateKey: env_mode === "development"
		? fs.readFileSync(path.join(os.homedir(),  ".ssh", "id_ed25519_brainx"))
		: fs.readFileSync(path.join(os.homedir(),  ".ssh", "id_ed25519_brainx")),
	...(env_mode === "development" ? {
		proxy: {
			sourceIP: '127.0.0.1',
			sourcePort: 22,
			destinationUsername: 'brainx',
			destinationIP: '192.168.1.209',
			destinationPort: 22,
			destinationPrivateKey: fs.readFileSync('C:\\Users\\ASUS\\.ssh\\id_ed25519_brainx'),
		}
	}: {})
}
