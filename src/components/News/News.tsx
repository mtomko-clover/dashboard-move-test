import {List} from "antd";
import {useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost"
import React, {ReactElement, ReactNode, useState} from "react";

import {BigCard} from "../BigCard";
import CreateNewsUpdate from "./CreateNewsUpdate";
import Row from "./Row";
// import ViewUpdate from "./ViewUpdate";

import {NEWS_CATEGORIES} from "../../models/NewsCategories";
import NewsItem from "../../models/NewsItem";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";

import {Heading, NewsDate, Title, Type} from "./News.styles";
// import '../TimeTracking/TimeTracker.css';


interface State {
    showModal?: boolean;
    showViewNews?: boolean;
    update: NewsItem | null;
    updates?: NewsItem[];
}

const dummyData =[
    new NewsItem ("ram.kavasseri", new Date(), "MiCamp multipay tokens issue and GrubHub", NEWS_CATEGORIES.Escalation,
        "The next movement in paragraph development is an explanation of each example and its relevance to the topic sentence and rationale that were stated at the beginning of the paragraph. This explanation shows readers why you chose to use this/or these particular examples as evidence to support the major claim, or focus, in your paragraph.\n" +
        "\n" +
        "Continue the pattern of giving examples and explaining them until all points/examples that the writer deems necessary have been made and explained. NONE of your examples should be left unexplained. You might be able to explain the relationship between the example and the topic sentence in the same sentence which introduced the example. More often, however, you will need to explain that relationship in a separate sentence."),
    new NewsItem ("ram.kavasseri", new Date(), "Altria/Smokin Rebates concept - pending", NEWS_CATEGORIES.Issue),
    new NewsItem ("ram.kavasseri", new Date(), "DART: Progress on new DevRel Dashboard design", NEWS_CATEGORIES.DevRel),
    new NewsItem ("ram.kavasseri", new Date(), "COE: Organized and announced to the team", NEWS_CATEGORIES.DevRel),
    new NewsItem ("ram.kavasseri", new Date(), "ECommerce documentation moving forward", NEWS_CATEGORIES.Content),
    new NewsItem ("ram.kavasseri", new Date(), "DevsRock: First wave email updates to devs", NEWS_CATEGORIES.DevRel),
    new NewsItem ("ram.kavasseri", new Date(), "Developer Advocate responsibilities conflict", NEWS_CATEGORIES.DevRel),
    new NewsItem ("ram.kavasseri", new Date(), "Ireland Team Training", NEWS_CATEGORIES.Engineering),
    new NewsItem ("ram.kavasseri", new Date(), "Sandbox to GCP testing in progress", NEWS_CATEGORIES.DevRel)
];

const News = (): ReactElement | null => {
    const initialState: State = {
        updates: dummyData,
        showModal: false,
        showViewNews: false,
        update: null
    };
    const [state, setState] = useState(initialState);

    const modalOpen = (): void => {
        setState({ showModal: true, update: null });
    }

    const modalClosed = (): void => {
        setState(p => ({ ...p, showModal: false }));
    }

    const updateClicked = (update: NewsItem | null): void => {
        console.log("update clicked", update);
        const username = CookiesUtil.getCookie(Cookies.USERNAME);

        if (state.update && (username === state.update.username)) {
            setState({ showModal: true, update });
        } else {
            setState({ showViewNews: true, update });
        }
    }

    const query = gql`
        query {
            fetchNewsItems {
                created_at
                id
                author
                title
                description
                link
                type
            }
        }
    `;
    const { data, error, loading } = useQuery(query, {});

    if (!loading) console.log(data, error, loading)

    // const renderViewUpdate = (): ReactElement => {
    //     if (state.showViewNews && state.update) {
    //         return (<ViewUpdate showModal={state.showViewNews} modalClosed={closeView} update={state.update} />);
    //     } else {
    //         return <div />
    //     }
    // }

    const addNewsItem = (<div onClick={modalOpen}><i className="fas fa-plus margin-after"/></div>);
    return loading ? null : (
        <BigCard title="News" headerChild={addNewsItem}>
            {state.showModal && <CreateNewsUpdate update={state.update} showModal={state.showModal} modalClosed={modalClosed} />}
            {/* {renderViewUpdate()} */}
            <Heading>
                <NewsDate>Date</NewsDate>
                <Title>Title</Title>
                <Type>Type</Type>
            </Heading>
            <List
                className="news-list margin-bottom"
                itemLayout="horizontal"
                dataSource={data.fetchNewsItems}
                pagination={{
                    onChange: (page): void => console.log(page),
                    pageSize: 7,
                    position: "bottom"
                }}
                renderItem={(update: NewsItem): ReactNode => {
                    console.log("🙏 NewsUpdate: ", update)
                    return update && (
                        <List.Item className="horizontal-padding" onClick={(): void => updateClicked(update)}>
                            <Row update={update}/>
                        </List.Item>
                    )
                }}
            />
        </BigCard>
    )
};

export default News;
