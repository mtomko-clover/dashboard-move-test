import { notification } from 'antd';
import axios from 'axios';
import Cookie from 'js-cookie';
import React, { ReactElement, useState } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Settings from '../Settings';
import Header from '../Header';
import Overview from '../Overview';
import { SignIn } from '../SignIn';

import * as Constants from '../../utils/Constants';
import { Environment, Environments } from '../../utils/Environments';
import { EmployeeUtil } from '../../utils/EmployeeUtil';
import { CookiesUtil } from '../../utils/CookiesUtil';
import { Cookies } from '../../utils/Cookies';
import Employee from '../../models/Employee';
import { EMPLOYEE_ROLES } from '../../models/EmployeeRoles';
import AnnouncementProvider from '../Announcements/store';
import { AppContainer } from './App.styles';
import { GlobalStyles, theme } from '../../styles';

interface State {
  sessionId?: string | undefined;
  environment?: Environment;
  user?: Employee;
}

const App = ({ history }: RouteComponentProps): ReactElement => {
  const [state, setState] = useState({
    sessionId: Cookie.get(Constants.sessionIdCookieName),
    environment: Environments.getDefaultEnvironment(),
    user: new Employee('', EMPLOYEE_ROLES.NON_ADMIN, ''),
  } as State);

  const logout = (): void => {
    Cookie.remove(Constants.sessionIdCookieName);
    setState({ sessionId: undefined });
    history.push('/');
  };

  const useSignIn = async (
    username: string,
    password: string,
    env: string,
  ): Promise<string | undefined> => {
    const environment = Environments.getFromShortTerm(env);
    setState({ environment });

    const response = await axios({
      method: 'post',
      url: `/login`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        username,
        password,
        environment,
      },
    });

    if (response.data.error) {
      showError('Login Error', response.data.error);
    } else {
      const user = EmployeeUtil.getEmployeeFromUsername(username);
      CookiesUtil.setCookie(Cookies.USERNAME, username);
      setState({ sessionId: response.data.sessionId, user: user });
      history.push('/home');
    }

    return response.data.sessionId;
  };

  const showError = (title: string, body: string): void => {
    notification.open({
      message: title,
      description: body,
      icon: <i className="fas fa-exclamation-triangle" />,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <GlobalStyles />
        <Header logout={logout} sessionId={state.sessionId} />
        <Route
          path="/"
          exact
          render={(props): ReactElement => <SignIn {...props} signIn={useSignIn} />}
        />
        <Route path="/home" component={Overview} />
        <AnnouncementProvider>
          <Route path="/settings" component={Settings} />
        </AnnouncementProvider>
      </AppContainer>
    </ThemeProvider>
  );
};

export default withRouter(App);
