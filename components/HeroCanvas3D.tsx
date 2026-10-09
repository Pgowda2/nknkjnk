import React, { useRef, useEffect } from 'react';

export const HeroCanvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes setup
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2.5 + 1.5,
      color: Math.random() > 0.4 ? '#2563eb' : '#60a5fa',
      label: ['Python', 'Java', 'SQL', 'OOP', 'JDBC', 'API', 'DSA'][Math.floor(Math.random() * 7)],
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle orbital ring
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating inner node
      angle += 0.005;
      const rx = centerX + Math.cos(angle) * (radius * 0.5);
      const ry = centerY + Math.sin(angle) * (radius * 0.5);

      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw particle point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Render code tags on occasional nodes
        if (i % 6 === 0) {
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = 'rgba(17, 24, 39, 0.6)';
          ctx.fillText(p.label, p.x + 8, p.y + 3);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[480px] flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none" />
      
      {/* Centered Graphic Card */}
      <div className="relative z-10 glass-card p-6 md:p-8 rounded-2xl max-w-sm w-full mx-4 shadow-card border border-gray-200/80 transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">pavan_dev.py</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs md:text-sm text-gray-700">
          <div className="text-blue-600 font-semibold">class SoftwareDeveloper:</div>
          <div className="pl-4 text-gray-600">
            def __init__(self):<br/>
            &nbsp;&nbsp;self.name = <span className="text-emerald-600">"Pavan Gowda B S"</span><br/>
            &nbsp;&nbsp;self.degree = <span className="text-emerald-600">"B.E. CSE"</span><br/>
            &nbsp;&nbsp;self.stack = [<span className="text-amber-600">"Python"</span>, <span className="text-amber-600">"Java"</span>, <span className="text-amber-600">"SQL"</span>]<br/>
            &nbsp;&nbsp;self.status = <span className="text-blue-600">"Ready for Impact"</span>
          </div>
          <div className="pl-4 text-gray-600">
            def solve(self, problem):<br/>
            &nbsp;&nbsp;return clean_code(problem)
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ACID Safe & Scalable
          </span>
          <span className="text-gray-400">Bangalore, IN</span>
        </div>
      </div>
    </div>
  );
};
