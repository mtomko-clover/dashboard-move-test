import {DatePicker} from "antd";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState, ReactElement} from "react";

import {Card} from "../Card";
import {Header, Row} from "./Overview.styles";


const {WeekPicker} = DatePicker;

const fakeStat = {
	title: "from last week",
	type: "percentageUp",
	datum: 12
};

const { REACT_APP_ANSWERHUB_URL, REACT_APP_ANSWERHUB_TOKEN } = process.env;
const community = axios.create({
  baseURL: REACT_APP_ANSWERHUB_URL,
  headers: {
    Authorization: `Basic ${REACT_APP_ANSWERHUB_TOKEN}`
  }
});

type AnswerHubState = {
	AcceptNodeAction?: number;
	AnswerAction?: number;
	AskAction?: number;
	CloseNodeAction?: number;
	CommentAction?: number;
	DeleteAction?: number;
}

type AnswerHubResponse = {
	type: string;
	verb?: string;
	count?: number;
}

/**
 * TO-DO: JIRA stats
 * Apps: project=DAA AND summary !~ QA
 * Devs: project=DAV
 */
const WeeklyStats = (): ReactElement => {
	const dateFormat = "MM/DD/YY";
	const [date, setDate] = useState(moment());
	const initialCommunityState = { AskAction: null, AnswerAction: null, CommentAction: null, AcceptNodeAction: null, DeleteAction: null, CloseNodeAction: null };
	const [communityData, setCommunityData] = useState(initialCommunityState);

	useEffect(() => {
		const startDate = moment(date).startOf("week").format(dateFormat);
		const endDate = moment(date).endOf("week").format(dateFormat);

		community
			.get(`/analytics/content.json?fromDate=${startDate}&toDate=${endDate}`)
			.then(({ data }) => {
				const state = data.actionsAnalytics.actions.reduce((acc: AnswerHubState, { count, type }: AnswerHubResponse) => ({ ...acc, [type]: count }), {})
				setCommunityData(state)
			})
			.catch(e => console.log(e))
	}, [date])

	console.log(communityData);
	return (
		<>
			<Header>
				<h2>Weekly Digest</h2>
				<WeekPicker
					format={dateFormat + " — wo"}
					onChange={(d): void => setDate(d || moment())}
					value={moment(date, dateFormat)}
				/>
			</Header>
			<Row>
				<Card title="Apps Approved" datum={0} stat={fakeStat} />
				<Card title="Apps Submitted" datum={0}/>
				<Card title="Devs Approved" datum={0} />
				<Card title="Devs Submitted" datum={0}/>
				<Card title="Community Questions" datum={communityData.AskAction} />
				<Card title="Community Answers" datum={communityData.AcceptNodeAction} />
			</Row>
		</>
	);
}

export default WeeklyStats;