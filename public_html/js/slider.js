// tick formatter
var formatter = d3.format(",.2f");
var tickFormatter = function(d) {
//                console.log(d);
    formatDate = d3.time.format("%b-%d");
    var timeScale = d3.time.scale().domain([new Date('2015-07-05'),new Date('2016-04-03 00:00:00')]).ticks(d3.time.week,1);
    return formatDate(timeScale[d-1]);
};

// Initialize slider
var week_index=[];
for (i=0; i<40; i++){
    week_index.push(i+1);
}
var slider = d3.slider().min(1).max(week_index.length).tickValues(week_index).stepValues(week_index).showRange(true).tickFormat(tickFormatter);



////Render the slider in the div
//var observer = new MutationObserver(function(){
//    generateTopData();
//});
//
//var config = {attributes:true,childList:true};
//$.each($('.valuechange'),function(index,val){
//    observer.observe(val,config);
//});


var weekNum = "1",dataType = "1";

d3.select('#slider').call(slider)
    .on("click", function() {
//        $('#weekNum').val(self.slider.value());
        weekNum = self.slider.value();
        generateTopData();
        barChartTemperature();
        scatterPlotWeekhour();
    }).on("mousedown",function(){
        $(this).data("flag",true);
    })
$(document).on("mousemove",function(){
    var elem = $('#slider');
    if(elem.data("flag")){
//        $('#weekNum').val(slider.value());
        weekNum = slider.value();
        generateTopData();
        barChartTemperature();
        scatterPlotWeekhour();
    }
}).on("mouseup",function(){
    $("#slider").data("flag",false);
});

    


