import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import OrderController from './app/controllers/OrderController';
import NotificationController from './app/controllers/NotificationController';
import DeliveriesController from './app/controllers/DeliveriesController';
import FinishController from './app/controllers/FinishController';
import ProblemsController from './app/controllers/ProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// create Session
routes.post('/sessions', SessionController.store);

// create AuthMiddleware
routes.use(authMiddleware);

// Recipients
routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);

// Upload Files
routes.post('/files', upload.single('file'), FileController.store);

// DeliveryMans
routes.post('/deliverymans', DeliveryManController.store);
routes.get('/deliverymans', DeliveryManController.index);
routes.post('/deliverymans/:id', DeliveryManController.update);
routes.delete('/deliverymans/:id', DeliveryManController.delete);

// Orders
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.destroy);

// Notifications
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// deliveries
routes.put('/deliveryman/:id/deliveries/:orderId', DeliveriesController.update);
routes.get('/deliveries/deliveryman/:id', DeliveriesController.index);

// finish Orders
routes.put(
  '/finish/deliveryman/:id/deliveries/:orderId',
  upload.single('file'),
  FinishController.update
);
routes.get('/finish/deliveries/:id', FinishController.index);

// Problems

routes.post('/delivery/:id/problems', ProblemsController.store);
routes.get('/problems', ProblemsController.index);
routes.get('/delivery/:id/problems', ProblemsController.show);
routes.put('/delivery/:orderId/cancel-delivery', ProblemsController.update);

export default routes;
