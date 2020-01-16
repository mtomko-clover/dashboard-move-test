import {notification} from "antd";
import axios from "axios";
import Cookie from "js-cookie";
import React, {ReactElement, useState} from "react";
import {Route, RouteComponentProps, withRouter} from "react-router-dom";
import {ThemeProvider} from "styled-components";

import Header from "../Header";
import Overview from "../Overview";
import {SignIn} from "../SignIn";
import TimeTracker from "../TimeTracking/TimeTracker";
import Admin from "../AdminPage";

import * as Constants from "../../utils/Constants";
import {Environment, Environments} from "../../utils/Environments";
import {AppContainer} from './App.styles'
import {GlobalStyles, theme} from '../../styles'
import {EmployeeUtil} from "../../utils/EmployeeUtil";
import Employee from "../../models/Employee";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";
import {EMPLOYEE_ROLES} from "../../models/EmployeeRoles";

interface State {
    sessionId?: string | undefined;
    environment?: Environment;
    user?: Employee;
}

const App = ({ history }: RouteComponentProps): ReactElement => {
    const [state, setState] = useState({
        sessionId: Cookie.get(Constants.sessionIdCookieName),
        environment: Environments.getDefaultEnvironment(),
        user: new Employee("",EMPLOYEE_ROLES.NON_ADMIN,"")
    } as State);

    const logout = (): void => {
        Cookie.remove(Constants.sessionIdCookieName);
        setState({ sessionId: undefined });
        history.push("/");
    };

    const useSignIn = async (username: string, password: string, env: string): Promise<string | undefined> => {
        const environment = Environments.getFromShortTerm(env);
        setState({ environment });

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
            showError("Login Error", response.data.error);
        } else {
            const user = EmployeeUtil.getEmployeeFromUsername(username);
            CookiesUtil.setCookie(Cookies.USERNAME, username);
            setState({sessionId: response.data.sessionId, user: user});
            history.push("/Home");
        }

        return response.data.sessionId;
    };

    const showError = (title: string, body: string): void => {
        notification.open({
            message: title,
            description: body,
            icon: <i className="fas fa-exclamation-triangle"/>,
        });

    };

    return (
        <ThemeProvider theme={theme}>
            <AppContainer>
                <GlobalStyles />
                <Header logout={logout} sessionId={state.sessionId}/>
                <Route path="/" exact render={(props): ReactElement => <SignIn {...props} parentHandleSignIn={useSignIn}/>}/>
                <Route path="/Home" component={Overview}/>
                <Route path="/Admin" component={Admin}/>
                <Route path="/TimeTracker" component={TimeTracker} />
            </AppContainer>
        </ThemeProvider>
    );
}

export default withRouter(App);
