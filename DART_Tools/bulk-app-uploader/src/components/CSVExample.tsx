import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// @ts-ignore
import CSVReader from 'react-csv-reader'
import './App.css';

const papaparseOptions: any = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
};

class CSVExample extends Component {

    handleForce(result: any){
        console.log(result);
    }

    render(): React.ReactNode {
        const loginHeader = (
            <div className="row centered-vertical"><i className="fas fa-comments-dollar fa-2x margin-end"/><b>Billing Buddy</b></div>
        );
        return (
            <CSVReader
                cssClass="csv-reader-input"
                cssInputClass="css-input"
                label={loginHeader}
                onFileLoaded={this.handleForce}
                parserOptions={papaparseOptions}
                inputId="ObiWan"
                inputStyle={{color: 'red'}}
            />
        )
    }
}

export default CSVExample;
