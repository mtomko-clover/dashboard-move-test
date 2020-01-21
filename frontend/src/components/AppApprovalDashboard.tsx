import { Component } from 'react';
import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 5px;
  bottom-border: 1px solid darkgrey;
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 95%;
`;

export default class AppApprovalDashboard extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render(): React.ReactNode {
    return <Container></Container>;
  }
}
