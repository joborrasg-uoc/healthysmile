/**
* Funcions auxiliars para realitzar processos
**/
let faceLandmarker;
let landmarksFacials = [];
let modelCarregat = false;
let umbralDeteccioBocaOberta = 25;

let tempsIniciCarrega = null;
let soCarregaReproduit = false;

let tempsIniciBocaOberta = 0;
let tempsTotalObertaSegons = 0;
let bocaObertaAnterior = false;

/**
 * Funció principal de pantalla de carrega
 */
function mostrarPantallaCarrega() {
  // Inicialitzem el temps d'inici la primera vegada que s'executa
  if (tempsIniciCarrega === null) {
    tempsIniciCarrega = millis();
  }

  //Reproduïm una unica vegada el so de la carrega de recursos
  if (soPantallaCarrega && !soCarregaReproduit) {
    soPantallaCarrega.play();
    soCarregaReproduit = true;
  }

  // Càlcul del temps transcorregut i del progrés
  let tempsTranscorregut = millis() - tempsIniciCarrega;
  
  push();
  // Fons fosc de la pantalla de càrrega
  //background(15, 10, 25);
  background(120, 120, 120);
  // Text superior
  fill(249, 115, 22); // Taronja Halloween
  textAlign(CENTER, CENTER);
  textSize(26);
  textFont(fontBold);
  text("Carregant esperits i models facials...", width / 2, height / 2 - 60);

  mostrarBarraCarga(tempsTranscorregut);
  cargarAnimacionArana(tempsTranscorregut);

  pop();
}

/**
 * Carreguem animacio de barra de progrés inicial
 */
function mostrarBarraCarga(tempsTranscorregut){
  let progres = constrain(tempsTranscorregut / duracioCarregaMs, 0, 1);

  // Paràmetres de la barra de progrés
  let ampladaBarra = 400;
  let alçadaBarra = 20;
  let posX = width / 2;
  let posY = height / 2;

  // Fons buit de la barra (Gris fosc/Lila)
  rectMode(CENTER);
  fill(35, 25, 45);
  stroke(168, 85, 247); // Contorn lila fosforescent
  strokeWeight(2);
  rect(posX, posY, ampladaBarra, alçadaBarra, 10);

  // Farcit animat de la barra (Taronja)
  rectMode(CORNER);
  noStroke();
  fill(249, 115, 22);
  let xIniciBarra = posX - (ampladaBarra / 2);
  let yIniciBarra = posY - (alçadaBarra / 2);
  rect(xIniciBarra, yIniciBarra, ampladaBarra * progres, alçadaBarra, 10);

  //Icona de la barra
  let xIcona = xIniciBarra + (ampladaBarra * progres);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("🎃", xIcona, posY - 2);

  // Text de percentatge a la part inferior
  textSize(18);
  fill(200);
  text(`${floor(progres * 100)}%`, width / 2, height / 2 + 45);

  pop();
}

/**
 * Carreguem animacio de aranya en moviment
 */
function cargarAnimacionArana(tempsTranscorregut){
   if (imgArana) {
    let progresArana = constrain(tempsTranscorregut / 3000, 0, 1);
  
    //Moviment de dreta a esquerra
    let aranaX = lerp(width + 60, -100, progresArana);
  
    //Desplaçament vertical oscil·lant
    let alçadaBaseY = 30;
    let aranaY = alçadaBaseY + sin(tempsTranscorregut * 0.005) * 35;
    push();
    translate(aranaX, aranaY-550);
    rotate(HALF_PI);
    image(imgArana, aranaX, aranaY, 80, 80);
    pop();
  }
}

/**
 * S'informa a l'usuari que es detecta si té la boca oberta o no
 */
function controlCamaraIVisualitzacio(){
    // Pantalla de càrrega si el model no està a punt
  if (!modelCarregat) {
    mostrarPantallaCarrega();
    botoInici.hide();
    return;
  }

  // Si l'usuari no ha premut el botó d'inici
  if (!experienciaIniciada) {
    botoInici.show();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont(fontBold);
    text("Premeu el botó per permetre l'accés a la càmera", width / 2, height / 2 - 50);
    return;
  }else{
    botoInici.hide();
  }

  // Dibuixar la imatge en directe de la càmera
  push();
  translate(width, 0);
  scale(-1, 1); // Mirall horitzontal
  image(capturaVideo, 0, 0, width, height);
  pop();

  // Executar la detecció facial amb MediaPipe
  detectarCara(capturaVideo);

  // Obtenir la distància de la boca
  let oberturaBoca = calcularOberturaBoca();

  // Si la boca està oberta més de 25px (marge ajustable)
  if (oberturaBoca > umbralDeteccioBocaOberta) {
    fill(0, 255, 0);
    textSize(30);
    textAlign(LEFT, TOP);
    textFont(fontBold);
    text(`Mantingues la boca oberta`, 30, height - 50);
    //text(`La boca està oberta: ${nf(oberturaBoca, 1, 1)}px`, 30, height - 50);
  } else {
    fill(255, 0, 0);
    textSize(30);
    textAlign(LEFT, TOP);
    textFont(fontBold);
    text("Obre la boca per a netejar-te les dents!", 30, height - 50);
  }
}

