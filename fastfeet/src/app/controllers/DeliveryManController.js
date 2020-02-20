import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail' });
    }

    const { name, email, avatar_id } = req.body;

    const deliveryManExist = await DeliveryMan.findOne({ where: { email } });

    if (deliveryManExist) {
      return res.status(400).json({ error: 'DeliverMan already exist' });
    }

    const deliverman = await DeliveryMan.create({
      name,
      email,
      avatar_id,
    });

    return res.json(deliverman);
  }

  async index(req, res) {
    const deliveries = await DeliveryMan.findAll();

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail' });
    }

    const { id } = req.params;

    const delivery = await DeliveryMan.findByPk(id);

    delivery.update(req.body);

    return res.json(delivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await DeliveryMan.findByPk(id);

    delivery.destroy();

    return res.json('Delete!');
  }
}

export default new DeliveryManController();
