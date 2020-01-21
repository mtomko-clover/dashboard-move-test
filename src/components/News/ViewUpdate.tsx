import { Modal } from 'antd';
import React, { Component } from 'react';

import NewsItem from '../../models/NewsItem';
import {
  ViewRow,
  ViewKey,
  ViewCategory,
  ViewDescription,
  ViewTitle,
  ProfilePictureContainer,
  UsernameContainer,
  FullNameContainer,
} from './News.styles';
import { EmployeeUtil } from '../../utils/EmployeeUtil';
import Employee from '../../models/Employee';

interface ViewUpdateProps {
  showModal: boolean;
  modalClosed: () => void;
  update: NewsItem;
}

interface State {
  visible: boolean;
}

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class ViewUpdate extends Component<ViewUpdateProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: this.props.showModal,
    };
    this.close = this.close.bind(this);
  }

  close(): void {
    this.setState({ visible: false });
    this.props.modalClosed();
  }

  render(): React.ReactNode {
    let formatDate =
      months[this.props.update.createdAt.getMonth()] +
      '  ' +
      this.props.update.createdAt.getDate() +
      ', ' +
      this.props.update.createdAt.getFullYear();
    let user: Employee = EmployeeUtil.getEmployeeFromUsername(this.props.update.username);
    return (
      <Modal
        className="news_update"
        title="News Update"
        visible={this.state.visible}
        onOk={this.close}
        onCancel={this.props.modalClosed}
        cancelButtonProps={{ style: { display: 'none' } }}
        okText="Ok"
        afterClose={this.props.modalClosed}
        destroyOnClose={true}
      >
        <ViewTitle>{this.props.update.title}</ViewTitle>
        <ViewDescription>{this.props.update.description}</ViewDescription>
        <ViewRow>
          <UsernameContainer>
            <ProfilePictureContainer src={user.image} />
            {user.fullName && <FullNameContainer>{user.fullName}</FullNameContainer>}
            {!user.fullName && <FullNameContainer>{user.username}</FullNameContainer>}
          </UsernameContainer>
          <div className="filler" />
          <ViewKey>{formatDate}</ViewKey>
          <ViewCategory>{this.props.update.type}</ViewCategory>
        </ViewRow>
      </Modal>
    );
  }
}