/**
 * Detecta els punts de la cara enviant el frame a MediaPipe.
 */
function detectarCara(videoElement) {
  if (!modelCarregat || !videoElement.elt || videoElement.elt.readyState < 2) return;

  let startTimeMs = performance.now();
  let resultats = faceLandmarker.detectForVideo(videoElement.elt, startTimeMs);

  if (resultats.faceLandmarks && resultats.faceLandmarks.length > 0) {
    landmarksFacials = resultats.faceLandmarks[0]; 
  } else {
    landmarksFacials = [];
  }
}

/**
 * Calcula la distància d'obertura de la boca en píxeles.
 * Utilitza els punts 13 (llavi superior) i 14 (llavi inferior).
 */
function calcularOberturaBoca() {
  if (landmarksFacials.length === 0) return 0;

  // Obtenim les coordenades normalitzades
  let llaviSuperior = landmarksFacials[13];
  let llaviInferior = landmarksFacials[14];

  // Convertim a coordenades de pantalla (píxels)
  let ySup = llaviSuperior.y * height;
  let yInf = llaviInferior.y * height;

  // Retornem la distància vertical
  return dist(llaviSuperior.x * width, ySup, llaviInferior.x * width, yInf);
}

/**
 * Proces de control per detectar si l'usuari té la boca oberta
 */
function controlTempsBocaOberta(){
  let oberturaBoca = calcularOberturaBoca();
  let bocaOberta = oberturaBoca > umbralDeteccioBocaOberta; 

  //Control del temps que l'usuari te la boca oberta
  if (bocaOberta) {
    if (!bocaObertaAnterior) {
      // Un cop s'obre la boca, guardem el temps d'inici
      tempsIniciBocaOberta = millis();
      bocaObertaAnterior = true;
    }
    // Temps transcorregut en segons
    tempsTotalObertaSegons = (millis() - tempsIniciBocaOberta) / 1000;
  } else {
    // Si tanca la boca, es reinicia el comptador
    bocaObertaAnterior = false;
    tempsTotalObertaSegons = 0;
  }

  // Dibuixa el comptador i la barra (amb objectiu de 60 segons)
  dibuixarComptadorBocaOberta(tempsTotalObertaSegons, 60);
  gestionarParticulesHalloween(tempsTotalObertaSegons);
}

/**
 * Dibuixa un comptador visual i una barra de progrés del temps de neteja.
 */
function dibuixarComptadorBocaOberta(tempsSegons, objectiuSegons) {
  push();

  // Format de les dades a mostrar
  let segonsFormatats = nf(tempsSegons, 1, 1); // Mostra 1 decimal
  let percentatge = constrain(tempsSegons / objectiuSegons, 0, 1);

  // Text a mostrar
  let posX = width - 250;
  let posY = 50;
  let ampladaBarra = 450;
  let alçadaBarra = 24;

  rectMode(CENTER);
  
  // Sombra del panell
  fill(0, 0, 0, 180);
  noStroke();
  rect(posX, posY, ampladaBarra + 40, 80, 15);

  // Barra de progrés (canvia de color segons la fase)
  rectMode(CORNER);
  let xBarra = posX - (ampladaBarra / 2);
  let yBarra = posY + 5;

  // Fondo de la barra
  fill(50);
  rect(xBarra, yBarra, ampladaBarra, alçadaBarra, 10);

  // Farcit de la barra segons la fase de neteja
  if (tempsSegons < 15) {
    fill(147, 51, 234); // Lila (Fase 1: Sabó)
  } else if (tempsSegons < 30) {
    fill(234, 88, 12);  // Taronja Halloween (Fase 2: Espantar Monstres)
  } else {
    fill(34, 197, 94);   // Verd fosforescent (Fase 3: Neteja Màxima!)
  }
  
  rect(xBarra, yBarra, ampladaBarra * percentatge, alçadaBarra, 10);

  // Text del comptador
  textAlign(CENTER, CENTER);
  textFont(fontBold);
  textSize(22);
  fill(255);

  if (tempsSegons > 0) {
    if (tempsSegons < 15) {
      text(`🧼 Netejant amb sabó i espurnes... ${segonsFormatats}s 🎃`, posX, posY - 18);
    } else if (tempsSegons < 30) {
      text(`🦇 Espantant monstres de Halloween! ${segonsFormatats}s 🎃`, posX, posY - 18);
    } else {
      text(`🍬 Recompensa de caramels aconseguida! ${segonsFormatats}s`, posX, posY - 18);
    }
  } else {
    fill(239, 68, 68);
    text("Obre la boca per començar a netejar!", posX, posY - 18);
  }

  pop();
}

