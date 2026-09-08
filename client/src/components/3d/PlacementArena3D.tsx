import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Building2, Sparkles, Trophy, ArrowRight, Zap, Target, ShieldCheck, Eye } from 'lucide-react';

export interface CompanyDriveInfo {
  id: string;
  name: string;
  role: string;
  packageLPA: string;
  color: string;
  accentHex: number;
  status: 'Registration Open' | 'Eligible' | 'Shortlisted' | 'Assessment Live';
  eligibilityScore: number;
  roundsCount: number;
  openings: number;
  description: string;
  height: number;
}

interface PlacementArena3DProps {
  onSelectCompany: (company: CompanyDriveInfo) => void;
  selectedCompanyId?: string;
}

export const COMPANIES_3D: CompanyDriveInfo[] = [
  {
    id: 'deloitte',
    name: 'Deloitte',
    role: 'Business Analyst / Advisory',
    packageLPA: '14 - 18 LPA',
    color: '#86bc25',
    accentHex: 0x86bc25,
    status: 'Registration Open',
    eligibilityScore: 88,
    roundsCount: 3,
    openings: 24,
    description: 'Premier consulting & financial advisory campus drive. Multi-stage case study and SQL modeling rounds.',
    height: 9
  },
  {
    id: 'tcs',
    name: 'TCS Digital',
    role: 'Software Developer & AI Engineer',
    packageLPA: '9 - 14 LPA',
    color: '#0070ad',
    accentHex: 0x00b4d8,
    status: 'Eligible',
    eligibilityScore: 92,
    roundsCount: 3,
    openings: 65,
    description: 'Enterprise full-stack engineering, cloud architecture, and real-time backend systems.',
    height: 8
  },
  {
    id: 'ey',
    name: 'EY GDS',
    role: 'Financial Analyst & Assurance',
    packageLPA: '12 - 16 LPA',
    color: '#ffe600',
    accentHex: 0xffd166,
    status: 'Eligible',
    eligibilityScore: 85,
    roundsCount: 3,
    openings: 30,
    description: 'Core audit analytics, working capital metrics, and corporate financial model evaluations.',
    height: 7.5
  },
  {
    id: 'kpmg',
    name: 'KPMG',
    role: 'Data Analyst & Risk Advisory',
    packageLPA: '13 - 17 LPA',
    color: '#00338d',
    accentHex: 0x4361ee,
    status: 'Assessment Live',
    eligibilityScore: 90,
    roundsCount: 3,
    openings: 18,
    description: 'Data analytics, automated pipeline ETL, and regulatory risk scoring models.',
    height: 8.5
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    role: 'Cloud Solutions Associate',
    packageLPA: '22 - 28 LPA',
    color: '#00a4ef',
    accentHex: 0x00f5d4,
    status: 'Eligible',
    eligibilityScore: 94,
    roundsCount: 4,
    openings: 12,
    description: 'Distributed systems, Azure infrastructure, and enterprise AI copilot integrations.',
    height: 11
  },
  {
    id: 'amazon',
    name: 'Amazon',
    role: 'Operations & Business Analyst',
    packageLPA: '18 - 24 LPA',
    color: '#ff9900',
    accentHex: 0xff7b00,
    status: 'Registration Open',
    eligibilityScore: 86,
    roundsCount: 3,
    openings: 15,
    description: 'Supply chain analytics, customer obsession, and high-frequency SQL optimization.',
    height: 10
  }
];

