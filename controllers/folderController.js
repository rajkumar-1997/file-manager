import Folder from '../models/folderModel.js';

const createFolder = async (req, res, next) => {
  try {
    const { folderName } = req.body;
    const userId = req.user.dataValues.id;
    const folder = await Folder.findOne({ where: { folderName: folderName } });
    if (folder) {
      throw { type: 'error', message: 'Folder Name Already Exists' };
    } else {
      // Create the folder in the database
      const newFolder = await Folder.create({
        folderName,
        userId,
      });
      res.status(200).send({ messgae: 'New folder created', newFolder });
    }
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

async function findFolderByNameWithinChildren(name, userId, parentId = null) {
  try {
    const folders = await Folder.findAll({
      where: {
        parentId,
        userId,
      },
    });

    for (let folder of folders) {
      if (folder.folderName === name) {
        return folder;
      } else {
        // Recursively search within children
        const foundFolder = await findFolderByNameWithinChildren(
          name,
          userId,
          folder.id
        );
        if (foundFolder) {
          // Found within children
          return foundFolder;
        }
      }
    }
    //Not found within children
    return null;
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
}

const createSubFolder = async (req, res, next) => {
  try {
    const { subFolderName, parentFolderName } = req.body;
    const userId = req.user.dataValues.id;
    // Find the parent folder by name
    let parentFolder = await findFolderByNameWithinChildren(
      parentFolderName,
      userId
    );

    if (!parentFolder) {
      return res.status(404).json({ message: 'Parent folder not found' });
    }

    // Create the subfolder in the database
    const newSubfolder = await Folder.create({
      folderName: subFolderName,
      parentId: parentFolder?.id,
      userId,
    });

    res.status(200).send({ messgae: 'New subFolder created', newSubfolder });
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

export default { createFolder, createSubFolder };
