import amqp, { Channel, ConsumeMessage } from "amqplib";

async function consumeMessages(exchangeName: string, queueName: string) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "x-delayed-message", {
        autoDelete: false,
        durable: true,
        // @ts-ignore
        passive: true,
        arguments: {
            'x-delayed-type': "direct"
        }
    });

    const q = await channel.assertQueue(queueName);

    // Queue, Exchange, Queuename
    await channel.bindQueue(q.queue, exchangeName, queueName);

    channel.consume(q.queue, async (msg: ConsumeMessage | null ) => {
        const data = JSON.parse(msg!.content as unknown as string);
        
        const { refresh_token, responseid, name, yearOfJoining, phone, email, userId, spreadsheetId } = data ;
        
        // let check = await appendSpreadSheetController(responseid, name, yearOfJoining, phone, email, userId, refresh_token, spreadsheetId );
        // console.log(refresh_token, responseid, name, yearOfJoining, phone, email, userId, spreadsheetId );
        // console.log(check);

        console.log(data);

        channel.ack(msg!);
    });
}

export = consumeMessages;