export const PlacementArena3D: React.FC<PlacementArena3DProps> = ({
  onSelectCompany,
  selectedCompanyId
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCompany, setHoveredCompany] = useState<CompanyDriveInfo | null>(null);
  const [activeCompany, setActiveCompany] = useState<CompanyDriveInfo>(
    COMPANIES_3D.find(c => c.id === selectedCompanyId) || COMPANIES_3D[0]
  );
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 3.5, 50);
    pointLight.position.set(0, 8, 0);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(50, 50, 0x0284c7, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const ringGeo = new THREE.RingGeometry(12, 12.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.05;
    scene.add(floorRing);

    const innerRingGeo = new THREE.RingGeometry(4, 4.2, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const innerFloorRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerFloorRing.rotation.x = -Math.PI / 2;
    innerFloorRing.position.y = 0.06;
    scene.add(innerFloorRing);

    const centralGroup = new THREE.Group();
    const centralGeo = new THREE.CylinderGeometry(2.5, 3.2, 1.8, 32);
    const centralMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.4
    });
    const centralPod = new THREE.Mesh(centralGeo, centralMat);
    centralPod.position.y = 0.9;
    centralGroup.add(centralPod);

    const diamondGeo = new THREE.OctahedronGeometry(1.2, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.8,
      wireframe: true
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.y = 4.2;
    centralGroup.add(diamond);
    scene.add(centralGroup);

    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = Math.random() * 16;
      positions[i + 2] = (Math.random() - 0.5) * 40;
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

    const towerMeshes: { mesh: THREE.Mesh; company: CompanyDriveInfo }[] = [];
    const radius = 12;
    const count = COMPANIES_3D.length;

    COMPANIES_3D.forEach((comp, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const towerGroup = new THREE.Group();
      towerGroup.position.set(x, 0, z);

      const w = 2.5;
      const d = 2.5;
      const h = comp.height;

      const geometry = new THREE.BoxGeometry(w, h, d);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.7,
        roughness: 0.2,
        emissive: comp.accentHex,
        emissiveIntensity: 0.35
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = h / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { company: comp };
      towerGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ color: comp.accentHex, linewidth: 2 });
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.y = h / 2;
      towerGroup.add(line);

      const beaconGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: comp.accentHex });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = h + 0.8;
      towerGroup.add(beacon);

      const beamGeo = new THREE.CylinderGeometry(0.06, 0.4, 3, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: comp.accentHex,
        transparent: true,
        opacity: 0.45
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = h + 2.5;
      towerGroup.add(beam);

      scene.add(towerGroup);
      towerMeshes.push({ mesh, company: comp });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetCameraY = 18;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetCameraY = Math.max(8, Math.min(32, targetCameraY - deltaY * 0.05));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(towerMeshes.map(t => t.mesh));
      if (intersects.length > 0) {
        const hitCompany = intersects[0].object.userData.company as CompanyDriveInfo;
        setHoveredCompany(hitCompany);
        container.style.cursor = 'pointer';
      } else {
        setHoveredCompany(null);
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
      const intersects = raycaster.intersectObjects(towerMeshes.map(t => t.mesh));
      if (intersects.length > 0) {
        const clickedCompany = intersects[0].object.userData.company as CompanyDriveInfo;
        setActiveCompany(clickedCompany);
        onSelectCompany(clickedCompany);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(16, Math.min(42, camera.position.z + e.deltaY * 0.03));
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isMouseDown) {
        targetRotationY += 0.0018;
      }

      const camRadius = camera.position.z;
      camera.position.x = Math.sin(targetRotationY) * camRadius;
      camera.position.z = Math.cos(targetRotationY) * camRadius;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 2.5, 0);

      diamond.rotation.y = elapsed * 1.2;
      diamond.rotation.x = elapsed * 0.6;
      diamond.position.y = 4.2 + Math.sin(elapsed * 2) * 0.3;

      floorRing.rotation.z = elapsed * 0.08;
      innerFloorRing.rotation.z = -elapsed * 0.15;

      const posArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < posArr.length; i += 3) {
        posArr[i] += Math.sin(elapsed + i) * 0.01;
        if (posArr[i] > 18) posArr[i] = 0.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      towerMeshes.forEach(t => {
        const isHovered = hoveredCompany?.id === t.company.id;
        const isSelected = activeCompany.id === t.company.id;
        const mat = t.mesh.material as THREE.MeshStandardMaterial;

        if (isHovered || isSelected) {
          mat.emissiveIntensity = 0.85 + Math.sin(elapsed * 6) * 0.25;
          t.mesh.scale.set(1.08, 1.04, 1.08);
        } else {
          mat.emissiveIntensity = 0.35;
          t.mesh.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
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
  }, [isRotating, activeCompany, hoveredCompany]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-sky-500/30 text-xs text-white shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wide text-sky-300">3D RECRUITMENT METAVERSE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">Interactive Corporate Towers</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-sky-500 transition-all flex items-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            {isRotating ? 'Pause Orbit' : 'Resume Orbit'}
          </button>
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[400px] md:h-[480px] cursor-grab active:cursor-grabbing select-none"
      />

      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden md:flex items-center gap-3 text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
        <span>🖱️ <strong>Drag</strong> to rotate</span>
        <span>•</span>
        <span>📜 <strong>Scroll</strong> to zoom</span>
        <span>•</span>
        <span>🎯 <strong>Click tower</strong> to select</span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeCompany.color }}
              />
              <h3 className="text-base font-extrabold text-white tracking-wide">
                {activeCompany.name}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeCompany.status}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">{activeCompany.role}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-emerald-400 font-mono">
              {activeCompany.packageLPA}
            </div>
            <div className="text-[10px] text-slate-400">CTC Package</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <div className="text-[10px] text-slate-400">Eligibility</div>
            <div className="font-bold text-sky-400 mt-0.5">{activeCompany.eligibilityScore}%</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <div className="text-[10px] text-slate-400">Rounds</div>
            <div className="font-bold text-amber-400 mt-0.5">{activeCompany.roundsCount} Stages</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <div className="text-[10px] text-slate-400">Openings</div>
            <div className="font-bold text-emerald-400 mt-0.5">{activeCompany.openings} Seats</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {activeCompany.description}
        </p>

        <button
          onClick={() => onSelectCompany(activeCompany)}
          className="w-full mt-3 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          Enter {activeCompany.name} Selection Drive
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
