import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {Component} from "react";
import * as React from "react";
import styled from "styled-components";

interface ChartProps {
    data: any;
    category: string,
    value: string,
}

const Chart = styled.div`
  margin: 20px;
  height: 500px;
  width: 500px;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

export default class PieChart extends Component<ChartProps, any> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    createChart(){
        let chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.data = this.props.data;
        // chart.background.fill = am4core.color("#514663");
        chart.paddingLeft = 0;
        chart.paddingRight = 0;
        chart.scale = .9;
        chart.align = "center";

// Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
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

        let legend = new am4charts.Legend();
        legend.align = "center";
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
            <Chart id="chartdiv" />
        )
    }
}
