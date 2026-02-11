"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import { SlideElement } from "@/lib/types/presentation";

interface ChartElementProps {
	element: SlideElement;
	isSelected: boolean;
}

interface ChartData {
	type: string;
	chartTitle?: string;
	labels: string[];
	values: number[];
	colors?: string[];
}

export default function ChartElement({
	element,
	isSelected,
}: ChartElementProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	// Parse chart data from element content
	const parseChartData = (): ChartData | null => {
		try {
			const content = element.content || "";

			// Try to parse as JSON
			if (content.startsWith("{")) {
				return JSON.parse(content);
			}

			// Default data if parsing fails
			return {
				type: "bar",
				labels: ["Q1", "Q2", "Q3", "Q4"],
				values: [30, 45, 25, 60],
				colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
			};
		} catch (error) {
			console.error("Error parsing chart data:", error);
			return {
				type: "bar",
				labels: ["Q1", "Q2", "Q3", "Q4"],
				values: [30, 45, 25, 60],
				colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
			};
		}
	};

	useEffect(() => {
		if (!svgRef.current) return;

		const chartData = parseChartData();
		if (!chartData) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const width = element.size.width;
		const height = element.size.height;
		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		const chartType = chartData.type || "bar";

		// Create scales
		const xScale = d3
			.scaleBand()
			.domain(chartData.labels)
			.range([0, chartWidth])
			.padding(0.1);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(chartData.values) || 100])
			.nice()
			.range([chartHeight, 0]);

		const colorScale = d3
			.scaleOrdinal()
			.domain(chartData.labels)
			.range(chartData.colors || d3.schemeCategory10);

		// Create chart group
		const chartGroup = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Add background
		chartGroup
			.append("rect")
			.attr("width", chartWidth)
			.attr("height", chartHeight)
			.attr("fill", element.style?.backgroundColor || "#ffffff")
			.attr("rx", 8);

		switch (chartType) {
			case "bar":
				// Draw bars
				chartGroup
					.selectAll("rect")
					.data(chartData.values)
					.enter()
					.append("rect")
					.attr("x", (_, i) => xScale(chartData.labels[i]) || 0)
					.attr("y", (d) => yScale(d))
					.attr("width", xScale.bandwidth())
					.attr("height", (d) => chartHeight - yScale(d))
					.attr("fill", (_, i) => colorScale(chartData.labels[i]))
					.attr("rx", 2);

				// Add value labels on top of bars
				chartGroup
					.selectAll(".bar-label")
					.data(chartData.values)
					.enter()
					.append("text")
					.attr("class", "bar-label")
					.attr(
						"x",
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.attr("y", (d) => yScale(d) - 5)
					.attr("text-anchor", "middle")
					.attr("font-size", "12px")
					.attr("font-weight", "bold")
					.attr("fill", "#374151")
					.text((d) => d);

				// Add x-axis
				const xAxis = chartGroup
					.append("g")
					.attr("transform", `translate(0,${chartHeight})`)
					.call(d3.axisBottom(xScale));

				xAxis
					.selectAll("text")
					.attr("font-size", "11px")
					.attr("fill", "#6b7280");

				// Add y-axis
				const yAxis = chartGroup.append("g").call(d3.axisLeft(yScale).ticks(5));

				yAxis
					.selectAll("text")
					.attr("font-size", "11px")
					.attr("fill", "#6b7280");

				yAxis.select(".domain").attr("stroke", "#e5e7eb");

				xAxis.select(".domain").attr("stroke", "#e5e7eb");

				break;

			case "line":
				const line = d3
					.line<number>()
					.x(
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.y((d) => yScale(d))
					.curve(d3.curveMonotoneX);

				// Draw line
				chartGroup
					.append("path")
					.datum(chartData.values)
					.attr("fill", "none")
					.attr("stroke", colorScale(chartData.labels[0]))
					.attr("stroke-width", 3)
					.attr("d", line);

				// Draw points
				chartGroup
					.selectAll("circle")
					.data(chartData.values)
					.enter()
					.append("circle")
					.attr(
						"cx",
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.attr("cy", (d) => yScale(d))
					.attr("r", 5)
					.attr("fill", "#ffffff")
					.attr("stroke", colorScale(chartData.labels[0]))
					.attr("stroke-width", 2);

				// Add value labels
				chartGroup
					.selectAll(".line-label")
					.data(chartData.values)
					.enter()
					.append("text")
					.attr("class", "line-label")
					.attr(
						"x",
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.attr("y", (d) => yScale(d) - 10)
					.attr("text-anchor", "middle")
					.attr("font-size", "11px")
					.attr("font-weight", "bold")
					.attr("fill", "#374151")
					.text((d) => d);

				// Add axes
				chartGroup
					.append("g")
					.attr("transform", `translate(0,${chartHeight})`)
					.call(d3.axisBottom(xScale));

				chartGroup.append("g").call(d3.axisLeft(yScale));

				break;

			case "pie":
				const radius = Math.min(chartWidth, chartHeight) / 2;
				const pie = d3.pie<number>().value((d) => d);
				const arc = d3
					.arc<d3.PieArcDatum<number>>()
					.innerRadius(0)
					.outerRadius(radius);

				const pieData = pie(chartData.values);

				const pieGroup = chartGroup
					.append("g")
					.attr("transform", `translate(${chartWidth / 2},${chartHeight / 2})`);

				// Draw pie slices
				pieGroup
					.selectAll("path")
					.data(pieData)
					.enter()
					.append("path")
					.attr("d", arc)
					.attr("fill", (_, i) => colorScale(chartData.labels[i]))
					.attr("stroke", "#ffffff")
					.attr("stroke-width", 2);

				// Add labels
				pieGroup
					.selectAll(".pie-label")
					.data(pieData)
					.enter()
					.append("text")
					.attr("class", "pie-label")
					.attr("transform", (d) => {
						const [x, y] = arc.centroid(d);
						return `translate(${x},${y})`;
					})
					.attr("text-anchor", "middle")
					.attr("dy", "0.35em")
					.attr("font-size", "12px")
					.attr("font-weight", "bold")
					.attr("fill", "#ffffff")
					.text((d, i) => chartData.labels[i]);

				// Add percentages
				pieGroup
					.selectAll(".pie-percentage")
					.data(pieData)
					.enter()
					.append("text")
					.attr("class", "pie-percentage")
					.attr("transform", (d) => {
						const [x, y] = arc.centroid(d);
						return `translate(${x},${y + 15})`;
					})
					.attr("text-anchor", "middle")
					.attr("font-size", "10px")
					.attr("fill", "#ffffff")
					.text((d) => {
						const total = d3.sum(chartData.values);
						const percentage = ((d.data / total) * 100).toFixed(1);
						return `${percentage}%`;
					});

				break;

			case "area":
				const area = d3
					.area<number>()
					.x(
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.y0(chartHeight)
					.y1((d) => yScale(d))
					.curve(d3.curveMonotoneX);

				// Draw area
				chartGroup
					.append("path")
					.datum(chartData.values)
					.attr("fill", colorScale(chartData.labels[0]) + "40")
					.attr("stroke", colorScale(chartData.labels[0]))
					.attr("stroke-width", 2)
					.attr("d", area);

				// Add line on top
				const areaLine = d3
					.line<number>()
					.x(
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.y((d) => yScale(d))
					.curve(d3.curveMonotoneX);

				chartGroup
					.append("path")
					.datum(chartData.values)
					.attr("fill", "none")
					.attr("stroke", colorScale(chartData.labels[0]))
					.attr("stroke-width", 2)
					.attr("d", areaLine);

				// Add points
				chartGroup
					.selectAll("circle")
					.data(chartData.values)
					.enter()
					.append("circle")
					.attr(
						"cx",
						(_, i) =>
							(xScale(chartData.labels[i]) || 0) + xScale.bandwidth() / 2,
					)
					.attr("cy", (d) => yScale(d))
					.attr("r", 4)
					.attr("fill", "#ffffff")
					.attr("stroke", colorScale(chartData.labels[0]))
					.attr("stroke-width", 2);

				// Add axes
				chartGroup
					.append("g")
					.attr("transform", `translate(0,${chartHeight})`)
					.call(d3.axisBottom(xScale));

				chartGroup.append("g").call(d3.axisLeft(yScale));

				break;
		}

		// Add chart title if exists
		const title = chartData.chartTitle || element.style?.chartTitle;
		if (title) {
			svg
				.append("text")
				.attr("x", width / 2)
				.attr("y", 15)
				.attr("text-anchor", "middle")
				.attr("font-size", "16px")
				.attr("font-weight", "bold")
				.attr("fill", "#111827")
				.text(title);
		}

		// Add grid lines for bar and line charts
		if (chartType === "bar" || chartType === "line" || chartType === "area") {
			const yTicks = yScale.ticks(5);
			chartGroup
				.selectAll(".grid-line")
				.data(yTicks)
				.enter()
				.append("line")
				.attr("class", "grid-line")
				.attr("x1", 0)
				.attr("x2", chartWidth)
				.attr("y1", (d) => yScale(d))
				.attr("y2", (d) => yScale(d))
				.attr("stroke", "#e5e7eb")
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", "3,3");
		}
	}, [element.content, element.size.width, element.size.height, element.style]);

	return (
		<div
			className={cn(
				"absolute cursor-pointer",
				isSelected && "ring-2 ring-primary ring-offset-2",
			)}
			style={{
				left: element.position.x,
				top: element.position.y,
				width: element.size.width,
				height: element.size.height,
				transform: `rotate(${element.rotation || 0}deg)`,
				opacity: element.style?.opacity || 1,
			}}
		>
			<svg
				ref={svgRef}
				width="100%"
				height="100%"
				style={{
					backgroundColor: element.style?.backgroundColor || "#ffffff",
					borderRadius: element.style?.borderRadius
						? `${element.style.borderRadius}px`
						: "8px",
					borderWidth: element.style?.borderWidth || 1,
					borderColor: element.style?.borderColor || "#e5e7eb",
					borderStyle: element.style?.borderStyle || "solid",
					boxShadow: element.style?.boxShadow,
				}}
			/>
		</div>
	);
}
