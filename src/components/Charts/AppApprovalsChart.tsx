import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import moment from "moment";
import React, {useContext, useEffect, ReactElement} from "react";

import {StoreContext} from "../Overview/store";
import {Chart} from "./Charts.styles";


type QueryResult = {
    value: number;
    __typename: string;
}

type ChartData = {
    amount: number;
    title: string;
}

interface AppApprovalsChartProps {
    category: string;
    value: string;
}

const AppApprovalsChart = ({ category, value }: AppApprovalsChartProps): ReactElement | null => {
    const { dateStore: { date } } = useContext(StoreContext);
    const dateF = "YYYY-MM-DD";
    const start = moment(date).startOf("week").format(dateF);
    const end = moment(date).endOf("week").format(dateF);
    const variables = { variables: { start, end } };
    const query = gql`
        query ($start: String, $end: String) {
            appsApproved(start: $start, end: $end) {
			    value
            }
            appsRejected(start: $start, end: $end) {
			    value
            }
            appsSubmitted(start: $start, end: $end) {
			    value
            }
            appsPending {
                value
            }
        }
    `;
    const { data } = useQuery(query, variables);
    let dataArray: Array<ChartData | void> = [];
    if (data) {
        dataArray = Object.entries(data).map(([key, value]) => ({ title: key, amount: (value as QueryResult).value }));
    }
    
    useEffect(() => {
        const chart = am4core.create("chart-appapprovals", am4charts.PieChart);

        if (dataArray.length) {
            chart.data = dataArray;
            chart.paddingLeft = 0;
            chart.paddingRight = 0;
            chart.scale = 1;
            chart.align = "center";
    
            // Add and configure Series
            const pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = value;
            pieSeries.dataFields.category = category;
            pieSeries.labels.template.disabled = true;
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.slices.template.strokeWidth = 1;
            pieSeries.slices.template.strokeOpacity = 1;
    
            // This creates initial animation
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            pieSeries.hiddenState.properties.startAngle = -90;
    
            const legend = new am4charts.Legend();
            legend.align = "center";
            legend.position = "right";
            legend.contentAlign = "center";
            legend.horizontalCenter = "middle";
            pieSeries.legendSettings.valueText = "{value}";
            chart.legend = legend;
        }

        return (): void => {
			if (chart && chart.dispose) {
				chart.dispose();
			}
		}
    }, [category, dataArray, value])

    return <Chart id="chart-appapprovals" />
}

export default AppApprovalsChart;