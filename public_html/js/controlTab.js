$("#weekTab").on("click",clickEvent);
$("#monthTab").on("click",clickEvent);
$("#quarterTab").on("click",clickEvent);

function clickEvent(){
    if($(this).attr("class")==="tabUnselected"){
        $(this).removeClass("tabUnselected");
        $(this).addClass("tabSelected");
        $(this).siblings().removeClass();
        $(this).siblings().addClass("tabUnselected");
//        $("#dataFileType").val($(this).attr("val"));
        dataType = $(this).attr("val");
        generateTopData();
        barChartTemperature();
    }
}


