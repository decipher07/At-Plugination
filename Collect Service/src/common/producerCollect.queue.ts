import amqp, { Channel } from "amqplib";

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key
class Producer {
    channel: Channel;

    async createChannel() {
        const connection = await amqp.connect("amqp://localhost");
        this.channel = await connection.createChannel();
    }

    async publishMessage( exchangeName: string, queueName: string, data: any ) {
        if (!this.channel) {
            await this.createChannel();
        }

        await this.channel.assertExchange(exchangeName, "x-delayed-message", {
            autoDelete: false,
            durable: true,
            // @ts-ignore
            passive: true,
            arguments: {
                'x-delayed-type': "direct"
            }
        });

        // Exchange Name, Queue Name, Message
        await this.channel.publish(
            exchangeName,
            queueName,
            // @ts-ignore
            Buffer.from(JSON.stringify(data),{
                headers: {
                    "x-delay": 5000
                }
            })
        );

        console.log(
            `The new log is sent to exchange ${exchangeName}`
        );
    }
}

const collectServiceProducer = new Producer();
collectServiceProducer.createChannel();

export = collectServiceProducer;
