//import mongodb
const { MongoClient } = require('mongodb');

const express = require('express');
const app = express();

//require dotenv for environment variable
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

//declare port number
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongodb client connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lklnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try{
		await client.connect();

		const database = client.db('travelJet');
		const servicesCollection = database.collection('services');

		const ordersCollection = database.collection('orders');

		// get api for services
		app.get('/services', async (req, res)=> {
			const cursor = servicesCollection.find({});
			const services = await cursor.toArray();
			res.send(services);
		})



		// get api for orders
		app.get('/orders', async (req, res)=> {
			const cursor = ordersCollection.find({});
			const orders = await cursor.toArray();
			res.send(orders);
		})

		// get api for myorder
		app.get('/orders/:email', async(req, res) => {
			const email = req.params.email;
			const cursor = ordersCollection.find({"email": email});
			const myOrders = await cursor.toArray();
			res.send(myOrders);
		})


		//get api for single order
		app.get('/orders/:id', async(req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const order = await ordersCollection.findOne(query);
			res.json(order);
		})

		      //UPDATE API
			  app.put('/orders/:id', async (req, res) => {
				const id = req.params.id;
				const updatedUser = req.body;
				const filter = { _id: ObjectId(id) };
				const options = { upsert: true };
				const updateDoc = {
					$set: {
						status : "Active",
					},
				};
				const result = await ordersCollection.updateOne(filter, updateDoc, options);
				res.json(result);
			})


		// post api
		app.post('/services', async(req, res)=> {
			const service = req.body;
			const result = await servicesCollection.insertOne(service);
			res.json(result);
		})

		//post api for order

		app.post('/orders', async(req, res) => {
			const order = req.body;
			const result = await ordersCollection.insertOne(order);
			res.json(result);
		})

		//delete api
		app.delete('/orders/:id', async (req,res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id)};
			const result = await ordersCollection.deleteOne(query);
			res.json(result);
		})
	}
	finally{
		//await client.close();
	}
}
run().catch(console.dir);


app.get('/', (req, res) => {
	res.send('Running server....')
})

app.listen(port, () => {
	console.log('Running server on port ',port);
})