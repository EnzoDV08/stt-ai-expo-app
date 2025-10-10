# Google Cloud Text-to-Speech in Expo React Native
#### DV300 Semester 2: Lecture 13 - 2025

This tutorial guides you through building a simple Text-to-Speech (TTS) app using React Native (Expo) and Google Cloud’s Text-to-Speech API.

By the end, you’ll have an app that takes user input and converts it into realistic speech using Google’s AI-powered voice synthesis.

### Learning Outcomes

After completing this tutorial, you will:
* Understand how to integrate a Google Cloud AI API into a React Native project.
* Learn how to make HTTP POST requests to cloud services using Axios.
* Use Expo’s FileSystem and Audio APIs to handle and play back audio.
* Build a functional, minimal AI-powered app from scratch.

### Prerequisites

Before starting, make sure you have the following:
* Node.js and npm or yarn installed.
* A Google Cloud Platform (GCP) account.
* Basic knowledge of React Native.

<hr/>

## Step 1: Clone this Expo Project

Run the following command in your terminal:
```bash 
git clone https://github.com/Armand-OW/stt-ai-expo-app.git
```

Then install the project's base dependencies:
```bash
npm install
```

Finally, install all the dependencies we’ll need for our functionality:
```bash
npm install axios expo-av expo-file-system buffer
```

## Step 2: Set Up Google Cloud Text-to-Speech

__2.1 Create a Project in Google Cloud Console__

1. Go to [Google Cloud Console](https://console.cloud.google.com/welcome)
2. Create a new project (or use an existing one).
3. Navigate to APIs & Services > Library.
4. Search for Text-to-Speech API and enable it.

__2.2 Generate an API Key__

1. Go to APIs & Services > Credentials > Create Credentials > API Key.
2. Copy your API key.
3. Keep it safe — this key allows access to your project’s resources.

_Please Note: For production use, always store API keys securely (e.g., in environment variables). Do not hard-code them in your app._

## Step 3: Set Up the AI Service Module

Create a new file called `AIService.js` in your project root and add the following code:
```js
import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

const API_KEY = 'YOUR_API_KEY_HERE';
const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const setAudioMode = async () => {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
  });
};

const textToSpeech = async (text) => {
  try {
    console.log("Generating speech...");

    await setAudioMode();

    const response = await axios.post(GOOGLE_TTS_URL, {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    });

    const audioContent = response.data.audioContent;

    // Convert base64 audio data into binary format
    const audioBuffer = Buffer.from(audioContent, 'base64');
    const filePath = FileSystem.documentDirectory + 'tts-output.mp3';

    await FileSystem.writeAsStringAsync(filePath, audioBuffer.toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Play the generated audio file
    const { sound } = await Audio.Sound.createAsync({ uri: filePath });
    await sound.playAsync();

    console.log("Speech playback complete.");
  } catch (error) {
    console.error('Error using Google TTS API:', error);
  }
};

export default textToSpeech;

```

__What's happening here?__
1. The text the user typed gets sent to Google Cloud’s Text-to-Speech API.

2. Google returns a Base64-encoded audio file.

3. The app saves that audio file locally as an `.mp3` (using Expo FileSystem).

4. The app plays the MP3 file using the device’s sound system (using Expo Audio).

## Step 4: Update the UI to call the service functionality

Open `App.js` and replace its contents with this:
```js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import textToSpeech from './AIService';
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');

  const handlePress = () => {
    if (text.trim()) {
      textToSpeech(text);
    } else {
      alert("Please enter text to convert.");
    }
  };

  return (
    //... UI
  );
}

const styles = StyleSheet.create({
  //... Styling
});

```

## Step 6: Run the App

Run your project:
```bash
npx expo start
```

Then scan the QR code with the Expo Go app (iOS/Android). Enter some text, press Convert to Speech, and listen to your device speak!

## Step 7: Language Expansion

As a bonus, do some research on using different voices for the speech object.

## Fin... 

Author: Armand Pretorius