import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@/store/themeStore';
import { useNostalgia } from '@/hooks/useNostalgia';

/**
 * High-res canvas texture for an authentic handwritten/stamped Solah Parchi chit.
 */
function createParchiTexture(
  title: string,
  englishTitle: string,
  score: string,
  accentColor: string,
  bgColor = '#fffcf7'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background parchment with rich gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 700);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(0.5, '#fdf7ee');
  grad.addColorStop(1, '#f7ebd6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 700);

  // Traditional double-ruled ornamental border
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, 472, 660);

  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 448, 636);

  // Corner motifs
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCorner(42, 42);
  drawCorner(470, 42);
  drawCorner(42, 658);
  drawCorner(470, 658);

  // Central circular seal / stamp ring
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 330, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(256, 330, 150, 0, Math.PI * 2);
  ctx.stroke();

  // Top header numbers / points in corners
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 36px "Rozha One", "Cinzel Decorative", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(score, 50, 80);
  ctx.textAlign = 'right';
  ctx.fillText(score, 462, 80);

  // Top small identity label
  ctx.font = '600 24px "Yatra One", "Rozha One", serif';
  ctx.textAlign = 'center';
  ctx.fillText('SOLAH PARCHI \u2022 1980', 256, 85);

  // Main Hindi identity title in bold traditional Devanagari calligraphy
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 84px "Rozha One", "Yatra One", "Samarkan", serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 320);

  // Subtitle / English Romanized title
  ctx.font = 'bold 34px "Rozha One", "Cinzel Decorative", serif';
  ctx.fillText(englishTitle.toUpperCase(), 256, 385);

  // Points banner at bottom inside seal
  ctx.font = '600 28px "Yatra One", Georgia, serif';
  ctx.fillText(score ? `\u2014 ${score} PTS \u2014` : '\u2014 SPECIAL \u2014', 256, 440);

  // Vintage serial footer
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#78350f';
  ctx.fillText('Baithak Heritage Deck \u2022 Handcrafted Chit', 256, 620);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Creates a photorealistic 3D folded paper chit mesh.
 */
function createFoldedParchiMesh(
  frontTexture: THREE.CanvasTexture,
  backColorHex: number,
  index: number,
  width = 2.2,
  height = 3.0,
  creaseAngleDeg = 20
) {
  const chitGroup = new THREE.Group();
  chitGroup.userData = { chitIndex: index };

  const halfWidth = width / 2;
  const rad = (creaseAngleDeg * Math.PI) / 180;

  const wingGeom = new THREE.PlaneGeometry(halfWidth, height, 6, 12);

  const frontMat = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.88,
    metalness: 0.05,
    side: THREE.FrontSide,
  });

  const backMat = new THREE.MeshStandardMaterial({
    color: backColorHex,
    roughness: 0.92,
    metalness: 0.02,
    side: THREE.BackSide,
  });

  const leftWingFront = new THREE.Mesh(wingGeom, frontMat);
  const leftWingBack = new THREE.Mesh(wingGeom, backMat);
  leftWingFront.position.x = -halfWidth / 2;
  leftWingBack.position.x = -halfWidth / 2;
  const leftPivot = new THREE.Group();
  leftPivot.add(leftWingFront, leftWingBack);
  leftPivot.rotation.y = rad;

  const rightWingGeom = wingGeom.clone();
  const uvs = rightWingGeom.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    const u = uvs.getX(i);
    uvs.setX(i, 0.5 + u * 0.5);
  }
  uvs.needsUpdate = true;

  const rightFrontMat = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.88,
    metalness: 0.05,
    side: THREE.FrontSide,
  });

  const leftUVs = wingGeom.attributes.uv;
  for (let i = 0; i < leftUVs.count; i++) {
    const u = leftUVs.getX(i);
    leftUVs.setX(i, u * 0.5);
  }
  leftUVs.needsUpdate = true;

  const rightWingFront = new THREE.Mesh(rightWingGeom, rightFrontMat);
  const rightWingBack = new THREE.Mesh(rightWingGeom, backMat);
  rightWingFront.position.x = halfWidth / 2;
  rightWingBack.position.x = halfWidth / 2;
  const rightPivot = new THREE.Group();
  rightPivot.add(rightWingFront, rightWingBack);
  rightPivot.rotation.y = -rad;

  chitGroup.add(leftPivot, rightPivot);

  // Invisible hit box mesh for accurate raycasting
  const hitGeom = new THREE.BoxGeometry(width * 1.35, height * 1.25, 1.2);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeom, hitMat);
  hitMesh.userData = { chitIndex: index };
  chitGroup.add(hitMesh);

  return {
    group: chitGroup,
    leftPivot,
    rightPivot,
    baseRad: rad,
    hitMesh,
  };
}

