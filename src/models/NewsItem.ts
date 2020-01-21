import { NEWS_CATEGORIES } from './NewsCategories';

export default class NewsItem {
  createdAt: Date;
  title: string;
  description?: string;
  type: NEWS_CATEGORIES;
  author: string;

  constructor(
    username: string,
    createdAt: Date,
    title: string,
    type: NEWS_CATEGORIES,
    description?: string,
  ) {
    this.createdAt = createdAt;
    this.title = title;
    this.type = type;
    this.author = username;
    this.description = description;
  }
}
