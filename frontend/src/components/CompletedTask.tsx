import {Component} from "react";
import * as React from "react";
import './TimeTracking/TimeTracker.css';
import styled from "styled-components";
import Task from "../models/Task";
const ms = require('pretty-ms');

interface TaskProps {
    task: Task,
    deleteCompletedTask:(key: any) => void,
    editTask:(task: Task) => void
}

const CompletedTaskContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export default class CompletedTask extends Component<TaskProps, any> {

    constructor(props: any) {
        super(props);
        this.deleteTask = this.deleteTask.bind(this);
        this.editTask = this.editTask.bind(this);
    }

    deleteTask(){
        this.props.deleteCompletedTask(this.props.task.key);
    }

    editTask(){
        this.props.editTask(this.props.task);
    }

    render(): React.ReactNode {
        let duration = this.props.task.duration;
        let subcategory = this.props.task.subcategory !== null;
        return (
            <CompletedTaskContainer>
                <div className="row center-align filler" onClick={this.editTask}>
                    <i className="far fa-check-circle green fa-2x margin-after"/>
                    <div className="timer-title">{this.props.task.name}</div>
                    <div className="category">Category: {this.props.task.category}</div>
                    { subcategory && <div className="category">Subcategory: {this.props.task.subcategory}</div> }
                    <div className="render-time"><i className="far fa-clock margin-after"/>{ms(duration, {verbose: true})}</div>
                    <div className="filler"/>
                </div>
                <div onClick={this.deleteTask}><i className="far fa-trash-alt fa-2x"/></div>
            </CompletedTaskContainer>
        )
    }
}

