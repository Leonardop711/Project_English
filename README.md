# CYBER-SYNTH CODE // Neo-Tech Code Rhythm Engine ⚡🎹

Juego interactivo de programación rítmica con estética **Neo-Tech / Cyberpunk**, desarrollado con **React**, **Vite**, **CSS puro moderno** y un sintetizador reactivo basado en la **Web Audio API**.

---

## 🚀 Cómo Iniciar el Juego

Para ejecutar la aplicación en tu navegador:

```bash
npm run dev
```

Abre en tu navegador la dirección indicada (por defecto `http://localhost:3000` o `http://localhost:5173`).

---

## 🎮 Mecánicas de Juego

1. **Escritura Musical en Tiempo Real**:
   - Cada pulsación correcta genera notas afinadas en la escala **Cyber Synth Pentatonic / Synthwave** (Re menor / D minor).
   - Los diferentes tokens del lenguaje (palabras clave, cadenas de texto, llaves, puntos y espacios) activan modulaciones, filtros y armónicos específicos.

2. **Pistas de Música 8-Bit Chiptune Reactivas (APU)**:
   - Reproductor integrado con 4 canales retro reales: **Onda cuadrada (Lead), Arpegio rápido, Bajo triangular (NES) y Batería de ruido blanco**.
   - **4 Pistas Retro 8-Bit disponibles**:
     - *01: 8-Bit Cyber Genesis (125 BPM)*
     - *02: Neo Megaman Rush (138 BPM)*
     - *03: Quantum Chip Hazard (120 BPM)*
     - *04: Overclock 8-Bit Climax (148 BPM)*
   - **Evolución por Combo**:
     - Base: Bajo triangular + Batería 8-bit.
     - Combo 5+: Se activa el canal melódico principal (*Lead*).
     - Combo 10+: Se activa el canal de arpegios rápidos (*Arp*).
     - Combo 20+: Modo *Overdrive* con brillo y vibrato armónico completo.
   - **Reacción a Fallos**: Al fallar un carácter, la pista 8-bit sufre un *pitch-drop* y glitch momentáneo antes de volver al ritmo base.

3. **Combo Perfecto y Armonía Sónica**:
   - Mantener una racha sin errores incrementa el **Combo** y desbloquea multiplicadores (x1.5, x2.0, x4.0).
   - Al subir el combo, el sintetizador agrega eco espacial, sub-bajos y frecuencias ricas para que la melodía suene cristalina y triunfal.

3. **Distorsión Glitch por Fallos**:
   - Si pulsas un carácter incorrecto, el sintetizador dispara una **distorsión sónica agresiva (bitcrush + onda diente de sierra desafinada)**.
   - El combo se reinicia a cero y el buffer visual parpadea en rojo advertencia, penalizando el ritmo.

4. **Niveles Estructurados**:
   - **Nivel 01: Núcleo de Iniciación**: `console.log("¡Hola, Mundo!");`
   - **Nivel 02: Bancos de Memoria**: Variables `const` y `let`.
   - **Nivel 03: Defensas del Firewall**: Bifurcaciones lógicas `if-else`.
   - **Nivel 04: Sincronizador de Arrays**: Bucles de iteración cuántica `for`.
   - **Nivel 05: Sobrecarga Asíncrona**: Promesas y protocolos `async / await`.

---

## 🎨 Estética Neo-Tech

- **CRT Scanlines y Viñeta Óptica**: Filtros cinematográficos de terminal retro-futurista.
- **Osciloscopio & Analizador de Espectro en Vivo**: Visualizador en Canvas sincronizado a 44.1 kHz.
- **HUD Cyberpunk**: Indicadores de estabilidad, precisión porcentual, multiplicadores y selector de matrices.
- **Teclado Virtual Cyber & Macros**: Atajos táctiles y visuales para jugar en cualquier pantalla o dispositivo móvil.
