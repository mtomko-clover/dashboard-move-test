import {Component} from "react";
import * as React from "react";
import { TestTimer } from "./TestTimer";

interface State {
    phoneCallDuration: number
}

export default class TimeTracker extends Component<any, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            phoneCallDuration: 0
        }
    }

    startPhoneCallDuration(): void{
        const startTime = Date.now() - this.state.phoneCallDuration;
        const timer = setInterval(() => {
            this.setState({ phoneCallDuration: Date.now() - startTime });
        });
    }

    stopPhoneCallDuration():void {

    }

    render(): React.ReactNode {
        return (
            <div>
                I WILL BE THE TIME TRACKAAAAAA
                <div>Phone Call
                    <div>{this.state.phoneCallDuration}</div>
                <button onClick={this.startPhoneCallDuration}>Start</button></div>
                <button onClick={this.stopPhoneCallDuration}>Stop</button>


                <TestTimer/>
            </div>
        )
    }
}

