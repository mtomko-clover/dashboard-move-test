import {DatePicker, Modal, notification} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost"
import moment, {Moment} from 'moment';
import React, {ChangeEvent, ReactElement, useState} from "react";

import CategoryDropdown from "../CategoryDropdown";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";
import NewsItem from "../../models/NewsItem";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";
import {EditColumn, EditLabel, EditInput, EditRow, TextAreaInput} from "./News.styles";


interface NewsUpdateProps {
    showModal: boolean;
    modalClosed: () => void;
    // saveNewUpdate: (update: NewsItem) => void;
    update: NewsItem | null | undefined;
}

interface State {
    visible?: boolean;
    category: any | null;
    title: string;
    description?: string;
    date: Date;
}

const dateFormat = "MM/DD/YY";

const CreateNewsUpdate = (props: NewsUpdateProps): ReactElement => {
    const { showModal, update } = props;
    // TO-DO: do we need all these state fields?
    const initialState: State = {
        visible: showModal,
        category: update ? update.type : null,
        title: update ? update.title : "",
        description: update && update.description ? update.description : "",
        date: new Date(),
    };
    const [state, setState] = useState(initialState);

    const mutation = gql`
        mutation UpdateNewsItem($date: String, $title: String, $description: String, $type: String, $username: String) {
            updateNewsItem(date: $date, title: $title, description: $description, type: $type, username: $username) {
                message
            }
        }
    `;

    const [updateNewsItem, data] = useMutation(mutation);
    console.log(data)
    // useEffect(() => console.log(data), [data]);

    const handleCancel = (): void => {
        setState(prevState => ({ ...prevState, visible: false }));
        props.modalClosed();
    }

    // const setCategory = (type: NEWS_CATEGORIES): void => {
    //     setState(prevState => ({ ...prevState, type }));
    // }

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        e.persist();
        setState((prevState: State) => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    const handleDateChange = (date: Moment | null, dateString: string): void => {
        console.log("dateChange", date);
        if (date) {
            setState(prevState => ({ ...prevState, date: date.toDate() }));
        }
    }

    const saveUpdate = (): void => {
        const { date, description, title, category } = state;
        console.log(title, category)
        if (title.length && category) {
            setState(prevState => ({ ...prevState, visible: false }));
            const username = CookiesUtil.getCookie(Cookies.USERNAME);
            const update = new NewsItem(username, date, title, category, description);
            console.log("news item: ", update);
            // props.saveNewUpdate(update);
            updateNewsItem({ variables: { date: moment(date).format('YYYY-MM-DD HH:mm:ss'), description, title, category, username } })
            props.modalClosed();
        } else {
            notification.open({
                message: "Error",
                description: "Please ensure all fields are populated",
                icon: <i className="fas fa-exclamation-triangle"/>,
                placement: "topLeft"
            });
        }
    }

    return (
        <Modal
            className="news_update"
            title="Create News Update"
            visible={state.visible}
            onOk={saveUpdate}
            okText="Save"
            onCancel={handleCancel}
            afterClose={props.modalClosed}
            destroyOnClose={true}>
            <EditColumn>
                <EditLabel>Title:</EditLabel>
                <EditInput type="text" name="title" value={state.title} onChange={handleInputChange}/>
            </EditColumn>
            <EditRow>
                <EditLabel>Date:</EditLabel>
                <DatePicker
                    className="margin-after"
                    format={dateFormat}
                    onChange={handleDateChange}
                    value={moment(state.date, dateFormat)}
                />
                <CategoryDropdown categories={NEWS_CATEGORIES} label="Type"/>
            </EditRow>
            <EditColumn>
                <div className="row"><EditLabel>Description:</EditLabel><span className="small_text">(Optional)</span></div>
                <TextAreaInput name="description" value={state.description} onChange={handleInputChange}/>
            </EditColumn>
        </Modal>
    )
};

export default CreateNewsUpdate;
