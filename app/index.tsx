import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';

const MainScreen: React.FC = () => {
  const navigation = useNavigation();
  const [sessionId, setSessionId] = useState<string>(uuid.v4().toString());

  // Effect to set sessionId when the component mounts
  useEffect(() => {
    setSessionId(uuid.v4().toString());
  }, []);

  // Log navigation object for debugging
  console.log("navigation", navigation);

  // Function to handle navigation to chat screen with specified flow parameters
  const navigateToChat = (flowName: string, flowId: string) => {
    navigation.navigate("chatScreen", {
      flowName,
      flowId,
      sessionId: uuid.v4().toString(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3f8783" barStyle="light-content" />

      {/* Buttons to navigate to different chat flows */}
      <Pressable style={styles.button} onPress={() => navigation.navigate("chatScreen", { sessionId: uuid.v4().toString() })}>
        <Text style={styles.text}>Start chat</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigateToChat('Affirmations', 'Affirmations')}>
        <Text style={styles.text}>Affirmations</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigateToChat('Gratitude', 'Gratitude')}>
        <Text style={styles.text}>Gratitude</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigateToChat('Reflect', 'Reflect')}>
        <Text style={styles.text}>Reflect</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigateToChat('Reframe', 'Reframe')}>
        <Text style={styles.text}>Reframe</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigateToChat('Self-compassion', 'Self-compassion')}>
        <Text style={styles.text}>Self-compassion</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigateToChat('Set intention', 'Set intention')}>
        <Text style={styles.text}>Set intention</Text>
      </Pressable>
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#3f8783',
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;
