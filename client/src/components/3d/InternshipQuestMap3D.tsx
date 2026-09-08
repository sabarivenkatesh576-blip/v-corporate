import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Sparkles, Trophy, ArrowRight, Zap, Target, CheckCircle2, Lock, Eye, Code, Table, BarChart3, Award } from 'lucide-react';

export interface QuestStation {
  week: number;
  title: string;
  category: string;
  color: string;
  accentHex: number;
  status: 'Completed' | 'Current Active' | 'Locked';
  xp: number;
  workstationType: string;
  desc: string;
  deliverable: string;
}

interface InternshipQuestMap3DProps {
  currentWeek: number;
  completedWeeks: number;
  onSelectStation: (weekNum: number) => void;
}

export const QUEST_STATIONS: QuestStation[] = [
  {
    week: 1,
    title: 'Corporate Induction & FRD Blueprint',
    category: 'Business Analysis',
    color: '#10b981',
    accentHex: 0x10b981,
    status: 'Completed',
    xp: 350,
    workstationType: 'Interactive FRD Studio',
    desc: 'Map enterprise business requirements, identify stakeholder pain points, and write technical specifications.',
    deliverable: 'Approved Functional Requirements Document'
  },
  {
    week: 2,
    title: 'Data Architecture & Live SQL Pipeline',
    category: 'Data Engineering',
    color: '#06b6d4',
    accentHex: 0x06b6d4,
    status: 'Current Active',
    xp: 450,
    workstationType: 'Live PostgreSQL Simulator',
    desc: 'Write multi-table SQL joins, CTEs, and aggregation pipelines to extract real-time revenue KPIs.',
    deliverable: 'SQL Query Analytics & Execution Report'
  },
  {
    week: 3,
    title: 'Financial DCF & Margin Optimization',
    category: 'Financial Modeling',
    color: '#f59e0b',
    accentHex: 0xf59e0b,
    status: 'Locked',
    xp: 500,
    workstationType: 'Excel Financial Modeling Grid',
    desc: 'Build 3-statement models, calculate gross margin percentages, EBITDA, and sensitivity analysis.',
    deliverable: 'Audited Financial Model & DCF Valuation'
  },
  {
    week: 4,
    title: 'Executive Capstone & Boardroom Pitch',
    category: 'Strategic Consulting',
    color: '#a855f7',
    accentHex: 0xa855f7,
    status: 'Locked',
    xp: 750,
    workstationType: 'AI Executive Presentation Arena',
    desc: 'Deliver real-time client presentation to Dr. Alistair Vance with speech pacing & executive Q&A.',
    deliverable: 'Verified Verifiable Blockchain Credential & Offer Letter'
  }
];

