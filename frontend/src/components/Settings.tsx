import React, { ReactElement, useContext } from 'react';

import { EmployeeUtil } from '../utils/EmployeeUtil';
import { EMPLOYEE_ROLES } from '../models/EmployeeRoles';
import { CookiesUtil } from '../utils/CookiesUtil';
import { Cookies } from '../utils/Cookies';
// import { fetchAnnouncementItems } from "../utils/queries";
// import { useQuery } from "@apollo/react-hooks";
import CreateAnnouncement from './Announcements/CreateAnnouncement';
import { AnnouncementContext } from './Announcements/store';
import styled from "styled-components";
import { Button } from "antd";

const user = EmployeeUtil.getEmployeeFromUsername(CookiesUtil.getCookie(Cookies.USERNAME));

const SettingsContainer = styled.div`
     width: 80%;
`;

const SettingsHeader = styled.div`
  font-weight: bold;
  font-size: 28px;
  margin-top: 50px;
`;

const SettingsSection = styled.div`
      padding: 20px;
      display: flex;
      flex-direction: column;
`;

const SectionHeader = styled.div`
     font-size: 18px;
     font-weight: bold;
`;

const SectionContent = styled.div`
    margin-left: 20px;
`;



const Settings = (): ReactElement => {
  const {
    modal: { toggleModal, visible },
  } = useContext(AnnouncementContext);

  // if (!CookiesUtil.getCookie(Cookies.SESSION_ID)) {  //if not signed in show login
  //     history.push("/");
  // }
  // const { data, error, loading } = useQuery(fetchAnnouncementItems, {});
  // console.log("annoucementData", data);

  return (
    <SettingsContainer>
      {visible && <CreateAnnouncement />}
      {user.role === EMPLOYEE_ROLES.ADMIN ? (
        <div>
            <SettingsHeader>Admin Settings</SettingsHeader>
            <SettingsSection>
                <SectionHeader>Announcements</SectionHeader>
                <SectionContent><Button onClick={(): void => toggleModal({ visible: !visible })}>Add Annoucement</Button></SectionContent>
            </SettingsSection>
        </div>
      ) : (
        <div>
            <SettingsHeader>Settings</SettingsHeader>
            YOU ARE NOT AN ADMIN ¯\_(ツ)_/¯
            <p>check back soon for more features</p>
        </div>
      )}
    </SettingsContainer>
  );
};

export default Settings;
