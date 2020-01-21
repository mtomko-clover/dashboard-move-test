import React, { Component } from 'react';
import '../TimeTracking/TimeTracker.css';
import styled from 'styled-components';
import RecentActivity from '../../models/RecentActivity';
import { EmployeeUtil } from '../../utils/EmployeeUtil';

interface ActivityProps {
  activity: RecentActivity;
}

const RecentRowContainer = styled.div`
  display: grid;
  grid-template-columns: 10% 70% 20%;
  width: 100%;
`;

const ProfilePic = styled.img`
  border-radius: 50%;
  object-fit: cover;
  object-position: 100% 0;
  height: 32px;
  width: 32px;
  align-self: center;
  margin-left: 15px;
`;

const Title = styled.div`
  grid-column-start: 2;
  white-space: nowrap;
  width: 100%; /* IE6 needs any width */
  overflow: hidden; /* "overflow" value must be different from  visible"*/
  -o-text-overflow: ellipsis; /* Opera < 11*/
  text-overflow: ellipsis;
  font-size: 16px;
  padding-left: 20px;
  align-self: center;
  color: ${({ theme }): string => theme.linkDark};
`;

const Category = styled.div`
  grid-column-start: 3;
  font-family: Maison Mono;
  font-size: 12px;
  text-align: left;
  justify-content: flex-end;
  display: flex;
  justify-content: flex-start;
  align-self: center;
  padding-right: 20px;
  grid-column-start: 3;
  text-align: left;
  font-family: Maison Mono;
  font-size: 12px;
`;

export default class RecentActivityRow extends Component<ActivityProps, {}> {
  render(): React.ReactNode {
    const user = EmployeeUtil.getEmployeeFromUsername(this.props.activity.username);
    return (
      <RecentRowContainer>
        <ProfilePic src={user.image} />
        <Title>{this.props.activity.title}</Title>
        <Category>{this.props.activity.category}</Category>
      </RecentRowContainer>
    );
  }
}
