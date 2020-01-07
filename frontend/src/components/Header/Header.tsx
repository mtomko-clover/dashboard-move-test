import React, {ReactElement} from "react";
import {Link} from "react-router-dom";

import logo from "../../static/clover-logo.png";
import {HeaderContainer, LogoutButton} from "./Header.styles";


type HeaderProps = {
    logout: () => void
    sessionId: string
    username: React.ReactElement
}



const Header = ({ logout, sessionId, username }: HeaderProps) => (
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
            <LogoutButton onClick={logout}>
                <i className="fas fa-sign-in-alt margin-after" />
                Logout
            </LogoutButton>
        )}
        {username}
    </HeaderContainer>
);

export default Header
