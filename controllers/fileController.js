import File from '../models/fileModel.js';
import Folder from '../models/folderModel.js';
import AWSServices from '../services/s3Service.js';
import fs from 'fs';
const uploadFile = async (req, res, next) => {
  try {
    const { folderName } = req.body;
    const userId = req.user.dataValues.id;
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(400).send({ message: 'No file uploaded' });
    }
    const fileName = uploadedFile.originalname;
    const fileSize = uploadedFile.size;
    const path = uploadedFile.path;
    const folderData = await Folder.findOne({
      where: { folderName: folderName, userId: userId },
    });
    if (!folderData) {
      throw { type: 'error', message: 'Permission denied !' };
    }
    const s3FileUrl = await AWSServices.uploadFileToS3(path, fileName);
    const newFile = await File.create({
      userId,
      folderId: folderData.id,
      uploadDate: new Date(),
      fileName: fileName,
      fileURL: s3FileUrl,
      size: fileSize,
    });
    fs.unlinkSync(path);
    res.status(200).send({ message: 'File uploaded successfully', newFile });
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.user.dataValues.id;

    // Check if the file exists and belongs to the user
    const file = await File.findOne({ where: { id: fileId, userId: userId } });
    if (!file) {
      return res
        .status(404)
        .send({ message: 'File not found or permission denied' });
    }
    await AWSServices.deleteFileFromS3(file.fileURL);
    await file.destroy();
    res.status(200).send({ message: 'File deleted successfully' });
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

const moveFileInFolders = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const { destinationFolderId } = req.body;
    const userId = req.user.dataValues.id;

    const file = await File.findOne({ where: { id: fileId, userId: userId } });
    if (!file) {
      return res
        .status(404)
        .send({ message: 'File not found or permission denied' });
    }

    const destinationFolder = await Folder.findOne({
      where: { id: destinationFolderId, userId: userId },
    });
    if (!destinationFolder) {
      return res
        .status(404)
        .json({ message: 'Destination folder not found or permission denied' });
    }

    // Update the file's folder association to the destination folder
    file.folderId = destinationFolderId;
    await file.save();
    res.status(200).send({ message: 'File moved successfully', file });
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

const renameFile = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const { newFileName } = req.body;
    const userId = req.user.dataValues.id;

    const file = await File.findOne({ where: { id: fileId, userId: userId } });
    if (!file) {
      return res
        .status(404)
        .send({ message: 'File not found or permission denied' });
    }
    // Update the file name
    file.fileName = newFileName;
    await file.save();
    res.status(200).send({ message: 'File name updated successfully', file });
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

export default { uploadFile, deleteFile, moveFileInFolders, renameFile };
