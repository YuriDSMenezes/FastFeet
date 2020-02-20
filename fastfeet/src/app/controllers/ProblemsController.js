import * as Yup from 'yup';
import Problems from '../models/Problems';
import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import Recipients from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ProblemsController {
  async store(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail' });
    }

    const delivery = await Order.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist!' });
    }

    const problem = await Problems.create({
      delivery_id: id,
      description,
    });

    return res.json(problem);
  }

  async index(req, res) {
    const problems = await Problems.findAll({
      attributes: ['id', 'delivery_id', 'description'],
      include: {
        model: Order,
        as: 'order_problem',
        attributes: ['id', 'product', 'recipient_id', 'deliveryman_id'],
      },
    });

    return res.json(problems);
  }

  async show(req, res) {
    const { id } = req.params;

    const problem = await Problems.findAll({
      where: {
        delivery_id: id,
      },
      attributes: ['delivery_id', 'description'],
      include: {
        model: Order,
        as: 'order_problem',
        attributes: ['id', 'product', 'recipient_id', 'deliveryman_id'],
      },
    });

    return res.json(problem);
  }

  async update(req, res) {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: DeliveryMan,
          as: 'delivery',
          attributes: ['name', 'email'],
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'name',
            'city',
            'street',
            'number',
            'address_complement',
          ],
        },
      ],
    });

    await order.update({
      canceled_at: new Date(),
    });

    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(`order ${orderId} canceled`);
  }
}

export default new ProblemsController();
