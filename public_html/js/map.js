//initial map canvas
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osm = L.tileLayer(osmUrl, {maxZoom: 17});
var map = L.map('map');
map.setView([40.4521, -79.9650156], 13);
map.addLayer(osm);
createMap([]);



//add & refresh markers
function createMap(arrHighlight){
    d3.json("./dataFile/Station_info.json",function(arr){
        
        //set highlight icon
        var myIcon = L.icon({iconUrl:'./img/marker-icon-2x_red.png',
                            iconAnchor: [12,41],
                            popupAnchor: [0, -36],
                            shadowUrl:'https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png',
                            iconSize: [25,41]});

        //clear old marker
        $(".leaflet-marker-pane").empty();
        $(".leaflet-shadow-pane").empty();
        
        //add new marker
        for(var i =0;i<arr.length;i++){
            if(match(arr[i].id,arrHighlight)){
                var marker = new L.Marker(new L.latLng(arr[i].Latitude, arr[i].Longitude),{icon: myIcon,alt:arr[i].id});
                map.addLayer(marker);
                var bike_out = getHighlightBikein(arr[i].id,arrHighlight);
                marker.bindPopup('<b>StationId: '+arr[i].id+'</br>'+arr[i].Name+'</b><br>RackQnty:' +arr[i].RackQnty+'<br>Bike_out: '+bike_out+'<br><br><button style="margin:auto" id='+arr[i].id+' onclick="showDetail(this)">Show detail</button>');
            }else{
                var marker = new L.Marker(new L.latLng(arr[i].Latitude, arr[i].Longitude),{alt:arr[i].id});
                map.addLayer(marker);
                marker.bindPopup('<b>StationId: '+arr[i].id+'</br>'+arr[i].Name+'</b><br>RackQnty:' +arr[i].RackQnty+'<br><br><button style="margin:auto" id='+arr[i].id+' onclick="showDetail(this)">Show detail</button>');
            }
//            console.log($("#"+arr[i].id));
           
//            var stationId = arr[i].id;
//            marker.on("click", function(){
//                console.log($(this).attr("alt"));
////                $("#chart").addClass("hide");
////                $("#singleChart").removeClass("hide");
////                barChartTemperature(stationId);
//            });
            
       }
    });
}
$(".leaflet-marker-pane").on("click",function(e){
    var target = e.target||e.srcElement;
    if(target.nodeName.toLowerCase()=='img'){
        console.log($(target).attr('alt'));
    }
});
function showDetail(me){
    $("#chart").addClass("hide");
    $("#singleChart").removeClass("hide");
    stationId = $(me).attr("id");
    barChartTemperature(stationId);
    barChartWeather(stationId);
    scatterPlotWeekhour(stationId)
}

$("#return").on("click",function(){
    $("#chart").removeClass("hide");
    $("#singleChart").addClass("hide");
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
        default: return '#fff';
    }
};

var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
        faultstatus = ['Popular Station', 'Normal Station'];

    // loop through the status values and generate a label with a coloured square for each value
    for (var i = 0; i < faultstatus.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + getColour(faultstatus[i]) + '"></i> ' + (faultstatus[i] ? faultstatus[i] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);
