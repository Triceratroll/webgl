/*
** Seminario #2: Animacion e Interaccion 
** @author: rvivo@upv.es
** @date: 19-02-2020
*/

// Variables globales estandar
var renderer, scene, camera;

// Otras variables
var angulo =0 ;
var antes = Date.now();
var esfera;
var conjunto;

//Controladores 
var cameraControl, effectControl;

init();
loadScene();
setupGUI();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000000) );
	document.getElementById('container').appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );

    //Controlador de camara
    cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControl.target.set(0,0,0);
    cameraControl.noZoom = true;
}

function loadScene() {
	// Construye el grafo de escena
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo

	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
	conjunto.position.y = 1;

	// Cubo
	var geoCubo = new THREE.BoxGeometry(2,2,2);
	var matCubo = new THREE.MeshBasicMaterial( {color:'green',wireframe:true} );
	var cubo = new THREE.Mesh( geoCubo, matCubo );
	cubo.position.x = 2;

	// Esfera
	var geoEsfera = new THREE.SphereGeometry( 1, 30, 30 );
	var material = new THREE.MeshBasicMaterial( {color:'purple', wireframe: true} );
	esfera = new THREE.Mesh( geoEsfera, material );

	// Suelo
	var geoSuelo = new THREE.PlaneGeometry(10,10,12,12);
	var matSuelo = new THREE.MeshBasicMaterial( {color:'grey', wireframe: false} );
	var suelo = new THREE.Mesh( geoSuelo, matSuelo );
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -0.1;

	// Objeto importado
	var loader = new THREE.ObjectLoader();
	loader.load( 'models/soldado/soldado.json', 
		         function (objeto){
                    objeto.scale.set(0.8,0.8,0.8);
                    objeto.position.y = -1;
		         	objeto.rotation.y = Math.PI/2;
		         	cubo.add(objeto);
		         });

	// Texto
	var fontLoader = new THREE.FontLoader();
	fontLoader.load( 'fonts/gentilis_bold.typeface.json',
		             function(font){
		             	var geoTexto = new THREE.TextGeometry( 
		             		'STAR WARS',
		             		{
		             			size: 0.5,
		             			height: 0.1,
		             			curveSegments: 3,
		             			style: "normal",
		             			font: font,
		             			bevelThickness: 0.05,
		             			bevelSize: 0.04,
		             			bevelEnabled: true
		             		});
		             	var matTexto = new THREE.MeshBasicMaterial( {color:'red'} );
		             	var texto = new THREE.Mesh( geoTexto, matTexto );
		             	scene.add( texto );
		             	texto.position.x = -1;
		             });


	// Grafo
	conjunto.add( cubo );
	cubo.add( esfera );
	scene.add( conjunto );
	scene.add( new THREE.AxesHelper(3) );
	scene.add( suelo );
}

function setupGUI() {

    // Objeto Controlador

    effectControl = {
        mensaje: "Interfaz",
        posY: 1.0,
        separacion: [],
        caja: true,
        color: "rgb(255,255,0)"
    } 

    // Interfaz
    var gui = new dat.GUI();
    var folder = gui.addFolder("Interfaz del soldado");
    folder.add(effectControl,"mensaje").name("Aplicacion");
    folder.add(effectControl,"posY", 1.0, 3.0, 0.1).name("Sube/Baja");
    folder.add(effectControl,"separacion", {Ninguna:0, Media:1, Maxima:2}).name("Separacion");
    folder.add(effectControl,"caja").name("Ver esfera");
    folder.addColor(effectControl, "color").name("Color Esfera")
}

function update()
{
	// Cambiar propiedades entre frames

    // Control del tiempo transcurrido 
    var ahora = Date.now(); 
	angulo += Math.PI/9 * (ahora-antes) / 1000;
    antes = ahora; 
	esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;

    // Actualizar segun la interfaz
    conjunto.position.y = effectControl.posY
    esfera.position.x = -effectControl.separacion;
    esfera.visible = effectControl.caja;
    esfera.material.setValues({color: effectControl.color});
}

function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}