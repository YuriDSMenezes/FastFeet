import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order } = data;

    console.log('executo');

    await Mail.sendMail({
      to: `${order.delivery.name} <${order.delivery.email}`,
      subject: 'Cancelamento de Pedido',
      template: 'cancellation',
      context: {
        client: order.recipient.name,
        request: order.product,
        deliveryMan: order.delivery.name,
        city: order.recipient.city,
        street: order.recipient.street,
        number: order.recipient.number,
        address_complement: order.recipient.address_complement,
      },
    });
  }
}

export default new CancellationMail();
