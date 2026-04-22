import 'dotenv/config';
import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Leemos el texto plano de la transcripción de Whisper
const data = JSON.parse(fs.readFileSync('./transcripcion_whisper.json', 'utf8'));
const conversacion = data.text;

async function analizarSubtexto(conversacion) {
  const prompt = `
Sos un analista experto en comunicación emocional, lenguaje no verbal y psicología del discurso.

Tu tarea es examinar esta transcripción de una conversación (en español) y detectar:

1. Contradicciones o ambigüedades
2. Cambios de tono o emociones implícitas
3. Momentos emocionalmente intensos
4. Palabras clave y temas dominantes
5. Una interpretación narrativa de lo que realmente está pasando más allá de las palabras

TEXTO:
----
${conversacion}
----

Devolvé un análisis organizado con subtítulos en estilo Markdown (usa ## Título para secciones).
Que sea preciso, emocional y humano.
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  const analisis = res.choices[0].message.content;
  const fileName = 'analisis_subtexto.md';

  fs.writeFileSync(fileName, analisis, 'utf8');
  console.log(`\n✅ Análisis guardado en ${fileName}\n`);
}

analizarSubtexto(conversacion);
