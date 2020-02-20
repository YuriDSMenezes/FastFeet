import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fail' });
    }

    const { email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });

    if (!userExist) {
      return res.status(400).json({ error: 'User does not exists' });
    }
    if (!(await userExist.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const { id, name } = userExist;

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secrete, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
