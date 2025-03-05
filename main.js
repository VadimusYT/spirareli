import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', function() {
  // Create balloons for fun background
  createBalloons(10);
  
  // Setup and animate 3D models with fun colors
  setupModel('model-inside', '/medium-inside.stl', 0xFF6B6B); // Fun pink color
  setupModel('model-outside', '/Medium-outside.stl', 0x65D1FE); // Fun blue color
  
  // Add subtle animation to the gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
  
  // Add bouncing effect to titles
  const titles = document.querySelectorAll('h3');
  titles.forEach(title => {
    title.addEventListener('mouseover', () => {
      title.style.animation = 'bounce 0.5s';
      setTimeout(() => {
        title.style.animation = '';
      }, 500);
    });
  });
  
  // Add current year to footer if needed
  const yearSpan = document.querySelector('.current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

function createBalloons(count) {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B983FF'];
  
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.animationDelay = `${Math.random() * 15}s`;
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(balloon);
  }
}

function setupModel(containerId, modelPath, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFF8E1); // Soft cream background
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  backLight.position.set(-1, -1, -1);
  scene.add(backLight);
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  
  // Setup renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // Add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Load the STL model
  const loader = new STLLoader();
  loader.load(modelPath, (geometry) => {
    geometry.center();
    
    const material = new THREE.MeshPhongMaterial({
      color: color,
      specular: 0x111111,
      shininess: 30
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Scale the model to fit the view
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim;
    mesh.scale.set(scale, scale, scale);
    
    // Add a slight rotation to show off the model
    mesh.rotation.x = -Math.PI / 4;
    
    scene.add(mesh);
    
    // Add fun bounce animation
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      mesh.rotation.y += 0.01;
      mesh.position.y = Math.sin(time) * 0.1; // Gentle bouncing effect
      controls.update();
      renderer.render(scene, camera);
    }
    
    animate();
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}