import {notification} from "antd";
import axios from "axios";
import Cookie from "js-cookie";
import React, {Component} from "react";
import {Link, Route, withRouter} from "react-router-dom";
import {ThemeProvider} from "styled-components";

import Header from "../Header";
import Overview from "../Overview";
import SignIn from "../SignIn";
import TimeTracker from "../TimeTracker";

import * as Constants from "../../utils/Constants";
import {Environment, Environments} from "../../utils/Environments";
import {AppContainer} from './App.styles'
import {GlobalStyles, theme} from '../../styles'


interface State {
    sessionId: any
    environment: Environment
    username: string
}

export class App extends Component<any, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            sessionId: Cookie.get(Constants.sessionIdCookieName),
            environment: Environments.getDefaultEnvironment(),
            username: "none"
        };
        this.logout = this.logout.bind(this);
        this.parentHandleSignIn = this.parentHandleSignIn.bind(this);
        this.showError = this.showError.bind(this);
        this.generateUsername = this.generateUsername.bind(this);
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
            this.setState({sessionId: response.data.sessionId, username: username});
            this.props.history.push("/Home");
        }

        return response.data.sessionId;
    };

    showError(title: string, body: string): void {
        notification.open({
            message: title,
            description: body,
            icon: <i className="fas fa-exclamation-triangle"/>,
        });

    };

    generateUsername() : React.ReactElement {
        if(this.state.username === "none"){
            return  (<Link className="header_link" to="/">
                Login
            </Link>);
        } else {
            let imageLocation = EmployeeUtil.getEmployeeImage(this.state.username);
            return (<div>
                <img src={imageLocation} />
            </div>)
        }
    }

    render(): React.ReactNode {
        return (
            <ThemeProvider theme={theme}>
                <AppContainer>
                    <GlobalStyles />
                    <Header logout={this.logout} sessionId={this.state.sessionId} username={this.generateUsername()}/>
                    <Route path="/" exact render={(props) => <SignIn {...props} parentHandleSignIn={this.parentHandleSignIn}/>}/>
                    <Route path="/Home" component={Overview}/>
                    <Route path="/TimeTracker" component={TimeTracker} />
                </AppContainer>
            </ThemeProvider>
        );
    }

}

export default withRouter(App);
