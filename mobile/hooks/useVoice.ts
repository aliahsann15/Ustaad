import { useEffect, useState } from 'react';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

export const useVoice = (opts?: { apiUrl?: string }) => {
  const recording = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recordingState = useAudioRecorderState(recording);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const apiUrl = opts?.apiUrl ?? 'http://10.0.2.2:5000/api/transcribe';

  useEffect(() => {
    setIsRecording(recordingState.isRecording);
  }, [recordingState.isRecording]);

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) throw new Error('Microphone permission required');

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recording.prepareToRecordAsync();
      recording.record();
      setIsRecording(true);
      return recording;
    } catch (error) {
      throw error;
    }
  };

  const stopRecordingAndTranscribe = async () => {
    try {
      await recording.stop();
      const uri = recording.uri;
      setIsRecording(false);

      if (!uri) throw new Error('No recording uri');

      // read file and POST as multipart/form-data
      const formData = new FormData();
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
      throw error;
    }
  };

  return { isRecording, startRecording, stopRecordingAndTranscribe, transcription };
};

export default useVoice;
