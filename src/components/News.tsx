import React, {Component, ReactElement} from "react";
import './TimeTracker.css';
import styled from "styled-components";
import NewsUpdate from "../models/NewsUpdate";
import {NEWS_CATEGORIES} from "../models/NewsCategories";
import NewsUpdateRow from "./NewsUpdateRow";
import { BigCard } from "./BigCard";

const ms = require('pretty-ms');

interface NewsProps {
}

interface State {
    updates: NewsUpdate[];
}

const ColumnNames = styled.div`
    display: grid;
    grid-template-columns: 10% 70% 20%;
    width: 100%;
    padding: 20px 10px;
  
`;

const NewsDate = styled.div`
    padding-left: 20px;
    font-size: 22px;
    font-weight: 900;
`;

const Title = styled.div`
    grid-column-start: 2;
    font-size: 22px;
    padding-left: 20px;
    font-weight: 900;
`;


const Category = styled.div`
    grid-column-start: 3;
    font-size: 22px;
    font-weight: 900;
`;


const dummyData =[
    new NewsUpdate (new Date().getMilliseconds(), "MiCamp multipay tokens issue and GrubHub", NEWS_CATEGORIES.ESCALATION),
    new NewsUpdate (new Date().getMilliseconds(), "Altria/Smokin Rebates concept - pending", NEWS_CATEGORIES.ISSUE),
    new NewsUpdate (new Date().getMilliseconds(), "DART: Progress on new DevRel Dashboard design", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "COE: Organized and announced to the team", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "ECommerce documentation moving forward", NEWS_CATEGORIES.CONTENT),
    new NewsUpdate (new Date().getMilliseconds(), "DevsRock: First wave email updates to devs", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "Developer Advocate responsibilities conflict", NEWS_CATEGORIES.DEVREL),
    // new NewsUpdate (new Date().getMilliseconds(), "Ireland Team Training", NEWS_CATEGORIES.ENGINEERING),
    // new NewsUpdate (new Date().getMilliseconds(), "Sandbox to GCP testing in progress", NEWS_CATEGORIES.DEVREL)
];

export default class News extends Component<NewsProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
          updates: dummyData
        };
        this.renderUpdates = this.renderUpdates.bind(this);
    }

    renderUpdates(): React.ReactElement {
        const elements: any = [];
        this.state.updates.forEach( update => {
            elements.push(<NewsUpdateRow update={update}/>);
        });
        let styles = {
            width: '100%'
        };
        return(<div style={styles}>{elements}</div>)
    }

    render(): React.ReactNode {
        return (
            <BigCard title="News">
                <ColumnNames>
                    <NewsDate>Date</NewsDate>
                    <Title>Title</Title>
                    <Category>Type</Category>
                </ColumnNames>
                {this.renderUpdates()}
            </BigCard>
        )
    }
}

