import {ACTIVITY_CATEGORIES} from "./RecentActivityCategories";

export default class RecentActivity {

    username: string;
    title: string;
    category: ACTIVITY_CATEGORIES;

    constructor(username: string, title: string, category: ACTIVITY_CATEGORIES){
        this.username = username;
        this.title = title;
        this.category = category;
    }
}