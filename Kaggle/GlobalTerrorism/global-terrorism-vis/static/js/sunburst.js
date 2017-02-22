
function createSunburst(root) {
	var width = 960,
		height = 500,
		radius = Math.min(width, height) / 2;

	var x = d3.scale.linear()
		.range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
		.range([0, radius]);

	var color = d3.scale.category20c();

	d3.select("div.sunburst svg").remove();
	d3.select('div.sunburst p').remove();
	d3.select('div.sunburst div.loader').style('display', 'block');

	var svg = d3.select("div.sunburst").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 3 + "," + (height / 2 + 10) + ")");

	var partition = d3.layout.partition()
		.sort(d3.ascending)
		.value(function(d) {
			return d.success;
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
	path.append("svg:title")
		.text(function(d, i) {
			return d.name;
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

	// When switching data: interpolate the arcs in data space.
	function arcTweenData(a, i) {
		var oi = d3.interpolate({
			x: a.x0,
			dx: a.dx0
		}, a);

		function tween(t) {
			var b = oi(t);
			a.x0 = b.x;
			a.dx0 = b.dx;
			return arc(b);
		}
		if (i == 0) {
			// If we are on the first arc, adjust the x domain to match the root node
			// at the current zoom level. (We only need to do this once.)
			var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
			return function(t) {
				x.domain(xd(t));
				return tween(t);
			};
		} else {
			return tween;
		}
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