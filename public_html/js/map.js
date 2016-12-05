//initial map canvas
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osm = L.tileLayer(osmUrl, {maxZoom: 17});
var map = L.map('map');
map.setView([40.4521, -79.9650156], 13);
map.addLayer(osm);
createMap([]);



//add & refresh markers
function createMap(arrHighlight,forStation){
    d3.json("./dataFile/Station_info.json",function(arr){
        var iconUrl;
        if(forStation){
            iconUrl = './img/marker-icon-green.png';
        }else{
            iconUrl = './img/marker-icon-red.png';
        }
        //set highlight icon
        var myIcon = L.icon({iconUrl:iconUrl,
                            iconAnchor: [12,41],
                            popupAnchor: [0, -36],
                            shadowUrl:'https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png',
                            iconSize: [25,41]});

        //clear old marker
        $(".leaflet-marker-pane").empty();
        $(".leaflet-shadow-pane").empty();
//        $(".leaflet-popup").remove();
        
        //add new marker
        for(var i =0;i<arr.length;i++){
            var popUpHtml = '<b>'+arr[i].Name+'</b><br/><b>StationId: </b>'+arr[i].id+'<br/><b>RackQnty: </b>' +arr[i].RackQnty+'<br/><br/><button style="margin:auto" id='+arr[i].id+' onclick="showDetail(this)">Show details</button>';
            if(match(arr[i].id,arrHighlight)){
                var marker = new L.Marker(new L.latLng(arr[i].Latitude, arr[i].Longitude),{icon: myIcon,alt:arr[i].id});
                map.addLayer(marker);
//                var bike_out = getHighlightBikein(arr[i].id,arrHighlight);
                marker.bindPopup(popUpHtml);
            }else{
                var marker = new L.Marker(new L.latLng(arr[i].Latitude, arr[i].Longitude),{alt:arr[i].id});
                map.addLayer(marker);
                marker.bindPopup(popUpHtml);
            }
       }
    });
}
//$(".leaflet-marker-pane").on("click",function(e){
//    var target = e.target||e.srcElement;
//    if(target.nodeName.toLowerCase()=='img'){
//        console.log($(target).attr('alt'));
//        
//    }
//});
function showDetail(me){
    $("#chart").addClass("hide");
    $("#singleChart").removeClass("hide");
    stationId = $(me).attr("id");
    showStationDetail = true;
    $("#stationName").html(stationId);
    generateTopDataForStation(stationId);
    barChartTemperature(stationId);
    barChartWeather(stationId);
    scatterPlotWeekhour(stationId);
}

$("#return").on("click",function(){
    $("#chart").removeClass("hide");
    $("#singleChart").addClass("hide");
    showStationDetail = false;
    generateTopData();
});

//return whether the station is highlight or not
function match(id,arr){
    for(var i=0;i<arr.length;i++){
        if(id === arr[i].id) return true;
    }
    return false;
}

function getHighlightBikein(id,arr){
    for(var i = 0;i<arr.length;i++){
        if(id === arr[i].id){
            //console.log(arr[i].bikeInNum);
            return arr[i].bikeoutNum;
        } 
    }
    
}


function getColour(d) {
    switch (d) {
        case 'Popular Station': return '#e41a1c';
        case 'Normal Station': return '#3C6DDF';
        case 'Frequent Destination': return '#76e45b';
        default: return '#fff';
    }
};

var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
        faultstatus = ['Popular Station', 'Normal Station','Frequent Destination'];

    // loop through the status values and generate a label with a coloured square for each value
    for (var i = 0; i < faultstatus.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + getColour(faultstatus[i]) + '"></i> ' + (faultstatus[i] ? faultstatus[i] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);
