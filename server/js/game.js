var GAME =
{
	g_renderer : null,
	g_camera : null,
	g_scene : null,
	g_controls : null,
	g_ocean : null,

	g_commands : {
		states : {
			up : false,
			right : false,
			down : false,
			left : false
		},
		movements : {
			speed : 0.0,
			angle : 0.0
		}
	},
	
	Initialize: function() {
	    this.g_renderer = new THREE.WebGLRenderer();
		this.g_renderer.context.getExtension( 'OES_texture_float' );
		this.g_renderer.context.getExtension( 'OES_texture_float_linear' );
		this.g_renderer.setClearColor( 0x000000 );
		
		document.body.appendChild( this.g_renderer.domElement );

		this.g_scene = new THREE.Scene();
		
		this.g_groupShip = new THREE.Object3D();
		this.g_blackPearlShip = new THREE.Object3D();
		this.g_scene.add( this.g_groupShip );
		this.g_groupShip.add( this.g_blackPearlShip );
		
		this.g_camera = new THREE.PerspectiveCamera( 55.0, WINDOW.ms_Width / WINDOW.ms_Height, 0.5, 1000000 );
		this.g_camera.position.set( 0, 350, 800 );
		this.g_camera.lookAt( new THREE.Vector3() );
		this.g_blackPearlShip.add( this.g_camera );
		
		this.InitializeLoader();
		this.InitializeScene();
	},
	
	InitializeLoader: function() {
		this.g_loader = new THREE.LoadingManager();
		
		var log = function( message, type, timeout ) {
			console.log( message );
			messg( message, type, timeout );
		}
		
		var delay = 1500;
		this.loader.onProgress = function( item, loaded, total ) {
			log( 'Loaded ' + loaded + '/' + total + ':' + item, 'info', delay );
		};
		this.loader.onLoad = function () {
			log( 'Loaded.', 'success', delay );
		};
		this.loader.onError = function () {
			log( 'Loading error.', 'error', delay );
		};
		
		
		this.g_imageLoader = new THREE.ImageLoader( this.g_loader );
	},
	
	InitializeScene: function() {

		this.g_mainDirectionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
		this.g_mainDirectionalLight.position.set( -0.2, 0.5, 1 );
		this.g_scene.add( this.g_mainDirectionalLight );

		var loader = new THREE.OBJMTLLoader( this.g_loader );
		this.g_blackPearl = null;
		loader.load( '../thrird-party/models/BlackPearl/BlackPearl.obj', '../thrird-party/models/BlackPearl/BlackPearl.mtl', function ( object ) {
			object.position.y = 20.0;
			if( object.children ) {
				for( child in object.children ) {
					object.children[child].material.side = THREE.DoubleSide;
				}
			}

			this.g_blackPearlShip.add( object );
			this.g_blackPearl = object;
		} );
		
		
		this.g_cloudShader = new CloudShader( this.ms_Renderer, 512 );
		this.g_cloudShader.cloudMesh.scale.multiplyScalar( 4.0 );
		this.g_scene.add( this.g_cloudShader.cloudMesh );

		var gsize = 512;
		var res = 512;
		var gres = 256;
		var origx = -gsize / 2;
		var origz = -gsize / 2;
		this.g_ocean = new THREE.Ocean( this.g_renderer, this.g_camera, this.g_scene,
		{
			INITIAL_SIZE : 200.0,
			INITIAL_WIND : [ 10.0, 10.0 ],
			INITIAL_CHOPPINESS : 3.6,
			CLEAR_COLOR : [ 1.0, 1.0, 1.0, 0.0 ],
			SUN_DIRECTION : this.g_mainDirectionalLight.position.clone(),
			OCEAN_COLOR: new THREE.Vector3( 0.35, 0.4, 0.45 ),
			SKY_COLOR: new THREE.Vector3( 10.0, 13.0, 15.0 ),
			EXPOSURE : 0.15,
			GEOMETRY_RESOLUTION: gres,
			GEOMETRY_SIZE : gsize,
			RESOLUTION : res
		} );

	}
}