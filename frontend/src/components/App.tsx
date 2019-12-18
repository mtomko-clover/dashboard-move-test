import {notification} from "antd";
import axios from "axios";
import Cookie from "js-cookie";
import React, {Component} from "react";
import {Route, withRouter} from "react-router-dom";

import "./App.css";
import * as Constants from "../utils/Constants";
import {Environment, Environments} from "../utils/Environments";
import Header from "./Header";
import {SignIn} from "./SignIn";
import TeamDashboard from "./TeamDashboard";
import TimeTracker from "./TimeTracker";


interface State {
    sessionId: any
    environment: Environment
}

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
        this.props.history.push("/");
    };

    parentHandleSignIn = async (username: string, password: string, env: string) => {
        const environment = Environments.getFromShortTerm(env);
        this.setState({ environment: environment });

        const response = await axios({
            method: "post",
            url: `/login`,
            headers: { "Content-Type": "application/json" },
            data: {
                username,
                password,
                environment
            },
        });
        if (response.data.error) {
            this.showError("Login Error", response.data.error);
        } else {
            this.setState({sessionId: response.data.sessionId});
            this.props.history.push("/Home");
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
                <Header logout={this.logout} sessionId={this.state.sessionId} />
                <Route path="/" exact render={(props) => <SignIn {...props} parentHandleSignIn={this.parentHandleSignIn}/>}/>
                <Route path="/Home" component={TeamDashboard}/>
                <Route path="/TimeTracker" component={TimeTracker} />
            </div>
        );
    }

}

export default withRouter(App);
