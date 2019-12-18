import Modal from "antd/lib/modal";
import React, {ChangeEvent, Component} from "react";
import styled from "styled-components";

import './TimeTracker.css';
import CategoryDropdown from "./CategoryDropdown";
import {ROLES} from "../models/RoleCategories";
import Task from "../models/Task";

// const ms = require('pretty-ms');

interface TaskProps {
    showModal: boolean
    modalClosed:() => void
    task: Task
    role: ROLES
    updateTask:(task: Task) => void
}

interface State {
    visible: boolean,
    name: string,
    duration: number,
    category: any,
    hours: number,
    minutes: number,
    seconds: number
}

const EditRow = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
`;

const EditLabel = styled.div`
        font-size: 18px;
        font-style: bold;
        margin-right: 10px;
`;

const TimeLabel = styled.div`
        font-size: 18px;
        font-style: bold;
        margin-right: 5px;
`;


const EditInput = styled.input`
        font-size: 18px;
        font-style: bold;
        padding: 10px;
`;

const NumberInput = styled.input`
        font-size: 16px;
        font-style: bold;
        padding: 5px;
        width: 70px;
        text-align: center;
`;


export default class EditTask extends Component<TaskProps, State> {

    constructor(props: any) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.getHours = this.getHours.bind(this);
        this.getMinutes = this.getMinutes.bind(this);
        this.getSeconds = this.getSeconds.bind(this);
        this.updateHours = this.updateHours.bind(this);
        this.updateMinutes = this.updateMinutes.bind(this);
        this.updateSeconds = this.updateSeconds.bind(this);
        this.calculateNewDuration = this.calculateNewDuration.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.state = {
            visible: this.props.showModal,
            name: this.props.task.name,
            duration: this.props.task.duration,
            category: this.props.task.category,
            hours: this.getHours(this.props.task.duration),
            minutes: this.getMinutes(this.props.task.duration),
            seconds: this.getSeconds(this.props.task.duration)
        };
        console.log("initial Task", this.props.task);
    }

    handleOk(): void {
        let task = new Task(this.state.name, this.state.duration, this.state.category, this.props.task.key);
        this.props.updateTask(task);
        this.setState({ visible: false });
        this.props.modalClosed();
    }

    handleCancel(): void {
        this.setState({ visible: false });
        this.props.modalClosed();
    }

    handleNameChange(e: ChangeEvent<any>): void {
        this.setState( {name: e.target.value});
    }

    setCategory(category: any){
        this.setState({
            category: category
        });
    }

    getHours(duration: number): number {
        return Math.trunc(((duration / (1000*60*60)) % 24));
    }

    getMinutes(duration: number): number {
        return Math.trunc(((duration / (1000*60)) % 60));
    }

    getSeconds(duration: number): number {
        return +((duration / 1000) % 60).toFixed(1);
    }

    calculateNewDuration(hours: number, minutes: number, seconds: number){
        let hourMillis = hours * 3600000;
        let minuteMillis = minutes * 60000;
        let secondMillis = seconds * 1000;
        this.setState({duration: (hourMillis + minuteMillis + secondMillis)});
    }

    updateMinutes(e: ChangeEvent<any>): void {
        let minutes = e.target.value;
        this.setState({minutes:minutes});
        this.calculateNewDuration(this.state.hours, minutes, this.state.seconds);
    }

    updateHours(e: ChangeEvent<any>): void {
        let hours = e.target.value;
        this.setState({hours: hours});
        this.calculateNewDuration(hours, this.state.minutes, this.state.seconds);
    }

    updateSeconds(e: ChangeEvent<any>): void {
        let seconds = e.target.value;
        console.log(seconds);
        this.setState({seconds:e.target.value});
        this.calculateNewDuration(this.state.hours, this.state.minutes, seconds);
    }


    render(): React.ReactNode {
        return (
            <Modal
                title="Edit Task"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                afterClose={this.props.modalClosed}
                destroyOnClose={true}>
                <EditRow>
                    <EditLabel>Task Name:</EditLabel>
                    <EditInput type="text" value={this.state.name} onChange={this.handleNameChange}/>
                </EditRow>
                <EditRow>
                    <EditLabel>Duration:</EditLabel>
                    <TimeLabel>H</TimeLabel>
                    <NumberInput className="margin-after" type="number" value={this.state.hours} onChange={this.updateHours}/>
                    <TimeLabel>M</TimeLabel>
                    <NumberInput className="margin-after" type="number" value={this.state.minutes} onChange={this.updateMinutes}/>
                    <TimeLabel>S</TimeLabel>
                    <NumberInput className="margin-after" type="number" value={this.state.seconds} onChange={this.updateSeconds}/>
                </EditRow>
                <EditRow>
                    <CategoryDropdown role={this.props.role} setCategory={this.setCategory}/>
                </EditRow>
            </Modal>
        )
    }
}

