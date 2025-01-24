import OpenAI from 'openai';
import { ChatConfig } from '../config/chatConfig';

export class ChatService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    public async generateResponse(message: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: ChatConfig.MODEL,
            messages: [
                {
                    role: "system",
                    content: ChatConfig.SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: ChatConfig.TEMPERATURE,
            max_tokens: ChatConfig.MAX_TOKENS
        });

        return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    }
} 