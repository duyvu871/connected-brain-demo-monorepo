"use client";
import React, { useState, createContext, useContext, useRef } from 'react';
import type { Socket } from 'socket.io-client';

export interface ProcessContextType {
	processing: boolean;
	processedText: string | null;
	processImage: (image: string) => void;
	resetProcess: () => void;
};

export const ProcessContext = createContext<ProcessContextType>({
	processing: false,
	processedText: null,
	processImage: () => {},
	resetProcess: () => {},
});

export const ProcessProvider = ({ children }: {children: React.ReactNode}) => {
	// process info
	const [processing, setProcessing] = useState(false);
	const [processedText, setProcessedText] = useState<string | null>(null);
	const socketRef = useRef<Socket | null>(null);
	
	const initProcessSocket = () => {
		// init socket connection

	}

	const processImage = async (image: string) => {
		resetProcess();
		setProcessing(true);
		// process image here
		await processImage(image);
		setProcessedText('processed text');
		setProcessing(false);
	}

	const resetProcess = () => {
		setProcessing(false);
		setProcessedText(null);
	}

	return (
		<ProcessContext.Provider value={{
			processing,
			processedText,
			processImage,
			resetProcess,
		}}>
			{children}
		</ProcessContext.Provider>
	);
}