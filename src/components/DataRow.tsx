import { Component } from 'react';
import * as React from 'react';
import styled from 'styled-components';

interface ChartProps {
  label: string;
  value: any;
  link: boolean;
  linkText?: string;
}

const DataRowContainer = styled.div`
  padding: 5px;
  bottom-border: 1px solid darkgrey;
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 95%;
`;

const Label = styled.div`
  font-weight: bold;
  width: 25%;
  text-align: right;
  padding-right: 20px;
`;

const Value = styled.div`
  width: 75%;
`;

export default class DataRow extends Component<ChartProps, any> {
  // constructor(props: any) {
  //     super(props);
  // }

  render(): React.ReactNode {
    return (
      <DataRowContainer>
        <Label>{this.props.label}:</Label>
        <Value>
          {this.props.link ? (
            <a href={this.props.value} rel="noopener noreferrer" target="_blank">
              {this.props.linkText}
            </a>
          ) : (
            <div>{this.props.value}</div>
          )}
        </Value>
      </DataRowContainer>
    );
  }
}
