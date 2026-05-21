import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// POST /api/transcribe - accepts multipart/form-data audio file under 'audio'
export const transcribeAudio = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: 'No audio uploaded' });

    const audioPath = file.path;

    // If Google Speech-to-Text key is present, forward the audio for transcription
    const googleKey = process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY;
    if (googleKey) {
      const audioBytes = fs.readFileSync(audioPath).toString('base64');
      const body = {
        config: {
          encoding: 'LINEAR16',
          languageCode: 'en-PK',
          sampleRateHertz: 44100,
        },
        audio: {
          content: audioBytes,
        }
      };

      const resp = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await resp.json();
      const transcription = json.results?.map((r: any) => r.alternatives?.[0]?.transcript).join(' ') || '';
      // cleanup
      try { fs.unlinkSync(audioPath); } catch (e) {}
      return res.json({ transcription });
    }

    // Fallback: simple stub transcription (for offline/dev) - return filename as text
    const stub = `Transcribed audio: ${path.basename(audioPath)}`;
    try { fs.unlinkSync(audioPath); } catch (e) {}
    return res.json({ transcription: stub });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default { transcribeAudio };
