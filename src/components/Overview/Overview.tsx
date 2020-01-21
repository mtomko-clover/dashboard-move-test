import React, {Component} from "react";

import {AppApprovalsChart, JiraDLVChart} from "../Charts";
import {BigCard} from "../BigCard";
import {News} from "../News";
import WeeklyDigest from "./WeeklyDigest";
import OverviewProvider from "./store";
import NewsProvider from "../News/store";
import AnnouncementProvider from "../Announcements/store";

import {Column, Row} from "./Overview.styles";
import RecentActivities from "../RecentActivity/RecentActivities";
import Announcements from "../Announcements/Announcements";


export default class Overview extends Component<any, any> {
    render(): React.ReactNode {
        return (
            <Column>
                    <AnnouncementProvider>
                    <Announcements />
                    </AnnouncementProvider>
                    <OverviewProvider>
                        <WeeklyDigest />
                    </OverviewProvider>
                    <Row>
                        <NewsProvider>
                            <News />
                        </NewsProvider>
                        <BigCard title="App Approvals">
                            <AppApprovalsChart category="title" value="amount" />
                        </BigCard>
                    </Row>
                    <Row>
                        <RecentActivities/>
                        <BigCard title="Recently Updated Apps" />
                    </Row>
                    <Row>
                        <BigCard title="JIRA DLV Issues: Created vs Resolved">
                            <JiraDLVChart />
                        </BigCard>
                    </Row>
                </Column>
        );
    }
}
