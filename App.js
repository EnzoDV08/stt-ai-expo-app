import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function App() {

  const [text, setText] = useState('');

  const handlePress = () => {
    //TODO: AI Service Functionality
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 Text-to-Speech</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text to convert"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Convert to Speech" onPress={handlePress} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
