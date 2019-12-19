import {Dropdown, Icon, Menu} from "antd";
import {ClickParam} from "antd/es/menu";
import React, {ChangeEvent, Component} from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from "styled-components";

import {Environment, Environments} from "../utils/Environments";
import {Cookies} from "../utils/Cookies";
import {CookiesUtil} from "../utils/CookiesUtil";

interface State {
    username: string,
    password: string,
    environment: string
}

interface SignInProps extends RouteComponentProps {
    parentHandleSignIn:(username: string, password: string, env: string) => any;
}

// const Row = styled.div`
//     padding: 10px;
//     display: flex;
//     flex-direction: row;
//     align-items: center;
// `;

const Login = styled.div`
    width: 300px;
    margin: AUTO;
    margin-top: 10%;
`;

const LoginInput = styled.input`
    border-radius: 5px;
    height: 50px;
    width: 300px;
    text-align: center;
    padding-left: 10px;
    margin-bottom: 15px;
    font-size: 20px;
`;


export default class SignIn extends Component<SignInProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: "",
            environment: "dev1"
        };
        let signedIn = CookiesUtil.getCookie(Cookies.SESSION_ID);
        if (signedIn) {
            this.props.history.push("/TimeTracker");
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleUsernameChange(e: ChangeEvent<any>): void {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e: ChangeEvent<any>): void {
        this.setState({password: e.target.value});
    }

    handleLogin(e: ChangeEvent<any>): void {
        console.log("handleLogin Clicked");
        this.props.parentHandleSignIn(this.state.username, this.state.password, this.state.environment).then((data: any) => {
            // console.log("logged in");
                // console.log(data);
            }
        );
    }

    environmentsDropdown(): React.ReactElement {
        const elements: any = [];
        Environments.getEnvironments().forEach(env => {
            const menuItem = <Menu.Item className="login-dropdown-element" key={env.shortTerm} onClick={this.setEnvTarget}>{env.shortTerm}</Menu.Item>;
            elements.push(menuItem);
        });

        return <Menu>{elements}</Menu>;
    };

    setEnvTarget = (e: ClickParam) => {
        Environments.getEnvironments().forEach((env: Environment) => {
            if (env.shortTerm === e.key) {
                this.setState({environment: env.shortTerm});
            }
        });
    };

    render(): React.ReactNode {
        return (
            <Login>
                <div className="padding-before">
                    <h1 className="center-text">Login</h1>
                    <h3 className="center-text">Please use your LDAP credentials</h3>
                </div>
                <LoginInput placeholder="username" type="text" value={this.state.username} onChange={this.handleUsernameChange}/>
                <LoginInput placeholder="password" type="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                <Dropdown overlay={this.environmentsDropdown()}>
                    <button className="login-dropdown">
                        {this.state.environment} <Icon type="down"/>
                    </button>
                </Dropdown>
                <button className="login-dropdown blue-background" key="login" onClick={this.handleLogin}>
                    <b>Login</b>
                </button>
            </Login>
        )
    }
}
