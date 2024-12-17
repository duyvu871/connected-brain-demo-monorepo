import { ObjectId, Types } from "mongoose";
import FileStorageService from "@/services/CURD/file_storage.service";
import AppConfig from "@/configs/app.config";
import S2t, { IS2t, IS2tDTO } from "@/models/speech_to_text.model";
import ApiError from "@/helpers/ApiError";
import { HttpStatusCode } from "@/helpers/http_status_code";
import { MakeRequired } from "@/types/helper";
import { Request } from "express";
import { Server, Socket } from "socket.io";
import { constants } from "@repo/utils";
import path from "path";
import * as http from "node:http";
import { getRedis, initNewRedis, initRedis } from "@/configs/database/redis";
const { api_route } = constants;

// Map to store connected clients with their session IDs.
const clientConnect = new Map<string, Socket>();

// Initialize Redis connection.
initRedis();

/**
 * Service class for handling Speech-to-Text (S2T) operations.
 */
export default class SpeechToTextService {
	/**
	 * Handles WebSocket connections for the S2T feature.
	 * @param io - The Socket.IO server instance.
	 */
	public static connection(io: Server) {
		console.log(
			"S2T socket connected",
			api_route.API.feature.SPEECH_TO_TEXT.socket
		);
		// Create a namespace for S2T operations.
		const namespace = io.of(api_route.API.feature.SPEECH_TO_TEXT.socket);

		namespace.on("connection", async (socket) => {
			// Extract session ID from the socket handshake query.
			const sessionId =
				socket.handshake.query.sessionId instanceof Array
					? socket.handshake.query.sessionId[0]
					: socket.handshake.query.sessionId;

			// Validate session ID.
			if (!sessionId) {
				socket.emit("error", "session id not found");
				socket.disconnect(true);
				return;
			}

			console.log(`user ${sessionId} connected to speech to text`);

			// Ensure only one connection per session ID.
			if (clientConnect.has(sessionId)) {
				socket.emit("error", "session id already connected");
				clientConnect.get(sessionId)?.disconnect(true);
				clientConnect.delete(sessionId);
			}

			// Initialize a new Redis instance for this connection.
			const RedisInstance = initNewRedis();
			// Store the socket in the clientConnections map.
			clientConnect.set(sessionId, socket);

			// Handle socket disconnection.
			socket.on("disconnect", () => {
				console.log("user disconnected");
				// Remove the socket from the map.
				clientConnect.delete(sessionId);

				// Clean up Redis connection.
				if (RedisInstance) {
					RedisInstance.unsubscribe().then(() => {
						RedisInstance.quit();
						console.log("redis unsubscribe");
					});
				}
			});

			// Handle socket errors.
			socket.on("error", (error) => {
				console.error("Error occurred:", error);
				// @ts-ignore
				if (error.critical) {
					clientConnect.delete(sessionId);
					socket.disconnect(true);
				} else {
					socket.emit("error", error.message);
				}
			});

			// Handle 'get-s2t-status' event to provide task status and subscribe to updates.
			socket.on("get-s2t-status", async (data: { id: string }) => {
				try {
					// Retrieve audit data for the given task ID.
					const auditData = await this.get_audit(data.id);
					console.log("status:", auditData.status);

					// If the task is done, emit the transcript directly.
					if (auditData.status === "done") {
						clientConnect
							.get(sessionId)
							?.emit("s2t:transcript", JSON.stringify(auditData));
					} else if (auditData.status === "processing") {
						// If the task is processing, subscribe to the Redis channel for updates.
						const channel = `s2t:transcript:${data.id.toString()}`;
						console.log("channel receive: ", channel);

						if (RedisInstance) {
							await RedisInstance.subscribe(channel);
							console.log("redis subscribe to channel:", channel);

							// Listen for messages on the subscribed channel.
							RedisInstance.on(
								"message",
								(channelMessage: string, message: string) => {
									console.log("channel: ", channelMessage);
									// If the message is for the current channel, emit it to the client.
									if (channelMessage === channel) {
										if (clientConnect.has(sessionId)) {
											clientConnect
												.get(sessionId)
												?.emit("s2t:transcript", message);
										}
									}
								}
							);
						}
					}
				} catch (e: any) {
					console.log(e);
					socket.emit("error", e.message);
				}
			});
		});
	}

