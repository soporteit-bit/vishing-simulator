import React, { useState } from 'react';
import { AlertTriangle, Phone, Shield, XCircle, CheckCircle, Award, TrendingUp } from 'lucide-react';

const VishingSimulator = () => {
  const [stage, setStage] = useState('scenario_select');
  const [score, setScore] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [scenarioType, setScenarioType] = useState('');
  const [redFlagsEncountered, setRedFlagsEncountered] = useState([]);

  const trackRedFlag = (flag) => {
    if (!redFlagsEncountered.includes(flag)) {
      setRedFlagsEncountered([...redFlagsEncountered, flag]);
    }
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
          next: "safe_ending",
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
          next: "bank_persistence",
          points: 20,
          feedback: "Buena decisión de verificar...",
          trackFlag: "Solicitud de verificación rechazada"
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
          next: "safe_ending",
          points: 25,
          feedback: "¡BIEN! Proponer verificación presencial es excelente.",
          trackFlag: "El atacante abandona ante verificación presencial"
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
          next: "safe_ending",
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
          next: "compromised",
          points: -25,
          feedback: "ERROR CRÍTICO: Nunca des CVV por teléfono.",
          trackFlag: "Solicitud de CVV por teléfono (RED FLAG CRÍTICA)"
        },
        {
          text: "Espera, el banco nunca pide el CVV. Cuelgo.",
          next: "safe_ending",
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
    bank_persistence: {
      title: "Insistencia Profesional",
      description: "Carlos: 'Claro, entiendo su precaución, es muy inteligente. El número de referencia es BCN-2024-8473. De todas formas, si llama usted, le van a dirigir de nuevo a este departamento y perderá tiempo. Los cargos se aprobarán en 20 minutos si no actuamos ahora. ¿Seguro que no prefiere resolverlo ahora conmigo? Solo serán 2 minutos.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Tiene razón, mejor lo resolvemos ahora",
          next: "bank_data_request",
          points: -10,
          feedback: "La urgencia te presionó...",
          trackFlag: "Presión temporal como táctica de manipulación"
        },
        {
          text: "No, prefiero verificar. Adiós.",
          next: "safe_ending",
          points: 30,
          feedback: "¡PERFECTO! No cediste a la presión.",
          trackFlag: "Resistencia a tácticas de urgencia"
        },
        {
          text: "Ok, pero solo confirmo algunos datos, no todo",
          next: "bank_data_request",
          points: -5,
          feedback: "Empiezas a ceder...",
          trackFlag: "Concesión gradual bajo presión"
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
          next: "safe_ending",
          points: 30,
          feedback: "¡EXCELENTE! No importa lo convincente que parezca.",
          trackFlag: "Verificación independiente a pesar de 'pruebas'"
        },
        {
          text: "Vale, dígame mi saldo entonces",
          next: "bank_more_info",
          points: 5,
          feedback: "Sigues en la llamada...",
          trackFlag: "Prolongación de la conversación"
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
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Tu instinto te salvó.",
          trackFlag: "Confianza en el instinto ante explicaciones dudosas"
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
          next: "compromised",
          points: -30,
          feedback: "ERROR CRÍTICO: Los bancos NUNCA piden CVV.",
          trackFlag: "Solicitud de CVV (NUNCA legítima por teléfono)"
        },
        {
          text: "Un momento... el banco nunca pide el CVV. Cuelgo.",
          next: "safe_ending",
          points: 35,
          feedback: "¡PERFECTO! Reconociste la red flag crítica.",
          trackFlag: "Reconocimiento tardío pero efectivo"
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
          next: "compromised",
          points: -25,
          feedback: "Cediste a la presión final.",
          trackFlag: "Presión extrema de tiempo límite"
        },
        {
          text: "No. Cuelgo ahora mismo.",
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Resististe hasta el final.",
          trackFlag: "Resistencia exitosa a presión extrema"
        }
      ]
    },
    bank_more_info: {
      title: "Más Información Personal",
      description: "Carlos: 'Su saldo actual es de 1.247,83 euros. ¿Ve? Tengo acceso a todo. Ahora, para continuar con el bloqueo, necesito confirmar los datos de su tarjeta...'",
      question: "¿Qué haces ahora?",
      options: [
        {
          text: "Ok, ya me fío. ¿Qué datos necesita?",
          next: "bank_data_request",
          points: -10,
          feedback: "La información correcta te dio falsa confianza...",
          trackFlag: "Datos bancarios básicos usados para credibilidad"
        },
        {
          text: "Voy a verificar esto. Cuelgo y llamo yo al banco",
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Mantuviste tu decisión de verificar.",
          trackFlag: "Persistencia en verificación independiente"
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
          next: "safe_ending",
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
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Verificación a través de fuentes confiables.",
          trackFlag: "Buscar ayuda profesional conocida"
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
          next: "safe_ending",
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
          next: "safe_ending",
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
          next: "safe_ending",
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
          next: "compromised",
          points: -25,
          feedback: "ERROR: Nunca pagues en llamadas no solicitadas.",
          trackFlag: "Solicitud de pago inmediato + falsa urgencia"
        },
        {
          text: "No voy a pagar nada. Cuelgo.",
          next: "safe_ending",
          points: 30,
          feedback: "¡PERFECTO! Nunca pagues en estas situaciones.",
          trackFlag: "Rechazo a pagos no verificados"
        }
      ]
    },
    compromised_tech: {
      title: "💻 Sistema Comprometido",
      description: "Le diste acceso remoto al atacante. Ahora tiene control total de tu ordenador. Puede ver tus contraseñas guardadas, instalar keyloggers, acceder a tus archivos, y robar tu información bancaria. El daño puede ser masivo.",
      question: "Consecuencias:",
      options: [
        {
          text: "Ver resultados",
          next: "results",
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
          next: "safe_ending",
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
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Verificación presencial es lo correcto.",
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
          next: "safe_ending",
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
          next: "safe_ending",
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
          next: "compromised",
          points: -30,
          feedback: "ERROR: Hacienda nunca cobra por teléfono así.",
          trackFlag: "Solicitud de pago con tarjeta por teléfono"
        },
        {
          text: "¿Paysafecard? Eso no es normal. Cuelgo.",
          next: "safe_ending",
          points: 35,
          feedback: "¡EXCELENTE! Hacienda nunca pide Paysafecard.",
          trackFlag: "Solicitud de pago con método no rastreable"
        },
        {
          text: "Voy a pagar en la web oficial de Hacienda",
          next: "safe_ending",
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
          next: "safe_ending",
          points: 35,
          feedback: "¡PERFECTO! Verificar con otros familiares es clave.",
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
          next: "safe_ending",
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
          next: "safe_ending",
          points: 30,
          feedback: "¡PERFECTO! Verificación familiar.",
          trackFlag: "Verificación independiente con familia"
        }
      ]
    },
    family_police: {
      title: "Bloqueo al Contacto",
      description: "Voz molesta: 'No puedes hablar con ellos ahora, están ocupados. Mira, si no confías en mí, olvídalo. Supongo que prefie res que tu nieto vaya a prisión. Pensé que podía contar contigo...' [Cuelga]",
      question: "¿Qué haces después de que cuelgue?",
      options: [
        {
          text: "Llamo a mi hijo/hija para verificar",
          next: "safe_ending",
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
          next: "safe_ending",
          points: 30,
          feedback: "¡EXCELENTE! La verificación personal funcionó.",
          trackFlag: "Verificación exitosa expone el fraude"
        }
      ]
    },
    compromised_money: {
      title: "💸 Dinero Perdido",
      description: "Enviaste 3.000€ a un estafador. Tu familiar real está perfectamente bien. El dinero es irrecuperable. Los estafadores usaron ingeniería social y manipulación emocional. Siempre verifica con otros miembros de la familia antes de enviar dinero.",
      question: "Lección aprendida:",
      options: [
        {
          text: "Ver resultados",
          next: "results",
          points: 0,
          feedback: "Las estafas familiares explotan nuestras emociones más profundas.",
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
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Pago presencial es más seguro.",
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
          next: "safe_ending",
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
          next: "safe_ending",
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
          next: "safe_ending",
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
          next: "compromised",
          points: -25,
          feedback: "ERROR: Correos nunca cobra así por teléfono.",
          trackFlag: "Solicitud de datos de tarjeta por teléfono"
        },
        {
          text: "Correos no cobra por teléfono. Esto es fraude. Cuelgo.",
          next: "safe_ending",
          points: 35,
          feedback: "¡EXCELENTE! Reconociste el fraude.",
          trackFlag: "Reconocimiento de método de pago fraudulento"
        },
        {
          text: "Voy a pagar en la web oficial de Correos",
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! Solo usa canales oficiales.",
          trackFlag: "Uso de canal oficial de pago"
        }
      ]
    },

    // ==================== ESCENARIO 6: CEO FRAUD (CORPORATIVO) ====================
    ceo_intro: {
      title: "📞 Llamada del Despacho del Director",
      description: "Recibes una llamada. Identificador: 'Dir. General - Ext. 101'. Voz autoritaria pero cordial: 'Hola, soy Roberto Mendoza, el Director General. Disculpa que te llame directamente, pero estoy en el aeropuerto camino a una reunión con inversores y necesito tu ayuda urgente con un tema delicado. ¿Tienes un momento? Es importante.'",
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
          next: "safe_ending",
          points: 35,
          feedback: "¡PERFECTO! Verificación a través de canales oficiales.",
          trackFlag: "Verificación correcta ante solicitud inusual"
        }
      ]
    },
    ceo_urgent: {
      title: "La Situación Urgente",
      description: "Roberto: 'Gracias. Mira, estamos cerrando una adquisición confidencial de una empresa competidora. NADIE puede saberlo aún, ni siquiera el CFO - lo sabrá mañana. Necesito que hagas una transferencia de 45.000€ hoy mismo a la cuenta de nuestros asesores legales en Suiza. Es para pagar honorarios del due diligence. Si no se paga hoy, perdemos el trato y meses de trabajo.'",
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
      title: "Presión con Profesionalidad",
      description: "Roberto: 'Entiendo tu precaución, es lo correcto. Pero estoy literalmente embarcando en 10 minutos y mi móvil corporativo está sin batería - por eso llamo desde el fijo del lounge VIP del aeropuerto. Mira, si quieres verificar, llama a mi asistente María... aunque está en reunión y no podrá atender hasta en 2 horas. Para entonces ya habré perdido el trato de 2 millones. ¿Confías en mí o no?'",
      question: "¿Qué decides?",
      options: [
        {
          text: "Tiene razón, confío. Dígame qué hacer.",
          next: "ceo_account",
          points: -15,
          feedback: "La presión profesional funciona...",
          trackFlag: "Presión emocional con urgencia temporal"
        },
        {
          text: "Prefiero esperar las 2 horas y verificar. Lo siento.",
          next: "safe_ending",
          points: 30,
          feedback: "¡BIEN! No cedes ante presión de autoridad.",
          trackFlag: "Resistencia a presión de figura de autoridad"
        },
        {
          text: "Le envío un email para tener todo documentado",
          next: "ceo_no_email",
          points: 20,
          feedback: "Buscas dejar rastro escrito...",
          trackFlag: "Intento de documentación de solicitud"
        }
      ]
    },
    ceo_confidential: {
      title: "Confidencialidad Extrema",
      description: "Roberto: 'Mira, aprecio tu profesionalidad, pero esto es ESTRICTAMENTE CONFIDENCIAL. Si llamas a Finanzas, todo el edificio lo sabrá en una hora. Tenemos un topo filtrando info a la competencia - por eso te llamo a TI, porque confío en ti. Si filtras esto, perdemos millones y habría consecuencias legales graves. ¿Prefieres arriesgar tu carrera por seguir un protocolo o ayudar a la empresa?'",
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
          next: "safe_ending",
          points: 35,
          feedback: "¡PERFECTO! No cedes a intimidación.",
          trackFlag: "Reconocimiento de táctica de intimidación"
        }
      ]
    },
    ceo_bypass: {
      title: "Bypass de Procesos",
      description: "Roberto: 'Los procesos normales tardan 3-5 días. No tenemos ese tiempo. ¿Sabes cuánto vale este trato? 2 millones de euros. ¿Y sabes qué pasa si lo perdemos por burocracia? Despidos. Este es el tipo de flexibilidad que separa a empleados valiosos de empleados promedio. Tú decides en qué categoría quieres estar.'",
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
          text: "Lo siento, pero no puedo saltarme los controles. Es mi responsabilidad.",
          next: "safe_ending",
          points: 35,
          feedback: "¡EXCELENTE! Priorizas seguridad sobre presión.",
          trackFlag: "Protección de controles de seguridad"
        }
      ]
    },
    ceo_no_email: {
      title: "Evitar Rastro Escrito",
      description: "Roberto: 'NO. Nada por email. Te acabo de explicar que hay un topo. Si envías un email, se filtra y perdemos todo. Esta es una operación verbal únicamente. Confío en tu criterio y discreción. Si no confías en mí, dilo ahora y buscaré a alguien más confiable. Tu elección.'",
      question: "¿Qué haces?",
      options: [
        {
          text: "Entendido, sin email. Procedo con la transferencia.",
          next: "ceo_account",
          points: -20,
          feedback: "Aceptas operar sin documentación...",
          trackFlag: "Operación financiera sin documentación"
        },
        {
          text: "Sin documentación escrita, no puedo proceder. Lo siento.",
          next: "safe_ending",
          points: 35,
          feedback: "¡PERFECTO! Documentación es esencial.",
          trackFlag: "Insistencia en documentación adecuada"
        }
      ]
    },
    ceo_account: {
      title: "Los Detalles Bancarios",
      description: "Roberto: 'Perfecto, sabía que podía contar contigo. La cuenta es: IBAN CH76 0483 5012 3456 7800 9. Titular: 'LexCorp Advisory SA'. Concepto: 'Honorarios Q4'. Exactamente 45.000€. Hazlo en los próximos 30 minutos y llámame a este número cuando esté hecho. Ah, y por supuesto, ni una palabra a nadie hasta mañana. Gracias por tu profesionalidad.' [Cuelga]",
      question: "Tu decisión final:",
      options: [
        {
          text: "Hacer la transferencia inmediatamente",
          next: "compromised_corporate",
          points: -35,
          feedback: "ERROR CRÍTICO: Nunca hagas transferencias sin verificar.",
          trackFlag: "Transferencia fraudulenta sin verificación (CEO Fraud)"
        },
        {
          text: "Espera... algo no cuadra. Voy a verificar antes de hacer nada.",
          next: "ceo_verification",
          points: 30,
          feedback: "¡BIEN! Tu instinto te alerta.",
          trackFlag: "Detección tardía de banderas rojas"
        },
        {
          text: "Llamar inmediatamente al Director REAL para confirmar",
          next: "safe_ending",
          points: 35,
          feedback: "¡EXCELENTE! Verificación final antes de actuar.",
          trackFlag: "Verificación final salvó la situación"
        }
      ]
    },
    ceo_verification: {
      title: "Verificación Crítica",
      description: "Llamas al número directo del Director General que tienes en el directorio corporativo. Su asistente responde: 'El Director Mendoza está en la oficina en reunión, ¿quién llama?' Le explicas la situación. Respuesta: 'Eso es imposible. El Director NO está de viaje y NUNCA pediría transferencias así. Esto es fraude. Voy a alertar a Seguridad inmediatamente.'",
      question: "Resultado:",
      options: [
        {
          text: "Ver resultados",
          next: "safe_ending",
          points: 25,
          feedback: "¡Evitaste un CEO Fraud! Tu verificación salvó 45.000€ a la empresa.",
          trackFlag: "CEO Fraud evitado mediante verificación"
        }
      ]
    },
    compromised_corporate: {
      title: "💼 Fraude Corporativo Exitoso",
      description: "Realizaste la transferencia de 45.000€. Al día siguiente descubres que fue un fraude. No era el Director General. Los atacantes investigaron la empresa, conocían nombres, jerarquías, y hasta el número de extensión de directorio. El dinero fue enviado a una cuenta en Suiza y luego dispersado. Es irrecuperable. Habrá investigación interna, posibles consecuencias laborales y un caso con las autoridades que durará meses. El CEO Fraud es uno de los ataques más costosos y sofisticados contra empresas.",
      question: "Lección aprendida:",
      options: [
        {
          text: "Ver mis resultados",
          next: "results",
          points: 0,
          feedback: "El CEO Fraud causó pérdidas graves. SIEMPRE verifica solicitudes financieras inusuales.",
          trackFlag: "Víctima de CEO Fraud - 45.000€ perdidos"
        }
      ]
    },

    // ==================== FINALES ====================
    compromised: {
      title: "💔 Información Comprometida",
      description: "Proporcionaste datos sensibles al atacante. Ahora tienen acceso a tu información bancaria y pueden realizar cargos fraudulentos. Deberás llamar a tu banco, bloquear la tarjeta, y vigilar tus cuentas durante meses. El proceso será estresante y largo.",
      question: "Lección aprendida:",
      options: [
        {
          text: "Ver mis resultados",
          next: "results",
          points: 0,
          feedback: "En la vida real, recuperar tu seguridad puede llevar meses.",
          trackFlag: "Datos bancarios comprometidos"
        }
      ]
    },
    safe_ending: {
      title: "🛡️ ¡Protegido!",
      description: "Has evitado el ataque exitosamente. Tomaste decisiones inteligentes y protegiste tu información. El atacante buscará a otra víctima más vulnerable. Tu precaución te ha salvado.",
      question: "",
      options: [
        {
          text: "Ver mis resultados",
          next: "results",
          points: 10,
          feedback: "¡Excelente trabajo! Has demostrado pensamiento crítico.",
          trackFlag: "Ataque evitado exitosamente"
        }
      ]
    }
  };

  const handleChoice = (option) => {
    const newScore = score + option.points;
    setScore(newScore);
    
    // Track scenario type
    if (option.scenario) {
      setScenarioType(option.scenario);
    }
    
    // Track red flags if present
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
    
    setTimeout(() => {
      setShowFeedback(false);
      if (option.next === 'results') {
        setStage('results');
      } else {
        setStage(option.next);
      }
    }, 2500);
  };

  const restartSimulation = () => {
    setStage('scenario_select');
    setScore(0);
    setDecisions([]);
    setShowFeedback(false);
    setScenarioType('');
    setRedFlagsEncountered([]);
  };

  const getFinalMessage = (finalScore) => {
    if (finalScore >= 60) {
      return {
        title: "🏆 Experto en Seguridad",
        message: "¡Excelente! Has tomado las mejores decisiones. Sabes identificar y evitar ataques de vishing.",
        color: "text-green-600"
      };
    } else if (finalScore >= 30) {
      return {
        title: "✅ Bien Protegido",
        message: "Buen trabajo. Tomaste decisiones mayormente correctas, pero siempre hay margen de mejora.",
        color: "text-blue-600"
      };
    } else if (finalScore >= 0) {
      return {
        title: "⚠️ En Riesgo",
        message: "Algunas decisiones te pusieron en peligro. Repasa las señales de alerta.",
        color: "text-yellow-600"
      };
    } else {
      return {
        title: "🚨 Comprometido",
        message: "Las decisiones tomadas resultaron en una brecha de seguridad. ¡Aprende de este ejercicio!",
        color: "text-red-600"
      };
    }
  };

  if (stage === 'results') {
    const finalMessage = getFinalMessage(score);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Award className={`w-20 h-20 mx-auto mb-4 ${finalMessage.color}`} />
              <h2 className={`text-3xl font-bold mb-2 ${finalMessage.color}`}>
                {finalMessage.title}
              </h2>
              <p className="text-xl text-gray-700 mb-4">{finalMessage.message}</p>
              <div className="text-5xl font-bold text-gray-800">
                Puntuación: {score} / 100
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Tus Decisiones:
              </h3>
              <div className="space-y-3">
                {decisions.map((decision, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                    {decision.points > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{decision.choice}</p>
                      <p className="text-sm text-gray-600">
                        Puntos: {decision.points > 0 ? '+' : ''}{decision.points}
                      </p>
                      {decision.redFlag && (
                        <p className="text-xs text-orange-600 mt-1">
                          🚩 {decision.redFlag}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags Analysis */}
            {redFlagsEncountered.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
                <h3 className="text-xl font-semibold mb-3 text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  🚩 Señales de Alerta que Encontraste:
                </h3>
                <ul className="space-y-2">
                  {redFlagsEncountered.map((flag, index) => (
                    <li key={index} className="text-red-700 flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-red-800 mt-4 font-medium">
                  💡 En la vida real, estas señales deberían haberte alertado inmediatamente.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-900">
                🎓 Lecciones Clave del Vishing:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Los bancos, Microsoft, Hacienda NUNCA llaman pidiendo datos sensibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>NUNCA des CVV, PIN, contraseñas o acceso remoto por teléfono</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>La urgencia artificial es la táctica #1 de manipulación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Verifica SIEMPRE llamando tú al número oficial o visitando en persona</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>El spoofing hace que números falsos parezcan reales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Las emergencias familiares deben verificarse con otros familiares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Los atacantes tienen información básica sobre ti (no prueba nada)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Colgar y verificar NUNCA es de mala educación</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                ¿Por qué Funcionan Estas Estafas?
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold text-lg">→</span>
                  <span><strong>Urgencia:</strong> Crear presión de tiempo cortocircuita tu pensamiento racional</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold text-lg">→</span>
                  <span><strong>Miedo:</strong> Amenazas de pérdida o consecuencias legales nos hacen vulnerables</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold text-lg">→</span>
                  <span><strong>Autoridad:</strong> Suplantación de entidades oficiales explota nuestra confianza</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold text-lg">→</span>
                  <span><strong>Emoción:</strong> Los casos de familiares explotan nuestro instinto protector</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold text-lg">→</span>
                  <span><strong>Información personal:</strong> Datos básicos nos dan falsa sensación de legitimidad</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartSimulation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                🔄 Probar Otro Escenario
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                🖨️ Imprimir Resultados
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[stage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Simulador de Vishing</h1>
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
              <p>Entorno seguro de aprendizaje. Toma tus decisiones como lo harías en la vida real.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VishingSimulator;