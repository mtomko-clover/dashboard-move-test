import {Dropdown, Menu} from "antd";
import {ClickParam} from "antd/es/menu";
import React, {ChangeEvent, KeyboardEvent, useEffect, useState, ReactElement} from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from "styled-components";

import {Environment, Environments} from "../../utils/Environments";
// import {Cookies} from "../../utils/Cookies";
// import {CookiesUtil} from "../../utils/CookiesUtil";

interface UserState {
    username: string;
    password: string;
}

interface SignInProps extends RouteComponentProps {
    parentHandleSignIn: (username: string, password: string, env: string) => Promise<string | undefined>;
}

const Login = styled.div`
    width: 300px;
    margin: auto;
    margin-top: 10%;

    .login-button {
        width: 300px;
        height: 50px;
        font-size: 20px;
        padding-left: 10px;
        margin-top: 15px;
        border-radius: 5px;
    }
    
    .blue-background {
        background: #1890FF;
        color: white;
    }

    .ant-btn-group {
        button {
            height: 50px;
        }
       
        span {
            text-align: left;
            width: 234px;
            margin-top: -1px;
            font-family: Maison Mono !important;
            font-weight: 400;
            font-size: 12px;
        }
    }
`;

const Heading = styled.div`
    display: flex;
    flex-direction: row;

    h1 {
        margin-right: 10px;
        font-size: 20px;
        font-weight: 900;
    }

    h3 {
        font-size: 20px;
        font-weight: 400;
        color: #595959;
    }
`;

const LoginInput = styled.input`
    height: 50px;
    width: 300px;
    text-align: left;
    padding-left: 15px;
    margin-bottom: 15px;
    font-family: Maison Mono;
    font-size: 14px;
    background: white;
    border-radius: 5px;
    border: none;
    box-shadow: ${({ theme }): string => theme.boxShadow};
`;


const SignIn = ({ parentHandleSignIn }: SignInProps): ReactElement => {
    let usernameInput: HTMLInputElement | null = null;
    const [user, setUser] = useState<UserState>({
        username: "",
        password: ""
    });
    const [environment, setEnvironment] = useState<string>("us");
    const { password, username } = user;

    // const signedIn = CookiesUtil.getCookie(Cookies.SESSION_ID);
    // if (signedIn) {
    //     props.history.push("/TimeTracker");
    // }

    useEffect(() => {
        if (usernameInput) usernameInput.focus()
    }, [])

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (username && e.key === "Enter") {
            parentHandleSignIn(username, password, environment)
        }
    };

    const handleInputChange = (e: { target: HTMLInputElement }): void => {
        setUser({ ...user, [e.target.placeholder]: e.target.value });
    };

    const useLogin = (e: ChangeEvent<any>): void => {
        if (username) {
            parentHandleSignIn(username, password, environment).then((data: any) => {
                // console.log("logged in");
                    // console.log(data);
                }
            );
        }
    };

    const setEnvTarget = (e: ClickParam): void => {
        Environments.getEnvironments().forEach((env: Environment) => {
            if (env.shortTerm === e.key) {
                setEnvironment(env.shortTerm);
            }
        });
    };

    const environmentsDropdown: React.ReactElement = (
        <Menu>
            {Environments.getEnvironments().map(env =>
                <Menu.Item key={env.shortTerm} onClick={setEnvTarget}>
                    {env.shortTerm}
                </Menu.Item>)
            }
        </Menu>
    );

    return (
        <Login>
            <Heading>
                <h1>Login</h1>
                <h3>(use LDAP credentials)</h3>
            </Heading>
            <LoginInput
                placeholder="username"
                type="text"
                value={username}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                ref={input => { usernameInput = input }}
            />
            <LoginInput placeholder="password" type="password" value={password} onChange={handleInputChange} onKeyDown={handleKeyPress} />
            <Dropdown.Button overlay={environmentsDropdown}>{environment}</Dropdown.Button>
            <button className="login-button blue-background" key="login" onClick={useLogin}>
                <b>Login</b>
            </button>
        </Login>
    )
};

export default SignIn;
