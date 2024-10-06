import fs from 'fs';
const env_mode = process.env.NODE_ENV;
export const sftpHostCbrain = {
	host: env_mode === "development" ? '14.224.188.206' : "127.0.0.1",
	port: 22,
	username: env_mode === "development" ? 'brainx' : "cbrain",
	privateKey: env_mode === "development"
		? fs.readFileSync('C:\\Users\\ASUS\\.ssh\\id_ed25519_brainx')
		: fs.readFileSync('/home/brainx/.ssh/id_ed25519_cbrain'),
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