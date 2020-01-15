import {Modal, notification} from "antd";
import React, {ChangeEvent, Component} from "react";
import { EditColumn, EditInput, EditLabel} from "./Announcement.styles";
import Announcement from "../../models/Announcement";
const uuid  = require("react-uuid");

interface AnnouncementProps {
    showModal: boolean
    modalClosed:() => void
    saveAnnouncement:(announcement: Announcement) => void
    announcement: Announcement | null
}

interface State {
    visible: boolean
    text: string
    id: string
    isUrgent: boolean
}

export default class CreateAnnouncement extends Component<AnnouncementProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: this.props.showModal,
            text: this.props.announcement !== null ? this.props.announcement.text : "",
            id: this.props.announcement !== null ? this.props.announcement.id : "",
            isUrgent: this.props.announcement !== null ? this.props.announcement.isUrgent : true,
        };
        this.handleCancel = this.handleCancel.bind(this);
        this.saveAnnouncement = this.saveAnnouncement.bind(this);
        this.handleisAnnouncement = this.handleisAnnouncement.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleCancel(): void {
        this.setState({ visible: false });
        this.props.modalClosed();
    }


    handleisAnnouncement(isUrgent: boolean): void {
        this.setState( {isUrgent: isUrgent});
    };

    handleTextChange(e: ChangeEvent<any>): void {
        this.setState( {text: e.target.value});
    };

    saveAnnouncement(): void {
        if(this.state.text.length > 0) {
            this.setState({visible: false});
            let announcement = new Announcement(this.state.id !== null ? this.state.id : uuid(), this.state.text, this.state.isUrgent);
            this.props.saveAnnouncement(announcement);
            this.props.modalClosed();
        }
        else{
            notification.open({
                message: "Error",
                description: "Must have content",
                icon: <i className="fas fa-exclamation-triangle"/>,
                placement: "topLeft"
            });
        }
    }

    getCategories(): any{
        return [
            <div><i className="fas fa-bullhorn"/></div>,
            <div><i className="fas fa-exclamation"/></div>
        ]

    }

    render(): React.ReactNode {
        return (
            <Modal
                className="news_update"
                title="Create News Update"
                visible={this.state.visible}
                onOk={this.saveAnnouncement}
                okText="Save"
                onCancel={this.handleCancel}
                afterClose={this.props.modalClosed}
                destroyOnClose={true}>
                <EditColumn>
                    <EditLabel>Title:</EditLabel>
                    <EditInput type="text" value={this.state.text} onChange={this.handleTextChange}/>

                </EditColumn>
            </Modal>
        )
    }
}

