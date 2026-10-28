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
}

// Placeholder de render de progreso (se ampliará en Paso 5)
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
