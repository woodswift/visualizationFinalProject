 document.getElementById('map').innerHTML="";

 var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osm = L.tileLayer(osmUrl, {maxZoom: 17});
        //create map
        var map = L.map('map');
        map.setView([40.4521, -79.9650156], 13);
        map.addLayer(osm);

var myIcon = L.icon({iconUrl:'marker-icon-2x_red.png',iconSize: [25,41]});

var arr = [{"id":"1001","latitude":40.428658,"longitude":-79.965228},{"id":"1002","latitude":40.440877,"longitude":-80.00308},{"id":"1003","latitude":40.444614,"longitude":-79.9958114}];

var arrHighlight = ["1001","1002"];

function createMap(arrHighlight){
	  for(var i =0;i<arr.length;i++){
	  	if(match(arr[i].id,arrHighlight)){
	  		map.addLayer(new L.Marker(new L.latLng(arr[i].latitude, arr[i].longitude),{icon: myIcon}));	
	  	}else{
	  		map.addLayer(new L.Marker(new L.latLng(arr[i].lontitude, arr[i].latitude)));
	  	}
	  }
}

function match(id,arr){
	for(var i=0;i<arr.length;i++){
		if(id == arr[i]) return true;
	}
	return false;
}