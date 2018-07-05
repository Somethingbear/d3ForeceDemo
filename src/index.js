import * as d3 from "d3";
import "./style.css";

let svg = d3.select("svg"),
	width = svg.attr("width"),
	height = svg.attr("height");

let simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function (d) {
		return d.id;
	}))
	.force("charge", d3.forceManyBody())
	.force("center", d3.forceCenter(width / 2, height / 2));

d3.json("/miserables.json", 
	(error, graph) => {
		if (error) throw error;

		let link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter().append("line");

		let node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("r", 2.5)
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));
		
		const text = svg.append("g").attr("class", "names").selectAll("g")
			.data(graph.nodes)
			.enter().append("g");

		text.append("text")
			.attr("x", 14)
			.attr("y", ".31em")
			.attr("opacity", 0.8)
			.attr("pointer-events", "none")
			.style("font-family", "sans-serif")
			.style("font-size", "0.7em")
			.text(function (d) {
				return d.id;
			})
		
		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.distance(100)
            .links(graph.links);

		function ticked() {
			link
				.attr("x1", function (d) {
					return d.source.x;
				})
				.attr("y1", function (d) {
					return d.source.y;
				})
				.attr("x2", function (d) {
					return d.target.x;
				})
				.attr("y2", function (d) {
					return d.target.y;
				});

			node
				.attr("cx", function (d) {
					return d.x;
				})
				.attr("cy", function (d) {
					return d.y;
				});
			text
				.attr("transform",
					function (d) {
						return "translate(" + d.x + "," + d.y + ")";
					})
		}



	});

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}
