# Subtexto

Herramienta de análisis conversacional que transcribe audios y detecta el "subtexto" emocional detrás de las palabras usando la API de OpenAI.

## Qué hace

1. **Transcripción de audio** — Convierte archivos `.mp3` o `.opus` a texto usando Whisper.
2. **Análisis de subtexto** — Analiza la transcripción con GPT-4o para detectar contradicciones, cambios de tono, emociones implícitas y la narrativa real detrás de la conversación.

## Requisitos

- Node.js (v18+)
- Una API key de OpenAI

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```
OPENAI_API_KEY=tu_api_key_aqui
```

## Uso

### Transcribir un audio MP3

```bash
node process-audio.js
```

Transcribe el archivo de audio configurado en el script y guarda el resultado como JSON.

### Convertir y transcribir audios Opus

```bash
node convert-opus.js [carpeta_de_audios]
```

Convierte archivos `.opus` a `.mp3` usando FFmpeg y luego los transcribe con Whisper. Por defecto lee de `./opus-audios`.

### Analizar el subtexto de una transcripción

```bash
node analyze-subtexto.js
```

Lee una transcripción JSON y genera un análisis emocional en Markdown (`analisis_subtexto.md`) que incluye:

- Contradicciones y ambigüedades
- Cambios de tono y emociones implícitas
- Momentos emocionalmente intensos
- Palabras clave y temas dominantes
- Interpretación narrativa

## Stack

- [OpenAI API](https://platform.openai.com/) (Whisper + GPT-4o)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) para conversión de audio
- Node.js (ESM)
