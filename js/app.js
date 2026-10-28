/**
 * NeuroExplore - Aplicación Principal (UI & Controlador)
 * Conecta los eventos del usuario con NeuroDB.
 */

// Estado global de la aplicación
const AppState = {
  activeTab: 'explorador',
  activeRegionId: 'frontal',
  simState: 'normal', // 'normal' o 'lesion'
  currentZoom: 100,
  isAudioPlaying: false
};

// =========================================================================
// GESTIÓN DE PESTAÑAS Y NAVEGACIÓN
// =========================================================================
function switchTab(tabId) {
  AppState.activeTab = tabId;

  // Actualizar visibilidad de vistas
  const views = ['explorador', 'quiz', 'casos', 'progreso'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === tabId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }

    // Actualizar botones de navegación desktop
    const navBtn = document.getElementById(`nav-btn-${v}`);
    if (navBtn) {
      if (v === tabId) {
        navBtn.className = "px-4 py-2 font-display text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all";
      } else {
        navBtn.className = "px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5";
      }
    }

    // Actualizar botones de barra móvil inferior
    const mobileBtn = document.getElementById(`mobile-btn-${v}`);
    if (mobileBtn) {
      if (v === tabId) {
        mobileBtn.className = "flex flex-col items-center justify-center text-primary font-bold transition-colors";
      } else {
        mobileBtn.className = "flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 transition-colors";
      }
    }
  });

  // Si cambiamos a quiz, iniciar quiz
  if (tabId === 'quiz') {
    initQuiz();
  }

  // Si cambiamos a casos, iniciar casos
  if (tabId === 'casos') {
    initCasos();
  }

  // Si cambiamos a progreso, refrescar dashboard
  if (tabId === 'progreso') {
    renderProgressView();
  }

  // Scroll al tope
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================================
// FUNCIÓN 1: EXPLORADOR 2D Y FICHA ANATÓMICA DESDE BASE DE DATOS
// =========================================================================
function selectRegion(regionId) {
  const region = window.NeuroDB.getRegion(regionId);
  if (!region) return;

  AppState.activeRegionId = regionId;
  window.NeuroDB.markRegionExplored(regionId);

  // 1. Resaltado en el dibujo SVG (resaltar la seleccionada, atenuar las demás)
  const allRegions = ['frontal', 'parietal', 'temporal', 'occipital', 'cerebelo', 'tronco'];
  allRegions.forEach(r => {
    const svgEl = document.getElementById(`region-svg-${r}`);
    const calloutEl = document.getElementById(`callout-${r}`);
    const chipEl = document.getElementById(`chip-${r}`);

    if (svgEl) {
      if (r === regionId) {
        svgEl.style.filter = `url(#glow-${r})`;
        svgEl.style.opacity = '1';
      } else {
        svgEl.style.filter = 'none';
        svgEl.style.opacity = '0.65';
      }
    }

    if (calloutEl) {
      calloutEl.style.opacity = (r === regionId) ? '1' : '0.35';
    }

    if (chipEl) {
      if (r === regionId) {
        chipEl.className = "flex items-center gap-2 p-2.5 rounded-xl border-2 border-primary bg-primary/10 text-left transition-all shadow-sm ring-2 ring-primary/20 scale-[1.02]";
      } else {
        chipEl.className = "flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all shadow-2xs";
      }
    }
  });

  // 2. Actualizar etiquetas de estado en pantalla
  const topActiveLabel = document.getElementById('top-active-region-label');
  if (topActiveLabel) topActiveLabel.innerText = region.name;

  const canvasActiveName = document.getElementById('canvas-active-name');
  if (canvasActiveName) canvasActiveName.innerText = region.name;

  const canvasDot = document.getElementById('canvas-indicator-dot');
  if (canvasDot) canvasDot.style.backgroundColor = region.colorHex;

  // 3. Renderizar la Ficha Clínica y Pedagógica
  renderRegionDossier(region);
}

