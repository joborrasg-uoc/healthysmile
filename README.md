# 🎃 HealthySmile Lab — Halloween Edition

**HealthySmile Lab**  és una empresa que té la necessitat d'implementar una nova aplicació per ajudar als nens petits en el procés de raspallat de les seves dents. 

El projecté generat conté la incorporació d'una llibreria de captura de moviment facial per a poder fer més efectiva la tasca d'animar als més petits a tenir una bona neteja bocal. Mitjançant tècniques de visió per ordinador i filtratge digital interactiu, l'aplicació transforma la rutina diària del raspallat de dents dels nens en un joc temàtic de Halloween.

El sistema detecta l'obertura de la boca en temps real utilitzant la càmera web i genera un **sistema de partícules dinàmic i evolutiu** dividit en tres fases temporals per motivar l'usuari a mantenir una higiene bucal completa.

---

## 📋 Index 
1. [Característiques Principals](#-característiques-principals)
2. [Arquitectura i Tecnologies](#-arquitectura-i-tecnologies)
3. [Estructura del Projecte](#-estructura-del-projecte)
4. [Instal·lació i Desenvolupament](#-instal·lació-i-desenvolupament)
5. [Empaquetat d'escriptori (Tauri)](#-empaquetat-descriptori-tauri)
6. [Recursos Multimèdia i Llicències](#-recursos-multimèdia-i-llicències)
7. [Llicència del Projecte](#-llicència-del-projecte)

---

## ✨ Característiques Principals

* **Pantalla de càrrega temàtica:** Animació d'aranya oscil·lant (`arana.gif`), barra de progrés i efecte sonor d'inici (`witch_laugh.mp3`).
* **Detecció facial amb MediaPipe:** Utilitza *MediaPipe Face Landmarker* per mesurar la distància entre els llavis superior i inferior (landmarks 13 i 14).
* **Sistema de partícules evolutiu (3 Fases):**
  1. **Fase 1 (<15 segons):** Bombolles de sabó (`sabo.png`) i espurnes (`✨`) per iniciar la neteja.
  2. **Fase 2 (15 - 30 segons):** Monstres espantats sortint de la boca (`🦇`, `👻`).
  3. **Fase 3 (> 30 segons):** Recompensa visual de caramels i dolços (`🍬`, `🍭`, `🎃`).
* **Gestió d'interrupcions:** Si l'usuari tanca la boca, el temps es reseteja a 0 per reiniciar el repte.
* **HUD i Feedback visual:** Indicadors en temps real amb missatges dinàmics i barra de progrés en la part inferior de la pantalla.
* **Àudio immersiu:** Fil musical d'urgència (`hurry_timer.mp3`) reproduït en bucle durant l'experiència activa.

---

## 🛠️ Arquitectura i Tecnologies

* **[p5.js (v2.3.4)](https://p5js.org/):** Llibreria principal per al dibuix del canvas 2D (mode P2D), gestió de fotogrames i física de partícules.
* **[p5.sound.js (v0.4.1)](https://p5js.org/reference/#/libraries/p5.sound):** Reproducció i control del flux d'àudio.
* **[MediaPipe Face Landmarker (v0.10.14)](https://developers.google.com/mediapipe):** Llibreria externa per al seguiment de punts de referència facials en temps real.
* **[Tauri](https://tauri.app/):** Framework per construir aplicacions d'escriptori utilitzant Rust.

---

## 📂 Estructura del Projecte

```text
healthysmile/
├── assets/
│   ├── arana.gif           # GIF animat de l'aranya per a la pantalla de càrrega
│   ├── witch_laugh.mp3     # So d'inici i riure de la bruixa
│   ├── hurry_timer.mp3     # So de tensió en bucle per a l'activitat
│   └── calibrib.ttf        # Tipografia per a l'HUD
├── particulesHalloween.js  # Classe ParticulaHalloween i lògica de les 3 fases
├── utils.js                # Interfície visual, pantalles de càrrega i càlculs temporals
├── sketch.js               # Cicle de vida de p5.js (setup, draw) i setup de càmera
├── style.css               # Estils globals i contenidor del canvas
├── index.html              # Punt d'entrada de l'aplicació web
└── README.md               # Documentació del projecte
```

---

## 💻 Instal·lació i Desenvolupament

Per executar el projecte dins p5.js:

1. Clonar el següent repositori:
   ```bash
   git clone https://github.com/joborrasg-uoc/healthysmile.git
   cd healthysmile
   ```
2. Carregar tots els recursos a un nou projecte p5.js
3. Executar el projecte en el navegador en viu del Editor Web

---

## 📦 Empaquetat d'escriptori (Tauri)

Per generar l'executable d'escriptori (.exe / .app / .deb):

1. **Prerequisits:** s'ha de tenir instal·lat Node.js, Rust (`rustc` / `cargo`) i els complements C++ de Visual Studio.
2. Executar la compilació en mode desenvolupament:
   ```bash
   npm run tauri dev
   ```
3. Generar el paquet final optimitzat:
   ```bash
   npm run tauri build
   ```
El binari executable es generarà a la carpeta `src-tauri/target/release/bundle/msi`.

---

## 🎨 Recursos Multimèdia i Llicències

* **Àudios (`witch_laugh.mp3`, `hurry_timer.mp3`):** Efectes de so lliures de drets procedents de Freesound.org (Llicència **CC0** / Public Domain).
* **Animació Aranya (`arana.gif`):** Recurs lliure d'ús per a projectes educatius i interactius.
* **Emojis (carbaça, espurnes, rat-penat, fantasma, piruleta, carmel):** Emojis lliures d'ús (CC0) per a projectes educatius i interactius.
---

## 📄 Llicència del Projecte

Aquest projecte està distribuït sota la llicència **Creative Commons Zero v1.0 Universal (CC0 1.0) - Dedicació al Domini Públic**. Sou lliures de copiar, modificar, distribuir i executar el treball, fins i tot amb fins comercials, sense demanar cap permís.