import {Dropdown, Menu, Button, Icon, notification} from "antd";
import React, {ChangeEvent, Component, KeyboardEvent} from "react";
import styled from "styled-components";

import './TimeTracker.css';
import CategoryDropdown from "./CategoryDropdown";
import {ROLES} from "../models/RoleCategories";
import {SE_Categories, TAM_Categories, TSE_Categories} from "../models/TaskCategories";
import {APP_APPROVAL_SUBCATEGORIES} from "../models/SubCategories";
// import {ClickParam} from "antd/es/menu";

const ms = require('pretty-ms');

interface TimerProps {
    setTask:(name: string, duration: number, category: any, key: any, subcategory?: any) => any;
    role: ROLES,
    index: any,
    deleteTask:(key: any) => void
}

interface State {
    time: number,
    isOn: boolean,
    start: number,
    name: string,
    duration: number,
    editing: boolean,
    category: any,
    subcategory?: any
}

const TaskTimerContainer = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const NameInput = styled.input`
    padding: 10px;
    font-size: 14px;
    margin-right: 50px;
`;

const TimerButton = styled.button`
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 50%;
`;

const FilterDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;  
  margin-right: 50px;
`;

const FilterLabel = styled.label`
  white-space: nowrap;
  margin-right: 10px;
  font-size: 18px;
`;


export class TaskTimer extends Component<TimerProps, State> {
    timer: any;
    constructor(props: any){
        super(props);
        this.getCategories = this.getCategories.bind(this);
        this.state = {
            time: 0,
            isOn: false,
            start: 0,
            name: "",
            duration: 0,
            editing: true,
            category: this.getCategories()['OTHER']
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.saveTime = this.saveTime.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.editName = this.editName.bind(this);
        this.handleNameEntry = this.handleNameEntry.bind(this);
        this.renderCategories = this.renderCategories.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setSubCategory = this.setSubCategory.bind(this);
    }

    startTimer(): void {
        if(this.state.name.length > 0) {
            this.setState({
                isOn: true,
                time: this.state.time,
                start: Date.now() - this.state.time
            });
            this.timer = setInterval(() => this.setState({
                time: Date.now() - this.state.start
            }), 1);
        } else {
            this.showEnterName();
        }
    }

    showEnterName(){
        notification.open({
            message: "Attention",
            description: "Please Enter a Task Name",
            icon: <i className="fas fa-exclamation-triangle"/>,
            placement: "topLeft"
        });
    }

    editName(){
        this.setState({ editing: true });
    }

    stopTimer() {
        this.setState({isOn: false});
        clearInterval(this.timer);
    }

    saveTime() {
        this.props.setTask(this.state.name, this.state.time, this.state.category, this.props.index, this.state.subcategory);
        this.setState({time: 0, isOn: false});
    }

    deleteTask() {
        this.props.deleteTask(this.props.index);
    }

    handleNameChange(e: ChangeEvent<any>): void {
        this.setState( {name: e.target.value});
    }

    handleNameEntry(e: KeyboardEvent<any>): void {
        if(e.key === "Enter"){
            this.setState({editing: false});
        }
    }

    categoriesDropdown(): React.ReactElement {
        const categories: any = this.getCategories();
        const elements = [];
        for (let category in categories) {
            const menuItem = <Menu.Item key={category} className="dropdown"
                                        onClick={this.setCategory}>{category}</Menu.Item>;
            elements.push(menuItem);
        }
        return <Menu>{elements}</Menu>;
    }

    renderCategories(): React.ReactElement {
        const categories = this.categoriesDropdown();
        return (
            <FilterDiv>
                {this.renderLabel("Category: ")}
                <Dropdown className="margin-start" overlay={categories}>
                    <Button size="large">
                        {this.state.category} <Icon type="down"/>
                    </Button>
                </Dropdown>
            </FilterDiv>
        )
    }


    renderLabel(text: string): React.ReactElement {
        return <FilterLabel>{text}</FilterLabel>
    }

    setCategory = (category: any) => {
        const subCategory = this.getSubCategory(category);
        console.log("subCategory", subCategory);
        this.setState({
            category: category,
            subcategory: subCategory
        });
    };

    setSubCategory(subCategory: any) {
        this.setState({ subcategory : subCategory });
    }

    getCategories(): any{
        let categories: any = null;
        if(this.props.role === ROLES.SE){
            categories = SE_Categories;
        } else if (this.props.role === ROLES.TAM){
            categories = TAM_Categories;
        } else if (this.props.role === ROLES.TSE){
            categories = TSE_Categories;
        }
        // console.log("getCategories", categories);
        return categories;
    }

    getSubCategory(category: any): any {
        let subCategories = null;
        if(category === "APP_APPROVALS"){
            subCategories = APP_APPROVAL_SUBCATEGORIES;
        }
        return subCategories;
    }

    render(): React.ReactNode {
        let start = (this.state.time === 0) ?
            <TimerButton key="start" onClick={this.startTimer}><i className="fas fa-play"/></TimerButton> :
            null;
        let stop = (this.state.time === 0 || !this.state.isOn) ?
            null :
            <TimerButton key="stop" onClick={this.stopTimer}><i className="fas fa-stop"/></TimerButton>;
        let resume = (this.state.time === 0 || this.state.isOn) ?
            null :
            <TimerButton className="margin-after" key="resume" onClick={this.startTimer}><i className="fas fa-play"/></TimerButton>;
        let reset = (this.state.time === 0 || this.state.isOn) ?
            null :
            <TimerButton key="save" onClick={this.saveTime}><i className="fas fa-save"/></TimerButton>;

        return(
            <TaskTimerContainer>
                {this.state.editing && <NameInput placeholder="Enter Task Name" type="text" value={this.state.name} onChange={this.handleNameChange} onKeyPress={this.handleNameEntry}/>}
                {!this.state.editing && <div onClick={this.editName} className="timer-title">{this.state.name}</div>}
                <CategoryDropdown categories={this.getCategories()} setCategory={this.setCategory} label="Category"/>
                {this.state.subcategory != null && <CategoryDropdown setCategory={this.setSubCategory} categories={this.state.subcategory} label="App Approval Step"/>}
                <div className="stopwatch-timer">{ms(this.state.time, {colonNotation: true})}</div>
                {start}
                {resume}
                {stop}
                {reset}
                <div className="filler"/>
                <div onClick={this.deleteTask}><i className="far fa-trash-alt fa-2x"/></div>
            </TaskTimerContainer>
        )
    }
}
