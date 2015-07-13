var urlGeoJson = 'geojson/';
var urlFiles = '';
var idEntidad = 3;
var layersMarkers = [];
	layersMarkers[layersMarkers.length] = ['base_1','Mapa',''];
	layersMarkers[layersMarkers.length] = ['base_3','Satelital',''];
	layersMarkers[layersMarkers.length] = [idEntidad+'_40','Atracciones','atraccion.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_10','Bares','bar.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_7','Cines','cinema.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_19','Comisaría','policia.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_14','E. de servicio','estacionservicio.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_13','Farmacia','farmacia.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_9','Hospedaje','hotel.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_31','Hospital','hospital.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_41','Kiosco','kiosco.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_42','Playas','playa.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_36','Pto de Pesca','pesca.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_3','Restaurante','restaurant.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_23','Supermercado','supermarket.png'];
	layersMarkers[layersMarkers.length] = [idEntidad+'_39','Teatros','teatro.png'];
	
var map;
var view;
var overviewmapCtrol;
var urlTile;
var urlWMS;
var mapFile;

var posActual = [-6407450.284762575, -4578989.533552803];
var posInicial = [-6407450.284762575, -4578989.533552803];
var featurePosActual;

var opClick = 0;

var sourceLyBusqueda; // source utilizado para el layer medir distancia y area
var vectorLyBusqueda; // ly utilizado para medir distancia y area
var drawInteraction; // interacion para dibujar
var measureTooltip; // tooltip

var sourceLyDibujo; // source utilizado para el layer dibujar
var vectorLyDibujo; // ly utilizado para dibujar

var cantCapasBases = 0; // cantidad de capas bases que existen
var osm = null; // OpenStreetMap
var mapQuest = null; // mapQuest
var bingMapsSatelital = null;
var bingMaps = null;

$( document ).ready( function() { 
	inicializar(); 
	//navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);  
    var watchID = navigator.geolocation.watchPosition(onSuccessGPS, onErrorGPS, { timeout: 3000, enableHighAccuracy: true  });
});
$( window ).resize( function() { 
	$('#map').css("height", $( window ).height());
	map.updateSize();
});

function armarMenuLayers(){
	var html = '';
	
	for (var i=0; i<layersMarkers.length; i++){
		html += '<div id="div'+layersMarkers[i][0]+'" class="col-xs-6" style="padding:0px;margin:0;">';
		html += '	 <div class="panel panel-default" style="padding:0px;margin:2px;"><div class="panel-body" style="padding:4px;margin:2px;">';
		html += '		<a href="javascript: activarLayer(\''+layersMarkers[i][0]+'\')">';
		if (layersMarkers[i][2] != ''){
			html += '			<img id="img'+layersMarkers[i][0]+'" src="'+urlFiles+'iconos/'+layersMarkers[i][2]+'" style="margin: 0 auto 0 auto;"> ';
		}
		html += '		'+layersMarkers[i][1]+'</a>';
		html += '	</div></div>';
		html += '</div>';
	}
	
	$('#divMenuLayers').html(html);
	
	$('#divbase_1').css("background-color","#D5D5D5");
}

function inicializar(){
	
	armarMenuLayers();
	
	$('#map').css("height", $( window ).height());
	
	urlTile = "";
	urlWMS = "";
	mapFile = "";
		
	osm = new ol.layer.Tile({
		id: 'base_'+1,
		name: 'osm',
		type: 'base',
		title: 'Open Street Map',
		visible: true,
		source: new ol.source.OSM()
	});
	
	bingMaps = new ol.layer.Tile({
		id: 'base_'+2,
		name: 'bingMaps',
		type: 'base',
		title: 'Bing Maps',
		visible: false,
		source: new ol.source.BingMaps({
			key: 'AiWOEQkUaequRY_hR9K9vBorMmutTibMfX6YMe4QPZj78A_7yaA-IiOPjngEO-Zb',
			imagerySet: 'Road'})
	});
	
	bingMapsSatelital = new ol.layer.Tile({
		id: 'base_'+3,
		name: 'bingMapsSatelital',
		type: 'base',
		title: 'Bing Satelital',
		visible: false,
		source: new ol.source.BingMaps({
			key: 'AiWOEQkUaequRY_hR9K9vBorMmutTibMfX6YMe4QPZj78A_7yaA-IiOPjngEO-Zb',
			imagerySet:'AerialWithLabels'})
	});
	
	mapQuest = new ol.layer.Tile({
		id: 'base_'+4,
		name: 'watercolor',
		type: 'base',
		title: 'Map Quest',
		visible: false,
		source: new ol.source.MapQuest({layer: 'osm'})
	});
	
	var layersBases = [osm, bingMaps, bingMapsSatelital, mapQuest];
	cantCapasBases = layersBases.length;
	/* END crea los mapas bases */
	
	view = new ol.View({
		center: posInicial,
		zoom: 13
	});
	/**/
	
	map = new ol.Map({
		target: 'map',
		layers: layersBases,
		view: view
	});
	
	map.on('click', function(evt) {
		displayFeatureInfo(evt.pixel);
	});
	
	view.setCenter(posInicial);
}

