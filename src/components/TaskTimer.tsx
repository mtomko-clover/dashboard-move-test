import * as React from "react";
import {ChangeEvent, Component, KeyboardEvent} from "react";
import {Dropdown, Menu, Button, Icon, Select} from "antd";
import styled from "styled-components";
import './TimeTracker.css';
import {ROLES} from "../models/RoleCategories";
import {BA_Categories, TAM_Categories, TSE_Categories} from "../models/TaskCategories";
import {ClickParam} from "antd/es/menu";

const ms = require('pretty-ms');

interface TimerProps {
    setDuration:(name: string, duration: number, category: any) => any;
    role: ROLES
}

interface State {
    time: number,
    isOn: boolean,
    start: number,
    name: string,
    duration: number,
    editing: boolean,
    category: any
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
    margin-right: 20px;
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
  margin-right: 20px;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  white-space: nowrap;
  margin-right: 10px;
`;

let timer: any = null;

export class TaskTimer extends Component<TimerProps, State> {
    constructor(props: any){
        super(props);
        this.getCategories = this.getCategories.bind(this);
        console.log("categories", this.getCategories());
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
    }

    startTimer(): void {
        this.setState({
            isOn: true,
            time: this.state.time,
            start: Date.now() - this.state.time
        });
        timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 1);
    }

    editName(){
        this.setState({ editing: true });
    }

    stopTimer() {
        this.setState({isOn: false});
        clearInterval(timer);
    }

    saveTime() {
        this.props.setDuration(this.state.name, this.state.time, this.state.category);
        this.setState({time: 0, isOn: false});
    }

    handleNameChange(e: ChangeEvent<any>): void {
        this.setState( {name: e.target.value});
    }

    handleNameEntry(e: KeyboardEvent<any>): void {
        if(e.key === "Enter"){
            this.setState({editing: false});
        }
    }

    getCategories(): any{
        let categories: any = null;
        if(this.props.role === ROLES.BA){
            categories = BA_Categories;
        } else if (this.props.role === ROLES.TAM){
            categories = TAM_Categories;
        } else if (this.props.role === ROLES.TSE){
            categories = TSE_Categories;
        }
        return categories;
    }

    categoriesDropdown(): React.ReactElement {
        const categories: any = this.getCategories();
        const elements = [];
        for (let category in categories) {
            const menuItem = <Menu.Item key={category}
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
                        <Button>
                            {this.state.category} <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </FilterDiv>
            )
    }


    renderLabel(text: string): React.ReactElement {
        return <FilterLabel>{text}</FilterLabel>
    }

    setCategory = (e: ClickParam) => {
        const category = e.key;
        // @ts-ignore
        this.setState({
            category: category
        });
    };

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
                <div className="stopwatch-timer">{ms(this.state.time, {colonNotation: true})}</div>
                {this.renderCategories()}
                {start}
                {resume}
                {stop}
                {reset}
            </TaskTimerContainer>
        )
    }
}
