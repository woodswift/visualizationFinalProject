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


//$(document).ready(function()
//{
//    var $scrollbar  = $('#scrollbar')
//    ,   $overview   = $scrollbar.find(".overview")
//    ,   loadingData = false
//    ;
//
//    $scrollbar.tinyscrollbar({thumbSize : 20});
//
//    var scrollbarData = $scrollbar.data("plugin_tinyscrollbar");
//
//    $scrollbar.on("move", function()
//    {
//        console.log("success");
//        // The threshold will enable us to start loading the text before we reach the end.
//        //
//        var threshold       = 0.9
//        ,   positionCurrent = scrollbarData.contentPosition + scrollbarData.viewportSize
//        ,   positionEnd     = scrollbarData.contentSize * threshold
//        ;
//
//        // Check if have reached the "end" and that we arent allready in the process of loading new data.
//        //
//        if(!loadingData && positionCurrent >= positionEnd)
//        {
//            loadingData = true;
//
//            $.getJSON("data.json", function(data)
//            {
//                loadingData = false;
//
//                $overview.append(data.text);
//
//                scrollbarData.update("relative");
//            });
//        }
//    });
//});


