import { ObjectId } from 'mongodb';

export interface PaymentType {
	_id: string;
	uid: string;
	amount: number;
	status: 'pending' | 'success' | 'failed';
	created_at: Date;
	updated_at: Date;
}

export interface BankingMethodUpdate {
	bank: string;
	accountNumber: string;
	accountName: string;
}

export interface UserPasswordUpdate {
	oldPassword: string;
	newPassword: string;
}

export interface UserSessionPayload {
	username: string;
	role: string;
	balance: number;
	uid: string;
	_id: string;
}

interface UserInterface {
	username: string;
	email: string;
	phone: string;
	password?: string;
	avatar: string;
	role: 'user' | 'admin';
	balance: number;
	id_index: number;
	virtualVolume: number;
	address: string;
	chatHistory: (string | ObjectId)[]; // Update with the actual type for the 'chatHistory' property
	transactions: string[]; // Update with the actual type for the 'transactions' property
	actionHistory: string[]; // Update with the actual type for the 'actionHistory' property
	bankingInfo: {
		bank: string;
		accountNumber: string;
		accountName: string;
	};
	createdAt: Date;
	updatedAt: Date;
}


interface UserPayload {
	fullName: string;
	email: string;
	bankMethod: {
		bankName: string;
		accountNumber: string;
		accountName: string;
	};
	role: 'user' | 'admin';
}

export type { UserInterface, UserPayload };
