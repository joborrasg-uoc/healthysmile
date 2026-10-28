const duracioCarregaMs = 2000;

/**
 * Carrega el model FaceLandmarker de MediaPipe.
 */
async function inicialitzarMediaPipe() {
  // Pausa de 2 segundos
  await sleep(duracioCarregaMs);
  
  const vision = await window.FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  
  faceLandmarker = await window.FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU" 
    },
    runningMode: "VIDEO",
    numFaces: 1
  });

  modelCarregat = true;
  console.log("Model MediaPipe carregat correctament.");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



