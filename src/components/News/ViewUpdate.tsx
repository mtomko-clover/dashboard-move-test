import {Modal} from "antd";
import React, {Component} from "react";
import NewsUpdate from "../../models/NewsUpdate";
import {ViewRow, ViewKey, ViewCategory, ViewDescription, ViewTitle} from "./News.styles";

interface ViewUpdateProps {
    showModal: boolean
    modalClosed:() => void
    update: NewsUpdate
}

interface State {
    visible: boolean
}

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class ViewUpdate extends Component<ViewUpdateProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: this.props.showModal
        };
        this.close = this.close.bind(this);
    }

    close(): void {
        this.setState({ visible: false });
        this.props.modalClosed();
    }

    render(): React.ReactNode {
        let formatDate = months[this.props.update.date.getMonth()] + "  " + this.props.update.date.getDate() + ", " + this.props.update.date.getFullYear();
        return (
            <Modal
                className="news_update"
                title="News Update"
                visible={this.state.visible}
                onOk={this.close}
                onCancel={this.props.modalClosed}
                cancelButtonProps={{ style: { display: 'none' } }}
                okText="Ok"
                afterClose={this.props.modalClosed}
                destroyOnClose={true}>
                <ViewTitle>{this.props.update.title}</ViewTitle>
                <ViewDescription>{this.props.update.description}</ViewDescription>
                <ViewRow>
                    <ViewKey>{formatDate}</ViewKey>
                    <ViewCategory>{this.props.update.category}</ViewCategory>
                </ViewRow>
            </Modal>
        )
    }
}

