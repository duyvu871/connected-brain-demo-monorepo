import { NextFunction, Request, Response } from "express";
import path from 'path';
import { SSHConfig, NetworkSFTP } from '@repo/network-sftp';
import { getContentType } from '@/utils/file';

export function serveStaticOverSSH(configName: string, remoteBasePath: string, sshConfig: SSHConfig): any {
	NetworkSFTP.setConfig(configName, sshConfig);

	return async (req: Request, res: Response, next: NextFunction) => {
		const relativePath = req.path;

		console.log('Serving file:', relativePath);
		if (relativePath.includes('..') || relativePath.startsWith('/.')) {
			return res.status(403).send('Forbidden');
		}

		// create remote path with base path and relative path
		const remotePath = path.posix.join(remoteBasePath, relativePath);
		console.log('Remote path:', remotePath);
		try {
			// check if file exists
			const exists = await NetworkSFTP.accessFile(configName, remotePath);
			if (!exists) {
				return res.status(404).send('File not found');
			}
			// read file
			const data = await NetworkSFTP.readFile(configName, remotePath, true);
			if (!data) {
				return res.status(500).send('Error reading file');
			}
			const contentType = await getContentType(data as Buffer);
			res.setHeader('Content-Type', contentType);
			res.setHeader('Cache-Control', 'public, max-age=86400');
			res.send(data);
		} catch (error) {
			console.error('Error serving file:', error);
			res.status(500).send('Internal server error');
		}
	};
}
