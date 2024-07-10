import React, { useState, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet, Image } from 'react-native';

const TypingIndicator: React.FC = () => {
  const [animation1] = useState(new Animated.Value(0));
  const [animation2] = useState(new Animated.Value(0));
  const [animation3] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation1, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation1, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation2, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation2, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 500);

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation3, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation3, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 1000);
  }, [animation1, animation2, animation3]);

  const opacity1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.typingIndicator}>
        <Animated.Image
          source={require('../assets/images/typing.png')}  // Update this path as necessary
          style={[styles.image, { opacity: opacity1 }]}
        />
        <Animated.Image
          source={require('../assets/images/typing.png')}  // Update this path as necessary
          style={[styles.image, { opacity: opacity2 }]}
        />
        <Animated.Image
          source={require('../assets/images/typing.png')}  // Update this path as necessary
          style={[styles.image, { opacity: opacity3 }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingLeft: 5,
    marginBottom:7
  },
  typingIndicator: {
    height:38,
    width: 100  ,  // Adjust the width as necessary
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#3f8783',  // Adjust the background color as necessary
    marginBottom:10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: 20,  // Adjust the width as necessary
    height: 10,  // Adjust the height as necessary
    marginHorizontal: 1,  // Adjust the margin as necessary
  },
});

export default TypingIndicator;