function renderRegionDossier(region) {
  const container = document.getElementById('region-dossier-container');
  if (!container) return;

  // Renderizar las 4 funciones principales con íconos
  const functionsHtml = region.functions.map(fn => `
    <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
      <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-primary flex items-center justify-center shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-[18px]">${fn.icon}</span>
      </div>
      <div>
        <h4 class="text-xs font-bold text-slate-900 leading-snug">${fn.title}</h4>
        <p class="text-[12px] text-slate-600 leading-relaxed mt-0.5">${fn.desc}</p>
      </div>
    </div>
  `).join('');

  // Renderizar síntomas de alteración
  const symptomsHtml = region.alterations.symptoms.map(sym => `
    <li class="flex items-start gap-2 text-xs text-rose-900 leading-relaxed">
      <span class="material-symbols-outlined text-[15px] text-rose-600 shrink-0 mt-0.5">warning</span>
      <span>${sym}</span>
    </li>
  `).join('');

  container.innerHTML = `
    <!-- Cabecera de la Estructura -->
    <div class="p-5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50/80">
      <div class="flex items-center justify-between gap-2 flex-wrap mb-2">
        <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase ${region.badgeClass} border">
          ${region.division}
        </span>
        <span class="text-xs font-mono font-semibold text-slate-500">
          ${region.brodmann}
        </span>
      </div>
      
      <div class="flex items-baseline gap-2.5 flex-wrap">
        <h2 class="font-display text-2xl font-bold text-slate-900 tracking-tight" style="color: ${region.colorHex}">
          ${region.name}
        </h2>
        <span class="text-xs italic text-slate-500 font-medium font-serif">
          ${region.latin}
        </span>
      </div>

      <!-- Metáfora Didáctica -->
      <div class="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px]">${region.metaphor.icon}</span>
        </div>
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-primary block">
            ${region.metaphor.title}
          </span>
          <p class="text-xs text-slate-700 font-medium">
            ${region.metaphor.desc}
          </p>
        </div>
      </div>
    </div>

    <div class="p-5 space-y-5">
      <!-- 1. Ubicación Anatómica -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <span class="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
          <span>Ubicación Anatómica</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          ${region.location}
        </p>
      </div>

      <!-- 2. Funciones Principales (Conducta y Cognición) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <span class="material-symbols-outlined text-[16px] text-primary">psychology</span>
            <span>Funciones Clave en la Conducta y Cognición</span>
          </div>
          <span class="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
            4 pilares
          </span>
        </div>
        <div class="grid grid-cols-1 gap-2">
          ${functionsHtml}
        </div>
      </div>

      <!-- 3. Simulador de Impacto Lesional "¿Qué pasa si se lesiona?" -->
      <div class="space-y-2.5 pt-2 border-t border-slate-200">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
            <span class="material-symbols-outlined text-[16px] text-rose-600">emergency</span>
            <span>Simulador de Lesión y Correlato Clínico</span>
          </div>

          <!-- Selector de Modo Sano vs Lesión -->
          <div class="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button id="sim-btn-normal" onclick="setSimState('normal')" class="px-2.5 py-1 rounded-md font-semibold transition-all ${AppState.simState === 'normal' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}">
              Sano
            </button>
            <button id="sim-btn-lesion" onclick="setSimState('lesion')" class="px-2.5 py-1 rounded-md font-semibold transition-all ${AppState.simState === 'lesion' ? 'bg-rose-600 text-white shadow-2xs font-bold' : 'text-slate-600'}">
              Lesionado
            </button>
          </div>
        </div>

        <div id="sim-content-box" class="p-4 rounded-xl border transition-all ${AppState.simState === 'normal' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'}">
          ${renderSimulatorContent(region)}
        </div>
      </div>

      <!-- Caso Paradigmático / Viñeta Académica -->
      <div class="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">school</span>
            <span>Referencia en Psicología</span>
          </span>
          <span class="text-[10px] text-slate-400 font-mono">${region.alterations.paradigm}</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
          ${region.alterations.clinicalExplanation}
        </p>
      </div>

      <!-- Acceso Rápido a Quizzes de esta Estructura -->
      <div class="pt-2 flex items-center justify-between gap-3">
        <button onclick="startQuizForRegion('${region.id}')" class="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm">
          <span class="material-symbols-outlined text-[16px]">quiz</span>
          <span>Practicar Preguntas de esta Región</span>
        </button>
      </div>
    </div>
  `;
}

function setSimState(state) {
  AppState.simState = state;
  const region = window.NeuroDB.getRegion(AppState.activeRegionId);
  if (!region) return;

  const btnNormal = document.getElementById('sim-btn-normal');
  const btnLesion = document.getElementById('sim-btn-lesion');
  const contentBox = document.getElementById('sim-content-box');

  if (btnNormal && btnLesion && contentBox) {
    if (state === 'normal') {
      btnNormal.className = "px-2.5 py-1 rounded-md font-semibold transition-all bg-white text-slate-900 shadow-2xs font-bold";
      btnLesion.className = "px-2.5 py-1 rounded-md font-semibold transition-all text-slate-600";
      contentBox.className = "p-4 rounded-xl border transition-all bg-emerald-50/70 border-emerald-200 text-emerald-950";
    } else {
      btnNormal.className = "px-2.5 py-1 rounded-md font-semibold transition-all text-slate-600";
      btnLesion.className = "px-2.5 py-1 rounded-md font-semibold transition-all bg-rose-600 text-white shadow-2xs font-bold";
      contentBox.className = "p-4 rounded-xl border transition-all bg-rose-50/70 border-rose-200 text-rose-950";
    }
    contentBox.innerHTML = renderSimulatorContent(region);
  }
}

