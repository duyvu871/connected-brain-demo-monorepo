import { ChatbotService } from '@/lib/llms/base.ts';
import type { Content } from '@google/generative-ai';

export class ConnectedbrainBot extends ChatbotService {
	protected apiRoute!: string;
	protected developmentMode = false;
	protected defaultResponse = '## Brainiac - Chatbot hỗ trợ chuyển đổi số cho doanh nghiệp Việt\n' +
		'\n' +
		'Xin chào! Tôi là **Brainiac**, chatbot được phát triển bởi Connected Brain. Tôi ra đời với sứ mệnh hỗ trợ các **khách hàng và doanh nghiệp Việt Nam** trên con đường **chuyển đổi số**.\n' +
		'\n' +
		'Hãy xem tôi như **trợ lý kỹ thuật số thông minh** của bạn, luôn sẵn sàng giải đáp mọi thắc mắc và giúp bạn ứng dụng những công nghệ tiên tiến nhất. \n' +
		'\n' +
		'Với Brainiac, bạn có thể:\n' +
		'\n' +
		'- Nâng cao hiệu quả hoạt động.\n' +
		'- Thúc đẩy tăng trưởng kinh doanh.\n' +
		'- Tạo ra trải nghiệm khách hàng vượt trội.\n' +
		'\n' +
		'**Bạn muốn khám phá những lợi ích cụ thể mà tôi mang lại?** Hãy tiếp tục tìm hiểu!\n';
	protected errorResponse = 'Xin lỗi, Brainiac gặp sự cố trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
	constructor() {
		super();
		this.apiRoute = 'http://localhost:8502/';
		this.developmentMode = false//process.env.NODE_ENV === 'development';
	}
	async startChat(isUsePrompt: boolean){
		return Promise.resolve({
			answer: this.defaultResponse,
		});
	}
	async sendMessage(message: {
			textContent: string;
			mediaContent: string[]
		}, history: Content[], passInitPrompt?: boolean) {
			try {
				if (this.developmentMode) {
					return Promise.resolve({
						answer: this.defaultResponse,
					});
				}

				const response = await fetch(`${this.apiRoute}/api/chat`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: message.textContent,
						history: history.map((h) => ({
							role: h.role,
							text: h.parts[0].text
						})),
						context: "",
						role: "user",
					}),
				});
				if (!response.ok) {
					console.log('Error sending message:', await response.json());

					return {
						answer: this.errorResponse,
						error: response.statusText,
					};
				}
				const data = await response.json() as {answer: string, reference_link?: string[]};
				console.log(data);
				return data;
			} catch (error: any) {
				console.log('Error sending message:', error);
				return {
					answer: this.errorResponse,
					error: error.message,
				};
			}
		}
}