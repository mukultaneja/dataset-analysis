function drawSunburst(root) {
	var width = 960,
		height = 600,
		radius = Math.min(width, height) / 2;

	var x = d3.scale.linear()
		.range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
		.range([0, radius]);

	var color = d3.scale.category20c();

	var svg = d3.select("div.sunburst").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + 650 + "," + (height / 2) + ")");

	var partition = d3.layout.partition()
		.sort(d3.ascending)
		.value(function(d) {
			return d.success > 0 ? d.success : 1;
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
			return color((d.children ? d : d.parent).name);
		})
		.style('stroke-width', 1)
		.style('stroke', 'white')
		.on("click", click)
		.each(stash);

	path.append("title")
		.text(function(d, i) {
			return d.name + ' ' + d.success;
		});


	function click(d) {
		node = d;
		path.transition()
			.duration(1000)
			.attrTween("d", arcTweenZoom(d));
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