import React, {Component} from "react";

import {BigCard} from "../BigCard";
import NewsUpdate from "../../models/NewsUpdate";
import NewsUpdateRow from "./Row";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";

import {Date, Heading, NewsItems, Title, Type} from "./News.styles";

import '../TimeTracker.css';


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
    // new NewsUpdate (new Date().getMilliseconds(), "Ireland Team Training", NEWS_CATEGORIES.ENGINEERING),
    // new NewsUpdate (new Date().getMilliseconds(), "Sandbox to GCP testing in progress", NEWS_CATEGORIES.DEVREL)
];

export default class News extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
          updates: dummyData
        };
    }

    renderUpdates = (): Array<JSX.Element> => this.state.updates.map(update => <NewsUpdateRow update={update} />);

    render(): React.ReactNode {
        return (
            <BigCard title="News">
                <Heading>
                    <Date>Date</Date>
                    <Title>Title</Title>
                    <Type>Type</Type>
                </Heading>
                <NewsItems>
                    {this.renderUpdates()}
                </NewsItems>
            </BigCard>
        )
    }
}
