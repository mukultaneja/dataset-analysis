
function getColor(range) {
  if (range < 200){
  	return '#238443';
  }else if (range > 200 && range < 500){
  	return '#DDE689';
  }else if (range > 500 && range < 800){
  	return '#EC7014';
  }else{
  	return '#D73027';
  }
}

function drawSunburst(root) {
	var width = 660,
		height = 480,
		radius = Math.min(width, height) / 2,
		utility = new Utility();

	var x = d3.scale.linear()
		.range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
		.range([0, radius]);

	var color = d3.scale.ordinal()
		.domain([0, root.success])
		.range(['#C3D476', '#E36E62'])

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			switch (d.depth) {
				case 0:
					return '<strong>root</strong>';
				case 1:
					return '<strong> Year : ' + d.name +
						'<br /> Total Place(s) : ' + d.value + '</strong>' +
						'<br /> Attacks Successesful : ' + d.success;
				case 2:
					return '<strong> Month : ' + d.name + '<br /> Total Place(s) : ' + d.value +
						'<br /> Attacks Successesful : ' +
						d.success;
					'</strong>';
				case 3:
					return '<strong> Region : ' + d.name + '<br /> Total Place(s) : ' + d.value +
						'<br /> Attacks Successesful : ' +
						d.success;
					'</strong>';
				case 4:
					return '<strong> Country : ' + d.name + '<br /> Total Place(s) : ' + d.value +
						'<br /> Attacks Successesful : ' +
						d.success;
					'</strong>';
				case 5:
					return '<strong> City : ' +
						d.name +
						'<br /> Total Place(s) : ' + d.value +
						'<br /> Attacks Successesful : ' +
						d.success;
					'</strong>';
			}
		});

	var svg = d3.select("div.sunburst").append("svg")
		.attr('viewBox', '0 0 600 480')
		.attr('preserveAspectRatio', "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + 300 + "," + (height / 2) + ")")

	svg.call(tip);

	var partition = d3.layout.partition()
		.sort(d3.ascending)
		.value(function(d) {
			return d.value > 0 ? d.value : 1;
		});

	var arc = d3.svg.arc()
		.startAngle(function(d) {
			return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
		})
		.endAngle(function(d) {
			return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
		})
		.innerRadius(function(d) {
			return Math.max(0, y(d.y));
		})
		.outerRadius(function(d) {
			return Math.max(0, y(d.y + d.dy));
		});

	// Keep track of the node that is currently being displayed as the root.
	var node;

	node = root;
	var path = svg.datum(root)
		.selectAll("path")
		.data(partition.nodes(root))
		.enter()
		.append("path")
		.attr("d", arc)
		.style("fill", function(d) {
			return color(d.success);
		})
		.style('stroke-width', 1)
		.style('stroke', 'white')
		.on("click", click)
		.each(stash)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	function click(d) {
		node = d;
		var params = {};
		var paramsKeys = new Array('year', 'month', 'region', 'country', 'city')
		var rateValue = '';
		var valueCount = 0;
		while (node.parent != undefined){
			params[paramsKeys[node.depth - 1]] = node.name;
			node = node.parent;
		}

		// recording suicide / success rate
		var checktype = $('input[name="rate"]:checked').val();
		params['checktype'] = checktype;


		rateValue += params['year'] + '/' +
					 params['month'] + '/' + 
					 params['region'] + '/' +
					 params['country'] + '/' +
					 params['city'] + '/' +
					 'sunburst' + '/' +
					 paramsKeys[d.children[0].depth - 1];

		$('input[name="rate"]').attr('attr', rateValue);

		path.transition()
			.duration(1000)
			.attrTween("d", arcTweenZoom(d));

		setTimeout(function(){
			utility.getSunburstTrendLineData(params, paramsKeys[d.children[0].depth - 1]);
		}, 1000);
	}

	d3.select(self.frameElement).style("height", height + "px");

	d3.select('div.sunburst div.loader').style('display', 'none');

	// Setup for switching data: stash the old values for transition.
	function stash(d) {
		d.x0 = d.x;
		d.dx0 = d.dx;
	}

	// When zooming: interpolate the scales.
	function arcTweenZoom(d) {
		var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
			yd = d3.interpolate(y.domain(), [d.y, 1]),
			yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
		return function(d, i) {
			return i ? function(t) {
				return arc(d);
			} : function(t) {
				x.domain(xd(t));
				y.domain(yd(t)).range(yr(t));
				return arc(d);
			};
		};
	}
}