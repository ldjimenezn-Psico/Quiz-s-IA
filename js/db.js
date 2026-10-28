/**
 * NeuroExplore - Motor de Base de Datos Local (NeuroDB)
 * Almacena el catálogo anatómico, banco de preguntas, casos clínicos
 * y registra el progreso del estudiante (persistencia vía Web Storage).
 */

const SEED_DATA = {
  regions: [
    {
      id: "frontal",
      name: "Lóbulo Frontal",
      latin: "Lobus frontalis",
      colorHex: "#087F8C",
      borderHex: "#044D55",
      badgeClass: "bg-teal-100 text-teal-800 border-teal-300",
      brodmann: "Áreas 4, 6, 8, 9, 10, 11, 44, 45, 46, 47",
      division: "Telencéfalo Cortical Anterior",
      metaphor: {
        icon: "psychology",
        title: "El Director de Orquesta Ejecutiva",
        desc: "Planifica metas complejas, inhibe impulsos inmediatos, modula el juicio moral y organiza la articulación fluida del habla."
      },
      location: "Ocupa la fosa craneal anterior, extendiéndose desde el polo frontal hasta el surco central (cisura de Rolando) y por encima de la cisura lateral (de Silvio).",
      functions: [
        {
          title: "Funciones Ejecutivas de Orden Superior",
          desc: "Planificación de secuencias, memoria de trabajo, flexibilidad cognitiva y autorregulación (Corteza Prefrontal Dorsolateral - DLPFC).",
          icon: "account_tree"
        },
        {
          title: "Producción Motora del Lenguaje",
          desc: "Programación fonológica y coordinación motriz de la emisión del habla verbal (Área de Broca, BA 44/45 en hemisferio dominante).",
          icon: "record_voice_over"
        },
        {
          title: "Motricidad Somática Voluntaria",
          desc: "Inicio y ejecución del movimiento corporal voluntario organizado topográficamente en el Homúnculo Motor (Área 4 de Brodmann).",
          icon: "directions_run"
        },
        {
          title: "Control Inhibitorio y Juicio Ético-Social",
          desc: "Freno de respuestas impulsivas primitivas, empatía social y anticipación de consecuencias conductuales (Corteza Orbitofrontal y Ventromedial).",
          icon: "balance"
        }
      ],
      alterations: {
        syndrome: "Síndrome Disejecutivo y Cambios de Personalidad",
        paradigm: "Caso Histórico Phineas Gage (1848)",
        symptoms: [
          "Desinhibición conductual, falta de tacto social, impulsividad e hiperreactividad emocional (daño orbitofrontal).",
          "Apatía severa, abulia, falta de iniciativa motora e indiferencia afectiva (daño dorsolateral o del cíngulo anterior).",
          "Afasia motora de Broca: comprensión preservada pero habla no fluida, trabajosa, con agramatismo y esfuerzo articulatorio.",
          "Perseveración cognitiva: incapacidad de cambiar de regla o corregir conductas erróneas aprendidas (falla en test de Wisconsin)."
        ],
        clinicalExplanation: "Una lesión en el lóbulo frontal no suele causar pérdida sensorial primaria, sino la pérdida del control ejecutivo: el paciente 'sabe' lo que debe hacer pero no puede organizarlo ni frenar sus impulsos."
      }
    },
    {
      id: "parietal",
      name: "Lóbulo Parietal",
      latin: "Lobus parietalis",
      colorHex: "#3156C8",
      borderHex: "#1C3586",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
      brodmann: "Áreas 1, 2, 3, 5, 7, 39, 40",
      division: "Telencéfalo Cortical Dorsal",
      metaphor: {
        icon: "explore",
        title: "El Mapa Espacial y Sensorial",
        desc: "Integra sensaciones corporales táctiles y propioceptivas, construye el esquema corporal 3D y organiza la atención en el espacio circundante."
      },
      location: "Situado detrás del surco central (de Rolando), por encima del lóbulo temporal y separado del lóbulo occipital por la línea parieto-occipital.",
      functions: [
        {
          title: "Procesamiento Somatosensorial Primario",
          desc: "Recepción de sensibilidad somática (tacto, temperatura, vibración, dolor y propiocepción) representada en el Homúnculo Sensorial (Áreas 1, 2, 3).",
          icon: "touch_app"
        },
        {
          title: "Atención Visuoespacial y Coordenadas",
          desc: "Localización de objetos en el espacio tridimensional y dirección de la atención consciente hacia estímulos ambientales (Lóbulo parietal posterior).",
          icon: "radar"
        },
        {
          title: "Esquema Corporal y Praxias",
          desc: "Conciencia del propio cuerpo en el espacio y programación de actos motores coordinados con objetos (Giro supramarginal, BA 40).",
          icon: "accessibility_new"
        },
        {
          title: "Cálculo Numérico y Lectoescritura",
          desc: "Procesamiento numérico abstracto, resolución matemática y transducción grafema-fonema (Giro angular, BA 39).",
          icon: "calculate"
        }
      ],
      alterations: {
        syndrome: "Heminegligencia Unilateral y Síndrome de Gerstmann",
        paradigm: "Caso Clínico de Desatención Espacial Izquierda",
        symptoms: [
          "Heminegligencia espacial (lesión parietal derecha): El paciente ignora totalmente el lado izquierdo del mundo y de su propio cuerpo (no come del lado izquierdo del plato, no dibuja el lado izquierdo de los objetos).",
          "Anosognosia: Negación absoluta de la propia enfermedad o déficit neurológico.",
          "Síndrome de Gerstmann (lesión angular izquierda): Acalculia (pérdida de la capacidad de calcular), agnosia digital (no reconoce sus propios dedos), desorientación derecha-izquierda y agrafia.",
          "Apraxia constructiva: Incapacidad de copiar figuras geométricas o ensamblar bloques espaciales."
        ],
        clinicalExplanation: "La corteza parietal derecha es dominante para la atención espacial bilateral. Su lesión hace que la mitad izquierda del universo desaparezca de la mente del paciente."
      }
    },
    {
      id: "temporal",
      name: "Lóbulo Temporal",
      latin: "Lobus temporalis",
      colorHex: "#059669",
      borderHex: "#046A4A",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      brodmann: "Áreas 20, 21, 22, 41, 42, 37, 28, 38",
      division: "Telencéfalo Cortical Inferolateral",
      metaphor: {
        icon: "hearing",
        title: "La Fonoteca y el Archivo de Recuerdos",
        desc: "Decodifica el significado del lenguaje oral, procesa la percepción auditiva y consolida la memoria de nuevos aprendizajes en el hipocampo."
      },
      location: "Ocupa la fosa craneal media, delimitado superiormente por la profunda cisura lateral (de Silvio) e inferiormente por la base del cráneo.",
      functions: [
        {
          title: "Comprensión del Lenguaje Verbal",
          desc: "Decodificación semántica del habla escuchada y asociación fonema-concepto (Área de Wernicke, BA 22 posterior en hemisferio dominante).",
          icon: "forum"
        },
        {
          title: "Consolidación de la Memoria Episódica",
          desc: "Transferencia de memorias conscientes a corto plazo hacia almacenamiento a largo plazo (Hipocampo medial y corteza entorrinal).",
          icon: "history_edu"
        },
        {
          title: "Corteza Auditiva Primaria",
          desc: "Percepción de tonos, frecuencias y ritmos acústicos (Giros de Heschl, BA 41 y 42).",
          icon: "volume_up"
        },
        {
          title: "Reconocimiento Visual de Formas y Rostros",
          desc: "Identificación de '¿qué es el objeto?' y discriminación de caras humanas (Giro fusiforme y vía ventral 'What', BA 37).",
          icon: "face"
        }
      ],
      alterations: {
        syndrome: "Afasia Sensorial de Wernicke y Amnesia Anterógrada",
        paradigm: "Caso Histórico Henry Molaison (H.M.)",
        symptoms: [
          "Afasia de Wernicke: Habla fluida a velocidad normal pero carente de sentido (jergafasia o 'ensalada de palabras'), con grave alteración de la comprensión auditiva.",
          "Amnesia anterógrada severa (daño bilateral de hipocampos): Imposibilidad de fijar recuerdos nuevos (olvida a personas a los 5 minutos), aunque la memoria remota y el aprendizaje motor procedimental quedan intactos.",
          "Prosopagnosia (daño fusiforme temporal inferior): Dificultad para reconocer rostros de seres queridos o el propio en el espejo.",
          "Agnosia auditiva: Oye sonidos pero no logra identificar su significado (ej. timbre de puerta, alarma)."
        ],
        clinicalExplanation: "El lóbulo temporal conecta lo que oímos y vemos con el significado y la memoria biográfica. Sin él, el mundo conserva sus formas pero pierde su sentido y continuidad temporal."
      }
    },
    {
      id: "occipital",
      name: "Lóbulo Occipital",
      latin: "Lobus occipitalis",
      colorHex: "#7957C8",
      borderHex: "#523696",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
      brodmann: "Áreas 17, 18, 19",
      division: "Telencéfalo Cortical Posterior",
      metaphor: {
        icon: "visibility",
        title: "El Procesador Gráfico y Visual",
        desc: "Transforma las señales lumínicas retinianas en imágenes conscientes: formas, bordes, colores, profundidad y movimiento visual."
      },
      location: "Constituye el polo posterior del hemisferio cerebral, apoyándose sobre la tienda del cerebelo (tentorio) en la fosa posterior.",
      functions: [
        {
          title: "Corteza Visual Primaria (V1 - Estriada)",
          desc: "Recepción directa de aferencias visuales retinianas vía cuerpo geniculado lateral del tálamo; mapa retinotópico del campo visual (Área 17 de Brodmann).",
          icon: "center_focus_strong"
        },
        {
          title: "Detección de Movimiento y Orientación",
          desc: "Diferenciación de líneas, bordes, contrastes lumínicos y velocidad de desplazamiento de objetos (Áreas 18 y 19, V2-V5).",
          icon: "animation"
        },
        {
          title: "Procesamiento Cromático (V4)",
          desc: "Asignación y percepción consciente de la gama de colores visuales del entorno.",
          icon: "palette"
        },
        {
          title: "Bifurcación de Vías Visuales",
          desc: "Envío de información hacia la vía dorsal parietal ('¿Dónde?') y hacia la vía ventral temporal ('¿Qué?').",
          icon: "alt_route"
        }
      ],
      alterations: {
        syndrome: "Ceguera Cortical y Agnosias Visuales",
        paradigm: "Síndrome de Anton-Babinski",
        symptoms: [
          "Ceguera cortical total o parcial: Pérdida de visión por daño bilateral de V1, a pesar de que los ojos y pupilas se encuentran biológicamente sanos.",
          "Hemianopsia homónima: Pérdida completa de la mitad derecha o izquierda del campo visual de ambos ojos tras lesión unilateral en la cisura calcarina.",
          "Síndrome de Anton: El paciente ciego niega rotundamente su ceguera y confabula descripciones de lo que cree estar viendo.",
          "Acromatopsia cerebral (daño en área V4): El paciente ve el mundo enteramente en tonos de gris, sin poder distinguir colores."
        ],
        clinicalExplanation: "Los ojos captan la luz, pero es el lóbulo occipital el que 'crea' la visión consciente. Si se destruye V1, los ojos funcionan pero el cerebro no procesa ninguna imagen."
      }
    },
    {
      id: "cerebelo",
      name: "Cerebelo",
      latin: "Cerebellum ('Pequeño Cerebro')",
      colorHex: "#BE123C",
      borderHex: "#880D2B",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
      brodmann: "Arquicerebelo, Paleocerebelo, Neocerebelo",
      division: "Rombencéfalo Metencefálico",
      metaphor: {
        icon: "balance",
        title: "El Calibrador y Estabilizador Motor",
        desc: "Compara el movimiento deseado con el ejecutado real, corrigiendo la trayectoria, la fuerza, la postura y el equilibrio en tiempo real."
      },
      location: "Situado en la fosa craneal posterior, inmediatamente detrás de la protuberancia (puente) y del bulbo raquídeo, por debajo de los lóbulos occipitales.",
      functions: [
        {
          title: "Coordinación de Movimientos Voluntarios",
          desc: "Sincronización suave y armónica de grupos musculares agonistas y antagonistas para evitar movimientos torpes o bruscos.",
          icon: "sports_gymnastics"
        },
        {
          title: "Control del Equilibrio y Tono Postural",
          desc: "Mantenimiento de la postura erecta en contra de la gravedad en estrecha coordinación con el sistema vestibular del oído interno.",
          icon: "self_improvement"
        },
        {
          title: "Aprendizaje Motor Procedimental",
          desc: "Automatización de habilidades motoras complejas (andar en bicicleta, tocar instrumentos, escribir a máquina con fluidez).",
          icon: "pedal_bike"
        },
        {
          title: "Modulación Cognitiva y Afectiva",
          desc: "Contribución al ritmo del lenguaje y modulación de procesos ejecutivos y atencionales (Síndrome cognitivo afectivo cerebeloso).",
          icon: "auto_mode"
        }
      ],
      alterations: {
        syndrome: "Síndrome Atáxico Cerebeloso",
        paradigm: "Marcha Atáxica y Dismetría",
        symptoms: [
          "Ataxia de la marcha: Caminata inestable y oscilante con aumento de la base de sustentación ('marcha de ebrio'), con caídas frecuentes.",
          "Dismetría: Incapacidad de medir distancias; el paciente sobrepasa o se queda corto al intentar tocar un blanco con el dedo (prueba dedo-nariz).",
          "Disdiadococinesia: Dificultad o imposibilidad de ejecutar movimientos alternantes rápidos (como girar rápidamente las palmas arriba y abajo).",
          "Temblor de acción o intencional: El temblor empeora a medida que la mano se acerca al objeto deseado."
        ],
        clinicalExplanation: "El cerebelo no genera la fuerza (no produce parálisis directa), sino la sincronización y la calibración. Sin él, los movimientos se vuelven fragmentados, bruscos e inestables."
      }
    },
    {
      id: "tronco",
      name: "Tronco Encefálico",
      latin: "Truncus encephali",
      colorHex: "#0284C7",
      borderHex: "#0369A1",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
      brodmann: "Mesencéfalo, Protuberancia (Puente), Bulbo Raquídeo",
      division: "Eje Troncal Rombencefálico y Mesencefálico",
      metaphor: {
        icon: "bolt",
        title: "La Central Vital y de Alerta",
        desc: "Sustenta los centros autónomos que mantienen la vida humana (respiración, pulso cardíaco) y enciende la corteza cerebral a través del sistema de vigilia."
      },
      location: "Base del encéfalo, comunicando directamente el cerebro y el cerebelo con la médula espinal a través del agujero magno occipital.",
      functions: [
        {
          title: "Centro de Regulación Vital Autónomo",
          desc: "Control involuntario de la frecuencia cardíaca, vasoconstricción, ritmo respiratorio, reflejo de deglución y vómito (Centros del bulbo raquídeo).",
          icon: "monitor_heart"
        },
        {
          title: "Sistema Activador Reticular Ascendente (SARA)",
          desc: "Red difusa neuronal que proyecta impulsos excitatorios a la corteza para sostener el estado de vigilia, alerta y atención consciente.",
          icon: "wb_sunny"
        },
        {
          title: "Origen de los Pares Craneales (III al XII)",
          desc: "Control de movimientos oculares, sensibilidad facial, motricidad orofacial, audición vestibular y fonación.",
          icon: "cable"
        },
        {
          title: "Vías Ascendentes y Descendentes",
          desc: "Autopista de fascículos motores (vía corticoespinal) y sensitivos (lemnisco medial) que cruzan información entre cuerpo y encéfalo.",
          icon: "sync_alt"
        }
      ],
      alterations: {
        syndrome: "Coma, Falla Respiratoria y Síndrome de Enclaustramiento",
        paradigm: "Síndrome de Enclaustramiento (Locked-in Syndrome)",
        symptoms: [
          "Depresión severa del estado de conciencia: Estupor o coma irreversible por afectación de la formación reticular (SARA).",
          "Paro respiratorio autónomo: Pérdida del reflejo de respiración involuntaria automática (daño bulbar).",
          "Síndrome de Enclaustramiento (infarto ventral pontino): Parálisis motora total de los 4 miembros y musculatura facial, conservando la conciencia y únicamente movimientos oculares verticales.",
          "Alteraciones de pares craneales: Diplopía (visión doble), ptosis palpebral, parálisis facial periférica o disfagia (dificultad para deglutir)."
        ],
        clinicalExplanation: "El tronco encefálico sostiene la vida biológica y enciende la 'bombilla' de la conciencia. Una lesión aquí puede desconectar la corteza o amenazar la supervivencia inmediata."
      }
    }
  ],

  questions: [
    {
      id: "q1",
      regionId: "frontal",
      question: "¿Qué estructura cerebral alberga el Área de Broca, responsable principal de la programación motora para la articulación del habla?",
      options: [
        "Lóbulo Parietal (Giro angular)",
        "Lóbulo Frontal (Giro frontal inferior, BA 44/45)",
        "Lóbulo Temporal (Giro temporal superior)",
        "Cerebelo (Lóbulo posterior)"
      ],
      correctAnswer: 1,
      optionFeedback: [
        "El Lóbulo Parietal se encarga del procesamiento somatosensorial (tacto, dolor) y la orientación en el espacio, no de la programación motora del habla.",
        "El Lóbulo Frontal alberga el Área de Broca (giro frontal inferior, BA 44/45), centro que programa y coordina los movimientos musculares necesarios para articular las palabras.",
        "El Lóbulo Temporal se encarga de la comprensión auditiva del lenguaje (Área de Wernicke) y de la memoria, pero no de la emisión y articulación motora de las palabras.",
        "El Cerebelo calibra la precisión y el equilibrio motriz general, pero no contiene los centros corticales para organizar el habla humana."
      ],
      correctExplanation: "El Área de Broca reside en el Lóbulo Frontal (giro frontal inferior del hemisferio dominante) y es la estructura especializada en secuenciar y activar los patrones motores para que podamos hablar con fluidez.",
      difficulty: "Básico"
    },
    {
      id: "q2",
      regionId: "temporal",
      question: "Un estudiante sufre un traumatismo que le impide consolidar nuevos recuerdos (amnesia anterógrada). ¿En qué lóbulo reside el hipocampo, estructura clave para esta función?",
      options: [
        "Lóbulo Occipital",
        "Lóbulo Frontal",
        "Lóbulo Temporal",
        "Tronco Encefálico"
      ],
      correctAnswer: 2,
      optionFeedback: [
        "El Lóbulo Occipital está dedicado exclusivamente al procesamiento de estímulos visuales (formas, colores, movimiento), no a la formación de recuerdos.",
        "El Lóbulo Frontal gestiona la memoria de trabajo inmediata y la planificación ejecutiva, pero no la consolidación de nuevos recuerdos a largo plazo.",
        "En la cara medial del Lóbulo Temporal se localiza la formación hipocampal y la corteza entorrinal, indispensables para transferir recuerdos recientes a la memoria a largo plazo.",
        "El Tronco Encefálico regula las funciones autónomas vitales (respiración, pulso cardíaco) y el nivel de vigilia, pero no participa en la consolidación mnésica."
      ],
      correctExplanation: "El hipocampo se encuentra en el Lóbulo Temporal medial. Es la 'puerta de entrada' que consolida y fija los recuerdos nuevos; sin él, el paciente queda atrapado en el presente (amnesia anterógrada).",
      difficulty: "Básico"
    },
    {
      id: "q3",
      regionId: "parietal",
      question: "¿Cuál es la consecuencia típica de una lesión extensa en la corteza parietal posterior del hemisferio derecho?",
      options: [
        "Heminegligencia visuoespacial izquierda (el paciente desatiende el lado izquierdo del espacio)",
        "Ceguera total de ambos ojos (amaurosis bilateral)",
        "Afasia motora fluida con parafasias fonémicas",
        "Ataxia cerebelosa con marcha inestable"
      ],
      correctAnswer: 0,
      optionFeedback: [
        "La corteza parietal derecha orienta y distribuye la atención en el espacio tridimensional. Su lesión desconecta la atención del lado contralateral, provocando que el paciente ignore todo el hemiespacio izquierdo.",
        "La ceguera total se originaría por un daño en ambos ojos, en los nervios ópticos o en la corteza visual occipital primaria, no en la corteza parietal.",
        "Las afasias corresponden a lesiones en las áreas del lenguaje (frontal para Broca o temporal para Wernicke), no a la corteza parietal posterior derecha.",
        "La marcha atáxica e inestable es una manifestación característica de disfunción en el cerebelo, no de una alteración parietal."
      ],
      correctExplanation: "El Lóbulo Parietal derecho es el encargado de construir el mapa atencional y el esquema corporal. Su daño produce heminegligencia visuoespacial, donde la mitad izquierda del mundo deja de existir en la conciencia del paciente.",
      difficulty: "Intermedio"
    },
    {
      id: "q4",
      regionId: "cerebelo",
      question: "Si una persona presenta marcha tambaleante 'de ebrio', incapacidad para tocarse la punta de la nariz con precisión (dismetría) y temblor al acercar la mano, ¿qué estructura presenta disfunción?",
      options: [
        "Tronco Encefálico",
        "Lóbulo Occipital",
        "Cerebelo",
        "Lóbulo Parietal"
      ],
      correctAnswer: 2,
      optionFeedback: [
        "Una lesión del Tronco Encefálico provocaría alteraciones en pares craneales (visión doble, dificultad para tragar) o coma, no un síndrome de descoordinación motora pura con dismetría.",
        "El Lóbulo Occipital procesa la visión; un daño allí generaría pérdida de campo visual o agnosias, pero no fallas en la coordinación y equilibrio motriz.",
        "El Cerebelo es el órgano de calibración, métrica y sincronización de los movimientos corporales voluntarios. Su daño provoca marcha atáxica y dismetría dedo-nariz.",
        "El Lóbulo Parietal procesa sensaciones táctiles y orientación espacial, pero no calibra la suavidad ni la amortiguación del movimiento fino."
      ],
      correctExplanation: "El Cerebelo funciona como el estabilizador y corrector de trayectoria de los movimientos en tiempo real. Cuando falla, no hay parálisis, pero los movimientos se vuelven torpes, fragmentados y tambaleantes (ataxia y dismetría).",
      difficulty: "Intermedio"
    },
    {
      id: "q5",
      regionId: "occipital",
      question: "Un paciente conserva pupilas reactivas y ojos anatómicamente sanos, pero declara no ver nada tras un infarto bilateral en la cisura calcarina. ¿Qué cuadro clínico presenta?",
      options: [
        "Afasia global",
        "Ceguera cortical por afectación del Lóbulo Occipital (Área 17 / V1)",
        "Síndrome de Gerstmann por alteración parietal",
        "Apraxia ideomotora frontal"
      ],
      correctAnswer: 1,
      optionFeedback: [
        "La afasia global es una pérdida masiva de la comprensión y producción del lenguaje por daño frontotemporal extenso, no produce pérdida de la visión.",
        "La cisura calcarina en el Lóbulo Occipital alberga la corteza visual primaria (V1). Si se destruye bilateralmente, los ojos siguen captando luz pero el cerebro es incapaz de generar la imagen consciente (ceguera cortical).",
        "El Síndrome de Gerstmann se origina por lesión en el giro angular parietal (acalculia, agnosia digital), no cursa con ceguera.",
        "La apraxia ideomotora es la incapacidad de ejecutar gestos voluntarios por orden (como despedirse o peinarse), no una afectación del sistema visual."
      ],
      correctExplanation: "Los ojos capturan la luz del entorno, pero la visión consciente ocurre en la corteza estriada (V1) del Lóbulo Occipital. Si se daña V1 de ambos lados, el paciente experimenta ceguera cortical a pesar de tener ojos intactos.",
      difficulty: "Intermedio"
    },
    {
      id: "q6",
      regionId: "tronco",
      question: "¿Qué sistema neuronal localizado en el tronco encefálico es responsable de mantener encendida la corteza cerebral en estado de vigilia y alerta?",
      options: [
        "Sistema Activador Reticular Ascendente (SARA)",
        "Homúnculo de Penfield",
        "Cuerpo Calloso dorsal",
        "Fascículo Arqueado"
      ],
      correctAnswer: 0,
      optionFeedback: [
        "El SARA está formado por núcleos reticulares del Tronco Encefálico que proyectan señales excitatorias a la corteza cerebral para mantener el estado de vigilia, alerta y atención consciente.",
        "El Homúnculo de Penfield es un mapa somatotópico motor y sensitivo ubicado en las cortezas frontal y parietal, no un sistema de alerta.",
        "El Cuerpo Calloso es el haz de fibras comisurales que comunica el hemisferio izquierdo con el derecho, no regula los ciclos de vigilia y sueño.",
        "El Fascículo Arqueado es la vía subcortical que conecta las áreas del lenguaje de Broca y Wernicke, sin relación con el estado de alerta general."
      ],
      correctExplanation: "El SARA (Sistema Activador Reticular Ascendente) se sitúa en el Tronco Encefálico y actúa como el 'interruptor' que enciende la corteza cerebral. Su alteración puede inducir desde somnolencia profunda hasta coma irreversible.",
      difficulty: "Avanzado"
    }
  ],

  cases: [
    {
      id: "caso-01",
      number: "01",
      title: "Pérdida de la Fluidez del Habla",
      patient: "Carlos B. (62 años)",
      history: "Acude a consulta traído por su hija tras un accidente cerebrovascular. Carlos comprende con perfecta claridad todo lo que se le dice y asiente con la cabeza ante instrucciones complejas. Sin embargo, cuando intenta responder verbalmente, apenas puede pronunciar palabras aisladas ('yo... querer... agua...'), con evidente esfuerzo muscular y frustración.",
      symptoms: [
        "Comprensión auditiva preservada (obedece órdenes)",
        "Habla no fluida, laboriosa y con reducción drástica del vocabulario",
        "Agramatismo (emite palabras sueltas sin conectores gramaticales)",
        "Leve debilidad motora en hemicuerpo derecho facial y braquial"
      ],
      correctRegionId: "frontal",
      syndromeName: "Afasia Motora de Broca",
      explanation: "El cuadro corresponde a una Afasia de Broca, provocada por una lesión isquémica en el giro frontal inferior del Lóbulo Frontal izquierdo. La corteza prefrontal motora organiza los patrones fonológicos de salida; al estar dañada, el paciente comprende el significado (temporal intacto) pero no puede coordinar el aparato motor para emitir oraciones fluidas.",
      differentialFeedback: {
        temporal: "El Lóbulo Temporal causaría alteraciones en la comprensión auditiva (afasia de Wernicke) con habla fluida e incoherente, pero Carlos comprende perfectamente y su problema radica en la articulación motora.",
        parietal: "El Lóbulo Parietal causaría alteraciones visuoespaciales, apraxias o pérdida sensitiva táctil, no una reducción motora del habla con esfuerzo articulatorio.",
        occipital: "El Lóbulo Occipital causaría fallas visuales (ceguera o agnosias), sin afectar la producción del lenguaje hablado.",
        cerebelo: "El Cerebelo causaría disartria motora por falta de coordinación de los músculos orofaciales, pero sin el agramatismo ni la reducción de vocabulario típica de Broca.",
        tronco: "Una lesión troncal provocaría anartria total por parálisis de pares craneales bulbares o compromiso de conciencia, no una afasia cortical selectiva."
      }
    },
    {
      id: "caso-02",
      number: "02",
      title: "El Paciente que Olvidó el Presente",
      patient: "Elena M. (45 años)",
      history: "Tras recuperarse de una encefalitis herpética con daño bitemporal, Elena puede recordar vívidamente detalles de su infancia, sus estudios universitarios y eventos ocurridos hace más de cinco años. Sin embargo, no recuerda lo que desayunó hace 20 minutos, y si el neuropsicólogo sale del consultorio por 3 minutos, al volver Elena lo saluda como si jamás lo hubiese visto.",
      symptoms: [
        "Memoria remota y autobiográfica antigua preservada",
        "Amnesia anterógrada severa (incapacidad total de consolidar recuerdos nuevos)",
        "Memoria de trabajo inmediata normal (puede repetir números de inmediato)",
        "Desorientación temporal constante (no sabe qué año ni mes es)"
      ],
      correctRegionId: "temporal",
      syndromeName: "Amnesia Anterógrada / Daño Hipocampal",
      explanation: "El síntoma clave es la incapacidad de consolidar memoria declarativa episódica a largo plazo, característica del daño bilateral en la cara medial del Lóbulo Temporal (complejo hipocampal). El hipocampo actúa como el 'puente' que transfiere la información temporal a la corteza asociativa.",
      differentialFeedback: {
        frontal: "El Lóbulo Frontal causaría fallas en memoria de trabajo inmediata (dígitos inversos) y funciones ejecutivas, pero la fijación permanente de nuevos recuerdos depende del hipocampo temporal.",
        parietal: "El Lóbulo Parietal causaría desatención espacial o acalculia, pero no una amnesia anterógrada episódica pura.",
        occipital: "El Lóbulo Occipital procesa la visión; no almacena ni consolida recuerdos autobiográficos.",
        cerebelo: "El Cerebelo modula el aprendizaje motor procedimental (andar en bici), pero la memoria declarativa consciente se consolida en el lóbulo temporal.",
        tronco: "El Tronco Encefálico regula el nivel de alerta; su daño causaría estupor o coma, no una pérdida selectiva de memoria con lucidez intacta."
      }
    },
    {
      id: "caso-03",
      number: "03",
      title: "El Lado Izquierdo que Desapareció",
      patient: "Manuel R. (58 años)",
      history: "Tras un infarto en territorio de la arteria cerebral media derecha, Manuel ignora completamente a las personas que le hablan desde su lado izquierdo. En el almuerzo, solo come los alimentos de la mitad derecha del plato (afirmando haber terminado), y al afeitarse deja sin rasurar toda la mejilla izquierda. En la prueba del Test del Reloj, agrupó todos los números del 1 al 12 en el lado derecho de la esfera.",
      symptoms: [
        "Desatención y omisión visual del hemiespacio izquierdo",
        "Anosognosia: niega enérgicamente tener alguna dificultad",
        "Omisión izquierda en dibujo espontáneo y copia del reloj",
        "Apraxia del vestido y alteración del esquema corporal"
      ],
      correctRegionId: "parietal",
      syndromeName: "Heminegligencia Visuoespacial Unilateral",
      explanation: "Este cuadro es el clásico síndrome de Heminegligencia provocado por daño en la corteza parietal posterior del Lóbulo Parietal derecho. El lóbulo parietal derecho construye la representación espacial del mundo; al destruirse, el hemisferio no dirige la atención al lado contralateral y la mitad izquierda del mundo deja de existir en la conciencia del paciente.",
      differentialFeedback: {
        frontal: "El Lóbulo Frontal puede causar negligencia motora, pero la pérdida de la representación visuoespacial y la omisión en el test del reloj provienen de la corteza parietal posterior.",
        temporal: "El Lóbulo Temporal causaría alteraciones de memoria o comprensión verbal, no la desatención del hemiespacio izquierdo.",
        occipital: "Una lesión occipital causaría hemianopsia homónima (el paciente sabe que no ve a la izquierda y gira la cabeza para compensar); en la heminegligencia parietal ni siquiera concibe que exista un lado izquierdo.",
        cerebelo: "El Cerebelo provocaría ataxia y dismetría motora, no la negligencia del espacio ni del propio cuerpo.",
        tronco: "Una lesión troncal alteraría pares craneales y reflejos vitales, sin producir la extinción espacial hemiatencional típica de la corteza parietal."
      }
    },
    {
      id: "caso-04",
      number: "04",
      title: "Ver sin Reconocer",
      patient: "Sofía G. (50 años)",
      history: "Presenta secuelas de un infarto occipitotemporal ventral. Su agudeza visual es normal y describe con precisión las características físicas de las cosas: 'veo un objeto cilíndrico metálico con una esfera transparente arriba'. Sin embargo, es incapaz de identificar que se trata de una bombilla eléctrica hasta que la toca con la mano o escucha su sonido.",
      symptoms: [
        "Agudeza visual conservada y campo visual completo",
        "Agnosia visual aperceptiva/asociativa para objetos comunes",
        "Reconocimiento intacto por vías sensoriales alternativas (tacto, oído)",
        "Dificultad para emparejar dibujos de objetos según su función"
      ],
      correctRegionId: "occipital",
      syndromeName: "Agnosia Visual de Objetos (Vía Ventral)",
      explanation: "El daño asienta en las áreas de asociación visual del Lóbulo Occipital y la corriente ventral occipitotemporal. La corteza primaria capta la imagen física, pero las cortezas visuales asociativas no logran vincular esa imagen con el banco de conceptos y significados almacenados.",
      differentialFeedback: {
        frontal: "El Lóbulo Frontal produciría alteraciones en la toma de decisiones o en el lenguaje motor, pero no la incapacidad de reconocer visualmente un objeto común.",
        parietal: "El Lóbulo Parietal causaría apraxia o astereognosia (no reconocer objetos por el tacto), pero aquí Sofía sí lo reconoce al tocarlo con la mano.",
        temporal: "El Lóbulo Temporal (área de Wernicke) impediría comprender el nombre verbal, pero Sofía puede nombrarlo en cuanto lo palpa o escucha.",
        cerebelo: "El Cerebelo afectaría la destreza al manipular el objeto, pero no el reconocimiento visual del mismo.",
        tronco: "Una lesión troncal afectaría los movimientos oculares (estrabismo o parálisis de la mirada), pero no generaría una agnosia de objetos pura."
      }
    },
    {
      id: "caso-05",
      number: "05",
      title: "Inestabilidad y Movimientos Descalibrados",
      patient: "Javier T. (34 años)",
      history: "Consulta por marcha inestable de dos meses de evolución. No presenta pérdida de fuerza muscular (fuerza 5/5 en las cuatro extremidades), pero al caminar separa exageradamente las piernas y tambalea de lado a lado. Al pedirle que toque la punta de su nariz con el dedo, su mano oscila y sobrepasa el objetivo (dismetría).",
      symptoms: [
        "Fuerza muscular motora completamente normal",
        "Marcha atáxica con aumento de la base de sustentación",
        "Dismetría en prueba dedo-nariz y talón-rodilla",
        "Temblor de intención que se intensifica al alcanzar un objeto"
      ],
      correctRegionId: "cerebelo",
      syndromeName: "Síndrome Atáxico Cerebeloso",
      explanation: "La ausencia de parálisis con marcada descoordinación motora señala inequívocamente al Cerebelo. El cerebelo calcula los parámetros biomecánicos de precisión, tono y retroalimentación sensorial durante el movimiento activo.",
      differentialFeedback: {
        frontal: "El Lóbulo Frontal causaría paresia o parálisis motora espástica; en Javier la fuerza muscular está completamente intacta (5/5).",
        parietal: "El Lóbulo Parietal causaría ataxia sensorial (que empeora drásticamente al cerrar los ojos, signo de Romberg), pero este cuadro es una ataxia cerebelosa con dismetría y temblor intencional.",
        temporal: "El Lóbulo Temporal no participa en el control directo de la métrica motora ni de la coordinación del equilibrio.",
        occipital: "El Lóbulo Occipital causaría problemas de visión, pero no marcha tambaleante ni temblor de acción.",
        tronco: "Una lesión troncal comprometería núcleos de pares craneales y vías largas con déficit sensitivo-motor cruzado, no un síndrome atáxico puro."
      }
    },
    {
      id: "caso-06",
      number: "06",
      title: "El Paciente Atrapado en su Propio Cuerpo",
      patient: "Raúl P. (55 años)",
      history: "Tras una trombosis de la arteria basilar con infarto ventral de la protuberancia (puente), Raúl no puede mover brazos ni piernas, ni hablar, ni tragar. Sus ojos se encuentran abiertos. El equipo médico nota que cuando le hacen preguntas de sí o no, Raúl parpadea una vez para 'Sí' y dos veces para 'No', respondiendo correctamente a preguntas complejas.",
      symptoms: [
        "Tetraplejía completa (parálisis de las 4 extremidades)",
        "Anartria (imposibilidad motora total de hablar o emitir sonidos)",
        "Conciencia, cognición y comprensión completamente intactas",
        "Preservación exclusiva de movimientos oculares verticales y parpadeo"
      ],
      correctRegionId: "tronco",
      syndromeName: "Síndrome de Enclaustramiento (Locked-in)",
      explanation: "El infarto interrumpió las vías corticoespinales y corticonucleares en la porción ventral del Tronco Encefálico (puente de Varolio), bloqueando toda salida motora voluntaria pero dejando intacto el sistema reticular ascendente (vigilia) y la corteza cerebral superior.",
      differentialFeedback: {
        frontal: "El Lóbulo Frontal causaría mutismo acinético o abulia profunda, pero en el síndrome de enclaustramiento el paciente está plenamente lúcido y se comunica mediante parpadeo.",
        parietal: "El Lóbulo Parietal no contiene las vías motoras piramidales compactas capaces de causar una tetraplejía motora total.",
        temporal: "El Lóbulo Temporal no interviene en la vía motora voluntaria ni en la inervación de los cuatro miembros.",
        occipital: "El Lóbulo Occipital causaría ceguera o agnosia, pero los ojos de Raúl están sanos y puede moverlos verticalmente.",
        cerebelo: "El Cerebelo causaría hipotonía y ataxia severa, pero nunca una parálisis motora voluntaria total de las cuatro extremidades."
      }
    }
  ]
};

