import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';

export class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    public async handleChatMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message } = req.body;

            if (!message) {
                res.status(400).json({ error: 'Message is required' });
                return;
            }

            const response = await this.chatService.generateResponse(message);
            res.json({ response });
        } catch (error) {
            console.error('Error in chat controller:', error);
            res.status(500).json({ error: 'Failed to process the request' });
        }
    }
} 