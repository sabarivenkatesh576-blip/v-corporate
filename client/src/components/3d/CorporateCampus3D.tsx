import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Building2, Sparkles, ArrowRight, Zap, Target, Eye, Compass, Trophy } from 'lucide-react';

export interface CampusDepartment {
  id: string;
  name: string;
  category: string;
  route: string;
  color: string;
  accentHex: number;
  height: number;
  x: number;
  z: number;
  desc: string;
  badge: string;
}

export const CAMPUS_DEPARTMENTS: CampusDepartment[] = [
  {
    id: 'placement',
    name: 'Placement Arena & Recruitment Hub',
    category: 'Corporate Hiring',
    route: '/placement',
    color: '#0284c7',
    accentHex: 0x0284c7,
    height: 10,
    x: -10,
    z: 8,
    desc: 'Interactive campus drive pavilions, company eligibility checks, and live offer drive challenges.',
    badge: '18 LPA Top Drive'
  },
  {
    id: 'internship',
    name: 'Virtual Internship Lab',
    category: 'Experiential Sprints',
    route: '/internships',
    color: '#10b981',
    accentHex: 0x10b981,
    height: 8.5,
    x: 10,
    z: 8,
    desc: '4-Week corporate simulation sprints in SQL, Excel, and FRD studios with docked AI Co-Pilot.',
    badge: 'Sprint 2 Active'
  },
  {
    id: 'workspace',
    name: 'Project Workstation Studio',
    category: 'Practical Tools',
    route: '/workspace',
    color: '#8b5cf6',
    accentHex: 0x8b5cf6,
    height: 9,
    x: -10,
    z: -8,
    desc: 'Full-featured Excel grid, PostgreSQL execution sandbox, and automated formula calculator.',
    badge: 'Live Sandboxes'
  },
  {
    id: 'interview',
    name: 'AI Spoken Mock Interview Pod',
    category: 'Voice Assessment',
    route: '/interview',
    color: '#f59e0b',
    accentHex: 0xf59e0b,
    height: 7.5,
    x: 10,
    z: -8,
    desc: 'Voice STT/TTS mock interviews with speech pace, filler word detector, and CEFR grammar scoring.',
    badge: 'Voice AI Ready'
  },
  {
    id: 'manager',
    name: 'AI Corporate Director Cabin',
    category: 'Executive Mentorship',
    route: '/style-manager',
    color: '#ec4899',
    accentHex: 0xec4899,
    height: 11,
    x: 0,
    z: -12,
    desc: '24/7 personal executive feedback from Practice Director Dr. Alistair Vance.',
    badge: 'Dr. Vance Online'
  },
  {
    id: 'credentials',
    name: 'Cryptosealed Credential Vault',
    category: 'Verified Portfolio',
    route: '/credentials',
    color: '#eab308',
    accentHex: 0xeab308,
    height: 8,
    x: 0,
    z: 12,
    desc: 'Cryptographically sealed internship certificates, skill badges, and verifiable QR codes.',
    badge: 'Verifiable Ledger'
  }
];

