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

	// x axis label
	svg.append("text")
		.attr("x", (width + (margin.left + margin.right)) / 2)
		.attr("y", height + margin.bottom)
		.attr("class", "text-label")
		.attr("text-anchor", "middle")
		.text("Trend Across Years.");

}