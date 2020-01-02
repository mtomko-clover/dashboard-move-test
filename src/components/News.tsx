import {Component} from "react";
import * as React from "react";
import './TimeTracker.css';
import styled from "styled-components";
const ms = require('pretty-ms');

interface NewsProps {
}

const NewsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
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

const dummyData = {

}

export default class News extends Component<NewsProps, any> {

    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <NewsContainer>
               <NewsHeader>
                   Newsssssss
                   <div className="filler"/>
                   <i className="fas fa-ellipsis-h"/>
               </NewsHeader>
                stuff
            </NewsContainer>
        )
    }
}

