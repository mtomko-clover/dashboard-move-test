import {NEWS_CATEGORIES} from "./NewsCategories";

export default class NewsItem {
    created_at: Date;
    title: string;
    description?: string;
    type: NEWS_CATEGORIES;
    username: string;

    constructor(username: string, created_at: Date, title: string, type: NEWS_CATEGORIES, description?: string,){
        this.created_at = created_at;
        this.title = title;
        this.type = type;
        this.username = username;
        this.description = description;
    }
}