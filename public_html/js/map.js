// get the data url, x&y means the coordinates, z means zoom
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osm = L.tileLayer(osmUrl, {maxZoom: 17});
//create map
var map = L.map('map');
map.setView([40.4521, -79.9650156], 13);
map.addLayer(osm);

       
        
