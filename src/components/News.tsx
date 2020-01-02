import React, {Component, ReactElement} from "react";
import './TimeTracker.css';
import styled from "styled-components";
import NewsUpdate from "../models/NewsUpdate";
import {NEWS_CATEGORIES} from "../models/NewsCategories";
import NewsUpdateRow from "./NewsUpdateRow";

const ms = require('pretty-ms');

interface NewsProps {
}

interface State {
    updates: NewsUpdate[];
}

const NewsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    width: 500px;
`;

const NewsGrid = styled.div`
    display: grid;
    grid-template-columns: 10% 70% 20%;
`;

const NewsHeader = styled.div`
   border-bottom: 1px solid #E8E8E8;
   display: flex;
   flex-direction: row;
   font-style: bold;
   font-size: 18px;
   width: 100%;
   padding: 20px;
`;

const ColumnNames = styled.div`
    display: grid;
    grid-template-columns: 10% 70% 20%;
    width: 100%;
`;


const Title = styled.div`
    grid-column-start: 2;
`;


const Category = styled.div`
    grid-column-start: 3;
`;


const dummyData =[
    new NewsUpdate (new Date().getMilliseconds(), "MiCamp multipay tokens issue and GrubHub", NEWS_CATEGORIES.ESCALATION),
    new NewsUpdate (new Date().getMilliseconds(), "Altria/Smokin Rebates concept - pending", NEWS_CATEGORIES.ISSUE),
    new NewsUpdate (new Date().getMilliseconds(), "DART: Progress on new DevRel Dashboard design", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "COE: Organized and announced to the team", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "ECommerce documentation moving forward", NEWS_CATEGORIES.CONTENT),
    new NewsUpdate (new Date().getMilliseconds(), "DevsRock: First wave email updates to devs", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "Developer Advocate responsibilities conflict", NEWS_CATEGORIES.DEVREL),
    new NewsUpdate (new Date().getMilliseconds(), "Ireland Team Training", NEWS_CATEGORIES.ENGINEERING),
    new NewsUpdate (new Date().getMilliseconds(), "Sandbox to GCP testing in progress", NEWS_CATEGORIES.DEVREL)
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
            <NewsContainer>
               <NewsHeader>
                   News
                   <div className="filler"/>
                   <i className="fas fa-ellipsis-h"/>
               </NewsHeader>
                <ColumnNames>
                    <div>Date</div>
                    <Title>Title</Title>
                    <Category>Type</Category>
                </ColumnNames>
                {this.renderUpdates()}
            </NewsContainer>
        )
    }
}

