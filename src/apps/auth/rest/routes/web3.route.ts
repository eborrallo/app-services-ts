import { Router } from 'express';
import container from '../dependency-injection';

export const register = (router: Router) => {
  const messageController = container.get('Web3MessageController');
  const validateController = container.get('Web3ValidateMessageController');
  router.get('/auth/:address/message', messageController.run.bind(messageController));
  router.post('/auth/:address/validate', validateController.run.bind(validateController));
};
