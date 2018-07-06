import * as d3 from "d3";
import "./style.css";

let svg = d3.select("svg"),
	width = svg.attr("width"),
	height = svg.attr("height");

let marker = svg.append("marker")
	//.attr("id", function(d) { return d; })
	.attr("id", "arrow")
	.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
	// .attr("markerUnits","userSpaceOnUse")
	//.attr("viewBox", "0 -5 10 10")//坐标系的区域
	.attr("refX", 15.5)//箭头坐标
	.attr("refY", 5)
	.attr("markerWidth", 10)//标识的大小
	.attr("markerHeight", 10)
	.attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
	// .attr("stroke-width",2)//箭头宽度
	.append("path")
	.attr("d", "M0,0 L0,10 L10,5")//箭头的路径
	.attr('fill','#aaa');//箭头颜色

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
			.enter().append("line")
			.attr("marker-end", "url(#arrow)" );;

		let node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("r", 5.5)
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
			.distance(300)
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
