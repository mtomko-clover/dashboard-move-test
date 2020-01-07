// import axios from "axios";
import React, {Component} from "react";

// import {AppOverview} from "../AppOverview";
import {AppApprovalsChart, JiraDLVChart} from "../Charts";
import {BigCard} from "../BigCard";
import News from "../News";
import WeeklyDigest from "./WeeklyDigest";
import StoreProvider from "./store";

import {Column, Row} from "./Overview.styles";


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

    componentDidMount(): void {
        // this.runJoelsScript("0YYDJSPRXWRSM");
        // console.log("singleResponse", singleResponse);
        // console.log("singleResponse.data", singleResponse.data);
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
                        <BigCard title="Recent Activity" />
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