function renderSimulatorContent(region) {
  if (AppState.simState === 'normal') {
    return `
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
          <span class="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Estado Fisiológico Óptimo</span>
        </div>
        <p class="text-xs text-emerald-900/90 leading-relaxed">
          La corteza opera con indemnidad anatómica y neuroquímica normal. El estudiante/paciente integra las aferencias sensoriales y modula sus respuestas conductuales de forma armónica y adaptativa.
        </p>
      </div>
    `;
  } else {
    const symptomsHtml = region.alterations.symptoms.map(s => `
      <li class="flex items-start gap-1.5 text-[11px] text-rose-900">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
        <span>${s}</span>
      </li>
    `).join('');

    return `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-rose-900 uppercase tracking-wide">
            ${region.alterations.syndrome}
          </span>
          <span class="text-[10px] bg-rose-200/80 text-rose-800 font-bold px-1.5 py-0.5 rounded">
            Déficit Conductual
          </span>
        </div>
        <ul class="space-y-1.5">
          ${symptomsHtml}
        </ul>
      </div>
    `;
  }
}

// Audio-guía didáctica usando SpeechSynthesis nativo del navegador
function toggleAudioExplanation() {
  if (!('speechSynthesis' in window)) {
    alert("Tu navegador no soporta síntesis de voz, pero puedes leer toda la información en pantalla.");
    return;
  }

  if (AppState.isAudioPlaying) {
    window.speechSynthesis.cancel();
    AppState.isAudioPlaying = false;
    updateAudioUI(false);
    return;
  }

  const region = window.NeuroDB.getRegion(AppState.activeRegionId);
  if (!region) return;

  window.speechSynthesis.cancel();
  const text = `${region.name}. ${region.metaphor.title}. Ubicación: ${region.location}. Función principal: ${region.functions[0].title}. ${region.alterations.clinicalExplanation}`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 1.0;

  utterance.onstart = () => {
    AppState.isAudioPlaying = true;
    updateAudioUI(true);
  };

  utterance.onend = () => {
    AppState.isAudioPlaying = false;
    updateAudioUI(false);
  };

  utterance.onerror = () => {
    AppState.isAudioPlaying = false;
    updateAudioUI(false);
  };

  window.speechSynthesis.speak(utterance);
}

function updateAudioUI(playing) {
  const label = document.getElementById('audio-btn-label');
  const container = document.getElementById('wave-container');
  if (label) label.innerText = playing ? 'Pausar Audio' : 'Escuchar Audio';
  if (container) {
    if (playing) {
      container.classList.add('wave-playing');
    } else {
      container.classList.remove('wave-playing');
    }
  }
}

// Controles de Zoom del SVG
function adjustZoom(delta) {
  AppState.currentZoom = Math.max(70, Math.min(160, AppState.currentZoom + delta));
  applyZoom();
}

function resetZoom() {
  AppState.currentZoom = 100;
  applyZoom();
}

function applyZoom() {
  const layer = document.getElementById('brain-scalable-layer');
  const text = document.getElementById('zoom-text');
  if (layer) layer.style.transform = `scale(${AppState.currentZoom / 100})`;
  if (text) text.innerText = `${AppState.currentZoom}%`;
}

function startQuizForRegion(regionId) {
  switchTab('quiz');
  if (QuizState.questions.length > 0) {
    const qIndex = QuizState.questions.findIndex(q => q.regionId === regionId);
    if (qIndex !== -1) {
      QuizState.currentIndex = qIndex;
      QuizState.isAnswered = false;
      QuizState.selectedOpt = null;
      renderQuizQuestion();
    }
  }
}

// =========================================================================
// FUNCIÓN 2: QUIZ DINÁMICO DE IDENTIFICACIÓN (PRD 3.2)
// =========================================================================
const QuizState = {
  questions: [],
  currentIndex: 0,
  isAnswered: false,
  selectedOpt: null,
  score: 0
};

