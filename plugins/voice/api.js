// voice-plugin/api.js

const express = require('express');
const router = express.Router();
const { Readable, PassThrough } = require('stream');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const settings = require('../../main/settings');

const speech = require('@google-cloud/speech');

async function convertAudioToLinear16(audioBuffer) {
  return new Promise((resolve, reject) => {
    const inputFormat = 'webm';
    const outputFormat = 'wav';

    const inStream = new Readable({
      read() {
        this.push(audioBuffer);
        this.push(null);
      },
    });

    const outStream = new PassThrough();

    ffmpeg(inStream)
      .inputFormat(inputFormat)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format(outputFormat)
      .on('error', (error) => {
        console.error('Error converting audio:', error);
        reject(error);
      })
      .pipe(outStream);

    const chunks = [];
    outStream.on('data', (chunk) => chunks.push(chunk));
    outStream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function transcribeAudioFile(audioBuffer, encoding = 'LINEAR16', sampleRateHertz = 16000, languageCode = 'en-US') {
  const googleCloudCredentials = settings.get('google-cloud-credentials');
  if (!googleCloudCredentials) {
    throw new Error('Google Cloud credentials not found');
  }

  const credentials = JSON.parse(googleCloudCredentials);
  const client = new speech.SpeechClient({ credentials });

  const request = {
    audio: {
      content: audioBuffer.toString('base64'),
    },
    config: {
      encoding,
      sampleRateHertz,
      languageCode,
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded');
      return;
    }

    const audioBuffer = req.file.buffer;
    const linear16Buffer = await convertAudioToLinear16(audioBuffer);
    const transcription = await transcribeAudioFile(linear16Buffer);
    res.send(transcription);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).send('Error transcribing audio');
  }
});


module.exports = router;
