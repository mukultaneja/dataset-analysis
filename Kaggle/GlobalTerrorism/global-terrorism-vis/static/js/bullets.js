
function drawBulletChart(data, axisName='iyear') {
	var height = 480,
		width = 600;

	if (axisName == 'year')
		axisName = 'iyear'
	else if (axisName == 'region')
		axisName = 'region_txt'
	else if (axisName == 'country')
		axisName = 'country_txt'
	else
		axisName = axisName

	var svg = d3.select('div.bullets')
		.append('svg')
		.attr('viewBox', '0 0 650 480')
		.attr('preserveAspectRatio', "xMidYMid meet");

	var titleG = svg.append('g')
		.attr('transform', 'translate(10, 30)');

	var rectG = svg.append('g')
		.attr('transform', 'translate(50, 30)');

	var measureG = svg.append('g')
		.attr('transform', 'translate(50, 30)');

	var rangeMax = d3.max(data, function(d) {
		return d.total;
	});

	var rangeScale = d3.scale.linear()
		.domain([0, rangeMax])
		.range([0, width 	- 100]);

	var rangeTextScale = d3.scale.linear()
		.domain([0, rangeMax])
		.range([20, width - 60]);

	var titleText = titleG.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.attr('x', 0)
		.attr('y', function(d, i) {
			return i * 40 + 18;
		})
		.text(function(d) {
			return d[axisName]
		})

	var rangeRects = rectG.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', 0)
		.attr('y', function(d, i) {
			return i * 40
		})
		.attr('height', 30)
		.attr('width', function(d) {
			return rangeScale(parseInt(d.total))
		})
		.style('fill', '#C7EAFB');

	var rectText = rectG.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.attr('x', function(d) {
			return rangeTextScale(parseInt(d.total)) - 12
		})
		.attr('y', function(d, i) {
			return i * 40 + 18
		})
		.text(function(d) {
			return parseInt(d.total);
		})

	var measureRects = measureG.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', 0)
		.attr('y', function(d, i) {
			return i * 40 + 7
		})
		.attr('height', 15)
		.attr('width', function(d) {
			return rangeScale(parseInt(d.measure))
		})
		.style('fill', '#3499C5');

	var measureText = measureG.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.attr('x', function(d) {
			return 12
		})
		.attr('y', function(d, i) {
			return i * 40 + 19
		})
		.text(function(d) {
			return parseInt(d.measure);
		})
		.style('fill', 'white')
}