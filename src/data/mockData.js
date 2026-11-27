/**
 * Modelos de datos para La Ruta Blanca (Sucre, Bolivia)
 * Desacoplado para sincronización con Supabase/Firestore y Geolocation API.
 * Todas las fotografías de museos y cartas están vinculadas a /public/museos/ y /public/cartas/.
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
 * Catálogo completo de los 12 Museos Sueltos de Sucre (con fotos reales en /public/museos/)
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
    imagen: "/museos/casa%20libertad.jpeg",
    descripcion: "Cuna de la patria boliviana. En su histórico Salón Virreinal se firmó el Acta de la Independencia en 1825 y alberga la galería de cuadros de los presidentes.",
    informacionDetallada: "Edificado en el siglo XVII como parte del conjunto jesuítico y sede de la Universidad San Francisco Xavier, este recinto fue testigo del nacimiento de Bolivia el 6 de agosto de 1825. Sus muros blancos resguardan documentos fundacionales, retratos originales de los libertadores y el emblemático Salón de los Presidentes.",
    destacados: [
      "Acta original de la Independencia de Bolivia (1825)",
      "Salón Virreinal y sillería tallada en cedro",
      "Galería histórica con los óleos de los presidentes"
    ],
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
    imagen: "/museos/glorieta.jpeg",
    descripcion: "Único principado de Bolivia, residencia de los Príncipes de La Glorieta con una asombrosa mezcla de estilos gótico, morisco, renacentista y bizantino.",
    informacionDetallada: "Construido entre 1893 y 1897 por el empresario minero Francisco Argandoña y Clotilde Urioste, quienes recibieron del Papa León XIII el título nobiliario de Príncipes de La Glorieta por sus obras filantrópicas. Su diseño ecléctico reúne cúpulas rusas, torres góticas y arcos moriscos en un entorno campestre inolvidable.",
    destacados: [
      "Torre del Príncipe (45 metros de altura) y mirador",
      "Capilla gótica y salón de recepciones reales",
      "Jardines históricos y carruajes de finales del siglo XIX"
    ],
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
    imagen: "/museos/arte%20indigena.jpeg",
    descripcion: "Exhibición de arte textil tradicional de las culturas Jalq'a y Tarabuco, mostrando cosmovisiones andinas con telares vivos y bordados ancestrales.",
    informacionDetallada: "Fundado por la Fundación ASUR en una antigua casona frente a La Recoleta, este museo revitaliza el tejido indígena contemporáneo de Chuquisaca. Los visitantes observan la técnica del 'khuru' y la iconografía mítica de los pueblos Jalq'a (en rojo y negro) y Tarabuco (con escenas festivas del Pujllay).",
    destacados: [
      "Salas de textiles míticos Jalq'a y Tarabuco",
      "Demostración en vivo de maestras tejedoras",
      "Instrumentos musicales y vestimenta ritual andina"
    ],
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
    imagen: "/museos/etnografia.jpeg",
    descripcion: "Instalado en una señorial casona virreinal, custodia máscaras ceremoniales bolivianas, plumería sagrada, cerámica precolombina y numismática.",
    informacionDetallada: "La sede chuquisaqueña del MUSEF ocupa el antiguo Banco Nacional de Bolivia y una residencia colonial restaurada. Sus salas exploran la diversidad cultural de Bolivia a través de máscaras de danzas folklóricas, arte plumario amazónico, textiles prehispánicos y monedas acuñadas en Charcas y Potosí.",
    destacados: [
      "Colección de máscaras ceremoniales de los Andes",
      "Arte plumario ceremonial y textiles tradicionales",
      "Patio virreinal con arquería y exposiciones temporales"
    ],
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
    imagen: "/museos/universitario%20dr%20alberto.jpeg",
    descripcion: "Colección señorial de porcelanas de Sèvres, cristal de Baccarat, muebles virreinales de madera taraceada y lienzos de maestros europeos y coloniales.",
    informacionDetallada: "Donado a la Universidad San Francisco Xavier por el diplomático y filántropo Alfredo Gutiérrez Valenzuela, este museo recrea el refinamiento de los salones aristocráticos de la Sucre de principios del siglo XX, combinando artes decorativas europeas con mobiliario barroco del Alto Perú.",
    destacados: [
      "Porcelanas francesas de Sèvres y cristalería Baccarat",
      "Salón de estilo Luis XV y mobiliario taraceado",
      "Pinacoteca con retratos y paisajes históricos de Sucre"
    ],
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
    imagen: "/museos/catedral.jpeg",
    descripcion: "Tesoros litúrgicos más ricos de América del Sur. Custodia la imagen enjoyada de la Virgen de Guadalupe, orfebrería de plata potosina y custodias coloniales.",
    informacionDetallada: "Ubicado anexo a la Basílica Metropolitana de Sucre, el Museo Monseñor Taborga conserva un patrimonio sacro incomparable acumulado desde el siglo XVI, cuando la Arquidiócesis de La Plata era una de las más ricas del continente gracias a la plata del Cerro Rico.",
    destacados: [
      "Manto enjoyado de la Virgen de Guadalupe (1601)",
      "Custodia colonial de oro, perlas y piedras preciosas",
      "Obras pictóricas de Bernardo Bitti y Gregorio Gamarra"
    ],
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
    imagen: "/museos/recoleta.jpeg",
    descripcion: "Convento franciscano de 1601 con claustros de naranjos centenarios, sillería tallada en cedro y una terraza panorámica con mirador a la ciudad.",
    informacionDetallada: "Erigido en 1601 por Fray Francisco Morales en las faldas del cerro Churuquella, justo donde en 1538 se fundó la Villa de La Plata. En su jardín principal sobrevive un cedro milenario y su templo alberga una sillería coral tallada en madera de cedro considerada joya del barroco americano.",
    destacados: [
      "Mirador de arcos blancos con vista panorámica de Sucre",
      "Sillería del coro franciscano tallada en cedro (siglo XVII)",
      "Claustros de naranjos y el cedro centenario de La Recoleta"
    ],
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
    imagen: "/museos/santaclara.jpeg",
    descripcion: "Fundado en 1639 por las monjas clarisas. Exhibe pintura barroca mestiza de Bernardo Bitti y Melchor Pérez de Holguín, instrumentos de coro y criptas.",
    informacionDetallada: "Convento de clausura fundado en el siglo XVII cuyas salas preservan un valioso legado de pintura manierista y barroca del Alto Perú, además de un órgano tubular del siglo XVII, relicarios de plata y un patio silencioso que transporta al visitante a la vida monástica colonial.",
    destacados: [
      "Lienzos de Bernardo Bitti y Melchor Pérez de Holguín",
      "Antiguo órgano de fuelles y libros corales en pergamino",
      "Criptas coloniales y torre mirador del convento"
    ],
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
    imagen: "/museos/cretacico.jpeg",
    descripcion: "El farallón con más de 12.000 huellas de dinosaurios más grande del mundo. Incluye réplicas a escala real de titanosaurios y carnotauros.",
    informacionDetallada: "Hace 68 millones de años, la zona de Cal Orck'o era la orilla de un inmenso lago donde caminaron manadas de titanosaurios, anquilosaurios y terópodos. Hoy el levantamiento tectónico andino exhibe esta pared casi vertical de 1,2 km de largo con miles de pisadas fosilizadas únicas en el planeta.",
    destacados: [
      "Farallón de Cal Orck'o con más de 12.000 huellas fósiles",
      "Esculturas a tamaño real de Titanosaurio y Tyrannosaurus",
      "Sendero interactivo y museo audiovisual del Cretácico"
    ],
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
    imagen: "/museos/tesoro.jpeg",
    descripcion: "Antiguo tesoro real y casona virreinal que conserva lingotes, monedas de plata macuquinas de la Real Casa de Moneda y relicarios coloniales.",
    informacionDetallada: "Instalado en una casona histórica del centro de Sucre, este museo permite conocer la historia económica de la Real Audiencia de Charcas, mostrando cómo la plata extraída en el sur boliviano circulaba en forma de monedas macuquinas, barras y piezas de platería religiosa y doméstica.",
    destacados: [
      "Monedas macuquinas y piezas numismáticas coloniales",
      "Bóvedas históricas y lingotes de plata",
      "Orfebrería virreinal y mobiliario de época"
    ],
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
    imagen: "/museos/pan.jpeg",
    descripcion: "Homenaje a los legendarios hornos de leña coloniales y a las maestras panificadoras de Sucre, con la historia del pan de batalla, tantawawas y empanadas.",
    informacionDetallada: "Un espacio dedicado a una de las tradiciones gastronómicas más queridas de Chuquisaca. Muestra antiguos utensilios de amasado, moldes tradicionales, hornos de barro y el oficio de las panaderas chuquisaqueñas que perfeccionaron masas dulces, marraquetas y las icónicas tantawawas de Todos Santos.",
    destacados: [
      "Antiguo horno de barro y leña de tradición colonial",
      "Herramientas artesanales de panificación tradicional",
      "Exhibición de panes ceremoniales y tantawawas"
    ],
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
    imagen: "/museos/chocolate.jpeg",
    descripcion: "La tradición chocolatera de Sucre. Un recorrido interactivo desde la semilla de cacao silvestre amazónico hasta las famosas fábricas y bombones chuquisaqueños.",
    informacionDetallada: "Sucre es reconocida como la capital del chocolate artesanal en Bolivia. Este museo recorre la historia del cacao nativo boliviano desde su recolección en la Amazonía hasta los antiguos molinos, prensas y maestras chocolateras que dieron fama nacional a los bombones de la ciudad blanca.",
    destacados: [
      "Maquinaria histórica de tostado y molienda de cacao",
      "Historia de las familias chocolateras de Sucre",
      "Degustación de cacao silvestre y bombones artesanales"
    ],
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
    imagen: "/museos/recoleta.jpeg",
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
    imagen: "/museos/casa%20libertad.jpeg",
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
    imagen: "/museos/santaclara.jpeg",
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
    imagen: "/museos/casa%20libertad.jpeg",
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
    imagen: "/museos/recoleta.jpeg",
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
    imagen: "/museos/catedral.jpeg",
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
 * Vinculado directamente con las fotografías locales de /public/cartas/ y /public/museos/,
 * con información histórica ampliada y puntos clave de visita para cada museo.
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
    direccion: "Plaza 25 de Mayo Nº 11",
    horario: "Mar - Sáb: 09:00 - 16:30",
    historiaCorta: "El templo cívico más sagrado de Bolivia. En su imponente Salón Virreinal resonaron las voces que declararon la libertad americana el 6 de agosto de 1825.",
    informacionDetallada: "Construida en el siglo XVII por la Compañía de Jesús como capilla doméstica y aula magna de la Real y Pontificia Universidad de San Francisco Xavier, la Casa de la Libertad fue el escenario de la Asamblea Deliberante que fundó la República de Bolivia. Sus claustros de muros encalados y tejas coloniales custodian hoy el Acta de la Independencia, la espada del Mariscal Antonio José de Sucre, retratos de los libertadores y el Salón de los Presidentes con las efigies al óleo de los mandatarios del país.",
    destacados: [
      "Acta original de la Independencia de Bolivia (1825)",
      "Salón Virreinal de la Independencia y púlpito barroco",
      "Galería histórica de los Presidentes de Bolivia"
    ]
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
    direccion: "Plaza Pedro de Anzúrez s/n",
    horario: "Lun - Sáb: 09:00 - 16:30",
    historiaCorta: "Convento franciscano fundado en 1601 en el sitio exacto donde nació la Villa de La Plata en 1538.",
    informacionDetallada: "Situado a los pies del cerro Churuquella en la parte alta de la ciudad, el Convento de Santa Ana de Monte Sión (La Recoleta) conserva tres apacibles claustros de arquerías blancas, jardines con naranjos y un cedro milenario de más de mil años. En el interior de su templo destaca una sillería coral del siglo XVII tallada íntegramente en madera de cedro con motivos barrocos, mientras su plaza exterior funciona como el mirador panorámico más emblemático de Sucre.",
    destacados: [
      "Mirador de arcos blancos frente a la Plaza Pedro de Anzúrez",
      "Sillería del coro tallada en cedro del siglo XVII",
      "Claustros franciscanos y el cedro milenario"
    ]
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
    direccion: "Calle Bolívar Nº 698 (Casa de los Condes de Revilla)",
    horario: "Lun - Sáb: 09:00 - 17:00",
    historiaCorta: "Museo Universitario Colonial Charcas de la USFX, instalado en una majestuosa casona aristocrática del siglo XVII.",
    informacionDetallada: "Fundado en 1939 bajo tuición de la Universidad Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca, ocupa el palacio que perteneció al Obispo Castilla y Zamora y a los Condes de Revilla. Sus salas exhiben una de las colecciones más importantes de pintura colonial de la escuela potosina y chuquisaqueña —con obras de Melchor Pérez de Holguín y Gaspar Miguel de Berrío—, escultura policromada, platería virreinal, muebles taraceados y retratos de próceres republicanos.",
    destacados: [
      "Pinacoteca colonial con lienzos de Melchor Pérez de Holguín",
      "Salas de escultura sacra y platería de la Audiencia de Charcas",
      "Patio señorial de piedra labrada y galerías coloniales"
    ]
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
    direccion: "Zona El Guereo, Sucre",
    horario: "Lun - Vie: 09:00 - 16:30",
    historiaCorta: "Emblemática casona señorial chuquisaqueña de transición colonial-republicana rodeada de amplias terrazas y jardines.",
    informacionDetallada: "Erigido en las inmediaciones de la histórica zona de El Guereo, este palacete refleja el esplendor arquitectónico de las élites sucrenses de finales del siglo XIX y principios del XX. Combina la elegancia neoclásica francesa en sus fachadas y saloncitos altos con patios tradicionales encalados, balcones miradores y arboledas que servían de retiro campestre cerca del casco viejo.",
    destacados: [
      "Fachadas neoclásicas y balcones de hierro forjado",
      "Galerías de transición colonial-republicana",
      "Jardines elevados y vistas hacia la ciudad blanca"
    ]
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
    imagen: "/cartas/etnografia1.jpeg",
    direccion: "Calle España Nº 74",
    horario: "Mar - Sáb: 09:00 - 17:00",
    historiaCorta: "Museo Nacional de Etnografía y Folklore (MUSEF), custodio de máscaras rituales y la memoria viva de las culturas bolivianas.",
    informacionDetallada: "La sede de Sucre del MUSEF funciona en una elegante casona patrimonial en la histórica Calle España, a pasos de la Plaza 25 de Mayo. Sus salas principales permiten comprender el profundo simbolismo de las máscaras festivas y rituales de tierras altas y bajas, así como la cosmovisión andina y amazónica reflejada en la vestimenta ceremonial, la música autóctona y las danzas patrimoniales.",
    destacados: [
      "Colección de máscaras ceremoniales de la Diablada y Morenada",
      "Arte plumario sagrado de culturas amazónicas y chaqueñas",
      "Patio central restaurado con arquería colonial"
    ]
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
    direccion: "Calle España Nº 74",
    horario: "Mar - Sáb: 09:00 - 17:00",
    historiaCorta: "Segunda reliquia del Museo de Etnografía y Folklore, dedicada a los tejidos ancestrales, cerámica y tradiciones de Chuquisaca.",
    informacionDetallada: "A través de su galería textil y etnohistórica, el MUSEF muestra cómo los textiles bolivianos actúan como verdaderos libros visuales donde las comunidades registran su entorno, su identidad territorial y sus mitos. La exhibición incluye aguayos ceremoniales, chuspas, cerámica precolombina y piezas numismáticas vinculadas a la historia de Charcas.",
    destacados: [
      "Tejidos ancestrales y simbolismo textil de Chuquisaca",
      "Cerámica prehispánica y herramientas rituales",
      "Archivo etnohistórico y salas interactivas"
    ]
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
    direccion: "Final Calle Loa, Zona Cementerio",
    horario: "Lun - Dom: 08:00 - 17:30",
    historiaCorta: "Museo a cielo abierto custodio de presidentes, príncipes y poetas entre jardines de cipreses centenarios.",
    informacionDetallada: "Inaugurado en el siglo XIX con un diseño inspirado en los grandes cementerios jardín europeos, el Cementerio General de Sucre alberga esculturas en mármol de Carrara y mausoleos neoclásicos y neogóticos. En sus galerías y criptas descansan numerosos presidentes de Bolivia, héroes de la Guerra del Pacífico y del Acre, además de los Príncipes de La Glorieta.",
    destacados: [
      "Mausoleos presidenciales y criptas de próceres republicanos",
      "Mausoleo de los Príncipes de La Glorieta",
      "Paseos de cipreses centenarios y escultura funeraria"
    ]
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
    imagen: "/museos/glorieta.jpeg",
    direccion: "Carretera a Yotala Km 5",
    horario: "Mar - Dom: 09:00 - 16:30",
    historiaCorta: "Único principado de Bolivia otorgado por el Papa León XIII. Combina arquitectura gótica, bizantina, árabe y renacentista.",
    informacionDetallada: "Levantado a finales del siglo XIX por Francisco Argandoña y Clotilde Urioste, el Castillo de La Glorieta es una joya arquitectónica única en Sudamérica. Cada torre y salón reproduce estilos distintos —desde cúpulas bizantinas hasta minaretes árabes y vitrales góticos— rodeados de jardines diseñados por paisajistas europeos.",
    destacados: [
      "Torreón del Príncipe con vista al valle de Yotala",
      "Salón de Recepciones y capilla de estilo gótico",
      "Galería de retratos de los Príncipes de La Glorieta"
    ]
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
    imagen: "/museos/catedral.jpeg",
    direccion: "Calle Nicolás Ortiz Nº 61 (Plaza 25 de Mayo)",
    horario: "Lun - Vie: 10:00 - 17:00",
    historiaCorta: "Su torre campanario alberga relojes históricos y el museo guarda la Virgen de Guadalupe engarzada en perlas y rubíes.",
    informacionDetallada: "Iniciada en 1551 y ampliada durante los siglos XVI y XVII, la Catedral Basílica de Nuestra Señora de Guadalupe combina detalles renacentistas, barrocos y neoclásicos. Su Museo de Arte Sacro alberga una colección de orfebrería en oro y plata de Potosí, vestimentas bordadas con hilos de oro y la venerada imagen de la Virgen de Guadalupe pintada por Fray Diego de Ocaña.",
    destacados: [
      "Imagen enjoyada de la Virgen de Guadalupe (1601)",
      "Custodia de oro y pedrería y relicarios de plata potosina",
      "Torre del campanario con vistas a la Plaza 25 de Mayo"
    ]
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
    imagen: "/museos/cretacico.jpeg",
    direccion: "Carretera a Cochabamba Km 5",
    horario: "Mar - Dom: 09:00 - 17:00",
    historiaCorta: "El yacimiento de huellas de dinosaurio más grande del planeta. Un viaje geológico de 68 millones de años en Chuquisaca.",
    informacionDetallada: "Descubierto en la cantera de Cal Orck'o, este farallón calizo casi vertical conserva más de 12.000 huellas pertenecientes a cerca de 300 dinosaurios de al menos ocho especies distintas del Cretácico Tardío. El parque cuenta con un museo paleontológico, miradores telescópicos y réplicas científicas a escala real.",
    destacados: [
      "Pared vertical de Cal Orck'o con huellas de hace 68 millones de años",
      "Réplica de Titanosaurio de 36 metros de longitud",
      "Paseo guiado hasta la base del farallón fósil"
    ]
  }
]
