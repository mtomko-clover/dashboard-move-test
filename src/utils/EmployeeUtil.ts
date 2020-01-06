import RachelAntion from "../static/images/employees/Rachel_Antion.jpeg";
import AdityaSingh from "../static/images/employees/Aditya_Singh.jpeg";
import BrieRuse from "../static/images/employees/Brie_Ruse.jpeg";
import Chetan from "../static/images/employees/Chetan_Bhatia.jpeg";
import Dex from "../static/images/employees/Dex_Cook.jpeg";
import EmilyLuckek from "../static/images/employees/Emily_Luckek.jpeg";
import Frank from "../static/images/employees/Frank_Faustino.jpeg";
import Joel from "../static/images/employees/Joel_McIntyre.jpeg";
import Lauri from "../static/images/employees/Lauri_Cerneck.jpeg";
import Tomko from "../static/images/employees/Mike_Tomko.jpeg";
import Nathan from "../static/images/employees/Nathan_Binding.jpeg";
import Nazanin from "../static/images/employees/Nazanin_Ahmadkhani.jpeg";
import NicholasHo from "../static/images/employees/Nicholas_Ho.jpeg";
import Paul from "../static/images/employees/Paul_Petyo.jpeg";
import RachelRamsay from "../static/images/employees/Rachel_Ramsay.jpeg";
import Ram from "../static/images/employees/Ram_Kavasseri.jpeg";
import Ricardo from "../static/images/employees/Ricardo_Ventura.jpeg";




export class EmployeeUtil {

    public static getEmployeeImage(username: string): string {
        let image: string = "";
        console.log("username", username);
        switch (username) {
            case "aditya.singh" :
                image = AdityaSingh;
                break;
            case "rachel.antion" :
                image = RachelAntion;
                break;
            default:
                image = "none";
        }
        console.log(image);
        return image;
    }


}
