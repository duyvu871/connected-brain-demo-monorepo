const { NetworkSFTP } = require('../dist');
const fs = require('fs');
const { Client } = require('ssh2');

describe('NetworkSFTP', () => {
	const testConfig = {
		host: '14.224.188.206',
		port: 22,
		username: 'brainx',
		privateKey: fs.readFileSync('C:\\Users\\ASUS\\.ssh\\id_ed25519_brainx'),
	};

	beforeEach(() => {
		// Clear any existing instances and configurations
		NetworkSFTP.instance = undefined;
		NetworkSFTP.instanceClient = {};
		NetworkSFTP.TIMEOUT = {};
		NetworkSFTP.lastActive = {};
		NetworkSFTP.sshConfig = {
			test: testConfig,
		};

		jest.clearAllMocks(); // Clear mocks before each test
	});

	it('should get a single instance', () => {
		const instance1 = NetworkSFTP.getInstance('test');
		const instance2 = NetworkSFTP.getInstance('test');
		expect(instance1).toStrictEqual(instance2);
	});

	it('should set and retrieve config', () => {
		NetworkSFTP.setConfig('test', testConfig);
		expect(NetworkSFTP.sshConfig['test']).toEqual(testConfig);
	});

	it('should connect to the server', async () => {
		NetworkSFTP.setConfig('test', testConfig);

		const conn = await NetworkSFTP.connect('test');

		expect(NetworkSFTP.instanceClient['test']).toStrictEqual(conn);
	});

	it('should reuse existing connection', async () => {
		NetworkSFTP.setConfig('test', testConfig);
		const mockClient = new Client();
		NetworkSFTP.instanceClient['test'] = mockClient;

		const conn = await NetworkSFTP.connect('test');

		expect(conn).toBe(mockClient);
	});

	it('should throw error if config not found', async () => {
		await expect(NetworkSFTP.connect('nonexistent')).rejects.toThrow('NetworkSFTP not configured');
	});

	it('should list files using SFTP', async () => {
		NetworkSFTP.setConfig('test', testConfig);
		const mockClient = new Client();
		const mockSftp = {
			readdir: jest.fn().mockImplementation((path, callback) => {
				// Trả về array các object { filename: 'tên file' }
				callback(null, [{ filename: 'file1.txt' }, { filename: 'file2.txt' }]);
			}),
		};
		mockClient.sftp = jest.fn().mockImplementation((callback) => {
			callback(null, mockSftp);
		});
		NetworkSFTP.instanceClient['test'] = mockClient;
		const list = await NetworkSFTP.listFiles('test', '/home/brainx/src/');
		console.log('List:', list);

		expect(mockSftp.readdir).toHaveBeenCalledWith('/home/brainx/src/', expect.any(Function));
		expect(list).toEqual(expect.any(Array));
		list.forEach(item => {
			expect(item).toEqual(String);
		});
	});

	it('should handle errors during SFTP readdir', async () => {
		NetworkSFTP.setConfig('test', testConfig);
		const mockClient = new Client();
		const mockSftp = {
			readdir: jest.fn().mockImplementation((path, callback) => {
				callback(new Error('SFTP error'), null);
			}),
		};
		mockClient.sftp = jest.fn().mockImplementation((callback) => {
			callback(null, mockSftp);
		});
		NetworkSFTP.instanceClient['test'] = mockClient;

		await expect(NetworkSFTP.listFiles('test', '/home/brainx/src/')).rejects.toThrow('SFTP error');
	});

	// Add more tests for timeout functionality and error handling
});