/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", function(e){
            if (confirm("Esta seguro que desea salir?")) {
                /* Here is where my AJAX code for logging off goes */
                 navigator.app.exitApp();
            }
            else {
                return false;
            }
        }, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

/* Funcion para poder cargar un archivo js nuevamente */
function LoadMyJs(scriptName) {
	var docHeadObj = document.getElementsByTagName("head")[0];
	var dynamicScript = document.createElement("script");
	dynamicScript.type = "text/javascript";
	dynamicScript.src = scriptName;
	docHeadObj.appendChild(dynamicScript);
}

function cargar(link, elementoId){
    var elemento = document.getElementById(elementoId);
    despintarTodosLosItems();
    elemento.setAttribute("class", "active-menu");
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", link, false);		
	xhReq.send(null);
	document.getElementById("contenido").innerHTML=xhReq.responseText;	
	LoadMyJs("js/template/framework.plugins.js");
	LoadMyJs("js/template/custom.js");	 
	snapper = new Snap({
	  element: document.getElementById('content')
	});  
    snapper.close();
}

function cargarMapa(link){
    document.getElementById("share_div").innerHTML="";
    var elemento = document.getElementById("mm_mapa");
    despintarTodosLosItems();
    elemento.setAttribute("class", "active-menu");
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", link, false);		
	xhReq.send(null);
	document.getElementById("contenido").innerHTML=xhReq.responseText;	
	LoadMyJs("js/template/framework.plugins.js");
	LoadMyJs("js/template/custom.js");    
    LoadMyJs("js/jquery.js");
    LoadMyJs("js/bootstrap.min.js");    
    LoadMyJs("js/mapa.js");	    
	snapper = new Snap({
	  element: document.getElementById('content')
	});  
    snapper.close();
    

}

// Funcion para que todos los items del menu queden con estilo deseleccionado
function despintarTodosLosItems(){
    document.getElementById("mm_inicio").setAttribute("class", "");
    document.getElementById("mm_galeria").setAttribute("class", "");
    document.getElementById("mm_videos").setAttribute("class", "");
    document.getElementById("mm_contacto").setAttribute("class", "");
    document.getElementById("mm_mapa").setAttribute("class", "");
    
}


// cuando devuelve la pos el gps
var onSuccessGPS = function(position) {    
   /* alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
    
    puntoGPS(position.coords.longitude, position.coords.latitude);
};

// onError Callback receives a PositionError object
//
function onErrorGPS(error) {
   /* alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');*/
}