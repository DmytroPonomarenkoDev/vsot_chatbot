import { Router } from 'express';
import { ChatController } from '../controllers/chatController';

const router = Router();
const chatController = new ChatController();

router.post('/', (req, res) => chatController.handleChatMessage(req, res));

export default router; 