export const InternshipQuestMap3D: React.FC<InternshipQuestMap3DProps> = ({
  currentWeek,
  completedWeeks,
  onSelectStation
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedStation, setSelectedStation] = useState<QuestStation>(
    QUEST_STATIONS.find(s => s.week === currentWeek) || QUEST_STATIONS[1]
  );
  const [hoveredStation, setHoveredStation] = useState<QuestStation | null>(null);
  const [isOrbiting, setIsOrbiting] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060c18, 0.022);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight.position.set(10, 25, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 3.0, 40);
    pointLight.position.set(0, 6, 0);
    scene.add(pointLight);

    // Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(45, 45, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Station Coordinates along an S-curved cyber pathway
    const stationCoords = [
      { x: -12, z: 6 },
      { x: -4, z: -4 },
      { x: 4, z: 6 },
      { x: 12, z: -4 }
    ];

    // Draw glowing cyber conduits / rails between stations
    const curvePoints = stationCoords.map(c => new THREE.Vector3(c.x, 0.6, c.z));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.22, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.7,
      metalness: 0.8
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // Station Meshes
    const stationMeshes: { mesh: THREE.Mesh; station: QuestStation; shape: THREE.Mesh }[] = [];

    QUEST_STATIONS.forEach((station, idx) => {
      const coord = stationCoords[idx];
      const isCurrent = station.week === currentWeek;
      const isDone = station.week <= completedWeeks;
      const stationGroup = new THREE.Group();
      stationGroup.position.set(coord.x, 0, coord.z);

      // Station Base Pedestal
      const baseGeo = new THREE.CylinderGeometry(2.2, 2.6, 1.2, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: station.accentHex,
        emissiveIntensity: isCurrent ? 0.8 : (isDone ? 0.5 : 0.2),
        metalness: 0.8,
        roughness: 0.3
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.6;
      baseMesh.userData = { station };
      stationGroup.add(baseMesh);

      // Wireframe edge
      const edges = new THREE.EdgesGeometry(baseGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: station.accentHex,
        linewidth: 2
      });
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.y = 0.6;
      stationGroup.add(line);

      // Holographic Rotating Icon / Artifact on top
      let artifactGeo: THREE.BufferGeometry;
      if (station.week === 1) artifactGeo = new THREE.OctahedronGeometry(0.9, 0);
      else if (station.week === 2) artifactGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 16);
      else if (station.week === 3) artifactGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
      else artifactGeo = new THREE.TorusGeometry(0.75, 0.25, 16, 32);

      const artifactMat = new THREE.MeshStandardMaterial({
        color: station.accentHex,
        emissive: station.accentHex,
        emissiveIntensity: isCurrent ? 1.0 : 0.5,
        wireframe: !isDone && !isCurrent,
        metalness: 0.9,
        roughness: 0.1
      });
      const artifactMesh = new THREE.Mesh(artifactGeo, artifactMat);
      artifactMesh.position.y = 2.4;
      stationGroup.add(artifactMesh);

      // Hologram ring around artifact
      const haloGeo = new THREE.RingGeometry(1.4, 1.55, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: station.accentHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isCurrent ? 0.85 : 0.4
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      haloMesh.position.y = 2.4;
      stationGroup.add(haloMesh);

      scene.add(stationGroup);
      stationMeshes.push({ mesh: baseMesh, station, shape: artifactMesh });
    });

    // Animated Drone / Avatar at Current Active Station
    const currentCoord = stationCoords[Math.min(currentWeek - 1, 3)];
    const droneGroup = new THREE.Group();
    droneGroup.position.set(currentCoord.x, 4.5, currentCoord.z);

    const droneGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const droneMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0
    });
    const droneMesh = new THREE.Mesh(droneGeo, droneMat);
    droneGroup.add(droneMesh);

    const droneRingGeo = new THREE.TorusGeometry(0.75, 0.08, 12, 32);
    const droneRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const droneRing = new THREE.Mesh(droneRingGeo, droneRingMat);
    droneRing.rotation.x = Math.PI / 2;
    droneGroup.add(droneRing);
    scene.add(droneGroup);

    // Floating Cyber Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = Math.random() * 12 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 35;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.22,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Raycasting & Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetCameraY = 16;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetCameraY = Math.max(6, Math.min(28, targetCameraY - deltaY * 0.05));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stationMeshes.map(s => s.mesh));
      if (intersects.length > 0) {
        const hitStation = intersects[0].object.userData.station as QuestStation;
        setHoveredStation(hitStation);
        container.style.cursor = 'pointer';
      } else {
        setHoveredStation(null);
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
      const intersects = raycaster.intersectObjects(stationMeshes.map(s => s.mesh));
      if (intersects.length > 0) {
        const clickedStation = intersects[0].object.userData.station as QuestStation;
        setSelectedStation(clickedStation);
        onSelectStation(clickedStation.week);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(14, Math.min(38, camera.position.z + e.deltaY * 0.03));
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

      if (isOrbiting && !isMouseDown) {
        targetRotationY += 0.0015;
      }

      const camRadius = camera.position.z;
      camera.position.x = Math.sin(targetRotationY) * camRadius;
      camera.position.z = Math.cos(targetRotationY) * camRadius;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 2, 0);

      // Drone float & spin
      droneGroup.position.y = 4.5 + Math.sin(elapsed * 3) * 0.35;
      droneRing.rotation.z = elapsed * 3;

      // Station shapes rotation
      stationMeshes.forEach((s, idx) => {
        s.shape.rotation.y = elapsed * (1.0 + idx * 0.2);
        s.shape.position.y = 2.4 + Math.sin(elapsed * 2 + idx) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
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
  }, [isOrbiting, currentWeek, completedWeeks]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-sky-500/30 text-xs text-white shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wide text-cyan-300">3D INTERNSHIP QUEST WORLD</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-[11px]">4-Week Corporate Simulation Trail</span>
        </div>

        <button
          onClick={() => setIsOrbiting(!isOrbiting)}
          className="pointer-events-auto px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 transition-all flex items-center gap-1.5 shadow-md"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          {isOrbiting ? 'Pause Orbit' : 'Resume Orbit'}
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[380px] md:h-[440px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Selected Station Card */}
      <div className="absolute bottom-3 right-3 z-10 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedStation.color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Week {selectedStation.week} Sprint
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                +{selectedStation.xp} XP
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white mt-1">
              {selectedStation.title}
            </h3>
          </div>
        </div>

        <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Workstation: <strong className="text-white">{selectedStation.workstationType}</strong></span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {selectedStation.desc}
        </p>

        <button
          onClick={() => onSelectStation(selectedStation.week)}
          className="w-full mt-3 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          Launch Week {selectedStation.week} 3D Workstation
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
