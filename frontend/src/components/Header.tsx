import React from "react"
import {Link} from "react-router-dom";
import styled from "styled-components";

import logo from "../static/clover-logo.png";


type HeaderProps = {
  logout: () => void
  sessionId: string
}

const Header = ({ logout, sessionId }: HeaderProps) => {
  const LogoutButton = styled.button`
    padding: 10px;
    border-radius: 5px;
  `;

  return (
    <div className="header">
      <img alt="" className="image-as-icon margin-after" src={logo} />
      <Link className="header_title" to="/Home">
        DevRel Dashboard
      </Link>
      {sessionId && (
        <Link className="time_tracking" to="/TimeTracker">
          Time Tracking
        </Link>
      )}
      <div className="filler" />
      {sessionId && (
        <LogoutButton onClick={logout}>
          <i className="fas fa-sign-in-alt margin-after" />
          Logout
        </LogoutButton>
      )}
    </div>
  )
}

export default Header
