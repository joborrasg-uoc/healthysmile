let fontBold;
let capturaVideo;
let botoInici;
let experienciaIniciada = false;
let imgArana;
let soPantallaCarrega, soGeneralJoc;

//Funcio principal de configuracio del projecte
async function setup() {
  createCanvas(1024, 600); 

  //Carreguem de recursos
  fontBold = await loadFont('/assets/calibrib.ttf');
  imgArana = await loadImage('/assets/arana.gif');
  soPantallaCarrega = await loadSound('/assets/witch_laugh.mp3');
  soGeneralJoc = await loadSound('/assets/hurry_timer.mp3');
  
  // Crear captura de vídeo (càmera)
  capturaVideo = createCapture(VIDEO);
  capturaVideo.size(width, height);
  capturaVideo.hide(); // Amaguem l'element HTML per posteriorment mostrar-lo

  // Botó d'inici per demanar permís i iniciar àudio/càmera
  botoInici = createButton("Iniciar captura de moviment");
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  botoInici.position(canvasX + width / 2 - 120, canvasY + height / 2 + 20);
  botoInici.class("boto_permis"); 
  botoInici.mousePressed(iniciarExperiencia);
  
  // Carregar el model de visió de MediaPipe
  inicialitzarMediaPipe();
}

function iniciarExperiencia() {
  experienciaIniciada = true;
  botoInici.hide(); // Amaguem el botó un cop iniciat

 
}

function draw() {
  background(20);

  //Controlem la el presioni el boto d'inici i carreguem els recursos de camara
  controlCamaraIVisualitzacio();

  //Vistualitzacio de temps Boca Oberta
  if(experienciaIniciada){
    if (soGeneralJoc && !soGeneralJoc.isPlaying()) {
      soGeneralJoc.play();
      soGeneralJoc.loop(); // Es reprodueix contínuament en bucle
    }
    controlTempsBocaOberta();
    gestionarParticulesHalloween();
  }
}

