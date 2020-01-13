import RachelAntion from "../static/images/employees/Rachel_Antion.jpeg";
import AdityaSingh from "../static/images/employees/Aditya_Singh.jpeg";
import BrieRuse from "../static/images/employees/Brie_Ruse.jpeg";
import Chetan from "../static/images/employees/Chetan_Bhatia.jpg";
import Dex from "../static/images/employees/Dex_Cook.jpg";
import EmilyLucek from "../static/images/employees/Emily_Luckek.png";
import Frank from "../static/images/employees/Frank_Faustino.jpeg";
import Joel from "../static/images/employees/Joel_McIntyre.png";
import Lauri from "../static/images/employees/Lauri_Cerneck.jpeg";
import Tomko from "../static/images/employees/Mike_Tomko.jpeg";
import Nathan from "../static/images/employees/Nathan_Binding.png";
import Nazanin from "../static/images/employees/Nazanin_Ahmadkhani.jpeg";
import NicholasHo from "../static/images/employees/Nicholas_Ho.jpg";
import Paul from "../static/images/employees/Paul_Petyo.jpeg";
import RachelRamsay from "../static/images/employees/Rachel_Ramsay.jpg";
import Ram from "../static/images/employees/Ram_Kavasseri.png";
import Ricardo from "../static/images/employees/Ricardo_Ventura.jpg";
import Richelle from "../static/images/employees/Richelle_Herrli.jpg";
import Sreya from "../static/images/employees/Sreya_Dutta.jpg";
import Trey from "../static/images/employees/Trey_Cottingham.jpg";
import Maricris from "../static/images/employees/Maricris_Bonzo.png";
import Employee from "../models/Employee";




export class EmployeeUtil {

    public static getEmployeeFromUsername(username: string): Employee {
        let employee: Employee = new Employee("","");
        switch (username) {
            case "aditya.singh" :
                employee = new Employee("aditya.singh","Aditya Singh", AdityaSingh);
                break;
            case "rachel.antion" :
                employee = new Employee("rachel.antion","Rachel Antion", RachelAntion);
                break;
            case "dex.cook" :
                employee = new Employee("dex.cook","Dex Cook", Dex);
                break;
            case "ricardo.ventura":
                employee = new Employee("ricardo.ventura","Ricardo Ventura", Ricardo);
                break;
            case "nathan.binding":
                employee = new Employee("nathan.binding","Nathan Binding", Nathan);
                break;
            case "paul.petyo":
                employee = new Employee("paul.petyo","Paul Petyo", Paul);
                break;
            case "nicholas.ho":
                employee = new Employee("nicholas.ho","Nicholas Ho", NicholasHo);
                break;
            case "ram.kavasseri":
                employee = new Employee("ram.kavasseri","Ram Kavasseri", Ram);
                break;
            case "emily.lucek":
                employee = new Employee("emily.lucek","Emily Luckek", EmilyLucek);
                break;
            case "lauri.cerneck":
                employee = new Employee("lauri.cerneck","Lauri Cerneck", Lauri);
                break;
            case "mike.tomko":
                employee = new Employee("mike.tomko","Mike Tomko", Tomko);
                break;
            case "brie.ruse":
                employee = new Employee("brie.ruse","Brie Ruse", BrieRuse);
                break;
            case "nahmadkhani":
                employee = new Employee("nahmadkhani","Nazanin Ahmadkhani", Nazanin);
                break;
            case "joel.mcintyre":
                employee = new Employee("joel.mcintyre","Joel McIntyre", Joel);
                break;
            case "chetan.bhatian":
                employee = new Employee("chetan.bhatian","Chetan Bhatian", Chetan);
                break;
            case "rachel":
                employee = new Employee("rachel","Rachel Ramsay", RachelRamsay);
                break;
            case "frank.faustino":
                employee = new Employee("frank.faustino","Frankizzle Faustino", Frank);
                break;
            case "richelle.herrli":
                employee = new Employee("richelle.herrli","Richelle Herrli", Richelle);
                break;
            case "sreya.dutta":
                employee = new Employee("sreya.dutta","Sreya Dutta", Sreya);
                break;
            case "tcottingham":
                employee = new Employee("tcottingham","Trey Cottingham", Trey);
                break;
            case "maricris.bonzo":
                employee = new Employee("maricris.bonzo","Maricris Bonzo", Maricris);
                break;
            default:
                employee = new Employee(username, "");

        }
        return employee;
    }


}