	/**
	 * Creates a new database repository for storing audio records.
	 * @param originName - The original name of the audio file.
	 * @param user - The user ID associated with the record.
	 * @returns The newly created S2T document.
	 * @throws ApiError if the repository creation fails.
	 */
	public static async create_database_repo(
		originName: string,
		user: string | ObjectId
	): Promise<NonNullable<IS2t>> {
		const newRepo = await S2t.create({
			user,
			originName,
		});
		if (!newRepo || !newRepo._id) {
			throw new ApiError(
				HttpStatusCode.InternalServerError,
				"fail create storage place"
			);
		}
		return newRepo;
	}

	/**
	 * Creates an audit directory and file for a new S2T task.
	 * @param id - The ID of the S2T task.
	 * @returns The content of the created audit file.
	 */
	public static async create_audit(id: string | ObjectId) {
		// Create directory path for the task.
		const directoryPath = path.join(
			process.cwd(),
			`/storage/Assets/s2t/${id.toString()}`
		);
		const relativePath = `/storage/Assets/s2t/${id.toString()}`;

		// Create the directory.
		const createStorageDirectory = await FileStorageService.create_directory(
			directoryPath
		);

		// Create audit file content.
		const auditContent = {
			cloudPath: "",
			path: relativePath,
			auditPath: `${relativePath}/audit.json`,
			audio: {
				path: `${relativePath}/audio.wav`,
				duration: 0,
			},
			transcript: [],
		};

		try {
			// Write the audit file to the directory.
			const createAuditFile = await FileStorageService.write_file(
				directoryPath + "/audit.json",
				Buffer.from(JSON.stringify(auditContent))
			);
		} catch (error: any) {
			console.error("create audit error", error);
		}

		return auditContent;
	}

	/**
	 * Creates an audio file from a buffer.
	 * @param content - The audio file content as a Buffer.
	 * @param audit - The audit information containing the audio file path.
	 * @returns The path to the created audio file.
	 */
	public static async create_audio_file(
		content: Buffer,
		audit: MakeRequired<
			Partial<Awaited<ReturnType<typeof SpeechToTextService.create_audit>>>,
			"audio"
		>
	) {
		// Write the audio file to the file system.
		const createFileContent = FileStorageService.write_file(
			path.join(process.cwd(), audit.audio.path),
			content
		);
		return audit.audio.path;
	}

	/**
	 * Creates a write stream for the audio file and pipes the request data to it.
	 * @param req - The Express request object.
	 * @param audit - The audit information containing the audio file path.
	 * @returns A promise that resolves with the audio file path when the stream is closed.
	 */
	public static create_audio_stream = (
		req: Request,
		audit: MakeRequired<
			Partial<Awaited<ReturnType<typeof SpeechToTextService.create_audit>>>,
			"audio"
		>
	) => {
		return new Promise((resolve, reject) => {
			try {
				// Create a write stream for the audio file.
				const writeStream = FileStorageService.create_write_stream(
					path.join(process.cwd(), audit.audio.path)
				);

				const file = req.file as Express.Multer.File;
				const buffer = file.buffer;
				writeStream.write(buffer);

				// Event: Stream starts.
				writeStream.on("open", () => {
					console.log("Start stream .... !!!!");
					req.pipe(writeStream);
				});

				// Event: Data is being written and progress can be tracked.
				writeStream.on("drain", () => {
					const written = parseInt(writeStream.bytesWritten.toString());
					const total = parseInt(req.headers["content-length"] || "0");
					const pWritten = ((written / total) * 100).toFixed(2);
					console.log(`Processing  ... ${pWritten}% done`);
				});

				// Event: Stream is closed, resolve the promise.
				writeStream.on("close", () => {
					console.log("Processing  ... 100%");
					resolve(audit.audio.path);
				});

				// Event: Error during stream writing.
				writeStream.on("error", (err) => {
					console.error("stream write", err);
					reject(err);
				});
			} catch (e) {
				console.error("create audio stream error", e);
				reject(e);
			}
		});
	};

