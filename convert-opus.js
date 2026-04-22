import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import OpenAI from 'openai';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INPUT_DIR = process.argv[2] || './opus-audios';
const OUTPUT_DIR = path.join(__dirname, 'audios-textos');

function convertToMp3(opusPath, mp3Path) {
  return new Promise((resolve, reject) => {
    ffmpeg(opusPath)
      .audioCodec('libmp3lame')
      .audioBitrate('320k')
      .on('end', () => resolve(mp3Path))
      .on('error', (err) => reject(err))
      .save(mp3Path);
  });
}

async function transcribe(mp3Path) {
  const file = fs.createReadStream(mp3Path);
  return openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'json',
    language: 'es',
  });
}

async function main() {
  const inputDir = path.resolve(INPUT_DIR);

  if (!fs.existsSync(inputDir)) {
    console.error(`La carpeta "${inputDir}" no existe.`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const opusFiles = fs.readdirSync(inputDir).filter((f) => f.endsWith('.opus'));

  if (opusFiles.length === 0) {
    console.log('No se encontraron archivos .opus en', inputDir);
    return;
  }

  console.log(`Encontrados ${opusFiles.length} archivo(s) .opus en ${inputDir}\n`);

  for (const file of opusFiles) {
    const baseName = path.basename(file, '.opus');
    const opusPath = path.join(inputDir, file);
    const mp3Path = path.join(inputDir, `${baseName}.mp3`);
    const jsonPath = path.join(OUTPUT_DIR, `${baseName}.json`);

    try {
      console.log(`[${baseName}] Convirtiendo .opus -> .mp3 ...`);
      await convertToMp3(opusPath, mp3Path);
      console.log(`[${baseName}] Conversion completa.`);

      console.log(`[${baseName}] Transcribiendo con Whisper ...`);
      const response = await transcribe(mp3Path);
      fs.writeFileSync(jsonPath, JSON.stringify(response, null, 2));
      console.log(`[${baseName}] Transcripcion guardada en ${jsonPath}\n`);
    } catch (err) {
      console.error(`[${baseName}] Error: ${err.message}\n`);
    }
  }

  console.log('Proceso completo.');
}

main();
