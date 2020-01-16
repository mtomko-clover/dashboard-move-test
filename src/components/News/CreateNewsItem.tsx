import {DatePicker, Modal, notification} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost"
import moment, {Moment} from 'moment';
import React, {ChangeEvent, ReactElement, useContext} from "react";

import Dropdown from "./Dropdown";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";
import {fetchNewsItems} from "../../utils/queries";
import {NewsContext} from "./store";
import {EditColumn, EditInput, EditRow, TextAreaInput} from "./News.styles";


const CreateNewsItem = (): ReactElement => {
    const {
        dropdown: { category },
        form: { date, description, title, setFormState },
        modal: { visible, toggleModal }
    } = useContext(NewsContext);

    const dateFormat = "MM/DD/YY";

    const mutation = gql`
        mutation UpdateNewsItem($date: String, $title: String, $description: String, $type: String, $username: String) {
            updateNewsItem(date: $date, title: $title, description: $description, type: $type, username: $username) {
                message
            }
        }
    `;

    // TO-DO: update cache instead of querying again
    const options = {
        refetchQueries: [{ query: fetchNewsItems }]
    }
    const [updateNewsItem] = useMutation(mutation, options)

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        e.persist();
        setFormState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    const handleDateChange = (date: Moment | null, dateString: string): void => {
        if (date) {
            setFormState(prevState => ({ ...prevState, date: date.toDate() }));
        }
    }

    const addNewsItem = (): void => {
        if (title.length && category) {
            const username = CookiesUtil.getCookie(Cookies.USERNAME);
            updateNewsItem({ variables: { date: moment(date).format('YYYY-MM-DD HH:mm:ss'), description, title, type: category, username } })
            toggleModal({ visible: !visible });
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
            title="Add a News Item"
            visible={visible}
            onOk={addNewsItem}
            okText="Save"
            onCancel={(): void => toggleModal({ visible: !visible })}
            afterClose={(): void => toggleModal({ visible: !visible })}
            destroyOnClose={true}>
            <EditColumn>
                <EditInput type="text" name="title" placeholder="Title" value={title} onChange={handleInputChange}/>
            </EditColumn>
            <EditRow>
                <DatePicker
                    className="margin-after"
                    format={dateFormat}
                    onChange={handleDateChange}
                    value={moment(date, dateFormat)}
                />
                <Dropdown categories={NEWS_CATEGORIES} label="Type"/>
            </EditRow>
            <EditColumn>
                <TextAreaInput name="description" placeholder="Description (optional)" value={description} onChange={handleInputChange}/>
            </EditColumn>
        </Modal>
    )
};

export default CreateNewsItem;
