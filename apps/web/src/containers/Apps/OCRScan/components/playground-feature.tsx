import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/shadcn-ui/ui/card.tsx'
import { Button } from '@ui/shadcn-ui/ui/button.tsx'
import { FileImage } from 'lucide-react';

function PlaygroundFeature() {
	return (
		<div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto">
			<Card className="w-full md:w-1/2 border-zinc-700">
				<CardHeader>
					<div className="w-full h-40 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-t-lg flex items-center justify-center">
						<FileImage className="w-24 h-24 text-white" />
					</div>
				</CardHeader>
				<CardContent>
					<CardTitle className="text-2xl font-bold mb-2">Image OCR</CardTitle>
					<CardDescription>
						Extract text from various image formats including JPEG, PNG, and GIF.
						Ideal for processing screenshots, photos of documents, or any text-based images.
					</CardDescription>
				</CardContent>
				<CardFooter>
					<Button className="w-full">Select Image</Button>
				</CardFooter>
			</Card>

			<Card className="w-full md:w-1/2 border-zinc-700">
				<CardHeader>
					<div className="w-full h-40 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-t-lg flex items-center justify-center">
						<FileImage className="w-24 h-24 text-white" />
					</div>
				</CardHeader>
				<CardContent>
					<CardTitle className="text-2xl font-bold mb-2">Image OCR</CardTitle>
					<CardDescription>
						Extract text from various image formats including JPEG, PNG, and GIF.
						Ideal for processing screenshots, photos of documents, or any text-based images.
					</CardDescription>
				</CardContent>
				<CardFooter>
					<Button className="w-full">Select Image</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

export default PlaygroundFeature;