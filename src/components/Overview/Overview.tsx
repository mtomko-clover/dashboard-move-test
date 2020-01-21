import React, { ReactElement } from 'react';

import Announcements from '../Announcements/Announcements';
import RecentActivities from '../RecentActivity/RecentActivities';
import { BigCard } from '../BigCard';
import { AppApprovalsChart, AppApprovalsHistogram } from '../Charts';
import { News } from '../News';
import WeeklyDigest from './WeeklyDigest';
import OverviewProvider from './store';
import NewsProvider from '../News/store';
import AnnouncementProvider from '../Announcements/store';
import { BigRow, Column } from './Overview.styles';

const Overview = (): ReactElement => (
  <Column>
    <AnnouncementProvider>
      <Announcements />
    </AnnouncementProvider>
    <OverviewProvider>
      <WeeklyDigest />
    </OverviewProvider>
    <BigRow>
      <AppApprovalsHistogram />
    </BigRow>
    <BigRow>
      <NewsProvider>
        <News />
      </NewsProvider>
      <BigCard title="App Approvals">
        <AppApprovalsChart category="title" value="amount" />
      </BigCard>
    </BigRow>
    <BigRow>
      <RecentActivities />
      <BigCard />
    </BigRow>
  </Column>
);

export default Overview;
