// variables concerning app complexity
var visualisationWidth = 100;
var cameraDistance = visualisationWidth * 1;
var cubeDivisions = 32;
var cubeDimension = visualisationWidth / cubeDivisions;
var cubeCenterCorrection = (visualisationWidth-cubeDimension) / 2;
var cubeHeightCorrection = cubeDimension * 2;
var cubeHeightFactor = 500;
var frequencyDivisions = 64;


// SYNTHESIZER SETUP---------------------------------------------------------------------------------------------------------------------------------------------------

// create object which I can reference later for the frequencies of keyboard notes
var notes = {
  'c':  261.63,
  'c-sharp':  277.18,
  'd':  293.66,
  'd-sharp':  311.13,
  'e':  329.63,
  'f':  349.23,
  'f-sharp':  369.99,
  'g':  392.00,
  'g-sharp':  415.30,
  'a':  440.00,
  'a-sharp':  466.16,
  'b':  493.88,
  'c2':  523.25,
}
var octave = 0.25;
var currentNote = 'c';

// grab the audio context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create variable for currenttime taken from audio context
var now = audioCtx.currentTime;
var oldNow;

// create oscillators and set default type and frequency
  // osc1
var oscNode1 = audioCtx.createOscillator();
oscNode1.type = 'square';
oscNode1.frequency.value = notes['c'];
var osc1AttackTime = 0;
var osc1DecayTime = 0.36;
var osc1DecayAmount = 0.8;
var osc1ReleaseTime = 1;
oscNode1.detune.value = -9;
  // osc2
var oscNode2 = audioCtx.createOscillator();
oscNode2.type = 'sawtooth';
oscNode2.frequency.value = notes['c'];
playing = false;
var osc2AttackTime = 0.8;
var osc2DecayTime = 0;
var osc2DecayAmount = 0;
var osc2ReleaseTime = 1;
oscNode1.detune.value = 9;

// create gain node and set default to 0. Also create a holder for gain value when muted
var gainNode1 = audioCtx.createGain();
gainNode1.gain.value = 0;
var gainNode2 = audioCtx.createGain();
gainNode2.gain.value = 0;
var masterGain = audioCtx.createGain();
masterGain.gain.value = 0.5;
var osc1Volume = 1, osc2Volume = 1;

// connect the oscillator to the gain node
oscNode1.connect(gainNode1);
oscNode2.connect(gainNode2);


// start the oscillator
oscNode1.start();
oscNode2.start();

// create biquad filter
var biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = 'lowpass';
biquadFilter.frequency.value = 3000;
biquadFilter.Q.value = 3;

// connect the gain node to the audio output
gainNode1.connect(biquadFilter);
gainNode2.connect(biquadFilter);
biquadFilter.connect(masterGain);

// create analyser
var analyserNode = audioCtx.createAnalyser();
masterGain.connect(analyserNode);
analyserNode.fftSize = cubeDivisions * frequencyDivisions;
var bufferLength = analyserNode.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

analyserNode.connect(audioCtx.destination);

