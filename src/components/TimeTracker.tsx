import React, {Component, ReactElement} from "react";
import {TaskTimer} from "./TaskTimer";
import styled from "styled-components";
import "./TimeTracker.css";
import CompletedTask from "./CompletedTask";
import EditTask from "./EditTask";
import Task from "../models/Task";
import {ROLES} from "../models/RoleCategories";

const uuid  = require("react-uuid");
// const ms = require("pretty-ms");

interface State {
    phoneCallDuration: number
    completedTasks: Map<string, Task>
    tasks: Map<string, ReactElement>,
    role: ROLES,
    showEditPopup: boolean,
    taskToEdit: Task,
}

const TimeTrackingContainer = styled.div`
    padding: 10px;
    width: 80%;
    margin: auto;
    background: #f5f3f2;
    margin-top: 50px;
`;

const AddTaskButton = styled.button`
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 5px;
`;

export default class TimeTracker extends Component<any, State> {

    constructor(props: any) {
        super(props);
        this.setTask = this.setTask.bind(this);
        this.renderCompletedTasks = this.renderCompletedTasks.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.deleteCompletedTask = this.deleteCompletedTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.modalClosed = this.modalClosed.bind(this);
        this.updateTask = this.updateTask.bind(this);
        let first_uuid = uuid();
        let map = new Map<string, ReactElement>();
        map.set(first_uuid, <TaskTimer key={first_uuid} index={first_uuid} setTask={this.setTask} deleteTask={this.deleteTask} role={ROLES.TAM}/>);
        this.state = {
            phoneCallDuration: 0,
            completedTasks: new Map<string, Task>(),
            tasks: map,
            role: ROLES.TAM,
            showEditPopup: false,
            taskToEdit: new Task("", 0, null, null)
        };

    }

    setTask(name: string, duration: number, category: any, key: string, subCategory?: any){
        let task = new Task(name, duration, category, key, subCategory);
        let tasks = this.state.completedTasks;
        tasks.set(key, task);
        this.setState({ phoneCallDuration: duration, completedTasks: tasks});
        this.deleteTask(key.toString());
        if(this.state.tasks.size < 1){
            this.addNewTask();
        }
    }

    deleteTask(key: any){
        let tasks = this.state.tasks;
        tasks.delete(key);
        this.setState({tasks: tasks});
        if(this.state.tasks.size < 1){
            this.addNewTask();
        }
    }

    deleteCompletedTask(key: any){
        let tasks = this.state.completedTasks;
        tasks.delete(key);
        this.setState({completedTasks: tasks});
    }

    renderCompletedTasks(): React.ReactElement {
        const elements: any = [];
        this.state.completedTasks.forEach( task => {
            let completedTask = <CompletedTask key={task.key} task={task} deleteCompletedTask={this.deleteCompletedTask} editTask={this.editTask}/>;
            elements.push(completedTask);
        });
        return(<div>{elements}</div>)
    }

    addNewTask(): void {
        let tasks = this.state.tasks;
        let new_uuid = uuid();
        tasks.set(new_uuid, <TaskTimer key={new_uuid} index={new_uuid} setTask={this.setTask} deleteTask={this.deleteTask} role={this.state.role}/>);
        this.setState({tasks: tasks});
    }

    editTask(task: Task): void{
        this.setState({ showEditPopup: true, taskToEdit: task });
    }

    modalClosed(): void {
        this.setState({showEditPopup: false});
    }

    updateTask(task: Task): void {
        let tasks = this.state.completedTasks;
        tasks.set(task.key, task);
        this.setState({completedTasks: tasks});
    }

    renderTasks(): React.ReactElement {
        const elements: any = [];
        this.state.tasks.forEach( task => {
            elements.push(task);
        });
        return(<div>{elements}</div>)
    }

    render(): React.ReactNode {
        return (
            <TimeTrackingContainer>
                {this.state.showEditPopup && <EditTask showModal={this.state.showEditPopup} modalClosed={this.modalClosed} task={this.state.taskToEdit} role={this.state.role} updateTask={this.updateTask}/>}
                {this.renderTasks()}
                <div className="add-task">
                    <AddTaskButton onClick={this.addNewTask}><i className="fas fa-plus margin-after"/>Add New Task</AddTaskButton>
                </div>
                {this.state.completedTasks.size > 0 &&
                <div>
                    <div className="display-title">Completed Tasks</div>
                    {this.renderCompletedTasks()}
                </div>
                }
            </TimeTrackingContainer>
        )
    }
}

