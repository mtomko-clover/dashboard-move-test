export default class AnnouncementItems {
    id: string;
    text: string;
    is_urgent: boolean;

    constructor(id: string, text: string, isUrgent: boolean){
        this.id = id;
        this.text = text;
        this.is_urgent = isUrgent;
    }
}