import express from 'express';
import fileController from '../controllers/fileController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import fileMiddleware from '../middlewares/fleMiddleware.js';
const router = express.Router();
router.post(
  '/uploadFile',
  authMiddleware.authenticate,
  fileMiddleware.upload.single('file'),
  fileController.uploadFile
);

router.delete(
  '/deleteFile/:fileId',
  authMiddleware.authenticate,
  fileController.deleteFile
);

router.put(
  '/moveFile/:fileId',
  authMiddleware.authenticate,
  fileController.moveFileInFolders
);

router.put(
  '/renameFile/:fileId',
  authMiddleware.authenticate,
  fileController.renameFile
);

export default router;
