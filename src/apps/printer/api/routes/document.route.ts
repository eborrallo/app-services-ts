import { Router } from 'express';
import container from '../dependency-injection';
import { CreateDocumentController } from '../controllers/CreateDocumentController';

export const register = (router: Router) => {
  const createDocumentController = container.get('CreateDocumentController') as CreateDocumentController;

  router.post(
    '/doc/create',
    createDocumentController.validate.bind(createDocumentController),
    createDocumentController.run.bind(createDocumentController)
  );
};
