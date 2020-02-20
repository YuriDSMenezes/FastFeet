import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/Users';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import DeliveryMan from '../app/models/DeliveryMan';
import Order from '../app/models/Order';
import Problem from '../app/models/Problems';

import databaseConfig from '../config/database';

const models = [User, Recipient, File, DeliveryMan, Order, Problem];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
    // chama só quando o associate estiver setado no model
  }

  mongo() {
    this.connection = mongoose.connect('mongodb://localhost:27017/fastFeet', {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