export const CorporateCampus3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState<CampusDepartment>(CAMPUS_DEPARTMENTS[0]);
  const [hoveredDept, setHoveredDept] = useState<CampusDepartment | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060c18, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 22, 32);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 3.5, 60);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // Ground Cyber Grid
    const gridHelper = new THREE.GridHelper(55, 55, 0x0284c7, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Floor holographic rings
    const ringGeo = new THREE.RingGeometry(15, 15.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.05;
    scene.add(floorRing);

    // Central Metaverse Monument
    const centralGroup = new THREE.Group();
    const centralGeo = new THREE.CylinderGeometry(3.0, 3.8, 1.8, 32);
    const centralMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5
    });
    const centralBase = new THREE.Mesh(centralGeo, centralMat);
    centralBase.position.y = 0.9;
    centralGroup.add(centralBase);

    const diamondGeo = new THREE.OctahedronGeometry(1.4, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.9,
      wireframe: true
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.y = 4.8;
    centralGroup.add(diamond);
    scene.add(centralGroup);

    // Floating Particles
    const particleCount = 130;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = Math.random() * 18 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 45;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.25,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Department Towers
    const deptMeshes: { mesh: THREE.Mesh; dept: CampusDepartment }[] = [];

    CAMPUS_DEPARTMENTS.forEach((dept) => {
      const towerGroup = new THREE.Group();
      towerGroup.position.set(dept.x, 0, dept.z);

      const w = 3.2;
      const d = 3.2;
      const h = dept.height;

      const geometry = new THREE.BoxGeometry(w, h, d);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.75,
        roughness: 0.2,
        emissive: dept.accentHex,
        emissiveIntensity: 0.35
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = h / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { dept };
      towerGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ color: dept.accentHex, linewidth: 2 });
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.y = h / 2;
      towerGroup.add(line);

      const beaconGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: dept.accentHex });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = h + 0.9;
      towerGroup.add(beacon);

      const beamGeo = new THREE.CylinderGeometry(0.08, 0.45, 3.5, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: dept.accentHex,
        transparent: true,
        opacity: 0.45
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = h + 2.8;
      towerGroup.add(beam);

      scene.add(towerGroup);
      deptMeshes.push({ mesh, dept });
    });

    // Raycasting & Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetCameraY = 22;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetCameraY = Math.max(8, Math.min(34, targetCameraY - deltaY * 0.05));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(deptMeshes.map(d => d.mesh));
      if (intersects.length > 0) {
        const hitDept = intersects[0].object.userData.dept as CampusDepartment;
        setHoveredDept(hitDept);
        container.style.cursor = 'pointer';
      } else {
        setHoveredDept(null);
        container.style.cursor = isMouseDown ? 'grabbing' : 'grab';
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(deptMeshes.map(d => d.mesh));
      if (intersects.length > 0) {
        const clickedDept = intersects[0].object.userData.dept as CampusDepartment;
        setSelectedDept(clickedDept);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(18, Math.min(46, camera.position.z + e.deltaY * 0.03));
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isMouseDown) {
        targetRotationY += 0.0016;
      }

      const camRadius = camera.position.z;
      camera.position.x = Math.sin(targetRotationY) * camRadius;
      camera.position.z = Math.cos(targetRotationY) * camRadius;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 2.5, 0);

      diamond.rotation.y = elapsed * 1.2;
      diamond.rotation.x = elapsed * 0.5;
      diamond.position.y = 4.8 + Math.sin(elapsed * 2) * 0.35;

      floorRing.rotation.z = elapsed * 0.06;

      const posArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < posArr.length; i += 3) {
        posArr[i] += Math.sin(elapsed + i) * 0.01;
        if (posArr[i] > 20) posArr[i] = 0.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      deptMeshes.forEach(d => {
        const isHovered = hoveredDept?.id === d.dept.id;
        const isSelected = selectedDept.id === d.dept.id;
        const mat = d.mesh.material as THREE.MeshStandardMaterial;

        if (isHovered || isSelected) {
          mat.emissiveIntensity = 0.85 + Math.sin(elapsed * 6) * 0.25;
          d.mesh.scale.set(1.08, 1.04, 1.08);
        } else {
          mat.emissiveIntensity = 0.35;
          d.mesh.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, selectedDept, hoveredDept]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-sky-500/30 text-xs text-white shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wide text-sky-300">V-CORP 3D CORPORATE METAVERSE CAMPUS</span>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className="pointer-events-auto px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-sky-500 transition-all flex items-center gap-1.5 shadow-md"
        >
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          {isRotating ? 'Pause Orbit' : 'Resume Orbit'}
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[440px] md:h-[520px] cursor-grab active:cursor-grabbing select-none"
      />

      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden md:flex items-center gap-3 text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
        <span>🖱️ <strong>Drag</strong> to rotate campus</span>
        <span>•</span>
        <span>📜 <strong>Scroll</strong> to zoom</span>
        <span>•</span>
        <span>🎯 <strong>Click tower</strong> to enter</span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedDept.color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {selectedDept.category}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {selectedDept.badge}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white mt-1">
              {selectedDept.name}
            </h3>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {selectedDept.desc}
        </p>

        <button
          onClick={() => navigate(selectedDept.route)}
          className="w-full mt-3 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          Enter {selectedDept.name}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
