import React, {ChangeEvent, Component} from "react";
import Announcement from "../../models/Announcement";
import {AnnouncementContainer, AnnouncementText, AnnouncementBullhornIcon, AnnouncementExclamationIcon, AnnouncementDelete} from "./Announcement.styles";

interface AnnouncementProps {
    announcement: Announcement
    deleteAnnouncement:(id: string) => void
}

export default class Announcements extends Component<AnnouncementProps, any> {

    constructor(props: any) {
        super(props);
        this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
    }

    deleteAnnouncement(){
        this.props.deleteAnnouncement(this.props.announcement.id);
    }

    render(): React.ReactNode {
        return (
           <AnnouncementContainer>
               {this.props.announcement.isUrgent ? (<AnnouncementBullhornIcon className="fas fa-bullhorn fa-lg"/>):(<AnnouncementExclamationIcon className="fas fa-exclamation fa-lg"/>)}
               <AnnouncementText>{this.props.announcement.text}</AnnouncementText>
               <div className="filler"/>
               <AnnouncementDelete onClick={this.deleteAnnouncement} className="fas fa-times-circle"/>
           </AnnouncementContainer>
        )
    }
}