function initQuiz() {
  QuizState.questions = window.NeuroDB.getQuestions();
  QuizState.currentIndex = 0;
  QuizState.isAnswered = false;
  QuizState.selectedOpt = null;
  QuizState.score = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const total = QuizState.questions.length;
  if (total === 0) {
    container.innerHTML = `<p class="text-slate-500">No hay preguntas disponibles en la base de datos.</p>`;
    return;
  }

  const q = QuizState.questions[QuizState.currentIndex];
  const progressPercent = Math.round(((QuizState.currentIndex + 1) / total) * 100);
  const letters = ['A', 'B', 'C', 'D'];

  // Obtener nombre de la región relacionada para el tag
  const region = window.NeuroDB.getRegion(q.regionId);
  const regionName = region ? region.name : 'Neuroanatomía';

  const optionsHtml = q.options.map((opt, idx) => {
    let cardClasses = "quiz-option-btn w-full p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all flex items-center justify-between group shadow-2xs cursor-pointer";
    let badgeClasses = "w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-display font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors";
    let iconHtml = `<span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-lg">radio_button_unchecked</span>`;

    if (QuizState.isAnswered) {
      if (idx === q.correctAnswer) {
        cardClasses = "quiz-option-btn w-full p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-medium text-left transition-all flex items-center justify-between shadow-xs";
        badgeClasses = "w-7 h-7 rounded-lg bg-emerald-600 text-white font-display font-bold text-xs flex items-center justify-center shrink-0";
        iconHtml = `<span class="material-symbols-outlined text-emerald-600 text-xl font-bold">check_circle</span>`;
      } else if (idx === QuizState.selectedOpt) {
        cardClasses = "quiz-option-btn w-full p-4 rounded-xl border-2 border-rose-500 bg-rose-50 text-rose-950 text-left transition-all flex items-center justify-between shadow-xs";
        badgeClasses = "w-7 h-7 rounded-lg bg-rose-600 text-white font-display font-bold text-xs flex items-center justify-center shrink-0";
        iconHtml = `<span class="material-symbols-outlined text-rose-600 text-xl font-bold">cancel</span>`;
      } else {
        cardClasses = "quiz-option-btn w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-left transition-all flex items-center justify-between opacity-60";
        badgeClasses = "w-7 h-7 rounded-lg bg-slate-200 text-slate-500 font-display font-bold text-xs flex items-center justify-center shrink-0";
        iconHtml = `<span></span>`;
      }
    }

    return `
      <button onclick="handleQuizOptionSelect(${idx})" class="${cardClasses}" ${QuizState.isAnswered ? 'disabled' : ''}>
        <div class="flex items-center gap-3">
          <span class="${badgeClasses}">${letters[idx]}</span>
          <span class="text-xs md:text-sm font-medium leading-relaxed">${opt}</span>
        </div>
        ${iconHtml}
      </button>
    `;
  }).join('');

  // Caja de retroalimentación inmediata didáctica y contrastiva
  let feedbackHtml = '';
  if (QuizState.isAnswered) {
    const isCorrect = (QuizState.selectedOpt === q.correctAnswer);
    const isLast = (QuizState.currentIndex + 1 === total);

    if (isCorrect) {
      feedbackHtml = `
        <div class="mt-6 p-4 md:p-5 rounded-2xl border bg-emerald-50 border-emerald-300 text-emerald-950 transition-all shadow-sm space-y-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
            <h4 class="font-display font-bold text-sm md:text-base text-emerald-900">
              ¡Excelente deducción! Respuesta Correcta
            </h4>
          </div>
          <p class="text-xs md:text-sm leading-relaxed text-slate-800">
            ${q.correctExplanation || q.explanation}
          </p>
          <div class="pt-2 flex justify-end">
            <button onclick="handleNextQuizQuestion()" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-display text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95">
              <span>${isLast ? 'Ver Resultados Finales' : 'Siguiente Pregunta'}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      `;
    } else {
      const chosenText = q.options[QuizState.selectedOpt];
      const correctText = q.options[q.correctAnswer];
      const chosenFeedback = (q.optionFeedback && q.optionFeedback[QuizState.selectedOpt])
        ? q.optionFeedback[QuizState.selectedOpt]
        : "Esta estructura no se corresponde con los síntomas o funciones de la pregunta.";
      const correctWhy = q.correctExplanation || q.explanation;

      feedbackHtml = `
        <div class="mt-6 p-4 md:p-5 rounded-2xl border bg-rose-50/90 border-rose-300 text-rose-950 transition-all shadow-sm space-y-4">
          <div class="flex items-center gap-2 border-b border-rose-200 pb-2.5">
            <span class="material-symbols-outlined text-2xl text-rose-600">cancel</span>
            <h4 class="font-display font-bold text-sm md:text-base text-rose-900">
              Respuesta Incorrecta — Análisis Anatómico Comparativo
            </h4>
          </div>

          <div class="space-y-3 text-xs md:text-sm leading-relaxed">
            <!-- Por qué NO es tu opción elegida -->
            <div class="p-3.5 rounded-xl bg-white border border-rose-200/90 space-y-1 shadow-2xs">
              <div class="flex items-center gap-1.5 font-bold text-rose-800">
                <span class="material-symbols-outlined text-[17px] text-rose-600">close</span>
                <span>Esta no es la correcta (${chosenText}):</span>
              </div>
              <p class="text-slate-700 pl-5 leading-relaxed">
                ${chosenFeedback}
              </p>
            </div>

            <!-- Por qué SÍ es la opción correcta -->
            <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300/90 space-y-1 shadow-2xs">
              <div class="flex items-center gap-1.5 font-bold text-emerald-800">
                <span class="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
                <span>La opción correcta es ${correctText}:</span>
              </div>
              <p class="text-slate-700 pl-5 leading-relaxed">
                ${correctWhy}
              </p>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button onclick="handleNextQuizQuestion()" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-display text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95">
              <span>${isLast ? 'Ver Resultados Finales' : 'Siguiente Pregunta'}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <!-- Barra superior de estado del Quiz -->
    <div class="space-y-3 pb-5 border-b border-slate-200">
      <div class="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
            Autoevaluación de Identificación
          </span>
          <span class="text-slate-500 font-semibold hidden sm:inline">• Nivel: ${q.difficulty}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-700 font-mono">
            Pregunta ${QuizState.currentIndex + 1} de ${total}
          </span>
          <span class="text-xs font-bold text-primary font-mono bg-teal-50 px-2 py-0.5 rounded">
            Aciertos: ${QuizState.score}
          </span>
        </div>
      </div>

      <!-- Barra de Progreso Visual -->
      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full" style="width: ${progressPercent}%"></div>
      </div>
    </div>

    <!-- Pregunta Activa -->
    <div class="pt-4 space-y-4">
      <div class="space-y-1">
        <span class="text-[11px] uppercase font-bold text-secondary tracking-wider block">
          Estructura Relacionada: ${regionName}
        </span>
        <h2 class="font-display text-lg md:text-xl font-bold text-slate-900 leading-snug">
          ${q.question}
        </h2>
      </div>

      <!-- Opciones A, B, C, D -->
      <div class="grid grid-cols-1 gap-2.5 pt-2">
        ${optionsHtml}
      </div>

      <!-- Explicación Didáctica -->
      ${feedbackHtml}
    </div>
  `;
}

function handleQuizOptionSelect(optionIdx) {
  if (QuizState.isAnswered) return;

  const q = QuizState.questions[QuizState.currentIndex];
  QuizState.isAnswered = true;
  QuizState.selectedOpt = optionIdx;

  const isCorrect = (optionIdx === q.correctAnswer);
  if (isCorrect) {
    QuizState.score++;
  }

  // Registrar en la Base de Datos Local
  window.NeuroDB.recordQuizAnswer(q.id, optionIdx, isCorrect);

  // Re-renderizar la pregunta con los estilos de acierto/error y la retroalimentación
  renderQuizQuestion();
}

function handleNextQuizQuestion() {
  if (QuizState.currentIndex + 1 < QuizState.questions.length) {
    QuizState.currentIndex++;
    QuizState.isAnswered = false;
    QuizState.selectedOpt = null;
    renderQuizQuestion();
  } else {
    renderQuizSummary();
  }
}

function renderQuizSummary() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const total = QuizState.questions.length;
  const score = QuizState.score;
  const percentage = Math.round((score / total) * 100);

  let feedbackTitle = "¡Excelente Trabajo!";
  let feedbackMessage = "Has demostrado un dominio sobresaliente de las estructuras y sus correlatos clínicos.";
  let colorBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";

  if (percentage < 60) {
    feedbackTitle = "Buen intento, continúa reforzando";
    feedbackMessage = "Te sugerimos regresar al Explorador 2D para repasar las funciones de las estructuras que fallaste.";
    colorBadge = "bg-amber-100 text-amber-800 border-amber-300";
  } else if (percentage < 85) {
    feedbackTitle = "¡Muy Buen Desempeño!";
    feedbackMessage = "Tienes una base neuroanatómica sólida. Con un repaso breve afianzarás los detalles clínicos.";
    colorBadge = "bg-blue-100 text-blue-800 border-blue-300";
  }

  container.innerHTML = `
    <div class="text-center py-8 px-4 max-w-lg mx-auto space-y-5">
      <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
        <span class="material-symbols-outlined text-4xl">emoji_events</span>
      </div>

      <div class="space-y-1">
        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorBadge} border inline-block">
          ${feedbackTitle}
        </span>
        <h3 class="font-display text-3xl font-bold text-slate-900 mt-2">
          ${score} de ${total} Aciertos (${percentage}%)
        </h3>
        <p class="text-xs md:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          ${feedbackMessage}
        </p>
      </div>

      <!-- Métricas del Resultado -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-left">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Total Evaluado</span>
          <span class="text-base font-bold text-slate-900 font-mono">${total} Preguntas</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Guardado en BD</span>
          <span class="text-base font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Registrado
          </span>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button onclick="initQuiz()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs">
          <span class="material-symbols-outlined text-[18px]">replay</span>
          <span>Reintentar Quiz</span>
        </button>
        <button onclick="switchTab('casos')" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm">
          <span>Ir a Casos Clínicos</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <button onclick="switchTab('explorador')" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm">
          <span class="material-symbols-outlined text-[18px]">map</span>
          <span>Volver al Atlas</span>
        </button>
      </div>
    </div>
  `;
}

// =========================================================================
// FUNCIÓN 3: CASOS CLÍNICOS FICTICIOS (PRD 3.3)
// =========================================================================
const CasosState = {
  cases: [],
  currentIndex: 0,
  selectedRegionId: null,
  isAnswered: false
};

function initCasos(index = 0) {
  CasosState.cases = window.NeuroDB.getCases();
  CasosState.currentIndex = index;
  CasosState.selectedRegionId = null;
  CasosState.isAnswered = false;
  renderCaseView();
}

function renderCaseView() {
  const container = document.getElementById('casos-container');
  if (!container) return;

  const total = CasosState.cases.length;
  if (total === 0) {
    container.innerHTML = `<p class="text-slate-500">No hay casos clínicos disponibles en la base de datos.</p>`;
    return;
  }

  const c = CasosState.cases[CasosState.currentIndex];
  const progress = window.NeuroDB.getUserProgress();
  const completedMap = progress.completedCasesMap || {};
  const allRegions = window.NeuroDB.getRegions();
  const correctRegion = window.NeuroDB.getRegion(c.correctRegionId);

  // 1. Tira superior del Rotatorio Clínico (Casos 1 al 6)
  const stripHtml = CasosState.cases.map((item, idx) => {
    const isCurrent = (idx === CasosState.currentIndex);
    const isDone = completedMap[item.id] && completedMap[item.id].isCorrect;
    
    let borderStyle = isCurrent 
      ? 'border-2 border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20 scale-[1.02]' 
      : 'border border-slate-200 bg-white hover:bg-slate-50';

    let statusBadge = isDone 
      ? `<span class="material-symbols-outlined text-emerald-600 text-sm font-bold">check_circle</span>`
      : `<span class="text-[10px] text-slate-400 font-mono">#${item.number}</span>`;

    return `
      <button onclick="initCasos(${idx})" class="p-3 rounded-xl ${borderStyle} text-left transition-all flex flex-col justify-between shrink-0 min-w-[130px] md:min-w-0">
        <div class="flex items-center justify-between gap-1">
          <span class="font-display text-[11px] font-bold ${isCurrent ? 'text-primary' : 'text-slate-800'}">
            Caso #${item.number}
          </span>
          ${statusBadge}
        </div>
        <p class="text-[11px] font-semibold text-slate-600 truncate mt-1">
          ${item.title}
        </p>
      </button>
    `;
  }).join('');

  // 2. Tarjetas de opciones de las 6 regiones para diagnóstico
  const regionsHtml = allRegions.map(reg => {
    let cardClasses = "p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all flex items-center justify-between group cursor-pointer shadow-2xs";
    let iconHtml = `<span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-lg">medical_information</span>`;

    if (CasosState.isAnswered) {
      if (reg.id === c.correctRegionId) {
        cardClasses = "p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold text-left transition-all flex items-center justify-between shadow-xs";
        iconHtml = `<span class="material-symbols-outlined text-emerald-600 text-xl font-bold">check_circle</span>`;
      } else if (reg.id === CasosState.selectedRegionId) {
        cardClasses = "p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-rose-950 font-medium text-left transition-all flex items-center justify-between shadow-xs";
        iconHtml = `<span class="material-symbols-outlined text-rose-600 text-xl font-bold">cancel</span>`;
      } else {
        cardClasses = "p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-left transition-all flex items-center justify-between opacity-50";
        iconHtml = `<span></span>`;
      }
    }

    return `
      <button onclick="handleCaseDiagnosisSelect('${reg.id}')" class="${cardClasses}" ${CasosState.isAnswered ? 'disabled' : ''}>
        <div class="flex items-center gap-2.5">
          <span class="w-3.5 h-3.5 rounded-full shrink-0" style="background-color: ${reg.colorHex}"></span>
          <div>
            <span class="text-xs md:text-sm font-bold block leading-tight text-slate-900">${reg.name}</span>
            <span class="text-[10px] text-slate-500 italic font-serif">${reg.latin}</span>
          </div>
        </div>
        ${iconHtml}
      </button>
    `;
  }).join('');

  // 3. Cuadro de Semiología y Signos Clave
  const symptomsHtml = c.symptoms.map(s => `
    <li class="flex items-start gap-2 text-xs md:text-sm text-slate-700 leading-relaxed">
      <span class="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">stethoscope</span>
      <span>${s}</span>
    </li>
  `).join('');

  // 4. Retroalimentación Diagnóstica Inmediata (Contrastiva)
  let feedbackHtml = '';
  if (CasosState.isAnswered) {
    const isCorrect = (CasosState.selectedRegionId === c.correctRegionId);
    const isLast = (CasosState.currentIndex + 1 === total);

    if (isCorrect) {
      feedbackHtml = `
        <div class="p-5 rounded-2xl border bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm space-y-3 transition-all">
          <div class="flex items-center gap-2 border-b border-emerald-200 pb-2.5">
            <span class="material-symbols-outlined text-2xl text-emerald-600">verified</span>
            <div>
              <h4 class="font-display font-bold text-sm md:text-base text-emerald-900">
                ¡Diagnóstico Neuropsicológico Acertado!
              </h4>
              <span class="text-xs text-emerald-800 font-semibold">
                Síndrome: ${c.syndromeName} (Estructura: ${correctRegion.name})
              </span>
            </div>
          </div>
          <p class="text-xs md:text-sm leading-relaxed text-slate-800">
            ${c.explanation}
          </p>
          <div class="pt-2 flex justify-end">
            <button onclick="handleNextCase()" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-display text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95">
              <span>${isLast ? 'Ver Rotatorio Completado' : 'Siguiente Caso Clínico'}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      `;
    } else {
      const selectedReg = window.NeuroDB.getRegion(CasosState.selectedRegionId);
      const diffReason = (c.differentialFeedback && c.differentialFeedback[CasosState.selectedRegionId])
        ? c.differentialFeedback[CasosState.selectedRegionId]
        : "Esta región cerebral generaría un cuadro clínico diferente al descrito en la historia del paciente.";

      feedbackHtml = `
        <div class="p-5 rounded-2xl border bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm space-y-4 transition-all">
          <div class="flex items-center gap-2 border-b border-rose-200 pb-2.5">
            <span class="material-symbols-outlined text-2xl text-rose-600">cancel</span>
            <div>
              <h4 class="font-display font-bold text-sm md:text-base text-rose-900">
                Diagnóstico Diferencial No Coincidente
              </h4>
              <span class="text-xs text-rose-800 font-semibold">
                Revisa los signos semiológicos del caso:
              </span>
            </div>
          </div>

          <div class="space-y-3 text-xs md:text-sm leading-relaxed">
            <!-- Por qué no es la seleccionada -->
            <div class="p-3.5 rounded-xl bg-white border border-rose-200/90 space-y-1 shadow-2xs">
              <div class="flex items-center gap-1.5 font-bold text-rose-800">
                <span class="material-symbols-outlined text-[17px] text-rose-600">close</span>
                <span>Por qué NO es ${selectedReg ? selectedReg.name : 'la opción elegida'}:</span>
              </div>
              <p class="text-slate-700 pl-5 leading-relaxed">
                ${diffReason}
              </p>
            </div>

            <!-- Por qué es la correcta -->
            <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300/90 space-y-1 shadow-2xs">
              <div class="flex items-center gap-1.5 font-bold text-emerald-800">
                <span class="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
                <span>La región responsable es ${correctRegion.name} (${c.syndromeName}):</span>
              </div>
              <p class="text-slate-700 pl-5 leading-relaxed">
                ${c.explanation}
              </p>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between flex-wrap gap-2">
            <button onclick="handleRetryCase()" class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs">
              <span class="material-symbols-outlined text-[16px]">replay</span>
              <span>Reintentar Diagnóstico</span>
            </button>
            <button onclick="handleNextCase()" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-display text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95">
              <span>${isLast ? 'Ver Rotatorio Completado' : 'Avanzar a Siguiente Caso'}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <!-- Tira de selección de los 6 casos -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="font-display font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-secondary text-base">view_timeline</span>
          <span>Secuencia del Rotatorio Clínico</span>
        </span>
        <span class="text-slate-500 font-mono">Caso ${CasosState.currentIndex + 1} de ${total}</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 overflow-x-auto pb-1">
        ${stripHtml}
      </div>
    </div>

    <!-- Expediente Clínico del Paciente -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-5 p-5 md:p-6">
      
      <!-- Encabezado del Paciente -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-tertiary text-white flex items-center justify-center font-display font-bold text-base shadow-sm shrink-0">
            ${c.patient.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border">
                Caso #${c.number}
              </span>
              <h2 class="font-display text-lg md:text-xl font-bold text-slate-900 leading-tight">
                Paciente: ${c.patient}
              </h2>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Motivo: ${c.title}
            </p>
          </div>
        </div>

        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
          Evaluación Neuropsicológica
        </span>
      </div>

      <!-- Cuadro de Historia Breve / Anamnesis -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
        <span class="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">clinical_notes</span>
          <span>Anamnesis e Historia Focal</span>
        </span>
        <p class="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
          ${c.history}
        </p>
      </div>

      <!-- Signos y Semiología -->
      <div class="space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Semiología y Hallazgos Objetivos en Consulta
        </span>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/80">
          ${symptomsHtml}
        </ul>
      </div>

      <!-- Pregunta de Localización y Selector -->
      <div class="pt-3 border-t border-slate-200 space-y-3">
        <div class="space-y-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-secondary">
            Pregunta de Razonamiento Clínico
          </span>
          <h3 class="font-display text-base md:text-lg font-bold text-slate-900">
            ¿Qué región cerebral se encuentra principalmente afectada en este caso?
          </h3>
          <p class="text-xs text-slate-500">
            Toca una de las seis regiones anatómicas para registrar tu diagnóstico:
          </p>
        </div>

        <!-- Las 6 Regiones Anatómicas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          ${regionsHtml}
        </div>
      </div>

      <!-- Feedback Dinámico de la Decisión -->
      ${feedbackHtml}
    </div>
  `;
}

function handleCaseDiagnosisSelect(regionId) {
  if (CasosState.isAnswered) return;

  const c = CasosState.cases[CasosState.currentIndex];
  CasosState.isAnswered = true;
  CasosState.selectedRegionId = regionId;

  const isCorrect = (regionId === c.correctRegionId);

  // Registrar en la Base de Datos Local
  window.NeuroDB.recordCaseDiagnosis(c.id, regionId, isCorrect);

  // Re-renderizar caso con el resultado
  renderCaseView();
}

function handleRetryCase() {
  CasosState.isAnswered = false;
  CasosState.selectedRegionId = null;
  renderCaseView();
}

function handleNextCase() {
  if (CasosState.currentIndex + 1 < CasosState.cases.length) {
    initCasos(CasosState.currentIndex + 1);
  } else {
    // Si terminó todos los casos, llevar a la vista de progreso para ver su récord
    switchTab('progreso');
  }
}


function renderProgressView() {
  const stats = window.NeuroDB.getUserProgress();
  const progressContainer = document.getElementById('progress-dashboard-content');
  if (!progressContainer) return;

  progressContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl">
          <span class="material-symbols-outlined text-2xl">map</span>
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block">Estructuras Exploradas</span>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold font-display text-slate-900">${stats.exploredCount} / ${stats.totalRegions}</span>
            <span class="text-xs text-teal-600 font-semibold">${stats.exploredPercentage}%</span>
          </div>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
          <span class="material-symbols-outlined text-2xl">quiz</span>
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block">Aciertos en Quiz</span>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold font-display text-slate-900">${stats.quizScore} / ${stats.quizTotalAnswered}</span>
            <span class="text-xs text-blue-600 font-semibold">${stats.quizAccuracy}% precisión</span>
          </div>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
          <span class="material-symbols-outlined text-2xl">clinical_notes</span>
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block">Casos Resueltos</span>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold font-display text-slate-900">${stats.casesCompleted} / ${stats.totalCases}</span>
            <span class="text-xs text-purple-600 font-semibold">${stats.casesPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  selectRegion('frontal');
});
