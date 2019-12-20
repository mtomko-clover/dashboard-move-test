import axios from "axios";
import React, {Component} from "react";
import styled from "styled-components";

import PieChart from "./PieChart";
import {Card} from "./Card";
import {AppOverview} from "./AppOverview";


interface State {
}

interface DashboardProps {
}

const Row = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Column = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
`;

const ChartContainer = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 650px;
`;

const singleResponse = {
    "status": "success",
    "page": 1,
    "page-size": 32767,
    "sort": [
        "name"
    ],
    "count": 1,
    "data": [
        {
            "key": "0YYDJSPRXWRSM",
            "uuid": "0YYDJSPRXWRSM",
            "name": "Ticket Sales and Redemptions ",
            "distribution": "PUBLIC",
            "video_url": null,
            "activation_url": null,
            "package_name": "net.tickett.ticket_sales_and_redemptions",
            "site_url": "https://tsr.tickett.net/web",
            "application_id": null,
            "filename_icon": "Adnroidtsrimg100x100.png_en_US_5117047644941971054.png",
            "privacy_policy": "https://www.tickett.net/privacy-policy/",
            "eula": "https://tickett.net/downloads/TicketSalesRedemptions_Terms.html",
            "approval_status_modified_time": "2019-08-29",
            "first_submitted_time": "2019-08-29",
            "created_time": "2019-08-29",
            "dev_uuid": "QWH5AMNE9KXQ2",
            "dev_name": "Tickett Enterprises Ltd",
            "dev_approval_status": "APPROVED",
            "jira": "DAA-725",
            "owner": "ricardo.ventura",
            "jira_status": "Open",
            "jira_dlv_logo": null,
            "jira_dlv_logo_status": null,
            "jira_dlv_privacy": null,
            "jira_dlv_privacy_status": null,
            "jira_dlv_eula": null,
            "jira_dlv_eula_status": null
        }
    ]
}

const multipleResponses = {
    "status": "success",
    "page": 1,
    "page-size": 3,
    "sort": [
        "name"
    ],
    "count": 166,
    "data": [
        {
            "key": "J0QCE8SPQES5R",
            "uuid": "J0QCE8SPQES5R",
            "name": "15-Minute Website",
            "distribution": "PUBLIC",
            "video_url": null,
            "activation_url": null,
            "package_name": null,
            "site_url": "https://clover.ecwid.com/",
            "application_id": null,
            "filename_icon": "EcwidSite_en_US_8159288510102379981.png",
            "privacy_policy": "https://www.ecwid.com/privacy-policy",
            "eula": "https://www.ecwid.com/terms-of-service",
            "approval_status_modified_time": "2019-09-05",
            "first_submitted_time": "2019-11-20",
            "created_time": "2019-09-05",
            "dev_uuid": "Z64XHS51QG7QY",
            "dev_name": "Ecwid Inc.",
            "dev_approval_status": "APPROVED",
            "jira": null,
            "owner": null,
            "jira_status": null,
            "jira_dlv_logo": null,
            "jira_dlv_logo_status": null,
            "jira_dlv_privacy": null,
            "jira_dlv_privacy_status": null,
            "jira_dlv_eula": null,
            "jira_dlv_eula_status": null
        },
        {
            "key": "70FHP92F6REVT",
            "uuid": "70FHP92F6REVT",
            "name": "360 Omnichannel Customer Acquisition",
            "distribution": "PUBLIC",
            "video_url": null,
            "activation_url": null,
            "package_name": "me.kingdon.swipe360",
            "site_url": "https://360.kingdon.me/admin/clover",
            "application_id": null,
            "filename_icon": "SwipeLoyalty200x200.png_6114099491601033235.png",
            "privacy_policy": "https://www.kingdon.me/privacy-policy/",
            "eula": "https://www.kingdon.me/terms-clover/",
            "approval_status_modified_time": "2018-02-02",
            "first_submitted_time": "2018-10-30",
            "created_time": "2018-02-02",
            "dev_uuid": "PD1S0T5HH2W1G",
            "dev_name": "Kingdon",
            "dev_approval_status": "APPROVED",
            "jira": "DAA-263",
            "owner": null,
            "jira_status": "Resolved",
            "jira_dlv_logo": null,
            "jira_dlv_logo_status": null,
            "jira_dlv_privacy": null,
            "jira_dlv_privacy_status": null,
            "jira_dlv_eula": null,
            "jira_dlv_eula_status": null
        },
        {
            "key": "GT5JQ2SN0V484",
            "uuid": "GT5JQ2SN0V484",
            "name": "AccuBar Interface",
            "distribution": "PUBLIC",
            "video_url": "//www.youtube.com/embed/KaUyMJT1XMQ",
            "activation_url": null,
            "package_name": null,
            "site_url": "https://accubar.tickett.net",
            "application_id": null,
            "filename_icon": "accubar.png_en_US_708078018531068709.png",
            "privacy_policy": "https://www.tickett.net/privacy-policy/",
            "eula": "https://tickett.net/downloads/AccubarInterface_Terms.html",
            "approval_status_modified_time": "2019-02-20",
            "first_submitted_time": "2019-02-20",
            "created_time": "2019-02-20",
            "dev_uuid": "QWH5AMNE9KXQ2",
            "dev_name": "Tickett Enterprises Ltd",
            "dev_approval_status": "APPROVED",
            "jira": "DAA-458",
            "owner": null,
            "jira_status": "Open",
            "jira_dlv_logo": null,
            "jira_dlv_logo_status": null,
            "jira_dlv_privacy": null,
            "jira_dlv_privacy_status": null,
            "jira_dlv_eula": null,
            "jira_dlv_eula_status": null
        }
    ]
};

export default class TeamDashboard extends Component<DashboardProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
        };

        this.runJoelsScript = this.runJoelsScript.bind(this);
    }

    getAppMetrics(): any {

        let appData = [ {
            "title": "Approved",
            "amount": 7
        }, {
            "title": "Rejected",
            "amount": 0
        }, {
            "title": "Awaiting Approval",
            "amount": 199
        }, {
            "title": "In Progress this Week",
            "amount": 28
        }, {
            "title": "Submitted",
            "amount": 1
        }];

        return appData;
    }

    //TODO rename
    runJoelsScript = async (appId: string) => {
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
    returnMultiple() : any {
        return "response";
    }

    componentDidMount(): void {
        // this.runJoelsScript("0YYDJSPRXWRSM");
        console.log("singleResponse", singleResponse);
        console.log("singleResponse.data", singleResponse.data);
    }

    render(): React.ReactNode {
        const fakeStat = {
            title: "from last week",
            type: "percentageUp",
            datum: 12
        }

        return (
            <Column>
                <Row>
                    <Card title="Apps Approved" datum={12} stat={fakeStat} />
                    <Card title="Apps Submitted" datum={199}/>
                    <Card title="Devs Approved" datum={8} />
                    <Card title="Devs Submitted" datum={17}/>
                    <Card title="Community Questions" datum={32} />
                    <Card title="Community Answers Accepted" datum={9} />
                </Row>
                <ChartContainer>
                    <h2>Apps</h2>
                    <PieChart data={this.getAppMetrics()} category={"title"} value={"amount"}/>
                </ChartContainer>
                <AppOverview appJson={singleResponse.data[0]}/>
            </Column>
        )
    }
}
