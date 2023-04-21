import { MongoClient } from "mongodb";

//code in api routes never seen on client-side
// /api/new-meetup
// POST request will trigger:

async function handler(req, res) {
	if (req.method === "POST") {
		const data = req.body;

		//const { title, image, address, description } = data;

		const client = await MongoClient.connect(
			"mongodb+srv://sapphirelilyaj:w3zL5HK9nck9O6pu@cluster0.znppfmd.mongodb.net/?retryWrites=true&w=majority",
		);
		const db = client.db();

		const meetupsCollection = db.collection("meetups");

		const result = await meetupsCollection.insertOne(data);

		console.log(result);

		client.close();

		res.status(201).json({ message: "Meetup inserted!" });
	}
}

export default handler;
