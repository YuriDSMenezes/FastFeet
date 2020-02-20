import {
  setHours,
  setSeconds,
  setMinutes,
  format,
  startOfHour,
  startOfDay,
  endOfDay,
  parseISO,
} from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import rangeHours from '../../utils/availableHour';

class DeliveriesController {
  // data de retirada
  async update(req, res) {
    const { orderId, id } = req.params;

    const available = rangeHours.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(new Date(), hour), minute),
        0
      ); // 2019-12-11 08:00:00
      return {
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      };
    });

    const start_date = {
      value: format(
        startOfHour(new Date('2020-02-19T10:00:00')),
        "yyyy-MM-dd'T'HH:mm:ssxxx"
      ),
    };

    const isAvailable = available.find(a => a.value === start_date.value);

    if (!isAvailable) {
      return res.status(400).json({
        error: 'Hour Not avaiable, just between from 08:00am at 18:00pm',
      });
    }

    const deliveries = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (deliveries.length >= 5) {
      return res.status(400).json({ error: 'only 5 withdrawals are allowed' });
    }

    const delivery = await Order.findOne({
      where: {
        id: orderId,
        deliveryman_id: id,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'zip_code'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    await delivery.update({
      start_date: parseISO(start_date.value),
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const { id } = req.params;

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: {
          [Op.eq]: null,
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

export default new DeliveriesController();
