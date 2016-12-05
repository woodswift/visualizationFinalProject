scatterPlotWeekhour();

function scatterPlotWeekhour(stationId){
    var margin = {top:50,right:50,bottom:50,left:90},
        w = 430 - margin.left-margin.right,
        h = 250 - margin.top - margin.bottom;
    var x = d3.scale.linear().range([0,w]);
    var y = d3.scale.linear().range([h,0]);
    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(24);

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

    var xGrid = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
            .tickSize(-h,0,0)
            .tickFormat("");

    var yGrid = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-w,0,0)
            .tickFormat("");

    var positionId;
    if(stationId != null) positionId = "#singleWeekhourScatterPlot";
    else positionId = "#weekhourScatterPlot";
    
    $(positionId).empty();
    var svg = d3.select(positionId).append("svg")
            .attr("width",w + margin.left+margin.right)
            .attr("height",h+margin.top+margin.bottom)
            .append("g")
            .attr("transform","translate("+ margin.left +","+margin.top+")");

    var line = d3.svg.line()
            .x(function(d){return x(d.hour);})
            .y(function(d){return y(d.attendee);});
    
    if(dataType === '1'){
        address="Week";
    }else if(dataType=='2'){
        address="Month";
    }else{
        address="Quarter";
    }
    
    var fullAddr;
    if(stationId != null) fullAddr = "Week_hour_weekend_stationId.csv";
    else fullAddr = address + "_hour_weekend.csv";
    d3.csv("./dataFile/"+fullAddr,generateScatterPlot);
    
    function generateScatterPlot(data){
        //drag useful data for current week
        var currentArry =[];
//        console.log(weekNum);
        $.each(data,function(index,val){
//            console.log("data "+val.StationId);
//            console.log(stationId);
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
                var info = {hour:val.Hour,
                           weekday:val.Weekday_bike_out,
                           weekend:val.Weekend_bike_out,
                           dateNum:dateNum};
                currentArry.push(info); 
                
                
            }
        });
//        console.log(currentArry);
        //get the attributes name of each line
        //choose appropriate continents
        color.domain(d3.keys(currentArry[0]).filter(function(key){
                return key !=="hour" && key !== "dateNum";
        }));

        var continents  = color.domain().map(function(name){
            return{
                name: name,
                values: currentArry.map(function(d){
                    return {hour: d.hour,attendee: +d[name]};
                })
            };
        });
        //console.log(continents);
        //set x domain and y domain
//        x.domain(d3.extent(currentArry,function(d){return d.hour;}));
        x.domain([0,23]);
        y.domain([
            d3.min(continents,function(c){
                    return d3.min(c.values,function(v){return v.attendee;});
            }),
            d3.max(continents,function(c){
                    return d3.max(c.values,function(v){return v.attendee;});
            })
        ]);
//        console.log(x("0"));
        svg.selectAll(".dot1")
                .data(currentArry)
                .enter().append("circle")
                .attr("class","dot1")
                .attr("r",2)
                .attr("cx",function(d) {return x(d.hour);})
                .attr("cy",function(d) {return y(d.weekday);})
//                .on("mouseover", function(d){
//                    //Get this bar's x/y values, then augment for the tooltip
//                    var xPosition = parseFloat(d3.select(this).attr("cx"))+$("svg").position().left;
//                    var yPosition = parseFloat(d3.select(this).attr("cy"))+$("svg").position().top;
//                    console.log("x:"+xPosition);
//                    console.log("y:"+yPosition);
//                    //Update the tooltip position and value
//                    d3.select("#tooltip")
//                        .style("left", xPosition + "px")
//                        .style("top", yPosition + "px")						
//                        .select("#value")
//                        .text(d.ADOM);
//                    d3.select("#label").text(d.Date);
//                    //Show the tooltip
//                    d3.select("#tooltip").classed("hidden", false);
//                })
//                .on("mouseout", function() {		   
//                    //Hide the tooltip
//                    d3.select("#tooltip").classed("hidden", true);
//                 });
//
        svg.selectAll(".dot2")
                .data(currentArry)
                .enter().append("circle")
                .attr("class","dot2")
                .attr("r",2)
                .attr("cx",function(d) {return x(d.hour);})
                .attr("cy",function(d) {return y(d.weekend);})
//                .on("mouseover", function(d){
//                    //Get this bar's x/y values, then augment for the tooltip
//                    var xPosition = parseFloat(d3.select(this).attr("cx"))+$("svg").position().left;
//                    var yPosition = parseFloat(d3.select(this).attr("cy"))+$("svg").position().top;
//                    console.log("x:"+xPosition);
//                    console.log("y:"+yPosition);
//                    //Update the tooltip position and value
//                    d3.select("#tooltip")
//                        .style("left", xPosition + "px")
//                        .style("top", yPosition + "px")						
//                        .select("#value")
//                        .text(d.BDOM);
//                    d3.select("#label").text(d.Date);
//                    //Show the tooltip
//                    d3.select("#tooltip").classed("hidden", false);
//                })
//                .on("mouseout", function() {		   
//                    //Hide the tooltip
//                    d3.select("#tooltip").classed("hidden", true);
                 //});


        
        svg.append("g")
                .attr("class","grid")
                .attr("transform","translate(0,"+h+")")
                .call(xGrid);
        svg.append("g")
                .attr("class","grid")
                .call(yGrid);
        
        svg.append("g")
                .attr("class","x axis")
                .attr("transform","translate(0,"+h+")")
                .call(xAxis);
        svg.append("g")
                .attr("class","y axis")
                .call(yAxis);
        
        var continent = svg.selectAll(".continent")
                .data(continents)
                .enter().append("g")
                .attr("class","continent");

        continent.append("path")
                .attr("class","line")					
                .attr("d",function(d) {return line(d.values);})
                .style("stroke",function(d) {return color(d.name);});
//
//    //    console.log(color.domain().slice());
        var legend = svg.selectAll(".legend")
               .data(color.domain())
               .enter().append("g")
               .attr("class","legend")
               .attr("transform",function(d,i){return "translate(0,"+(i*20+10)+")";})
               .style("margin-top","30px");

        legend.append("rect")
               .attr("x",w-18)
               .attr("y",-5)
               .attr("width",10)
               .attr("height",10)
               .style("fill",color);

        legend.append("text")
               .attr("x",w-24)
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
                .style("font-size","14px")
                .text(function(d){if(address=="Month"){
                                    return("Temporal Ride Patterns in the Course of Day During "+ d.dateNum)}
                                  else{
                                    return("Temporal Ride Patterns in the Course of Day During "+ address + " " + d.dateNum)}
                                 });

    }
//
    var labels = svg.append("g")
            .attr("class","labels");

    labels.append("text")
            .attr("transform","translate(0,"+h+")")
            .attr("x",(w-margin.right))
            .attr("y",7)
            .attr("dx","1.90em")
            .attr("dy","2.0em")
            .text("Hour");
    
    labels.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",-32)
            .attr("dy",".71em")
            .style("text-anchor","end")
            .text("Hourly Ride Counts");
//
    
//
    }
    