window.onkeydown = function(e) {
  // console.log(e.keyCode);
  switch (e.keyCode) {
      case 65:
        oscNode1.frequency.setValueAtTime(notes['c'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['c'] * octave, now);
        currentNote = 'c';
        break;
      case 87:
        oscNode1.frequency.setValueAtTime(notes['c-sharp'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['c-sharp'] * octave, now);
        currentNote = 'c-sharp';
        break;
      case 83:
        oscNode1.frequency.setValueAtTime(notes['d'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['d'] * octave, now);
        currentNote = 'd';
        break;
      case 69:
        oscNode1.frequency.setValueAtTime(notes['d-sharp'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['d-sharp'] * octave, now);
        currentNote = 'd-sharp';
        break;
      case 68:
        oscNode1.frequency.setValueAtTime(notes['e'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['e'] * octave, now);
        currentNote = 'e';
        break;
      case 70:
        oscNode1.frequency.setValueAtTime(notes['f'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['f'] * octave, now);
        currentNote = 'f';
        break;
      case 84:
        oscNode1.frequency.setValueAtTime(notes['f-sharp'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['f-sharp'] * octave, now);
        currentNote = 'f-sharp';
        break;
      case 71:
        oscNode1.frequency.setValueAtTime(notes['g'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['g'] * octave, now);
        break;
      case 89:
        oscNode1.frequency.setValueAtTime(notes['g-sharp'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['g-sharp'] * octave, now);
        currentNote = 'g-sharp';
        break;
      case 72:
        oscNode1.frequency.setValueAtTime(notes['a'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['a'] * octave, now);
        currentNote = 'a';
        break;
      case 85:
        oscNode1.frequency.setValueAtTime(notes['a-sharp'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['a-sharp'] * octave, now);
        currentNote = 'a-sharp';
        break;
      case 74:
        oscNode1.frequency.setValueAtTime(notes['b'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['b'] * octave, now);
        currentNote = 'b';
        break;
      case 75:
        oscNode1.frequency.setValueAtTime(notes['c2'] * octave, now);
        oscNode2.frequency.setValueAtTime(notes['c2'] * octave, now);
        currentNote = 'c2';
        break;
      case 90:
        octave *= 0.5;
        break;
      case 88:
        octave *= 2;
        break;
      default:
        break;
  }
  if (e.keyCode == 65 || e.keyCode == 87 || e.keyCode == 83 || e.keyCode == 69 || e.keyCode == 68 || e.keyCode == 70 || e.keyCode == 84 || e.keyCode == 71 || e.keyCode == 89 || e.keyCode == 72 || e.keyCode == 85 || e.keyCode == 74 || e.keyCode == 75) {
    if (!playing) {
      playing = true;
      now = audioCtx.currentTime;
      // OSC1
      // reset
      gainNode1.gain.cancelScheduledValues(now);
      gainNode1.gain.setValueAtTime(0, now);
      // handle attack
      if (osc1AttackTime > 0) {
        gainNode1.gain.linearRampToValueAtTime(osc1Volume, now + Number(osc1AttackTime));
      } else {
        gainNode1.gain.linearRampToValueAtTime(osc1Volume, now + 0.012);
      }
      // handle decay
      if (osc1DecayAmount > 0) {
        if (osc1DecayTime > 0) {
          gainNode1.gain.linearRampToValueAtTime(osc1Volume -(osc1Volume * osc1DecayAmount), now + Number(osc1AttackTime) + Number(osc1DecayTime));
        } else {
          gainNode1.gain.linearRampToValueAtTime(osc1Volume -(osc1Volume * osc1DecayAmount), now + Number(osc1AttackTime) + 0.012);
        }
      }
        
      
      
      gainNode2.gain.cancelScheduledValues(now);
      gainNode2.gain.setValueAtTime(0, now);
      gainNode2.gain.linearRampToValueAtTime(osc2Volume, now + Number(osc2AttackTime));
      gainNode2.gain.linearRampToValueAtTime(osc2Volume -(osc2Volume * osc2DecayAmount), now + Number(osc2AttackTime) + Number(osc2DecayTime));
    }
      
  }
};
window.onkeyup = function(e) {
  if (e.keyCode == 65 || e.keyCode == 87 || e.keyCode == 83 || e.keyCode == 69 || e.keyCode == 68 || e.keyCode == 70 || e.keyCode == 84 || e.keyCode == 71 || e.keyCode == 89 || e.keyCode == 72 || e.keyCode == 85 || e.keyCode == 74 || e.keyCode == 75) {
    playing = false;
    oldNow = now;
    now = audioCtx.currentTime;
    var timeSincePress = now - oldNow;
    // osc1
    gainNode1.gain.cancelScheduledValues(now);
    if (timeSincePress < osc1AttackTime) {
      // handle stopping attack mid-transition
      gainNode1.gain.setValueAtTime(osc1Volume * (timeSincePress/osc1AttackTime), now);
    } else if (timeSincePress < (osc1AttackTime + osc1DecayTime)) {
      // handle stopping decay mid-transition
      var timeIntoDecay1 = (timeSincePress - osc1AttackTime);
      gainNode1.gain.setValueAtTime(osc1Volume - (osc1Volume * (timeIntoDecay1/osc1DecayTime) * osc1DecayAmount), now);
    }
    if (osc1ReleaseTime > 0) {
      gainNode1.gain.linearRampToValueAtTime(0, now + Number(osc1ReleaseTime));
    } else {
      gainNode1.gain.linearRampToValueAtTime(0, now + 0.012);
    }
    // osc2
    gainNode2.gain.cancelScheduledValues(now);
    if (timeSincePress < osc2AttackTime) {
      // handle stopping attack mid-transition
      gainNode2.gain.setValueAtTime(osc2Volume * (timeSincePress/osc2AttackTime), now);
    } else if (timeSincePress < (osc2AttackTime + osc2DecayTime)) {
      // handle stopping decay mid-transition
      var timeIntoDecay2 = (timeSincePress - osc2AttackTime);
      gainNode2.gain.setValueAtTime(osc2Volume - (osc2Volume * (timeIntoDecay2/osc2DecayTime) * osc2DecayAmount), now);
    }
    if (osc2ReleaseTime > 0) {
      gainNode2.gain.linearRampToValueAtTime(0, now + Number(osc2ReleaseTime));
    } else {
      gainNode2.gain.linearRampToValueAtTime(0, now + 0.012);
    }
    
    
  }
};


// THREEJS CODE---------------------------------------------------------------------------------------------------------------------------------------------------------
var stats = new Stats();
document.body.appendChild(stats.dom);

// create scene
var scene = new THREE.Scene();

// create renderer
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );
renderer.domElement.setAttribute("id", "webgl-canvas");


var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 45, aspectRatio, 1, visualisationWidth * 10);
controls = new THREE.OrbitControls(camera, document.getElementById('webgl-canvas'));


// helpers
var axis = new THREE.AxisHelper(cubeDimension * 4);
// scene.add(axis);

var grid = new THREE.GridHelper(visualisationWidth/2, cubeDimension);
var gridColor = new THREE.Color('rgb(0,0,0)');
grid.setColors(gridColor, 0x000000);
scene.add(grid);


// create holder array for individual instances 
var cubeArray = [];
var cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x99cc33
    });
// create cubes and push them to array
for (var j = 0; j < cubeDivisions; j++) {


  for (var i = 0; i < cubeDivisions; i++) {
    var cubeGeometry = new THREE.BoxGeometry(cubeDimension, cubeDimension, cubeDimension);
    
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = i * cubeDimension - cubeCenterCorrection;
    cube.position.z = j * cubeDimension - cubeCenterCorrection;
    cube.position.y = cubeHeightCorrection;
    // cube.castShadow = true;
    scene.add(cube);
    cubeArray.push(cube);
  }

}



var spotLight = new THREE.SpotLight(0xffffff, 0.8, 0, Math.PI/2, 0.25, 1);
spotLight.position.set(0, visualisationWidth, 0);
scene.add(spotLight);



camera.position.x = -cameraDistance;
camera.position.y = cameraDistance + cubeHeightCorrection;
camera.position.z = -cameraDistance;


camera.lookAt(scene.position);


function render() {
  
	requestAnimationFrame(render);
  
  // get new frequency data and inject into an array;
  analyserNode.getByteFrequencyData(dataArray);
  
  var section = bufferLength/(frequencyDivisions/2);
  
  // animate cubes
  for(var i = section - 1; i >= 0; i--) {
    for (var j = section - 1; j > 0; j--) {
      cubeArray[(j * section) + i].position.y = cubeArray[((j-1)*section) + i].position.y;
    }
    barHeight = dataArray[i] * (visualisationWidth/cubeHeightFactor);
    cubeArray[section - 1 - i].position.y = cubeHeightCorrection + barHeight;  
  }
  
	renderer.render( scene, camera );
  
  controls.update();
  
  stats.update();
}
render();

window.onmousedown = function() {
  console.log('' + cubeArray[0].position.y);
  window.focus();
}