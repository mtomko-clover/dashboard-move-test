import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import React, {Component} from "react";

import {Chart} from "./Charts.styles";


interface ChartProps {
    data: any;
    category: string;
    value: string;
}

export default class AppApprovalsChart extends Component<ChartProps, any> {
    createChart(): void {
        const chart = am4core.create("chart-appapprovals", am4charts.PieChart);
        chart.data = this.props.data;
        // chart.background.fill = am4core.color("#514663");
        chart.paddingLeft = 0;
        chart.paddingRight = 0;
        chart.scale = 1;
        chart.align = "center";

// Add and configure Series
        const pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = this.props.value;
        pieSeries.dataFields.category = this.props.category;
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

    componentDidMount(): void {
        this.createChart();
    }

    render(): React.ReactNode {
        return (
            <Chart id="chart-appapprovals" />
        )
    }
}
