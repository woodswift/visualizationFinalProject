// tick formatter
var formatter = d3.format(",.2f");
var tickFormatter = function(d) {
//                console.log(d);
    formatDate = d3.time.format("%b-%d-%Y");
    var timeScale = d3.time.scale().domain([new Date('2015-07-05'),new Date('2016-04-03 00:00:00')]).ticks(d3.time.week,1);
    return formatDate(timeScale[d-1]);
};

// Initialize slider
var week_index=[];
for (i=0; i<40; i++){
    week_index.push(i+1);
}
var slider = d3.slider().min(1).max(week_index.length).tickValues(week_index).stepValues(week_index).showRange(true).tickFormat(tickFormatter);



//Render the slider in the div
d3.select('#slider').call(slider)
    .on("click", function() {
        d3.select('#text').text(self.slider.value());
        createMap([1001,1002]);
    })
    .on("drag", function() {
        d3.select('#text').text(self.slider.value());
        createMap([1001,1002]);
    });


