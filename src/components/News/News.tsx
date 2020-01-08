import React, {Component} from "react";

import {BigCard} from "../BigCard";
import NewsUpdate from "../../models/NewsUpdate";
import NewsUpdateRow from "./Row";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";

import {Date, Heading, Title, Type} from "./News.styles";

import '../TimeTracker.css';
import { List} from "antd";


interface State {
    updates: NewsUpdate[];
}


const dummyData =[
    new NewsUpdate (0, "MiCamp multipay tokens issue and GrubHub", NEWS_CATEGORIES.ESCALATION),
    new NewsUpdate (1, "Altria/Smokin Rebates concept - pending", NEWS_CATEGORIES.ISSUE),
    new NewsUpdate (8, "DART: Progress on new DevRel Dashboard design", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (8, "COE: Organized and announced to the team", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (8, "ECommerce documentation moving forward", NEWS_CATEGORIES.CONTENT),
    new NewsUpdate (8, "DevsRock: First wave email updates to devs", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (8, "Developer Advocate responsibilities conflict", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (10, "Ireland Team Training", NEWS_CATEGORIES.ENGINEERING),
    new NewsUpdate (9, "Sandbox to GCP testing in progress", NEWS_CATEGORIES.DEVREL)
];

export default class News extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
          updates: dummyData
        };
    }

    addNewsUpdate(){

    }

    renderUpdates = (): Array<JSX.Element> => this.state.updates.map((update, i) => <NewsUpdateRow key={i} update={update} />);

    render(): React.ReactNode {
        return (
            <BigCard title="News">
                <Heading>
                    <Date>Date</Date>
                    <Title>Title</Title>
                    <Type>Type</Type>
                </Heading>
                <List
                    className="width_95"
                    itemLayout="horizontal"
                    dataSource={dummyData}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 7,
                    }}
                    renderItem={item => (
                        <List.Item>
                            <NewsUpdateRow update={item}/>
                        </List.Item>
                    )}
                />
                <button onClick={this.addNewsUpdate}>add new</button>
            </BigCard>
        )
    }
}
