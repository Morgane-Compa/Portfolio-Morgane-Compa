import './style.css';
import * as THREE from 'three';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Donut
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xcb17d9, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lumieres
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Etoiles
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(1000).fill().forEach(addStar);

// Fond dégradé
const boxSize = 500;
const gradientTexture = new THREE.ShaderMaterial({
  uniforms: {
    color1: { type: 'vec3', value: new THREE.Color(0x00008b) },
    color2: { type: 'vec3', value: new THREE.Color(0x000000) },
  },
  vertexShader: `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec3 vPosition;
    void main() {
      float gradientFactor = (vPosition.y + ${boxSize / 2}.0) / ${boxSize.toFixed(1)};
      vec3 color = mix(color2, color1, gradientFactor);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  side: THREE.BackSide,
});

const skyBoxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const skyBox = new THREE.Mesh(skyBoxGeometry, gradientTexture);
scene.add(skyBox);

// Moi
const momoTexture = new THREE.TextureLoader().load('public/assets/img/me-avatar.webp');
const momo = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: momoTexture }));
scene.add(momo);

// earth
const earthTexture = new THREE.TextureLoader().load('public/assets/img/dark-world.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
  })
);
scene.add(earth);

// Dé a 20 faces
const diceGeometry = new THREE.OctahedronGeometry(5, 1); // Crée une géométrie d'octaèdre avec un rayon de 5 et un niveau de détail de 0
const diceMaterial = new THREE.MeshStandardMaterial({ color: 0xfff700, wireframe: true });
const dice = new THREE.Mesh(diceGeometry, diceMaterial); // Crée le maillage de l'octaèdre
scene.add(dice);

// Texture du dé à 8 faces
const loader = new THREE.TextureLoader();
const dicetexture1 = loader.load('public/assets/img/dice/dice-1.jpg');
const dicetexture2 = loader.load('public/assets/img/dice/dice-2.jpg');
const dicetexture3 = loader.load('public/assets/img/dice/dice-3.jpg');
const dicetexture4 = loader.load('public/assets/img/dice/dice-4.jpg');
const dicetexture5 = loader.load('public/assets/img/dice/dice-5.jpg');
const dicetexture6 = loader.load('public/assets/img/dice/dice-6.jpg');
const dicetexture7 = loader.load('public/assets/img/dice/dice-7.jpg');
const dicetexture8 = loader.load('public/assets/img/dice/dice-8.jpg');

// Création de matériaux pour chaque face
const materials = [
  new THREE.MeshBasicMaterial({ map: dicetexture1 }),
  new THREE.MeshBasicMaterial({ map: dicetexture2 }),
  new THREE.MeshBasicMaterial({ map: dicetexture3 }),
  new THREE.MeshBasicMaterial({ map: dicetexture4 }),
  new THREE.MeshBasicMaterial({ map: dicetexture5 }),
  new THREE.MeshBasicMaterial({ map: dicetexture6 }),
  new THREE.MeshBasicMaterial({ map: dicetexture7 }),
  new THREE.MeshBasicMaterial({ map: dicetexture8 }),
];

// Dé a 8 faces
const secondDiceGeometry = new THREE.OctahedronGeometry(5, 0);
const secondDiceMaterial = new THREE.MeshStandardMaterial({ color: 0x0fff00, wireframe: true });
const secondDice = new THREE.Mesh(secondDiceGeometry, secondDiceMaterial);
scene.add(secondDice);

// Positionnement du dé à 20 faces
dice.position.z = 60;
dice.position.y = -30;
dice.position.x = -15;

// Positionnement du dé à 8 faces
secondDice.position.z = 80;
secondDice.position.y = -40;
secondDice.position.x = -30;

// Positionnement de la terre
earth.position.z = 30;
earth.position.setX(-10);
// positionnement de l'avatar
momo.position.z = -5;
momo.position.x = 2;

// mouvement de camera et des objets selon la caméra
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // Animation de la terre
  earth.rotation.x += 0.05;
  earth.rotation.y += 0.05;
  earth.rotation.z += 0.05;

  // Animation de moi
  momo.rotation.y += 0.01;
  momo.rotation.z += 0.01;
  // Animation des dés
  dice.position.y += 0.1;
  secondDice.position.y += 0.1;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Animation du donut
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.006;
  torus.rotation.z += 0.02;
  // Animation du dé
  dice.rotation.x += 0.008;
  dice.rotation.y += 0.008;
  dice.rotation.z += 0.008;
  // Animation du dé
  secondDice.rotation.x += 0.003;
  secondDice.rotation.y += 0.006;
  secondDice.rotation.z += 0.003;

  // Le rendu
  renderer.render(scene, camera);
}

// Appel du rendu
animate();
