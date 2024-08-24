const APIs = {
	signIn: '/api/auth/sign-in',
	signUp: '/api/v1/auth/sign-up',
	chatbot: {
		createSection: '/api/v1/feature/chatbot/create-new-section',
		updateSection: '/api/v1/feature/chatbot/update-section',
	},
	speechToText: {
		endpoint: process.env.NEXT_PUBLIC_API_BASE_URL,
		uploadAudio: '/api/v1/feature/s2t/upload',
		getTranscript: '/api/v1/feature/s2t/transcript/get',
		getTranscriptList: '/api/v1/feature/s2t/transcript/list',
	},
	ocr: {
		socket: '/socket/v1/feature/ocr',
		uploadWithoutAuth: '/api/v1/feature/ocr/upload-without-auth',
		upload: '/api/v1/feature/ocr/upload',
		list: '/api/v1/feature/ocr/list',
		get: '/api/v1/feature/ocr/get',
	}
};

const routeList = {
	features: '/app',
	home: '/',
	login: '/auth/method?type=login',
	register: '/auth/method?type=register',
	profile: '/profile',
	editProfile: '/profile/edit',
	// Features routes
	OCR: '/app/ocr',
	textToSpeech: '/app/text-to-speech',
	realtime: '/app/realtime',
	// Pricing routes
	pricing: '/pricing',
	about: '/about',
	contact: '/contact',
	terms: '/terms',
	privacy: '/privacy',
	cookies: '/cookies',
	explore: '/explore',
};

export { APIs, routeList };