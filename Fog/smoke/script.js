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
 
    textGeo = new THREE.SphereGeometry(100,100,100);
    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    textTexture = THREE.ImageUtils.loadTexture('smoke.png');
    textMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, opacity: 1, transparent: true, blending: THREE.AdditiveBlending})
    text = new THREE.Mesh(textGeo,textMaterial);
    text.position.z = 800;
    // scene.add(text);

    light = new THREE.DirectionalLight(0xaad474,1.3);
    light.position.set(-1,0,1);
    scene.add(light);
  
    smokeTexture = THREE.ImageUtils.loadTexture('smoke.png');
    smokeMaterial = new THREE.MeshLambertMaterial({map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(200,200);
    smokeParticles = [];


    for (p = 0; p < 3000; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*800-700,Math.random()*1000-600,Math.random()*1000-400);
        particle.rotation.z = Math.random() * 360;
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
    var t = 0;
    while(sp--) {
        smokeParticles[sp].position.x+=13*delta;
        smokeParticles[sp].rotation.z+=delta;
       
        smokeParticles[sp].rotation.y+=0.00001;

        t = smokeParticles[sp].position.x*0.01;
        
        smokeParticles[sp].position.y += t*Math.sin(10*t);
        smokeParticles[sp].position.z += Math.sin(0.5*t)+0.8;
       



    }
}

function render() {
 
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    cubeSineDriver += .01;
    mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    renderer.render( scene, camera );
 
}