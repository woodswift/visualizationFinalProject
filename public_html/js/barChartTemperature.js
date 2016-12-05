barChartTemperature();
function barChartTemperature(stationId){
    //set margin, width & height
    var margin = {top:50,right :50,bottom:20,left:50},
        w = 330-margin.left-margin.right,
        h = 200-margin.top-margin.bottom;
        
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
    var positionId;
    if(stationId != null) positionId = "#singleTemperatureBar";
    else positionId = "#temperatureBar";
    $(positionId).empty();
    var svg = d3.select(positionId).append("svg")
            .attr("width",w+margin.left+margin.right)
            .attr("height",h+margin.top+margin.bottom)
            .append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")");
    
    //read data(name= timeType_dataType_rank.csv)
    if(dataType === '1'){
        address="Week";
    }else if(dataType=='2'){
        address="Month";
    }else{
        address="Quarter";
    }
    var fullAddr;
    if(stationId != null) fullAddr = "Week_temperature_rank_stationId.csv";
    else fullAddr = address + "_temperature_rank.csv";
//    console.log(fullAddr);
    d3.csv("./dataFile/"+fullAddr,generateBarChart);
   
    function generateBarChart(data){
        
        //select data for the current week
        var currentArry =[];
        
        $.each(data,function(index,val){
            if(stationId != null){
                var bool = val.Week == weekNum && val.StationId == stationId
            }else{
                var bool = val.Week == weekNum
            }
            if(bool){
                if(dataType === '1'){
                    dateNum = weekNum;
                }else if(dataType=='2'){
                    dateNum = val.Month;
                }else{
                    dateNum = val.Quarter;
                }
                if(stationId != null){
                    dateNum = weekNum;
                }
                var info = {temperature:changeTempRank(val.TemperatureRank),
                            customer:val.Customer,
                            daily:val.Daily,
                            subscriber:val.Subscriber,
                            unknown:val.Unknown,
                            dateNum:dateNum};
                currentArry.push(info);
            }
        });
        function changeTempRank(temperatureRank){
            if(temperatureRank == "0"){
                return "<0";
            }else if(temperatureRank == "1"){
                return "[0,10)"
            }else if(temperatureRank == "2"){
                return "[10,20)"
            }else{
                return ">20"
            }
        }
//        console.log(currentArry);
        
        //use the key value in the dataset to define the color domain(customer, daily, subscriber, unknown)
        color.domain(d3.keys(currentArry[0]).filter(function(key){
            return key !=="temperature" && key !=="dateNum";
        }));
        
        //calculate the percentage of each user type(add to a new attribute named numbers)
        var sum = 0;
//        var maxSum = 0;
        currentArry.forEach(function(d){
            sum = parseFloat(d.customer) + parseFloat(d.daily) + parseFloat(d.subscriber) + parseFloat(d.unknown);
//            console.log(sum);
//            if (sum > maxSum) {
//                maxSum = sum;
//            }
            var y0 = 0;
            var i = -1;
            var list = [parseFloat(d.customer), parseFloat(d.daily), parseFloat(d.subscriber), parseFloat(d.unknown)];
            d.numbers = color.domain().map(function(name){
                    i++;
//                    console.log(list[i]);
                    if(y0 != 0){
                        y0temp = y0 / sum;
                    }else{
                        y0temp = 0;
                    }
                    y0 += list[i];
                    y1 = y0;
                    if(y1 != 0){
                        y1 = y1 / sum;
                    }
                    return{ name: name, 
                            y0: y0temp,
                            y1: y1,
                            sum: sum,
                            val: list[i],
                            temperature: d.temperature
                        };	
            });
//            console.log(d.numbers);
        });
//        console.log(maxSum);
        //set x & y domain(x->temperature type, y->0 to sum number)
        var maxY;
        if(stationId != null){
            maxY = d3.max(currentArry,function(d) {return parseFloat(d.customer) + parseFloat(d.daily) + parseFloat(d.subscriber) + parseFloat(d.unknown);});
        }else{
            maxY = 16.4;
        }
        x.domain(currentArry.map(function(d){return d.temperature;}));
        y.domain([0,maxY]);
        
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
        var temperature = svg.selectAll(".temperature")
                .data(currentArry)
                .enter().append("g")
                .attr("class","temperature")
                .attr("transform",function(d){
                    return "translate(" + x(d.temperature) +",0)";
                });
//        console.log(y(0));
        temperature.selectAll("rect")
                .data(function(d){return d.numbers;})
                .enter().append("rect")
                .style("fill",function(d) {return color(d.name);})
                .attr("width",x.rangeBand())
                .attr("val",function(d){return x(d.temperature);})
                .attr("y",y(0))
                .attr("height",0)
                .attr("class","dataRect")
                .transition("size")
                .duration(1000)
                .attr("y",function(d){return (y(d.y1*d.sum));})
                .attr("height",function(d){return ((y(d.y0)-y(d.y1))*d.sum);});
        
        temperature.selectAll(".dataRect")
                .on("mouseover", function(d){
                    var color = $(this).css("fill");
                    $(this).css("fill","yellow");
                    $(this).mouseout(function(){
                        $(this).css("fill",color);
                        $(this).unbind("mouseout");
                    });
                    
                    //Get this bar's x/y values, then augment for the tooltip
                    var left = parseFloat($("body").css("width"))*0.65 + margin.left;
                    var top;
                    if(stationId != null){
                        top = 40+30+15+22+15 - 25;
                    }else{
                        top = 40+40+22+20+22 - 25;
                    }
                    var xPosition = parseFloat($(this).attr("val")) + x.rangeBand() / 2 + left;
                    var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h/2 + top;
                    console.log(left)
                    console.log("x: "+xPosition);
                    console.log("y: "+yPosition);
//                      console.log(xPosition);
                    //Update the tooltip position and value
                    d3.select("#tooltip")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px")						
                        .select("#value")
                        .text(Math.round(d.val*100)/100);
                    d3.select("#label").text(d.name);
                    //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function() {		   
                    //Hide the tooltip
                    d3.select("#tooltip").classed("hidden", true);
                 })
//        console.log(y(0));
//        temperature.selectAll("rect")
            
    
         var legend = svg.selectAll(".legend")
                .data(color.domain().slice().reverse())
                .enter().append("g")
                .attr("class","legend")
                .attr("transform",function(d,i){
                return "translate(50,"+(i*15)+")";});

        legend.append("rect")
                .attr("x",w-10)
                .attr("y",-1)
                .attr("width",5)
                .attr("height",5)
                .style("fill",color);

        legend.append("text")
                .attr("x",w-15)
                .attr("y",0)
                .attr("dy",".35em")
                .style("text-anchor","end")
                .text(function(d){return d;});
        
        var title = svg.append("g")
            .data(currentArry)
            .attr("class","title");

        title.append("text")
            .attr("x",(w/2))
            .attr("y",-30)
            .attr("text-anchor","middle")
            .style("font-size","13px")
            .text(function(d){if(address=="Month"){
                                    return("Average Daily Ride Counts Versus Temperature in "+ d.dateNum)}
                              else{
                                    return("Average Daily Ride Counts Versus Temperature in "+ address + " " + d.dateNum)}
                             });
        
    } 

    var labels = svg.append("g")
            .attr("class","labels");

    labels.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",-28)
            .attr("dy",".71em")
            .style("text-anchor","end")
            .text("Daily Ride Counts");
    labels.append("text")
            .attr("y",145)
            .attr("x",270)
            .attr("dx",".71em")
            .style("text-anchor","end")
            .text("Temperature(°C)");
    
    
}

