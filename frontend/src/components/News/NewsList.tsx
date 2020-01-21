import {List} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import React, {ReactElement, ReactNode, useState} from 'react';

import Row from './Row';
import NewsItem from '../../models/NewsItem';
import {news} from '../../utils/queries';
import ViewUpdate from "./ViewUpdate";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";

const NewsList = (): ReactElement | null => {
    const { data, error, loading } = useQuery(news);
    const initialState = {visible: false, update: new NewsItem("", new Date(), "", NEWS_CATEGORIES.DevRel)};
    const [ {visible, update}, setModalState] = useState(initialState);

    if (error) {
        console.error(error);
        return null;
    }

    const newsItem = (item: NewsItem | null): void => {
        if (item) {
            setModalState({visible: true, update: item});
        }
    };

    const closeViewUpdate = (): void => {
        setModalState({visible: false, update: update});
    };


    return loading ? null : (
        <div className="flex-grow column">
            {visible && <ViewUpdate showModal={visible} modalClosed={closeViewUpdate} update={update}/>}
            <List
                className="full-width margin-bottom"
                itemLayout="horizontal"
                dataSource={data.news}
                pagination={{
                    onChange: (page): void => console.log(page),
                    pageSize: 7,
                    position: 'bottom',
                }}
                renderItem={(update: NewsItem): ReactNode =>
                    update && (
                        <List.Item className="horizontal-padding" onClick={(): void => newsItem(update)}>
                            <Row update={update} />
                        </List.Item>
                    )
                }
            />
        </div>
    );
};

export default NewsList;
