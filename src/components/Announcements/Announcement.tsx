import React, {ChangeEvent, Component} from "react";
import AnnouncementItems from "../../models/AnnouncementItems";
import {AnnouncementContainer, AnnouncementText, AnnouncementBullhornIcon, AnnouncementExclamationIcon, AnnouncementDelete} from "./Announcement.styles";

interface AnnouncementProps {
    announcement: AnnouncementItems
    // deleteAnnouncement:(id: string) => void
}

interface State {
    visible: boolean;
}

export default class Announcement extends Component<AnnouncementProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: true
        };
        this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
    }

    deleteAnnouncement(){
        this.setState({visible: false});
    }

    render(): React.ReactNode | null {
        return (
            <div>
                {this.state.visible &&
                <AnnouncementContainer>
                    {this.props.announcement.is_urgent ? (
                        <AnnouncementBullhornIcon className="fas fa-bullhorn fa-lg"/>) : (
                        <AnnouncementExclamationIcon className="fas fa-exclamation fa-lg"/>)}
                    <AnnouncementText>{this.props.announcement.text}</AnnouncementText>
                    <div className="filler"/>
                    <AnnouncementDelete onClick={this.deleteAnnouncement} className="fas fa-times-circle"/>
                </AnnouncementContainer>
                }
            </div>
        )
    }
}

