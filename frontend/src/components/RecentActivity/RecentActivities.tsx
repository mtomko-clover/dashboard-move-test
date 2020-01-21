import React, { Component } from 'react';
import { BigCard } from '../BigCard';
import { List } from 'antd';
import { ACTIVITY_CATEGORIES } from '../../models/RecentActivityCategories';
import RecentActivityRow from './RecentActivityRow';
import RecentActivity from '../../models/RecentActivity';

const dummyData = [
  new RecentActivity(
    'aditya.singh',
    'Adi just presented an app to the Legal team',
    ACTIVITY_CATEGORIES.GCAL,
  ),
  new RecentActivity('ricardo.ventura', 'Ricardo met with a partner', ACTIVITY_CATEGORIES.GCAL),
  new RecentActivity('nahmadkhani', 'Nazanin approved an app', ACTIVITY_CATEGORIES.JIRA),
  new RecentActivity(
    'emily.lucek',
    'Emily updated a Confluence page',
    ACTIVITY_CATEGORIES.CONFLUENCE,
  ),
  new RecentActivity(
    'nicholas.ho',
    'Nicholas closed an Intercom conversation',
    ACTIVITY_CATEGORIES.INTERCOM,
  ),
  new RecentActivity('rachel', 'Rachel created a JIRA Dashboard', ACTIVITY_CATEGORIES.JIRA),
  new RecentActivity('maricris.bonzo', 'Maricris uploaded a video', ACTIVITY_CATEGORIES.YOUTUBE),
  new RecentActivity('mike.tomko', 'Tomko met with Albertsons', ACTIVITY_CATEGORIES.GCAL),
  new RecentActivity(
    'paul.petyo',
    'Paul deescalated an escalation',
    ACTIVITY_CATEGORIES.CONFLUENCE,
  ),
];

export default class RecentActivities extends Component<any, any> {
  constructor(props: {}) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <BigCard title="Recent Activity">
        <List
          className="full-width margin-bottom"
          itemLayout="horizontal"
          dataSource={dummyData}
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 7,
          }}
          renderItem={item => (
            <List.Item className="horizontal-padding">
              <RecentActivityRow activity={item} />
            </List.Item>
          )}
        />
      </BigCard>
    );
  }
}
