import * as React from "react";
import {ChangeEvent, Component} from "react";
import {ColumnProps} from "antd/lib/table";
import styled from "styled-components";
import {Table, Button} from "antd";
import axios from 'axios';
import './App.css';
// @ts-ignore
import CSVReader from 'react-csv-reader'
import Cookie from 'js-cookie';
import * as Constants from '../utils/Constants';
import {Environment} from "../utils/Enviornments";
import {UploadBulkUploadResults} from "./UploadBulkUploadResults";

const papaparseOptions: any = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
};

const IdRow = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    font-size: 20px;
    align-items: center;
`;

const UploadAppContainer = styled.div`
    padding: 30px;
`;

const UploadRow = styled.div`
    margin-right: 10px;
    font-size: 20px;
`;

const BackToUploadButton = styled.button`
    margin-left: 30px;
  
`;

let merchantColumns: ColumnProps<any>[] = [];

interface UploadAppProps {
    environment: Environment;
}


interface State {
    appId: string,
    subscriptionId: string,
    results: any,
    showTable: boolean
    successes: any,
    failures: any,
    resultsLoaded: boolean,
    showHint: boolean
}

export class UploadApp extends Component<UploadAppProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            appId: "",
            subscriptionId: "",
            results: [],
            showTable: false,
            successes: null,
            failures: null,
            resultsLoaded: false,
            showHint: false
        };

        this.handleAppIdChange = this.handleAppIdChange.bind(this);
        this.handleSubscriptionIdChange = this.handleSubscriptionIdChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.installApps = this.installApps.bind(this);
        this.formatDataForCall = this.formatDataForCall.bind(this);
        this.canInstall = this.canInstall.bind(this);
        this.editUUID = this.editUUID.bind(this);
        this.showHint = this.showHint.bind(this);
        this.hideHint = this.hideHint.bind(this);
        this.backToUpload = this.backToUpload.bind(this);

        merchantColumns = [
            {
                title: 'Merchant Name',
                dataIndex: 'Business Name', //name of json element
                key: 'BusinessName',
            },
            {
                title: 'Merchant Id',
                dataIndex: 'UUID', //name of json element
                key: 'UUID',
                render: UUID => <div onClick={() => this.editUUID(UUID)}>{UUID}</div>
            }
        ];
    }

    handleAppIdChange(e: ChangeEvent<any>): void {
        this.setState( {appId: e.target.value});
    }

    handleSubscriptionIdChange(e: ChangeEvent<any>): void {
        this.setState( {subscriptionId: e.target.value});
    }

    handleFileUpload(result: any){
        let i = 0;
        let keys = Object.keys(result[0]);
        console.log("keys", keys);
        result.forEach((key: any) => {
            key['key'] = i;
            i++;
        });
        this.setState( { results: result, showTable: true });
    }

    formatDataForCall(): object {
        let elements: any[] = [];
        this.state.results.forEach( (key: any) => {
            let merchant: any = {};
            merchant["merchant"] = {"id" : key['UUID']};
            merchant["subscriptionId"] = this.state.subscriptionId;
            elements.push(merchant);
        });
        let json = {
            "elements": elements
        };
        console.log("json", json);
        return json;
    }

    editUUID(UUID: any){
        console.log("edit UUID called for "+ UUID);
        console.log("results", this.state.results);
        let updatedResults = [];
        this.state.results.forEach( (key: any) => {
            console.log("key", key);
        });
    }

    installApps = async (e: ChangeEvent<any>) => {
        const json = this.formatDataForCall();
        const sessionId = Cookie.get(Constants.sessionIdCookieName);
        const response = await axios({
            method: 'post',
            url: '/bulk_install',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sessionId: sessionId,
                appId: this.state.appId,
                merchantList: json,
                environment: this.props.environment
            }
        });
        console.log("bulk install response", response);
        const successes = response.data.success;
        const failures = response.data.failure;
        this.setState({successes: response.data.success, failures: response.data.failure, resultsLoaded: true});
        console.log("success", successes);
        console.log("failure", failures);
    };

    canInstall(): boolean {
        return (this.state.appId.length < 1 || this.state.subscriptionId.length < 1 || this.state.results.length < 1);
    }

    showHint(){
        console.log("hint");
        this.setState({showHint: true});
    }

    hideHint(){
        this.setState({showHint: false});
    }

    backToUpload(){
        this.setState({
            appId: "",
            subscriptionId: "",
            results: [],
            showTable: false,
            successes: null,
            failures: null,
            resultsLoaded: false,
            showHint: false});
    }

    render(): React.ReactNode {
        const loginHeader = (
            <UploadRow>Upload Merchant List:</UploadRow>
        );
        let canInstall = this.canInstall();
        return(
            <div>
                {!this.state.resultsLoaded &&
                <UploadAppContainer>
                    <IdRow>
                        <div className="margin-after">App Id:</div>
                        <input type="text" value={this.state.appId} onChange={this.handleAppIdChange}/>
                    </IdRow>
                    <IdRow>
                        <div className="margin-after">Subscription Id:</div>
                        <input type="text" value={this.state.subscriptionId}
                               onChange={this.handleSubscriptionIdChange}/>
                    </IdRow>
                    <div className="row">
                        <CSVReader
                            cssClass="csv-reader-input"
                            cssInputClass="css-input"
                            label={loginHeader}
                            onFileLoaded={this.handleFileUpload}
                            inputStyle={{display: 'flex', flexDirection: 'row'}}
                            parserOptions={papaparseOptions}/>
                        <i className="fas fa-question-circle margin-before" onMouseOver={this.showHint} onMouseLeave={this.hideHint}/>
                        {this.state.showHint &&
                        <div className="margin-before">CSV file must have column names "Business Name" and "UUID"</div>
                        }
                    </div>
                    {this.state.showTable &&
                    <Table className="margin-below"
                           columns={merchantColumns}
                           dataSource={this.state.results}
                           pagination={false}/>
                    }
                    <IdRow>
                        <Button className="install-app-button" onClick={this.installApps} disabled={canInstall} size="large">Install App</Button>
                    </IdRow>
                </UploadAppContainer>
                }
                {this.state.resultsLoaded &&
                <div>
                    <UploadBulkUploadResults successes={this.state.successes} failures={this.state.failures} appId={this.state.appId} subscriptionId={this.state.subscriptionId}/>
                    <BackToUploadButton className="ba" onClick={this.backToUpload}><i className="fas fa-chevron-left margin-after"/>Back to Bulk Upload</BackToUploadButton>
                </div>
                }
            </div>

        )
    }

}
