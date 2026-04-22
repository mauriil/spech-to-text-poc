import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const transcribeAudio = async (filePath) => {
  const file = fs.createReadStream(filePath);

  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'json',
    language: 'es',
  });

  fs.writeFileSync('seba3.json', JSON.stringify(response, null, 2));
  console.log('✅ Transcripción guardada como seba3.json');
};

const audioFile = path.join('./seba3.mp3');
transcribeAudio(audioFile);