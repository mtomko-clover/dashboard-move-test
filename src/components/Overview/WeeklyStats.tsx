import {DatePicker, Menu, Dropdown, message} from "antd";
import {ClickParam} from "antd/lib/menu";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState, ReactElement, ReactNode} from "react";
import QueueAnim from "rc-queue-anim";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";

import {Card} from "../Card";
import {Header, Row} from "./Overview.styles";

TweenOne.plugins.push(Children);

const {WeekPicker} = DatePicker;

const { REACT_APP_ANSWERHUB_URL, REACT_APP_ANSWERHUB_TOKEN, REACT_APP_JIRA_URL, REACT_APP_JIRA_TOKEN } = process.env;
const community = axios.create({
  baseURL: REACT_APP_ANSWERHUB_URL,
  headers: {
    Authorization: `Basic ${REACT_APP_ANSWERHUB_TOKEN}`
  }
});

const jira = axios.create({
	baseURL: REACT_APP_JIRA_URL,
	headers: {
		Authorization: `Basic ${REACT_APP_JIRA_TOKEN}`
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

type JiraObj = {
	title: string;
	Children: {
		value: number;
		floatLength: number;
	};
	priorWeek?: number;
}

type JiraState = {
	appsApproved: JiraObj;
	appsPending: JiraObj;
	appsSubmitted: JiraObj;
	appsRejected: JiraObj;
	devsApproved: JiraObj;
}

/**
 * TO-DO: JIRA stats
 * Apps: project=DAA AND summary !~ QA
 * Devs: project=DAV
 */
const WeeklyStats = (): ReactElement => {
	const dateFormat = "MM/DD/YY";
	const [date, setDate] = useState(moment());
	const initialCommunityState = {
		AcceptNodeAction: null,
		AnswerAction: null,
		AskAction: null,
		CloseNodeAction: null,
		CommentAction: null,
		DeleteAction: null
	};
	const initialJiraState = {
		appsApproved: { title: "Apps Approved", Children: { value: 0, floatLength: 0 }, priorWeek: 0 },
		appsPending: { title: "Total Apps Pending", Children: { value: 0, floatLength: 0 } },
		appsRejected: { title: "Apps Rejected", Children: { value: 0, floatLength: 0 }, priorWeek: 0 },
		appsSubmitted: { title: "New Apps Submitted", Children: { value: 0, floatLength: 0 }, priorWeek: 0 },
		devsApproved: { title: "Developer Accounts Approved", Children: { value: 0, floatLength: 0 }, priorWeek: 0 },
	}
	const [communityData, setCommunityData] = useState(initialCommunityState);
	const [jiraData, setJiraData] = useState(initialJiraState as JiraState);

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

		const dateF = "YYYY-MM-DD";
		const start = moment(date).startOf("week").format(dateF);
		const end = moment(date).endOf("week").format(dateF);

		jira.get(`/api/apps_approved?start=${start}&end=${end}`)
			.then(({ data }) => {
				const { thisWeek, priorWeek } = data
				setJiraData(prevState => ({
					...prevState,
					devsApproved: {
						...prevState.devsApproved,
						priorWeek,
						Children: {
							value: thisWeek,
							floatLength: 0 }
						}
					})
				);
			})
			.catch(e => console.log(e));

		jira.get(`/api/devs_approved?start=${start}&end=${end}`)
			.then(({ data }) => {
				const { thisWeek, priorWeek } = data
				setJiraData(prevState => ({
					...prevState,
					appsApproved: {
						...prevState.appsApproved,
						priorWeek,
						Children: {
							value: thisWeek,
							floatLength: 0 }
						}
					})
				);
			})
			.catch(e => console.log(e));

		jira.get(`/api/apps_submitted?start=${start}&end=${end}`)
			.then(({ data }) => {
				const { thisWeek, priorWeek } = data
				setJiraData(prevState => ({ ...prevState, appsSubmitted: { ...prevState.appsSubmitted, Children: { value: thisWeek, floatLength: 0 }, priorWeek }}));
			})
			.catch(e => console.log(e));

		jira.get(`/api/apps_rejected?start=${start}&end=${end}`)
			.then(({ data }) => {
				const { thisWeek, priorWeek } = data
				setJiraData(prevState => ({ ...prevState, appsRejected: { ...prevState.appsRejected, Children: { value: thisWeek, floatLength: 0 }, priorWeek }}));
			})
			.catch(e => console.log(e));

		jira.get(`/api/apps_pending`)
			.then(({ data }) => {
				const { total } = data
				setJiraData(prevState => ({ ...prevState, appsPending: { ...prevState.appsPending, Children: { value: total, floatLength: 0 } }}));
			})
			.catch(e => console.log(e));
	}, [date])

	const communityStuff = [
		<Card key="5" title="Community Questions" datum={communityData.AskAction} />,
		<Card key="6" title="Community Answers" datum={communityData.AcceptNodeAction} />]

	const appApprovalStuff = Object
		.values(jiraData)
		.map((val, i) => {
			const { priorWeek, title } = val;
			return <Card
				key={i}
				title={title}
				datum={
					<TweenOne animation={val}>0</TweenOne>
				}
				stat={{
					title: "last week",
					datum: priorWeek
				}}
			/>
		})

	const [menuItems, setMenuItems] = useState([
		{ key: "0", title: "App Approvals", selected: true },
		{ key: "1", title: "Developer Account Approvals", selected: false },
		{ key: "2", title: "Community", selected: false },
	]);

	function handleMenuClick(e: ClickParam): void {
		message.info(menuItems[Number(e.key)].title);
		// console.log('🚦 click', e);
		const newState = menuItems.map(item => (item.key === e.key) ? ({ ...item, selected: true }) : ({ ...item, selected: false }));
		setMenuItems(newState);
	}

	function renderWeeklyStats(): ReactNode {
		return menuItems.map(({ key, selected }, i) => {
			return <QueueAnim key={i} type="top" delay={0} className="weekly_digest">
				{!selected
					? null
					: key === "0"
					? appApprovalStuff
					: key === "1"
					? null
					: key === "2"
					? communityStuff
					: null}
			</QueueAnim>
		})
	}
		
	const menu = (
		<Menu>
			{menuItems.map(({ title }, i) => (
				<Menu.Item key={i} onClick={handleMenuClick}>
					{title}
				</Menu.Item>
			))}
		</Menu>
	);

	const {title} = menuItems.filter(({ selected }) => selected)[0];

	return (
		<>
			<Header>
				<h2>Weekly Digest</h2>
				<Dropdown.Button overlay={menu}>{title}</Dropdown.Button>
				<WeekPicker
					format={dateFormat + " — wo"}
					onChange={(d): void => setDate(d || moment())}
					value={moment(date, dateFormat)}
				/>
			</Header>
			<Row>
				{renderWeeklyStats()}
			</Row>
		</>
	);
}

export default WeeklyStats;