function activarLayer(idLayer){
	var layers = map.getLayers().getArray(); 
	var layer = layers.filter(function(ly) {
		return ly.get('id') == idLayer; 
	});
	
	if (layer.length > 0){		
		if ((idLayer == 'base_1') || (idLayer == 'base_3')){
			var layer1 = layers.filter(function(ly) {
				return ly.get('id') == 'base_1'; 
			});
			layer1 = layer1[0];
			layer1.setVisible( ! layer1.getVisible());
			
			var layer3 = layers.filter(function(ly) {
				return ly.get('id') == 'base_3'; 
			});
			layer3 = layer3[0];
			layer3.setVisible( ! layer3.getVisible());
			
			$('#divbase_1').css("background-color","#FFF");
			$('#divbase_3').css("background-color","#D5D5D5");
			if (layer1.getVisible()){
				$('#divbase_1').css("background-color","#D5D5D5");
				$('#divbase_3').css("background-color","#FFF");
			}
		} else{
			layer = layer[0];
			layer.setVisible( ! layer.getVisible());
			
			$('#div'+idLayer).css("background-color","#FFF");
			if (layer.getVisible()){
				$('#div'+idLayer).css("background-color","#D5D5D5");
			}
		}
	} else{
		$('#div'+idLayer).css("background-color","#D5D5D5");
		var vectorLayer = new ol.layer.Vector({
			id: idLayer,
			source: new ol.source.GeoJSON({
				projection: 'EPSG:3857',
				url: urlGeoJson+idLayer+'.geojson'
			}),
			style: function(feature, resolution) {
				//console.log(feature.get('icono'));
				var iconStyle = null;
				if (feature.get('icono') != null){
					iconStyle = [new ol.style.Style({
						image: new ol.style.Icon( ({
							anchor: [16, 37],
							anchorXUnits: 'pixels',
							anchorYUnits: 'pixels',
							opacity: 0.75,
							src: urlFiles+'iconos/'+feature.get('icono')
						}))
					})];
				}
				return iconStyle;
			}
		});
		
		map.addLayer(vectorLayer);	
	}
	
}

var displayFeatureInfo = function(pixel) {

	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	
	var info = document.getElementById('info');
	if (feature) {
		/* distancia */
		var wgs84Sphere = new ol.Sphere(6378137);
		var coordDesde = feature.getGeometry().getCoordinates();
		var coordHasta = posActual;
		var distance = wgs84Sphere.haversineDistance(ol.proj.transform(coordDesde, 'EPSG:3857', 'EPSG:4326'),ol.proj.transform(coordHasta, 'EPSG:3857', 'EPSG:4326')); 
		distance = Math.round(distance * 100) / 100;
		if (distance > 1000) {
			distance = (Math.round(distance / 1000 * 100) / 100) +
			' ' + 'km';
		} else {
			distance = (Math.round(distance * 100) / 100) +
			' ' + 'm';
		}
		/**/
		
		html = "<img src='"+urlFiles+"iconos/"+feature.get('icono')+"'>";
		$('#divModalClickTitulo').html(html + ' ' + feature.get('nombre'));
		
		var html = '';
		if (distance != '0 m'){
			html = 'Distancia: '+distance;
		}		
		if (feature.get('descripcion') != null){
			html += '<br>'+feature.get('descripcion');
		}
		$('#divModalClickCuerpo').html(html);
		$('#modalClick').modal();
	} else {
		$('#modalClick').modal('hide');
	}

};

/* PARAMETROS deben estar en 4326 */
function puntoGPS(xparam, yparam){	
	var pos3857 = ol.proj.transform([xparam, yparam],'EPSG:4326','EPSG:3857');
	var xAnt = posActual[0];
	var yAnt = posActual[1];
	var x = pos3857[0];
	var y = pos3857[1];
	
	posActual[0] = x;
	posActual[1] = y;
	
	if (featurePosActual == null){
		featurePosActual = new ol.Feature({
			geometry: new ol.geom.Point([x,y]),
			nombre: 'Mi posición',
			icono: 'mi_ballon.png'
		});
	
		featuresOverlay = new ol.FeatureOverlay({
			map: map,
			features: [featurePosActual]
		});
		
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(({
				opacity: 0.75,
				src: urlFiles+'iconos/mi_ballon.png'
			}))
		});
		
		featurePosActual.setStyle(iconStyle);
	} else {
		featurePosActual.setGeometry(new ol.geom.Point([x,y]));
	}

}

function centrarMiPosicion(){
    view.setCenter([posActual[0],posActual[1]]);
}
