/**
 * Modelos de datos para La Ruta Blanca (Sucre, Bolivia)
 * Desacoplado para sincronización con Firebase Firestore y Geolocation API.
 */

export const USER_INITIAL_STATE = {
  nombre: "Explorador Chuquisaqueño",
  puntos: 150,
  rango: "Explorador Novato",
  totalCartas: 10,
  cartasDesbloqueadasIds: ["casa-de-la-libertad"],
  ubicacionActual: {
    nombre: "Plaza 25 de Mayo (Centro)",
    lat: -19.0478,
    lng: -65.2595
  }
}

/**
 * Tarjetas de Datos Curiosos ("Sabías que...") para el carrusel principal
 */
export const DATOS_CURIOSOS_MOCK = [
  {
    id: "dato-recoleta",
    badge: "DATO DEL DÍA",
    icono: "park",
    textoPrefix: "¿Sabías que el milenario cedro de ",
    textoDestacado: "La Recoleta",
    textoSuffix: " tiene siglos de historia y custodia el mirador más icónico de la ciudad blanca?",
    ubicacion: "Mirador de La Recoleta",
    gradiente: "from-[#BA0C2F] via-[#8C0720] to-[#002855]"
  },
  {
    id: "dato-casa-libertad",
    badge: "HISTORIA VIVA",
    icono: "history_edu",
    textoPrefix: "El ",
    textoDestacado: "Acta de la Independencia",
    textoSuffix: " te espera en la Casa de la Libertad intacta desde su firma el 6 de agosto de 1825.",
    ubicacion: "Plaza 25 de Mayo",
    gradiente: "from-[#002855] via-[#103a6b] to-[#1E293B]"
  },
  {
    id: "dato-glorieta",
    badge: "REALEZA BOLIVIANA",
    icono: "castle",
    textoPrefix: "En el fabuloso ",
    textoDestacado: "Castillo de La Glorieta",
    textoSuffix: " vivieron Don Francisco y Doña Clotilde, los únicos príncipes en la historia de Bolivia.",
    ubicacion: "Carretera a Yotala",
    gradiente: "from-[#1E293B] via-[#4A0E17] to-[#BA0C2F]"
  },
  {
    id: "dato-cal-orcko",
    badge: "MUNDO CRETÁCICO",
    icono: "pets",
    textoPrefix: "El farallón de ",
    textoDestacado: "Cal Orck'o",
    textoSuffix: " alberga el yacimiento con huellas de dinosaurio más grande del planeta con más de 12.000 pisadas.",
    ubicacion: "Parque Cretácico",
    gradiente: "from-[#0F172A] via-[#002855] to-[#1E3A8A]"
  }
]

/**
 * Catálogo completo de los 12 Museos Sueltos de Sucre
 */