	/**
	 * Retrieves the audit information for a given S2T task.
	 * @param id - The ID of the S2T task.
	 * @returns The audit information.
	 * @throws ApiError if the audit is not found.
	 */
	public static async get_audit(id: string | ObjectId) {
		const audit = await S2t.findById(id);
		if (!audit) {
			throw new ApiError(HttpStatusCode.NotFound, "audit not found");
		}
		return audit;
	}

	/**
	 * Updates the audit information for a given S2T task.
	 * @param id - The ID of the S2T task.
	 * @param audit - The partial audit information to update.
	 * @returns The updated audit information, or null if the update fails.
	 */
	public static async update_audit(
		id: string | ObjectId,
		audit: Partial<IS2tDTO>
	): Promise<IS2tDTO | null> {
		// Construct the path to the audit file.
		const auditPath = `${process.cwd()}/storage/Assets/s2t/${id.toString()}/audit.json`;

		// Read the existing audit file.
		const rewriteAudit = FileStorageService.read_file(auditPath);
		if (!rewriteAudit) {
			console.log(
				new ApiError(HttpStatusCode.InternalServerError, "fail read audit")
			);
			return null;
		}

		// Parse the audit JSON.
		const auditJson = JSON.parse(rewriteAudit);
		// Merge the existing audit with the new audit data.
		const newAudit = { ...auditJson, ...audit };

		// Write the updated audit back to the file.
		const writeNewAudit = await FileStorageService.write_file(
			auditPath,
			Buffer.from(JSON.stringify(newAudit))
		);

		// Update the audit record in the database.
		const updateAuditRepo = await S2t.findByIdAndUpdate(
			new Types.ObjectId(id.toString()),
			newAudit,
			{ new: true }
		).exec();

		if (!updateAuditRepo) {
			console.log(
				new ApiError(HttpStatusCode.InternalServerError, "fail update audit")
			);
			return null;
		}

		return newAudit;
	}

	/**
	 * Retrieves the transcript for a given S2T task.
	 * @param id - The ID of the S2T task.
	 * @returns The transcript content.
	 */
	public static async get_transcript(id: string | ObjectId) {
		// Retrieve the audit information.
		const audit = await SpeechToTextService.get_audit(id);
		// Read the content of the audit file.
		const auditContent = FileStorageService.read_file(
			path.join(process.cwd(), audit.auditPath)
		);

		return auditContent;
	}

	/**
	 * Lists all transcripts for a given user.
	 * @param userId - The ID of the user.
	 * @returns An array of S2T documents.
	 */
	public static async list_transcript(userId: string | ObjectId) {
		return await S2t.find({ user: userId }).exec();
	}

	/**
	 * Appends a new transcript segment to the audit file.
	 * @param id - The ID of the S2T task.
	 * @param transcript - The transcript segment to append.
	 */
	public static async update_transcript(
		id: string | ObjectId,
		transcript: string
	) {
		try {
			// Retrieve the audit information.
			const audit = await SpeechToTextService.get_audit(id);
			// Read the content of the audit file.
			const auditContent = FileStorageService.read_file(
				path.join(process.cwd(), audit.auditPath)
			);
			// Parse the audit JSON.
			const auditJson = JSON.parse(auditContent);
			// Push the new transcript segment.
			auditJson.transcript.push(transcript);
		} catch (error: any) {
			console.error("update transcript error", error);
		}
	}
}