/**
 * LÒGICA D'APLICACIÓ - RECURS EDUCATIU: LA UNIÓ EUROPEA
 * Cicle Superior de Primària - Llengua Catalana
 * Compliment WCAG 2.1 AA i DUA
 */

(function () {
  'use strict';

  // Estat de l'aplicació
  const state = {
    alumne: {
      nom: '',
      grup: ''
    },
    indexPregunta: 0,
    intentsPreguntaActual: 0, // 0 = cap intent, 1 = un error (activa pista), 2 = resolt
    opcioSeleccionadaActual: null,
    respostes: [], // { id, estat: 'pass-first'|'pass-second'|'failed', punts: 10|5|0, tria1, tria2 }
    modeLecturaMobil: 'quiz', // 'text' | 'quiz' per a pantalles petites
    veuActiva: null,
    veuHabilitada: 'speechSynthesis' in window
  };

  // Referències DOM
  const dom = {
    // Vistes
    viewAuth: document.getElementById('view-auth'),
    viewApp: document.getElementById('view-app'),
    viewResults: document.getElementById('view-results'),

    // Formulari registre
    formAuth: document.getElementById('form-auth'),
    inputNom: document.getElementById('input-nom'),
    selectGrup: document.getElementById('select-grup'),
    badgeAlumne: document.getElementById('badge-alumne-nom'),

    // Panells DUA
    readingContent: document.getElementById('reading-content'),
    quizPanel: document.getElementById('quiz-panel'),
    readingPanel: document.getElementById('reading-panel'),
    tabReading: document.getElementById('tab-reading'),
    tabQuiz: document.getElementById('tab-quiz'),

    // Qüestionari
    questionCurrentNum: document.getElementById('question-current-num'),
    questionProgressBar: document.getElementById('question-progress-bar'),
    questionMap: document.getElementById('question-map'),
    questionTypeBadge: document.getElementById('question-type-badge'),
    questionFormatBadge: document.getElementById('question-format-badge'),
    questionLegend: document.getElementById('question-legend'),
    btnTtsQuestion: document.getElementById('btn-tts-question'),
    optionsList: document.getElementById('options-list'),
    writingContainer: document.getElementById('writing-container'),
    inputWriting: document.getElementById('input-resposta-escrita'),
    writingHelpText: document.getElementById('writing-help-text'),
    feedbackContainer: document.getElementById('feedback-container'),
    btnCheck: document.getElementById('btn-check'),
    btnRetry: document.getElementById('btn-retry'),
    btnNext: document.getElementById('btn-next'),

    // Accessibilitat
    btnFontDec: document.getElementById('btn-font-dec'),
    btnFontInc: document.getElementById('btn-font-inc'),
    btnDyslexia: document.getElementById('btn-dyslexia'),
    btnContrast: document.getElementById('btn-contrast'),
    btnStopSpeech: document.getElementById('btn-stop-speech'),

    // Modals
    btnOpenGlossary: document.getElementById('btn-open-glossary'),
    btnOpenTeacher: document.getElementById('btn-open-teacher'),
    modalGlossary: document.getElementById('modal-glossary'),
    modalTeacher: document.getElementById('modal-teacher'),
    glossaryList: document.getElementById('glossary-list'),

    // Resultats
    scoreNumber: document.getElementById('score-number'),
    scoreBadge: document.getElementById('score-badge'),
    statFirst: document.getElementById('stat-first'),
    statSecond: document.getElementById('stat-second'),
    statFailed: document.getElementById('stat-failed'),
    barLiteralFill: document.getElementById('bar-literal-fill'),
    valLiteral: document.getElementById('val-literal'),
    barInferentialFill: document.getElementById('bar-inferential-fill'),
    valInferential: document.getElementById('val-inferential'),
    diplomaNom: document.getElementById('diploma-nom'),
    diplomaGrup: document.getElementById('diploma-grup'),
    diplomaData: document.getElementById('diploma-data'),
    diplomaPuntuacio: document.getElementById('diploma-puntuacio'),
    btnDownloadPdf: document.getElementById('btn-download-pdf'),
    btnPrintDiploma: document.getElementById('btn-print-diploma'),
    btnRestart: document.getElementById('btn-restart'),
    btnClearData: document.getElementById('btn-clear-data'),

    // Live region per a lectors de pantalla
    srAnnouncer: document.getElementById('sr-announcer')
  };

  /* ==========================================================================
     INICIALITZACIÓ
     ========================================================================== */

  function init() {
    carregarPreferenciesA11y();
    configurarVeuCatalana();
    carregarTextLectura();
    carregarGlossari();
    comprovarSessioGuardada();
    registrarEsdeveniments();
  }

  /* ==========================================================================
     GESTIÓ D'ACCESSIBILITAT (DUA / WCAG AA)
     ========================================================================== */

  function carregarPreferenciesA11y() {
    // Mode contrast
    if (localStorage.getItem('recurs_ue_contrast') === 'high') {
      document.body.classList.add('high-contrast');
      dom.btnContrast.setAttribute('aria-pressed', 'true');
    }

    // Font per a dislèxia
    if (localStorage.getItem('recurs_ue_dyslexia') === 'true') {
      document.body.classList.add('font-dyslexia');
      dom.btnDyslexia.setAttribute('aria-pressed', 'true');
    }

    // Mida de font
    const fontSize = localStorage.getItem('recurs_ue_font_size') || 'normal';
    document.documentElement.setAttribute('data-font-size', fontSize);
  }

  function canviarMidaFont(delta) {
    const nivells = ['normal', 'large', 'xlarge'];
    const actual = document.documentElement.getAttribute('data-font-size') || 'normal';
    let idx = nivells.indexOf(actual);
    idx = Math.max(0, Math.min(nivells.length - 1, idx + delta));
    const nou = nivells[idx];
    document.documentElement.setAttribute('data-font-size', nou);
    localStorage.setItem('recurs_ue_font_size', nou);
    anunciar(`Mida del text canviada a ${nou === 'normal' ? 'estàndard' : nou === 'large' ? 'gran' : 'molt gran'}`);
  }

  function toggleContrast() {
    const actiu = document.body.classList.toggle('high-contrast');
    dom.btnContrast.setAttribute('aria-pressed', actiu ? 'true' : 'false');
    localStorage.setItem('recurs_ue_contrast', actiu ? 'high' : 'normal');
    anunciar(actiu ? 'Mode d\'alt contrast activat' : 'Mode d\'alt contrast desactivat');
  }

  function toggleDyslexia() {
    const actiu = document.body.classList.toggle('font-dyslexia');
    dom.btnDyslexia.setAttribute('aria-pressed', actiu ? 'true' : 'false');
    localStorage.setItem('recurs_ue_dyslexia', actiu ? 'true' : 'false');
    anunciar(actiu ? 'Font d\'alta llegibilitat activada' : 'Font estàndard activada');
  }

  function anunciar(missatge) {
    if (dom.srAnnouncer) {
      dom.srAnnouncer.textContent = missatge;
    }
  }

  /* ==========================================================================
     SÍNTESI DE VEU (TEXT-TO-SPEECH EN CATALÀ)
     ========================================================================== */

  function configurarVeuCatalana() {
    if (!state.veuHabilitada) return;

    function buscarVeu() {
      const veus = window.speechSynthesis.getVoices();
      // Prioritat: català (ca-ES, ca)
      state.veuActiva = veus.find(v => v.lang.startsWith('ca')) ||
                        veus.find(v => v.lang.startsWith('es')) ||
                        veus[0];
    }

    buscarVeu();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = buscarVeu;
    }
  }

  function llegirText(text) {
    if (!state.veuHabilitada) {
      alert("La síntesi de veu no és compatible amb el vostre navegador.");
      return;
    }
    aturarVeu();
    const utterance = new SpeechSynthesisUtterance(text);
    if (state.veuActiva) {
      utterance.voice = state.veuActiva;
    }
    utterance.lang = state.veuActiva ? state.veuActiva.lang : 'ca-ES';
    utterance.rate = 0.95; // Lleugerament pausada per a nens de primària
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    anunciar("Reproduint text en veu alta");
  }

  function aturarVeu() {
    if (state.veuHabilitada) {
      window.speechSynthesis.cancel();
    }
  }

  /* ==========================================================================
     GESTIÓ DE DADES I PRIVADESA (RGPD)
     ========================================================================== */

  function comprovarSessioGuardada() {
    const sessioStr = sessionStorage.getItem('recurs_ue_sessio');
    if (sessioStr) {
      try {
        const dades = JSON.parse(sessioStr);
        if (dades.alumne && dades.alumne.nom) {
          state.alumne = dades.alumne;
          state.respostes = dades.respostes || [];
          state.indexPregunta = dades.indexPregunta || 0;
          mostrarVistaApp();
          return;
        }
      } catch (e) {
        console.error("Error recuperant sessió", e);
      }
    }
    mostrarVistaAuth();
  }

  function desarSessio() {
    const dades = {
      alumne: state.alumne,
      respostes: state.respostes,
      indexPregunta: state.indexPregunta
    };
    sessionStorage.setItem('recurs_ue_sessio', JSON.stringify(dades));
  }

  function esborrarDades() {
    if (confirm("Vols reiniciar l'activitat i esborrar totes les dades locals d'aquesta sessió?")) {
      sessionStorage.removeItem('recurs_ue_sessio');
      window.location.reload();
    }
  }

  /* ==========================================================================
     RENDERITZACIÓ DEL TEXT DE LECTURA I GLOSSARI
     ========================================================================== */

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function carregarTextLectura() {
    const seccions = RECURS_DATA.textLectura.seccions;
    let html = '';

    // Mapa de termes clau ordenats per evitar coincidències parcials
    const diccionariTermes = [
      { regex: /Parlament Europeu/gi, terme: "Parlament Europeu" },
      { regex: /Comissió Europea/gi, terme: "Comissió Europea" },
      { regex: /Espai Schengen/gi, terme: "Espai Schengen" },
      { regex: /Unió Europea/gi, terme: "Unió Europea (UE)" },
      { regex: /Pacte Verd/gi, terme: "Pacte Verd" },
      { regex: /Erasmus\+/gi, terme: "Erasmus+" },
      { regex: /\bsolidaritat\b/gi, terme: "Solidaritat" },
      { regex: /\bdiversitat\b/gi, terme: "Diversitat" },
      { regex: /\btractats\b/gi, terme: "Tractat" },
      { regex: /\beuro\b/gi, terme: "Euro (€)" }
    ];

    // Regex combinada per fer la substitució en un sol pas
    const regexCombinada = /(Parlament Europeu|Comissió Europea|Espai Schengen|Unió Europea|Pacte Verd|Erasmus\+|\bsolidaritat\b|\bdiversitat\b|\btractats\b|\beuro\b)/gi;

    seccions.forEach(sec => {
      let paragrafsHtml = sec.paragrafs.map(p => {
        const textProcessat = p.replace(regexCombinada, (coincidencia) => {
          // Cercar a quin terme del glossari correspon
          const entrada = diccionariTermes.find(d => coincidencia.match(d.regex));
          const termeDesti = entrada ? entrada.terme : coincidencia;
          return `<button type="button" class="glossary-trigger" data-term="${encodeURIComponent(termeDesti)}" title="Veure definició de: ${termeDesti}">${coincidencia}</button>`;
        });
        return `<p>${textProcessat}</p>`;
      }).join('');

      html += `
        <article class="reading-section" id="${sec.id}">
          <header class="reading-section-header">
            <h3 class="reading-section-title">
              <span aria-hidden="true">${sec.icona}</span> ${sec.titol}
            </h3>
            <button type="button" class="btn-tts" data-tts-sec="${sec.id}" aria-label="Escoltar en veu alta la secció: ${sec.titol}">
              🔊 <span class="tts-label">Escoltar</span>
            </button>
          </header>
          <div class="reading-body">
            ${paragrafsHtml}
          </div>
        </article>
      `;
    });

    dom.readingContent.innerHTML = html;

    // Esdeveniments de síntesi de veu per a cada secció
    dom.readingContent.querySelectorAll('[data-tts-sec]').forEach(btn => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-tts-sec');
        const secElem = document.getElementById(secId);
        if (secElem) {
          const text = secElem.querySelector('.reading-body').innerText;
          llegirText(text);
        }
      });
    });

    // Esdeveniments per als botons de termes de glossari al text
    dom.readingContent.querySelectorAll('.glossary-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const terme = decodeURIComponent(btn.getAttribute('data-term'));
        obrirGlossariAmbTerme(terme);
      });
    });
  }

  function carregarGlossari() {
    let html = '';
    RECURS_DATA.glossari.forEach(item => {
      html += `
        <div class="glossary-item" id="glossary-item-${encodeURIComponent(item.terme).replace(/%/g, '')}">
          <dt>${item.terme}</dt>
          <dd>${item.definicio}</dd>
        </div>
      `;
    });
    dom.glossaryList.innerHTML = html;
  }

  function obrirGlossariAmbTerme(terme) {
    obrirModal(dom.modalGlossary);
    setTimeout(() => {
      const cleanId = `glossary-item-${encodeURIComponent(terme).replace(/%/g, '')}`;
      const elem = document.getElementById(cleanId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        elem.style.backgroundColor = 'var(--color-primary-light)';
        setTimeout(() => { elem.style.backgroundColor = ''; }, 2000);
      }
    }, 250);
  }

  /* ==========================================================================
     QÜESTIONARI AUTOCORRECTIU (TEST I ESCRIPTURA, 2 INTENTS AMB PISTA)
     ========================================================================== */

  function normalitzarResposta(str) {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .replace(/[«»"“”'.!?,:;()\-]/g, '')
      .replace(/\s+/g, ' ')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Tolerància diacrítica
  }

  function renderitzarPreguntaActual() {
    aturarVeu();
    const pregunta = RECURS_DATA.preguntes[state.indexPregunta];
    if (!pregunta) {
      mostrarResultatsFinals();
      return;
    }

    state.intentsPreguntaActual = 0;
    state.opcioSeleccionadaActual = null;

    // Actualitzar progrés
    dom.questionCurrentNum.textContent = `${state.indexPregunta + 1} de ${RECURS_DATA.preguntes.length}`;
    const pct = ((state.indexPregunta) / RECURS_DATA.preguntes.length) * 100;
    dom.questionProgressBar.style.width = `${pct}%`;

    // Actualitzar mapa visual de nodes
    actualitzarMapaPreguntes();

    // Etiquetes de tipus i format de pregunta
    dom.questionTypeBadge.textContent = pregunta.tipusNom;
    dom.questionTypeBadge.className = `question-type-badge badge-${pregunta.tipus}`;

    if (pregunta.format === 'escriure') {
      dom.questionFormatBadge.textContent = '✍️ Escriure la resposta';
    } else {
      dom.questionFormatBadge.textContent = '🔘 Tipus Test (Selecció)';
    }

    // Títol pregunta
    dom.questionLegend.textContent = pregunta.enunciat;

    // Netejar retroacció
    dom.feedbackContainer.innerHTML = '';
    dom.feedbackContainer.className = 'feedback-container';

    // Gestió segons el format (TEST o ESCRIURE)
    if (pregunta.format === 'escriure') {
      // MODE ESCRIPTURA
      dom.optionsList.style.display = 'none';
      dom.optionsList.innerHTML = '';
      dom.writingContainer.style.display = 'flex';

      dom.inputWriting.value = '';
      dom.inputWriting.disabled = false;
      dom.inputWriting.className = 'writing-input';
      dom.inputWriting.placeholder = pregunta.placeholder || 'Escriu la teva resposta...';

      dom.btnCheck.style.display = 'inline-flex';
      dom.btnCheck.disabled = true;
      dom.btnRetry.style.display = 'none';
      dom.btnNext.style.display = 'none';

      // Enfocar camp de text
      setTimeout(() => { dom.inputWriting.focus(); }, 150);

      anunciar(`Pregunta d'escriure ${state.indexPregunta + 1}: ${pregunta.enunciat}`);
    } else {
      // MODE TIPUS TEST
      dom.writingContainer.style.display = 'none';
      dom.optionsList.style.display = 'flex';

      const lletres = ['a', 'b', 'c', 'd'];
      let htmlOpcions = '';

      pregunta.opcions.forEach((opcio, idx) => {
        const lletra = lletres[idx];
        htmlOpcions += `
          <li class="option-item">
            <label class="option-label" for="opt-${opcio.id}" id="label-opt-${opcio.id}">
              <input type="radio" name="resposta-pregunta" id="opt-${opcio.id}" value="${opcio.id}" class="option-input" />
              <span class="option-letter" aria-hidden="true">${lletra.toUpperCase()})</span>
              <span class="option-text">${opcio.text}</span>
            </label>
          </li>
        `;
      });

      dom.optionsList.innerHTML = htmlOpcions;

      // Botons d'acció
      dom.btnCheck.style.display = 'inline-flex';
      dom.btnCheck.disabled = true;
      dom.btnRetry.style.display = 'none';
      dom.btnNext.style.display = 'none';

      // Esdeveniments per als radios
      const inputs = dom.optionsList.querySelectorAll('input[type="radio"]');
      inputs.forEach(input => {
        input.addEventListener('change', () => {
          state.opcioSeleccionadaActual = input.value;
          dom.btnCheck.disabled = false;
          dom.optionsList.querySelectorAll('.option-label').forEach(lbl => lbl.classList.remove('selected'));
          const activeLabel = document.getElementById(`label-opt-${input.value}`);
          if (activeLabel) activeLabel.classList.add('selected');
        });
      });

      anunciar(`Pregunta de test ${state.indexPregunta + 1}: ${pregunta.enunciat}`);
    }
  }

  function actualitzarMapaPreguntes() {
    let html = '';
    RECURS_DATA.preguntes.forEach((p, idx) => {
      let estatCls = '';
      let etiquetaEstat = 'Pendent';

      const resp = state.respostes.find(r => r.id === p.id);
      if (resp) {
        if (resp.estat === 'pass-first') {
          estatCls = 'pass-first';
          etiquetaEstat = 'Encertada al 1r intent (10 punts)';
        } else if (resp.estat === 'pass-second') {
          estatCls = 'pass-second';
          etiquetaEstat = 'Encertada al 2n intent amb pista (5 punts)';
        } else if (resp.estat === 'failed') {
          estatCls = 'failed';
          etiquetaEstat = 'Fallada definitiva (0 punts)';
        }
      } else if (idx === state.indexPregunta) {
        estatCls = 'current';
        etiquetaEstat = 'Pregunta actual';
      }

      html += `
        <div class="map-node ${estatCls}" title="Pregunta ${idx + 1}: ${etiquetaEstat}" aria-label="Pregunta ${idx + 1}: ${etiquetaEstat}">
          ${idx + 1}
        </div>
      `;
    });
    dom.questionMap.innerHTML = html;
  }

  /* ==========================================================================
     COMPROVACIÓ PEDAGÒGICA (LÒGICA DELS DOS INTENTS - TEST I ESCRIPTURA)
     ========================================================================== */

  function comprovarResposta() {
    const pregunta = RECURS_DATA.preguntes[state.indexPregunta];
    if (!pregunta) return;

    if (pregunta.format === 'escriure') {
      comprovarRespostaEscrita(pregunta);
    } else {
      comprovarRespostaTest(pregunta);
    }
  }

  function comprovarRespostaTest(pregunta) {
    if (!state.opcioSeleccionadaActual) return;
    const tria = state.opcioSeleccionadaActual;
    const esCorrecta = (tria === pregunta.respostaCorrecta);

    if (state.intentsPreguntaActual === 0) {
      // 1R INTENT
      if (esCorrecta) {
        guardarResultatPregunta(pregunta.id, 'pass-first', 10, tria, null);
        marcarOpcioCorrecta(pregunta.respostaCorrecta);
        desactivarTotesLesOpcions();
        mostrarFeedback('success', '✓ Molt bé! Resposta correcta al primer intent (+10 punts)', pregunta.explicacio);
        dom.btnCheck.style.display = 'none';
        dom.btnNext.style.display = 'inline-flex';
        actualitzarMapaPreguntes();
      } else {
        state.intentsPreguntaActual = 1;
        marcarOpcioIncorrecta(tria);
        desactivarOpcio(tria);
        mostrarFeedback('hint', '💡 Pista pedagògica (1r intent no encertat)', `${pregunta.pista} <br><br><strong>Revisa el text, reflexiona i fes el teu segon intent!</strong>`);
        dom.btnCheck.style.display = 'none';
        dom.btnRetry.style.display = 'inline-flex';
        anunciar(`Primer intent incorrecte. S'ha activat una pista pedagògica.`);
      }
    } else if (state.intentsPreguntaActual === 1) {
      // 2N INTENT
      if (esCorrecta) {
        guardarResultatPregunta(pregunta.id, 'pass-second', 5, null, tria);
        marcarOpcioCorrecta(pregunta.respostaCorrecta);
        desactivarTotesLesOpcions();
        mostrarFeedback('success', '✓ Molt bona feina! Ho has aconseguit amb l\'ajuda de la pista (+5 punts)', pregunta.explicacio);
        dom.btnCheck.style.display = 'none';
        dom.btnRetry.style.display = 'none';
        dom.btnNext.style.display = 'inline-flex';
        actualitzarMapaPreguntes();
      } else {
        guardarResultatPregunta(pregunta.id, 'failed', 0, null, tria);
        marcarOpcioIncorrecta(tria);
        marcarOpcioCorrecta(pregunta.respostaCorrecta);
        desactivarTotesLesOpcions();
        mostrarFeedback('error', '✗ Segon intent no encertat (Fallada)', `La resposta encertada era l'opció destacada en verd. <br><br><strong>Explicació pedagògica:</strong> ${pregunta.explicacio}`);
        dom.btnCheck.style.display = 'none';
        dom.btnRetry.style.display = 'none';
        dom.btnNext.style.display = 'inline-flex';
        actualitzarMapaPreguntes();
      }
    }
  }

  function comprovarRespostaEscrita(pregunta) {
    const textOriginal = dom.inputWriting.value.trim();
    if (!textOriginal) return;

    const normUsuari = normalitzarResposta(textOriginal);
    const esCorrecta = pregunta.respostesAcceptades.some(r => normalitzarResposta(r) === normUsuari);

    if (state.intentsPreguntaActual === 0) {
      // 1R INTENT D'ESCRIPTURA
      if (esCorrecta) {
        guardarResultatPregunta(pregunta.id, 'pass-first', 10, textOriginal, null);
        dom.inputWriting.classList.remove('is-incorrect');
        dom.inputWriting.classList.add('is-correct');
        dom.inputWriting.disabled = true;
        mostrarFeedback(
          'success',
          '✓ Excel·lent! Resposta escrita correcta al primer intent (+10 punts)',
          `<div class="response-comparison"><strong>Resposta model:</strong> ${pregunta.respostaModel}</div><br>${pregunta.explicacio}`
        );
        dom.btnCheck.style.display = 'none';
        dom.btnNext.style.display = 'inline-flex';
        actualitzarMapaPreguntes();
      } else {
        state.intentsPreguntaActual = 1;
        dom.inputWriting.classList.add('is-incorrect');
        mostrarFeedback(
          'hint',
          '💡 Pista pedagògica (1r intent no encertat)',
          `<p>${pregunta.pista}</p><p><em>Has escrit: «${textOriginal}». Revisa el text informatiu i torna-ho a provar!</em></p>`
        );
        dom.btnCheck.style.display = 'none';
        dom.btnRetry.style.display = 'inline-flex';
        anunciar(`Primer intent no encertat. Revisa la pista i torna-ho a intentar.`);
      }
    } else if (state.intentsPreguntaActual === 1) {
      // 2N INTENT D'ESCRIPTURA
      if (esCorrecta) {
        guardarResultatPregunta(pregunta.id, 'pass-second', 5, null, textOriginal);
        dom.inputWriting.classList.remove('is-incorrect');
        dom.inputWriting.classList.add('is-correct');
        dom.inputWriting.disabled = true;
        mostrarFeedback(
          'success',
          '✓ Molt bona feina! Has corregit la resposta amb l\'ajuda de la pista (+5 punts)',
          `<div class="response-comparison"><strong>Resposta model:</strong> ${pregunta.respostaModel}</div><br>${pregunta.explicacio}`
        );
        dom.btnCheck.style.display = 'none';
        dom.btnRetry.style.display = 'none';
        dom.btnNext.style.display = 'inline-flex';
        actualitzarMapaPreguntes();
      } else {
        guardarResultatPregunta(pregunta.id, 'failed', 0, null, textOriginal);
        dom.inputWriting.classList.add('is-incorrect');
        dom.inputWriting.disabled = true;
        mostrarFeedback(
          'error',
          '✗ Segon intent no encertat (Fallada)',
          `<div class="response-comparison">
             <p>❌ La teva resposta: <em>«${textOriginal}»</em></p>
             <p>✅ Resposta esperada: <strong>${pregunta.respostaModel}</strong></p>
           </div>
           <br><strong>Explicació pedagògica:</strong> ${pregunta.explicacio}`
        );
        dom.btnCheck.style.display = 'none';
        dom.btnRetry.style.display = 'none';
        dom.btnNext.style.display = 'inline-flex';
        actualitzarMapaPreguntes();
      }
    }
  }

  function prepararSegonIntent() {
    const pregunta = RECURS_DATA.preguntes[state.indexPregunta];
    dom.btnRetry.style.display = 'none';
    dom.btnCheck.style.display = 'inline-flex';

    if (pregunta && pregunta.format === 'escriure') {
      dom.inputWriting.classList.remove('is-incorrect');
      dom.inputWriting.disabled = false;
      dom.btnCheck.disabled = false;
      dom.inputWriting.focus();
      dom.inputWriting.select();
      anunciar("Corregeix la teva resposta escrita al camp de text i prem Comprova.");
    } else {
      dom.btnCheck.disabled = true;
      state.opcioSeleccionadaActual = null;

      // Deseleccionar els radios actius
      const radios = dom.optionsList.querySelectorAll('input[type="radio"]');
      radios.forEach(r => {
        if (!r.disabled) {
          r.checked = false;
          const lbl = document.getElementById(`label-opt-${r.value}`);
          if (lbl) lbl.classList.remove('selected');
        }
      });
      anunciar("Tria una altra opció per al segon intent i prem Comprova la resposta.");
    }
  }

  function marcarOpcioCorrecta(optId) {
    const lbl = document.getElementById(`label-opt-${optId}`);
    if (lbl) {
      lbl.classList.add('is-correct');
    }
  }

  function marcarOpcioIncorrecta(optId) {
    const lbl = document.getElementById(`label-opt-${optId}`);
    if (lbl) {
      lbl.classList.add('is-incorrect');
    }
  }

  function desactivarOpcio(optId) {
    const input = document.getElementById(`opt-${optId}`);
    const lbl = document.getElementById(`label-opt-${optId}`);
    if (input) input.disabled = true;
    if (lbl) lbl.classList.add('is-disabled');
  }

  function desactivarTotesLesOpcions() {
    const inputs = dom.optionsList.querySelectorAll('input[type="radio"]');
    inputs.forEach(inp => { inp.disabled = true; });
  }

  function mostrarFeedback(tipus, titol, contingutHtml) {
    const cls = tipus === 'hint' ? 'state-hint' : (tipus === 'success' ? 'state-success' : 'state-error');
    dom.feedbackContainer.className = `feedback-box ${cls}`;
    dom.feedbackContainer.innerHTML = `
      <div class="feedback-title">${titol}</div>
      <div class="feedback-text">${contingutHtml}</div>
    `;
    anunciar(`${titol}. ${contingutHtml.replace(/<[^>]*>?/gm, '')}`);
  }

  function guardarResultatPregunta(id, estat, punts, tria1, tria2) {
    const existentIdx = state.respostes.findIndex(r => r.id === id);
    const dada = { id, estat, punts, tria1, tria2 };
    if (existentIdx >= 0) {
      state.respostes[existentIdx] = dada;
    } else {
      state.respostes.push(dada);
    }
    desarSessio();
  }

  function passarSeguentPregunta() {
    state.indexPregunta++;
    desarSessio();

    if (state.indexPregunta < RECURS_DATA.preguntes.length) {
      renderitzarPreguntaActual();
    } else {
      mostrarResultatsFinals();
    }
  }

  /* ==========================================================================
     PANTALLA DE RESULTATS, AVALUACIÓ I DIPLOMA IMPRIMIBLE
     ========================================================================== */

  function mostrarResultatsFinals() {
    aturarVeu();
    dom.viewApp.classList.remove('active');
    dom.viewResults.classList.add('active');

    // Calcular mètriques
    let puntuacioTotal = 0;
    let encertsPrimer = 0;
    let encertsSegon = 0;
    let fallades = 0;

    let puntsLiteral = 0;
    let puntsInferencial = 0;

    RECURS_DATA.preguntes.forEach(p => {
      const resp = state.respostes.find(r => r.id === p.id);
      const punts = resp ? resp.punts : 0;
      puntuacioTotal += punts;

      if (resp) {
        if (resp.estat === 'pass-first') encertsPrimer++;
        else if (resp.estat === 'pass-second') encertsSegon++;
        else fallades++;
      } else {
        fallades++;
      }

      if (p.tipus === 'literal') {
        puntsLiteral += punts;
      } else if (p.tipus === 'inferencial') {
        puntsInferencial += punts;
      }
    });

    // Puntuació
    dom.scoreNumber.textContent = `${puntuacioTotal}/100`;

    let badgeText = "Bona feina!";
    if (puntuacioTotal >= 90) badgeText = "🌟 Excel·lent domini de la Unió Europea!";
    else if (puntuacioTotal >= 70) badgeText = "🎉 Molt bon nivell de comprensió lectora!";
    else if (puntuacioTotal >= 50) badgeText = "👍 Bon esforç! Pots repassar alguns conceptes.";
    else badgeText = "💪 No et rendeixis! Torna a llegir el text i millora el resultat.";

    dom.scoreBadge.textContent = badgeText;

    // Estadístiques
    dom.statFirst.textContent = encertsPrimer;
    dom.statSecond.textContent = encertsSegon;
    dom.statFailed.textContent = fallades;

    // Desglossament de competències (5 preguntes cadascuna = max 50 punts)
    const pctLit = Math.round((puntsLiteral / 50) * 100);
    const pctInf = Math.round((puntsInferencial / 50) * 100);

    dom.barLiteralFill.style.width = `${pctLit}%`;
    dom.valLiteral.textContent = `${puntsLiteral}/50 (${pctLit}%)`;

    dom.barInferentialFill.style.width = `${pctInf}%`;
    dom.valInferential.textContent = `${puntsInferencial}/50 (${pctInf}%)`;

    // Dades del diploma escolar
    dom.diplomaNom.textContent = state.alumne.nom;
    dom.diplomaGrup.textContent = state.alumne.grup;
    const avui = new Date();
    dom.diplomaData.textContent = avui.toLocaleDateString('ca-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    dom.diplomaPuntuacio.textContent = `${puntuacioTotal} punts sobre 100 (${encertsPrimer} encerts directes, ${encertsSegon} amb pista)`;

    anunciar(`Activitat completada. Puntuació obtinguda: ${puntuacioTotal} sobre 100.`);
  }

  /* ==========================================================================
     GENERACIÓ DE DOCUMENT PDF DESCARREGABLE (A4 ESCOLAR)
     ========================================================================== */

  function generarDocumentPDF() {
    // Comprovar si jsPDF està disponible
    const jsPDFLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    if (!jsPDFLib) {
      alert("Generant PDF mitjançant el diàleg del navegador (tria 'Desa com a PDF')...");
      window.print();
      return;
    }

    try {
      const doc = new jsPDFLib({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calcular mètriques de resultats
      let puntuacioTotal = 0;
      let encertsPrimer = 0;
      let encertsSegon = 0;
      let fallades = 0;
      let puntsLiteral = 0;
      let puntsInferencial = 0;

      RECURS_DATA.preguntes.forEach(p => {
        const resp = state.respostes.find(r => r.id === p.id);
        const punts = resp ? resp.punts : 0;
        puntuacioTotal += punts;
        if (resp) {
          if (resp.estat === 'pass-first') encertsPrimer++;
          else if (resp.estat === 'pass-second') encertsSegon++;
          else fallades++;
        } else {
          fallades++;
        }
        if (p.tipus === 'literal') puntsLiteral += punts;
        else puntsInferencial += punts;
      });

      const nomAlumne = state.alumne.nom || 'Alumne/a';
      const grupAlumne = state.alumne.grup || 'Cicle Superior';
      const dataAvui = new Date().toLocaleDateString('ca-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      // 1. CAPÇALERA BLAU OFICIAL UE
      doc.setFillColor(0, 51, 153);
      doc.roundedRect(15, 12, 180, 30, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("CERTIFICAT DE COMPETENCIA LECTORA: LA UNIO EUROPEA", 105, 22, { align: "center" });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text("Activitat interactiva de comprensió lectora i coneixement del medi", 105, 28, { align: "center" });

      doc.setFontSize(8.5);
      doc.text("Cicle Superior d'Educacio Primaria (5e i 6e) • Decret 175/2022", 105, 35, { align: "center" });

      // 2. TARGETA D'IDENTIFICACIÓ DE L'ALUMNE/A
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 46, 180, 32, 2, 2, 'FD');

      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      doc.text("S'atorga el present certificat escolar d'assoliment a:", 105, 53, { align: "center" });

      doc.setTextColor(0, 51, 153);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(nomAlumne, 105, 62, { align: "center" });

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Grup/Curs: ${grupAlumne}   •   Data: ${dataAvui}`, 105, 71, { align: "center" });

      // 3. CAIXES DE PUNTUACIÓ I RESULTATS
      // Caixa 1: Puntuació total
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(15, 82, 56, 20, 2, 2, 'FD');
      doc.setFontSize(8);
      doc.setTextColor(67, 56, 202);
      doc.text("PUNTUACIO GLOBAL", 43, 88, { align: "center" });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`${puntuacioTotal} / 100 punts`, 43, 96, { align: "center" });

      // Caixa 2: Encerts
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(77, 82, 56, 20, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(21, 128, 61);
      doc.text("RESOLUCIO D'INTENTS", 105, 88, { align: "center" });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`1r: ${encertsPrimer}   |   Pista (2n): ${encertsSegon}   |   Rev: ${fallades}`, 105, 96, { align: "center" });

      // Caixa 3: Competències
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(253, 230, 138);
      doc.roundedRect(139, 82, 56, 20, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9);
      doc.text("TIPOLOGIA DE COMPRENSIO", 167, 88, { align: "center" });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`Literal: ${puntsLiteral}/50   •   Inferencial: ${puntsInferencial}/50`, 167, 96, { align: "center" });

      // 4. TAULA DE DESGLOSSAMENT DE LES 10 PREGUNTES
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 51, 153);
      doc.text("Desglossament detallat de l'activitat per preguntes:", 15, 108);

      // Capçalera de la taula
      doc.setFillColor(226, 232, 240);
      doc.rect(15, 111, 180, 6, 'F');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Num. i Concepte clau avaluat", 17, 115);
      doc.text("Format", 100, 115);
      doc.text("Tipus", 125, 115);
      doc.text("Resultat", 152, 115);
      doc.text("Punts", 182, 115);

      const resumPreguntes = [
        { num: "1", titol: "Simbols: Significat 12 estrelles", format: "Test", tipus: "Literal" },
        { num: "2", titol: "Lema: «Units en la diversitat»", format: "Escriure", tipus: "Literal" },
        { num: "3", titol: "Historia: Data del Dia d'Europa", format: "Test", tipus: "Literal" },
        { num: "4", titol: "Economia: Moneda oficial euro (€)", format: "Escriure", tipus: "Literal" },
        { num: "5", titol: "Institucions: Parlament Europeu", format: "Test", tipus: "Literal" },
        { num: "6", titol: "Pau 1950: Carbo i acer compartit", format: "Escriure", tipus: "Inferencial" },
        { num: "7", titol: "Drets: Lliure circulacio Schengen", format: "Test", tipus: "Inferencial" },
        { num: "8", titol: "Valors: Solidaritat en emergencies", format: "Escriure", tipus: "Inferencial" },
        { num: "9", titol: "Avantatges: Erasmus+, Schengen i €", format: "Test", tipus: "Inferencial" },
        { num: "10", titol: "Democracia: Sufragi al Parlament", format: "Test", tipus: "Inferencial" }
      ];

      let posY = 117;
      resumPreguntes.forEach((item, idx) => {
        const resp = state.respostes.find(r => r.id === (idx + 1));
        const punts = resp ? resp.punts : 0;
        let textEstat = "Pendent";
        if (resp) {
          if (resp.estat === 'pass-first') textEstat = "Encert 1r intent";
          else if (resp.estat === 'pass-second') textEstat = "Encert amb pista";
          else textEstat = "Fallada";
        }

        // Fons altern
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, posY, 180, 7.5, 'F');
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);

        doc.text(`${item.num}. ${item.titol}`, 17, posY + 5);
        doc.text(item.format, 100, posY + 5);
        doc.text(item.tipus, 125, posY + 5);

        if (punts === 10) doc.setTextColor(21, 128, 61);
        else if (punts === 5) doc.setTextColor(180, 83, 9);
        else doc.setTextColor(185, 28, 28);

        doc.setFont('helvetica', 'bold');
        doc.text(textEstat, 152, posY + 5);
        doc.text(`+${punts} pts`, 182, posY + 5);

        posY += 7.5;
      });

      // 5. CAIXA D'AVALUACIÓ DOCENT I SIGNATURES
      const yBox = 197;
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, yBox, 180, 78, 2, 2, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 51, 153);
      doc.text("Rubrica competencial i observacions del mestre/a (Decret 175/2022):", 19, yBox + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text("• Comunicacio linguistica (CCL): Localitzacio de dades i redaccio precisa de respostes clau.", 19, yBox + 13);
      doc.text("• Competencia ciutadana (CC): Comprensio dels valors democratics, institucions i drets a la UE.", 19, yBox + 18);
      doc.text("• Aprendre a aprendre (CPSAA): Autoregulacio de l'error mitjancant pistes didactiques reflexives.", 19, yBox + 23);

      doc.setFont('helvetica', 'bold');
      doc.text("Observacions docents:", 19, yBox + 30);
      doc.setDrawColor(226, 232, 240);
      doc.line(19, yBox + 36, 191, yBox + 36);
      doc.line(19, yBox + 42, 191, yBox + 42);
      doc.line(19, yBox + 48, 191, yBox + 48);

      // Signatura i segell
      doc.setDrawColor(148, 163, 184);
      doc.line(30, yBox + 67, 85, yBox + 67);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Signatura del mestre/a", 57, yBox + 72, { align: "center" });

      doc.line(125, yBox + 67, 175, yBox + 67);
      doc.text("Segell del centre escolar", 150, yBox + 72, { align: "center" });

      // 6. PEU DE PÀGINA
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Recurs educatiu obert • Llengua Catalana i Medi Social • WCAG 2.1 AA • Processament local RGPD", 105, 287, { align: "center" });

      // DESCARREGAR EL FITXER PDF
      const nomNet = nomAlumne.toLowerCase().replace(/[^a-z0-9]/g, '_');
      doc.save(`Diploma_UE_${nomNet}.pdf`);
      anunciar("S'ha descarregat el document PDF amb el teu certificat i informe d'aprenentatge.");
    } catch (err) {
      console.error("Error generant el document PDF:", err);
      alert("S'ha produït un error en generar el PDF directe. S'obrirà el diàleg d'impressió del navegador.");
      window.print();
    }
  }

  /* ==========================================================================
     GESTIÓ DE MODALS ACCESSIBLES
     ========================================================================== */

  let elementAnteriorFocus = null;

  function obrirModal(modal) {
    elementAnteriorFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Moure el focus al primer element interactiu o títol
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();

    // Tancar amb tecla Escape
    function tractarEscape(e) {
      if (e.key === 'Escape') {
        tancarModal(modal);
        window.removeEventListener('keydown', tractarEscape);
      }
    }
    window.addEventListener('keydown', tractarEscape);
  }

  function tancarModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    aturarVeu();
    if (elementAnteriorFocus) {
      elementAnteriorFocus.focus();
    }
  }

  /* ==========================================================================
     VISTES I CONTROL DE NAVEGACIÓ
     ========================================================================== */

  function mostrarVistaAuth() {
    dom.viewAuth.classList.add('active');
    dom.viewApp.classList.remove('active');
    dom.viewResults.classList.remove('active');
  }

  function mostrarVistaApp() {
    dom.viewAuth.classList.remove('active');
    dom.viewApp.classList.add('active');
    dom.viewResults.classList.remove('active');

    dom.badgeAlumne.textContent = `${state.alumne.nom} (${state.alumne.grup})`;
    renderitzarPreguntaActual();
  }

  /* ==========================================================================
     REGISTRE D'ESDEVENIMENTS D'INTERFÍCIE
     ========================================================================== */

  function registrarEsdeveniments() {
    // Formulari d'identificació
    dom.formAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = dom.inputNom.value.trim();
      const grup = dom.selectGrup.value;

      if (!nom) {
        alert("Si us plau, escriu el teu nom o àlies escolar.");
        dom.inputNom.focus();
        return;
      }

      state.alumne = { nom, grup };
      state.indexPregunta = 0;
      state.respostes = [];
      desarSessio();
      mostrarVistaApp();
    });

    // Botó Comprova
    dom.btnCheck.addEventListener('click', comprovarResposta);

    // Esdeveniments per al camp d'escriptura
    if (dom.inputWriting) {
      dom.inputWriting.addEventListener('input', () => {
        const val = dom.inputWriting.value.trim();
        dom.btnCheck.disabled = (val.length === 0);
      });

      dom.inputWriting.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!dom.btnCheck.disabled && dom.btnCheck.style.display !== 'none') {
            comprovarResposta();
          }
        }
      });
    }

    // Botó Reintentar (2n intent amb pista)
    dom.btnRetry.addEventListener('click', prepararSegonIntent);

    // Botó Següent pregunta
    dom.btnNext.addEventListener('click', passarSeguentPregunta);

    // TTS per a la pregunta actual
    dom.btnTtsQuestion.addEventListener('click', () => {
      const p = RECURS_DATA.preguntes[state.indexPregunta];
      if (p) {
        let textALlegir = `${p.tipusNom}. ${p.enunciat}. `;
        if (p.format === 'escriure') {
          textALlegir += "Escriu la teva resposta al requadre de text i prem comprova.";
        } else if (p.opcions) {
          textALlegir += "Les opcions són: ";
          const lletres = ['A', 'B', 'C', 'D'];
          p.opcions.forEach((o, i) => {
            textALlegir += `${lletres[i]}: ${o.text}. `;
          });
        }
        llegirText(textALlegir);
      }
    });

    // Aturar veu global
    dom.btnStopSpeech.addEventListener('click', () => {
      aturarVeu();
      anunciar("Veu aturada");
    });

    // Accessibilitat: controls de font i contrast
    dom.btnFontDec.addEventListener('click', () => canviarMidaFont(-1));
    dom.btnFontInc.addEventListener('click', () => canviarMidaFont(1));
    dom.btnDyslexia.addEventListener('click', toggleDyslexia);
    dom.btnContrast.addEventListener('click', toggleContrast);

    // Modals: Obertura i tancament
    dom.btnOpenGlossary.addEventListener('click', () => obrirModal(dom.modalGlossary));
    dom.btnOpenTeacher.addEventListener('click', () => obrirModal(dom.modalTeacher));

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) tancarModal(modal);
      });
    });

    // Tancar fent clic al fons del modal
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          tancarModal(modal);
        }
      });
    });

    // Pestanyes mòbils (Text vs Qüestionari)
    dom.tabReading.addEventListener('click', () => {
      dom.tabReading.setAttribute('aria-selected', 'true');
      dom.tabQuiz.setAttribute('aria-selected', 'false');
      dom.readingPanel.classList.remove('panel-hidden-mobile');
      dom.quizPanel.classList.add('panel-hidden-mobile');
    });

    dom.tabQuiz.addEventListener('click', () => {
      dom.tabQuiz.setAttribute('aria-selected', 'true');
      dom.tabReading.setAttribute('aria-selected', 'false');
      dom.quizPanel.classList.remove('panel-hidden-mobile');
      dom.readingPanel.classList.add('panel-hidden-mobile');
    });

    // Impressió i descàrrega de diploma
    if (dom.btnDownloadPdf) {
      dom.btnDownloadPdf.addEventListener('click', generarDocumentPDF);
    }

    dom.btnPrintDiploma.addEventListener('click', () => {
      window.print();
    });

    // Reiniciar activitat
    dom.btnRestart.addEventListener('click', () => {
      if (confirm("Vols tornar a fer el qüestionari des de la primera pregunta?")) {
        state.indexPregunta = 0;
        state.respostes = [];
        desarSessio();
        mostrarVistaApp();
      }
    });

    // Esborrar dades
    dom.btnClearData.addEventListener('click', esborrarDades);
  }

  // Execució quan el DOM està a punt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
