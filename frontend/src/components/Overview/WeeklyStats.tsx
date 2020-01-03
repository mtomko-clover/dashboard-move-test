import {DatePicker} from "antd";
import moment from "moment";
import React, {useState} from "react";

import {Card} from "../Card";
import {Header, Row} from "./Overview.styles";


const {WeekPicker} = DatePicker;

const fakeStat = {
	title: "from last week",
	type: "percentageUp",
	datum: 12
};

const WeeklyStats = () => {
	const dateFormat = "YYYY-MM-DD";
	const [date, setDate] = useState(moment());

	console.log(moment(date).format(dateFormat));
	return (
		<>
			<Header>
				<h2>Weekly Digest</h2>
				<WeekPicker
					format={dateFormat + " — wo"}
					onChange={d => setDate(d || moment())}
					value={moment(date, dateFormat)}
				/>
			</Header>
			<Row>
				<Card title="Apps Approved" datum={12} stat={fakeStat} />
				<Card title="Apps Submitted" datum={199}/>
				<Card title="Devs Approved" datum={8} />
				<Card title="Devs Submitted" datum={17}/>
				<Card title="Community Questions" datum={32} />
				<Card title="Community Answers" datum={9} />
			</Row>
		</>
	);
}

export default WeeklyStats;