export const MUSEOS_SUELTOS_MOCK = [
  {
    id: "casa-de-la-libertad",
    nombre: "Casa de la Libertad",
    categoria: "Histórico",
    direccion: "Plaza 25 de Mayo Nº 11",
    distancia: "120 m del centro",
    icono: "museum",
    puntos: 150,
    rareza: "Épica",
    imagen: "/cartas/casa_de_la%20_libertad.jpeg",
    descripcion: "Cuna de la patria boliviana. En su histórico Salón Virreinal se firmó el Acta de la Independencia en 1825 y alberga la galería de cuadros de los presidentes.",
    coordenadas: { lat: -19.0479, lng: -65.2596 },
    topPercent: "38%",
    leftPercent: "48%",
    horario: "Mar - Sáb: 09:00 - 16:30",
    qrCodigo: "RUTA-BLANCA-CDL-1825"
  },
  {
    id: "castillo-de-la-glorieta",
    nombre: "Museo Castillo de la Glorieta",
    categoria: "Arquitectónico",
    direccion: "Carretera a Yotala Km 5",
    distancia: "5.2 km del centro",
    icono: "castle",
    puntos: 150,
    rareza: "Legendaria",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4zd-nmKZzG9xa98LJUg1z342tmUMwZEmJe1D4AcCYGOarmCo_hjRo6Q3AXhSXZOlZ6ZE3DA9Lin0QLluJ-93qZunZfVxOq5I7Z1lx_klw893OcBJJ6doTZkcUK_QBHbnfEjVwC_tIRgP1Ks1-IM8fhTflauOsvObSRKM-siyVlFQ40lYFLQIL9SmmOruLculrEHSxhXIfrwTXFwjPAJ58QH5L3jrtEl9W0rcM3ug",
    descripcion: "Único principado de Bolivia, residencia de los Príncipes de La Glorieta con una asombrosa mezcla de estilos gótico, morisco, renacentista y bizantino.",
    coordenadas: { lat: -19.0911, lng: -65.2831 },
    topPercent: "82%",
    leftPercent: "22%",
    horario: "Mar - Dom: 09:00 - 16:30",
    qrCodigo: "RUTA-BLANCA-GLORIETA-1898"
  },
  {
    id: "museo-asur",
    nombre: "Museo de Arte Indígena (ASUR)",
    categoria: "Textil & Indígena",
    direccion: "Pasaje Iturricha Nº 314 (La Recoleta)",
    distancia: "900 m del centro",
    icono: "palette",
    puntos: 120,
    rareza: "Rara",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUA6whty5OmehKlWp2Tw95O6ncPDGdhnNJSP87-KfXOvdjxl6D5YTBBrpBCet048n5c4Z5_Vbo4GrvKXoxleq2wiqGdKthALv0XWtxwl9vRciffuzm7V_6ibwyFOorI3SqFEKRA0JsbeSHaPCXFrZ2TSlIOepNp0SsjnQ2Wi3KsTujQ5ITECdRwyNjGCY0ROuvRhom_r5chTjopGPd8HZbEA78US4U0BWtnoAMR4g",
    descripcion: "Exhibición de arte textil tradicional de las culturas Jalq'a y Tarabuco, mostrando cosmovisiones andinas con telares vivos y bordados ancestrales.",
    coordenadas: { lat: -19.0535, lng: -65.2534 },
    topPercent: "29%",
    leftPercent: "75%",
    horario: "Lun - Sáb: 08:30 - 18:00",
    qrCodigo: "RUTA-BLANCA-ASUR-1986"
  },
  {
    id: "musef",
    nombre: "Museo Nacional de Etnografía y Folklore (MUSEF)",
    categoria: "Etnográfico",
    direccion: "Calle España Nº 74",
    distancia: "200 m del centro",
    icono: "diversity_3",
    puntos: 120,
    rareza: "Rara",
    imagen: "/cartas/etmografia.jpeg",
    descripcion: "Instalado en una señorial casona virreinal, custodia máscaras ceremoniales bolivianas, plumería sagrada, cerámica precolombina y numismática.",
    coordenadas: { lat: -19.0488, lng: -65.2605 },
    topPercent: "52%",
    leftPercent: "38%",
    horario: "Mar - Sáb: 09:00 - 17:00",
    qrCodigo: "RUTA-BLANCA-MUSEF-2004"
  },
  {
    id: "museo-gutierrez-valenzuela",
    nombre: "Museo Universitario Dr. Alfredo Gutiérrez Valenzuela",
    categoria: "Bellas Artes",
    direccion: "Plaza 25 de Mayo esq. Calvo",
    distancia: "50 m del centro",
    icono: "history_edu",
    puntos: 100,
    rareza: "Común",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFuzzo0uHbqHKIFqThvfbhLs8fwKBrpjpr8b9epNwT0-5xkQ7_rrWkGHQXOPEcgVPEhlnfxZK_biCUEz4g0KWm9XjgzXZkdG6XBRVdr8ObiO-jq3AmHH7P39pHSkwRsqPVqTzw-EMh8UwRZM_AZhdlmVeh6jd-OA74RHM61dLMT4O9YjVqjL7-HxUHcSgoVuRWu4FKD7qIUeXwpaxt6mfYyZH_CU8-KUuoXCvTc9U",
    descripcion: "Colección señorial de porcelanas de Sèvres, cristal de Baccarat, muebles virreinales de madera taraceada y lienzos de maestros europeos y coloniales.",
    coordenadas: { lat: -19.0475, lng: -65.2589 },
    topPercent: "44%",
    leftPercent: "54%",
    horario: "Lun - Vie: 08:30 - 16:30",
    qrCodigo: "RUTA-BLANCA-AGV-1945"
  },
  {
    id: "museo-catedral",
    nombre: "Museo de la Catedral",
    categoria: "Arte Sacro",
    direccion: "Calle Nicolás Ortiz Nº 61",
    distancia: "100 m del centro",
    icono: "church",
    puntos: 130,
    rareza: "Épica",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj0qwOSE1Va28E5Hrx2kNZA9hr3TP1NkdaWrxEg8MjiOehQYd2EzPL2xin5pZMUVUFnQQNeKLE0beZC1Dwe7Qbb6yAkSW1iAwY_IUXT0aXhO1Rdi_UGqSQYRqlO6OdfSzJXw2EDJf020n7E9Zl1J_6ogBp62osOXeAJRAvLay4dSvXteE_9X-SAQ44NJ6YEbOBHfgsk6AYoh6_zk3NzfJbntM-v9-6oEf0-fVqHus",
    descripcion: "Tesoros litúrgicos más ricos de América del Sur. Custodia la imagen enjoyada de la Virgen de Guadalupe, orfebrería de plata potosina y custodias coloniales.",
    coordenadas: { lat: -19.0483, lng: -65.2601 },
    topPercent: "50%",
    leftPercent: "43%",
    horario: "Lun - Vie: 10:00 - 17:00",
    qrCodigo: "RUTA-BLANCA-CAT-1559"
  },
  {
    id: "museo-la-recoleta",
    nombre: "Museo Franciscano de La Recoleta",
    categoria: "Conventual",
    direccion: "Plaza Pedro de Anzúrez s/n",
    distancia: "950 m del centro",
    icono: "landscape",
    puntos: 120,
    rareza: "Rara",
    imagen: "/cartas/Recoleta.png",
    descripcion: "Convento franciscano de 1601 con claustros de naranjos centenarios, sillería tallada en cedro y una terraza panorámica con mirador a la ciudad.",
    coordenadas: { lat: -19.0531, lng: -65.2528 },
    topPercent: "24%",
    leftPercent: "79%",
    horario: "Lun - Sáb: 09:00 - 16:30",
    qrCodigo: "RUTA-BLANCA-REC-1601"
  },
  {
    id: "convento-santa-clara",
    nombre: "Museo del Convento de Santa Clara",
    categoria: "Arte Sacro",
    direccion: "Calle Calvo Nº 212",
    distancia: "350 m del centro",
    icono: "auto_stories",
    puntos: 110,
    rareza: "Rara",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvDj7w00yuM6MrDp97o1RJk3Mev-xafLPRrBCsbvd-r6RRGJ3LlEG0mckzysZghIWg3EQebTfv5nIrp54Z4gfs-_VMW_1RIR1UhbztwnC7roeNcqiE4Com0yqP3WeopfUDPfohexYXOF3p6E569UbYjI0o-u3gLnnTwvx-pUT0aD1EL55Obw5jtJCuidQDmFUUb1CUtGZiIhVNfW2-rZNBfvhibVENreAlNlDyIFA",
    descripcion: "Fundado en 1639 por las monjas clarisas. Exhibe pintura barroca mestiza de Bernardo Bitti y Melchor Pérez de Holguín, instrumentos de coro y criptas.",
    coordenadas: { lat: -19.0498, lng: -65.2575 },
    topPercent: "58%",
    leftPercent: "62%",
    horario: "Lun - Vie: 09:00 - 12:30, 15:00 - 17:30",
    qrCodigo: "RUTA-BLANCA-CLARA-1639"
  },
  {
    id: "parque-cretacico",
    nombre: "Parque Cretácico (Cal Orck'O)",
    categoria: "Paleontología",
    direccion: "Carretera a Cochabamba Km 5",
    distancia: "6.8 km del centro",
    icono: "pets",
    puntos: 150,
    rareza: "Épica",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjpFCmwe14ldYgNVQEWbeqE4JhpZX2HGQf8EI8SWZWCyr3Tat0F1V8RCmzvrPnyh7f-ZoJKxEYK-HR91iPYW2AciHQspz6AtQsqgdzrU9WruH_UhKqRvPBfwTMy1fNJFYBiuxkC7PL_EHV-J7i1xzvt5iiFtum8bm_G-JCwnOlDrCDoSFhvYiLAIpY_8G_LV8DJHJxRF44x4bp_MZlPMgkxs7GYAFwCn4gEXACwKc",
    descripcion: "El farallón con más de 12.000 huellas de dinosaurios más grande del mundo. Incluye réplicas a escala real de titanosaurios y carnotauros.",
    coordenadas: { lat: -19.0062, lng: -65.2344 },
    topPercent: "16%",
    leftPercent: "20%",
    horario: "Mar - Dom: 09:00 - 17:00",
    qrCodigo: "RUTA-BLANCA-DINO-68M"
  },
  {
    id: "museo-casa-del-tesoro",
    nombre: "Museo Casa del Tesoro",
    categoria: "Histórico & Numismática",
    direccion: "Calle San Alberto Nº 156",
    distancia: "280 m del centro",
    icono: "savings",
    puntos: 100,
    rareza: "Común",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhPaU2WUwsQ4lk5xEhglxgPqdGA3RKFf5foN06xZyXDiQLV0ILgsseml0ZDAc9rbwjQKhu5bWmdZazseSJwdvQNVbxuIAkJNTci0hXx-N4oDHdkbO42yx1mRaFjO9G9VQ5UK8OvNFQOt6HsORRdonvcKH0ubYf8_Hqr4Ro1TndeMInfEt6WG-QS5xIQLxrGe-zrs7l8dVzojBA160ej5qqRa5hxbCt8uduZXI2Afo",
    descripcion: "Antiguo tesoro real y casona virreinal que conserva lingotes, monedas de plata macuquinas de la Real Casa de Moneda y relicarios coloniales.",
    coordenadas: { lat: -19.0465, lng: -65.2612 },
    topPercent: "31%",
    leftPercent: "34%",
    horario: "Lun - Vie: 09:00 - 16:00",
    qrCodigo: "RUTA-BLANCA-TESORO-1770"
  },
  {
    id: "museo-del-pan",
    nombre: "Museo del Pan",
    categoria: "Tradición Culinaria",
    direccion: "Calle San Alberto Nº 245",
    distancia: "320 m del centro",
    icono: "bakery_dining",
    puntos: 100,
    rareza: "Común",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8muneXTSFIpSCVXoZKiuwDAYtpITENkStBmwdYeakpacSt8YXbOJ21B2_mhZ52jOKOZXWm0d9SCnKpaKh1ht-pTz34EztkHhmm3uEzddjFveLzpk9qXSZ_LxUlTuQtQuSdssavih3pTGX-g5yhY_LfwCHW9WBEYqThKUZ3onMElACKlaPggFitNTlDUxqrA2VcJyiix2fky0bLLfLnwSUMV5nDRCUYLB2J_LdPSk",
    descripcion: "Homenaje a los legendarios hornos de leña coloniales y a las maestras panificadoras de Sucre, con la historia del pan de batalla, tantawawas y empanadas.",
    coordenadas: { lat: -19.0460, lng: -65.2620 },
    topPercent: "27%",
    leftPercent: "30%",
    horario: "Mar - Sáb: 09:00 - 18:00",
    qrCodigo: "RUTA-BLANCA-PAN-1910"
  },
  {
    id: "museo-del-chocolate",
    nombre: "Museo del Chocolate",
    categoria: "Gastronomía",
    direccion: "Calle Calvo Nº 284",
    distancia: "260 m del centro",
    icono: "cookie",
    puntos: 100,
    rareza: "Común",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFjsbvQizkh8eD2wbNOYYZc7u-GAhxK78XrLwC7jWoEQ0q8lwqsN3vyB0Gi4gpWarL5SILPDF0QsDt23JEs33vaTqvh9-kR1A61_j-gtnt7pEZ4DT-lqYrqOwycB38Dnox63BNRG-zUFvVtiDbzr8elhLTRoy7kIztJQgoXerPxM3MI2BLJ6KUufw5J1p6TFyGaFJlM1Hq59Jc-vkcBm5D5XX5sHhfZnl_Eaq7HTk",
    descripcion: "La tradición chocolatera de Sucre. Un recorrido interactivo desde la semilla de cacao silvestre amazónico hasta las famosas fábricas y bombones chuquisaqueños.",
    coordenadas: { lat: -19.0490, lng: -65.2585 },
    topPercent: "64%",
    leftPercent: "56%",
    horario: "Lun - Dom: 09:30 - 20:00",
    qrCodigo: "RUTA-BLANCA-CHOC-1896"
  }
]

