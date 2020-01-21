import RachelAntion from '../static/images/employees/Rachel_Antion.jpeg';
import AdityaSingh from '../static/images/employees/Aditya_Singh.jpeg';
import BrieRuse from '../static/images/employees/Brie_Ruse.jpeg';
import Chetan from '../static/images/employees/Chetan_Bhatia.jpg';
import Dex from '../static/images/employees/Dex_Cook.jpg';
import EmilyLucek from '../static/images/employees/Emily_Luckek.png';
import Frank from '../static/images/employees/Frank_Faustino.jpeg';
import Joel from '../static/images/employees/Joel_McIntyre.png';
import Lauri from '../static/images/employees/Lauri_Cerneck.jpeg';
import Tomko from '../static/images/employees/Mike_Tomko.jpeg';
import Nathan from '../static/images/employees/Nathan_Binding.png';
import Nazanin from '../static/images/employees/Nazanin_Ahmadkhani.jpeg';
import NicholasHo from '../static/images/employees/Nicholas_Ho.jpg';
import Paul from '../static/images/employees/Paul_Petyo.jpeg';
import RachelRamsay from '../static/images/employees/Rachel_Ramsay.jpg';
import Ram from '../static/images/employees/Ram_Kavasseri.png';
import Ricardo from '../static/images/employees/Ricardo_Ventura.jpg';
import Richelle from '../static/images/employees/Richelle_Herrli.jpg';
import Sreya from '../static/images/employees/Sreya_Dutta.jpg';
import Trey from '../static/images/employees/Trey_Cottingham.jpg';
import Maricris from '../static/images/employees/Maricris_Bonzo.png';
import BaoChau from '../static/images/employees/baochau.jpg';
import UserIcon from '../static/images/employees/user.png';
import Employee from '../models/Employee';
import {EMPLOYEE_ROLES} from '../models/EmployeeRoles';

export class EmployeeUtil {

    public static getEmployeeFromUsername(username: string): Employee {
        let employee: Employee = new Employee("",EMPLOYEE_ROLES.NON_ADMIN,"");
        switch (username) {
            case "aditya.singh" :
                employee = new Employee("aditya.singh",EMPLOYEE_ROLES.NON_ADMIN,"Aditya Singh", AdityaSingh);
                break;
            case "rachel.antion" :
                employee = new Employee("rachel.antion",EMPLOYEE_ROLES.ADMIN,"Rachel Antion", RachelAntion);
                break;
            case "dex.cook" :
                employee = new Employee("dex.cook",EMPLOYEE_ROLES.NON_ADMIN,"Dex Cook", Dex);
                break;
            case "ricardo.ventura":
                employee = new Employee("ricardo.ventura",EMPLOYEE_ROLES.NON_ADMIN,"Ricardo Ventura", Ricardo);
                break;
            case "nathan.binding":
                employee = new Employee("nathan.binding",EMPLOYEE_ROLES.NON_ADMIN,"Nathan Binding", Nathan);
                break;
            case "paul.petyo":
                employee = new Employee("paul.petyo",EMPLOYEE_ROLES.NON_ADMIN,"Paul Petyo", Paul);
                break;
            case "nicholas.ho":
                employee = new Employee("nicholas.ho",EMPLOYEE_ROLES.NON_ADMIN,"Nicholas Ho", NicholasHo);
                break;
            case "ram.kavasseri":
                employee = new Employee("ram.kavasseri",EMPLOYEE_ROLES.ADMIN,"Ram Kavasseri", Ram);
                break;
            case "emily.lucek":
                employee = new Employee("emily.lucek",EMPLOYEE_ROLES.NON_ADMIN,"Emily Luckek", EmilyLucek);
                break;
            case "lauri.cerneck":
                employee = new Employee("lauri.cerneck",EMPLOYEE_ROLES.NON_ADMIN,"Lauri Cerneck", Lauri);
                break;
            case "mike.tomko":
                employee = new Employee("mike.tomko",EMPLOYEE_ROLES.NON_ADMIN,"Mike Tomko", Tomko);
                break;
            case "brie.ruse":
                employee = new Employee("brie.ruse",EMPLOYEE_ROLES.NON_ADMIN,"Brie Ruse", BrieRuse);
                break;
            case "nahmadkhani":
                employee = new Employee("nahmadkhani",EMPLOYEE_ROLES.NON_ADMIN,"Nazanin Ahmadkhani", Nazanin);
                break;
            case "joel.mcintyre":
                employee = new Employee("joel.mcintyre",EMPLOYEE_ROLES.ADMIN,"Joel McIntyre", Joel);
                break;
            case "chetan.bhatian":
                employee = new Employee("chetan.bhatian",EMPLOYEE_ROLES.NON_ADMIN,"Chetan Bhatian", Chetan);
                break;
            case "rachel":
                employee = new Employee("rachel",EMPLOYEE_ROLES.NON_ADMIN,"Rachel Ramsay", RachelRamsay);
                break;
            case "frank.faustino":
                employee = new Employee("frank.faustino",EMPLOYEE_ROLES.ADMIN,"Frankizzle Faustino", Frank);
                break;
            case "richelle.herrli":
                employee = new Employee("richelle.herrli",EMPLOYEE_ROLES.NON_ADMIN,"Richelle Herrli", Richelle);
                break;
            case "sreya.dutta":
                employee = new Employee("sreya.dutta",EMPLOYEE_ROLES.NON_ADMIN,"Sreya Dutta", Sreya);
                break;
            case "tcottingham":
                employee = new Employee("tcottingham",EMPLOYEE_ROLES.NON_ADMIN,"Trey Cottingham", Trey);
                break;
            case "maricris.bonzo":
                employee = new Employee("maricris.bonzo",EMPLOYEE_ROLES.NON_ADMIN,"Maricris Bonzo", Maricris);
                break;
            case "baochau.nguyen":
                employee = new Employee("baochau.nguyen", EMPLOYEE_ROLES.ADMIN,"Bao Chau Nguyen", BaoChau);
                break;
            case "sonny.espinoza":
                employee = new Employee("sonny.espinoza", EMPLOYEE_ROLES.ADMIN, "Sonny Espinoza", UserIcon);
                break;
            default:
                employee = new Employee(username, EMPLOYEE_ROLES.NON_ADMIN,"", UserIcon);
        }
        return employee;
    }


}
