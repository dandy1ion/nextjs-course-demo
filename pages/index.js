import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "@/components/meetups/MeetupList";
import { Fragment } from "react";
//import { useEffect, useState } from "react";

//const DUMMY_MEETUPS = [
//	{
//		id: "m1",
//		title: "A First Meetup",
//		image:
//			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
//		address: "Some address 5, 12345 Some City",
//		description: "This is a first meetup!",
//	},
//	{
//		id: "m2",
//		title: "A Second Meetup",
//		image:
//			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
//		address: "Some address 10, 12345 Some City",
//		description: "This is a second meetup!",
//	},
//];

function HomePage(props) {
	//const [loadedMeetups, setLoadedMeetups] = useState([]);

	//useEffect(() => {
	//	//send a http request and fetch data
	//	setLoadedMeetups(DUMMY_MEETUPS);
	//}, []);

	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups!"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
}

//runs on server after deployment
//page pregenerated for every incoming request
//good for data that is changing multiple times per second
//export async function getServerSideProps(context) {
//	const req = context.req; //request object
//	const res = context.res; //response object
//
//	//fetch data from an API
//
//	return {
//		props: {
//			meetups: DUMMY_MEETUPS,
//		},
//	};
//}

//quicker = cached and reused
//ensure prerendered pages contain data you need to wait for:
export async function getStaticProps() {
	//fetch data from an API
	const client = await MongoClient.connect(
		"mongodb+srv://sapphirelilyaj:SNFbN1sNDkG7osaB@cluster0.znppfmd.mongodb.net/?retryWrites=true&w=majority",
	);
	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10, //ensures data updated every 10seconds
	};
}

export default HomePage;
