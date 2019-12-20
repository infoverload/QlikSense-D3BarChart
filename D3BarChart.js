define( ['./d3/d3'], function ( d3 ) {
		'use strict';

		return {
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions : {
						uses : "dimensions",
					},
					measures : {
						uses : "measures",
					}
				}
			},
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [
						{
							qWidth: 10,
							qHeight: 100
						}
					]
				}
			},

			// Rendering logic
			paint: function ($element, layout) {
				var dataset = dataExtract(layout);
				var canvas_id  = "chartcontainer_" + layout.qInfo.qId;
				var ext_width = $element.width();
				var ext_height = $element.height();
			 
				if (document.getElementById(canvas_id)) { // check if element exists
					$("#" + canvas_id).empty(); // if it does, empty it
				}
				else {
					$element.append($('<div />;')
					        .attr("id", canvas_id).width(ext_width).height(ext_height));  //if not, create it
				}

				d3ChartInitialRender(d3, dataset, ext_width, ext_height, canvas_id);
			}
		};
} );

var dataExtract = function(l) {  
	var t = null;
	if (l.qHyperCube && l.qHyperCube.qDataPages[0].qMatrix) {  
		var t = [],
			r = 0,
			n = l.qHyperCube.qDataPages[0].qMatrix.length;
		l.qHyperCube.qDataPages[0].qMatrix.forEach(function(l) {  
			var i = [];
			i.push(l[0].qText), i.push(l[1].qNum), t.push(i), r++
		});
	}
	return t
}

var d3ChartInitialRender = function(d3, dataset, w, h, canvas_id) {
	var yPadding = 40, xPadding = 70;

    // Scale 
	var yScale = d3.scaleLinear()
				.domain([0, d3.max(dataset, function(d) { return d[1]; })])
				.range([h-yPadding, yPadding]); // inverted

	var xScale = d3.scaleBand()
				.domain(dataset.map(function(d) { return d[0]; }))
				.rangeRound([xPadding, w-xPadding])
				.paddingInner(0.05);

    // Select SVG
	var svg = d3.select("#"+canvas_id)
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	// Chart 
	var bars = svg.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("x",function(d, i) {
				return xScale(d[0]);
			})
		    .attr("y", function(d) {
				return Math.round(yScale(d[1]));
			})
			.attr("width",xScale.bandwidth() )
			.attr("height", function(d) {
				return h - yPadding - Math.round(yScale(d[1]));
			})
			.attr("fill","teal");

    // Axis
	var xAxis = d3.axisBottom().scale(xScale);
	var yAxis = d3.axisLeft().scale(yScale);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - yPadding) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + xPadding + ",0)")
		.call(yAxis);
}
