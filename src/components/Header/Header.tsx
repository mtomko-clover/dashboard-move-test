import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Menu } from 'antd';
import logo from '../../static/clover-logo.png';
import {
  FullNameContainer,
  HeaderContainer,
  MenuItemRow,
  ProfilePictureContainer,
  UsernameContainer,
} from './Header.styles';
import { CookiesUtil } from '../../utils/CookiesUtil';
import { Cookies } from '../../utils/Cookies';
import { EmployeeUtil } from '../../utils/EmployeeUtil';

type HeaderProps = {
  logout: () => void;
  sessionId: string | undefined;
};

const Header = ({ logout, sessionId }: HeaderProps): ReactElement => {
  const menu = (
    <Menu style={{ width: '150px' }}>
      <Menu.Item>
        <MenuItemRow>
          <Icon type="setting" />
          <Link to="/settings">Settings</Link>
        </MenuItemRow>
      </Menu.Item>
      <Menu.Item>
        <MenuItemRow onClick={logout}>
          <Icon type="logout" />
          Logout
        </MenuItemRow>
      </Menu.Item>
    </Menu>
  );
  const username = CookiesUtil.getCookie(Cookies.USERNAME);
  const user = EmployeeUtil.getEmployeeFromUsername(username);
  const name = user.fullName.length > 0 ? user.fullName : user.username;

  return (
    <HeaderContainer>
      <img id="logo" alt="Clover Logo" src={logo} />
      <Link className="header-title" to="/home">
        Developer Relations
      </Link>
      {sessionId && (
        <Dropdown overlay={menu} className="header-dropdown">
          <UsernameContainer className="ant-dropdown-link" href="#">
            {user.image && <ProfilePictureContainer src={user.image} />}
            <FullNameContainer>{name}</FullNameContainer>
          </UsernameContainer>
        </Dropdown>
      )}
    </HeaderContainer>
  );
};

export default Header;
