import {NEWS_CATEGORIES} from "./NewsCategories";

export default class NewsUpdate {

    date: number;
    title: string;
    category: NEWS_CATEGORIES;

    constructor(date: number, title: string, category: NEWS_CATEGORIES){
        this.date = date;
        this.title = title;
        this.category = category;
    }
}