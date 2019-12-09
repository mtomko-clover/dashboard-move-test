export default class Task {

    duration: number;
    name: string;
    category: any;

    constructor(name: string, duration: number, category: any) {
        this.name = name;
        this.duration = duration;
        this.category = category;
    }
}