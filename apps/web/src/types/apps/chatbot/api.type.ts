import type { ObjectId } from 'mongodb';

export type CreateNewSectionRequest = {
	user_id: string;
}

export type CreateNewSectionResponse = {
	_id: string | ObjectId;
	section_name: string;
	message_generated: string;
}

export type UpdateSectionRequest = {
	update_data: ExcludeProperties<SectionMessageGeneratedType, '_id' | 'updatedAt' | 'user_id' | 'createdAt' | 'message_generated'>;
	section_id: string;
}

export type UpdateSectionResponse = {
	data: {
		insertedId: string;
		modifiedData: Partial<SectionMessageGeneratedType>;
	};
	error?: string;
}

export enum NewChatMessageEnum {
	USER = 'user',
	NEW_MESSAGE = 'new_message',
}

export type SectionMessageGeneratedType = {
	_id?: ObjectId;
	user_id: ObjectId;
	section_name: string;
	message_generated: ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

export enum ReferenceLinkType {
	bmp = 'image/bmp',
	csv = 'text/csv',
	odt = 'application/vnd.oasis.opendocument.text',
	doc = 'application/msword',
	docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	gif = 'image/gif',
	pdf = 'application/pdf',
}

export type MessageHistoryType = {
	_id?: ObjectId;
	message: string;
	mediaMessage?: string[];
	role: 'user' | 'assistant';
	createdAt: Date;
	updatedAt: Date;
	reference_link: {
		name: string;
		link: string;
		type:
			'image/bmp'|
			'text/csv'|
			'application/vnd.oasis.opendocument.text'|
			'application/msword'|
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'|
			'image/gif'|
			'application/pdf';
	}[];
	// coming soon update for the next version
	// modified history
}

export type SendMessageRequest = {
	model: string;
	user_id?: string;
	message?: string;
	messageMedia?: string[];
	section_id?: string;
}

export type SendMessageResponse = {
	message: string;
	role: 'USER' | 'ASSISTANT';
	createdAt: Date;
	updatedAt: Date;
}

export type GetAvailableModelsResponse = {
	models: {
		default: boolean;
		name: string;
		description: string;
		code: string;
	}[];
}