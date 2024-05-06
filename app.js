import express from 'express';
import { sequelize } from './database/dbConfig.js';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import User from './models/userModel.js';
import Folder from './models/folderModel.js';
import File from './models/fileModel.js';
import userRoutes from './routes/userRoute.js';
import folderRoutes from './routes/folderRoute.js';
import fileRoutes from './routes/fileRoute.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT;

app.use('/user', userRoutes);
app.use('/folder', folderRoutes);
app.use('/file', fileRoutes);

//table relations
User.hasMany(Folder, { foreignKey: 'userId' });
Folder.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(User, { foreignKey: 'userId' });
Folder.hasMany(File, { foreignKey: 'folderId' });
File.belongsTo(Folder, { foreignKey: 'folderId' });

try {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
