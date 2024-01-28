import { Router } from 'express';
import container from '../dependency-injection';
import { UploadDocumentController } from '../controllers/UploadDocumentController';
import { RetrieveDocumentController } from '../controllers/RetrieveDocumentController';

export const register = (router: Router) => {
  const retrieveDocumentController = container.get('RetrieveDocumentController') as RetrieveDocumentController;
  const uploadDocumentController = container.get('UploadDocumentController') as UploadDocumentController;

  router.post(
    '/storage/upload',
    uploadDocumentController.validate.bind(uploadDocumentController),
    uploadDocumentController.run.bind(uploadDocumentController)
  );
  router.get('/storage/retrieve/:id', retrieveDocumentController.run.bind(retrieveDocumentController));
};
