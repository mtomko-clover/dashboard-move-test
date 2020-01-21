import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { DatePicker } from 'antd';
import { RangePickerPresetRange, RangePickerValue } from 'antd/lib/date-picker/interface';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import moment from 'moment';
import React, { useEffect, useState, ReactElement } from 'react';

import { BigCard } from '../BigCard';
import { Chart } from './Charts.styles';

type QueryResult = {
  date: number;
  approved: number;
  rejected: number;
  submitted: number;
  pending: number;
  __typename: string;
};

const AppApprovalsHistogram = (): ReactElement | null => {
  const { RangePicker } = DatePicker;
  const thisMonth: RangePickerPresetRange = [moment().startOf('month'), moment().endOf('month')];
  const lastThreeMonths: RangePickerPresetRange = [
    moment()
      .startOf('month')
      .subtract(3, 'months'),
    moment().endOf('month'),
  ];
  const [dates, setDate] = useState<RangePickerValue>(thisMonth);
  const dateFormat = 'YYYY-MM-DD';
  const start = moment(dates[0] || moment())
    .startOf('week')
    .format(dateFormat);
  const end = moment(dates[1] || moment())
    .endOf('week')
    .format(dateFormat);
  const variables = { variables: { start, end } };
  const query = gql`
    query($start: String, $end: String) {
      jiraStats(start: $start, end: $end) {
        date
        approved
        rejected
        submitted
        pending
      }
    }
  `;

  const { data } = useQuery(query, variables);
  console.log('AppApprovalsHistogram: ', dates, data);
  let dataArray: Array<QueryResult | void> = [];
  if (data) {
    // Format date and sort the array based on date
    dataArray = data.jiraStats
      .map((obj: QueryResult) => ({
        ...obj,
        date: moment(Number(obj.date)).format('YYYY-MM-DD'),
      }))
      .sort((x: QueryResult, y: QueryResult) => x.date > y.date);
  }

  useEffect(() => {
    // Create series
    function createSeries(chart: any, field: string, name: string, hidden: boolean) {
      const series = chart.series.push(new am4charts.CandlestickSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = 'date';
      series.name = name;
      series.tooltipText = '{dateX}: [b]{valueY}[/]';
      series.strokeWidth = 5;
      series.hidden = hidden !== false;

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = am4core.color('#fff');
      bullet.circle.strokeWidth = 1;
    }

    if (data) {
      const chart = am4core.create('histogram-appapprovals', am4charts.XYChart);

      chart.data = dataArray;
      chart.paddingLeft = 0;
      chart.paddingRight = 25;
      chart.paddingBottom = 0;

      // Create axes
      const categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
      categoryAxis.renderer.grid.template.location = 0;

      chart.yAxes.push(new am4charts.ValueAxis());

      createSeries(chart, 'approved', 'App Approvals', false);
      createSeries(chart, 'rejected', 'App Rejections', true);
      createSeries(chart, 'submitted', 'App Submissions', true);
      createSeries(chart, 'pending', 'Apps Pending', true);

      chart.legend = new am4charts.Legend();
      chart.cursor = new am4charts.XYCursor();

      chart.legend.itemContainers.template.events.on('hit', ev => {
        const series = ev.target.dataItem!.dataContext;
        setTimeout(() => {
          chart.series.each(item => (item !== series ? item.hide() : item.show()));
        }, 10);
      });

      return (): void => {
        if (chart && chart.dispose) {
          chart.dispose();
        }
      };
    }
  }, [dataArray, data]);

  return (
    <BigCard
      title="App Approvals"
      headerChild={
        <RangePicker
          defaultValue={lastThreeMonths}
          onChange={(d): void => setDate(d)}
          value={dates}
          ranges={{
            Today: [moment(), moment()],
            'This Month': thisMonth,
            'Last 3 Months': lastThreeMonths,
          }}
        />
      }
    >
      <Chart id="histogram-appapprovals" />
    </BigCard>
  );
};

export default AppApprovalsHistogram;
