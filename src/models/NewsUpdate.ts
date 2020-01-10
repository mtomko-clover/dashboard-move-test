import {NEWS_CATEGORIES} from "./NewsCategories";

export default class NewsUpdate {

    date: Date;
    title: string;
    description?: string;
    category: NEWS_CATEGORIES;
    username: string;

    constructor(username: string, date: Date, title: string, category: NEWS_CATEGORIES, description?: string,){
        this.date = date;
        this.title = title;
        this.category = category;
        this.username = username;
        this.description = description;
    }
}