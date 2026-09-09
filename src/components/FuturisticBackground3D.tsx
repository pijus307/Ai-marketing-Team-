/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FuturisticBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060810, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x1a2035, 1.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 80);
    cyanLight.position.set(-20, 15, 20);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 3, 80);
    purpleLight.position.set(20, -15, 20);
    scene.add(purpleLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2, 60);
    emeraldLight.position.set(0, 20, -10);
    scene.add(emeraldLight);

    // 3. Volumetric Floating Cloud Particles
    const cloudCount = 45;
    const cloudGroup = new THREE.Group();

    // Create a procedural soft cloud texture
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.3, 'rgba(160, 200, 255, 0.3)');
      grad.addColorStop(0.7, 'rgba(120, 100, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const cloudTexture = new THREE.CanvasTexture(canvas);

    const cloudMaterial = new THREE.SpriteMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Sprite(cloudMaterial);
      const scale = 25 + Math.random() * 35;
      cloud.scale.set(scale, scale, 1);
      cloud.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60 - 10
      );
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // 4. Floating AI Glass Cubes with Wireframe Edges
    const cubesGroup = new THREE.Group();
    const cubeCount = 12;
    const cubeMeshList: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number }; floatSpeed: number; initialY: number }[] = [];

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9, // glass transparency
      thickness: 1.2,
      transparent: true,
      opacity: 0.45,
      reflectivity: 0.9,
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
    });

    for (let i = 0; i < cubeCount; i++) {
      const size = 1.8 + Math.random() * 2.5;
      const geom = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(geom, glassMaterial);

      // Add wireframe edge
      const edgesGeom = new THREE.EdgesGeometry(geom);
      const wireframe = new THREE.LineSegments(edgesGeom, edgeMaterial);
      mesh.add(wireframe);

      const posX = (Math.random() - 0.5) * 70;
      const posY = (Math.random() - 0.5) * 45;
      const posZ = (Math.random() - 0.5) * 30 - 5;
      mesh.position.set(posX, posY, posZ);

      cubesGroup.add(mesh);
      cubeMeshList.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
        },
        floatSpeed: 0.8 + Math.random() * 1.2,
        initialY: posY,
      });
    }
    scene.add(cubesGroup);

    // 5. Rotating Glowing Orbital Rings
    const ringGroup = new THREE.Group();

    const ringGeom1 = new THREE.TorusGeometry(12, 0.08, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.position.set(-15, 5, -15);
    ringGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(16, 0.08, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.position.set(20, -8, -20);
    ringGroup.add(ring2);

    scene.add(ringGroup);

    // 6. Glowing Particles / Starfield
    const starCount = 350;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x10b981),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 7. Perspective Grid at Bottom
    const gridHelper = new THREE.GridHelper(140, 50, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -22;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25;
    scene.add(gridHelper);

    // 8. Interactive Mouse Parallax Tracker
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Resize Listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop (60 FPS)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Camera parallax shift
      camera.position.x = mouseX * 4;
      camera.position.y = -mouseY * 3;
      camera.lookAt(0, 0, 0);

      // Cloud drift
      cloudGroup.children.forEach((cloud, idx) => {
        cloud.position.x += Math.sin(elapsedTime * 0.1 + idx) * 0.015;
        cloud.position.y += Math.cos(elapsedTime * 0.08 + idx) * 0.01;
      });

      // Cubes float & rotation
      cubeMeshList.forEach(({ mesh, rotSpeed, floatSpeed, initialY }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.position.y = initialY + Math.sin(elapsedTime * floatSpeed) * 1.5;
      });

      // Rings rotation
      ring1.rotation.z = elapsedTime * 0.12;
      ring2.rotation.x = elapsedTime * 0.09;

      // Lights orbit
      cyanLight.position.x = Math.sin(elapsedTime * 0.4) * 25;
      cyanLight.position.z = Math.cos(elapsedTime * 0.4) * 25;

      purpleLight.position.x = Math.cos(elapsedTime * 0.3) * 25;
      purpleLight.position.y = Math.sin(elapsedTime * 0.3) * 20;

      // Particle twinkle & rotate
      starField.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060810] no-print"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #0d1222 0%, #060810 70%, #020305 100%)',
      }}
    />
  );
};
