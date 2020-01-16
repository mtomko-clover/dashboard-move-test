import moment from "moment";
import React, {createContext, ReactElement, ReactNode, useState} from "react";

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
} from "../../utils/queries";
import {Context} from "./types";


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
const initialCardsState = [
	{ key: "0", title: "App Approvals", selected: true, content: rowOne },
	{ key: "1", title: "Developer Account Approvals", selected: false, content: rowTwo },
	{ key: "2", title: "Community", selected: false, content: rowThree },
];
const initialContext: Context = {
	cardsStore: {
		cards: initialCardsState,
		setCards(): void {
			throw new Error('setCards function must be overridden');
		}
	},
	dateStore: {
		date: moment(),
		setDate(): void {
			throw new Error('setDate function must be overridden');
		}
	}
}

export const OverviewContext = createContext<Context>(initialContext);

export default ({ children }: { children: ReactNode }): ReactElement => {
	const [cards, setCards] = useState(initialCardsState);
	const [date, setDate] = useState(moment());
	const store = {
		cardsStore: {cards, setCards},
		dateStore: {date, setDate}
	};

	return <OverviewContext.Provider value={store}>{children}</OverviewContext.Provider>
};
