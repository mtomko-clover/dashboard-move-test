import React, { ReactElement, useContext } from 'react';

import { EmployeeUtil } from '../utils/EmployeeUtil';
import { EMPLOYEE_ROLES } from '../models/EmployeeRoles';
import { CookiesUtil } from '../utils/CookiesUtil';
import { Cookies } from '../utils/Cookies';
// import { fetchAnnouncementItems } from "../utils/queries";
// import { useQuery } from "@apollo/react-hooks";
import CreateAnnouncement from './Announcements/CreateAnnouncement';
import { AnnouncementContext } from './Announcements/store';

const user = EmployeeUtil.getEmployeeFromUsername(CookiesUtil.getCookie(Cookies.USERNAME));

const AdminPage = (): ReactElement => {
  const {
    modal: { toggleModal, visible },
  } = useContext(AnnouncementContext);

  // if (!CookiesUtil.getCookie(Cookies.SESSION_ID)) {  //if not signed in show login
  //     history.push("/");
  // }
  // const { data, error, loading } = useQuery(fetchAnnouncementItems, {});
  // console.log("annoucementData", data);

  return (
    <div>
      {visible && <CreateAnnouncement />}
      {user.role === EMPLOYEE_ROLES.ADMIN ? (
        <div>
            <h1>Admin Settings</h1>
          THIS WILL BE AN ADMIN PAGE
          <button onClick={(): void => toggleModal({ visible: !visible })}>ADD ANNOUNCEMENT</button>
        </div>
      ) : (
        <div>
            <h1>Settings</h1>
            YOU ARE NOT AN ADMIN ¯\_(ツ)_/¯
            <p>check back soon for more features</p>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
