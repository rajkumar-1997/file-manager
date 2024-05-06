import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConfig.js';

const Folder = sequelize.define('Folder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  folderName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Folder;