/**
 * Rutas Temáticas Oficiales con sus Museos Integrados
 */
export const RUTAS_MOCK = [
  {
    id: "ruta-panoramica",
    titulo: "Ruta Panorámica",
    descripcion: "Cúpulas, campanarios y las terrazas coloniales con las mejores vistas 360° de Sucre.",
    categoria: "Panorámica",
    distancia: "2.1 km",
    dificultad: "Medio",
    tiempoEstimado: "2 h 15 min",
    icono: "roofing",
    cartasDescubiertas: 0,
    totalCartas: 4,
    badgeTexto: "Vistas 360°",
    badgeTipo: "nuevo",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUA6whty5OmehKlWp2Tw95O6ncPDGdhnNJSP87-KfXOvdjxl6D5YTBBrpBCet048n5c4Z5_Vbo4GrvKXoxleq2wiqGdKthALv0XWtxwl9vRciffuzm7V_6ibwyFOorI3SqFEKRA0JsbeSHaPCXFrZ2TSlIOepNp0SsjnQ2Wi3KsTujQ5ITECdRwyNjGCY0ROuvRhom_r5chTjopGPd8HZbEA78US4U0BWtnoAMR4g",
    museos: [
      {
        id: "san-felipe-neri",
        nombre: "San Felipe Neri",
        subtitulo: "Terrazas Coloniales y Cúpulas",
        detalle: "Azotea embaldosada con tejas de barro cocido y barandales que brindan una perspectiva única de los campanarios barrocos de la ciudad blanca.",
        icono: "roofing",
        coordenadas: { lat: -19.0495, lng: -65.2608 },
        puntos: 100,
        estado: "Por visitar"
      },
      {
        id: "catedral-metropolitana",
        nombre: "Catedral Metropolitana",
        subtitulo: "Torre y Mirador del Campanario",
        detalle: "Campanario histórico que domina la Plaza 25 de Mayo, con relojes antiguos y una vista imponente del damero central colonial.",
        icono: "church",
        coordenadas: { lat: -19.0483, lng: -65.2601 },
        puntos: 100,
        estado: "Por visitar"
      },
      {
        id: "la-recoleta",
        nombre: "La Recoleta",
        subtitulo: "Mirador Franciscano de la Colina",
        detalle: "Ubicado a las faldas del cerro Churuquella; su mirador histórico enmarca la geografía completa de la capital andina.",
        icono: "landscape",
        coordenadas: { lat: -19.0531, lng: -65.2528 },
        puntos: 100,
        estado: "Por visitar"
      },
      {
        id: "mirador-santa-teresa",
        nombre: "Mirador Santa Teresa",
        subtitulo: "Torreón y Balcones de Clausura",
        detalle: "Mirador elevado del antiguo convento carmelita de clausura con vistas privilegiadas hacia los cerros tutelares Sica Sica y Churuquella.",
        icono: "visibility",
        coordenadas: { lat: -19.0485, lng: -65.2560 },
        puntos: 100,
        estado: "Por visitar"
      }
    ]
  },
  {
    id: "ruta-presidencial",
    titulo: "Ruta Presidencial",
    descripcion: "La huella republicana de los gobernantes de Bolivia: mansiones, salones de estado y mausoleos.",
    categoria: "Presidencial",
    distancia: "3.5 km",
    dificultad: "Moderado",
    tiempoEstimado: "3 horas",
    icono: "account_balance",
    cartasDescubiertas: 0,
    totalCartas: 5,
    badgeTexto: "Historia Republicana",
    badgeTipo: "nuevo",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFuzzo0uHbqHKIFqThvfbhLs8fwKBrpjpr8b9epNwT0-5xkQ7_rrWkGHQXOPEcgVPEhlnfxZK_biCUEz4g0KWm9XjgzXZkdG6XBRVdr8ObiO-jq3AmHH7P39pHSkwRsqPVqTzw-EMh8UwRZM_AZhdlmVeh6jd-OA74RHM61dLMT4O9YjVqjL7-HxUHcSgoVuRWu4FKD7qIUeXwpaxt6mfYyZH_CU8-KUuoXCvTc9U",
    museos: [
      {
        id: "residencia-severo-fernandez",
        nombre: "Residencia Severo Fernández de Alonso",
        subtitulo: "Mansión del 22° Presidente de Bolivia",
        detalle: "Imponente arquitectura señorial de finales del siglo XIX perteneciente al mandatario que gobernó durante la convulsa Guerra Federal.",
        icono: "villa",
        coordenadas: { lat: -19.0492, lng: -65.2615 },
        puntos: 100,
        estado: "Por visitar"
      },
      {
        id: "residencia-jose-gutierrez",
        nombre: "Residencia José Gutiérrez Guerra",
        subtitulo: "El Último Presidente Liberal",
        detalle: "Residencia histórica del presidente economista José Gutiérrez Guerra ('El Último Oligarca'), testigo de la bonanza del estaño.",
        icono: "location_city",
        coordenadas: { lat: -19.0468, lng: -65.2592 },
        puntos: 100,
        estado: "Por visitar"
      },
      {
        id: "palacete-la-florida",
        nombre: "Palacete de La Florida",
        subtitulo: "Residencia Campestre de Aniceto Arce",
        detalle: "Lujosa villa y jardines versallescos construidos por el presidente Aniceto Arce, pionero de los ferrocarriles en Bolivia.",
        icono: "domain",
        coordenadas: { lat: -19.0720, lng: -65.2750 },
        puntos: 150,
        estado: "Por visitar"
      },
      {
        id: "casa-de-la-libertad-presidentes",
        nombre: "Casa de la Libertad",
        subtitulo: "Galería y Salón de los Presidentes",
        detalle: "Salón dedicado con los cuadros al óleo oficiales de los mandatarios bolivianos junto a la espada victoriosa de Sucre y la Constitución original.",
        icono: "portrait",
        coordenadas: { lat: -19.0479, lng: -65.2596 },
        puntos: 150,
        estado: "Desbloqueado"
      },
      {
        id: "cementerio-tumbas-presidenciales",
        nombre: "Cementerio General",
        subtitulo: "Mausoleos y Tumbas Presidenciales",
        detalle: "Mausoleos de mármol de Carrara donde descansan los restos de presidentes de la nación, próceres de la independencia y poetas insignes.",
        icono: "bed",
        coordenadas: { lat: -19.0442, lng: -65.2691 },
        puntos: 120,
        estado: "Por visitar"
      }
    ]
  },
  {
    id: "ruta-colonial",
    titulo: "Ruta Colonial",
    descripcion: "Las señoriales casonas, portadas de piedra y palacetes virreinales de la Villa de La Plata.",
    categoria: "Colonial",
    distancia: "1.8 km",
    dificultad: "Fácil",
    tiempoEstimado: "1 h 45 min",
    icono: "directions_walk",
    cartasDescubiertas: 1,
    totalCartas: 4,
    badgeTexto: "En Progreso",
    badgeTipo: "progreso",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8muneXTSFIpSCVXoZKiuwDAYtpITENkStBmwdYeakpacSt8YXbOJ21B2_mhZ52jOKOZXWm0d9SCnKpaKh1ht-pTz34EztkHhmm3uEzddjFveLzpk9qXSZ_LxUlTuQtQuSdssavih3pTGX-g5yhY_LfwCHW9WBEYqThKUZ3onMElACKlaPggFitNTlDUxqrA2VcJyiix2fky0bLLfLnwSUMV5nDRCUYLB2J_LdPSk",
    museos: [
      {
        id: "casa-de-la-libertad",
        nombre: "Casa de la Libertad",
        subtitulo: "Claustro Colonial Jesuita de 1621",
        detalle: "Antigua Universidad Pontificia San Francisco Xavier y cuna de la independencia americana. Corazón indiscutible de Sucre.",
        icono: "museum",
        coordenadas: { lat: -19.0479, lng: -65.2596 },
        puntos: 150,
        estado: "Desbloqueado"
      },
      {
        id: "museo-etnografico-musef",
        nombre: "Museo Etnográfico (MUSEF)",
        subtitulo: "Casona Colonial Calle España",
        detalle: "Patio interior con arquería de medio punto, aljibe de piedra y techumbres de madera tallada que custodian milenarias expresiones culturales.",
        icono: "diversity_3",
        coordenadas: { lat: -19.0488, lng: -65.2605 },
        puntos: 120,
        estado: "Por visitar"
      },
      {
        id: "museo-costumbrista",
        nombre: "Museo Costumbrista",
        subtitulo: "Tradiciones y Vida Criolla Colonial",
        detalle: "Colección viva de atuendos de época, instrumentos de salón, bargueños coloniales y representaciones de la vida aristocrática chuquisaqueña.",
        icono: "history",
        coordenadas: { lat: -19.0470, lng: -65.2580 },
        puntos: 100,
        estado: "Por visitar"
      },
      {
        id: "palacete-guereo",
        nombre: "Palacete Guereo",
        subtitulo: "Mansión Señorial de Transición Colonial",
        detalle: "Palacete señorial de amplias terrazas y arcos coloniales, rodeado de frondosos jardines botánicos andinos.",
        icono: "domain",
        coordenadas: { lat: -19.0520, lng: -65.2540 },
        puntos: 120,
        estado: "Por visitar"
      }
    ]
  }
]

