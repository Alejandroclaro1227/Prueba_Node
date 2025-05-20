const amqp = require('amqplib');

class RabbitMQClient {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            console.log('Conectado a RabbitMQ');
        } catch (error) {
            console.error('Error conectando a RabbitMQ:', error);
            throw error;
        }
    }

    async publishMessage(queue, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            console.log(`Mensaje enviado a la cola ${queue}`);
        } catch (error) {
            console.error('Error publicando mensaje:', error);
            throw error;
        }
    }

    async consumeMessages(queue, callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel.assertQueue(queue, { durable: true });
            console.log(`Esperando mensajes en la cola ${queue}`);
            this.channel.consume(queue, (message) => {
                if (message) {
                    const content = JSON.parse(message.content.toString());
                    callback(content);
                    this.channel.ack(message);
                }
            });
        } catch (error) {
            console.error('Error consumiendo mensajes:', error);
            throw error;
        }
    }

    async closeConnection() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            console.log('Conexión con RabbitMQ cerrada');
        } catch (error) {
            console.error('Error cerrando conexión:', error);
            throw error;
        }
    }
}

module.exports = new RabbitMQClient(); 