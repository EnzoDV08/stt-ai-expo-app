import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_TTS_KEY; 
const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

async function prepareAudio() {
  try {
    if (Audio && typeof Audio.setAudioModeAsync === 'function') {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    }
  } catch (e) {
    console.warn('[Audio] setAudioMode failed (continuing):', e?.message || e);
  }
}

export default async function textToSpeech(text) {
  if (!text || !text.trim()) throw new Error('Please enter some text');

  await prepareAudio();

  try {
    console.log('[TTS] sending request…');

    const body = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    const res = await axios.post(GOOGLE_TTS_URL, body);
    console.log('[TTS] status', res.status);

    const base64 = res?.data?.audioContent;
    if (!base64) throw new Error('No audio returned from Google TTS');

    const fileUri = (FileSystem.documentDirectory || '') + 'tts-output.mp3';

    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' });

    const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((s) => {
      if (s.isLoaded && s.didJustFinish) sound.unloadAsync();
    });

    console.log('[TTS] playback started →', fileUri);
    return fileUri;
  } catch (err) {
    console.error('[TTS] error', {
      message: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    throw err;
  }
}
