// import axios from "axios";
import React, {Component} from "react";

import {AppApprovalsChart, AppApprovalsHistogram} from "../Charts";
import {BigCard} from "../BigCard";
import {News} from "../News";
import WeeklyDigest from "./WeeklyDigest";
import OverviewProvider from "./store";
import NewsProvider from "../News/store";

import {BigRow, Column} from "./Overview.styles";
import Announcement from "../../models/Announcement";
import Announcements from "../Announcements/Announcements";
import RecentActivities from "../RecentActivity/RecentActivities";
// import {CookiesUtil} from "../../utils/CookiesUtil";
// import {Cookies} from "../../utils/Cookies";
const uuid  = require("react-uuid");


interface State {
    announcements: Announcement[];
}



let dummyAnnouncements = [
    new Announcement(uuid(),"Need new Technical Solutions Engineer to support Canada ISV. We’ve lost Raymond, Lauren, Andy in the past 3 months. Zero TSE replacements since then is impacting Canada ISV support", false),
    new Announcement(uuid(),"App approval team planning to reject all backlog beyond first 25, and ask for resubmission via enhanced portal with additional info for CCPA/GDPR\n", true)
];

export default class Overview extends Component<any, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
          announcements: dummyAnnouncements
        };
        this.deleteAnnouncements = this.deleteAnnouncements.bind(this);
    }

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

    addAnnouncement(announcement: Announcement): void {
        dummyAnnouncements.push(announcement);
    }

    renderAnnouncements(): React.ReactElement {
        const elements: any = [];
        let i = 0;
        this.state.announcements.forEach( announcement => {
            elements.push( <Announcements key={i} announcement={announcement} deleteAnnouncement={this.deleteAnnouncements}/>);
            i++;
        });
        return (<div>{elements}</div>);
    }

    deleteAnnouncements(id: string): void {
        let index = 0;
        if(this.state.announcements.length > 0) {
            for (let i = 0; i < this.state.announcements.length; i++) {
                if (this.state.announcements[i].id === id) {
                    index = i;
                }
            }
            this.setState({ announcements: this.state.announcements.slice(0, index).concat(this.state.announcements.slice(index + 1, this.state.announcements.length))});
        }
    }

    render(): React.ReactNode {
        return (
            <Column>
                    {this.renderAnnouncements()}
                    <OverviewProvider>
                        <WeeklyDigest />
                    </OverviewProvider>
                    <BigRow>
                        <AppApprovalsHistogram />
                    </BigRow>
                    <BigRow>
                        <NewsProvider>
                            <News />
                        </NewsProvider>
                        <BigCard title="App Approvals">
                            <AppApprovalsChart category="title" value="amount" />
                        </BigCard>
                    </BigRow>
                    <BigRow>
                        <RecentActivities/>
                        <BigCard />
                    </BigRow>
                    {/*<AppOverview appJson={singleResponse.data[0]}/>*/}
                </Column>
        );
    }
}
