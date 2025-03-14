import mongoose, { Schema, Document } from 'mongoose';
import { paginate, toJSON } from './plugins';

export interface IVoiceIdentification {
    name: string;
    path: string;
    status: 'pending' | 'success' | 'error';
    voice_id: string;
}

export interface IVoiceIdentificationDocument extends Document<Schema.Types.ObjectId>, IVoiceIdentification { }

const voiceIdentificationSchema = new Schema<IVoiceIdentificationDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        path: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'error'],
            default: 'pending'
        },
        voice_id: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true,
        collection: 'voice_identifications',
    }
);

// Add plugins
voiceIdentificationSchema.plugin(toJSON);
voiceIdentificationSchema.plugin(paginate);

const VoiceIdentification = mongoose.model<IVoiceIdentificationDocument>('VoiceIdentification', voiceIdentificationSchema);

export default VoiceIdentification;