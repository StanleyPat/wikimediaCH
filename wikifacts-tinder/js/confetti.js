/**
 * WikiFacts Tinder - Konfetti
 * Kleiner Canvas-Burst ohne Abhaengigkeiten. Aufruf: Confetti.burst(x, y)
 * Der Canvas legt sich nur waehrend des Bursts ueber die Seite und entfernt sich danach.
 */
(function () {
  'use strict';

  // Gelb fehlt bewusst: Es wuerde auf dem gelben Grund verschwinden.
  var COLORS = ['#14110F', '#FFFFFF', '#3DDC84', '#FF6B8B', '#A7D8F5'];
  var INK = '#14110F';
  var GRAVITY = 1500;      // px/s^2
  var LIFE = 1.1;          // Sekunden

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canvas = null;
  var ctx = null;
  var pieces = [];
  var rafId = 0;
  var lastTime = 0;
  var width = 0;
  var height = 0;

  function setup() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:900;';
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = INK;
  }

  function teardown() {
    cancelAnimationFrame(rafId);
    rafId = 0;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null;
    ctx = null;
    pieces = [];
  }

  function frame(now) {
    var dt = Math.max(0, Math.min(0.033, (now - lastTime) / 1000));
    lastTime = now;

    ctx.clearRect(0, 0, width, height);
    pieces = pieces.filter(function (p) { return p.age < LIFE; });

    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      p.age += dt;
      p.vy += GRAVITY * dt;
      p.vx *= 1 - 1.6 * dt;
      p.vy *= 1 - 0.6 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;

      var fade = Math.min(1, (LIFE - p.age) / 0.3);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      if (p.color !== INK) ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    if (pieces.length) {
      rafId = requestAnimationFrame(frame);
    } else {
      teardown();
    }
  }

  function burst(x, y, count) {
    if (reduceMotion.matches) return;
    count = count || 80;

    if (!canvas) setup();

    for (var i = 0; i < count; i++) {
      // Faecher nach oben, damit es aus dem Score-Sticker "spritzt"
      var angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
      var speed = 320 + Math.random() * 560;
      pieces.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 18,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        age: Math.random() * 0.08
      });
    }

    if (!rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }

  window.Confetti = { burst: burst };
})();
