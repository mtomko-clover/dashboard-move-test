import {Component} from "react";
import * as React from "react";
import styled from "styled-components";


const UploadResults = styled.div`
    padding: 30px;
`;

const SuccessfulMerchants = styled.div`
    padding: 10px;
    width: 500px;
    border: 3px solid var(--color-success);
    margin-bottom: 20px;
`;

const FailedMerchants = styled.div`
    padding: 10px;
    width: 500px;
    border: 3px solid var(--color-failure);
`;

interface UploadResultProps {
    successes: any,
    failures: any,
    appId: string,
    subscriptionId: string
}

export class UploadBulkUploadResults extends Component<UploadResultProps, any>{

    constructor(props: any) {
        super(props);
        // this.state = {
        // };
    }

    showSuccessfulMerchants(): React.ReactElement{
        let elements: any[] = [];
        this.props.successes.elements.forEach((merchant: any) => {
            console.log(merchant);
            const merchantDiv = <div key={merchant.app.merchant.id} className="merchant-results">{merchant.app.merchant.id}</div>;
            elements.push(merchantDiv);
        });
        return (
            <SuccessfulMerchants>
                <h3><i className="fas fa-check success-icon margin-after"/> Successful Merchants</h3>
                {elements}
            </SuccessfulMerchants>
        );
    }

    showFailedMerchants(): React.ReactElement {
        let elements: any[] = [];
        this.props.successes.elements.forEach((merchant: any) => {
            console.log(merchant);
            const merchantDiv = <div key={merchant.app.merchant.id} className="merchant-results">{merchant.app.merchant.id}</div>;
            elements.push(merchantDiv);
        });
        return (
            <FailedMerchants>
                <h3><i className="fas fa-times failure-icon"/> Failed Merchants</h3>
                {elements}
            </FailedMerchants>
        );
    }

    render(): React.ReactNode {

        let showSuccess = this.props.successes.count > 0;
        let showFailure = this.props.failures.count > 0;

        return(
            <UploadResults>
                <h1>App: {this.props.appId} with Subscription Id: {this.props.subscriptionId}</h1>
                <h2>Successful Installs: {this.props.successes.count} Failed Installs: {this.props.failures.count}</h2>
                {showSuccess &&
                <div>
                    {this.showSuccessfulMerchants()}
                </div>
                }
                {showFailure &&
                <div>
                    {this.showFailedMerchants()}
                </div>
                }
            </UploadResults>
        )
    }
}