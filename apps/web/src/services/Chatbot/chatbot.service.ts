import { GeminiChatService as Chatbot } from '@/lib/llms/gemini';
import type { Collection, Db} from 'mongodb';
import { ObjectId } from 'mongodb';
import type { UserInterface as UserType } from 'types/user.type'; // Assuming UserType has '_id' as ObjectId
import type { MessageHistoryType, SectionMessageGeneratedType } from 'types/apps/chatbot/api.type.ts'; // Assuming these types have '_id' as ObjectId
import clientPromise from '@/lib/mongodb';
import type { Content } from '@google/generative-ai';
import { initAI } from '@/lib/llms/init';
import * as process from 'node:process';

export class ChatbotService {
	private chatbot!: Chatbot;
	private db!: Db;
	private userCollection!: Collection<UserType>;
	private sectionMessageCollection!: Collection<SectionMessageGeneratedType>;
	private messageHistoryCollection!: Collection<MessageHistoryType>;
	private readonly USER_ID: ObjectId;

	constructor(userId: ObjectId) {
		this.USER_ID = userId;
	}

	private async loadDB() {
		const client = await clientPromise;
		this.db = client.db(process.env.DB_NAME);
		this.initCollections();
		this.initChatbot();
	}

	private initCollections() {
		this.userCollection = this.db?.collection<UserType>('users');
		this.messageHistoryCollection = this.db?.collection<MessageHistoryType>('message_histories');
		this.sectionMessageCollection = this.db?.collection<SectionMessageGeneratedType>('section_messages');
	}

	private initChatbot() {
		this.chatbot = new Chatbot(process.env.GEMINI_API_KEY);
	}

	// init the AI generate message service for new user
	public async initGenerateService(sectionName: string) {
		await this.loadDB();
		const initMessage = initAI().initPrompt;
		const user = await this.userCollection?.findOne({ _id: this.USER_ID });
		if (!user) throw new Error('User not found');

		const sectionMessage = await this.createSectionMessage(sectionName);
		if (!sectionMessage) throw new Error('Failed to create section message');
		return sectionMessage;
	}

