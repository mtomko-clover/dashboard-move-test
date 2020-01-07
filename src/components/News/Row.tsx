import React, {Component} from "react";

import NewsUpdate from "../../models/NewsUpdate";
// import {NEWS_CATEGORIES} from "../../models/NewsCategories";

import '../TimeTracker.css';

import {Row, RowDate, RowTitle, RowType} from "./News.styles";


interface NewsRowProps {
    update: NewsUpdate;
}

const dateOptions = {day: "numeric", month: "2-digit"};

export default class NewsRow extends Component<NewsRowProps, {}> {
    render(): React.ReactNode {
        const date = new Date(this.props.update.date).toLocaleDateString("en-US", dateOptions);

        return (
            <Row>
                <RowDate>{date}</RowDate>
                <RowTitle>{this.props.update.title}</RowTitle>
                <RowType>{this.props.update.category}</RowType>
            </Row>
        )
    }
}

