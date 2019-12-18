import React from 'react';
import {notification} from 'antd';
import {BrowserRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Cookie from 'js-cookie';
import {Component} from 'react';
import * as Constants from '../utils/Constants';
import {Environment, Environments} from "../utils/Enviornments";
import styled from "styled-components";
import {SignIn} from "./SignIn";
import TimeTracker from "./TimeTracker";
import TeamDashboard from "./TeamDashboard";
import createHistory from "history/createBrowserHistory"
import logo from "../static/clover-logo.png";


interface State {
    sessionId: any
    environment: Environment
}

const LogoutButton = styled.button`
    padding: 10px;
    border-radius: 5px;
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
        const history = createHistory();
        Cookie.remove(Constants.sessionIdCookieName);
        this.setState({ sessionId: undefined });
        history.push("/login");
    };

    parentHandleSignIn = async (username: string, password: string, env: string) => {
        const environment = Environments.getFromShortTerm(env);
        this.setState({ environment: environment });
        const history = createHistory();
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
            history.push("/Home");
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
                <div className="header">
                    <img className="image-as-icon margin-after" src={logo} />
                    <Router forceRefresh={true}>
                    <Link className="header_title" to="/Home">DevRel Dashboard</Link>
                    {this.state.sessionId &&
                    <Link className="time_tracking" to="/TimeTracker">Time Tracking</Link>
                    }
                    </Router>
                    <div className="filler"/>
                    {this.state.sessionId &&
                    <LogoutButton onClick={this.logout}>
                        <i className="fas fa-sign-in-alt margin-after"/>
                        Logout
                    </LogoutButton>}
                </div>
                <Router forceRefresh={true}>
                    <Switch>
                        <Route path="/login" render={(props) => <SignIn {...props} parentHandleSignIn={this.parentHandleSignIn}/>}/>
                        <Route path="/Home" component={TeamDashboard}/>
                        <Route path="/TimeTracker" component={TimeTracker} />
                        <Redirect from={"*"} to={"/login"}/>
                    </Switch>
                </Router>
            </div>
        );
    }

}

export default App;
