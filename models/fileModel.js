import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConfig.js';
const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default File;