/**
 * Puntos para el mapa interactivo
 */
export const MONUMENTOS_MOCK = [
  {
    id: "casa-de-la-libertad",
    nombre: "Casa de la Libertad",
    subtitulo: "Plaza 25 de Mayo · Reliquia Épica",
    distancia: "A 120 m · En el corazón de Sucre",
    categoria: "colonial",
    coordenadas: { lat: -19.0479, lng: -65.2596 },
    topPercent: "33%",
    leftPercent: "50%",
    icono: "museum",
    rareza: "Épica",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvDj7w00yuM6MrDp97o1RJk3Mev-xafLPRrBCsbvd-r6RRGJ3LlEG0mckzysZghIWg3EQebTfv5nIrp54Z4gfs-_VMW_1RIR1UhbztwnC7roeNcqiE4Com0yqP3WeopfUDPfohexYXOF3p6E569UbYjI0o-u3gLnnTwvx-pUT0aD1EL55Obw5jtJCuidQDmFUUb1CUtGZiIhVNfW2-rZNBfvhibVENreAlNlDyIFA",
    descripcion: "Cuna de la independencia de Bolivia. En su Aula Magna se firmó el acta de fundación de la República en 1825.",
    qrCodigo: "RUTA-BLANCA-CDL-1825",
    puntos: 150
  },
  {
    id: "la-recoleta",
    nombre: "Mirador de La Recoleta",
    subtitulo: "Plaza Aniceto Arce · Ruta Panorámica",
    distancia: "A 850 m · Subida al mirador",
    categoria: "colonial",
    coordenadas: { lat: -19.0531, lng: -65.2528 },
    topPercent: "25%",
    leftPercent: "78%",
    icono: "church",
    rareza: "Rara",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUA6whty5OmehKlWp2Tw95O6ncPDGdhnNJSP87-KfXOvdjxl6D5YTBBrpBCet048n5c4Z5_Vbo4GrvKXoxleq2wiqGdKthALv0XWtxwl9vRciffuzm7V_6ibwyFOorI3SqFEKRA0JsbeSHaPCXFrZ2TSlIOepNp0SsjnQ2Wi3KsTujQ5ITECdRwyNjGCY0ROuvRhom_r5chTjopGPd8HZbEA78US4U0BWtnoAMR4g",
    descripcion: "Convento franciscano fundado en 1601 a los pies del cerro Churuquella con una vista panorámica inigualable de la ciudad blanca.",
    qrCodigo: "RUTA-BLANCA-REC-1601",
    puntos: 100
  },
  {
    id: "san-felipe-neri",
    nombre: "San Felipe Neri",
    subtitulo: "Calle Nicolás Ortiz · Terraza Panorámica",
    distancia: "A 230 m · Azotea de tejas y cúpulas",
    categoria: "colonial",
    coordenadas: { lat: -19.0495, lng: -65.2608 },
    topPercent: "62%",
    leftPercent: "22%",
    icono: "roofing",
    rareza: "Rara",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8muneXTSFIpSCVXoZKiuwDAYtpITENkStBmwdYeakpacSt8YXbOJ21B2_mhZ52jOKOZXWm0d9SCnKpaKh1ht-pTz34EztkHhmm3uEzddjFveLzpk9qXSZ_LxUlTuQtQuSdssavih3pTGX-g5yhY_LfwCHW9WBEYqThKUZ3onMElACKlaPggFitNTlDUxqrA2VcJyiix2fky0bLLfLnwSUMV5nDRCUYLB2J_LdPSk",
    descripcion: "Templo y convento neoclásico famoso por sus terrazas techadas con tejas coloniales que ofrecen vistas de campanarios.",
    qrCodigo: "RUTA-BLANCA-SFN-1795",
    puntos: 100
  },
  {
    id: "cementerio-general",
    nombre: "Cementerio General",
    subtitulo: "Mausoleos de Presidentes y Próceres",
    distancia: "A 1.4 km · Ruta Presidencial",
    categoria: "mistica",
    coordenadas: { lat: -19.0442, lng: -65.2691 },
    topPercent: "72%",
    leftPercent: "72%",
    icono: "bed",
    rareza: "Épica",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFjsbvQizkh8eD2wbNOYYZc7u-GAhxK78XrLwC7jWoEQ0q8lwqsN3vyB0Gi4gpWarL5SILPDF0QsDt23JEs33vaTqvh9-kR1A61_j-gtnt7pEZ4DT-lqYrqOwycB38Dnox63BNRG-zUFvVtiDbzr8elhLTRoy7kIztJQgoXerPxM3MI2BLJ6KUufw5J1p6TFyGaFJlM1Hq59Jc-vkcBm5D5XX5sHhfZnl_Eaq7HTk",
    descripcion: "Museo a cielo abierto con mausoleos aristocráticos, jardines de cipreses centenarios y las tumbas de los presidentes de Bolivia.",
    qrCodigo: "RUTA-BLANCA-CEM-1892",
    puntos: 120
  }
]

