import * as Yup from 'yup';

import Order from '../models/Order';
import Notification from '../schemas/Notification';
import DeliveryMan from '../models/DeliveryMan';
import Recipients from '../models/Recipient';
import Mail from '../../lib/Mail';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fail' });
    }

    const { deliveryman_id, recipient_id, product } = req.body;

    const orders = await Order.create({
      deliveryman_id,
      recipient_id,
      product,
      canceled_at: null,
      start_date: null,
      end_date: null,
    });

    const delivery = await DeliveryMan.findByPk(deliveryman_id);
    const recipient = await Recipients.findByPk(recipient_id);

    await Notification.create({
      content: `Nova encomenda para ${delivery.name}, produto : ${orders.product}  `,
      deliveryman: deliveryman_id,
    });

    await Mail.sendMail({
      to: `${delivery.name} <${delivery.email}`,
      subject: 'Novo pedido',
      template: 'createOrder',
      context: {
        client: recipient.name,
        request: product,
        deliveryMan: delivery.name,
        city: recipient.city,
        street: recipient.street,
        number: recipient.number,
        address_complement: recipient.address_complement,
      },
    });

    return res.json(orders);
  }

  async index(req, res) {
    const orders = await Order.findAll();
    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      canceled_at: Yup.string(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fail' });
    }

    const { id } = req.params;

    const orderExist = await Order.findByPk(id);

    if (!orderExist) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    orderExist.update(req.body);

    return res.json(orderExist);
  }

  async destroy(req, res) {
    const order = await Order.findByPk(req.params.id, {
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

    order.destroy();
    return res.json('Delete successfully');
  }
}

export default new OrderController();
