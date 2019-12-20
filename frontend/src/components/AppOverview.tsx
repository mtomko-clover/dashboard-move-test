import styled from "styled-components";
import React, {Component} from "react";
import DataRow from "./DataRow";


interface AppOverviewProps {
    appJson: any
}

interface State {
    appUrl: string
    developerUrl: string,
    jiraUrl: string
}

const AppOverviewContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: left;
    background: white;
`;

export class AppOverview extends Component<AppOverviewProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            appUrl: "https://www.clover.com/internal/apps/" + this.props.appJson.uuid,
            developerUrl: "https://www.clover.com/internal/developers/" + this.props.appJson.developer_uuid,
            jiraUrl: "https://jira.dev.clover.com/browse/" + this.props.appJson.jira
        };
        console.log("app overview props", this.props);
    }

    render(): React.ReactNode {
        return (
            <AppOverviewContainer>
                <h2>[<a href={this.state.appUrl} target="_blank">{this.props.appJson.uuid}</a>] {this.props.appJson.name}</h2>
                <DataRow label="Developer Name" value={this.props.appJson.dev_name} link={false}/>
                <DataRow label="Developer Id" value={this.state.developerUrl} link={true} linkText={this.props.appJson.dev_uuid}/>
                <DataRow label="Developer Approval Status" value={this.props.appJson.dev_approval_status} link={false}/>
                <hr />
                <DataRow label="Package Name" value={this.props.appJson.package_name} link={false}/>
                <DataRow label="Site URL" value={this.props.appJson.site_url} link={true} linkText={this.props.appJson.site_url}/>
                <DataRow label="Application Id" value={this.props.appJson.application_id} link={false}/>
                <DataRow label="Privacy Policy" value={this.props.appJson.privacy_policy} link={true} linkText={this.props.appJson.privacy_policy}/>
                <DataRow label="EULA" value={this.props.appJson.eula} link={true} linkText={this.props.appJson.eula}/>
                <DataRow label="Approval Time" value={this.props.appJson.approval_status_modified_time} link={false}/>
                <DataRow label="First Submitted" value={this.props.appJson.first_submitted_time} link={false}/>
                <DataRow label="Created Time" value={this.props.appJson.created_time} link={false}/>
                <DataRow label="JIRA" value={this.state.jiraUrl} link={true} linkText={this.props.appJson.jira}/>
                <DataRow label="Owner" value={this.props.appJson.owner} link={false}/>
            </AppOverviewContainer>
        )
    }
}
