import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import { Menu, Dropdown} from "antd";
import logo from "../../static/clover-logo.png";
import {HeaderContainer, LogoutButton,  UsernameContainer, ProfilePictureContainer, FullNameContainer} from "./Header.styles";
type HeaderProps = {
    logout: () => void
    sessionId: string
    username: string
    profilePic?: any
}
const Header = ({ logout, sessionId, username, profilePic}: HeaderProps) => {
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
                <Dropdown overlay={menu}>
                    <UsernameContainer className="ant-dropdown-link" href="#">
                        {profilePic && <ProfilePictureContainer src={profilePic} />}
                        <FullNameContainer>{username}</FullNameContainer>
                    </UsernameContainer>
                </Dropdown>
            )}
            {!sessionId && (
                <div></div> //this is a filler so login goes at the end
            )}
            {!sessionId && (
                <Link className="header_link" to="/">
                    Login
                </Link>
            )}
        </HeaderContainer>
    )};
export default Header