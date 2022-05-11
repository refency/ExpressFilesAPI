import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Image.init({
    name: DataTypes.STRING,
    extension: DataTypes.STRING,
    data: DataTypes.BLOB("long"),
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image',
  });

  return Image;
};
