import React, {ReactElement} from "react";
import {RouteComponentProps} from "react-router-dom";

import {EmployeeUtil} from "../utils/EmployeeUtil";
import {EMPLOYEE_ROLES} from "../models/EmployeeRoles";
import {CookiesUtil} from "../utils/CookiesUtil";
import {Cookies} from "../utils/Cookies";

interface AdminState {

}

interface AdminProps extends RouteComponentProps {

}

const AdminPage = (props: AdminProps): ReactElement => {

    const signedIn = CookiesUtil.getCookie(Cookies.SESSION_ID);
    if (!signedIn) {
        props.history.push("/");
    }

    const user = EmployeeUtil.getEmployeeFromUsername(CookiesUtil.getCookie(Cookies.USERNAME));

    return (
     <div>
         {user.role === EMPLOYEE_ROLES.ADMIN ? (
             <div>THIS WILL BE AN ADMIN PAGE</div>
         ): (
             <div>YOU ARE NOT AN ADMIN ¯\_(ツ)_/¯</div>
         )}

     </div>
    )
};


export default AdminPage;