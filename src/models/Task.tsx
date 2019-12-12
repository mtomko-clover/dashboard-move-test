export default class Task {

    duration: number;
    name: string;
    category: any;
    key: any;

    constructor(name: string, duration: number, category: any, key: any) {
        this.name = name;
        this.duration = duration;
        this.category = category;
        this.key = key;
    }
}