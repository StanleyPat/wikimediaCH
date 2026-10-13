/**
 * WikiFacts Tinder - Pure Vanilla JS Application
 * Modern, Dependency-Free Game Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // Audio Synthesizer (Web Audio API) - Pure Vanilla Audio FX
  // ==========================================================================
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('wikifacts_sound') !== 'false';
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('wikifacts_sound', this.enabled.toString());
      if (this.enabled) {
        this.init();
        this.playClick();
      }
      return this.enabled;
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playSwipe() {
      if (!this.enabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    playCorrect() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    }

    playIncorrect() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [220, 196]; // A3, G3
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.08, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.18);
      });
    }

    playFinish() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.15, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.4);
      });
    }
  }

  // ==========================================================================
  // App Controller
  // ==========================================================================
  class WikiFactsApp {
    constructor() {
      this.sound = new SoundManager();
      this.facts = typeof FACTS !== 'undefined' ? FACTS : [];
      this.state = {
        screen: 'start', // 'start' | 'game' | 'finish'
        currentIndex: 0,
        score: 0,
        isSwiping: false,
        isExplanationOpen: false,
        history: [] // { fact, userChoice, wasCorrect }
      };

      // Pointer drag state
      this.dragState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0
      };

      this.cacheElements();
      this.initEvents();
      this.updateSoundButtonUI();
    }

    cacheElements() {
      // Screens
      this.screens = {
        start: document.getElementById('screen-start'),
        game: document.getElementById('screen-game'),
        finish: document.getElementById('screen-finish')
      };

      // Header
      this.progressTrack = document.getElementById('progress-track');
      this.scoreNumber = document.getElementById('score-number');
      this.btnSound = document.getElementById('btn-sound');
      this.soundIcon = document.getElementById('sound-icon');

      // Card Stack
      this.cardStack = document.getElementById('card-stack');
      this.cardActive = document.getElementById('card-active');
      this.cardUnder = document.getElementById('card-under');
      this.factTextActive = document.getElementById('fact-text-active');
      this.factTextUnder = document.getElementById('fact-text-under');
      this.factTagActive = document.getElementById('fact-tag-active');
      this.factTagUnder = document.getElementById('fact-tag-under');
      this.stampTrue = document.getElementById('stamp-true');
      this.stampFalse = document.getElementById('stamp-false');

      // Explanation view
      this.explanationCard = document.getElementById('explanation-card');
      this.explanationIcon = document.getElementById('explanation-icon');
      this.explanationTitle = document.getElementById('explanation-title');
      this.explanationBody = document.getElementById('explanation-body');
      this.btnNextFact = document.getElementById('btn-next-fact');

      // Sources & Decision Buttons
      this.sourcesActive = document.getElementById('sources-tags');
      this.sourcesUnder = document.getElementById('sources-under');
      this.gameActions = document.getElementById('game-actions');
      this.btnFalse = document.getElementById('btn-false');
      this.btnTrue = document.getElementById('btn-true');

      // Navigation / Triggers
      this.btnStart = document.getElementById('btn-start');
      this.btnRestart = document.getElementById('btn-restart');
      this.btnShare = document.getElementById('btn-share');
      this.toast = document.getElementById('toast');

      // Finish details
      this.finishScoreBig = document.getElementById('finish-score-big');
      this.finishScoreTotal = document.getElementById('finish-score-total');
      this.finishScoreComment = document.getElementById('finish-score-comment');
      this.reviewToggleBtn = document.getElementById('review-toggle-btn');
      this.reviewList = document.getElementById('review-list');
    }

    initEvents() {
      // Start Game
      if (this.btnStart) {
        this.btnStart.addEventListener('click', () => {
          this.sound.init();
          this.sound.playClick();
          this.startGame();
        });
      }

      // Restart Game
      if (this.btnRestart) {
        this.btnRestart.addEventListener('click', () => {
          this.sound.playClick();
          this.restartGame();
        });
      }

      // Next Fact
      if (this.btnNextFact) {
        this.btnNextFact.addEventListener('click', () => {
          this.sound.playClick();
          this.advanceNext();
        });
      }

      // Decision Buttons (WAHR / FALSCH)
      if (this.btnFalse) {
        this.btnFalse.addEventListener('click', () => {
          if (this.state.isSwiping || this.state.isExplanationOpen) return;
          this.triggerProgrammaticSwipe('left');
        });
      }

      if (this.btnTrue) {
        this.btnTrue.addEventListener('click', () => {
          if (this.state.isSwiping || this.state.isExplanationOpen) return;
          this.triggerProgrammaticSwipe('right');
        });
      }

      // Sound Toggle Button
      if (this.btnSound) {
        this.btnSound.addEventListener('click', () => {
          this.sound.toggle();
          this.updateSoundButtonUI();
        });
      }

      // Share Button
      if (this.btnShare) {
        this.btnShare.addEventListener('click', () => this.shareResult());
      }

      // Review Details Accordion
      if (this.reviewToggleBtn) {
        this.reviewToggleBtn.addEventListener('click', () => {
          const isOpen = this.reviewList.classList.toggle('open');
          const chevron = this.reviewToggleBtn.querySelector('.icon-chevron');
          if (chevron) {
            chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        });
      }

      // Card Pointer Events for Drag/Swipe
      this.initCardDrag();

      // Keyboard Controls
      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    updateSoundButtonUI() {
      if (!this.soundIcon) return;
      if (this.sound.enabled) {
        this.soundIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
        this.btnSound.setAttribute('aria-label', 'Ton ausschalten');
        this.btnSound.title = 'Ton ausschalten';
      } else {
        this.soundIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
        this.btnSound.setAttribute('aria-label', 'Ton einschalten');
        this.btnSound.title = 'Ton einschalten';
      }
    }

    // ==========================================================================
    // Screen Router
    // ==========================================================================
    setScreen(screenName) {
      this.state.screen = screenName;
      Object.keys(this.screens).forEach((name) => {
        if (this.screens[name]) {
          if (name === screenName) {
            this.screens[name].classList.add('active');
          } else {
            this.screens[name].classList.remove('active');
          }
        }
      });
    }

    startGame() {
      this.state.currentIndex = 0;
      this.state.score = 0;
      this.state.history = [];
      this.state.isSwiping = false;
      this.state.isExplanationOpen = false;

      this.updateScoreBadge();
      this.renderProgressPills();
      this.renderCurrentCard();
      this.setScreen('game');
    }

    restartGame() {
      this.startGame();
    }

    // ==========================================================================
    // Card Rendering & Content
    // ==========================================================================
    // Drag-Variablen: Das Aussehen (Neigung, Schatten, Farben) liegt in style.css.
    setDragVars(dx, dy, rot) {
      const style = this.cardActive.style;
      style.setProperty('--dx', `${dx}px`);
      style.setProperty('--dy', `${dy}px`);
      style.setProperty('--rot', `${rot}deg`);
    }

    setStamp(stamp, progress) {
      stamp.style.setProperty('--p', String(progress));
    }

    setUnderLift(lift) {
      this.cardUnder.style.setProperty('--lift', String(lift));
    }

    hasNextCard() {
      return this.cardUnder && this.cardUnder.style.display !== 'none';
    }

    setFactText(el, text) {
      el.textContent = text;
      el.classList.toggle('fact-text--long', text.length > 90);
    }

    renderCurrentCard() {
      const total = this.facts.length;
      const index = this.state.currentIndex;
      const currentFact = this.facts[index];
      const nextFact = this.facts[index + 1];

      // Hide explanation
      this.state.isExplanationOpen = false;
      this.explanationCard.classList.remove('active');
      this.gameActions.style.visibility = 'visible';

      // Reset active card to its resting pose
      this.cardActive.className = 'fact-card card-active entering';
      this.setDragVars(0, 0, 0);
      this.setStamp(this.stampTrue, 0);
      this.setStamp(this.stampFalse, 0);
      this.stampTrue.classList.remove('slam');
      this.stampFalse.classList.remove('slam');
      this.cardStack.classList.remove('is-dragging');

      if (currentFact) {
        this.setFactText(this.factTextActive, currentFact.text);
        this.factTagActive.textContent = `Fakt ${index + 1} / ${total}`;
        this.renderSources(this.sourcesActive, currentFact.sources, true);
      }

      // Next card behind
      if (nextFact) {
        this.cardUnder.style.display = 'flex';
        this.setUnderLift(0);
        this.setFactText(this.factTextUnder, nextFact.text);
        this.factTagUnder.textContent = `Fakt ${index + 2} / ${total}`;
        this.renderSources(this.sourcesUnder, nextFact.sources, false);
      } else {
        this.cardUnder.style.display = 'none';
      }

      this.updateProgressPills();
    }

    renderSources(container, sources, interactive) {
      if (!container) return;
      container.innerHTML = '';
      if (!sources || sources.length === 0) return;

      sources.forEach((source) => {
        const chip = document.createElement(interactive ? 'a' : 'span');
        chip.className = 'source-chip';
        if (interactive) {
          chip.href = source.url;
          chip.target = '_blank';
          chip.rel = 'noopener noreferrer';
        }

        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'icon-svg');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('style', 'width: 0.8rem; height: 0.8rem;');
        icon.innerHTML = '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="8 7 17 7 17 16"></polyline>';

        const label = document.createElement('span');
        label.textContent = source.label;

        chip.appendChild(icon);
        chip.appendChild(label);
        container.appendChild(chip);
      });
    }

    renderProgressPills() {
      if (!this.progressTrack) return;
      this.progressTrack.innerHTML = '';

      this.facts.forEach((_, index) => {
        const pill = document.createElement('div');
        pill.className = 'progress-pill';
        pill.id = `pill-${index}`;
        this.progressTrack.appendChild(pill);
      });
    }

    updateProgressPills() {
      this.facts.forEach((_, index) => {
        const pill = document.getElementById(`pill-${index}`);
        if (!pill) return;
        pill.className = 'progress-pill';
        if (index < this.state.currentIndex) {
          pill.classList.add('completed');
        } else if (index === this.state.currentIndex) {
          pill.classList.add('active');
        }
      });
    }

    updateScoreBadge(animate = false) {
      if (!this.scoreNumber) return;
      this.scoreNumber.textContent = this.state.score;
      if (animate) {
        this.scoreNumber.classList.remove('pop');
        // Force reflow
        void this.scoreNumber.offsetWidth;
        this.scoreNumber.classList.add('pop');
      }
    }

    // ==========================================================================
    // Tinder Drag & Swipe Physics
    // ==========================================================================
    initCardDrag() {
      const card = this.cardActive;
      if (!card) return;

      const onPointerDown = (e) => {
        if (this.state.isSwiping || this.state.isExplanationOpen) return;
        // Tap on a source chip opens the link instead of starting a drag
        if (e.target.closest && e.target.closest('a')) return;
        this.sound.init();

        this.dragState.isDragging = true;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        this.dragState.currentX = e.clientX;
        this.dragState.currentY = e.clientY;
        this.dragState.startTime = Date.now();

        card.classList.remove('snapping', 'swiping-left', 'swiping-right');
        card.classList.add('dragging');
        this.cardStack.classList.add('is-dragging');
        card.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e) => {
        if (!this.dragState.isDragging) return;

        this.dragState.currentX = e.clientX;
        this.dragState.currentY = e.clientY;

        const deltaX = this.dragState.currentX - this.dragState.startX;
        const deltaY = this.dragState.currentY - this.dragState.startY;

        const dampedY = deltaY * 0.25;
        const rotation = Math.max(-30, Math.min(30, (deltaX / 300) * 22));

        this.setDragVars(deltaX, dampedY, rotation);

        // Dynamic stamps
        if (deltaX > 20) {
          this.setStamp(this.stampTrue, Math.min(1, (deltaX - 20) / 90));
          this.setStamp(this.stampFalse, 0);
        } else if (deltaX < -20) {
          this.setStamp(this.stampFalse, Math.min(1, (-deltaX - 20) / 90));
          this.setStamp(this.stampTrue, 0);
        } else {
          this.setStamp(this.stampTrue, 0);
          this.setStamp(this.stampFalse, 0);
        }

        // Next card moves forward as the top card leaves
        if (this.hasNextCard()) {
          this.setUnderLift(Math.min(1, Math.abs(deltaX) / 120));
        }
      };

      const onPointerEnd = (e) => {
        if (!this.dragState.isDragging) return;
        this.dragState.isDragging = false;
        card.classList.remove('dragging');
        this.cardStack.classList.remove('is-dragging');

        try {
          card.releasePointerCapture(e.pointerId);
        } catch (_) {}

        const deltaX = this.dragState.currentX - this.dragState.startX;
        const duration = Math.max(1, Date.now() - this.dragState.startTime);
        const velocityX = Math.abs(deltaX) / duration;

        const isSwipe = Math.abs(deltaX) > 85 || (velocityX > 0.4 && Math.abs(deltaX) > 35);

        if (isSwipe) {
          const direction = deltaX > 0 ? 'right' : 'left';
          this.executeSwipe(direction);
        } else {
          // Snap Back
          card.classList.add('snapping');
          this.setDragVars(0, 0, 0);
          this.setStamp(this.stampTrue, 0);
          this.setStamp(this.stampFalse, 0);
          if (this.hasNextCard()) this.setUnderLift(0);

          setTimeout(() => {
            card.classList.remove('snapping');
          }, 350);
        }
      };

      card.addEventListener('pointerdown', onPointerDown);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerup', onPointerEnd);
      card.addEventListener('pointercancel', onPointerEnd);
    }

    triggerProgrammaticSwipe(direction) {
      if (this.state.isSwiping || this.state.isExplanationOpen) return;
      this.sound.init();
      this.executeSwipe(direction, { slam: true });
    }

    executeSwipe(direction, options = {}) {
      this.state.isSwiping = true;
      this.sound.playSwipe();

      const card = this.cardActive;
      card.classList.remove('snapping', 'dragging');

      const stamp = direction === 'right' ? this.stampTrue : this.stampFalse;
      const otherStamp = direction === 'right' ? this.stampFalse : this.stampTrue;
      this.setStamp(stamp, 1);
      this.setStamp(otherStamp, 0);
      if (options.slam) {
        stamp.classList.remove('slam');
        void stamp.offsetWidth; // restart animation
        stamp.classList.add('slam');
      }
      card.classList.add(direction === 'right' ? 'swiping-right' : 'swiping-left');
      if (this.hasNextCard()) this.setUnderLift(1);

      // After card swipe animation completes
      setTimeout(() => {
        this.evaluateChoice(direction === 'right');
      }, 290);
    }

    // ==========================================================================
    // Game Evaluation & Explanation
    // ==========================================================================
    evaluateChoice(userChoice) {
      const currentFact = this.facts[this.state.currentIndex];
      const isCorrect = userChoice === currentFact.isTrue;

      if (isCorrect) {
        this.state.score += 1;
        this.updateScoreBadge(true);
        this.sound.playCorrect();
        this.celebrate();
      } else {
        this.sound.playIncorrect();
      }

      this.state.history.push({
        fact: currentFact,
        userChoice,
        wasCorrect: isCorrect
      });

      this.showExplanation(isCorrect, currentFact);
    }

    celebrate() {
      if (!window.Confetti) return;
      const badge = document.querySelector('.score-badge');
      if (!badge) return;
      const rect = badge.getBoundingClientRect();
      window.Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    showExplanation(isCorrect, fact) {
      this.state.isSwiping = false;
      this.state.isExplanationOpen = true;

      // Update Explanation UI
      this.explanationIcon.className = `explanation-icon-wrapper ${isCorrect ? 'correct' : 'incorrect'}`;
      if (isCorrect) {
        this.explanationIcon.innerHTML = `
          <svg class="icon-svg" style="width: 2.75rem; height: 2.75rem;" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        `;
        this.explanationTitle.textContent = 'Richtig!';
        this.explanationTitle.className = 'explanation-title correct';
      } else {
        this.explanationIcon.innerHTML = `
          <svg class="icon-svg" style="width: 2.75rem; height: 2.75rem;" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
        this.explanationTitle.textContent = 'Falsch!';
        this.explanationTitle.className = 'explanation-title incorrect';
      }

      this.explanationBody.textContent = fact.explanation;

      // Next Button Label
      const isLast = this.state.currentIndex >= this.facts.length - 1;
      this.btnNextFact.innerHTML = `
        <span>${isLast ? 'Ergebnis sehen' : 'Nächster Fakt'}</span>
        <svg class="icon-svg" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;

      // Show Explanation Card & Hide Decision Buttons
      this.explanationCard.classList.add('active');
      this.gameActions.style.visibility = 'hidden';
    }

    advanceNext() {
      if (this.state.currentIndex < this.facts.length - 1) {
        this.state.currentIndex += 1;
        this.renderCurrentCard();
      } else {
        this.finishGame();
      }
    }

    // ==========================================================================
    // Finish Screen & Score Review
    // ==========================================================================
    finishGame() {
      this.sound.playFinish();
      this.setScreen('finish');

      const total = this.facts.length;
      const score = this.state.score;
      const pct = total > 0 ? (score / total) : 0;

      if (this.finishScoreBig) this.finishScoreBig.textContent = score;
      if (this.finishScoreTotal) this.finishScoreTotal.textContent = `/${total}`;

      let comment = 'Guter Versuch! Wikipedia hat noch viel zu bieten. 📚';
      if (pct === 1) {
        comment = 'Perfekt! Du bist ein echter Fakten-Genie! 🏆';
      } else if (pct >= 0.8) {
        comment = 'Super Leistung! Fast fehlerfrei! 👏';
      } else if (pct >= 0.6) {
        comment = 'Gut gemacht! Solides Wissen. 👍';
      } else if (pct === 0) {
        comment = 'Nicht entmutigen lassen! Probier es noch einmal. 💡';
      }

      if (this.finishScoreComment) {
        this.finishScoreComment.textContent = comment;
      }

      // Render Review Accordion
      this.renderReviewList();
    }

    renderReviewList() {
      if (!this.reviewList) return;
      this.reviewList.innerHTML = '';

      this.state.history.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'review-item';
        row.innerHTML = `
          <div class="review-badge ${item.wasCorrect ? 'correct' : 'incorrect'}">
            ${item.wasCorrect ? '✓' : '✕'}
          </div>
          <div class="review-item-text">
            <strong>Fakt ${idx + 1}:</strong> ${item.fact.text}
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">
              ${item.fact.explanation}
            </div>
          </div>
        `;
        this.reviewList.appendChild(row);
      });
    }

    // ==========================================================================
    // Sharing & Clipboard
    // ==========================================================================
    shareResult() {
      const shareText = `Ich habe ${this.state.score} von ${this.facts.length} Fakten bei WikiFacts Tinder richtig erkannt! 💡 Kannst du mich schlagen?`;
      const shareUrl = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: 'WikiFacts Tinder',
          text: shareText,
          url: shareUrl
        }).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
          this.showToast('Ergebnis in die Zwischenablage kopiert! 📋');
        }).catch(() => {
          this.fallbackCopy(`${shareText}\n${shareUrl}`);
        });
      } else {
        this.fallbackCopy(`${shareText}\n${shareUrl}`);
      }
    }

    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showToast('Ergebnis in die Zwischenablage kopiert! 📋');
      } catch (err) {
        this.showToast('Konnte nicht kopiert werden');
      }
      document.body.removeChild(textarea);
    }

    showToast(message) {
      if (!this.toast) return;
      this.toast.textContent = message;
      this.toast.classList.add('show');
      setTimeout(() => {
        this.toast.classList.remove('show');
      }, 2600);
    }

    // ==========================================================================
    // Keyboard Navigation
    // ==========================================================================
    handleKeyDown(e) {
      // Don't capture when typing in inputs (if any)
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (this.state.screen === 'start') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.sound.init();
          this.startGame();
        }
      } else if (this.state.screen === 'game') {
        if (this.state.isExplanationOpen) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            this.advanceNext();
          }
        } else if (!this.state.isSwiping) {
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            this.triggerProgrammaticSwipe('left');
          } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            this.triggerProgrammaticSwipe('right');
          }
        }
      } else if (this.state.screen === 'finish') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.restartGame();
        }
      }
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WikiFactsApp());
  } else {
    new WikiFactsApp();
  }
})();
