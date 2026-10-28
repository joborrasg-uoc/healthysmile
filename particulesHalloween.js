// Array global per disposar de les particules actives per cada instant
let llistaParticules = [];
let tipusImatges = 'fase1';
/**
 * Classe que defineix el comportament individual de cada partícula
 */
class ParticulaHalloween {
  constructor(x, y, fase) {
    this.x = x;
    this.y = y;
    this.fase = fase; 

    // Movem la imatge cap amunt amb dispersió lateral
    this.vx = random(-3, 3);
    this.vy = random(-5, -1);

    // Propietats visuals
    this.mida = random(24, 38);
    this.alfa = 255; 

    // Assignació d'imatges segons la fase de neteja
    if (this.fase === 'fase1') {
      this.simbol = random(['🧼', '✨']);
    } else if (this.fase === 'fase2') {
      this.simbol = random(['🦇', '👻']);
    } else if (this.fase === 'fase3') {
      this.simbol = random(['🍬', '🍭', '🎃']);
    }
  }

  /**
   * Actualitza la posició
   */
  actualitzar() {
    this.x += this.vx;
    this.y += this.vy;
    this.alfa -= 4; //Efecte de fade-out
  }

  dibuixar() {
    push();
    textAlign(CENTER, CENTER);
    textSize(this.mida);
    fill(255, this.alfa);
    text(this.simbol, this.x, this.y);
    pop();
  }

  estaMorta() {
    return this.alfa <= 0;
  }
}

/**
 * Funció principal de control de l'emissió, actualització i esborrat de partícules
 */
function gestionarParticulesHalloween(segonsOberta) {
  let oberturaBoca = calcularOberturaBoca();
  let bocaOberta = oberturaBoca > umbralDeteccioBocaOberta;

  //Generació de noves partícules
  if (segonsOberta > 0 && bocaOberta && landmarksFacials.length > 0) {
    // Calculador de la posició exacta de la boca 
    let posBocaX = width - (landmarksFacials[13].x * width);
    let posBocaY = landmarksFacials[13].y * height;

    // Emissió segons els segons consecutius d'obertura
    tipusImatges = 'fase1';
    if (segonsOberta > 0 && segonsOberta < 15) {
      tipusImatges = 'fase1';
    } else if (segonsOberta >= 15 && segonsOberta < 30) {
      tipusImatges = 'fase2';
    } else if (segonsOberta >= 30) {
      tipusImatges = 'fase3';
    }
    //un terç dels frames dispara una nova imatge
    if (frameCount % 3 === 0) {
        llistaParticules.push(new ParticulaHalloween(posBocaX, posBocaY, tipusImatges));
      }
  }

  //Renderitzat i eliminació de partícules (Bucle invers per seguretat d'índex)
  for (let i = llistaParticules.length - 1; i >= 0; i--) {
    llistaParticules[i].actualitzar();
    llistaParticules[i].dibuixar();

    //Treiem les particules que ja no es corresponen perque han desaparegut
    if (llistaParticules[i].estaMorta()) {
      llistaParticules.splice(i, 1);
    }
  }
}