var camera, scene, renderer,
    geometry, material, mesh;
 
init();
animate(); 

function init() {
    stats = new Stats();

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );
 
    geometry = new THREE.SphereGeometry( 200, 200, 200 );
    material = new THREE.MeshLambertMaterial( { color: 0xaa6666, wireframe: false } );
    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );
    cubeSineDriver = 0;
 
    textGeo = new THREE.SphereGeometry(200,200,200);
    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    textTexture = THREE.ImageUtils.loadTexture('sand.png');
    textMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, opacity: 1, transparent: true, blending: THREE.AdditiveBlending})
    text = new THREE.Mesh(textGeo,textMaterial);
    text.position.z = 800;
    // scene.add(text);

    light = new THREE.DirectionalLight(0xffffff,1.2);
    light.position.set(-1,0,1);
    scene.add(light);
  
    smokeTexture = THREE.ImageUtils.loadTexture('sand.png');
    smokeMaterial = new THREE.MeshLambertMaterial({map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(200,200);
    smokeParticles = [];


    for (p = 0; p < 1500; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        var phi = Math.random()*Math.PI * (Math.random()*10 + 1);
        var radius =  0.05*phi;

        var x = radius*Math.cos(phi) + Math.random()*500- Math.random()*1000 ;
        var y = radius*Math.sin(phi) + Math.random()*50- Math.random()*1000;
        particle.position.set(x,y,Math.random()*700-10);
        particle.rotation.z = Math.sin(Math.random() *2*Math.PI);
        scene.add(particle);
        smokeParticles.push(particle);
    }
 
    document.body.appendChild( renderer.domElement );
 
}
 
function animate() {
 
    // note: three.js includes requestAnimationFrame shim
    stats.begin();
    delta = clock.getDelta();
    requestAnimationFrame( animate );
    evolveSmoke();
    render();
    stats.end();
}
 
function evolveSmoke() {
    var sp = smokeParticles.length;
    var phi = 0;
    var radius = phi/(Math.PI*2);
    
    var x = radius*Math.cos(phi)+Math.random();
    var y = radius*Math.sin(phi)+Math.random();

    while(sp--) {     

        smokeParticles[sp].position.x += 10*delta;
        

        smokeParticles[sp].position.y = 150*Math.sin(0.09*smokeParticles[sp].position.x)-50;

        smokeParticles[sp].rotation.z -= delta*0.1;
        smokeParticles[sp].position.z += 2*Math.sin(smokeParticles[sp].position.x*0.03)

        
        
    }
}

function render() {
 
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    cubeSineDriver += .01;
    mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    renderer.render( scene, camera );
 
}