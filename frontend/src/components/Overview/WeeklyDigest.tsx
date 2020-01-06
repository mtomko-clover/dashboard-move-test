import {DatePicker, Menu, Dropdown, message} from "antd";
import {ClickParam} from "antd/lib/menu";
import moment from "moment";
import React, {useState, ReactElement} from "react";

import {Stats} from "./Stats";
import {Header, Row} from "./Overview.styles";

import {
	appsApproved,
	appsPending,
	appsRejected,
	appsSubmitted,
	communityQuestions,
	communityAnswers,
	devsApproved,
	devsPending,
	devsSubmitted,
	devsRejected
} from "./queries";

/**
 * Weekly Digest
 */
const WeeklyDigest = (): ReactElement => {
	const {WeekPicker} = DatePicker;
	const dateFormat = "MM/DD/YY";
	const [date, setDate] = useState(moment());

	const rowOne = {
		appsApproved: { title: "Apps Approved", query: appsApproved },
		appsRejected: { title: "Apps Rejected", query: appsRejected },
		appsSubmitted: { title: "New Apps Submitted", query: appsSubmitted },
		appsPending: { title: "Total Apps Pending", query: appsPending },
	};
	const rowTwo = {
		devsApproved: { title: "Developer Accounts Approved", query: devsApproved },
		devsRejected: { title: "Developer Accounts Rejected", query: devsRejected },
		devsSubmitted: { title: "New Developer Accounts Submitted", query: devsSubmitted },
		devsPending: { title: "Total Developer Accounts Pending", query: devsPending },
	};
	const rowThree = {
		questions: { title: "Community Questions Asked", query: communityQuestions },
		answers: { title: "Community Questions Answered", query: communityAnswers },
	};

	const [cards, setCards] = useState([
		{ key: "0", title: "App Approvals", selected: true, content: rowOne },
		{ key: "1", title: "Developer Account Approvals", selected: false, content: rowTwo },
		{ key: "2", title: "Community", selected: false, content: rowThree },
	]);

	function handleMenuClick(e: ClickParam): void {
		message.info(cards[Number(e.key)].title);
		const newState = cards.map(item => (item.key === e.key) ? ({ ...item, selected: true }) : ({ ...item, selected: false }));
		setCards(newState);
	}

	const menu = (
		<Menu>
			{cards.map(({ title }, i) => (
				<Menu.Item key={i} onClick={handleMenuClick}>
					{title}
				</Menu.Item>
			))}
		</Menu>
	);

	const selectedCards = cards.filter(({ selected }) => selected)[0];

	return (
		<>
			<Header>
				<h2>Weekly Digest</h2>
				<Dropdown.Button overlay={menu}>{selectedCards.title}</Dropdown.Button>
				<WeekPicker
					format={dateFormat + " — wo"}
					onChange={(d): void => setDate(d || moment())}
					value={moment(date, dateFormat)}
				/>
			</Header>
			<Row>
				<Stats cards={selectedCards.content} date={date} />
			</Row>
		</>
	);
}

export default WeeklyDigest;