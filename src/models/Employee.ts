export default class Employee {
    image: any;
    fullName: string;

    constructor(fullName: string, image?: string){
        this.fullName = fullName;
        this.image = image;
    }
}