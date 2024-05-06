import express from 'express';
import folderController from '../controllers/folderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post(
  '/createFolder',
  authMiddleware.authenticate,
  folderController.createFolder
);
router.post(
  '/createSubFolder',
  authMiddleware.authenticate,
  folderController.createSubFolder
);

export default router;
