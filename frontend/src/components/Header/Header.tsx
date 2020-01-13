import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {Menu, Dropdown} from "antd";

import logo from "../../static/clover-logo.png";
import {HeaderContainer, UsernameContainer, ProfilePictureContainer, FullNameContainer} from "./Header.styles";

type HeaderProps = {
    logout: () => void;
    sessionId: string | undefined;
    username: string | undefined;
    profilePic?: any;
}

const Header = ({ logout, sessionId, username, profilePic }: HeaderProps): ReactElement => {
    const menu = (
        <Menu>
            <Menu.Item>
                <div className="row" onClick={logout}>
                    <i className="fas fa-sign-in-alt font_icon" />
                    Logout
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <HeaderContainer>
            <img id="logo" alt="Clover Logo" src={logo} />
            <Link className="header_title" to="/Home">
                Developer Relations
            </Link>
            {sessionId && (
                <Link className="header_link" to="/TimeTracker">
                    Time Tracking
                </Link>
            )}
            {sessionId && (
                <Dropdown overlay={menu} className="align-end">
                    <UsernameContainer className="ant-dropdown-link" href="#">
                        {profilePic && <ProfilePictureContainer src={profilePic} />}
                        <FullNameContainer>{username}</FullNameContainer>
                    </UsernameContainer>
                </Dropdown>
            )}
            {!sessionId && <div className="filler"/>}
            {/* ^^ to push login to the end*/}
            {!sessionId && (
                <Link className="header_link align-text-end" to="/">
                    Login
                </Link>
            )}
        </HeaderContainer>
    )
};

export default Header;