class NeuroDatabase {
  constructor() {
    this.STORAGE_KEY = 'neuroexplore_database_v1';
    this.PROGRESS_KEY = 'neuroexplore_user_progress_v1';
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      if (!parsed || !parsed.cases || !parsed.cases[0].differentialFeedback) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(SEED_DATA));
      }
      if (!localStorage.getItem(this.PROGRESS_KEY)) {
        const initialProgress = {
          userName: 'Estudiante de Neuropsicología',
          quizAnswers: {}, // questionId -> { selected, isCorrect, timestamp }
          quizScore: 0,
          quizTotalAnswered: 0,
          completedCases: {}, // caseId -> { selectedRegion, isCorrect, timestamp }
          exploredRegions: {}, // regionId -> boolean
          lastActive: new Date().toISOString()
        };
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(initialProgress));
      }
    } catch (e) {
      console.warn("Storage no disponible, usando memoria volatil:", e);
      this._fallbackMemory = JSON.parse(JSON.stringify(SEED_DATA));
      this._fallbackProgress = {
        userName: 'Estudiante',
        quizAnswers: {},
        quizScore: 0,
        quizTotalAnswered: 0,
        completedCases: {},
        exploredRegions: {},
        lastActive: new Date().toISOString()
      };
    }
  }

  _getData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : (this._fallbackMemory || SEED_DATA);
    } catch (e) {
      return this._fallbackMemory || SEED_DATA;
    }
  }

  _getProgress() {
    try {
      const raw = localStorage.getItem(this.PROGRESS_KEY);
      return raw ? JSON.parse(raw) : (this._fallbackProgress || {});
    } catch (e) {
      return this._fallbackProgress || {};
    }
  }

  _saveProgress(prog) {
    prog.lastActive = new Date().toISOString();
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(prog));
    } catch (e) {
      this._fallbackProgress = prog;
    }
  }

  // --- MÉTODOS DE CONSULTA (ANATOMÍA) ---
  getRegions() {
    return this._getData().regions;
  }

  getRegion(id) {
    return this._getData().regions.find(r => r.id === id) || null;
  }

  markRegionExplored(id) {
    const prog = this._getProgress();
    if (!prog.exploredRegions) prog.exploredRegions = {};
    prog.exploredRegions[id] = true;
    this._saveProgress(prog);
  }

  // --- MÉTODOS DE CONSULTA (QUIZ) ---
  getQuestions() {
    return this._getData().questions;
  }

  getQuestion(id) {
    return this._getData().questions.find(q => q.id === id) || null;
  }

  recordQuizAnswer(questionId, selectedIdx, isCorrect) {
    const prog = this._getProgress();
    if (!prog.quizAnswers) prog.quizAnswers = {};

    const prevAnswer = prog.quizAnswers[questionId];
    prog.quizAnswers[questionId] = {
      selectedIdx,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    // Recalcular métricas
    const answers = Object.values(prog.quizAnswers);
    prog.quizTotalAnswered = answers.length;
    prog.quizScore = answers.filter(a => a.isCorrect).length;

    this._saveProgress(prog);
    return prog;
  }

  // --- MÉTODOS DE CONSULTA (CASOS CLÍNICOS) ---
  getCases() {
    return this._getData().cases;
  }

  getCase(id) {
    return this._getData().cases.find(c => c.id === id) || null;
  }

  recordCaseDiagnosis(caseId, selectedRegionId, isCorrect) {
    const prog = this._getProgress();
    if (!prog.completedCases) prog.completedCases = {};

    prog.completedCases[caseId] = {
      selectedRegionId,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    this._saveProgress(prog);
    return prog;
  }

  // --- MÉTODOS GENERALES DE PROGRESO ---
  getUserProgress() {
    const prog = this._getProgress();
    const regions = this.getRegions();
    const questions = this.getQuestions();
    const cases = this.getCases();

    const exploredCount = Object.keys(prog.exploredRegions || {}).length;
    const casesCount = Object.values(prog.completedCases || {}).filter(c => c.isCorrect).length;
    const quizAccuracy = prog.quizTotalAnswered > 0
      ? Math.round((prog.quizScore / prog.quizTotalAnswered) * 100)
      : 0;

    return {
      userName: prog.userName || 'Estudiante',
      exploredCount,
      totalRegions: regions.length,
      exploredPercentage: Math.round((exploredCount / regions.length) * 100),
      quizScore: prog.quizScore || 0,
      quizTotalAnswered: prog.quizTotalAnswered || 0,
      quizAccuracy,
      totalQuestions: questions.length,
      casesCompleted: casesCount,
      totalCases: cases.length,
      casesPercentage: Math.round((casesCount / cases.length) * 100),
      completedCasesMap: prog.completedCases || {},
      quizAnswersMap: prog.quizAnswers || {},
      exploredRegionsMap: prog.exploredRegions || {}
    };
  }

  resetAllProgress() {
    try {
      localStorage.removeItem(this.PROGRESS_KEY);
    } catch (e) {}
    this.init();
  }
}

// Instancia global disponible en toda la aplicación
window.NeuroDB = new NeuroDatabase();
