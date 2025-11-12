// install kafkajs library
import {Kafka} from "kafkajs"

const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["host.docker.internal:9094", "host.docker.internal:9095", "host.docker.internal:9096" ] 
});

const admin = kafka.admin() 

// connection function 
const run = async () => {
    // connect to kafka 

    await admin.connect()
    await admin.createTopics({
        topics: [
            {topic:"payment-successful"},
            {topic:"order-successful"},
        ]
    })

};

run();