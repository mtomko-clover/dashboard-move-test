import {DatePicker, Modal, notification} from "antd";
import React, {ChangeEvent, Component} from "react";
import styled from "styled-components";
import CategoryDropdown from "../CategoryDropdown";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";
import moment, {Moment} from 'moment';
import NewsUpdate from "../../models/NewsUpdate";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";
import {EditColumn, EditLabel, EditInput, EditRow, TextAreaInput} from "./News.styles";

interface NewsUpdateProps {
    showModal: boolean
    modalClosed:() => void
    saveNewUpdate:(update: NewsUpdate) => void
    update: NewsUpdate | null
}

interface State {
    visible: boolean
    type: any
    title: string
    description: string
    date: Date
}

const categories = NEWS_CATEGORIES;
const dateFormat = "MM/DD/YY";

export default class CreateNewsUpdate extends Component<NewsUpdateProps, State> {

    constructor(props: any) {
        super(props);
        console.log(this.props.update);
        this.state = {
            visible: this.props.showModal,
            type: this.props.update !== null ? this.props.update.category : null,
            title: this.props.update !== null ? this.props.update.title : "",
            description: this.props.update !== null && this.props.update.description ? this.props.update.description : "",
            date: new Date(),
        };
        this.handleCancel = this.handleCancel.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveUpdate = this.saveUpdate.bind(this);
    }

    handleCancel(): void {
        this.setState({ visible: false });
        this.props.modalClosed();
    }

    setCategory = (type: NEWS_CATEGORIES) => {
        this.setState({
            type: type
        });
    };

    handleTitleChange(e: ChangeEvent<any>): void {
        this.setState( {title: e.target.value});
    };

    handleDescriptionChange(e: ChangeEvent<any>): void {
        this.setState( {description: e.target.value});
    };

    handleDateChange(date: Moment | null, dateString: string){
        console.log("dateChange", date);
        if(date !== null) {
            this.setState({date: date.toDate()});
        }
    }

    saveUpdate(): void {
        if(this.state.title.length > 0 && this.state.type !== null) {
            this.setState({visible: false});
            let username = CookiesUtil.getCookie(Cookies.USERNAME);
            let update = new NewsUpdate(username, this.state.date, this.state.title, this.state.type, this.state.description);
            this.props.saveNewUpdate(update);
            this.props.modalClosed();
        }
        else{
            notification.open({
                message: "Error",
                description: "Please ensure all fields are populated",
                icon: <i className="fas fa-exclamation-triangle"/>,
                placement: "topLeft"
            });
        }
    }

    render(): React.ReactNode {
        return (
            <Modal
                className="news_update"
                title="Create News Update"
                visible={this.state.visible}
                onOk={this.saveUpdate}
                okText="Save"
                onCancel={this.handleCancel}
                afterClose={this.props.modalClosed}
                destroyOnClose={true}>
                <EditColumn>
                    <EditLabel>Title:</EditLabel>
                    <EditInput type="text" value={this.state.title} onChange={this.handleTitleChange}/>
                </EditColumn>
                <EditRow>
                    <EditLabel>Date:</EditLabel>
                    <DatePicker
                        className="margin-after"
                        format={dateFormat}
                        onChange={this.handleDateChange}
                        value={moment(this.state.date, dateFormat)}
                    />
                    <CategoryDropdown categories={categories} setCategory={this.setCategory} label="Type"/>
                </EditRow>
                <EditColumn>
                    <div className="row"><EditLabel>Description:</EditLabel><span className="small_text">(Optional)</span></div>
                    <TextAreaInput value={this.state.description} onChange={this.handleDescriptionChange}/>
                </EditColumn>
            </Modal>
        )
    }
}

