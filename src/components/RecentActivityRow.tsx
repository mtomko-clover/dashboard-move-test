import React, {Component} from "react";
import './TimeTracker.css';
import styled from "styled-components";
import RecentActivity from "../models/RecentActivity";
import {EmployeeUtil} from "../utils/EmployeeUtil";


interface ActivityProps {
    activity: RecentActivity
}

const RecentRowContainer = styled.div`
    display: grid;
    grid-template-columns: 10% 65% 25%;
    width: 100%;
`;

const ProfilePic = styled.img`
    border-radius: 50%;
    object-fit: cover;
    object-position: 100% 0;
    margin-right: 10px;
    height: 50px;
    width: 50px;
    margin-left: 20px;
    align-self: center;
`;

const Title = styled.div`
    grid-column-start: 2;
    white-space: nowrap;
    width: 100%;                   /* IE6 needs any width */
    overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
    -o-text-overflow: ellipsis;    /* Opera < 11*/
    text-overflow:    ellipsis; 
    font-size: 20px;
    padding-left: 20px;
    align-self: center;
`;


const Category = styled.div`
    grid-column-start: 3;
    font-size: 20px;
    text-align: left;
    justify-content: flex-end;
    display: flex;
    padding-right: 20px;
    align-self: center;
`;

export default class RecentActivityRow extends Component<ActivityProps, any> {

    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        let user = EmployeeUtil.getEmployeeFromUsername(this.props.activity.username);
        return (
            <RecentRowContainer>
                <ProfilePic src={user.image}/>
                <Title>{this.props.activity.title}</Title>
                <Category>{this.props.activity.category}</Category>
            </RecentRowContainer>
        )
    }
}