	// create a new section message for the user
	public async createSectionMessage(sectionName: string) {
		await this.loadDB();
		const user = await this.userCollection?.findOne({ _id: this.USER_ID });
		if (!user) throw new Error('User not found');

		const sectionMessage: ExcludeProperties<SectionMessageGeneratedType, '_id'> = {
			user_id: this.USER_ID,
			section_name: sectionName,
			message_generated: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await this.sectionMessageCollection?.insertOne(sectionMessage);
		if (!result.acknowledged) throw new Error('Failed to create section message');

		const updateStatus = await this.userCollection?.updateOne(
			{ _id: this.USER_ID },
			{ $push: { chatHistory: result.insertedId } },
		);
		if (!updateStatus.acknowledged) throw new Error('Failed to update user chat history');

		return {
			...sectionMessage,
			_id: result.insertedId,
		};
	}

	// send message to the chatbot and return the response
	public async sendMessage(message: {
		textContent: string,
		mediaContent: string[],
	}, sectionId: ObjectId): Promise<MessageHistoryType> {
		await this.loadDB();
		const user = await this.userCollection.findOne({ _id: new ObjectId(this.USER_ID) });
		if (!user) throw new Error('User not found');

		const sectionMessage = await this.sectionMessageCollection.findOne({ _id: sectionId });
		if (!sectionMessage) throw new Error('Section not found');

		const chatRequest: ExcludeProperties<MessageHistoryType, '_id'> = {
			message: message.textContent,
			mediaMessage: message.mediaContent,
			role: 'user',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const chatHistory = await this.messageHistoryCollection.find(
			{ _id: { $in: sectionMessage.message_generated } },
		).toArray();

		const fitChatHistory = chatHistory.map(chat => ({
			parts: [{ text: chat.message }],
			role: chat.role === 'assistant' ? 'model' : 'user',
		})).reverse() as unknown as Content[];

		const response = await this.chatbot.sendMessage(message, fitChatHistory, true);

		const chatResponse: MessageHistoryType = {
			_id: new ObjectId(),
			message: response,
			mediaMessage: [''],
			role: 'assistant',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const requestCreateMessage = await this.messageHistoryCollection.insertOne(chatRequest);
		if (!requestCreateMessage.acknowledged) throw new Error('Failed to create user message');

		const reqCreateBotMessage = await this.messageHistoryCollection.insertOne(chatResponse);
		if (!reqCreateBotMessage.acknowledged) throw new Error('Failed to create bot message');

		const updateStatus = await this.sectionMessageCollection.updateOne(
			{ _id: sectionId },
			{
				$push: {
					message_generated: {
						$each: [requestCreateMessage.insertedId,
							reqCreateBotMessage.insertedId],
					},
				},
			},
		);

		if (!updateStatus.acknowledged) throw new Error('Failed to update section message');

		return chatResponse;
	}

	// reset the chat history
	public async resetChat() {
		await this.loadDB();
		await this.userCollection.updateOne(
			{ _id: this.USER_ID },
			{ $set: { chatHistory: [] } },
		);
	}

	public async getChatSection() {
		await this.loadDB();
		const user = await this.userCollection.findOne({ _id: this.USER_ID });
		if (!user) throw new Error('User not found');

		return this.sectionMessageCollection.find({
			_id: { $in: user.chatHistory.map(id => new ObjectId(id)) },
		}).sort({ createdAt: -1 }).toArray();
	}

	// get the chat history
	public async getChatHistory() {
		await this.loadDB();
		const user = await this.userCollection.findOne({ _id: this.USER_ID });
		if (!user) throw new Error('User not found');

		return this.sectionMessageCollection.find({
			_id: { $in: user.chatHistory.map(id => new ObjectId(id)) },
		}).toArray();
	}

	// get the chat history by section id
	public async getChatHistoryById(sectionId: ObjectId) {
		await this.loadDB();
		return this.sectionMessageCollection.findOne({ _id: sectionId });
	}

	// get the chat history detail
	public async getChatHistoryDetail(sectionId: ObjectId, page?: number, limit?: number) {
		await this.loadDB();
		const chatHistory = await this.getChatHistoryById(sectionId);
		if (!chatHistory) throw new Error('Chat history not found');

		const query = { _id: { $in: chatHistory.message_generated } };

		if (page && limit) {
			return this.messageHistoryCollection
				.find(query)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.toArray();
		}

		return this.messageHistoryCollection
			.find(query)
			.sort({ createdAt: 1 }) // descending order
			.toArray();
	}

	// delete the chat history
	public async deleteChatHistory(sectionId: ObjectId) {
		await this.loadDB();
		const user = await this.userCollection.findOne({ _id: this.USER_ID });
		if (!user) throw new Error('User not found');

		const index = user.chatHistory.findIndex(historyId => historyId.toString() === (sectionId.toString()));
		if (index === -1) throw new Error('Invalid section id');

		user.chatHistory.splice(index, 1);
		await this.userCollection.updateOne(
			{ _id: this.USER_ID },
			{ $set: { chatHistory: user.chatHistory } },
		);

		return this.sectionMessageCollection.deleteOne({ _id: sectionId });
	}

	public async updateChatHistory(sectionId: string, updateData: Partial<SectionMessageGeneratedType>) {
		await this.loadDB();
		// const user = await this.userCollection.findOne({ _id: this.USER_ID });
		const updatedStatus = await this.db.collection('section_messages')
			.updateOne({ _id: new ObjectId(sectionId) }, {
				$set: {
					...updateData,
				},
			});
		if (updatedStatus.modifiedCount) throw new Error('Update chat section fail');
		return {
			insertId: updatedStatus.upsertedId,
			modifiedData: updateData,
		};
	}
}