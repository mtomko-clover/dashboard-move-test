export default class Task {

    duration: number;
    name: string;
    category: any;
    key: any;
    subcategory?: any;

    constructor(name: string, duration: number, category: any, key: any, subcategory?: any) {
        this.name = name;
        this.duration = duration;
        this.category = category;
        this.key = key;
        this.subcategory = subcategory;
    }
}