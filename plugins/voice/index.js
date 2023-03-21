const { ipcRenderer } = require('electron');
const settings = require('../../main/settings');


let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

function init() {
  const voiceIcon = document.querySelector('#plugin-icons-container .fa-microphone');

  voiceIcon.addEventListener('click', () => {
    if (!isRecording) {
      startRecording();
      voiceIcon.style.color = 'red';
    } else {
      stopRecording();
      voiceIcon.style.color = '';
    }
  });
}

async function startRecording() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener('stop', async () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      recordedChunks = [];
      const voiceInput = await sendAudioToServer(blob);
      document.getElementById('input-text').value = voiceInput;
    });

    mediaRecorder.start();
    isRecording = true;
  } catch (err) {
    console.error('Error starting recording:', err);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    isRecording = false;
  }
}

async function sendAudioToServer(blob) {
  try {
    const formData = new FormData();
    formData.append("audio", blob, "audio.webm");

    const response = await fetch("http://localhost:3000/api/plugins/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const transcription = await response.text();
    const inputText = document.getElementById("input-text");
    inputText.value = transcription;

    // Add these lines to handle voice input in the conversation history
    ipcRenderer.send("voice-input", transcription);
    return transcription;
  } catch (error) {
    console.error("Error sending audio to server:", error);
    throw error;
  }
}






module.exports = {
  name: 'voice',
  icon: 'microphone',
  init,
};
