import React, {ReactElement} from "react";

import NewsItem from "../../models/NewsItem";
import {Row, RowDate, RowTitle, RowType} from "./News.styles";


interface NewsRowProps {
    update: NewsItem;
}

const NewsRow = ({ update }: NewsRowProps): ReactElement => {
    const dateOptions = {day: "numeric", month: "2-digit"};
    const date = new Date(Number(update.created_at)).toLocaleDateString("en-US", dateOptions);
    // console.log("NewsRow: ", update);

    return (
        <Row>
            <RowDate>{date}</RowDate>
            <RowTitle>{update.title}</RowTitle>
            <RowType>{update.type}</RowType>
        </Row>
    )
}

export default NewsRow;
