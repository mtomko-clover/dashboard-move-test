import { Moment } from "moment";
import React, { ReactElement } from "react";
import { TweenOneGroup } from "rc-tween-one";

import { Card } from "../Card";
import { AppApprovalsState, DevApprovalsState, CommunityState } from "./types";


interface StatsProps {
	cards: AppApprovalsState | DevApprovalsState | CommunityState;
	date: Moment;
}

export function Stats({ cards, date }: StatsProps): ReactElement {
	return (
		<TweenOneGroup enter={{ x: 100, opacity: 0, type: "from" }} className="weekly-digest">
			{Object.values(cards).map((card, i) => <Card date={date} key={i} {...card} />)}
		</TweenOneGroup>
	)
}