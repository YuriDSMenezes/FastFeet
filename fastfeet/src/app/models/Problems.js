import Sequelize, { Model } from 'sequelize';

class Problems extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Orders, {
      foreignKey: 'delivery_id',
      as: 'order_problem',
    });
  }
}

export default Problems;
