import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

import MeetupDetail from "@/components/meetups/MeetupDetail";

function MeetupDetails(props) {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
}

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		"mongodb+srv://sapphirelilyaj:w3zL5HK9nck9O6pu@cluster0.znppfmd.mongodb.net/?retryWrites=true&w=majority",
	);
	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: false, //paths contains all supported values (404 error = other values)
		//usually generate array dynamically instead of hardcoding
		paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } })),
	};
}

export async function getStaticProps(context) {
	//fetch data for single meetup

	const meetupId = context.params.meetupId;

	//console.log(meetupId); //see in developer terminal

	const client = await MongoClient.connect(
		"mongodb+srv://sapphirelilyaj:w3zL5HK9nck9O6pu@cluster0.znppfmd.mongodb.net/?retryWrites=true&w=majority",
	);
	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

	console.log(selectedMeetup);

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
				//image:
				//	"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
				//id: meetupId,
				//title: "First Meetup",
				//address: "Some Street 5, Some City",
				//description: "This is a first meetup.",
			},
		},
	};
}

export default MeetupDetails;
