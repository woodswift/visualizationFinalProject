barChartTemperature();
function barChartTemperature(){
    //set margin, width & height
    var margin = {top:5,right :60,bottom:0,left:60},
        w = 300-margin.left-margin.right,
        h = 100-margin.top-margin.bottom;
        
    //set color category
    var color = d3.scale.category10();
    
    //set x & y scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0,w],.1);
    var y = d3.scale.linear()
            .range([h,0]);
    
    //set x & y axis
    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);
    
    //set y grid
    var yGrid = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-w,0,0)
            .tickFormat("");
    //generate svg on in html
    var svg = d3.select("#temperature").append("svg")
            .attr("width",w+margin.left+margin.right)
            .attr("height",h+margin.top+margin.bottom)
            .append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")");
    
    //read data(name= timeType_dataType_rank.csv)
    if(dataType === '1'){
        address="week";
    }else if(dataType=='2'){
        address="month";
    }else{
        address="quarter";
    }
    d3.csv("./dataFile/"+address + "_temperature_rank.csv",generateBarChart);
   
    function generateBarChart(data){
        console.log(data);
        //select data for the current week
        var currentArry =[];
        $.each(data,function(index,val){
            if(val.Week == weekNum){
                var info = {temperature:val.TemperatureRank,
                            customer:val.Customer,
                            daily:val.Daily,
                            subscriber:val.Subscriber,
                            unknown:val.Unknown};
                currentArry.push(info);
            }
        });
        console.log(currentArry);
        
        //use the key value in the dataset to define the color domain(customer, daily, subscriber, unknown)
        color.domain(d3.keys(currentArry[0]).filter(function(key){
            return key !=="temperature";
        }));
        
        //calculate the percentage of each user type(add to a new attribute named numbers)
        var sum = 0;
        currentArry.forEach(function(d){
            sum = parseFloat(d.customer) + parseFloat(d.daily) + parseFloat(d.subscriber) + parseFloat(d.unknown);
//            console.log(sum);
            var y0 = 0;
            var i = -1;
            var list = [parseFloat(d.customer), parseFloat(d.daily), parseFloat(d.subscriber), parseFloat(d.unknown)];
            d.numbers = color.domain().map(function(name){
                    i++;
//                    console.log(list[i]);
                    return{ name: name, 
                            y0: y0 / sum,
                            y1: (y0 += list[i]) / sum,
                            sum: sum,
                            val: list[i],
                            temperature: d.temperature
                        };	
            });
//            console.log(d.numbers);
        });
        
        //set x & y domain(x->temperature type, y->0 to sum number)
        x.domain(currentArry.map(function(d){return d.temperature;}));
        y.domain([0,d3.max(data,function(d) {return d.customer + d.daily + d.subscriber + d.unknown;})]);
        
        svg.append("g")
                .attr("class","x axis")
                .attr("transform","translate(0,"+h+")")
                .call(xAxis);
        svg.append("g")
                .attr("class","y axis")
                .call(yAxis);
        svg.append("g")
                .attr("class","grid")
                .call(yGrid);
        var state = svg.selectAll(".temperature")
                .data(data)
                .enter().append("g")
                .attr("class","country")
                .attr("transform",function(d){
                    return "translate(" + x(d.state) +",0)";
                });
        state.selectAll("rect")
                .data(function(d){return d.states;})
                .enter().append("rect")
                .on("mouseover", function(d){
                    var color = $(this).css("fill");
                    $(this).css("fill","yellow");
                    $("rect").mouseout(function(){
                        $(this).css("fill",color);
                        $(this).unbind("mouseout");
                    });

                    //Get this bar's x/y values, then augment for the tooltip
                    var xPosition = parseFloat($(this).attr("val")) + x.rangeBand() / 2;
                    var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;
//                    console.log(xPosition);
                    //Update the tooltip position and value
                    d3.select("#tooltip")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px")						
                        .select("#value")
                        .text(d.val);
                    d3.select("#label").text(d.name);
                    //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function() {		   
                    //Hide the tooltip
                    d3.select("#tooltip").classed("hidden", true);
                 })
                .style("fill",function(d) {return color(d.name);})
                .attr("width",x.rangeBand())
                .attr("val",function(d){return x(d.state);})
                .attr("y",y(0))
                .attr("height",0);
    } 
}

