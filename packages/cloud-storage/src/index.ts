import { getDownloadURL, getMetadata, ref, uploadBytesResumable, FirebaseStorage } from 'firebase/storage';
import {FirebaseApp} from "firebase/app"
import { Storage, Bucket, File as GCSFile} from '@google-cloud/storage';
import GCPCredentials from '../services-key/connected-brain-c0ccf828fbda.json';
import {PassThrough} from 'node:stream';

interface UploadFileProps {
	file: File|Uint8Array|Blob|Buffer;
	filePath: string; // The path in Firebase Storage (e.g., 'images/profile-pics/user123.jpg')
	onProgress?: (progress: number) => void; // Optional progress callback
}

interface UploadFileToGoogleCloudStorageProps {
	bucketName: string;
	specialPath: string;
	mimeType?: string; // The MIME type of the file (e.g., 'image/jpeg')
	fileName: string; // The name of the file (e.g., 'user123.jpg')
}

interface FirebaseInstance {
	app: FirebaseApp
	storage: FirebaseStorage,
}

export class CloudStorage {
	public static storage: Storage;

	public static init() {
		this.storage = new Storage({
			credentials: GCPCredentials
		});
	}

	public static getInstanceOfGCS() {
		if (!this.storage) {
			this.init();
		}
		return this.storage;
	}

	/**
	 * Get a Firebase instance
	 * @param appName
	 * @example
	 * const firebaseInstance = CloudStorage.getFirebase('translate');
	 * const {storage} = firebaseInstance
	 * const storageRef = ref(storage, 'images/profile-pics/user123.jpg');
	 * const downloadURL = await getDownloadURL(storageRef);
	 * console.log(downloadURL);
	 * @returns FirebaseInstance
	 */

	public static getFirebase(appName: string): FirebaseInstance {
		return {} as FirebaseInstance
	}

	/**
	 * Upload a file to Google Cloud Storage
	 * @example
	 * CloudStorage.uploadFileToGCP({
	 * 	bucketName: 'my-bucket',
	 * 	specialPath: 'images/profile-pics',
	 * 	buffer: buffer,
	 * 	fileName: 'user123.jpg',
	 * });
	 * @param fileData
	 * @param options
	 */

	public static async uploadFileToGCP(fileData: Buffer, options: UploadFileToGoogleCloudStorageProps
	): Promise<{
		file: GCSFile;
		publicUrl: string;
	} | null>
	{
		return new Promise(async (resolve, reject) => {
			try {
				// Create a new storage instance
				const storage = this.getInstanceOfGCS();
				const bucket = storage.bucket(options.bucketName);
				// Set the destination of the file
				const destination = options.fileName ? `${options.specialPath}/${options.fileName}` : options.fileName;
				// Create a buffer stream
				const bufferStream = new PassThrough();
				// Write the file data to the buffer stream
				bufferStream.end(fileData);
				// Create an upload stream
				const file = bucket.file(destination);
				const stream = file.createWriteStream({
					contentType: options.mimeType || 'application/octet-stream',
					gzip: true,
					public: true,
					metadata: {
						contentType: options.mimeType || 'application/octet-stream',
						metadata: {
							cacheControl: 'public, max-age=31536000',
							acl: [{ entity: 'allUsers', role: 'READER' }],
						},
					},
				});
				// Pipe the file data to the cloud storage
				bufferStream.pipe(stream);
				// Handle the stream events
				bufferStream.on('finish', () => {
					console.log(`Đã upload file ${options.fileName} lên ${options.bucketName}`);
					resolve({
						file: file,
						publicUrl: `https://storage.googleapis.com/${options.bucketName}/${destination}`,
					}); // Return the file object
				});
				// Handle any errors while uploading
				bufferStream.on('error', (err) => {
					console.error('Lỗi khi upload file:', err);
					reject(null);
				});

			} catch (error) {
				console.error('Error uploading file:', error);
				reject(null);
				throw error;
			}
		});
	}

	/**
	 * Set lifecycle rule for a bucket
	 * @param bucketName
	 * @param expirationHours
	 * @example
	 * CloudStorage.setLifecycleRule('my-bucket');
	 */

	public static async setLifecycleRule(bucketName: string, expirationHours: number = 1): Promise<void> {
		const storage = this.getInstanceOfGCS();
		const bucket: Bucket = storage.bucket(bucketName);

		const [metadata] = await bucket.getMetadata();
		const lifecycleRules = metadata.lifecycle || {};

		lifecycleRules.rule = [
			{
				action: {
					type: 'Delete',
				},
				condition: {
					age: expirationHours, // Remove file after expiration hours
				},
			},
		];

		await bucket.setMetadata({ lifecycle: lifecycleRules });
		console.log(`Completed add lifecycle rule for bucket: ${bucketName}`);
	}

	/**
	 * Upload a file to Firebase Storage
	 * @param file
	 * @param filePath
	 * @param onProgress
	 *
	 * @example
	 * CloudStorage.uploadFileToFirebase({
	 * 	file: file,
	 * 	filePath: 'images/profile-pics/user123.jpg',
	 * 	onProgress: (progress) => {
	 * 		console.log(`Upload is ${progress}% done`);
	 * 		switch (progress) {
	 * 			case 100:
	 * 				console.log('Upload is complete');
	 * 				break;
	 * 			default:
	 * 				console.log('Upload is not complete');
	 * 				break;
	 * 		}
	 * 	},
	 * });
	 */
	public static async uploadFileToFirebase({file, filePath, onProgress = (progress) => {}, }: UploadFileProps)
		: Promise<
		{downloadURL: string; storageLocation: string}
		| null
	> {
		try {
			const firebaseInstance = this.getFirebase('translate');
			const {storage} = firebaseInstance;
			const storageRef = ref(storage, filePath);

			// Create an upload task
			const uploadTask = uploadBytesResumable(storageRef, file);

			// Optional: Track upload progress
			if (onProgress) {
				uploadTask.on('state_changed', (snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					onProgress(progress);
				});
			}

			// Wait for the upload to complete
			await uploadTask;
			console.log('File uploaded successfully!');

			// Get the download URL for the uploaded file
			const downloadURL = await getDownloadURL(storageRef);
			const metadata = (await getMetadata(storageRef));
			const bucket = metadata.bucket;
			const fullPath = metadata.fullPath;
			const storageLocation = `gs://${bucket}/${fullPath}`;
			return {
				downloadURL,
				storageLocation,
			};

		} catch (error) {
			console.error('Error uploading file:', error);
			return null;
		}
	};
}