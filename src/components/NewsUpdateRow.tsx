import * as React from "react";
import {Component} from "react";
import './TimeTracker.css';
import styled from "styled-components";
import NewsUpdate from "../models/NewsUpdate";
import {NEWS_CATEGORIES} from "../models/NewsCategories";

const ms = require('pretty-ms');

interface NewsUpdateProps {
    update: NewsUpdate
}

const NewsRow = styled.div`
    display: grid;
    grid-template-columns: 10% 70% 20%;
`;

const NewsDate = styled.div`
    
`;

const Title = styled.div`
    grid-column-start: 2;
     white-space: nowrap;
    width: 100%;                   /* IE6 needs any width */
    overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
    -o-text-overflow: ellipsis;    /* Opera < 11*/
    text-overflow:    ellipsis; 
`;


const Category = styled.div`
    grid-column-start: 3;
`;




const dateOptions = {day: "numeric", month: "2-digit"};

export default class NewsUpdateRow extends Component<NewsUpdateProps, any> {

    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        let date = new Date(this.props.update.date).toLocaleDateString("en-US", dateOptions);

        return (
                <NewsRow>
                    <NewsDate>{date}</NewsDate>
                    <Title>{this.props.update.title}</Title>
                    <Category>{this.props.update.category}</Category>
                </NewsRow>
        )
    }
}

