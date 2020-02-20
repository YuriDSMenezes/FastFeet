import Sequelize, { Model } from 'sequelize';

class Orders extends Model {
  static init(sequelize) {
    super.init(
      {
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        product: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliveries, {
      foreignKey: 'deliveryman_id',
      as: 'delivery',
    });
    this.belongsTo(models.Recipients, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Recipients, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Orders;
