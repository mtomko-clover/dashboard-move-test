import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import React, {useEffect} from "react";

import {Chart} from "./Charts.styles";


const JiraDLVChart: React.FC = () => {
	useEffect(() => {
		am4core.useTheme(am4themesAnimated);

		const chart = am4core.create("chart-jiradlv", am4charts.XYChart);
		chart.hiddenState.properties.opacity = 0;
		chart.paddingRight = 40;

		const data = [];
		let open = 100;
		let close = 250;

		for (let i = 1; i < 366; i++) {
		open += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 4);
		close = Math.round(open + Math.random() * 5 + i / 5 - (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2);
		data.push({ date: new Date(2019, 0, i), open, close });
		}

		chart.data = data;

		const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.labels.template.truncate = true;

		const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.tooltip!.disabled = true;

		const series = chart.series.push(new am4charts.LineSeries());
		series.dataFields.dateX = "date";
		series.dataFields.openValueY = "open";
		series.dataFields.valueY = "close";
		series.tooltipText = "open: {openValueY.value} close: {valueY.value}";
		series.sequencedInterpolation = true;
		series.fillOpacity = 0.3;
		series.defaultState.transitionDuration = 1000;
		series.tensionX = 0.8;

		const series2 = chart.series.push(new am4charts.LineSeries());
		series2.dataFields.dateX = "date";
		series2.dataFields.valueY = "open";
		series2.sequencedInterpolation = true;
		series2.defaultState.transitionDuration = 1500;
		series2.stroke = chart.colors.getIndex(6);
		series2.tensionX = 0.8;

		chart.cursor = new am4charts.XYCursor();
		chart.cursor.xAxis = dateAxis;
		// chart.scrollbarX = new am4core.Scrollbar()

		return (): void => {
		if (chart && chart.dispose) {
			chart.dispose();
		}
		}
	}, [])

	return <Chart id="chart-jiradlv" />;
}

export default JiraDLVChart;
