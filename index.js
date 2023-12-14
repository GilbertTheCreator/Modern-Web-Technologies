import express from 'express';
import { MongoClient } from 'mongodb';

const port = 3000;
const app = express();
const uri = "mongodb+srv://Gilbert:V89EKOUwRu3x41sO@1.h0mvxrz.mongodb.net/users";

let db;

(async function () {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log('Connected to MongoDB.');
        db = client.db("users");

        await db.createCollection("Users");
        await db.collection('Users').insertOne({ name: "Jay", age: 25 });
        await db.collection('Users').insertOne({ name: "Xavier", age: 21 });

    } catch (err) {
        console.error('Error occurred while connecting to MongoDB:', err);
    }
})();

app.get('/', async (req, res) => {
    try {
        const users = await db.collection('Users').find().toArray();

        res.send(users);
    } catch (err) {
        console.error('Error', err);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
