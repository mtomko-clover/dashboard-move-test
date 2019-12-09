import * as React from "react";
import {Component} from "react";
import {TaskTimer} from "./TaskTimer";
import Task from "../models/Task";
import CompletedTask from "./CompletedTask";
import styled from "styled-components";
import {ROLES} from "../models/RoleCategories";

const ms = require('pretty-ms');

interface State {
    phoneCallDuration: number
    completedTasks: Task[]
    tasks: React.ReactElement[],
    role: ROLES
}

const AddTaskButton = styled.button`
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 5px;
`;

export default class TimeTracker extends Component<any, State> {

    constructor(props: any) {
        super(props);
        this.setDuration = this.setDuration.bind(this);
        this.renderCompletedTasks = this.renderCompletedTasks.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.state = {
            phoneCallDuration: 0,
            completedTasks: [],
            tasks: [<TaskTimer key="first_task" setDuration={this.setDuration} role={ROLES.BA}/>],
            role: ROLES.BA
        };

    }

    setDuration(name: string, duration: number, category: any){
        //Eventually the Category will come from the role
        let task = new Task(name, duration, category);
        let tasks = this.state.completedTasks;
        tasks.push(task);
        this.setState({ phoneCallDuration: duration, completedTasks: tasks});
        console.log(this.state);
    }

    renderCompletedTasks(): React.ReactElement {
        console.log("inside renderCompletedTasks");
        const elements = [];
        for(let i = 0; i< this.state.completedTasks.length; i++){
            let task = this.state.completedTasks[i];
            let completedTask = <CompletedTask taskName={task.name} duration={task.duration} category={task.category}/>;
            elements.push(completedTask);
        }
        return(<div>{elements}</div>)
    }

    addNewTask(): void {
        let tasks = this.state.tasks;
        tasks.push(<TaskTimer key={this.state.tasks.length + 1} setDuration={this.setDuration} role={this.state.role}/>);
        this.setState({tasks: tasks});
    }

    renderTasks(): React.ReactElement {
        return <div>{this.state.tasks}</div>
    }


    render(): React.ReactNode {
        return (
            <div>
                {this.renderTasks()}
                <AddTaskButton onClick={this.addNewTask}><i className="fas fa-plus margin-after"/>Add New Task</AddTaskButton>
                {this.renderCompletedTasks()}
            </div>
        )
    }
}

