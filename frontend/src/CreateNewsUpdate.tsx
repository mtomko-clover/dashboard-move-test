import {Modal} from "antd";
import React, {ChangeEvent, Component} from "react";
import styled from "styled-components";
import CategoryDropdown from "./components/CategoryDropdown";
import {NEWS_CATEGORIES} from "./models/NewsCategories";
import {DatePicker} from "antd";
import moment, {Moment} from 'moment';
import NewsUpdate from "./models/NewsUpdate";

interface NewsUpdateProps {
    showModal: boolean
    modalClosed:() => void
    saveNewUpdate:(update: NewsUpdate) => void
}

interface State {
    visible: boolean
    type: NEWS_CATEGORIES
    title: string
    date: Date
}

const EditRow = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
`;

const EditLabel = styled.div`
        font-size: 18px;
        font-style: bold;
        margin-right: 10px;
`;

const EditInput = styled.input`
        font-size: 18px;
        font-style: bold;
        padding: 10px;
`;

const categories = NEWS_CATEGORIES;
const dateFormat = "MM/DD/YY";

export default class CreateNewsUpdate extends Component<NewsUpdateProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: this.props.showModal,
            type: NEWS_CATEGORIES.DEVREL,
            title: "",
            date: new Date()
        };
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleOk(): void {
        this.setState({ visible: false });
        this.props.modalClosed();
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

    handleDateChange(date: Moment | null, dateString: string){
        if(date !== null) {
            this.setState({date: date.toDate()});
        }
    }

    saveUpdate(): void {
        let update = new NewsUpdate(this.state.date.getMilliseconds(), this.state.title, this.state.type);
        this.props.saveNewUpdate(update);
    }


    render(): React.ReactNode {
        return (
            <Modal
                title="Edit Task"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                afterClose={this.props.modalClosed}
                destroyOnClose={true}>
                <DatePicker
                    format={dateFormat + " — wo"}
                    onChange={this.handleDateChange}
                    value={moment(this.state.date, dateFormat)}
                />
                <EditRow>
                    <EditLabel>Title:</EditLabel>
                    <EditInput type="text" value={this.state.title} onChange={this.handleTitleChange}/>
                </EditRow>
                <EditRow>
                    <CategoryDropdown categories={categories} setCategory={this.setCategory} label="Type"/>
                </EditRow>
                <button onClick={this.saveUpdate}>save</button>
            </Modal>
        )
    }
}

