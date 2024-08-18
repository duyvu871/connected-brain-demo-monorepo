import { Document, Model, ObjectId, Schema } from 'mongoose';
import mongoose from 'mongoose';
import { toJSON } from '@/models/plugins';
import env from '@/configs/env';

const connection = mongoose;

export interface OCRRepoInterface extends Document<string|ObjectId>, OCRRepoDTO {}

export interface OCRInterfaceModel extends	Model<OCRRepoInterface, {}, OCRRepoInterface> {}

export interface OCRRepoDTO {
	user: string|ObjectId;
	cloudPath: string;
	originName: string;
	path: string;
	auditPath: string;
	pages: string;
	status: 'processing' | 'done' | 'error';
}

const OCRSchema = new Schema<OCRRepoInterface>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	cloudPath: { type: String, default: "" },
	originName: { type: String, required: true},
	path: { type: String, default: "" },
	auditPath: { type: String, default: "" },
	pages: { type: String, default: ""},
	status: { type: String, enum: ['processing', 'done', 'error'], default: "processing" }
}, {
	timestamps: true,
});
OCRSchema.plugin(toJSON);

OCRSchema.pre('save', function(next) {
	const ocr = this as OCRRepoInterface;
	const id = ocr._id;
	const relativePath = `/storage/Assets/ocr/${id?.toString()}`
	ocr.path = relativePath;
	ocr.auditPath =  `${relativePath}/audit.json`;
	next();
});

const OcrModel = connection.model<OCRRepoInterface, OCRInterfaceModel>('SpeechToText', OCRSchema, env.MONGODB_DB_NAME);

export default OcrModel;
