import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Box,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Palette,
  Sparkles,
  Zap,
  Info,
  Maximize2,
} from "lucide-react";

interface CubeApolloTabProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

export const CubeApolloTab: React.FC<CubeApolloTabProps> = ({ onOpenAiModal }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [aktinaVisible, setAktinaVisible] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Audio Context Ref for Pythagorean Harmonics Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const worldGroupRef = useRef<THREE.Group | null>(null);
  const centralCubeRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const centralPulseLightRef = useRef<THREE.PointLight | null>(null);

  // Play Pythagorean Sound Synthesis (Synthesizer Chime - 432Hz & 528Hz Solfeggio / Apollo chord)
  const playAktinaSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const frequencies = [432, 528, 648, 864, 1332]; // Sacred Apollo & Harmonic ratios

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8 + idx * 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch {
      // Ignore audio synthesis errors on autoplay blocks
    }
  };

  // Helper for texture on the central cube
  const createCentralCubeTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    ctx.fillStyle = "#0c0a07";
    ctx.fillRect(0, 0, 1024, 1024);

    // Border
    ctx.strokeStyle = "#c89b3c";
    ctx.lineWidth = 24;
    ctx.strokeRect(30, 30, 964, 964);

    // Header Text: Η ΑΓΑΠΗ ΕΣΤΙΝ
    ctx.fillStyle = "#f5ebd7";
    ctx.font = "bold 68px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Η ΑΓΑΠΗ ΕΣΤΙΝ", 512, 400);

    // Isopsephic Core: ΧΞϚ (666)
    ctx.fillStyle = "#e6c670";
    ctx.font = "bold 130px Georgia, serif";
    ctx.fillText("ΧΞϚ", 512, 600);

    // Subtitle: 666
    ctx.fillStyle = "#c89b3c";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("= 666", 512, 720);

    return new THREE.CanvasTexture(canvas);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0806, 0.022);
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(16, 14, 18);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.setClearColor(0x0a0806, 1);
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.minDistance = 3;
    controls.maxDistance = 55;
    controls.zoomSpeed = 1.2;
    controlsRef.current = controls;

    // WORLD GROUP
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    worldGroupRef.current = worldGroup;

    // AXES (Cylinders for Greek Dimensions)
    const axisXMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.6 });
    const axisX = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 13, 16), axisXMat);
    axisX.rotation.z = Math.PI / 2;
    worldGroup.add(axisX);

    const axisYMat = new THREE.MeshBasicMaterial({ color: 0xeab308, transparent: true, opacity: 0.6 });
    const axisY = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 13, 16), axisYMat);
    worldGroup.add(axisY);

    const axisZMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const axisZ = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 13, 16), axisZMat);
    axisZ.rotation.x = Math.PI / 2;
    worldGroup.add(axisZ);

    // 11x11x11 CUBE GENERATION
    const layerColors = [0x38bdf8, 0x10b981, 0xef4444, 0xeab308, 0xf97316];
    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const centralTexture = createCentralCubeTexture();

    // Central Pulse Light
    const pulseLight = new THREE.PointLight(0xffeedd, 3, 10);
    pulseLight.position.set(0, 0, 0);
    worldGroup.add(pulseLight);
    centralPulseLightRef.current = pulseLight;

    for (let x = 0; x < 11; x++) {
      for (let y = 0; y < 11; y++) {
        for (let z = 0; z < 11; z++) {
          const dx = Math.abs(x - 5);
          const dy = Math.abs(y - 5);
          const dz = Math.abs(z - 5);
          const dist = Math.max(dx, dy, dz);

          if (dist === 0) {
            // CENTRAL CORE: (0, 0, 0)
            const centralMat = new THREE.MeshStandardMaterial({
              map: centralTexture || undefined,
              color: centralTexture ? 0xffffff : 0xe6c670,
              roughness: 0.2,
              metalness: 0.8,
              emissive: 0xc89b3c,
              emissiveIntensity: 0.6,
            });
            const centralCube = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), centralMat);
            centralCube.userData = { isCentral: true };
            worldGroup.add(centralCube);
            centralCubeRef.current = centralCube;
          } else {
            // Concentric Shell Cubes
            const colorHex = dist === 1 ? 0x1c1611 : layerColors[dist % layerColors.length];
            const mat = new THREE.MeshStandardMaterial({
              color: colorHex,
              roughness: 0.35,
              metalness: 0.5,
              emissive: colorHex,
              emissiveIntensity: dist === 1 ? 0.08 : 0.22,
            });
            const cube = new THREE.Mesh(cubeGeo, mat);
            cube.position.set(x - 5, y - 5, z - 5);
            worldGroup.add(cube);
          }
        }
      }
    }

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffeedd, 2.0);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-20, -15, -20);
    scene.add(dirLight2);

    // RAYCASTER FOR INTERACTIVITY
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (centralCubeRef.current) {
        const intersects = raycaster.intersectObject(centralCubeRef.current);
        if (intersects.length > 0) {
          triggerAktinaDios();
        }
      }
    };

    renderer.domElement.addEventListener("click", handleCanvasClick);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (worldGroupRef.current && !isPaused) {
        worldGroupRef.current.rotation.y = elapsed * 0.09;
      }

      if (centralPulseLightRef.current) {
        centralPulseLightRef.current.intensity = 2.5 + Math.sin(elapsed * 3) * 1.2;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      renderer.dispose();
    };
  }, [isPaused]);

  // Trigger Flash of Zeus
  const triggerAktinaDios = () => {
    setAktinaVisible(true);
    playAktinaSound();

    if (centralPulseLightRef.current) {
      centralPulseLightRef.current.intensity = 15;
      centralPulseLightRef.current.color.setHex(0xffffff);
      setTimeout(() => {
        if (centralPulseLightRef.current) {
          centralPulseLightRef.current.intensity = 3;
          centralPulseLightRef.current.color.setHex(0xffeedd);
        }
      }, 800);
    }

    setTimeout(() => {
      setAktinaVisible(false);
    }, 3800);
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const target = controlsRef.current.target;
    if (direction === "in") {
      camera.position.lerp(target, 0.2);
    } else {
      const dir = camera.position.clone().sub(target).normalize();
      camera.position.addScaledVector(dir, 3.5);
    }
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(16, 14, 18);
    controlsRef.current.target.set(0, 0, 0);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1611] via-[#120e0b] to-[#0a0806] border border-[#c89b3c]/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-serif font-semibold bg-[#c89b3c]/20 text-[#e6c670] border border-[#c89b3c]/40 uppercase tracking-wider">
                3D Ιερή Γεωμετρία
              </span>
              <span className="text-xs text-[#a89984] font-sans">
                11³ = 1331 = ΑΠΟΛΛΩΝΟΣ = ΙΑ×ΙΑ×ΙΑ = ΆΤΛΑ
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f5ebd7] tracking-tight flex items-center gap-3">
              <Box className="w-7 h-7 text-[#c89b3c]" />
              Ο Κύβος του Απόλλωνος (11×11×11)
            </h1>
            <p className="text-[#a89984] text-sm md:text-base mt-1 max-w-3xl leading-relaxed">
              Τρισδιάστατη διαδραστική απεικόνιση των 1331 στοιχειακών κύβων του Απόλλωνος, με κεντρικό πυρήνα
              το «Η ΑΓΑΠΗ ΕΣΤΙΝ ΧΞϚ» και ομόκεντρα στρώματα θεολογικής και λεξαριθμικής αρμονίας.
            </p>
          </div>

          {onOpenAiModal && (
            <button
              onClick={() => onOpenAiModal("ΚΥΒΟΣ ΑΠΟΛΛΩΝΟΣ", 1331, ["ΑΠΟΛΛΩΝΟΣ", "1331", "ΚΥΒΟΣ", "ΧΞϚ"])}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-serif hover:border-[#c89b3c] transition-all shrink-0 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Ανάλυση Κύβου AI</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-[#3e3020] bg-[#070504] shadow-2xl transition-all ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-none h-screen" : "h-[620px]"
        }`}
      >
        {/* Top Header Badge Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-[#14100c]/90 backdrop-blur-md border border-[#c89b3c]/40 px-5 py-2 rounded-xl shadow-lg">
          <div className="font-serif text-sm font-bold text-[#e6c670] tracking-wider">
            ΑΠΟΛΛΩΝΟΣ = 1331
          </div>
          <div className="font-serif text-xs text-[#d6c7b2] font-semibold">
            11 × 11 × 11 = ΙΑ × ΙΑ × ΙΑ = ΆΤΛΑ
          </div>
        </div>

        {/* Ray of Zeus Banner */}
        <div
          className={`absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-6 py-2.5 rounded-full bg-red-600/90 text-white border-2 border-red-400 shadow-2xl font-serif font-bold text-sm md:text-base tracking-widest transition-all duration-500 flex items-center gap-2 ${
            aktinaVisible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          }`}
        >
          <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
          <span>⚡ ΑΚΤΙΝΑ ΔΙΟΣ ⚡</span>
        </div>

        {/* 3D Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Controls Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 bg-[#14100c]/90 backdrop-blur-md border border-[#3e3020] p-2 rounded-xl shadow-2xl max-w-[95%]">
          <button
            onClick={() => handleZoom("in")}
            className="p-2 rounded-lg bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
            title="Μεγέθυνση (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom("out")}
            className="p-2 rounded-lg bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
            title="Σμίκρυνση (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            className="p-2 rounded-lg bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
            title="Επαναφορά Κάμερας"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-2 rounded-lg border text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPaused
                ? "bg-[#c89b3c] text-black border-[#c89b3c]"
                : "bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border-[#3e3020]"
            }`}
            title="Παύση / Συνέχιση Περιστροφής"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? "Συνέχεια" : "Παύση"}</span>
          </button>

          <button
            onClick={triggerAktinaDios}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-900/60 to-amber-900/60 hover:from-red-800 hover:to-amber-800 border border-red-500/50 text-[#f5ebd7] text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Ενεργοποίηση Ακτίνας Διός"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Ακτίνα Διός</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
              soundEnabled
                ? "bg-[#221a12] text-[#e6c670] border-[#c89b3c]/50"
                : "bg-[#14100c] text-[#8c7e6c] border-[#3e3020]"
            }`}
            title={soundEnabled ? "Ήχος Ενεργός" : "Ήχος Ανενεργός"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`px-3 py-2 rounded-lg border text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showLegend
                ? "bg-[#281f15] text-[#e6c670] border-[#c89b3c]"
                : "bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border-[#3e3020]"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Υπόμνημα</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-lg bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
            title="Οδηγίες"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
            title="Πλήρης Οθόνη"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Color Legend Drawer Overlay */}
        {showLegend && (
          <div className="absolute bottom-20 left-4 z-30 w-72 rounded-xl bg-[#14100c]/95 backdrop-blur-md border border-[#3e3020] p-4 shadow-2xl text-xs font-serif animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#2e2318]">
              <span className="font-bold text-[#e6c670] uppercase tracking-wider">
                Υπόμνημα Στρωμάτων Κύβου
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-[#8c7e6c] hover:text-[#f5ebd7] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-[#38bdf8] shrink-0 shadow-sm" />
                <span className="text-[#d6c7b2]">Μπλε: Η ΚΑΤΑΝΟΗΣΗ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-[#10b981] shrink-0 shadow-sm" />
                <span className="text-[#d6c7b2]">Πράσινο: ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-[#ef4444] shrink-0 shadow-sm" />
                <span className="text-[#d6c7b2]">Κόκκινο: Η ΠΑΝΑΓΙΑ Η ΟΔΗΓΗΤΡΙΑ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-[#eab308] shrink-0 shadow-sm" />
                <span className="text-[#d6c7b2]">Κίτρινο: Ο ΝΙΚΗΤΗΣ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-[#f97316] shrink-0 shadow-sm" />
                <span className="text-[#d6c7b2]">Πορτοκαλί: ΑΓΑΘΟΔΟΤΗΣ</span>
              </div>
              <div className="pt-2 mt-2 border-t border-[#221a12] flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-[#c89b3c] border border-amber-300 shrink-0 shadow-sm" />
                <span className="text-[#e6c670] font-bold">Πυρήνας: Η ΑΓΑΠΗ ΕΣΤΙΝ ΧΞϚ (666)</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Modal */}
        {showHelp && (
          <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#14100c] border border-[#c89b3c]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl font-serif text-[#f5ebd7]">
              <h3 className="text-lg font-bold text-[#e6c670] flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-[#c89b3c]" />
                Οδηγίες Εξερεύνησης Κύβου Απόλλωνος
              </h3>
              <div className="text-xs text-[#d6c7b2] space-y-2.5 leading-relaxed">
                <p>
                  • <strong>Περιστροφή:</strong> Σύρετε με το ποντίκι ή το δάκτυλο για να περιστρέψετε ελεύθερα τον 3D κύβο.
                </p>
                <p>
                  • <strong>Εστίαση (Zoom):</strong> Χρησιμοποιήστε τη ροδέλα του ποντικιού, την κίνηση pinch σε κινητά, ή τα κουμπιά 🔍+ / 🔍-.
                </p>
                <p>
                  • <strong>Ακτίνα Διός:</strong> Κάντε κλικ <strong>ακριβώς στον κεντρικό πυρήνα</strong> ή στο κουμπί <em>Ακτίνα Διός</em> για να ενεργοποιήσετε την αρμονική έκλαμψη και την πυθαγόρεια συγχορδία των 432 Hz.
                </p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-5 py-2.5 rounded-xl bg-[#c89b3c] hover:bg-[#dfb04d] text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Κατάλαβα
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-[#14100c] border border-[#2e2318]">
          <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#c89b3c]" />
            11³ = 1331 = ΑΠΟΛΛΩΝΟΣ
          </h3>
          <p className="text-xs text-[#a89984] leading-relaxed">
            Ο αριθμός 1331 αποτελεί τον τέλειο κύβο της ενδεκάδος ($11 \times 11 \times 11 = 1331$).
            Στην ιωνική ισοψηφία, <strong>ΑΠΟΛΛΩΝΟΣ = 1331</strong> ($1+80+70+30+30+800+50+70+200$).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#14100c] border border-[#2e2318]">
          <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#c89b3c]" />
            Ο Κεντρικός Πυρήνας (666)
          </h3>
          <p className="text-xs text-[#a89984] leading-relaxed">
            Στο γεωμετρικό κέντρο $(0,0,0)$ εδράζεται ο ισοψηφικός πυρήνας <strong>«Η ΑΓΑΠΗ ΕΣΤΙΝ» = 666</strong>,
            καθώς και το ιερό σύμβολο <strong>ΧΞϚ</strong> ($600+60+6 = 666$), πλαισιωμένο από τα 5 ομόκεντρα στρώματα.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#14100c] border border-[#2e2318]">
          <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#c89b3c]" />
            Πυθαγόρεια Συχνότητα 432 Hz
          </h3>
          <p className="text-xs text-[#a89984] leading-relaxed">
            Η ακουστική σύνθεση βασίζεται στις αρχαίες αναλογίες των 432 Hz, 528 Hz και 1332 Hz,
            δημιουργώντας έναν αρμονικό συντονισμό με τη γεωμετρία του σύμπαντος.
          </p>
        </div>
      </div>
    </div>
  );
};
