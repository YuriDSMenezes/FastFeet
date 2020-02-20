import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      address_complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail' });
    }

    const {
      name,
      street,
      number,
      address_complement,
      state,
      city,
      zip_code,
    } = req.body;

    const recipientExist = await Recipient.findOne({ where: { name } });

    if (recipientExist) {
      return res.status(400).json({ error: 'Recipient already exist' });
    }

    const recipient = await Recipient.create({
      name,
      street,
      number,
      address_complement,
      state,
      city,
      zip_code,
    });

    return res.json(recipient);
  }

  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      address_complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fail' });
    }

    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const {
      name,
      street,
      number,
      address_complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      street,
      number,
      address_complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
