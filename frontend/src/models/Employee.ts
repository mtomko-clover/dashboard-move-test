export default class Employee {
    image: any;
    username: string;
    fullName: string;

    constructor(username: string, fullName: string, image?: string){
        this.username = username;
        this.fullName = fullName;
        this.image = image;
    }
}