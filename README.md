# 🏛️ La Ruta Blanca · Sucre Heritage Play (PWA)

Aplicación Web Progresiva (PWA) móvil, modular y gamificada construida con **Vue 3 (Composition API `<script setup>`)** y **Tailwind CSS**. Diseñada bajo directrices de **Web Interface Guidelines** y optimizada estrictamente para dispositivos celulares (**Mobile-First**).

---

## 🏛️ Catálogo de Museos y Rutas Oficiales

### 1. Los 12 Museos Sueltos
1. **Casa de la Libertad** (Plaza 25 de Mayo)
2. **Museo Castillo de la Glorieta** (Carretera a Yotala Km 5)
3. **Museo de Arte Indígena (ASUR)** (Pasaje Iturricha, La Recoleta)
4. **Museo Nacional de Etnografía y Folklore (MUSEF)** (Calle España 74)
5. **Museo Universitario Dr. Alfredo Gutiérrez Valenzuela** (Plaza 25 de Mayo esq. Calvo)
6. **Museo de la Catedral** (Calle Nicolás Ortiz 61)
7. **Museo Franciscano de La Recoleta** (Plaza Pedro de Anzúrez)
8. **Museo del Convento de Santa Clara** (Calle Calvo 212)
9. **Parque Cretácico (Cal Orck'O)** (Carretera a Cochabamba Km 5)
10. **Museo Casa del Tesoro** (Calle San Alberto 156)
11. **Museo del Pan** (Calle San Alberto 245)
12. **Museo del Chocolate** (Calle Calvo 284)

### 2. Rutas Temáticas y sus Paradas
- **Ruta Panorámica** (antigua ruta terraza):
  1. San Felipe Neri (Terrazas coloniales y cúpulas)
  2. Catedral Metropolitana (Torre y mirador del campanario)
  3. La Recoleta (Mirador de la colina)
  4. Mirador Santa Teresa (Torreón y balcones de clausura)
- **Ruta Presidencial**:
  1. Residencia Severo Fernández de Alonso
  2. Residencia José Gutiérrez Guerra
  3. Palacete de La Florida (Residencia campestre de Aniceto Arce)
  4. Casa de la Libertad (Salón de cuadros de los presidentes)
  5. Cementerio General (Mausoleos y tumbas presidenciales)
- **Ruta Colonial**:
  1. Casa de la Libertad (Claustro jesuita y cuna republicana)
  2. Museo Etnográfico (MUSEF)
  3. Museo Costumbrista
  4. Palacete Guereo

---

## 📐 Arquitectura Modular

```
├── public/
│   ├── favicon.svg             # Escudo con la Cruz carmesí de Chuquisaca
│   └── manifest.json           # Manifiesto PWA para instalación móvil
├── src/
│   ├── components/
│   │   ├── HeaderNav.vue       # Barra superior fija (Safe Area, escudo Sucre, puntaje gamificado)
│   │   ├── BottomNav.vue       # Barra inferior móvil con botón central elevado de escaneo
│   │   ├── CardDetailModal.vue # Modal accesible de historia patrimonial de cartas
│   │   └── RutaDetalleModal.vue # Modal/drawer con desglose interactivo de museos por ruta
│   ├── data/
│   │   └── mockData.js         # Catálogo oficial de 12 museos, 3 rutas y cartas coleccionables
│   ├── views/
│   │   ├── MapaRutasView.vue   # Vista dual: Mapa interactivo / Catálogo de 12 Museos Sueltos
│   │   ├── EscanerView.vue     # Layout inmersivo h-screen, HUD táctico, retícula y linterna
│   │   └── ColeccionView.vue   # Cuadrícula de 2 columnas de cartas (desbloqueadas y siluetas)
│   ├── App.vue                 # Layout contenedor principal con `<component :is="...">`
│   ├── main.js                 # Punto de entrada de la aplicación Vue
│   └── style.css               # Capa base de Tailwind, safe areas y animaciones de escáner
├── index.html                  # Viewport fit-cover, fuentes y metadatos PWA
├── tailwind.config.js          # Tokens de color oficiales de Chuquisaca (#BA0C2F)
├── vite.config.js              # Configuración optimizada de Vite
└── package.json
```

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor local de desarrollo
npm run dev

# Compilar para producción (PWA optimizada)
npm run build
```
