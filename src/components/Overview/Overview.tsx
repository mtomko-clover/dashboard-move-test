// import axios from "axios";
import React, {Component} from "react";

// import {AppOverview} from "../AppOverview";
import {AppApprovalsChart, JiraDLVChart} from "../Charts";
import {BigCard} from "../BigCard";
import {News} from "../News";
import WeeklyDigest from "./WeeklyDigest";
import StoreProvider from "./store";
import { List} from "antd";

import {Column, Row} from "./Overview.styles";
import RecentActivity from "../../models/RecentActivity";
import {ACTIVITY_CATEGORIES} from "../../models/RecentActivityCategories";
import RecentActivityRow from "../RecentActivityRow";

const dummyData =[
    new RecentActivity("aditya.singh", "Adi just presented an app to the Legal team", ACTIVITY_CATEGORIES.GCAL),
    new RecentActivity("ricardo.ventura", "Ricardo met with a partner", ACTIVITY_CATEGORIES.GCAL),
    new RecentActivity("nahmadkhani", "Nazanin approved an app", ACTIVITY_CATEGORIES.JIRA),
    new RecentActivity("emily.lucek", "Emily updated a Confluence page", ACTIVITY_CATEGORIES.CONFLUENCE),
    new RecentActivity("nicholas.ho", "Nicholas closed an Intercom conversation", ACTIVITY_CATEGORIES.INTERCOM),
    new RecentActivity("rachel", "Rachel created a JIRA Dashboard", ACTIVITY_CATEGORIES.JIRA),
    new RecentActivity("maricris.bonzo", "Maricris uploaded a video", ACTIVITY_CATEGORIES.YOUTUBE),
    new RecentActivity("mike.tomko", "Tomko met with Albertsons", ACTIVITY_CATEGORIES.GCAL),
    new RecentActivity("paul.petyo", "Paul deescalated an escalation", ACTIVITY_CATEGORIES.CONFLUENCE)
];

export default class Overview extends Component<{}, {}> {
    //TODO rename
    runJoelsScript = async (appId: string): Promise<void> => {
        console.log("running Joels Script");
        // const response = await axios({
        //     method: "post",
        //     url: `/app_by_id`,
        //     headers: { "Content-Type": "application/json" },
        //     data: {
        //         app_id : appId
        //     },
        // });
    };

    //TODO rename
    returnMultiple(): string {
        return "response";
    }

    render(): React.ReactNode {
        return (
            <StoreProvider>
                <Column>
                    <WeeklyDigest />
                    <Row>
                        <News/>
                        <BigCard title="App Approvals">
                            <AppApprovalsChart category="title" value="amount" />
                        </BigCard>
                    </Row>
                    <Row>
                        <BigCard title="Recent Activity">
                            <List
                                className="width_95"
                                itemLayout="horizontal"
                                dataSource={dummyData}
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 5,
                                }}
                                renderItem={item => (
                                    <List.Item>
                                        <RecentActivityRow activity={item}/>
                                    </List.Item>
                                )}
                            />
                        </BigCard>
                        <BigCard title="Recently Updated Apps" />
                    </Row>
                    <Row>
                        <BigCard title="JIRA DLV Issues: Created vs Resolved">
                            <JiraDLVChart />
                        </BigCard>
                    </Row>
                    {/*<AppOverview appJson={singleResponse.data[0]}/>*/}
                </Column>
            </StoreProvider>
        );
    }
}