export default function Baithak3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useThemeStore((s) => s.theme);
  const { reduceMotion } = useNostalgia();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // --- 2. Dynamic Lighting ---
    const isDark = theme === 'dark';

    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x2e1d4e : 0xfff6ea,
      isDark ? 1.6 : 2.4
    );
    scene.add(ambientLight);

    // Main Diya Candle point light with warm amber tone
    const diyaLight = new THREE.PointLight(0xfea619, isDark ? 6.5 : 4.0, 48);
    diyaLight.position.set(-0.8, -0.5, 7);
    scene.add(diyaLight);

    // Center Sphere interior glow light
    const sphereGlowLight = new THREE.PointLight(
      isDark ? 0xf59e0b : 0xe11d48,
      isDark ? 4.5 : 3.0,
      25
    );
    sphereGlowLight.position.set(-0.8, 0, 1.0);
    scene.add(sphereGlowLight);

    // Secondary saffron lantern light
    const diyaLight2 = new THREE.PointLight(0xff6b35, isDark ? 5.0 : 3.0, 38);
    diyaLight2.position.set(-6, 3, 5);
    scene.add(diyaLight2);

    const sunLight = new THREE.DirectionalLight(0xffeedb, isDark ? 1.0 : 2.0);
    sunLight.position.set(6, 12, 10);
    scene.add(sunLight);

    // Calculate responsive circle coordinates
    const getCenterCoords = () => {
      const isDesktop = window.innerWidth >= 1024;
      return {
        x: isDesktop ? -0.8 : 0.0,
        y: isDesktop ? 0.0 : -0.5,
      };
    };

    const initialCenter = getCenterCoords();

    // --- 3. 3D Spherical Effect in the Center of Circle ---
    const sphereGroup = new THREE.Group();
    sphereGroup.position.set(initialCenter.x, initialCenter.y, -0.5);
    scene.add(sphereGroup);

    // Outer Glowing Translucent Spherical Orb
    const orbGeom = new THREE.SphereGeometry(3.0, 48, 36);
    const orbMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xfea619 : 0xe11d48,
      emissive: isDark ? 0x7c2d12 : 0x881337,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.32,
      transparent: true,
      opacity: isDark ? 0.32 : 0.18,
    });
    const orbMesh = new THREE.Mesh(orbGeom, orbMat);
    sphereGroup.add(orbMesh);

    // Inner Radiant Core Sphere
    const innerOrbGeom = new THREE.SphereGeometry(1.8, 32, 24);
    const innerOrbMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffd54f : 0xff8a65,
      transparent: true,
      opacity: isDark ? 0.22 : 0.12,
    });
    const innerOrbMesh = new THREE.Mesh(innerOrbGeom, innerOrbMat);
    sphereGroup.add(innerOrbMesh);

    // Spherical Celestial Wireframe Cage
    const wireSphereMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffe082 : 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.22 : 0.12,
    });
    const wireSphere = new THREE.Mesh(new THREE.SphereGeometry(3.3, 24, 16), wireSphereMat);
    sphereGroup.add(wireSphere);

    // 3D Spherical Armillary Rings (Equator, Meridian & Tilted Latitudes)
    const armillaryRingMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xfbbf24 : 0xb45309,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: isDark ? 0.45 : 0.25,
    });

    const equatorRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.04, 16, 90),
      armillaryRingMat
    );
    equatorRing.rotation.x = Math.PI / 2;

    const meridianRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.04, 16, 90),
      armillaryRingMat
    );
    meridianRing.rotation.y = Math.PI / 3;

    const latitudeRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.03, 16, 80),
      armillaryRingMat
    );
    latitudeRing1.position.y = 1.5;
    latitudeRing1.rotation.x = Math.PI / 2;

    const latitudeRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.03, 16, 80),
      armillaryRingMat
    );
    latitudeRing2.position.y = -1.5;
    latitudeRing2.rotation.x = Math.PI / 2;

    sphereGroup.add(equatorRing, meridianRing, latitudeRing1, latitudeRing2);

    // --- 4. 3D Folded Parchis (5 CHITS: Raja, Rani, Sipahi, Chor, and THAP in Center) ---
    const parchiGroup = new THREE.Group();
    scene.add(parchiGroup);

    const chitsData = [
      {
        title: '\u0930\u093e\u091c\u093e', // Raja
        eng: 'Raja',
        pts: '1000',
        color: '#b91c1c', // Kumkum Crimson
        backColor: 0xfff3e5,
        pos: { x: -6.5, y: 1.5, z: 2.0 },
        restingRot: { x: 0.12, y: 0.25, z: -0.08 },
      },
      {
        title: '\u0930\u093e\u0928\u0940', // Rani
        eng: 'Rani',
        pts: '800',
        color: '#d97706', // Haldi Gold
        backColor: 0xfef9e7,
        pos: { x: -7.6, y: -2.7, z: 1.1 },
        restingRot: { x: -0.15, y: -0.22, z: 0.1 },
      },
      {
        title: '\u0938\u093f\u092a\u093e\u0939\u0940', // Sipahi
        eng: 'Sipahi',
        pts: '500',
        color: '#1d4ed8', // Royal Indigo
        backColor: 0xf0f4ff,
        pos: { x: 7.2, y: 3.3, z: 1.3 },
        restingRot: { x: 0.18, y: -0.2, z: 0.08 },
      },
      {
        title: '\u091a\u094b\u0930', // Chor
        eng: 'Chor',
        pts: '0',
        color: '#9a3412', // Chai Terracotta
        backColor: 0xfbf4eb,
        pos: { x: 8.2, y: -2.3, z: 0.5 },
        restingRot: { x: -0.1, y: 0.18, z: -0.12 },
      },
      {
        // 5TH CHIT: Centered directly inside the 3D Sphere Circle!
        title: '\u0925\u093e\u092a!', // Thap!
        eng: 'THAP!',
        pts: '16',
        color: '#dc2626', // Vermillion Red
        backColor: 0xffebee,
        pos: { x: initialCenter.x, y: initialCenter.y, z: 2.6 },
        restingRot: { x: 0.06, y: -0.06, z: 0.02 },
      },
    ];

    interface ParchiItem {
      group: THREE.Group;
      leftPivot: THREE.Group;
      rightPivot: THREE.Group;
      baseRad: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      restingRotX: number;
      restingRotY: number;
      restingRotZ: number;
      floatSpeed: number;
      phase: number;
      texture: THREE.CanvasTexture;
      hitMesh: THREE.Mesh;
      currentRotY: number;
      currentRotX: number;
      currentRotSpeedY: number;
      currentRotSpeedX: number;
      currentScale: number;
      currentElevation: number;
    }

    const parchis: ParchiItem[] = [];
    const hitMeshes: THREE.Mesh[] = [];

    chitsData.forEach((item, index) => {
      const texture = createParchiTexture(
        item.title,
        item.eng,
        item.pts,
        item.color,
        isDark ? '#faf3e8' : '#ffffff'
      );

      const chit = createFoldedParchiMesh(
        texture,
        item.backColor,
        index,
        2.2,
        3.0,
        20
      );

      chit.group.position.set(item.pos.x, item.pos.y, item.pos.z);
      chit.group.rotation.set(item.restingRot.x, item.restingRot.y, item.restingRot.z);

      parchiGroup.add(chit.group);
      hitMeshes.push(chit.hitMesh);

      parchis.push({
        group: chit.group,
        leftPivot: chit.leftPivot,
        rightPivot: chit.rightPivot,
        baseRad: chit.baseRad,
        baseX: item.pos.x,
        baseY: item.pos.y,
        baseZ: item.pos.z,
        restingRotX: item.restingRot.x,
        restingRotY: item.restingRot.y,
        restingRotZ: item.restingRot.z,
        floatSpeed: 0.8 + index * 0.1,
        phase: index * 1.25,
        texture,
        hitMesh: chit.hitMesh,
        currentRotY: item.restingRot.y,
        currentRotX: item.restingRot.x,
        currentRotSpeedY: 0,
        currentRotSpeedX: 0,
        currentScale: 1.0,
        currentElevation: 0,
      });
    });

    // --- 5. Deep Perspective Sacred Geometry Mandala ---
    const mandalaGroup = new THREE.Group();
    mandalaGroup.position.set(initialCenter.x, initialCenter.y, -10);
    scene.add(mandalaGroup);

    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xfea619 : 0xb45309,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.18 : 0.10,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(13.5, 0.05, 16, 90), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(9.8, 0.04, 16, 72), ringMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.035, 12, 60), ringMat);
    mandalaGroup.add(ring1, ring2, ring3);

    // --- 6. Raycasting & Mouse Tracking for Hover Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-999, -999);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let hoveredChitIndex: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseX = mouseNDC.x;
      targetMouseY = mouseNDC.y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- 7. Window Resize ---
    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const center = getCenterCoords();
      sphereGroup.position.set(center.x, center.y, -0.5);
      mandalaGroup.position.set(center.x, center.y, -10);
      if (parchis[4]) {
        parchis[4].baseX = center.x;
        parchis[4].baseY = center.y;
      }
    };

    window.addEventListener('resize', handleResize);

    // --- 8. Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const motionMultiplier = reduceMotion ? 0.2 : 1.0;

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Raycast to detect hovered chit
      raycaster.setFromCamera(mouseNDC, camera);
      const intersects = raycaster.intersectObjects(hitMeshes, false);
      if (intersects.length > 0) {
        hoveredChitIndex = intersects[0].object.userData.chitIndex;
      } else {
        hoveredChitIndex = null;
      }

      // Smooth camera parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.04 * motionMultiplier;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04 * motionMultiplier;

      camera.position.x = currentMouseX * 1.2;
      camera.position.y = currentMouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Natural candle light breathing
      diyaLight.intensity =
        (isDark ? 6.5 : 4.0) +
        Math.sin(elapsedTime * 6.0) * 0.4 +
        Math.cos(elapsedTime * 10.0) * 0.25;

      sphereGlowLight.intensity =
        (isDark ? 4.5 : 3.0) + Math.sin(elapsedTime * 4.0) * 0.3;

      // 3D Spherical movement: rotating cage and sphere group
      sphereGroup.rotation.y = elapsedTime * 0.038 * motionMultiplier;
      sphereGroup.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08 * motionMultiplier;
      wireSphere.rotation.y = elapsedTime * 0.05 * motionMultiplier;

      // --- CHITS ANIMATION: STOP REGULAR ROTATION; ROTATE ONLY ON HOVER ---
      parchis.forEach((p, index) => {
        const isHovered = hoveredChitIndex === index;

        if (isHovered) {
          // ACTIVE HOVER: Rotate dynamically & elevate smoothly
          p.currentRotSpeedY += (0.042 - p.currentRotSpeedY) * 0.15;
          p.currentRotSpeedX += (0.022 - p.currentRotSpeedX) * 0.15;
          p.currentScale += (1.18 - p.currentScale) * 0.12;
          p.currentElevation += (1.3 - p.currentElevation) * 0.12;
        } else {
          // NO HOVER: STOP REGULAR ROTATION (decay speed to zero, settle gracefully)
          p.currentRotSpeedY += (0 - p.currentRotSpeedY) * 0.12;
          p.currentRotSpeedX += (0 - p.currentRotSpeedX) * 0.12;
          p.currentScale += (1.0 - p.currentScale) * 0.1;
          p.currentElevation += (0 - p.currentElevation) * 0.1;
        }

        // Apply rotation ONLY when hovered (rotSpeed > 0)
        p.currentRotY += p.currentRotSpeedY * motionMultiplier;
        p.currentRotX += p.currentRotSpeedX * motionMultiplier;

        p.group.rotation.y = p.currentRotY;
        p.group.rotation.x = p.currentRotX;
        p.group.rotation.z = p.restingRotZ;

        // Apply scale & elevation
        p.group.scale.set(p.currentScale, p.currentScale, p.currentScale);

        // Calm, subtle vertical breathing (no continuous rotation)
        p.group.position.y =
          p.baseY +
          Math.sin(elapsedTime * p.floatSpeed + p.phase) * (0.35 * motionMultiplier);
        p.group.position.x = p.baseX;
        p.group.position.z = p.baseZ + p.currentElevation;

        // Paper flap flutter when hovered
        const flutter = isHovered
          ? Math.sin(elapsedTime * 6.0 + p.phase) * (0.08 * motionMultiplier)
          : 0;
        p.leftPivot.rotation.y = p.baseRad + flutter;
        p.rightPivot.rotation.y = -p.baseRad - flutter;
      });

      // Slow sacred mandala background rotation
      mandalaGroup.rotation.z = elapsedTime * 0.02 * motionMultiplier;
      ring2.rotation.z = -elapsedTime * 0.028 * motionMultiplier;
      ring3.rotation.z = elapsedTime * 0.035 * motionMultiplier;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      parchis.forEach((p) => {
        p.texture.dispose();
      });
      hitMeshes.forEach((m) => {
        m.geometry.dispose();
      });
      ringMat.dispose();
      orbMat.dispose();
      innerOrbMat.dispose();
      wireSphereMat.dispose();
      armillaryRingMat.dispose();
      renderer.dispose();
    };
  }, [theme, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-100 transition-opacity duration-700"
    />
  );
}
