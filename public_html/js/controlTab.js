$("#weekTab").on("click",clickEvent);
$("#monthTab").on("click",clickEvent);
$("#quarterTab").on("click",clickEvent);

function clickEvent(){
    if($(this).attr("class")==="tabUnselected"){
        $(this).removeClass("tabUnselected");
        $(this).addClass("tabSelected");
        $(this).siblings().removeClass("tabSelected");
        $(this).siblings().addClass("tabUnselected");
        var id = $(this).attr("id");
        if(id == "weekTab"){
            $(this).attr("style","border-right:1px solid black;");
            $("#monthTab").attr("style","border-right:0px;");
        }else if(id == "monthTab"){
            $("#weekTab").attr("style","border-right:0px;");
            $(this).attr("style","border-right:1px solid black;");
        }else{
            $("#weekTab").attr("style","border-right:0px;");
            $("#monthTab").attr("style","border-right:0px;");
        }
//        $("#dataFileType").val($(this).attr("val"));
        dataType = $(this).attr("val");
        generateTopData();
        barChartTemperature();
        barChartWeather();
        scatterPlotWeekhour();
    }
}


