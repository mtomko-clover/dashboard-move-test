export default class Announcement {
    id: number
    text: string;
    announcement: boolean;

    constructor(id: number, text: string, announcement: boolean){
        this.id = id;
        this.text = text;
        this.announcement = announcement;
    }
}