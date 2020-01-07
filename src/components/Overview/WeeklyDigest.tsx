import {DatePicker, Menu, Dropdown, message} from "antd";
import {ClickParam} from "antd/lib/menu";
import moment from "moment";
import React, {ReactElement, useContext} from "react";

import {Stats} from "./Stats";
import {Header, Row} from "./Overview.styles";
import {StoreContext} from "./store";


/**
 * Weekly Digest
 */
const WeeklyDigest = (): ReactElement => {
	const dateFormat = "MM/DD/YY";
	const { WeekPicker } = DatePicker;
	const { cardsStore: { cards, setCards }, dateStore: { date, setDate } } = useContext(StoreContext);

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