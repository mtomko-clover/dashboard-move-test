import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {Dropdown, Menu} from "antd";
import logo from "../../static/clover-logo.png";
import {
    FullNameContainer,
    HeaderContainer,
    LogoutButton,
    ProfilePictureContainer,
    UsernameContainer
} from "./Header.styles";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";
import {EmployeeUtil} from "../../utils/EmployeeUtil";

type HeaderProps = {
    logout: () => void;
    sessionId: string | undefined;
}


const Header = ({ logout, sessionId }: HeaderProps): ReactElement => {
    const menu = (
        <Menu>
            <Menu.Item>
                <div className="row" onClick={logout}>
                    <i className="fas fa-sign-in-alt font_icon" />
                    Logout
                </div>
            </Menu.Item>
            <Menu.Item>
                <Link to="/Admin">Admin Settings</Link>
            </Menu.Item>
        </Menu>
    );
    const username = CookiesUtil.getCookie(Cookies.USERNAME);
    const user = EmployeeUtil.getEmployeeFromUsername(username);
    const name = user.fullName.length > 0 ? user.fullName : user.username;

    return (
        <HeaderContainer>
            <img id="logo" alt="Clover Logo" src={logo} />
            <Link className="header_title" to="/Home">
                Developer Relations
            </Link>
            {/* {sessionId && (
                <Link className="header_link" to="/TimeTracker">
                    Time Tracking
                </Link>
            )} */}
            {sessionId && username && (
                <Dropdown overlay={menu} className="align-end">
                    <UsernameContainer className="ant-dropdown-link" href="#">
                        {user.image && <ProfilePictureContainer src={user.image} />}
                        <FullNameContainer>{name}</FullNameContainer>
                    </UsernameContainer>
                </Dropdown>)}
            {sessionId && !username && <LogoutButton onClick={logout}>Logout</LogoutButton>}
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