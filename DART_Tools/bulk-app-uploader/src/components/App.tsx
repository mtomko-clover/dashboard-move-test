import React from 'react';
import './App.css';
import axios from 'axios';
import {Component} from 'react';
import {notification} from 'antd';
import Cookie from 'js-cookie';
import * as Constants from '../utils/Constants';
import * as Session from '../utils/Session';
import {UploadApp} from "./UploadApp";
import {SignIn} from "./SignIn";
import {Environments, Environment} from "../utils/Enviornments";
import styled from "styled-components";

interface State {
    sessionId: any
    environment: Environment
}

const LogoutButton = styled.button`
    padding: 10px;
`;

const AppHeader = styled.div`
    display: flex;
    justify-content: right;
    flex-direction: row;
    background: var(--color-darkest);
    padding: 10px;
`;

export class App extends Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            sessionId: Cookie.get(Constants.sessionIdCookieName),
            environment: Environments.getDefaultEnvironment()
        };
        this.logout = this.logout.bind(this);
        this.parentHandleSignIn = this.parentHandleSignIn.bind(this);
        this.showError = this.showError.bind(this);
    }

    logout = () => {
        Cookie.remove(Constants.sessionIdCookieName);
        this.setState({ sessionId: undefined });
    };

    parentHandleSignIn = async (username: string, password: string, env: string) => {
        const environment = Environments.getFromShortTerm(env);
        this.setState({ environment: environment });
        const response = await axios({
            method: 'post',
            url: `/login`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                username,
                password,
                environment
            },
        });
        if(response.data.error){
            this.showError("Login Error", response.data.error);
        }
        else {
            this.setState({sessionId: response.data.sessionId});
        }

        return response.data.sessionId;
    };

     showError(title: string, body: string) : void {
        notification.open({
            message: title,
            description: body,
            icon: <i className="fas fa-exclamation-triangle"/>,
        });
    };


    render(): React.ReactNode {
        return (
            <div className="App">
                <AppHeader className="App-header">
                    <i className="fas fa-bullseye fa-3x margin-after white-text"/>
                    <h1 className="white-text no-margin">Bulk App Uploader</h1>
                    <div className="filler"/>
                    {this.state.sessionId &&
                    <LogoutButton onClick={this.logout}>
                        <i className="fas fa-sign-in-alt margin-after"/>
                        Logout
                    </LogoutButton>}
                </AppHeader>
                {!this.state.sessionId && <SignIn parentHandleSignIn={this.parentHandleSignIn}/>}

                {this.state.sessionId &&
                <div>
                    <UploadApp environment={this.state.environment}/>
                </div>}
            </div>
        );
    }
}

export default App;
