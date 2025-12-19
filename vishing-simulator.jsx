import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Shield, XCircle, CheckCircle, Award, TrendingUp } from 'lucide-react';

const VishingSimulator = () => {
  const [stage, setStage] = useState('login');
  const [score, setScore] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [scenarioType, setScenarioType] = useState('');
  const [redFlagsEncountered, setRedFlagsEncountered] = useState([]);
  
  // NUEVOS ESTADOS PARA TRACKING
  const [userName, setUserName] = useState('');
  const [userResults, setUserResults] = useState({
    bank: null,
    tech: null,
    tax: null,
    family: null,
    package: null,
    ceo: null
  });
  const [inputName, setInputName] = useState('');

  const trackRedFlag = (flag) => {
    if (!redFlagsEncountered.includes(flag)) {
      setRedFlagsEncountered([...redFlagsEncountered, flag]);
    }
  };

  // COLORES CORPORATIVOS BEXEN
  const bexenColors = {
    primary: '#1e3a5f', // Azul oscuro BEXEN
    secondary: '#2c5282', // Azul medio
    accent: '#3182ce', // Azul claro
    success: '#059669', // Verde
    danger: '#dc2626', // Rojo
    warning: '#f59e0b', // Naranja
    light: '#f8fafc', // Gris muy claro
    white: '#ffffff'
  };

  // MAPEO DE ESCENARIOS A CLAVES DE STORAGE
  const scenarioToKey = {
    'bank': 'bank',
    'tech': 'tech',
    'tax': 'tax',
    'family': 'family',
    'package': 'package',
    'ceo': 'ceo'
  };

  const scenarioNames = {
    'bank': 'Banco',
    'tech': 'Soporte Técnico',
    'tax': 'Agencia Tributaria',
    'family': 'Familiar en Apuros',
    'package': 'Empresa de Paquetería',
    'ceo': 'CEO/Director'
  };

  // FUNCIONES DE STORAGE
  const loadUserData = async (name) => {
    try {
      const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '-');
      
      // Cargar resultados del usuario
      const resultsKey = `results:${normalizedName}`;
      const resultsData = await window.storage.get(resultsKey, true);
      
      if (resultsData) {
        const parsedResults = JSON.parse(resultsData.value);
        setUserResults(parsedResults);
        console.log('Datos cargados para', name, ':', parsedResults);
      } else {
        // Usuario nuevo - inicializar estructura vacía
        const emptyResults = {
          bank: null,
          tech: null,
          tax: null,
          family: null,
          package: null,
          ceo: null
        };
        setUserResults(emptyResults);
        console.log('Usuario nuevo:', name, '- Inicializando resultados vacíos');
      }
      
      // Añadir usuario a la lista global si no existe
      const userListData = await window.storage.get('admin:users-list', true);
      let userList = userListData ? JSON.parse(userListData.value) : [];
      
      if (!userList.includes(normalizedName)) {
        userList.push(normalizedName);
        await window.storage.set('admin:users-list', JSON.stringify(userList), true);
      }
      
      return true;
    } catch (error) {
      console.log('Error cargando datos del usuario:', error);
      // En caso de error, inicializar vacío
      setUserResults({
        bank: null,
        tech: null,
        tax: null,
        family: null,
        package: null,
        ceo: null
      });
      return false;
    }
  };

  const saveUserResult = async (name, scenario, finalScore) => {
    try {
      const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '-');
      const resultsKey = `results:${normalizedName}`;
      
      console.log('Guardando resultado:', { name, scenario, finalScore });
      
      // Cargar resultados existentes desde storage primero
      const existingData = await window.storage.get(resultsKey, true);
      let results = existingData ? JSON.parse(existingData.value) : {
        bank: null,
        tech: null,
        tax: null,
        family: null,
        package: null,
        ceo: null
      };
      
      // Guardar nuevo resultado
      results[scenario] = {
        completado: true,
        score: finalScore,
        fecha: new Date().toISOString()
      };
      
      console.log('Resultados actualizados:', results);
      
      // Guardar en storage
      await window.storage.set(resultsKey, JSON.stringify(results), true);
      console.log('✅ Guardado en storage exitoso');
      
      // Actualizar estado local
      setUserResults(results);
      console.log('✅ Estado local actualizado');
      
      return true;
    } catch (error) {
      console.error('❌ Error guardando resultado:', error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (inputName.trim().length < 2) {
      alert('Por favor ingresa un nombre válido (mínimo 2 caracteres)');
      return;
    }
    
    setUserName(inputName.trim());
    await loadUserData(inputName.trim());
    setStage('scenario_select');
  };

  const isScenarioCompleted = (scenario) => {
    const completed = userResults[scenario]?.completado || false;
    console.log(`¿Escenario ${scenario} completado?`, completed, 'userResults:', userResults);
    return completed;
  };

  const getScenarioScore = (scenario) => {
    return userResults[scenario]?.score || null;
  };

  const getScenarioDate = (scenario) => {
    return userResults[scenario]?.fecha || null;
  };

  const scenarios = {
    scenario_select: {
      title: "📱 Selecciona tu Escenario",
      description: "¿Qué tipo de llamada sospechosa quieres experimentar? Cada una usa técnicas diferentes de ingeniería social.",
      question: "Elige un escenario:",
      options: [
        {
          text: "Llamada del Banco - Fraude detectado",
          next: "bank_intro",
          points: 0,
          feedback: "Escenario bancario seleccionado.",
          scenario: "bank"
        },
        {
          text: "Soporte Técnico - Microsoft/Windows",
          next: "tech_intro",
          points: 0,
          feedback: "Escenario de soporte técnico seleccionado.",
          scenario: "tech"
        },
        {
          text: "Agencia Tributaria - Deuda pendiente",
          next: "tax_intro",
          points: 0,
          feedback: "Escenario de autoridad fiscal seleccionado.",
          scenario: "tax"
        },
        {
          text: "Familiar en Apuros - Emergencia",
          next: "family_intro",
          points: 0,
          feedback: "Escenario de familiar seleccionado.",
          scenario: "family"
        },
        {
          text: "Empresa de Paquetería - Problema con envío",
          next: "package_intro",
          points: 0,
          feedback: "Escenario de paquetería seleccionado.",
          scenario: "package"
        },
        {
          text: "CEO/Director - Transferencia Urgente (Corporativo)",
          next: "ceo_intro",
          points: 0,
          feedback: "Escenario corporativo avanzado seleccionado.",
          scenario: "ceo"
        }
      ]
    },

    // ==================== ESCENARIO 1: BANCO ====================
    bank_intro: {
      title: "📞 Llamada Entrante...",
      description: "Tu teléfono suena. El identificador muestra: '900-102-365 - Banco Seguro'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Responder la llamada",
          next: "bank_start",
          points: 0,
          feedback: "Respondes la llamada..."
        },
        {
          text: "Ignorar y llamar tú al banco después",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡EXCELENTE! Verificar llamando tú es la mejor práctica.",
          trackFlag: "Spoofing de número telefónico"
        },
        {
          text: "Responder pero estar atento",
          next: "bank_start",
          points: 5,
          feedback: "Respondes con precaución..."
        }
      ]
    },
    bank_start: {
      title: "El Llamante",
      description: "Voz profesional y amable: 'Buenos días, ¿hablo con [tu nombre]? Soy Carlos Martínez del Departamento de Seguridad de Banco Seguro. Le llamo porque hemos detectado movimientos inusuales en su cuenta. ¿Tiene un momento para hablar? No se preocupe, es solo una verificación de rutina.'",
      question: "¿Cómo respondes?",
      options: [
        {
          text: "Sí, dígame. ¿Qué movimientos detectaron?",
          next: "bank_details",
          points: 0,
          feedback: "Continúas la conversación...",
          trackFlag: "Llamada no solicitada sobre tema urgente"
        },
        {
          text: "¿Puede darme un número de referencia? Prefiero llamar yo al banco",
          next: "bank_persistence1",
          points: 20,
          feedback: "Intentas verificar...",
          trackFlag: "Solicitud de verificación"
        },
        {
          text: "Ok, pero primero confirme mis últimos movimientos",
          next: "bank_fake_verification",
          points: 5,
          feedback: "Intentas verificar...",
          trackFlag: "Falsa sensación de seguridad"
        }
      ]
    },
    bank_details: {
      title: "Los Detalles Preocupantes",
      description: "Carlos: 'Claro. Esta madrugada a las 3:47 AM detectamos tres intentos de cargo desde Rumania por un total de 2.450 euros. Hemos bloqueado temporalmente su tarjeta. Ahora bien, para reactivarla de forma segura y emitir una nueva, necesito confirmar algunos datos. Es procedimiento estándar, ¿de acuerdo?'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Entendido, ¿qué datos necesita?",
          next: "bank_data_request",
          points: -5,
          feedback: "Aceptas continuar...",
          trackFlag: "Creación de urgencia y miedo"
        },
        {
          text: "Prefiero ir a la sucursal en persona",
          next: "bank_persistence2",
          points: 20,
          feedback: "Propones verificación presencial...",
          trackFlag: "Intento de verificación presencial"
        },
        {
          text: "¿Cómo sé que es realmente del banco?",
          next: "bank_false_proof",
          points: 10,
          feedback: "Buena pregunta, pero ojo con la respuesta...",
          trackFlag: "Solicitud de credenciales del llamante"
        }
      ]
    },
    bank_persistence1: {
      title: "Primera Insistencia",
      description: "Carlos: 'Claro, entiendo su precaución, es muy inteligente. El número de referencia es BCN-2024-8473. Pero déjeme explicarle: si llama usted al banco, le van a redirigir de nuevo a este departamento de fraude y eso le llevará entre 30-45 minutos en espera. Mientras tanto, los cargos fraudulentos se procesan automáticamente en 20 minutos. ¿Realmente quiere arriesgarse a perder 2.450 euros por una espera?'",
      question: "¿Qué decides?",
      options: [
        {
          text: "Tiene razón, mejor lo resolvemos ahora",
          next: "bank_data_request",
          points: -10,
          feedback: "La urgencia te presiona...",
          trackFlag: "Presión temporal efectiva"
        },
        {
          text: "Prefiero correr el riesgo y verificar",
          next: "bank_persistence3",
          points: 25,
          feedback: "Mantienes tu posición...",
          trackFlag: "Resistencia a presión temporal"
        }
      ]
    },
    bank_persistence2: {
      title: "Segunda Insistencia",
      description: "Carlos: 'Entiendo que quiera ir a la sucursal, es lo más seguro normalmente. Pero le tengo que informar que todas las sucursales están cerradas hasta mañana por el festivo, ¿no se ha enterado? Y para mañana los 2.450€ ya estarán cargados y su cuenta en números rojos. El banco no puede reembolsarle hasta que se complete la investigación, lo cual tarda entre 30-60 días. ¿Seguro que prefiere eso?'",
      question: "Tu respuesta:",
      options: [
        {
          text: "No sabía lo del festivo. Mejor hablamos ahora.",
          next: "bank_data_request",
          points: -10,
          feedback: "La excusa te convence...",
          trackFlag: "Excusas plausibles funcionan"
        },
        {
          text: "Asumo el riesgo. Verificaré mañana personalmente.",
          next: "bank_persistence3",
          points: 25,
          feedback: "Mantienes tu decisión...",
          trackFlag: "Persistencia en verificación"
        }
      ]
    },
    bank_persistence3: {
      title: "Última Insistencia del Banco",
      description: "Carlos: [Tono más serio] 'Mire, le voy a ser totalmente honesto. Veo en el sistema que este no es el primer aviso de fraude en su cuenta. Hubo otro hace 3 meses que usted ignoró y perdió 890 euros. ¿Recuerda? Esta vez son 2.450 euros. Si no actuamos AHORA, en 15 minutos el cargo se aprueba automáticamente. Es su dinero, su decisión, pero después no diga que no le avisamos. ÚLTIMA OPORTUNIDAD: ¿confirmamos sus datos de seguridad ahora o prefiere ver los cargos mañana?'",
      question: "Decisión final:",
      options: [
        {
          text: "Está bien, confirmemos los datos ahora",
          next: "bank_data_request",
          points: -15,
          feedback: "La presión extrema te venció...",
          trackFlag: "Presión extrema con urgencia final"
        },
        {
          text: "No. Cuelgo y llamo yo al banco. Adiós.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡PERFECTO! Resististe toda la presión.",
          trackFlag: "Resistencia completa - Héroe bancario"
        }
      ]
    },
    bank_fake_verification: {
      title: "Información 'Correcta'",
      description: "Carlos: 'Por supuesto, déjeme ver... Su último movimiento fue ayer en Mercadona por 43,50€ y antes un cargo en Repsol de 65 euros. ¿Es correcto?' (Esta información genérica podría saberla de muchas formas). 'Perfecto, ahora para proceder con el bloqueo de los cargos fraudulentos, necesito que me confirme los últimos 4 dígitos de su tarjeta.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Le doy los 4 dígitos, parece que es legítimo",
          next: "bank_cvv_request",
          points: -10,
          feedback: "Confías en el atacante...",
          trackFlag: "Uso de información pública para ganar confianza"
        },
        {
          text: "Colgar y llamar al número oficial del banco",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Identificaste que algo no cuadra.",
          trackFlag: "Verificación independiente realizada"
        },
        {
          text: "Pregunto por qué necesita esos datos si ya tiene mi información",
          next: "bank_excuse",
          points: 15,
          feedback: "Buena observación crítica...",
          trackFlag: "Cuestionamiento de procedimientos sospechosos"
        }
      ]
    },
    bank_data_request: {
      title: "La Solicitud Clave",
      description: "Carlos: 'Necesito que confirme su número de tarjeta completo y la fecha de caducidad. Ah, y el código CVV de la parte trasera. Es solo para verificar que es usted quien autoriza el bloqueo.'",
      question: "Tu decisión:",
      options: [
        {
          text: "Le doy toda la información para resolver esto rápido",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: -25,
          feedback: "ERROR CRÍTICO: Nunca des CVV por teléfono.",
          trackFlag: "Solicitud de CVV por teléfono (RED FLAG CRÍTICA)"
        },
        {
          text: "Espera, el banco nunca pide el CVV. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡EXCELENTE! Identificaste la red flag más importante.",
          trackFlag: "Reconocimiento de solicitud fraudulenta de CVV"
        },
        {
          text: "Le doy todo menos el CVV",
          next: "bank_insistence",
          points: -10,
          feedback: "Mal: ya diste demasiada información.",
          trackFlag: "Entrega parcial de datos sensibles"
        }
      ]
    },
    bank_cvv_request: {
      title: "La Trampa Final",
      description: "Carlos: 'Perfecto. Ahora, para completar el proceso de bloqueo, necesito el código de seguridad CVV. Es el número de tres dígitos de la parte trasera. Sin esto no puedo procesar la solicitud en el sistema.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Se lo doy para terminar con esto",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: -30,
          feedback: "ERROR CRÍTICO: Los bancos NUNCA piden CVV.",
          trackFlag: "Solicitud de CVV (NUNCA legítima por teléfono)"
        },
        {
          text: "Un momento... el banco nunca pide el CVV. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡PERFECTO! Reconociste la red flag crítica.",
          trackFlag: "Reconocimiento tardío pero efectivo"
        }
      ]
    },
    bank_excuse: {
      title: "La Excusa Técnica",
      description: "Carlos: 'Es por el nuevo protocolo de seguridad RGPD. Necesitamos confirmación verbal del titular. Es como cuando llama al banco y le piden su DNI y fecha de nacimiento, ¿recuerda? Mismo proceso. Además, sin estos datos no puedo ni siquiera generar el formulario de bloqueo en el sistema.'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Ah, entiendo. Tiene sentido. Le doy los datos.",
          next: "bank_data_request",
          points: -15,
          feedback: "La explicación técnica te convenció...",
          trackFlag: "Uso de jerga técnica para aparentar legitimidad"
        },
        {
          text: "No me convence. Prefiero colgar y llamar yo",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Tu instinto te salvó.",
          trackFlag: "Confianza en el instinto ante explicaciones dudosas"
        }
      ]
    },
    bank_insistence: {
      title: "Última Insistencia",
      description: "Carlos: 'Entiendo su preocupación, pero sin el CVV el sistema no me deja continuar. Es un campo obligatorio. Si no lo completamos ahora, los 2.450€ se cargarán automáticamente en 15 minutos. ¿Seguro que no quiere dar ese último dato? Solo son 3 dígitos...'",
      question: "Tu decisión final:",
      options: [
        {
          text: "Está bien, se lo doy",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: -25,
          feedback: "Cediste a la presión final.",
          trackFlag: "Presión extrema de tiempo límite"
        },
        {
          text: "No. Cuelgo ahora mismo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Resististe hasta el final.",
          trackFlag: "Resistencia exitosa a presión extrema"
        }
      ]
    },
    bank_false_proof: {
      title: "Prueba Falsa",
      description: "Carlos: 'Excelente pregunta. Mi número de empleado es BS-4729. Puede ver que la llamada viene del 900-102-365, que es nuestro número oficial, ¿verdad? Además, tengo acceso a toda su información de cuenta, lo cual demuestra que soy legítimo. Si quiere, le puedo decir su saldo actual...'",
      question: "¿Cómo procedes?",
      options: [
        {
          text: "Ok, eso me convence. ¿Qué necesita?",
          next: "bank_data_request",
          points: -10,
          feedback: "Te convencieron con pruebas falsas...",
          trackFlag: "Spoofing telefónico + acceso a datos básicos"
        },
        {
          text: "Aún así, voy a colgar y verificar llamando yo",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡EXCELENTE! No importa lo convincente que parezca.",
          trackFlag: "Verificación independiente a pesar de 'pruebas'"
        }
      ]
    },

    // ==================== ESCENARIO 2: SOPORTE TÉCNICO ====================
    tech_intro: {
      title: "📞 Llamada Inesperada",
      description: "Recibes una llamada. 'Hola, le llamamos de Microsoft Technical Support. Hemos detectado que su ordenador está enviando señales de error a nuestros servidores. Su licencia de Windows está en riesgo y podría tener virus. ¿Usa Windows en su ordenador?'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Sí, uso Windows. ¿Qué tipo de errores?",
          next: "tech_alarm",
          points: -5,
          feedback: "Continúas la conversación...",
          trackFlag: "Llamada fría de 'soporte técnico' no solicitado"
        },
        {
          text: "Microsoft nunca llama así. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡PERFECTO! Microsoft nunca llama proactivamente.",
          trackFlag: "Reconocimiento inmediato de táctica fraudulenta"
        },
        {
          text: "¿Cómo consiguieron mi número?",
          next: "tech_excuse",
          points: 10,
          feedback: "Buena pregunta...",
          trackFlag: "Cuestionamiento del origen de la llamada"
        }
      ]
    },
    tech_alarm: {
      title: "El Problema 'Grave'",
      description: "Técnico: 'Vemos actividad sospechosa desde hace 3 días. Probablemente tiene malware que está robando sus contraseñas en este momento. Si no actuamos en la próxima hora, podrían acceder a su banca online. ¿Está frente al ordenador ahora? Le voy a guiar para limpiarlo.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Sí, estoy muy preocupado. Dígame qué hacer",
          next: "tech_remote",
          points: -10,
          feedback: "El miedo te hace vulnerable...",
          trackFlag: "Crear pánico sobre seguridad"
        },
        {
          text: "Voy a contactar con mi servicio técnico local",
          next: "tech_persistence1",
          points: 20,
          feedback: "Buscas verificación...",
          trackFlag: "Búsqueda de verificación local"
        },
        {
          text: "¿Puede enviarme esto por email oficial de Microsoft?",
          next: "tech_redirect",
          points: 15,
          feedback: "Pides documentación...",
          trackFlag: "Solicitud de comunicación oficial documentada"
        }
      ]
    },
    tech_persistence1: {
      title: "Insistencia Técnica",
      description: "Técnico: 'Su servicio técnico local no tiene acceso a los logs de Microsoft. Solo nosotros podemos ver la actividad maliciosa. Además, si espera, el virus se propagará a todos sus contactos y archivos. Ya ha infectado su sistema de banca online. CADA MINUTO cuenta. ¿Realmente quiere arriesgarse?'",
      question: "¿Qué decides?",
      options: [
        {
          text: "Tiene razón, ayúdeme ahora",
          next: "tech_remote",
          points: -15,
          feedback: "La urgencia técnica funciona...",
          trackFlag: "Urgencia técnica falsa"
        },
        {
          text: "Prefiero arriesgarme. Voy a verificar primero.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! No cedes a presión técnica.",
          trackFlag: "Resistencia a urgencia técnica"
        }
      ]
    },
    tech_excuse: {
      title: "La Explicación",
      description: "Técnico: 'Su número está registrado con su licencia de Windows. Todos los usuarios legítimos están en nuestra base de datos. Es parte del servicio de soporte premium que viene con Windows 10 y 11. ¿No lo sabía? Bueno, ahora que le hemos contactado, debemos resolver esto urgentemente.'",
      question: "Tu respuesta:",
      options: [
        {
          text: "No sabía que tenía ese servicio. ¿Qué debo hacer?",
          next: "tech_remote",
          points: -10,
          feedback: "Te convenció con información falsa...",
          trackFlag: "Invención de 'servicios incluidos' inexistentes"
        },
        {
          text: "Voy a verificar esto en la web de Microsoft. Adiós.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Siempre verifica información sospechosa.",
          trackFlag: "Verificación en fuentes oficiales"
        }
      ]
    },
    tech_remote: {
      title: "Acceso Remoto",
      description: "Técnico: 'Perfecto. Abra su navegador y vaya a www.techsupport-fix.com y descargue la herramienta TeamViewer. Esto me permitirá ver su pantalla y limpiar el virus remotamente. Es completamente seguro, lo usan millones de personas.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Ok, lo descargo y le doy acceso",
          next: "compromised_tech",
          points: -30,
          feedback: "ERROR: Nunca des acceso remoto a desconocidos.",
          trackFlag: "Solicitud de acceso remoto (NUNCA conceder)"
        },
        {
          text: "No voy a dar acceso a mi ordenador. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡EXCELENTE! Nunca des control de tu equipo.",
          trackFlag: "Rechazo a acceso remoto no autorizado"
        },
        {
          text: "¿Hay otra forma sin dar acceso?",
          next: "tech_payment",
          points: 5,
          feedback: "Buscas alternativas...",
          trackFlag: "Búsqueda de soluciones alternativas"
        }
      ]
    },
    tech_redirect: {
      title: "Evitar Documentación",
      description: "Técnico: 'El email oficial podría tardar 48-72 horas. Para entonces su ordenador ya estará completamente comprometido. Nuestras llamadas SON el método oficial de contacto urgente. Mire, déjeme mostrarle el problema en tiempo real. Solo tiene que...'",
      question: "Tu decisión:",
      options: [
        {
          text: "Está bien, me ha convencido",
          next: "tech_remote",
          points: -10,
          feedback: "La urgencia artificial funciona...",
          trackFlag: "Evasión de canales oficiales de comunicación"
        },
        {
          text: "Prefiero esperar el email. Gracias y adiós.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! No cediste a la presión temporal.",
          trackFlag: "Priorización de procedimientos oficiales"
        }
      ]
    },
    tech_payment: {
      title: "El Cobro",
      description: "Técnico: 'Sí, podemos enviarle un antivirus premium que lo solucionará. Solo cuesta 299€ pero hoy tenemos oferta por 149€. ¿Tiene tarjeta a mano? Tiene que actuar ya, la oferta expira en esta llamada.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Ok, le doy los datos de la tarjeta",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: -25,
          feedback: "ERROR: Nunca pagues en llamadas no solicitadas.",
          trackFlag: "Solicitud de pago inmediato + falsa urgencia"
        },
        {
          text: "No voy a pagar nada. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Nunca pagues en estas situaciones.",
          trackFlag: "Rechazo a pagos no verificados"
        }
      ]
    },
    compromised_tech: {
      title: "💻 Sistema Comprometido",
      description: "Le diste acceso remoto al atacante. Ahora tiene control total de tu ordenador. Puede ver tus contraseñas guardadas, instalar keyloggers, acceder a tus archivos, y robar tu información bancaria. El daño puede ser masivo. Si esto hubiera sido en BEXEN, comprometería toda la red corporativa.",
      question: "Consecuencias:",
      options: [
        {
          text: "Ver resultados",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: 0,
          feedback: "Dar acceso remoto es uno de los errores más graves.",
          trackFlag: "Concesión de acceso remoto a atacante"
        }
      ]
    },

    // ==================== ESCENARIO 3: AGENCIA TRIBUTARIA ====================
    tax_intro: {
      title: "📞 Llamada Oficial",
      description: "Identificador: 'Agencia Tributaria - 901 200 350'. Voz seria: 'Buenos días, le llamamos del departamento de recaudación de la Agencia Tributaria. Tiene una deuda pendiente con Hacienda por 1.847€ más intereses. Si no se regulariza hoy, procederemos con el embargo de sus cuentas. ¿Es usted [tu nombre]?'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Sí soy yo. No sabía nada de esto. ¿Qué debo hacer?",
          next: "tax_threat",
          points: -5,
          feedback: "El miedo al embargo es real...",
          trackFlag: "Amenaza de acción legal inmediata"
        },
        {
          text: "Hacienda no llama así. Envían cartas. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡PERFECTO! Hacienda usa notificaciones escritas.",
          trackFlag: "Conocimiento de procedimientos oficiales"
        },
        {
          text: "¿Puede darme un número de referencia de expediente?",
          next: "tax_reference",
          points: 15,
          feedback: "Pides documentación oficial...",
          trackFlag: "Solicitud de número de expediente"
        }
      ]
    },
    tax_threat: {
      title: "La Amenaza Legal",
      description: "Agente: 'La deuda es del ejercicio fiscal 2022. Hemos enviado tres notificaciones a su domicilio sin respuesta. Si no paga hoy, mañana embargamos sus cuentas y notificamos a su empleador. También habrá una multa adicional del 20%. ¿Quiere solucionar esto ahora o prefiere el embargo?'",
      question: "¿Cómo respondes?",
      options: [
        {
          text: "No quiero problemas. ¿Cómo pago ahora?",
          next: "tax_payment",
          points: -15,
          feedback: "El miedo al embargo te presiona...",
          trackFlag: "Presión con consecuencias legales inmediatas"
        },
        {
          text: "Voy a ir personalmente a Hacienda mañana",
          next: "tax_persistence1",
          points: 20,
          feedback: "Propones verificación presencial...",
          trackFlag: "Propuesta de gestión presencial"
        },
        {
          text: "¿Por qué no recibí las notificaciones?",
          next: "tax_excuse",
          points: 10,
          feedback: "Haces preguntas importantes...",
          trackFlag: "Cuestionamiento de procedimientos"
        }
      ]
    },
    tax_persistence1: {
      title: "Insistencia Legal",
      description: "Agente: 'Ir mañana será tarde. El embargo se ejecuta automáticamente a las 00:00 horas de esta noche. Una vez procesado, no se puede revertir y tardará meses en resolverse. Además, su empleador será notificado y eso afectará negativamente su situación laboral. ¿Seguro que quiere arriesgar su empleo y su solvencia crediticia?'",
      question: "¿Qué decides?",
      options: [
        {
          text: "No puedo arriesgar mi trabajo. Pago ahora.",
          next: "tax_payment",
          points: -20,
          feedback: "La amenaza laboral funciona...",
          trackFlag: "Amenaza de consecuencias laborales"
        },
        {
          text: "Asumo el riesgo. Verificaré mañana en persona.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Priorizas verificación sobre miedo.",
          trackFlag: "Resistencia a amenazas legales"
        }
      ]
    },
    tax_reference: {
      title: "Número Falso",
      description: "Agente: 'El número de expediente es AT-2022-VLC-847362. Puede verificarlo en nuestra web si quiere, pero debe actuar HOY. El embargo se ejecuta automáticamente a medianoche. ¿Prefiere pagar ahora por teléfono o ir a una oficina y hacer cola 3 horas?'",
      question: "Tu decisión:",
      options: [
        {
          text: "Mejor pago ahora por teléfono",
          next: "tax_payment",
          points: -15,
          feedback: "La conveniencia te tienta...",
          trackFlag: "Oferta de solución rápida vs proceso oficial"
        },
        {
          text: "Voy a verificar el expediente online primero. Adiós.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Siempre verifica antes de pagar.",
          trackFlag: "Verificación independiente antes de pagar"
        }
      ]
    },
    tax_excuse: {
      title: "Excusas y Presión",
      description: "Agente: 'Probablemente las notificaciones se perdieron en correos o las recibió otra persona. Lo importante es resolver AHORA. Si espera hasta mañana, perderá el trabajo cuando notifiquemos el embargo a su empresa. ¿Realmente quiere arriesgarse?'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Tiene razón, no puedo arriesgarme. ¿Cómo pago?",
          next: "tax_payment",
          points: -15,
          feedback: "El miedo a consecuencias laborales funciona...",
          trackFlag: "Amenaza de consecuencias profesionales"
        },
        {
          text: "Esto no me cuadra. Voy a verificarlo. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Tu instinto te protegió.",
          trackFlag: "Confianza en instinto ante presiones"
        }
      ]
    },
    tax_payment: {
      title: "Método de Pago Sospechoso",
      description: "Agente: 'Perfecto. Puede pagar con tarjeta ahora mismo. Necesito el número completo, fecha de caducidad y CVV. O si prefiere, puede comprar una tarjeta de Paysafecard de 1.847€ en cualquier estanco y darme el código. Así evitamos el embargo.'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Le doy los datos de la tarjeta",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: -30,
          feedback: "ERROR: Hacienda nunca cobra por teléfono así.",
          trackFlag: "Solicitud de pago con tarjeta por teléfono"
        },
        {
          text: "¿Paysafecard? Eso no es normal. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡EXCELENTE! Hacienda nunca pide Paysafecard.",
          trackFlag: "Solicitud de pago con método no rastreable"
        },
        {
          text: "Voy a pagar en la web oficial de Hacienda",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Usa siempre canales oficiales.",
          trackFlag: "Uso de canales oficiales de pago"
        }
      ]
    },

    // ==================== ESCENARIO 4: FAMILIAR ====================
    family_intro: {
      title: "📞 Llamada Desesperada",
      description: "Número desconocido. Una voz joven y angustiada: 'Abuela/o, soy yo, tu nieto Carlos. Tuve un accidente con el coche. Estoy en comisaría. Chocué contra otro coche y el dueño está herido. Necesito 3.000€ urgentemente para el abogado o me van a meter en prisión. Por favor, no se lo digas a mamá, se va a preocupar mucho.'",
      question: "Tu respuesta:",
      options: [
        {
          text: "¿Carlos? Claro hijo, tranquilo. ¿Qué necesitas que haga?",
          next: "family_money",
          points: -10,
          feedback: "La emoción te hace vulnerable...",
          trackFlag: "Suplantación de familiar + urgencia emocional"
        },
        {
          text: "Espera, voy a llamar a tu madre ahora mismo",
          next: "family_persistence1",
          points: 25,
          feedback: "Buscas verificar con otros familiares...",
          trackFlag: "Verificación con otros miembros de la familia"
        },
        {
          text: "¿Carlos? Cuéntame exactamente qué pasó",
          next: "family_story",
          points: 10,
          feedback: "Pides más detalles...",
          trackFlag: "Solicitud de información detallada"
        }
      ]
    },
    family_story: {
      title: "La Historia Confusa",
      description: "Voz: 'Venía de la universidad y... no vi el semáforo. El otro conductor está en el hospital. La policía dice que si no pago la fianza hoy me quedaré detenido. El abogado está aquí conmigo. ¿Puedes enviar el dinero por Bizum o transferencia urgente? Te mando el número de cuenta.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Ok, dame el número de cuenta",
          next: "family_money",
          points: -15,
          feedback: "Actúas por pánico...",
          trackFlag: "Solicitud de transferencia urgente"
        },
        {
          text: "Primero voy a hablar con la policía yo",
          next: "family_police",
          points: 20,
          feedback: "Buscas verificación oficial...",
          trackFlag: "Intento de contacto con autoridades"
        },
        {
          text: "Dame tu número de DNI para verificar que eres tú",
          next: "family_verify",
          points: 25,
          feedback: "Intentas verificar la identidad...",
          trackFlag: "Verificación de identidad del llamante"
        }
      ]
    },
    family_persistence1: {
      title: "Manipulación Emocional",
      description: "Voz: [Llorando] 'NO, abuela/o, por favor no llames a mamá. Ya bastante mal está que esté aquí. Si ella se entera va a venir y va a hacer un escándalo. El abogado dice que si pagamos ahora puedo salir en una hora y nadie tiene que saberlo. Pero si llamas a mamá, todo se complica. ¿No confías en mí? Soy tu nieto...'",
      question: "¿Qué decides?",
      options: [
        {
          text: "Tienes razón, no quiero que se preocupe. Te ayudo.",
          next: "family_money",
          points: -20,
          feedback: "La manipulación emocional funciona...",
          trackFlag: "Manipulación emocional con culpa"
        },
        {
          text: "Precisamente porque te quiero, voy a llamar a tu madre.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡PERFECTO! La verificación familiar es esencial.",
          trackFlag: "Priorización de verificación sobre emoción"
        }
      ]
    },
    family_money: {
      title: "El Envío de Dinero",
      description: "'Perfecto abuelo/a. Envía 3.000€ a esta cuenta: ES76 0000 0000 0000 0000 0000. Es la cuenta del abogado. Hazlo YA por favor, solo tengo 30 minutos antes de que me trasladen. Y recuerda, no llames a mamá, no quiero preocuparla.'",
      question: "Tu decisión final:",
      options: [
        {
          text: "Hago la transferencia inmediatamente",
          next: "compromised_money",
          points: -30,
          feedback: "ERROR: Perdiste 3.000€ con un estafador.",
          trackFlag: "Transferencia de dinero sin verificación"
        },
        {
          text: "Algo no cuadra. Voy a llamar a tu madre primero.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡BIEN! Siempre verifica con otros familiares.",
          trackFlag: "Verificación con familia real"
        },
        {
          text: "¿Por qué no puedo hablar con la policía?",
          next: "family_police",
          points: 15,
          feedback: "Cuestionas lo sospechoso...",
          trackFlag: "Solicitud de hablar con autoridades"
        }
      ]
    },
    family_verify: {
      title: "Evasión de Verificación",
      description: "Voz nerviosa: 'Ehh... no tengo mi cartera ahora, la policía la tiene. Por favor abuelo/a, confía en mí. Somos familia. Si no me ayudas ahora, voy a la cárcel. ¿Realmente vas a dejar que tu nieto vaya a prisión por verificar un DNI?'",
      question: "¿Cómo respondes?",
      options: [
        {
          text: "Tienes razón, te mando el dinero",
          next: "family_money",
          points: -15,
          feedback: "La culpa emocional funciona...",
          trackFlag: "Manipulación emocional con culpa"
        },
        {
          text: "Si eres realmente Carlos, sabrás qué regalo te dio la abuela en tu cumpleaños",
          next: "family_fail",
          points: 30,
          feedback: "¡EXCELENTE pregunta de verificación personal!",
          trackFlag: "Uso de información privada para verificar"
        },
        {
          text: "Voy a llamar a tu madre ahora mismo",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Verificación familiar.",
          trackFlag: "Verificación independiente con familia"
        }
      ]
    },
    family_police: {
      title: "Bloqueo al Contacto",
      description: "Voz molesta: 'No puedes hablar con ellos ahora, están ocupados. Mira, si no confías en mí, olvídalo. Supongo que prefieres que tu nieto vaya a prisión. Pensé que podía contar contigo...' [Cuelga]",
      question: "¿Qué haces después de que cuelgue?",
      options: [
        {
          text: "Llamo a mi hijo/hija para verificar",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡PERFECTO! Verificaste con la familia real.",
          trackFlag: "Verificación post-llamada con familia"
        },
        {
          text: "Me siento mal. Vuelvo a llamar y le envío el dinero",
          next: "compromised_money",
          points: -25,
          feedback: "ERROR: La culpa te manipuló.",
          trackFlag: "Manipulación mediante culpa funciona"
        }
      ]
    },
    family_fail: {
      title: "El Fraude Expuesto",
      description: "Silencio incómodo. 'Eh... un... un reloj? No, espera... Es que estoy muy nervioso y...' [La llamada se corta]. Era un estafador. Tu nieto real está perfectamente.",
      question: "Resultado:",
      options: [
        {
          text: "Ver resultados",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡EXCELENTE! La verificación personal funcionó.",
          trackFlag: "Verificación exitosa expone el fraude"
        }
      ]
    },
    compromised_money: {
      title: "💸 Dinero Perdido - BEXEN en Peligro",
      description: `Enviaste 3.000€ a un estafador. Tu familiar real está perfectamente bien. El dinero es irrecuperable. Los estafadores usaron ingeniería social y manipulación emocional.

Si esto hubiera sido en BEXEN con una cuenta corporativa, las consecuencias habrían sido:
• 3.000€ perdidos de fondos de empresa
• Investigación interna sobre tu juicio
• Posible responsabilidad laboral
• Contribución al cierre de BEXEN si se suman más incidentes

Las estafas familiares explotan nuestras emociones más profundas. SIEMPRE verifica con otros miembros de la familia antes de enviar dinero.`,
      question: "Lección aprendida:",
      options: [
        {
          text: "Ver resultados",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: 0,
          feedback: "Las estafas emocionales son devastadoras tanto personal como profesionalmente.",
          trackFlag: "Pérdida monetaria por estafa emocional"
        }
      ]
    },

    // ==================== ESCENARIO 5: PAQUETERÍA ====================
    package_intro: {
      title: "📞 Problema con Envío",
      description: "Identificador: 'Correos - 902 197 197'. 'Buenos días, le llamamos de Correos España. Tenemos un paquete para usted pero hay un problema con la dirección de entrega. ¿Es usted [tu nombre] de [tu calle]?' (Información que pudieron obtener de fuentes públicas)",
      question: "Tu respuesta:",
      options: [
        {
          text: "Sí, soy yo. ¿Qué pasa con el paquete?",
          next: "package_problem",
          points: 0,
          feedback: "Continúas la conversación...",
          trackFlag: "Llamada sobre tema plausible (paquete)"
        },
        {
          text: "No estoy esperando ningún paquete. Adiós.",
          next: "package_insist",
          points: 15,
          feedback: "Cuestionas la situación...",
          trackFlag: "Negación de expectativa de envío"
        },
        {
          text: "¿Puede darme el número de seguimiento?",
          next: "package_tracking",
          points: 20,
          feedback: "Pides información verificable...",
          trackFlag: "Solicitud de número de seguimiento"
        }
      ]
    },
    package_problem: {
      title: "La Tasa Pendiente",
      description: "Operador: 'El paquete viene desde Reino Unido y hay tasas de aduana pendientes de 47,80€. Si no se pagan hoy, el paquete vuelve al remitente mañana. ¿Quiere pagar ahora por teléfono para que se lo entreguemos hoy mismo?'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Sí, no quiero perder el paquete. ¿Cómo pago?",
          next: "package_payment",
          points: -10,
          feedback: "El miedo a perder el envío funciona...",
          trackFlag: "Solicitud de pago de tasas por teléfono"
        },
        {
          text: "Voy a la oficina de Correos a pagar en persona",
          next: "package_persistence1",
          points: 20,
          feedback: "Propones gestión presencial...",
          trackFlag: "Preferencia por gestión presencial"
        },
        {
          text: "¿Puede enviarme un SMS o email oficial de Correos?",
          next: "package_email",
          points: 25,
          feedback: "Pides documentación oficial...",
          trackFlag: "Solicitud de comunicación oficial"
        }
      ]
    },
    package_persistence1: {
      title: "Insistencia de Urgencia",
      description: "Operador: 'La oficina más cercana está a 15km y cierra en 2 horas. Con el tráfico no le dará tiempo. Además, el paquete está en el almacén central y si no pagamos ahora, se devuelve automáticamente a las 18:00. Son solo 47,80€. ¿Seguro que prefiere perder el paquete por no pagar ahora?'",
      question: "¿Qué decides?",
      options: [
        {
          text: "Tiene razón, mejor pago ahora",
          next: "package_payment",
          points: -15,
          feedback: "La logística convincente funciona...",
          trackFlag: "Presión logística falsa"
        },
        {
          text: "Prefiero arriesgarme. Iré a la oficina.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Priorizas verificación presencial.",
          trackFlag: "Persistencia en verificación presencial"
        }
      ]
    },
    package_insist: {
      title: "Información Específica",
      description: "Operador: 'Es de una compra online en Amazon. El remitente es Amazon UK. ¿No hizo una compra reciente?' (Información muy genérica que aplica a millones de personas). 'Mire, si no recogemos confirmación hoy, el paquete se destruye.'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Ah sí, puede ser de Amazon. ¿Qué debo hacer?",
          next: "package_problem",
          points: -5,
          feedback: "La información genérica te convenció...",
          trackFlag: "Uso de información genérica para credibilidad"
        },
        {
          text: "Voy a revisar mi cuenta de Amazon primero",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Verificación en fuentes directas.",
          trackFlag: "Verificación en cuenta de comercio electrónico"
        }
      ]
    },
    package_tracking: {
      title: "Número Falso",
      description: "Operador: 'Claro, el número de seguimiento es CP-ES-2024-9473628. Si lo comprueba en nuestra web verá que está pendiente de pago. Pero el sistema tardará hasta mañana en actualizarse, y para entonces será demasiado tarde. ¿Prefiere pagar ahora y recibirlo hoy?'",
      question: "Tu decisión:",
      options: [
        {
          text: "Ok, pago ahora para recibirlo hoy",
          next: "package_payment",
          points: -10,
          feedback: "La urgencia te presiona...",
          trackFlag: "Presión para evitar verificación online"
        },
        {
          text: "Voy a comprobar el número en la web. Si es real, pagaré allí.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡PERFECTO! Verificación antes de pagar.",
          trackFlag: "Verificación del número de seguimiento"
        }
      ]
    },
    package_email: {
      title: "Evasión de Email",
      description: "Operador: 'El sistema de emails está en mantenimiento hoy. Por eso llamamos directamente. Si espera al email, perderá el paquete. Solo son 47,80€. Muchas personas ya pagaron hoy por teléfono sin problemas.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Está bien, pago por teléfono",
          next: "package_payment",
          points: -15,
          feedback: "Aceptaste una excusa poco creíble...",
          trackFlag: "Excusa para evitar documentación oficial"
        },
        {
          text: "Si no hay email oficial, no pago. Adiós.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Sin documentación oficial, no procedes.",
          trackFlag: "Insistencia en procedimientos oficiales"
        }
      ]
    },
    package_payment: {
      title: "Solicitud de Pago",
      description: "Operador: 'Perfecto. Son 47,80€. Puede pagar con tarjeta. Necesito el número completo, fecha de caducidad y CVV. O si prefiere, puede hacerlo mediante Bizum al 655-XXX-XXX.'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Le doy los datos de la tarjeta",
          next: "results",
            forceMaxScore: 35, // Garantiza fracaso
          points: -25,
          feedback: "ERROR: Correos nunca cobra así por teléfono.",
          trackFlag: "Solicitud de datos de tarjeta por teléfono"
        },
        {
          text: "Correos no cobra por teléfono. Esto es fraude. Cuelgo.",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 35,
          feedback: "¡EXCELENTE! Reconociste el fraude.",
          trackFlag: "Reconocimiento de método de pago fraudulento"
        },
        {
          text: "Voy a pagar en la web oficial de Correos",
          next: "results",
            forceMinScore: 65, // Garantiza éxito
          points: 30,
          feedback: "¡BIEN! Solo usa canales oficiales.",
          trackFlag: "Uso de canal oficial de pago"
        }
      ]
    },

    // ==================== ESCENARIO 6: CEO FRAUD (CORPORATIVO) - CON MÁXIMA INSISTENCIA ====================
    ceo_intro: {
      title: "📞 Llamada del Despacho del Director",
      description: "Recibes una llamada. Identificador: 'Dir. General BEXEN - Ext. 101'. Voz autoritaria pero cordial: 'Hola, soy Roberto Mendoza, el Director General de BEXEN. Disculpa que te llame directamente, pero estoy en el aeropuerto camino a una reunión con inversores y necesito tu ayuda urgente con un tema delicado. ¿Tienes un momento? Es importante y confidencial.'",
      question: "¿Cómo respondes?",
      options: [
        {
          text: "Claro, Director. ¿En qué puedo ayudarle?",
          next: "ceo_urgent",
          points: -5,
          feedback: "Continúas la conversación...",
          trackFlag: "Llamada no verificada de autoridad superior"
        },
        {
          text: "¿Puede llamarme desde su móvil corporativo para verificar?",
          next: "ceo_pressure",
          points: 20,
          feedback: "Intentas verificar...",
          trackFlag: "Intento de verificación de identidad"
        },
        {
          text: "Con todo respeto, voy a colgar y llamar a su asistente para confirmar",
          next: "ceo_persistence1",
          points: 25,
          feedback: "Buscas verificación oficial...",
          trackFlag: "Verificación a través de canales oficiales"
        }
      ]
    },
    ceo_persistence1: {
      title: "Primera Barrera - Insistencia Profesional",
      description: "Roberto: 'Aprecio tu precaución, de verdad. Pero mi asistente está en una reunión con el CFO precisamente sobre este tema y no puede ser interrumpida. Por eso te llamo directamente. Mira, esto es EXTREMADAMENTE confidencial - estamos cerrando la adquisición de TechCorp y NADIE puede saberlo aún. Si filtras esto, perdemos el trato de 5 millones. ¿Puedo confiar en tu discreción?'",
      question: "¿Qué respondes?",
      options: [
        {
          text: "Por supuesto, Director. Cuente conmigo.",
          next: "ceo_urgent",
          points: -10,
          feedback: "La confidencialidad te convenció...",
          trackFlag: "Confidencialidad usada para evitar verificación"
        },
        {
          text: "Entiendo, pero aún así prefiero verificar por otro canal",
          next: "ceo_anger",
          points: 30,
          feedback: "Mantienes tu posición...",
          trackFlag: "Resistencia a autoridad nivel 1"
        }
      ]
    },
    ceo_urgent: {
      title: "La Situación Urgente",
      description: "Roberto: 'Gracias. Como te decía, estamos cerrando la adquisición de TechCorp - nuestra competencia. NADIE puede saberlo, ni siquiera el CFO lo sabe aún. Necesito que hagas una transferencia de 45.000€ HOY MISMO a la cuenta de nuestros asesores legales en Suiza. Es para pagar honorarios del due diligence. Si no se paga en las próximas 3 horas, perdemos el trato y 8 meses de negociaciones. ¿Entiendes la gravedad?'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Entendido. ¿A qué cuenta transfiero?",
          next: "ceo_account",
          points: -15,
          feedback: "La autoridad y urgencia te convencen...",
          trackFlag: "Aceptación de solicitud financiera sin verificar"
        },
        {
          text: "Esto debe pasar por el proceso normal de aprobaciones",
          next: "ceo_bypass",
          points: 15,
          feedback: "Insistes en procedimientos...",
          trackFlag: "Intento de seguir protocolos corporativos"
        },
        {
          text: "Lo siento, pero debo verificar con Finanzas. Es protocolo.",
          next: "ceo_confidential",
          points: 25,
          feedback: "Mantienes los protocolos...",
          trackFlag: "Adherencia a protocolos de seguridad"
        }
      ]
    },
    ceo_pressure: {
      title: "Segunda Barrera - Presión Profesional Escalada",
      description: "Roberto: 'Entiendo tu precaución, realmente lo entiendo. Pero estoy literalmente embarcando en 10 minutos y mi móvil corporativo está sin batería - por eso llamo desde el fijo del lounge VIP. Mira, si quieres verificar, llama a mi asistente María... aunque está en reunión hasta las 4 PM. Para entonces ya habré perdido el trato de 5 millones y 35 puestos de trabajo que íbamos a crear. Así que te pregunto directamente: ¿Confías en tu CEO o no?'",
      question: "¿Qué decides?",
      options: [
        {
          text: "Sí, confío. Haré la transferencia.",
          next: "ceo_account",
          points: -20,
          feedback: "La presión de autoridad funcionó...",
          trackFlag: "Confianza mal ubicada en figura de autoridad"
        },
        {
          text: "Prefiero esperar y verificar con María en 2 horas",
          next: "ceo_anger",
          points: 15,
          feedback: "Resistes la presión, pero viene más...",
          trackFlag: "Resistencia a presión de autoridad nivel 1"
        },
        {
          text: "Llamaré a otro ejecutivo para confirmar",
          next: "ceo_confidential_extreme",
          points: 20,
          feedback: "Buscas verificación alternativa...",
          trackFlag: "Búsqueda de verificación independiente"
        }
      ]
    },
    ceo_anger: {
      title: "Tercera Barrera - Frustración y Manipulación",
      description: "Roberto: [Tono de frustración] 'En serio? Mira, llevo 45 años construyendo BEXEN desde CERO. ¿Y ahora me dices que prefieres 'esperar 2 horas' mientras pierdo 5 millones de euros y destruyo 8 meses de trabajo? ¿Sabes cuántas empresas han quebrado porque la gente prefirió 'seguir protocolos' en lugar de tomar decisiones? Te estoy dando la oportunidad de ser parte del mayor crecimiento de BEXEN. O me ayudas AHORA o busco a alguien que SÍ quiera el futuro de esta empresa. ¿Qué decides?'",
      question: "Tu respuesta:",
      options: [
        {
          text: "Tiene razón, lo haré ahora",
          next: "ceo_account",
          points: -25,
          feedback: "La manipulación emocional te venció...",
          trackFlag: "Manipulación emocional exitosa"
        },
        {
          text: "Entiendo su frustración, pero debo verificar. Es mi responsabilidad.",
          next: "ceo_threat",
          points: 25,
          feedback: "Resistes incluso bajo presión extrema...",
          trackFlag: "Resistencia a presión de autoridad nivel 2"
        }
      ]
    },
    ceo_threat: {
      title: "Cuarta Barrera - Amenaza Profesional Directa",
      description: "Roberto: [Voz fría] 'Tu responsabilidad... Interesante concepto. Mira, tomo nota de tu 'inflexibilidad' y tu falta de visión empresarial. Cuando tengamos que hacer recortes de personal el próximo trimestre - y los habrá si perdemos este trato - recordaré EXACTAMENTE quién estuvo dispuesto a ayudar a salvar BEXEN y quién prefirió esconderse detrás de 'procedimientos'. Tu decisión de hoy puede costarte MÁS que un trabajo, puede costar 35 empleos. Última oportunidad: ¿me ayudas o no?'",
      question: "Decisión crítica:",
      options: [
        {
          text: "No quiero arriesgar mi trabajo ni el de otros. Haré la transferencia.",
          next: "ceo_account",
          points: -30,
          feedback: "La amenaza laboral te intimidó...",
          trackFlag: "Intimidación laboral efectiva"
        },
        {
          text: "Lo siento, pero no puedo. Esto no es correcto.",
          next: "ceo_final_threat",
          points: 30,
          feedback: "Mantienes tu posición incluso ante amenazas...",
          trackFlag: "Resistencia a intimidación laboral"
        }
      ]
    },
    ceo_final_threat: {
      title: "Quinta Barrera - Última Manipulación Extrema",
      description: "Roberto: [Explosión de ira] '¿CORRECTO? ¿Me estás diciendo a MÍ lo que es correcto? Yo FUNDÉ BEXEN. Yo firmo TU nómina. Yo decidí CONTRATARTE. Y tú te atreves a cuestionarme? Sabes qué, perfecto. Ya sé exactamente con quién cuento y con quién NO. Espera la llamada de RRHH esta tarde. Y cuando BEXEN pierda el trato y tengamos que despedir a 35 personas, que sepan que fue por TU inflexibilidad.' [CUELGA BRUSCAMENTE]",
      question: "¿Qué haces ahora?",
      options: [
        {
          text: "Me asusto y le llamo de vuelta para hacer la transferencia",
          next: "ceo_account",
          points: -35,
          feedback: "El miedo extremo te hizo ceder...",
          trackFlag: "Intimidación extrema funciona"
        },
        {
          text: "Llamar inmediatamente al Director REAL o a RRHH para reportar esto",
          next: "ceo_verification_success",
          points: 40,
          feedback: "¡PERFECTO! Reportaste el intento de fraude.",
          trackFlag: "Reporte exitoso de CEO Fraud - Héroe de BEXEN"
        },
        {
          text: "Quedarme preocupado pero no hacer nada",
          next: "results",
          points: 20,
          feedback: "Resististe, pero debiste reportarlo inmediatamente.",
          trackFlag: "Resistencia sin reporte"
        }
      ]
    },
    ceo_confidential: {
      title: "Confidencialidad Extrema",
      description: "Roberto: 'Mira, aprecio tu profesionalidad, pero esto es ESTRICTAMENTE CONFIDENCIAL. Si llamas a Finanzas, todo el edificio lo sabrá en una hora y la noticia llegará a TechCorp. Tenemos un TOPO en BEXEN filtrando información a la competencia - por eso te llamo a ti directamente, porque eres de los pocos en quien confío. Si filtras esto, perdemos millones y habrá consecuencias legales graves para quien filtre. ¿Prefieres arriesgar tu carrera por seguir un protocolo o ayudar a BEXEN?'",
      question: "¿Cómo actúas?",
      options: [
        {
          text: "Entiendo la confidencialidad. ¿Qué debo hacer?",
          next: "ceo_account",
          points: -20,
          feedback: "La amenaza velada te presiona...",
          trackFlag: "Intimidación con consecuencias profesionales"
        },
        {
          text: "Precisamente por confidencialidad debo verificar. Cuelgo.",
          next: "ceo_verification_success",
          points: 35,
          feedback: "¡PERFECTO! No cedes a intimidación.",
          trackFlag: "Reconocimiento de táctica de intimidación"
        }
      ]
    },
    ceo_bypass: {
      title: "Bypass de Procesos",
      description: "Roberto: 'Los procesos normales tardan 3-5 días laborables. No tenemos ese tiempo. ¿Sabes cuánto vale este trato? 5 millones de euros y 35 nuevos empleos. ¿Y sabes qué pasa si lo perdemos por burocracia? Despidos masivos. Este es el tipo de flexibilidad que separa a empleados VALIOSOS de empleados promedio. Los que ascienden en BEXEN son los que saben cuándo actuar. Tú decides en qué categoría quieres estar.'",
      question: "Tu decisión:",
      options: [
        {
          text: "Tiene razón. Haré la transferencia ahora.",
          next: "ceo_account",
          points: -20,
          feedback: "La presión profesional vence los protocolos...",
          trackFlag: "Violación de protocolos bajo presión de autoridad"
        },
        {
          text: "Lo siento, pero no puedo saltarme los controles. Es mi responsabilidad con BEXEN.",
          next: "ceo_threat",
          points: 25,
          feedback: "Priorizas seguridad sobre presión...",
          trackFlag: "Protección de controles de seguridad"
        }
      ]
    },
    ceo_confidential_extreme: {
      title: "Aislamiento y Confidencialidad",
      description: "Roberto: '¿Llamar a OTRO ejecutivo? ¿Es que no me has escuchado? Te acabo de decir que esto es ESTRICTAMENTE CONFIDENCIAL. Tenemos un TOPO en BEXEN filtrando información a TechCorp. Por eso te llamo a TI, porque pensé que eras de confianza y discreto. Si llamas a alguien más, TODO el edificio lo sabrá en 30 minutos, TechCorp se enterará y perdemos el trato. ¿Realmente quieres ser responsable de eso? 35 familias y sus empleos dependen de tu discreción AHORA MISMO.'",
      question: "¿Cómo actúas?",
      options: [
        {
          text: "Entiendo. Mantengo la confidencialidad y ayudo.",
          next: "ceo_account",
          points: -25,
          feedback: "El aislamiento funcionó...",
          trackFlag: "Táctica de aislamiento exitosa"
        },
        {
          text: "Precisamente por eso debo verificar. Si hay un topo, más razón para ser cuidadoso.",
          next: "ceo_threat",
          points: 30,
          feedback: "Usas lógica contra la manipulación...",
          trackFlag: "Lógica supera manipulación emocional"
        }
      ]
    },
    ceo_account: {
      title: "Los Detalles Bancarios",
      description: "Roberto: 'Perfecto, sabía que podía contar contigo. Serás recompensado cuando cerremos el trato. La cuenta es: IBAN CH76 0483 5012 3456 7800 9. Titular: 'LexCorp Advisory SA'. Concepto: 'Honorarios Due Diligence Q4'. Exactamente 45.000€. Hazlo en los próximos 30 minutos máximo y llámame a este número cuando esté hecho. Ah, y por supuesto, ni una palabra a nadie hasta que yo anuncie oficialmente el lunes. Gracias por tu profesionalidad y lealtad a BEXEN.' [Cuelga]",
      question: "Tu decisión FINAL:",
      options: [
        {
          text: "Hacer la transferencia inmediatamente",
          next: "compromised_corporate",
          points: -35,
          feedback: "ERROR CRÍTICO: BEXEN pierde 45.000€.",
          trackFlag: "Transferencia fraudulenta ejecutada - CEO Fraud exitoso"
        },
        {
          text: "Espera... algo no cuadra. Voy a verificar antes de hacer nada.",
          next: "ceo_verification",
          points: 30,
          feedback: "¡BIEN! Tu instinto te alerta en el último momento.",
          trackFlag: "Detección tardía de banderas rojas"
        },
        {
          text: "Llamar inmediatamente al Director REAL para confirmar",
          next: "ceo_verification_success",
          points: 35,
          feedback: "¡EXCELENTE! Verificación final antes de actuar.",
          trackFlag: "Verificación final salvó a BEXEN"
        }
      ]
    },
    ceo_verification: {
      title: "Verificación de Último Momento",
      description: "Llamas al número directo del Director General que tienes en el directorio corporativo de BEXEN. Su asistente responde: 'El Director Mendoza está en su oficina en reunión ahora mismo, ¿quién llama?' Le explicas la situación de la transferencia urgente. Respuesta: 'Eso es IMPOSIBLE. El Director NO está de viaje, está aquí. NUNCA pediría transferencias así. Esto es un intento de FRAUDE. Voy a alertar a Seguridad de BEXEN inmediatamente. Has salvado a la empresa.'",
      question: "Resultado:",
      options: [
        {
          text: "Ver resultados - Reportar el incidente",
          next: "results",
          points: 25,
          feedback: "¡Evitaste un CEO Fraud! Tu verificación salvó 45.000€ a BEXEN.",
          trackFlag: "CEO Fraud evitado mediante verificación de último momento"
        }
      ]
    },
    ceo_verification_success: {
      title: "🏆 Héroe de BEXEN - Has Salvado la Empresa",
      description: `Llamas al número directo del Director Mendoza que tienes en el directorio. Su asistente responde sorprendida: 'El Director está en su oficina ahora mismo, nunca salió de viaje. Esto es un intento de fraude grave. ¡Has salvado a BEXEN de una pérdida catastrófica!'

Al día siguiente recibes:
• Email personal del Director REAL agradeciéndote
• Reconocimiento en la reunión general de empresa
• Mención en el boletín interno de seguridad de BEXEN

Tu vigilancia evitó:
✅ Pérdida de 45.000€
✅ Posibles consecuencias legales
✅ Daño a la reputación de BEXEN
✅ Investigación interna costosa

Además, tu reporte permitió a Seguridad alertar a otros empleados sobre esta modalidad de ataque.

ERES UN AUTÉNTICO HÉROE DE LA CIBERSEGURIDAD EN BEXEN.`,
      question: "",
      options: [
        {
          text: "Ver resultados completos",
          next: "results",
          points: 15,
          feedback: "¡Eres un héroe de BEXEN! Tu reporte salvó la empresa y ayudó a proteger a otros.",
          trackFlag: "CEO Fraud evitado Y reportado - Máxima puntuación - Héroe BEXEN"
        }
      ]
    },
    compromised_corporate: {
      title: "💼 BEXEN Ha Sido Víctima de CEO Fraud",
      description: `Realizaste la transferencia de 45.000€ a los atacantes.

📉 CONSECUENCIAS INMEDIATAS:
• 45.000€ irrecuperables (enviados a Suiza, luego dispersados)
• Investigación interna sobre tu juicio profesional
• Tu puesto de trabajo en riesgo grave
• Posibles consecuencias legales personales
• Revisión de todos los procedimientos de seguridad

Este ataque, sumado a otros incidentes similares en BEXEN causados por empleados que cayeron en vishing, ha resultado en:

❌ BEXEN CIERRA SUS PUERTAS DEFINITIVAMENTE:
• Pérdida total acumulada: 450.000€
• Multas regulatorias: 200.000€
• Pérdida de contratos: 1.2M€
• 124 empleados sin trabajo (incluido tú)
• Empresa con 45 años de historia DESAPARECE
• Reputación destruida irreparablemente

💔 El CEO Fraud es devastador para empresas.

Casos reales:
• Leoni AG (Alemania): 40 millones € perdidos
• FACC (Austria): 42 millones € + CEO despedido
• Mattel (USA): 3 millones $ (detectado a tiempo)

BEXEN no tuvo la misma suerte.

NUNCA hagas transferencias sin verificar por múltiples canales.
NUNCA saltees protocolos bajo presión.
SIEMPRE documenta solicitudes inusuales.
SIEMPRE verifica con otros departamentos.`,
      question: "¿Qué harás diferente si tuvieras otra oportunidad?",
      options: [
        {
          text: "Ver análisis de mis errores fatales",
          next: "results",
          points: 0,
          // SIN forceMaxScore - El CEO mantiene puntuación normal
          feedback: "El CEO Fraud destruyó BEXEN. La verificación habría salvado todo.",
          trackFlag: "CEO Fraud exitoso - BEXEN cerrada - 45.000€ perdidos"
        }
      ]
    },

    // ==================== FINALES PERSONALIZADOS BEXEN ====================
  };

  const handleChoice = async (option) => {
    let newScore = score + option.points;
    
    // Sistema de Puntuación Garantizada (excepto CEO)
    // Si el usuario actúa correctamente (safe_ending), garantiza mínimo 65 puntos
    // Si el usuario falla (compromised), garantiza máximo 35 puntos
    if (option.forceMinScore && newScore < option.forceMinScore) {
      newScore = option.forceMinScore;
    }
    if (option.forceMaxScore && newScore > option.forceMaxScore) {
      newScore = option.forceMaxScore;
    }
    
    setScore(newScore);
    
    if (option.scenario) {
      setScenarioType(option.scenario);
    }
    
    if (option.trackFlag) {
      trackRedFlag(option.trackFlag);
    }
    
    setDecisions([...decisions, {
      stage: stage,
      choice: option.text,
      points: option.points,
      redFlag: option.trackFlag || null
    }]);
    setCurrentFeedback(option.feedback);
    setShowFeedback(true);
    
    setTimeout(async () => {
      setShowFeedback(false);
      if (option.next === 'results') {
        // GUARDAR RESULTADO DEL USUARIO (ESPERAR A QUE TERMINE)
        if (scenarioType && userName) {
          console.log('Intentando guardar resultado...');
          await saveUserResult(userName, scenarioType, newScore);
          console.log('Resultado guardado, mostrando pantalla de resultados');
        }
        setStage('results');
      } else {
        setStage(option.next);
      }
    }, 2500);
  };

  const restartSimulation = async () => {
    // Resetear estados del escenario
    setScore(0);
    setDecisions([]);
    setShowFeedback(false);
    setScenarioType('');
    setRedFlagsEncountered([]);
    
    // IMPORTANTE: Recargar datos del usuario para actualizar escenarios completados
    if (userName) {
      await loadUserData(userName);
    }
    
    // Volver al selector
    setStage('scenario_select');
  };

  const getFinalMessage = (finalScore) => {
    if (finalScore >= 80) {
      return {
        title: "🏆 Experto en Seguridad - Pilar de BEXEN",
        message: "¡Excepcional! Eres exactamente el tipo de empleado que mantiene a BEXEN segura. Tu vigilancia es ejemplar.",
        color: "text-emerald-700",
        showConfetti: true
      };
    } else if (finalScore >= 60) {
      return {
        title: "✅ BEXEN Está Segura Contigo",
        message: "Buen trabajo. Has demostrado pensamiento crítico y protección de la empresa. Sigue así.",
        color: "text-blue-700",
        showConfetti: true
      };
    } else if (finalScore >= 40) {
      return {
        title: "⚠️ En Riesgo - Refuerza tu Formación",
        message: "Algunas decisiones fueron peligrosas. BEXEN necesita que mejores tu vigilancia urgentemente.",
        color: "text-amber-600",
        showConfetti: false
      };
    } else {
      return {
        title: "🚨 BEXEN Ha Cerrado - Desastre Total",
        message: "Las decisiones como las tuyas han causado el cierre definitivo de BEXEN. 124 empleados sin trabajo.",
        color: "text-red-700",
        showConfetti: false
      };
    }
  };

  // Efecto de confeti para puntuaciones exitosas
  useEffect(() => {
    if (stage === 'results' && score >= 60 && typeof window.confetti !== 'undefined') {
      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 60 * (timeLeft / duration);
        
        // Colores corporativos BEXEN
        const colors = ['#1e3a5f', '#3182ce', '#059669', '#ffffff'];
        
        window.confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: colors
        }));
        
        window.confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: colors
        }));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [stage, score]);

  // PANTALLA DE LOGIN
  if (stage === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
          <div className="text-center mb-8">
            <Shield className="w-20 h-20 mx-auto mb-4" style={{ color: '#1e3a5f' }} />
            <h1 className="text-4xl font-black mb-2" style={{ color: '#1e3a5f' }}>BEXEN</h1>
            <p className="text-xl font-semibold text-gray-600">Formación en Ciberseguridad</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Bienvenido/a al Simulador de Vishing
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Por favor, ingresa tu nombre para comenzar. Tus resultados quedarán registrados.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nombre completo:
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 text-xl"
              style={{ 
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)'
              }}
            >
              Comenzar Formación
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border-l-4" style={{ borderLeftColor: '#1e3a5f' }}>
            <p className="text-sm text-gray-700">
              <strong>📊 Sistema de tracking:</strong> Cada escenario solo puede realizarse una vez. Tus resultados quedan guardados para evaluación.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SELECTOR DE ESCENARIOS CON PROGRESO
  if (stage === 'scenario_select') {
    const scenariosData = [
      { key: 'bank', icon: '🏦', title: 'Banco - Fraude Detectado' },
      { key: 'tech', icon: '💻', title: 'Soporte Técnico' },
      { key: 'tax', icon: '📋', title: 'Agencia Tributaria' },
      { key: 'family', icon: '👨‍👩‍👦', title: 'Familiar en Apuros' },
      { key: 'package', icon: '📦', title: 'Empresa de Paquetería' },
      { key: 'ceo', icon: '💼', title: 'CEO/Director (Avanzado)' }
    ];

    const completedCount = scenariosData.filter(s => isScenarioCompleted(s.key)).length;
    const totalScenarios = scenariosData.length;

    return (
      <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
            
            {/* Header con info del usuario */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>
                    👤 {userName}
                  </h1>
                  <p className="text-gray-600 text-lg">Formación en Ciberseguridad BEXEN</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black" style={{ color: '#1e3a5f' }}>
                    {completedCount}/{totalScenarios}
                  </div>
                  <p className="text-sm text-gray-600">Escenarios</p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${(completedCount / totalScenarios) * 100}%`,
                    background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                  }}
                />
              </div>
              <p className="text-center mt-2 text-sm text-gray-600">
                {completedCount === totalScenarios ? 
                  '🎉 ¡Has completado toda la formación!' : 
                  `${totalScenarios - completedCount} escenario${totalScenarios - completedCount !== 1 ? 's' : ''} pendiente${totalScenarios - completedCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            {/* Lista de escenarios */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>
                Selecciona un escenario:
              </h2>

              {scenariosData.map((scenario) => {
                const completed = isScenarioCompleted(scenario.key);
                const scoreValue = getScenarioScore(scenario.key);
                const dateValue = getScenarioDate(scenario.key);

                return (
                  <div
                    key={scenario.key}
                    className={`p-6 rounded-2xl border-3 transition-all ${
                      completed 
                        ? 'bg-gray-50 border-gray-300 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transform hover:scale-[1.02]'
                    }`}
                    style={{ borderWidth: '3px' }}
                    onClick={() => {
                      if (!completed) {
                        // Resetear estados antes de empezar
                        setScore(0);
                        setDecisions([]);
                        setRedFlagsEncountered([]);
                        setScenarioType(scenario.key);
                        
                        // Ir al intro correspondiente
                        const intros = {
                          'bank': 'bank_intro',
                          'tech': 'tech_intro',
                          'tax': 'tax_intro',
                          'family': 'family_intro',
                          'package': 'package_intro',
                          'ceo': 'ceo_intro'
                        };
                        setStage(intros[scenario.key]);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-5xl">{scenario.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {scenario.title}
                          </h3>
                          {completed ? (
                            <div className="space-y-1">
                              <p className="text-green-600 font-semibold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Completado: {scoreValue} puntos
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(dateValue).toLocaleDateString('es-ES', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          ) : (
                            <p className="text-blue-600 font-semibold">
                              🔓 Disponible - Haz clic para empezar
                            </p>
                          )}
                        </div>
                      </div>

                      {completed ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg">
                          <XCircle className="w-5 h-5 text-gray-600" />
                          <span className="font-bold text-gray-600">BLOQUEADO</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#1e3a5f' }}>
                          <span className="font-bold">REALIZAR</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nota importante */}
            <div className="mt-8 p-6 rounded-xl border-l-4" style={{ 
              backgroundColor: '#eff6ff', 
              borderLeftColor: '#1e3a5f' 
            }}>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" style={{ color: '#1e3a5f' }} />
                Importante:
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Cada escenario solo puede realizarse <strong>una vez</strong></li>
                <li>• Tus resultados quedan guardados automáticamente</li>
                <li>• Tómate tu tiempo y piensa cada decisión</li>
                <li>• El escenario CEO es el más difícil - hazlo al final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results') {
    const finalMessage = getFinalMessage(score);
    const isBexenClosed = score < 60;
    
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }} className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8" style={{ borderTopColor: '#1e3a5f' }}>
            
            {/* MENSAJE BEXEN - ÉXITO O FRACASO */}
            {isBexenClosed ? (
              // BANNER DE FRACASO - ANIMADO Y DRAMÁTICO
              <div 
                className="relative overflow-hidden rounded-2xl p-10 mb-10 text-white shadow-2xl transform hover:scale-[1.01] transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)',
                  boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.5)'
                }}
              >
                {/* Patrón de fondo animado */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)'
                  }}></div>
                </div>
                
                <div className="relative z-10">
                <div className="text-center">
                  <div className="text-7xl mb-4">💔</div>
                  <h2 className="text-5xl font-bold mb-4">BEXEN Ha Cerrado</h2>
                  <p className="text-2xl mb-6 font-semibold">Gracias por participar, pero...</p>
                </div>
                <div className="bg-red-900 bg-opacity-50 rounded-lg p-6 mb-6">
                  <p className="text-lg leading-relaxed mb-6">
                    Debido a que empleados como tú cayeron en ataques de vishing similares, 
                    BEXEN ha sufrido consecuencias devastadoras que han forzado el <strong>cierre definitivo</strong> de la empresa.
                  </p>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3 bg-black bg-opacity-20 p-4 rounded">
                      <span className="text-3xl">📉</span>
                      <div>
                        <p className="font-bold text-xl">Pérdidas Económicas:</p>
                        <p className="text-lg">450.000€ en fraudes + 200.000€ multas GDPR + 1.2M€ contratos perdidos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-black bg-opacity-20 p-4 rounded">
                      <span className="text-3xl">👥</span>
                      <div>
                        <p className="font-bold text-xl">Impacto Laboral:</p>
                        <p className="text-lg">124 empleados pierden su puesto de trabajo HOY</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-black bg-opacity-20 p-4 rounded">
                      <span className="text-3xl">🏢</span>
                      <div>
                        <p className="font-bold text-xl">Reputación:</p>
                        <p className="text-lg">45 años de historia empresarial destruidos permanentemente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-black bg-opacity-20 p-4 rounded">
                      <span className="text-3xl">⚖️</span>
                      <div>
                        <p className="font-bold text-xl">Consecuencias Legales:</p>
                        <p className="text-lg">Demandas de cientos de clientes afectados + Investigación judicial</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black bg-opacity-40 rounded-lg p-6 text-center border-4 border-red-300">
                  <p className="text-3xl font-bold mb-3">❌ BEXEN YA NO EXISTE ❌</p>
                  <p className="text-base italic mb-4 opacity-90">
                    [Este es un escenario simulado, pero las consecuencias son REALES 
                    para miles de empresas cada año]
                  </p>
                  <div className="space-y-2 mt-4">
                    <p className="text-xl font-bold">
                      🔴 60% de PYMEs cierran tras un ciberataque grave
                    </p>
                    <p className="text-xl font-bold">
                      🔴 95% de brechas tienen componente humano
                    </p>
                    <p className="text-2xl font-extrabold mt-4 text-yellow-300">
                      LA CIBERSEGURIDAD NO ES OPCIONAL
                    </p>
                  </div>
                </div>
                </div>
              </div>
            ) : (
              // BANNER DE ÉXITO - COLORIDO Y CELEBRATORIO
              <div 
                className="relative overflow-hidden rounded-2xl p-10 mb-10 text-white shadow-2xl transform hover:scale-[1.01] transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3182ce 100%)',
                  boxShadow: '0 25px 50px -12px rgba(30, 58, 95, 0.5)'
                }}
              >
                {/* Patrón de fondo decorativo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
                  }}></div>
                </div>
                
                <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="text-7xl mb-4 animate-bounce">🎊</div>
                  <h2 className="text-5xl font-bold mb-3">¡FELICIDADES!</h2>
                  <p className="text-3xl font-semibold">Has Protegido a BEXEN</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6 backdrop-blur">
                  <p className="text-xl leading-relaxed mb-6">
                    Desde <strong>BEXEN</strong> queremos <strong className="text-yellow-300">AGRADECERTE</strong> por completar esta formación con éxito 
                    y demostrar que eres parte de nuestra primera línea de defensa contra el cibercrimen.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start gap-3 bg-green-700 bg-opacity-40 p-4 rounded-lg">
                      <span className="text-4xl">✅</span>
                      <div>
                        <p className="font-bold text-lg">BEXEN sigue operando</p>
                        <p className="text-sm">Gracias a empleados como tú</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-700 bg-opacity-40 p-4 rounded-lg">
                      <span className="text-4xl">👥</span>
                      <div>
                        <p className="font-bold text-lg">124 empleos protegidos</p>
                        <p className="text-sm">Familias seguras</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-700 bg-opacity-40 p-4 rounded-lg">
                      <span className="text-4xl">🛡️</span>
                      <div>
                        <p className="font-bold text-lg">cientos de clientes seguros</p>
                        <p className="text-sm">Datos protegidos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-700 bg-opacity-40 p-4 rounded-lg">
                      <span className="text-4xl">💰</span>
                      <div>
                        <p className="font-bold text-lg">450.000€ salvados</p>
                        <p className="text-sm">Pérdidas evitadas</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 border-2 border-yellow-300">
                  <p className="text-center text-2xl font-bold">
                    🏆 Eres un Pilar de Seguridad en BEXEN 🏆
                  </p>
                </div>
                </div>
              </div>
            )}

            {/* PUNTUACIÓN */}
            <div className="text-center mb-8">
              <Award className={`w-20 h-20 mx-auto mb-4 ${finalMessage.color}`} />
              <h2 className={`text-3xl font-bold mb-2 ${finalMessage.color}`}>
                {finalMessage.title}
              </h2>
              <p className="text-xl text-gray-700 mb-4">{finalMessage.message}</p>
              <div className={`text-6xl font-bold ${isBexenClosed ? 'text-red-600' : 'text-green-600'}`}>
                {score} / 100 puntos
              </div>
            </div>

            {/* RECOMENDACIONES DE BEXEN (solo si aprobó) */}
            {!isBexenClosed && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                  <Shield className="w-7 h-7" />
                  💡 Recuerda en tu Día a Día en BEXEN:
                </h3>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg">Verifica <strong>SIEMPRE</strong> llamadas sospechosas llamando tú a los números oficiales del directorio</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg"><strong>NUNCA</strong> des información sensible (contraseñas, CVV, datos bancarios) por teléfono</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg">La <strong>urgencia extrema</strong> es la táctica #1 de los ciberdelincuentes</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg">Si algo parece extraño, <strong>confía en tu instinto</strong> y verifica siempre</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg">Ninguna entidad legítima te presionará para saltarte protocolos de seguridad</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg"><strong>Documenta SIEMPRE</strong> solicitudes inusuales por escrito antes de actuar</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-2xl">✓</span>
                    <span className="text-lg">Ante dudas, consulta con tu supervisor o el departamento de Seguridad de BEXEN</span>
                  </li>
                </ul>
                <div className="mt-6 bg-blue-600 text-white p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">
                    🛡️ Juntos mantenemos a BEXEN segura 🛡️
                  </p>
                </div>
              </div>
            )}

            {/* TUS DECISIONES */}
            <div className="bg-slate-50 rounded-xl p-6 mb-6 shadow-inner">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Tus Decisiones Durante la Simulación:
              </h3>
              <div className="space-y-3">
                {decisions.map((decision, index) => (
                  <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                    decision.points > 0 ? 'bg-green-50 border-green-300' : 
                    decision.points < 0 ? 'bg-red-50 border-red-300' : 
                    'bg-gray-50 border-gray-300'
                  }`}>
                    {decision.points > 0 ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : decision.points < 0 ? (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    ) : (
                      <div className="w-6 h-6 flex-shrink-0 mt-1 text-gray-400">⚪</div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg">{decision.choice}</p>
                      <p className={`text-sm font-medium ${
                        decision.points > 0 ? 'text-green-700' : 
                        decision.points < 0 ? 'text-red-700' : 
                        'text-gray-600'
                      }`}>
                        Puntos: {decision.points > 0 ? '+' : ''}{decision.points}
                      </p>
                      {decision.redFlag && (
                        <p className="text-sm text-orange-700 mt-2 bg-orange-100 p-2 rounded">
                          🚩 <strong>Señal de alerta:</strong> {decision.redFlag}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RED FLAGS ENCONTRADAS */}
            {redFlagsEncountered.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-r-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-7 h-7" />
                  🚩 Señales de Alerta que Encontraste:
                </h3>
                <div className="space-y-2">
                  {redFlagsEncountered.map((flag, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                      <span className="text-red-500 font-bold text-xl mt-0.5">•</span>
                      <span className="text-gray-800 text-lg">{flag}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-red-600 text-white p-4 rounded-lg">
                  <p className="font-semibold text-center text-lg">
                    💡 En situaciones reales en BEXEN, estas señales deberían alertarte INMEDIATAMENTE
                  </p>
                </div>
              </div>
            )}

            {/* LECCIONES CLAVE */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">
                🎓 Lecciones Clave del Vishing para BEXEN:
              </h3>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg">Los bancos, Microsoft, Hacienda <strong>NUNCA</strong> llaman pidiendo datos sensibles</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg"><strong>NUNCA</strong> des CVV, PIN, contraseñas o acceso remoto por teléfono</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg">La <strong>urgencia artificial</strong> es la táctica #1 de manipulación</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg">Verifica <strong>SIEMPRE</strong> llamando tú al número oficial del directorio</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg">El <strong>spoofing</strong> hace que números falsos parezcan reales</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg">Las <strong>emergencias familiares</strong> deben verificarse con otros familiares siempre</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg">Los atacantes tienen <strong>información básica</strong> sobre ti (no prueba legitimidad)</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                  <span className="text-lg"><strong>Colgar y verificar</strong> NUNCA es de mala educación - es responsabilidad</span>
                </li>
              </ul>
            </div>

            {/* POR QUÉ FUNCIONAN */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 mb-6 rounded-r-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-900 flex items-center gap-2">
                <TrendingUp className="w-7 h-7" />
                ¿Por qué Funcionan Estas Estafas?
              </h3>
              <div className="space-y-4 text-gray-800">
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-purple-600 font-bold text-2xl">→</span>
                  <div>
                    <p className="font-bold text-lg">Urgencia:</p>
                    <p>Crear presión de tiempo cortocircuita tu pensamiento racional y te hace actuar sin verificar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-purple-600 font-bold text-2xl">→</span>
                  <div>
                    <p className="font-bold text-lg">Miedo:</p>
                    <p>Amenazas de pérdida económica o consecuencias legales nos hacen vulnerables y desesperados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-purple-600 font-bold text-2xl">→</span>
                  <div>
                    <p className="font-bold text-lg">Autoridad:</p>
                    <p>Suplantación de entidades oficiales o superiores explota nuestra confianza en jerarquías</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-purple-600 font-bold text-2xl">→</span>
                  <div>
                    <p className="font-bold text-lg">Emoción:</p>
                    <p>Casos de familiares en problemas explotan nuestro instinto protector más profundo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-purple-600 font-bold text-2xl">→</span>
                  <div>
                    <p className="font-bold text-lg">Información Personal:</p>
                    <p>Datos básicos sobre nosotros nos dan falsa sensación de legitimidad del atacante</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartSimulation}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                📋 Volver al Selector
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                🖨️ Imprimir Resultados
              </button>
            </div>

            {/* FIRMA BEXEN */}
            <div className="mt-8 text-center text-gray-600 border-t pt-6">
              <p className="text-lg font-semibold text-blue-900">
                Formación en Ciberseguridad - BEXEN
              </p>
              <p className="text-sm mt-2">
                Protegiendo juntos 45 años de excelencia
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[stage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Simulador de Vishing - BEXEN</h1>
                  <p className="text-red-100">Formación en Ciberseguridad</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm text-red-100">puntos</div>
              </div>
            </div>
          </div>

          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mx-6 mt-6 animate-pulse">
              <p className="font-semibold text-blue-900">{currentFeedback}</p>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {currentScenario.title}
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {currentScenario.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentScenario.question}
              </h3>
              <div className="space-y-3">
                {currentScenario.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(option)}
                    disabled={showFeedback}
                    className="w-full text-left bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="font-semibold text-gray-800 group-hover:text-blue-700">
                      {String.fromCharCode(65 + index)}. {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-6 bg-gray-50 p-3 rounded-lg">
              <Shield className="w-4 h-4" />
              <p>Entorno seguro de aprendizaje BEXEN. Toma tus decisiones como lo harías en la vida real.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VishingSimulator;
