/**
 * Created by shenhaichen on 12/12/2017.
 */
function draw(data) {

    //var margin = 75,
    //    width = 1400 - margin,
    //    height = 600 - margin;

    //var svg = d3.select("body")
    //    .append("svg")
    //    .attr("width", width + margin)
    //    .attr("height", height + margin)
    //    .append('g')
    //    .attr('class', 'map');

    function summary_method() {

        //击球率
        var l_avg_num = d3.set();
        var r_avg_num = d3.set();
        var b_avg_num = d3.set();

        //球员数量
        var r_player = 0;
        var l_player = 0;
        var b_player = 0;

        data.forEach(function (d) {

            if (d['handedness'] == 'R') {
                r_player += 1
                r_avg_num.add(d['avg'])
            } else if (d['handedness'] == 'L') {
                l_player += 1
                l_avg_num.add(d['avg'])
            } else {
                b_player += 1
                b_avg_num.add(d['avg'])
            }
        });

        //算出球员的平均击球率,并保留两位小数
        var r_avg_mean = +d3.mean(r_avg_num.values()).toFixed(2);
        var l_avg_mean = +d3.mean(l_avg_num.values()).toFixed(2);
        var b_avg_mean = +d3.mean(b_avg_num.values()).toFixed(2);


        //计算左右手,双手球员的数量,击球率,以及全垒数
        var players = [{"类型": "左手球员", "球员人数": l_player, "avg_mean": l_avg_mean},
            {"类型": "右手手球员", "球员人数": r_player, "avg_mean": r_avg_mean},
            {"类型": "双手球员", "球员人数": b_player, "avg_mean": b_avg_mean}
        ];

        return players;
    }

    var nested = summary_method();

    var svg = dimple.newSvg("body", 800, 600);
    var chart = new dimple.chart(svg, nested);
    chart.addCategoryAxis("x", "类型");
    chart.addMeasureAxis("y", "球员人数");
    chart.addSeries(null, dimple.plot.bar);
    chart.draw();

};
