import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import textToSpeech from './AIService';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFile, setLastFile] = useState(null);
  const [error, setError] = useState('');

  const handleSpeak = async () => {
    setError('');
    if (!text.trim()) return setError('Please enter text first.');
    setLoading(true);
    try {
      const fileUri = await textToSpeech(text.trim());
      setLastFile(fileUri);
    } catch (e) {
      setError(e.message || 'Failed to generate speech.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Text-to-Speech (Expo)</Text>
      <TextInput
        style={styles.input}
        placeholder="Type something for me to speak…"
        value={text}
        onChangeText={setText}
        multiline
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Convert to Speech" onPress={handleSpeak} />
      )}
      {lastFile && <Text style={styles.meta}>Saved: {lastFile.replace(/^.*\//, '')}</Text>}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  meta: { fontSize: 12, color: '#666', textAlign: 'center' },
  error: { color: 'tomato', textAlign: 'center' },
});
