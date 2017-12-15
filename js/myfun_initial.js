/**
 * Created by shenhaichen on 12/12/2017.
 */
function draw(data) {

    function summary_method() {

        //击球率
        var l_avg_num = d3.set();
        var r_avg_num = d3.set();
        var b_avg_num = d3.set();

        //全垒数
        var l_hr_num = d3.set();
        var r_hr_num = d3.set();
        var b_hr_num = d3.set();

        //球员数量
        var r_player = 0;
        var l_player = 0;
        var b_player = 0;

        var player_plot = [];


        data.forEach(function (d) {

            if (d['handedness'] == 'R') {
                r_player += 1
                r_avg_num.add(d['avg'])
                r_hr_num.add(d['HR'])

                var r_plot = {"类型": "右手球员", "击球率": d['avg'], "本垒数": d['HR']}
                player_plot.push(r_plot)

            } else if (d['handedness'] == 'L') {
                l_player += 1
                l_avg_num.add(d['avg'])
                l_hr_num.add(d['HR'])

                var l_plot = {"类型": "左手球员", "击球率": d['avg'], "本垒数": d['HR']}
                player_plot.push(l_plot)

            } else {
                b_player += 1
                b_avg_num.add(d['avg'])
                b_hr_num.add(d['HR'])

                var b_plot = {"类型": "双手球员", "击球率": d['avg'], "本垒数": d['HR']}
                player_plot.push(b_plot)
            }


        });

        //算出球员的平均击球数,并保留两位小数
        var r_avg_mean = +d3.mean(r_avg_num.values()).toFixed(2);
        var l_avg_mean = +d3.mean(l_avg_num.values()).toFixed(2);
        var b_avg_mean = +d3.mean(b_avg_num.values()).toFixed(2);

        //算出球员的平均本垒数
        var r_hr_mean = +d3.mean(r_hr_num.values()).toFixed(2);
        var l_hr_mean = +d3.mean(l_hr_num.values()).toFixed(2);
        var b_hr_mean = +d3.mean(b_hr_num.values()).toFixed(2);

        //计算左右手,双手球员的数量,击球率,以及全垒数
        var players = [{"类型": "左手球员", "球员人数": l_player, "击球率平均值": l_avg_mean, "本垒数平均值": l_hr_mean},
            {"类型": "右手球员", "球员人数": r_player, "击球率平均值": r_avg_mean, "本垒数平均值": r_hr_mean},
            {"类型": "双手球员", "球员人数": b_player, "击球率平均值": b_avg_mean, "本垒数平均值": b_hr_mean}
        ];


        return players;
    }

    function summary_plot() {


        var player_plot = [];


        data.forEach(function (d) {

            if (d['handedness'] == 'R') {
                var r_plot = {"类型": "右手球员", "击球率": d['avg'], "本垒数": d['HR']}
                player_plot.push(r_plot)
            } else if (d['handedness'] == 'L') {
                var l_plot = {"类型": "左手球员", "击球率": d['avg'], "本垒数": d['HR']}
                player_plot.push(l_plot)

            } else {
                var b_plot = {"类型": "双手球员", "击球率": d['avg'], "本垒数": d['HR']}
                player_plot.push(b_plot)
            }

        });

        return player_plot;
    }


    //得到需要的数据和总结点
    var nested = summary_method();
    var player_plot = summary_plot();

    var svg = dimple.newSvg("#barchartContainer", 800, 600);
    var svg_plot = dimple.newSvg("#plotchartContainer", 800, 600);


    create_players();
    draw_plot();


    //建立球员数量的bar chart
    function create_players() {

        chart_player = new dimple.chart(svg, nested);
        chart_player.addCategoryAxis("x", "类型");
        chart_player.addMeasureAxis("y", "球员人数");
        chart_player.addSeries(null, dimple.plot.bar);
        chart_player.draw();

    }

    function draw_plot() {


        // Create the chart
        var myChart = new dimple.chart(svg_plot, player_plot);
        myChart.setBounds(60, 30, 420, 330)

        // Create a standard bubble of SKUs by Price and Sales Value
        // We are coloring by Owner as that will be the key in the legend
        myChart.addMeasureAxis("x", "击球率");
        myChart.addMeasureAxis("y", "本垒数");
        myChart.addSeries(["击球率","本垒数","类型"], dimple.plot.bubble);
        var myLegend = myChart.addLegend(530, 100, 60, 300, "Right");
        myChart.draw();


        //This is a critical step.  By doing this we orphan the legend. This
        //means it will not respond to graph updates.  Without this the legend
        //will redraw when the chart refreshes removing the unchecked item and
        //also dropping the events we define below.
        myChart.legends = [];

        // Get a unique list of Owner values to use when filtering
        var filterValues = dimple.getUniqueValues(player_plot, "类型");
        // Get all the rectangles from our now orphaned legend
        myLegend.shapes.selectAll("rect")
            // Add a click event to each rectangle
            .on("click", function (e) {
                // This indicates whether the item is already visible or not
                var hide = false;
                var newFilters = [];
                // If the filters contain the clicked shape hide it
                filterValues.forEach(function (f) {
                    if (f === e.aggField.slice(-1)[0]) {
                        hide = true;
                    } else {
                        newFilters.push(f);
                    }
                });
                // Hide the shape or show it
                if (hide) {
                    d3.select(this).style("opacity", 0.2);
                } else {
                    newFilters.push(e.aggField.slice(-1)[0]);
                    d3.select(this).style("opacity", 0.8);
                }
                // Update the filters
                filterValues = newFilters;
                // Filter the data
                myChart.data = dimple.filterData(player_plot, "类型", filterValues);
                // Passing a duration parameter makes the chart animate. Without
                // it there is no transition
                myChart.draw(800);
            });

    }





};