/**
 * Catálogo de Cartas Coleccionables
 * Vinculado directamente con las fotografías locales de /public/cartas/ y sus códigos QR.
 */
export const CARTAS_MOCK = [
  {
    id: "casa-de-la-libertad",
    titulo: "Casa de la Libertad",
    categoria: "colonial",
    categoriaLabel: "Colonial",
    rareza: "Épica",
    desbloqueada: true,
    fechaObtencion: "Hallado el 25 May",
    puntosGanados: 150,
    pista: "Plaza 25 de Mayo · Salón de la Independencia",
    iconoPista: "verified",
    qrCodigo: "RUTA-BLANCA-CDL-1825",
    imagen: "/cartas/casa_de_la%20_libertad.jpeg",
    historiaCorta: "El templo cívico más sagrado de Bolivia. En su imponente Salón Virreinal resonaron las voces que declararon la libertad americana y alberga la histórica galería presidencial."
  },
  {
    id: "la-recoleta",
    titulo: "La Recoleta",
    categoria: "colonial",
    categoriaLabel: "Panorámica",
    rareza: "Rara",
    desbloqueada: false,
    puntosGanados: 120,
    pista: "Escanear en plaza del mirador",
    iconoPista: "qr_code",
    qrCodigo: "RUTA-BLANCA-REC-1601",
    imagen: "/cartas/Recoleta.png",
    historiaCorta: "Convento franciscano fundado en 1601 en el sitio donde nació la Villa de La Plata. Su mirador regala un atardecer colonial inigualable."
  },
  {
    id: "museo-colonial-charcas",
    titulo: "Museo Colonial Charcas",
    categoria: "colonial",
    categoriaLabel: "Colonial",
    rareza: "Épica",
    desbloqueada: false,
    puntosGanados: 130,
    pista: "Museo Universitario · Calle Bolívar",
    iconoPista: "museum",
    qrCodigo: "RUTA-BLANCA-CHARCAS-1939",
    imagen: "/cartas/charcas.jpeg",
    historiaCorta: "Museo Universitario Colonial Charcas de la USFX. Custodia valiosas colecciones de arte virreinal, pinacoteca colonial, platería y piezas republicanas."
  },
  {
    id: "palacete-guereo",
    titulo: "Palacete del Guereo",
    categoria: "presidencial",
    categoriaLabel: "Colonial",
    rareza: "Épica",
    desbloqueada: false,
    puntosGanados: 120,
    pista: "Ruta Colonial · Zona El Guereo",
    iconoPista: "domain",
    qrCodigo: "RUTA-BLANCA-GUEREO-1895",
    imagen: "/cartas/palacete.jpeg",
    historiaCorta: "Emblemática casona señorial chuquisaqueña con elegantes galerías, arcos de transición colonial-republicana y jardines históricos."
  },
  {
    id: "musef-etnografia-1",
    titulo: "MUSEF · Arte Etnográfico",
    categoria: "mistica",
    categoriaLabel: "Etnográfico",
    rareza: "Rara",
    desbloqueada: false,
    puntosGanados: 120,
    pista: "Calle España Nº 74 · Sala Principal",
    iconoPista: "diversity_3",
    qrCodigo: "RUTA-BLANCA-MUSEF-1",
    imagen: "/cartas/etmografia.jpeg",
    historiaCorta: "Museo Nacional de Etnografía y Folklore (MUSEF). Resguarda máscaras rituales, vestimentas ceremoniales y la memoria viva de las culturas bolivianas."
  },
  {
    id: "musef-etnografia-2",
    titulo: "MUSEF · Tradición Viva",
    categoria: "colonial",
    categoriaLabel: "Etnográfico",
    rareza: "Rara",
    desbloqueada: false,
    puntosGanados: 120,
    pista: "Calle España Nº 74 · Galería Textil",
    iconoPista: "palette",
    qrCodigo: "RUTA-BLANCA-MUSEF-2",
    imagen: "/cartas/etnografia2.jpeg",
    historiaCorta: "Segunda reliquia del Museo de Etnografía y Folklore, dedicada a los tejidos ancestrales, cerámica ritual y expresiones folklóricas de Chuquisaca."
  },
  {
    id: "cementerio-general",
    titulo: "Cementerio General",
    categoria: "mistica",
    categoriaLabel: "Presidencial",
    rareza: "Épica",
    desbloqueada: false,
    puntosGanados: 120,
    pista: "Visita los mausoleos presidenciales",
    iconoPista: "location_on",
    qrCodigo: "RUTA-BLANCA-CEM-1892",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhPaU2WUwsQ4lk5xEhglxgPqdGA3RKFf5foN06xZyXDiQLV0ILgsseml0ZDAc9rbwjQKhu5bWmdZazseSJwdvQNVbxuIAkJNTci0hXx-N4oDHdkbO42yx1mRaFjO9G9VQ5UK8OvNFQOt6HsORRdonvcKH0ubYf8_Hqr4Ro1TndeMInfEt6WG-QS5xIQLxrGe-zrs7l8dVzojBA160ej5qqRa5hxbCt8uduZXI2Afo",
    historiaCorta: "Custodio de presidentes, príncipes y poetas. Sus senderos arbolados guardan los secretos más profundos y los sepulcros de líderes de la República."
  },
  {
    id: "castillo-glorieta",
    titulo: "Castillo Glorieta",
    categoria: "presidencial",
    categoriaLabel: "Arquitectónico",
    rareza: "Legendaria",
    desbloqueada: false,
    puntosGanados: 200,
    pista: "Ruta de los Príncipes",
    iconoPista: "explore",
    qrCodigo: "RUTA-BLANCA-GLORIETA-1898",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4zd-nmKZzG9xa98LJUg1z342tmUMwZEmJe1D4AcCYGOarmCo_hjRo6Q3AXhSXZOlZ6ZE3DA9Lin0QLluJ-93qZunZfVxOq5I7Z1lx_klw893OcBJJ6doTZkcUK_QBHbnfEjVwC_tIRgP1Ks1-IM8fhTflauOsvObSRKM-siyVlFQ40lYFLQIL9SmmOruLculrEHSxhXIfrwTXFwjPAJ58QH5L3jrtEl9W0rcM3ug",
    historiaCorta: "Único principado de Bolivia otorgado por el Papa León XIII. Combina arquitectura gótica, bizantina, árabe y renacentista."
  },
  {
    id: "catedral-metropolitana",
    titulo: "Catedral Metropolitana",
    categoria: "colonial",
    categoriaLabel: "Panorámica",
    rareza: "Rara",
    desbloqueada: false,
    puntosGanados: 100,
    pista: "Torre de la Catedral",
    iconoPista: "church",
    qrCodigo: "RUTA-BLANCA-CAT-1559",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj0qwOSE1Va28E5Hrx2kNZA9hr3TP1NkdaWrxEg8MjiOehQYd2EzPL2xin5pZMUVUFnQQNeKLE0beZC1Dwe7Qbb6yAkSW1iAwY_IUXT0aXhO1Rdi_UGqSQYRqlO6OdfSzJXw2EDJf020n7E9Zl1J_6ogBp62osOXeAJRAvLay4dSvXteE_9X-SAQ44NJ6YEbOBHfgsk6AYoh6_zk3NzfJbntM-v9-6oEf0-fVqHus",
    historiaCorta: "Su torre campanario alberga relojes históricos y joyas religiosas invaluables como la Virgen de Guadalupe engarzada en perlas y rubíes."
  },
  {
    id: "parque-cretacico",
    titulo: "Parque Cretácico",
    categoria: "mistica",
    categoriaLabel: "Paleontología",
    rareza: "Épica",
    desbloqueada: false,
    puntosGanados: 150,
    pista: "Acantilado Cal Orck'o",
    iconoPista: "pets",
    qrCodigo: "RUTA-BLANCA-DINO-68M",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjpFCmwe14ldYgNVQEWbeqE4JhpZX2HGQf8EI8SWZWCyr3Tat0F1V8RCmzvrPnyh7f-ZoJKxEYK-HR91iPYW2AciHQspz6AtQsqgdzrU9WruH_UhKqRvPBfwTMy1fNJFYBiuxkC7PL_EHV-J7i1xzvt5iiFtum8bm_G-JCwnOlDrCDoSFhvYiLAIpY_8G_LV8DJHJxRF44x4bp_MZlPMgkxs7GYAFwCn4gEXACwKc",
    historiaCorta: "El yacimiento de huellas de dinosaurio más grande del planeta. Un viaje geológico de 68 millones de años en el corazón de Chuquisaca."
  }
]
