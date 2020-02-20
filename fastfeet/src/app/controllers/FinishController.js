import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class FinishController {
  async update(req, res) {
    const { id, orderId } = req.params;

    const order = await Order.findOne({
      where: {
        id: orderId,
        deliveryman_id: id,
        canceled_at: null,
      },
      attributes: [
        'id',
        'start_date',
        'end_date',
        'product',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
      ],
    });

    const { originalname: name, filename: path } = req.file;

    const newFile = await File.create({
      name,
      path,
    });

    await order.update({
      signature_id: newFile.id,
      end_date: new Date(),
    });

    return res.json(order);
  }

  async index(req, res) {
    const { id } = req.params;

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['deliveryman_id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'zip_code'],
        },
      ],
    });

    return res.json(deliveries);
  }
}

export default new FinishController();
