import {Component} from "react";
import * as React from "react";
const ms = require('pretty-ms');

interface TaskProps {
    taskName: string,
    duration: number,
    category: any
}

export default class CompletedTask extends Component<TaskProps, any> {

    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        let duration = this.props.duration;
        return (
            <div className="row">
                <div>{this.props.taskName}</div>
                <div>{ms(duration, {verbose: true})}</div>
            </div>
        )
    }
}

