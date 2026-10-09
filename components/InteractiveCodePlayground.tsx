import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Pause, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Gamepad2, 
  Code2, 
  Trophy, 
  Zap, 
  Shield, 
  Flame, 
  Terminal, 
  Cpu, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Crosshair,
  Award,
  CheckCircle2,
  Trash2,
  Sliders
} from 'lucide-react';

// Web Audio API Synthesizer Helper
class SoundFx {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio fallback silent
    }
  }

  playExplosion() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Audio fallback silent
    }
  }

  playGem() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Audio fallback silent
    }
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.2);
      });
    } catch {
      // Audio fallback silent
    }
  }
}

const sfx = new SoundFx();

// --- GAME 1: SPACE CODE DEFENDER ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  maxHp: number;
  type: 'glitch' | 'syntax' | 'meteor' | 'boss';
  label: string;
}

interface Item {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: 'gem' | 'star' | 'shield';
  label: string;
}

export const InteractiveCodePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arcade' | 'maze' | 'turtle'>('arcade');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synchronize audio toggle
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // ==========================================
  // GAME 1: SPACE CODE DEFENDER STATE & REFS
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [level, setLevel] = useState(1);
  const [shields, setShields] = useState(3);
  const [bugsSquashed, setBugsSquashed] = useState(0);

  // Hacker Terminal Modifiable Variables
  const [laserMode, setLaserMode] = useState<'single' | 'triple' | 'plasma'>('triple');
  const [shipSpeed, setShipSpeed] = useState<number>(6);
  const [laserColor, setLaserColor] = useState<string>('#00f0ff');
  const [scoreMultiplier, setScoreMultiplier] = useState<number>(2);
  const [shieldRecharge, setShieldRecharge] = useState<boolean>(true);

  // Ship position & movement
  const shipRef = useRef({
    x: 250,
    y: 340,
    width: 32,
    height: 32,
    vx: 0,
    vy: 0,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastShotRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const enemyIdCounter = useRef<number>(1);
  const itemIdCounter = useRef<number>(1);
  const waveTimerRef = useRef<number>(0);

  // Initialize high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('codeDefenderHighScore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // Fallback
    }
  }, []);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('codeDefenderHighScore', score.toString());
      } catch {
        // Fallback
      }
    }
  }, [score, highScore]);

  // Key Listeners for Arcade
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing with Arrow keys or Spacebar
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (activeTab === 'arcade') {
          e.preventDefault();
        }
      }
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ') {
        keysRef.current['space'] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.key === ' ') {
        keysRef.current['space'] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab]);

  // Spawn Enemy
  const spawnEnemy = (canvasWidth: number) => {
    const types: ('glitch' | 'syntax' | 'meteor' | 'boss')[] = ['glitch', 'syntax', 'meteor'];
    if (Math.random() < 0.1 + level * 0.03) {
      types.push('boss');
    }
    const type = types[Math.floor(Math.random() * types.length)];
    const size = type === 'boss' ? 36 : type === 'meteor' ? 28 : 24;
    const hp = type === 'boss' ? 4 : type === 'meteor' ? 2 : 1;
    const labels = {
      glitch: '👾 Glitch',
      syntax: '🐛 Syntax',
      meteor: '☄️ Loop',
      boss: '🤖 NullPtr'
    };

    const newEnemy: Enemy = {
      id: enemyIdCounter.current++,
      x: Math.random() * (canvasWidth - size * 2) + size,
      y: -40,
      vx: (Math.random() - 0.5) * (1 + level * 0.4),
      vy: (1.2 + Math.random() * 1.5) * (1 + level * 0.15),
      size,
      hp,
      maxHp: hp,
      type,
      label: labels[type],
    };
    enemiesRef.current.push(newEnemy);
  };

  // Spawn Power-up Item
  const spawnItem = (x: number, y: number) => {
    if (Math.random() > 0.45) return;
    const types: ('gem' | 'star' | 'shield')[] = ['gem', 'star'];
    if (Math.random() < 0.25) types.push('shield');
    const type = types[Math.floor(Math.random() * types.length)];
    const labels = {
      gem: '💎 Python',
      star: '⭐ Scratch',
      shield: '🛡️ Shield'
    };

    itemsRef.current.push({
      id: itemIdCounter.current++,
      x,
      y,
      vy: 1.8,
      type,
      label: labels[type]
    });
  };

  // Create Explosion Particles
  const createExplosion = (x: number, y: number, color: string, count = 16) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      });
    }
  };

  // Fire Bullet
  const fireBullet = () => {
    const ship = shipRef.current;
    sfx.playLaser();

    if (laserMode === 'single') {
      bulletsRef.current.push({
        x: ship.x,
        y: ship.y - 18,
        vx: 0,
        vy: -9,
        color: laserColor,
        radius: 4,
      });
    } else if (laserMode === 'triple') {
      bulletsRef.current.push(
        { x: ship.x, y: ship.y - 18, vx: 0, vy: -9, color: laserColor, radius: 3.5 },
        { x: ship.x - 10, y: ship.y - 12, vx: -1.8, vy: -8.5, color: laserColor, radius: 3 },
        { x: ship.x + 10, y: ship.y - 12, vx: 1.8, vy: -8.5, color: laserColor, radius: 3 }
      );
    } else if (laserMode === 'plasma') {
      bulletsRef.current.push({
        x: ship.x,
        y: ship.y - 20,
        vx: 0,
        vy: -7,
        color: '#f43f5e',
        radius: 8,
      });
    }
  };

  // Start / Restart Game
  const startArcadeGame = () => {
    setGameOver(false);
    setGameRunning(true);
    setScore(0);
    setCombo(1);
    setLevel(1);
    setShields(3);
    setBugsSquashed(0);
    bulletsRef.current = [];
    enemiesRef.current = [];
    itemsRef.current = [];
    particlesRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      shipRef.current.x = canvas.width / 2;
      shipRef.current.y = canvas.height - 60;
    }
  };

  // Main Arcade Loop
  useEffect(() => {
    if (activeTab !== 'arcade' || !gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const loop = (timestamp: number) => {
      if (!isMounted || !gameRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. CLEAR CANVAS WITH CYBER GRID
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Starfield / Grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridOffset = (timestamp * 0.05) % 30;
      for (let y = gridOffset; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. PLAYER SHIP CONTROLS
      const ship = shipRef.current;
      const keys = keysRef.current;

      let dx = 0;
      let dy = 0;
      if (keys['arrowleft'] || keys['a']) dx -= 1;
      if (keys['arrowright'] || keys['d']) dx += 1;
      if (keys['arrowup'] || keys['w']) dy -= 1;
      if (keys['arrowdown'] || keys['s']) dy += 1;

      ship.x += dx * shipSpeed;
      ship.y += dy * shipSpeed;

      // Clamp to boundaries
      ship.x = Math.max(20, Math.min(width - 20, ship.x));
      ship.y = Math.max(50, Math.min(height - 30, ship.y));

      // Auto / Keyboard Fire
      if (keys['space'] || keys['f']) {
        if (timestamp - lastShotRef.current > 180) {
          fireBullet();
          lastShotRef.current = timestamp;
        }
      }

      // 3. DRAW PLAYER SHIP
      ctx.save();
      ctx.translate(ship.x, ship.y);

      // Ship Engine Glow Thruster
      ctx.beginPath();
      ctx.fillStyle = timestamp % 200 > 100 ? '#f59e0b' : '#ef4444';
      ctx.moveTo(-6, 12);
      ctx.lineTo(0, 22 + Math.sin(timestamp * 0.02) * 4);
      ctx.lineTo(6, 12);
      ctx.fill();

      // Ship Wings & Hull
      ctx.beginPath();
      ctx.fillStyle = '#38bdf8';
      ctx.moveTo(0, -18);
      ctx.lineTo(16, 12);
      ctx.lineTo(6, 8);
      ctx.lineTo(0, 10);
      ctx.lineTo(-6, 8);
      ctx.lineTo(-16, 12);
      ctx.closePath();
      ctx.fill();

      // Cockpit Window
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (shields > 0) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // 4. BULLETS UPDATE & DRAW
      for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const b = bulletsRef.current[i];
        b.x += b.vx;
        b.y += b.vy;

        // Draw bullet
        ctx.beginPath();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Remove off-screen
        if (b.y < -20 || b.x < 0 || b.x > width) {
          bulletsRef.current.splice(i, 1);
        }
      }

      // 5. SPAWN ENEMIES
      waveTimerRef.current++;
      const spawnInterval = Math.max(35, 75 - level * 8);
      if (waveTimerRef.current % spawnInterval === 0) {
        spawnEnemy(width);
      }

      // 6. ENEMIES UPDATE & COLLISION
      for (let ei = enemiesRef.current.length - 1; ei >= 0; ei--) {
        const e = enemiesRef.current[ei];
        e.x += e.vx;
        e.y += e.vy;

        // Bounce horizontally
        if (e.x < e.size || e.x > width - e.size) {
          e.vx *= -1;
        }

        // Draw enemy
        ctx.save();
        ctx.translate(e.x, e.y);

        if (e.type === 'glitch') {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(0, 0, e.size / 2, 0, Math.PI * 2);
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-5, -3, 3, 3);
          ctx.fillRect(2, -3, 3, 3);
        } else if (e.type === 'syntax') {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.rect(-e.size / 2, -e.size / 2, e.size, e.size);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = '10px monospace';
          ctx.fillText('{;}', -8, 4);
        } else if (e.type === 'meteor') {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(0, 0, e.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Boss
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, e.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // HP bar for multi-hit enemies
        if (e.maxHp > 1) {
          ctx.fillStyle = '#374151';
          ctx.fillRect(-12, -e.size / 2 - 8, 24, 3);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-12, -e.size / 2 - 8, (24 * e.hp) / e.maxHp, 3);
        }

        ctx.restore();

        // Check bullet collision
        for (let bi = bulletsRef.current.length - 1; bi >= 0; bi--) {
          const b = bulletsRef.current[bi];
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < e.size / 2 + b.radius) {
            // Hit!
            bulletsRef.current.splice(bi, 1);
            e.hp--;
            createExplosion(b.x, b.y, b.color, 6);

            if (e.hp <= 0) {
              sfx.playExplosion();
              createExplosion(e.x, e.y, e.type === 'boss' ? '#ef4444' : '#a855f7', 18);
              spawnItem(e.x, e.y);
              enemiesRef.current.splice(ei, 1);

              const pointsEarned = (e.type === 'boss' ? 500 : 100) * combo * scoreMultiplier;
              setScore((prev) => prev + pointsEarned);
              setCombo((prev) => Math.min(prev + 1, 8));
              setBugsSquashed((prev) => {
                const updated = prev + 1;
                if (updated % 10 === 0) {
                  setLevel((lvl) => Math.min(lvl + 1, 5));
                  sfx.playVictory();
                }
                return updated;
              });
              break;
            }
          }
        }

        // Check ship collision
        const shipDist = Math.hypot(ship.x - e.x, ship.y - e.y);
        if (shipDist < e.size / 2 + 14) {
          createExplosion(ship.x, ship.y, '#ef4444', 20);
          sfx.playExplosion();
          enemiesRef.current.splice(ei, 1);
          setCombo(1);

          setShields((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              setGameRunning(false);
              setGameOver(true);
            }
            return Math.max(0, next);
          });
        }

        // Reached bottom
        if (e.y > height + 40) {
          enemiesRef.current.splice(ei, 1);
          setCombo(1);
        }
      }

      // 7. ITEMS UPDATE & PICKUP
      for (let ii = itemsRef.current.length - 1; ii >= 0; ii--) {
        const it = itemsRef.current[ii];
        it.y += it.vy;

        // Draw item
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.font = '14px sans-serif';
        ctx.fillText(it.type === 'gem' ? '💎' : it.type === 'star' ? '⭐' : '🛡️', -7, 5);
        ctx.restore();

        // Ship pickup
        const pickDist = Math.hypot(ship.x - it.x, ship.y - it.y);
        if (pickDist < 26) {
          sfx.playGem();
          createExplosion(it.x, it.y, '#38bdf8', 12);
          if (it.type === 'shield') {
            if (shieldRecharge) setShields((s) => Math.min(s + 1, 4));
          } else {
            setScore((prev) => prev + (it.type === 'gem' ? 250 : 150) * scoreMultiplier);
          }
          itemsRef.current.splice(ii, 1);
        } else if (it.y > height + 20) {
          itemsRef.current.splice(ii, 1);
        }
      }

      // 8. PARTICLES UPDATE & DRAW
      for (let pi = particlesRef.current.length - 1; pi >= 0; pi--) {
        const p = particlesRef.current[pi];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(pi, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, gameRunning, laserMode, shipSpeed, laserColor, scoreMultiplier, shieldRecharge, shields, combo, level]);

  // On-screen control helpers for mobile/touch
  const handleTouchMove = (direction: 'left' | 'right' | 'up' | 'down') => {
    const ship = shipRef.current;
    if (direction === 'left') ship.x = Math.max(20, ship.x - shipSpeed * 3);
    if (direction === 'right') ship.x = Math.min(480, ship.x + shipSpeed * 3);
    if (direction === 'up') ship.y = Math.max(50, ship.y - shipSpeed * 3);
    if (direction === 'down') ship.y = Math.min(380, ship.y + shipSpeed * 3);
  };

  // ==========================================
  // GAME 2: ALGORITHM MAZE PUZZLE BOT STATE
  // ==========================================
  type MazeCommand = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'HACK';
  const [mazeLevel, setMazeLevel] = useState(1);
  const [programStack, setProgramStack] = useState<MazeCommand[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [botPos, setBotPos] = useState({ x: 0, y: 0, dir: 1 }); // dir: 0=up, 1=right, 2=down, 3=left
  const [mazeGemsCollected, setMazeGemsCollected] = useState(0);
  const [mazeSuccess, setMazeSuccess] = useState(false);
  const [mazeMessage, setMazeMessage] = useState('Stack commands to guide Bot to the Server!');

  // Maze level layouts (5x5 grid)
  const mazeLayouts = [
    {
      level: 1,
      name: 'Sequence 101: Linear Path',
      start: { x: 0, y: 2, dir: 1 },
      goal: { x: 4, y: 2 },
      gems: [{ x: 2, y: 2 }],
      walls: [{ x: 1, y: 1 }, { x: 3, y: 3 }],
      optimalSteps: 4,
    },
    {
      level: 2,
      name: 'Corners & Turns: Bug Maze',
      start: { x: 0, y: 0, dir: 1 },
      goal: { x: 4, y: 4 },
      gems: [{ x: 2, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 2 }],
      walls: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 3 }],
      optimalSteps: 8,
    },
    {
      level: 3,
      name: 'Firewall Breach: Logic Hacker',
      start: { x: 0, y: 4, dir: 0 },
      goal: { x: 4, y: 0 },
      gems: [{ x: 0, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 }],
      walls: [{ x: 1, y: 4 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 0 }],
      optimalSteps: 10,
    },
  ];

  const currentMaze = mazeLayouts[mazeLevel - 1] || mazeLayouts[0];

  // Reset Maze Bot
  const resetMaze = (lvl = mazeLevel) => {
    const layout = mazeLayouts[lvl - 1] || mazeLayouts[0];
    setBotPos({ ...layout.start });
    setMazeGemsCollected(0);
    setMazeSuccess(false);
    setActiveStep(null);
    setIsExecuting(false);
    setMazeMessage('Stack commands and click "Run Algorithm"!');
  };

  useEffect(() => {
    resetMaze(mazeLevel);
    setProgramStack([]);
  }, [mazeLevel]);

  // Execute Algorithm Step-by-Step
  const runAlgorithm = async () => {
    if (programStack.length === 0 || isExecuting) return;
    setIsExecuting(true);
    setMazeSuccess(false);
    setMazeMessage('Executing instructions sequentially...');

    let curX = currentMaze.start.x;
    let curY = currentMaze.start.y;
    let curDir = currentMaze.start.dir;
    let gems = 0;

    for (let i = 0; i < programStack.length; i++) {
      setActiveStep(i);
      const cmd = programStack[i];
      sfx.playLaser();

      if (cmd === 'FORWARD') {
        const dx = curDir === 1 ? 1 : curDir === 3 ? -1 : 0;
        const dy = curDir === 2 ? 1 : curDir === 0 ? -1 : 0;
        const nextX = curX + dx;
        const nextY = curY + dy;

        // Check bounds & walls
        const isWall = currentMaze.walls.some((w) => w.x === nextX && w.y === nextY);
        if (nextX >= 0 && nextX < 5 && nextY >= 0 && nextY < 5 && !isWall) {
          curX = nextX;
          curY = nextY;
          setBotPos({ x: curX, y: curY, dir: curDir });

          // Gem check
          if (currentMaze.gems.some((g) => g.x === curX && g.y === curY)) {
            gems++;
            setMazeGemsCollected(gems);
            sfx.playGem();
          }
        } else {
          sfx.playExplosion();
          setMazeMessage('💥 Collision detected! Bot hit an obstacle or firewall.');
          setIsExecuting(false);
          setActiveStep(null);
          return;
        }
      } else if (cmd === 'TURN_LEFT') {
        curDir = (curDir + 3) % 4;
        setBotPos({ x: curX, y: curY, dir: curDir });
      } else if (cmd === 'TURN_RIGHT') {
        curDir = (curDir + 1) % 4;
        setBotPos({ x: curX, y: curY, dir: curDir });
      } else if (cmd === 'HACK') {
        sfx.playLaser();
      }

      await new Promise((r) => setTimeout(r, 450));
    }

    setIsExecuting(false);
    setActiveStep(null);

    // Check Win Condition
    if (curX === currentMaze.goal.x && curY === currentMaze.goal.y) {
      sfx.playVictory();
      setMazeSuccess(true);
      setMazeMessage('🎉 SUCCESS! Core Server reached with complete data packet!');
    } else {
      setMazeMessage('Almost there! Bot finished program but hasn\'t reached the Server yet.');
    }
  };

  // ==========================================
  // GAME 3: PYTHON TURTLE MANDALA STATE
  // ==========================================
  const turtleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sides, setSides] = useState(6);
  const [iterations, setIterations] = useState(36);
  const [stepLength, setStepLength] = useState(60);
  const [palette, setPalette] = useState<'electric' | 'sunset' | 'emerald'>('electric');

  useEffect(() => {
    if (activeTab !== 'turtle') return;
    const canvas = turtleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const colorPalettes = {
      electric: ['#38bdf8', '#818cf8', '#c084fc', '#f43f5e', '#2dd4bf'],
      sunset: ['#fb923c', '#f87171', '#fb7185', '#fde047', '#e11d48'],
      emerald: ['#34d399', '#2dd4bf', '#38bdf8', '#a3e635', '#4ade80'],
    };
    const colors = colorPalettes[palette];

    ctx.lineWidth = 2;
    for (let i = 0; i < iterations; i++) {
      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      const angleOffset = (i * (360 / iterations) * Math.PI) / 180;

      for (let s = 0; s <= sides; s++) {
        const sideAngle = angleOffset + (s * (2 * Math.PI / sides));
        const x = centerX + Math.cos(sideAngle) * stepLength * (1 + (i % 3) * 0.2);
        const y = centerY + Math.sin(sideAngle) * stepLength * (1 + (i % 3) * 0.2);
        if (s === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }, [activeTab, sides, iterations, stepLength, palette]);

  return (
    <section id="playground" className="py-24 bg-white/75 dark:bg-[#0d1117]/75 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
              <Gamepad2 size={15} /> Real Playable Games Lab
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Interactive Coding Arcade: Learn by Playing & Modding
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
              Coding is thrilling when concepts power actual games! Blast glitch bugs, hack real-time spaceship variables, or program an algorithm rover.
            </p>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Game Sounds' : 'Enable 8-Bit Game Sounds'}
          >
            {soundEnabled ? <Volume2 size={16} className="text-brand-600" /> : <VolumeX size={16} className="text-gray-400" />}
            <span>{soundEnabled ? 'Arcade Audio: ON' : 'Audio: Muted'}</span>
          </button>
        </div>

        {/* Game Mode Selector */}
        <div className="flex items-center gap-2 mb-8 bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl max-w-xl">
          <button
            onClick={() => setActiveTab('arcade')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'arcade'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Flame size={15} />
            <span>Space Bug Defender (Action Arcade)</span>
          </button>

          <button
            onClick={() => setActiveTab('maze')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'maze'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Cpu size={15} />
            <span>Algorithm Maze Hacker</span>
          </button>

          <button
            onClick={() => setActiveTab('turtle')}
            className={`hidden sm:flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'turtle'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Terminal size={15} />
            <span>Turtle Math</span>
          </button>
        </div>

        {/* TAB 1: SPACE CODE DEFENDER */}
        {activeTab === 'arcade' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-800 text-white shadow-xl relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left: Arcade Canvas & Controls */}
            <div className="lg:col-span-7 flex flex-col items-center">
              
              {/* Arcade Top Scorebar */}
              <div className="w-full flex items-center justify-between bg-black/50 px-4 py-2.5 rounded-xl border border-gray-800 mb-3 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-400 uppercase text-[10px] block">Score</span>
                    <span className="text-lg font-black text-brand-400">{score}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase text-[10px] block">High Score</span>
                    <span className="text-sm font-bold text-amber-400">{highScore}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase text-[10px] block">Wave</span>
                    <span className="text-sm font-bold text-emerald-400">Lv.{level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1" title="Shield Life">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span key={i} className={`text-base ${i < shields ? 'opacity-100' : 'opacity-20'}`}>
                        ❤️
                      </span>
                    ))}
                  </div>
                  {combo > 1 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] animate-pulse">
                      {combo}x Combo!
                    </span>
                  )}
                </div>
              </div>

              {/* Game Screen Container */}
              <div className="relative w-full max-w-[500px] aspect-[5/4] bg-black rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={400}
                  className="w-full h-full object-contain"
                />

                {/* Start Overlay */}
                {!gameRunning && !gameOver && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-600/30 border border-brand-500 text-brand-400 flex items-center justify-center mb-4">
                      <Gamepad2 size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-1">Space Bug Defender</h3>
                    <p className="text-xs text-gray-300 max-w-xs mb-5">
                      Use <strong>Arrow Keys / WASD</strong> to fly, and <strong>Spacebar</strong> to blast glitch bugs! Collect Python gems for bonus points!
                    </p>
                    <button
                      onClick={startArcadeGame}
                      className="px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-glow transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <Play size={18} fill="currentColor" />
                      <span>START GAME</span>
                    </button>
                  </div>
                )}

                {/* Game Over Overlay */}
                {gameOver && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Mission Failed</span>
                    <h3 className="text-3xl font-black text-white mb-2">Game Over</h3>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 mb-4 max-w-xs w-full text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Final Score:</span>
                        <strong className="text-brand-400 text-sm">{score}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Glitch Bugs Squashed:</span>
                        <strong className="text-white">{bugsSquashed}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Highest Wave:</span>
                        <strong className="text-emerald-400">Level {level}</strong>
                      </div>
                    </div>
                    <button
                      onClick={startArcadeGame}
                      className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw size={15} />
                      <span>Play Again</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile / Touch Arcade Controller */}
              <div className="w-full max-w-[500px] mt-4 p-3 bg-black/40 rounded-2xl border border-gray-800 flex items-center justify-between gap-4">
                {/* D-Pad Buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div />
                  <button
                    onClick={() => handleTouchMove('up')}
                    className="w-10 h-10 rounded-lg bg-gray-800 active:bg-brand-600 flex items-center justify-center text-gray-300 font-bold text-xs"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <div />
                  <button
                    onClick={() => handleTouchMove('left')}
                    className="w-10 h-10 rounded-lg bg-gray-800 active:bg-brand-600 flex items-center justify-center text-gray-300 font-bold text-xs"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleTouchMove('down')}
                    className="w-10 h-10 rounded-lg bg-gray-800 active:bg-brand-600 flex items-center justify-center text-gray-300 font-bold text-xs"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => handleTouchMove('right')}
                    className="w-10 h-10 rounded-lg bg-gray-800 active:bg-brand-600 flex items-center justify-center text-gray-300 font-bold text-xs"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Fire Laser Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={fireBullet}
                    disabled={!gameRunning}
                    className="px-6 py-4 rounded-2xl bg-red-600 active:bg-red-500 disabled:opacity-40 text-white font-black text-sm tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Crosshair size={18} />
                    <span>FIRE CODE</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Live Modding Hacker Terminal */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Terminal size={14} />
                    <span>Live Game Engine Modder</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    Hack Ship Variables In Real-Time
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Live Sync
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Notice how students learn: changing software variables immediately alters how physics, graphics, and rules behave in real gameplay!
              </p>

              {/* Code Snippet Box with Active Variables */}
              <div className="p-3.5 rounded-xl bg-black font-mono text-xs border border-gray-800 space-y-1.5 text-gray-300">
                <div className="text-gray-500">// Ship Configuration Script</div>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-300">laserMode</span> = <span className="text-amber-300">'{laserMode}'</span>;
                </div>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-300">shipSpeed</span> = <span className="text-emerald-400">{shipSpeed}</span>;
                </div>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-300">laserColor</span> = <span className="text-pink-400">'{laserColor}'</span>;
                </div>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-300">scoreMultiplier</span> = <span className="text-emerald-400">{scoreMultiplier}x</span>;
                </div>
              </div>

              {/* Variable Tweak Controls */}
              <div className="space-y-3 pt-1">
                
                {/* Laser Mode */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Weapon Blaster Algorithm:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'single', label: 'Single Beam' },
                      { id: 'triple', label: 'Triple Blaster' },
                      { id: 'plasma', label: 'Plasma Cannon' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setLaserMode(mode.id as 'single' | 'triple' | 'plasma')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          laserMode === mode.id
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Laser Color Theme */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Laser Photon Color:
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { color: '#00f0ff', label: 'Neon Cyan' },
                      { color: '#22c55e', label: 'Matrix Green' },
                      { color: '#f59e0b', label: 'Solar Gold' },
                      { color: '#ec4899', label: 'Cyber Pink' }
                    ].map((col) => (
                      <button
                        key={col.color}
                        onClick={() => setLaserColor(col.color)}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                          laserColor === col.color
                            ? 'border-white text-white'
                            : 'border-transparent text-gray-400 bg-gray-800'
                        }`}
                        style={{ backgroundColor: laserColor === col.color ? col.color + '33' : undefined }}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ship Speed Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
                    <span>Engine Velocity: <strong className="text-brand-400">{shipSpeed}px/frame</strong></span>
                    <span className="text-[10px] text-gray-500">({shipSpeed < 5 ? 'Normal' : shipSpeed < 8 ? 'Turbo' : 'Hyper'})</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    value={shipSpeed}
                    onChange={(e) => setShipSpeed(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>

                {/* Score Multiplier */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-gray-400">Score Multiplier:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 5].map((mult) => (
                      <button
                        key={mult}
                        onClick={() => setScoreMultiplier(mult)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scoreMultiplier === mult
                            ? 'bg-amber-500 text-black'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {mult}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ALGORITHM MAZE HACKER */}
        {activeTab === 'maze' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-gray-50 dark:bg-gray-900/70 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800">
            
            {/* Left Column: 5x5 Grid Maze */}
            <div className="lg:col-span-6 flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">
                    Level {mazeLevel} of {mazeLayouts.length}
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {currentMaze.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  {mazeLayouts.map((l) => (
                    <button
                      key={l.level}
                      onClick={() => setMazeLevel(l.level)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        mazeLevel === l.level
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {l.level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5x5 Maze Grid */}
              <div className="w-full max-w-[380px] aspect-square bg-gray-950 p-3 rounded-2xl border-2 border-gray-800 grid grid-cols-5 gap-2 shadow-lg relative">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const x = idx % 5;
                  const y = Math.floor(idx / 5);
                  const isBot = botPos.x === x && botPos.y === y;
                  const isGoal = currentMaze.goal.x === x && currentMaze.goal.y === y;
                  const isWall = currentMaze.walls.some((w) => w.x === x && w.y === y);
                  const isGem = currentMaze.gems.some((g) => g.x === x && g.y === y);

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-xl flex items-center justify-center transition-all ${
                        isWall
                          ? 'bg-red-950/80 border border-red-800/80'
                          : 'bg-gray-900/80 border border-gray-800'
                      }`}
                    >
                      {isWall && <span className="text-xs font-mono text-red-500 font-bold">🚫</span>}
                      {isGoal && !isBot && (
                        <div className="flex flex-col items-center animate-bounce">
                          <span className="text-base">🖥️</span>
                          <span className="text-[8px] font-mono text-emerald-400 font-bold">SERVER</span>
                        </div>
                      )}
                      {isGem && !isBot && <span className="text-sm">💎</span>}
                      {isBot && (
                        <div className="flex flex-col items-center z-10 transition-transform duration-300">
                          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-glow">
                            🤖
                          </div>
                          <span className="text-[8px] font-mono text-brand-300 font-bold">
                            {botPos.dir === 0 ? '▲ UP' : botPos.dir === 1 ? '▶ RT' : botPos.dir === 2 ? '▼ DN' : '◀ LT'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status Message */}
              <div className={`mt-4 p-3 rounded-xl border w-full max-w-[380px] text-xs font-semibold text-center transition-all ${
                mazeSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {mazeMessage}
              </div>

            </div>

            {/* Right Column: Code Command Queue */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                  Computational Thinking & Sequence
                </span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Program the Bot's Instruction Stack
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click commands below to build the algorithm. Run it step-by-step to test your logic!
                </p>
              </div>

              {/* Command Palette Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setProgramStack((prev) => [...prev, 'FORWARD'])}
                  disabled={isExecuting}
                  className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowUp size={14} />
                  <span>FORWARD()</span>
                </button>

                <button
                  onClick={() => setProgramStack((prev) => [...prev, 'TURN_LEFT'])}
                  disabled={isExecuting}
                  className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>TURN_LEFT()</span>
                </button>

                <button
                  onClick={() => setProgramStack((prev) => [...prev, 'TURN_RIGHT'])}
                  disabled={isExecuting}
                  className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowRight size={14} />
                  <span>TURN_RIGHT()</span>
                </button>
              </div>

              {/* Code Sequence Queue */}
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 text-gray-200 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[11px] text-gray-400">
                  <span>main_algorithm.py ({programStack.length} instructions)</span>
                  <button
                    onClick={() => setProgramStack([])}
                    disabled={isExecuting || programStack.length === 0}
                    className="hover:text-red-400 transition-colors flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="min-h-[140px] max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
                  {programStack.length === 0 ? (
                    <div className="text-gray-500 py-8 text-center italic">
                      // Instruction stack is empty. Click buttons above to add commands.
                    </div>
                  ) : (
                    programStack.map((cmd, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                          activeStep === idx
                            ? 'bg-brand-600 text-white font-bold shadow-sm'
                            : 'bg-gray-800/80 text-gray-300'
                        }`}
                      >
                        <span className="text-gray-400">{idx + 1}.</span>
                        <span className="font-mono text-brand-300">{cmd}();</span>
                        <button
                          onClick={() => setProgramStack((p) => p.filter((_, i) => i !== idx))}
                          disabled={isExecuting}
                          className="text-gray-500 hover:text-red-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={runAlgorithm}
                  disabled={isExecuting || programStack.length === 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play size={15} fill="currentColor" />
                  <span>{isExecuting ? 'Running Algorithm...' : 'Run Algorithm'}</span>
                </button>

                <button
                  onClick={() => resetMaze()}
                  disabled={isExecuting}
                  className="py-3 px-4 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Bot</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: TURTLE MATH ART */}
        {activeTab === 'turtle' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-gray-50 dark:bg-gray-900/60 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800">
            
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  Algorithmic Thinking in Python
                </span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Turtle Geometry & Loops
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Students learn how mathematical angles and nested loops generate intricate algorithmic art.
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="p-4 rounded-2xl bg-gray-900 text-gray-100 font-mono text-[11px] leading-relaxed border border-gray-800 shadow-inner">
                <div className="text-gray-500 mb-1"># Python 3 Geometry Lab</div>
                <div><span className="text-purple-400">import</span> turtle</div>
                <div><span className="text-blue-400">t</span> = turtle.<span className="text-yellow-300">Turtle</span>()</div>
                <div>t.<span className="text-yellow-300">speed</span>(<span className="text-emerald-400">0</span>)</div>
                <div className="mt-2 text-purple-400">for <span className="text-white">i</span> in <span className="text-yellow-300">range</span>(<span className="text-emerald-400">{iterations}</span>):</div>
                <div className="ml-4 text-purple-400">for <span className="text-white">side</span> in <span className="text-yellow-300">range</span>(<span className="text-emerald-400">{sides}</span>):</div>
                <div className="ml-8 text-blue-400">t.<span className="text-yellow-300">forward</span>(<span className="text-emerald-400">{stepLength}</span>)</div>
                <div className="ml-8 text-blue-400">t.<span className="text-yellow-300">right</span>(<span className="text-emerald-400">{Math.round(360 / sides)}</span>)</div>
                <div className="ml-4 text-blue-400">t.<span className="text-yellow-300">right</span>(<span className="text-emerald-400">{Math.round(360 / iterations)}</span>)</div>
              </div>

              {/* Interactive Controls */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Polygon Sides: <strong className="text-brand-600">{sides}</strong></span>
                    <span className="text-[10px] text-gray-400">({sides === 3 ? 'Triangle' : sides === 4 ? 'Square' : sides === 5 ? 'Pentagon' : 'Hexagon'})</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={sides}
                    onChange={(e) => setSides(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Loop Rotations: <strong className="text-brand-600">{iterations}</strong></span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    step="6"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-gray-500">Color Theme:</span>
                  {(['electric', 'sunset', 'emerald'] as const).map((pal) => (
                    <button
                      key={pal}
                      onClick={() => setPalette(pal)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        palette === pal
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {pal}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Live Canvas Render */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-inner">
              <div className="text-[11px] font-mono text-gray-400 mb-2 flex items-center justify-between w-full px-2">
                <span>Turtle Display Buffer</span>
                <span className="text-emerald-400 font-bold">● Active Rendering</span>
              </div>
              <canvas
                ref={turtleCanvasRef}
                width={380}
                height={320}
                className="max-w-full rounded-xl bg-black/60 shadow-md"
              />
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
