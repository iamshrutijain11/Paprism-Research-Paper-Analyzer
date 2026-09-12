import React, { useEffect, useRef } from 'react';

export const SplashCursor = ({
  colorPalette = ['#C8F3E4', '#00A878', '#006B57', '#003F36', '#80edd0'],
  maxParticles = 40,
  enableClickSplash = true
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const ripples = [];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1.5;
        this.baseSize = this.size;
        this.color = color || colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.life -= this.decay;
        this.size = this.baseSize * this.life;
      }

      draw(context) {
        if (this.life <= 0) return;
        context.save();
        context.globalAlpha = Math.max(0, this.life * 0.7);
        context.fillStyle = this.color;
        context.shadowBlur = 12;
        context.shadowColor = this.color;
        context.beginPath();
        context.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = Math.random() * 35 + 25;
        this.life = 1;
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        this.decay = 0.03;
      }

      update() {
        this.radius += (this.maxRadius - this.radius) * 0.12;
        this.life -= this.decay;
      }

      draw(context) {
        if (this.life <= 0) return;
        context.save();
        context.globalAlpha = Math.max(0, this.life * 0.4);
        context.strokeStyle = this.color;
        context.lineWidth = 1.5;
        context.shadowBlur = 8;
        context.shadowColor = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    }

    let lastX = null;
    let lastY = null;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      if (lastX !== null && lastY !== null) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 6 && now - lastTime > 16) {
          const count = Math.min(3, Math.floor(dist / 12) + 1);
          for (let i = 0; i < count; i++) {
            if (particles.length < maxParticles) {
              particles.push(new Particle(x + (Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 8));
            }
          }
          if (Math.random() > 0.7 && ripples.length < 8) {
            ripples.push(new Ripple(x, y));
          }
          lastTime = now;
        }
      }

      lastX = x;
      lastY = y;
    };

    const handleClick = (e) => {
      if (!enableClickSplash) return;
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y, '#00A878'));
      }
      ripples.push(new Ripple(x, y));
      ripples.push(new Ripple(x, y));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx);
        if (r.life <= 0) {
          ripples.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorPalette, maxParticles, enableClickSplash]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{ opacity: 0.85 }}
    />
  );
};

export default SplashCursor;
