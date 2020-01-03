import React, {ReactElement} from "react";
import {Link} from "react-router-dom";

import logo from "../../static/clover-logo.png";
import {HeaderContainer, LogoutButton} from "./Header.styles";


type HeaderProps = {
	logout: () => void;
	sessionId: string;
}

const Header = ({ logout, sessionId }: HeaderProps): ReactElement => (
	<HeaderContainer>
		<img alt="Clover Logo" src={logo} />
		<Link className="header_title" to="/Home">
		Developer Relations
		</Link>
		{sessionId && (
		<Link className="time_tracking" to="/TimeTracker">
			Time Tracking
		</Link>
		)}
		{sessionId && (
		<LogoutButton onClick={logout}>
			<i className="fas fa-sign-in-alt margin-after" />
			Logout
		</LogoutButton>
		)}
	</HeaderContainer>
);

export default Header;
