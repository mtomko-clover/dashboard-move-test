export default class Announcement {
    id: string;
    text: string;
    isUrgent: boolean;

    constructor(id: string, text: string, announcement: boolean){
        this.id = id;
        this.text = text;
        this.isUrgent = announcement;
    }
}