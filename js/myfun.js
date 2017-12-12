/**
 * Created by shenhaichen on 12/12/2017.
 */
function draw(data) {

    /*
     D3.js setup code
     */

    "use strict";
    var margin = 75,
        width = 1400 - margin,
        height = 600 - margin;

    var title = d3.select("body")
        .append("h2")
        .text("World Cup Attendance")



    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'chart');

    /*
     Dimple.js Chart construction code
     */

    var myChart = new dimple.chart(svg, data);
    var x = myChart.addTimeAxis("x", "year");
    myChart.addMeasureAxis("y", "attendance");
    x.dateParseFormat = "%Y";
    //按年份输出标签
    x.tickFormat = "%Y";
    //每4年一次输出标签
    x.timeInterval = 4

//
//          addseries函数第一个变量是一个分类器,比如输入stage,就会把bar chart按stage分类
    myChart.addSeries(null, dimple.plot.line);
    myChart.addSeries(null, dimple.plot.scatter);

    myChart.draw();


};
