function wrap() {
	var self = d3.select(this),
		textLength = self.node().getComputedTextLength(),
		text = self.text(),
		width = 50,
		padding = 3;
	while (textLength > (width - 5 * padding) && text.length > 0) {
		text = text.slice(0, -1);
		self.text(text + '...');
		textLength = self.node().getComputedTextLength();
	}
}

function drawTrendLine(data, t = 'success', axisName = 'iyear') {
	var height = 420;
	var width = 600;
	var margin = {
		top: 20,
		right: 20,
		bottom: 50,
		left: 30
	};

	var decimalFormat = d3.format("0.2f");

	// if (axisName == 'month'){
	// 	var allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	// 	data.month.sort(function(a,b){
	// 	    return allMonths.indexOf(a) > allMonths.indexOf(b);
	// 	});
	// }

	if (axisName == 'region')
		axisName = 'region_txt'
	else if (axisName == 'country')
		axisName = 'country_txt'

	console.log(axisName)
	var svg = d3.select("div.trend-line")
		.append("svg")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr('viewBox', '0 0 650 500')
		.attr('preserveAspectRatio', "xMidYMid meet");

	svg.append("g")
		.attr("class", "y axis");

	svg.append("g")
		.attr("class", "x axis");

	var xScale = d3.scale.ordinal()
		.rangeRoundBands([margin.left, width], .15);

	var yScale = d3.scale.linear()
		.range([height, 50]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(10);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var xLabels = data.map(function(d) {
		return d[axisName];
	})
	xScale.domain(xLabels);
	yScale.domain([0, d3.max(data, function(d) {
		return d[t];
	})]);

	// var line = d3.svg.line()
	// 	.x(function(d) {
	// 		return xScale(d['iyear']);
	// 	})
	// 	.y(function(d) {
	// 		return yScale(d[t]);
	// 	});

	// svg.append("path")
	// 	.datum(data)
	// 	.attr("class", "line")
	// 	.attr("d", line)
	// 	.attr('transform', 'translate(60, 0)');

	// svg.selectAll('circle')
	// 	.data(data)
	// 	.enter()
	// 	.append('circle')
	// 	.attr('cx', function(d) {
	// 		return xScale(d['iyear'])
	// 	})
	// 	.attr('cy', function(d) {
	// 		return yScale(d[t])
	// 	})
	// 	.attr('r', 5)
	// 	.attr('transform', 'translate(60, -10)')
	// 	.style('fill', 'blue');

	var rectTip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			if (axisName == 'region_txt')
				return 'Region : ' + ' ' + d[axisName] + '<br />' + t + ' : ' + d[t]
			else if (axisName == 'country_txt')
				return 'Country : ' + ' ' + d[axisName] + '<br />' + t + ' : ' + d[t]
			else if (axisName == 'iyear')
				return 'Year : ' + ' ' + d[axisName] + '<br />' + t + ' : ' + d[t]
			else
				return axisName + ' : ' + d[axisName] + '<br />' + t + ' : ' + d[t]
		});

	var rects = svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', function(d) {
			return xScale(d[axisName])
		})
		.attr('y', function(d) {
			return yScale(d[t])
		})
		.attr('transform', 'translate(39, 0)')
		.attr('width', 40)
		.attr('height', 0)
		.on('mouseover', rectTip.show)
		.on('mouseout', rectTip.hide);

	rects.transition()
		.duration(1000)
		.attr('height', function(d) {
			return height - yScale(d[t])
		})
		.style('fill', '#BA88D4');

	rects.call(rectTip);
	svg.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.attr('x', function(d) {
			return xScale(d[axisName])
		})
		.attr('y', function(d) {
			return yScale(d[t])
		})
		.attr('transform', 'translate(45, -5)')
		.text(function(d) {
			return d[t];
		})
		.style('fill', 'black');

	svg.select(".x.axis")
		.attr("transform", "translate(32," + (height) + ")")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "end")
		.each(wrap)

	svg.select(".y.axis")
		.attr("transform", "translate(" + (60) + ",20)")
		.call(yAxis);

	// chart title
	// svg.append("text")
	// 	.attr("x", (width + (margin.left + margin.right) )/ 2)
	// 	.attr("y", 0 + margin.top)
	// 	.attr("text-anchor", "middle")
	// 	.style("font-size", "16px")
	// 	.style("font-family", "sans-serif")
	// 	.text("USD/EURO Exhange Rate");

	// x axis label
	svg.append("text")
		.attr("x", (width + (margin.left + margin.right)) / 2)
		.attr("y", height + margin.bottom)
		.attr("class", "text-label")
		.attr("text-anchor", "middle")
		.text("Trend Across Years.");

	// // get the x and y values for least squares
	var xSeries = d3.range(1, xLabels.length + 1);
	var ySeries = data.map(function(d) {
		return parseFloat(d[t]);
	});

	var leastSquaresCoeff = leastSquares(xSeries, ySeries);

	// apply the reults of the least squares regression
	// var x1 = xLabels[0];
	// var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
	// var x2 = xLabels[xLabels.length - 1];
	// var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
	// var trendData = [
	// 	[x1, y1, x2, y2]
	// ];

	// var trendline = svg.selectAll(".trendline")
	// 	.data(trendData);

	// trendline.enter()
	// 	.append("line")
	// 	.attr("class", "trendline")
	// 	.attr("x1", function(d) {
	// 		return xScale(d[0]) + 50;
	// 	})
	// 	.attr("y1", function(d) {
	// 		return yScale(d[1]);
	// 	})
	// 	.attr("x2", function(d) {
	// 		return xScale(d[2]) + 80;
	// 	})
	// 	.attr("y2", function(d) {
	// 		return yScale(d[3]);
	// 	})
	// 	.attr("stroke", "black")
	// 	.attr("stroke-width", 1);

	// // display equation on the chart
	// svg.append("text")
	// 	.text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " + 
	// 		decimalFormat(leastSquaresCoeff[1]))
	// 	.attr("class", "text-label")
	// 	.attr("x", function(d) {return xScale(x2) - 300;})
	// 	.attr("y", function(d) {return yScale(y2) - 30;});

	// // display r-square on the chart
	// svg.append("text")
	// 	.text("r-sq: " + decimalFormat(leastSquaresCoeff[2]))
	// 	.attr("class", "text-label")
	// 	.attr("x", function(d) {return xScale(x2) - 300;})
	// 	.attr("y", function(d) {return yScale(y2) - 10;});

	// returns slope, intercept and r-square of the line
	function leastSquares(xSeries, ySeries) {
		var reduceSumFunc = function(prev, cur) {
			return prev + cur;
		};

		var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
		var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

		var ssXX = xSeries.map(function(d) {
				return Math.pow(d - xBar, 2);
			})
			.reduce(reduceSumFunc);

		var ssYY = ySeries.map(function(d) {
				return Math.pow(d - yBar, 2);
			})
			.reduce(reduceSumFunc);

		var ssXY = xSeries.map(function(d, i) {
				return (d - xBar) * (ySeries[i] - yBar);
			})
			.reduce(reduceSumFunc);

		var slope = ssXY / ssXX;
		var intercept = yBar - (xBar * slope);
		var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

		return [slope, intercept, rSquare];
	}
}