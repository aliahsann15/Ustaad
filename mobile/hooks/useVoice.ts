import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export const useVoice = (opts?: { apiUrl?: string }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const apiUrl = opts?.apiUrl ?? 'http://10.0.2.2:5000/api/transcribe';

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) throw new Error('Microphone permission required');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      return rec;
    } catch (error) {
      throw error;
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) return null;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);

      if (!uri) throw new Error('No recording uri');

      // read file and POST as multipart/form-data
      const formData = new FormData();
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileType = 'audio/m4a';

      formData.append('audio', {
        uri,
        name: 'voice.m4a',
        type: fileType,
      } as any);

      const resp = await fetch(apiUrl, {
        method: 'POST',
        body: formData as any,
      });
      const json = await resp.json();
      const t = json.transcription || json.text || '';
      setTranscription(t);
      return t;
    } catch (error) {
      setIsRecording(false);
      setRecording(null);
      throw error;
    }
  };

  return { isRecording, startRecording, stopRecordingAndTranscribe, transcription };
};

export default useVoice;
