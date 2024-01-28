import { Router } from 'express';
import container from "../dependency-injection";

export const register = (router: Router) => {
  const validateController = container.get('OAuthValidateController');
  const auth = container.get('OAuthMiddleware');

  router.post('/oauth/validate', auth.run.bind(auth),validateController.run.bind(validateController));
};
