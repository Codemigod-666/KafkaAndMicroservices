// install kafkajs libraryimport {Kafka} from "kafkajs"
// install kafkajs library

import {Kafka} from "kafkajs"

const kafka = new Kafka({
    clientId: "email-service",
    brokers: ["host.docker.internal:9094", "host.docker.internal:9095", "host.docker.internal:9096" ] 
});

const producer = kafka.producer()
const consumer = kafka.consumer({groupId:"email-service"});

const run = async () => {
    try {
        // await new Promise(resolve => setTimeout(resolve, 15000)); // wait 15s
        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({
            topic: "order-successful",
            fromBeginning:true,
        });

        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                const value = message.value.toString();
                const {userId, orderId} = JSON.parse(value);

                //    send email to the user 

                const dummyEmailId = "091584203985"
                console.log(`Email consumer: Email send to the user: ${orderId}`)

                await producer.send({
                    topic: "email-successful",
                    messages: [{value: JSON.stringify({userId, emailId: dummyEmailId})}]
                })
            }
        });

    } catch (error) {
        console.log("Error Email Service: ", error)
    }
}

run();