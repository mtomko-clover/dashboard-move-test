import { EMPLOYEE_ROLES } from './EmployeeRoles';

export default class Employee {
  image: any;
  username: string;
  fullName: string;
  role: EMPLOYEE_ROLES;

  constructor(username: string, role: EMPLOYEE_ROLES, fullName: string, image?: string) {
    this.username = username;
    this.fullName = fullName;
    this.role = role;
    this.image = image;
  }
}
