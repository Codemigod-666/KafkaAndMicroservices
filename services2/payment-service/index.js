// install kafkajs library

import express from 'express';
import cors from "cors";
import { Kafka } from 'kafkajs';

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
const kafka = new Kafka({
    clientId: "payment-service",
    brokers: ["localhost:9094"]
});
const producer = kafka.producer()
const connectToKafka = async () => {
    try {
        await producer.connect()
        console.log("Producer connnected")
    } catch (error) {
        console.log("Error connecting to Kafka", error);
    }
}

app.get("/order", async(req, res) => {
    return res.json({message: "Hello how are you, this is you order route"})
});

app.post("/payment-service", async (req, res) => {
    const {cart} = req.body;
    // assume that we can get the cookie and decrypt the userID 
    const userId = "123"
    // todo: payment 
    console.log("API endpoint hit!");
    // kafka 
    await producer.send({
        topic: "payment-successful",
        messages: [{ value: JSON.stringify({userId, cart}) }]
    })
    // console.log(JSON.stringify({userId, cart}))
    setTimeout(() => {
        return res.status(200).send("Payment successful");
    }, 3000);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message);
})

app.listen(8000, () => {
    connectToKafka()
    console.log("Payment Service is running on port 8000");
})