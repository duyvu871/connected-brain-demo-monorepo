import fs from 'fs';
import { NetworkSFTP } from '../dist/index.cjs';

const test = async (isForward = false) => {
	try {
		NetworkSFTP.instanceClient?.['test']?.end();
		if (NetworkSFTP.instanceClient?.['test']) {
			delete NetworkSFTP.instanceClient['test'];
		}
		console.log('Disconnected from test SFTP server');
	} catch (error) {
		console.error('Disconnected fail by reason:', error);
	}

	try {
		const testConfig = {
			host: '14.224.188.206',
			port: 22,
			username: 'brainx',
			privateKey: fs.readFileSync('C:\\Users\\ASUS\\.ssh\\id_ed25519_brainx'),
			...(isForward ? {
				proxy: {
					sourceIP: '127.0.0.1',
					sourcePort: 22,
					destinationUsername: 'cbrain',
					destinationIP: '192.168.1.209',
					destinationPort: 22,
					destinationPrivateKey: fs.readFileSync('C:\\Users\\ASUS\\.ssh\\id_ed25519_cbrain'),
				}
			} : {}),
		};

		NetworkSFTP.instance = undefined;
		NetworkSFTP.instanceClient = {};
		NetworkSFTP.TIMEOUT = {
			test: 20000,
		};
		NetworkSFTP.lastActive = {};
		NetworkSFTP.sshConfig = {
			test: testConfig,
		};
		// console.log('NetworkSFTP.sshConfig:', NetworkSFTP.sshConfig);
	} catch (error) {
		console.error('Set config fail by reason:', error);
	}
	const targetInstanceName = "test";
	let instance1;
	try {
		const connection = await NetworkSFTP.connect(targetInstanceName);
		console.log('connection Ready');
		instance1 = await NetworkSFTP.getInstance(targetInstanceName);
	} catch (error) {
		console.error('Get instance fail by reason:', error);
	}

	// try {
	// 	const files = await NetworkSFTP.listFiles(targetInstanceName, '/media/cbrain/9cdf9fac-bba1-4725-848d-cc089e577048/new_folder/CBrain/Study_and_Research/Test/OCR/OCR_API/');
	// 	console.log('Files:', files);
	// } catch (error) {
	// 	console.error('List files fail by reason:', error);
	// }

	// try {
	// 	const file = await NetworkSFTP.readFile(targetInstanceName, '/media/brainx/Data/Chatbot/law-chatbot/DataChiHuyenCrawl/3873_QD-BTNMT_m_591258.doc')
	// 	console.log('File content:', file);
	// } catch (error) {
	// 	console.error('Get file fail by reason:', error);
	// }

	try {
		const write = await NetworkSFTP.writeFile(targetInstanceName, '/media/cbrain/9cdf9fac-bba1-4725-848d-cc089e577048/new_folder/CBrain/Study_and_Research/Test/test_storage.txt', 'Hello World');
		console.log('Write file:', write);
	} catch (error) {
		console.error('Write file fail by reason:', error);
	}
}

// test();
test(true);
