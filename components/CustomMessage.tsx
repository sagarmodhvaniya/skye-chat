// CustomMessage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';

interface CustomMessageProps {
  currentMessage: IMessage & {
    data?: { label: string; description: string }[];
  };
  onItemPress: (item: { title: string; subtitle: string }) => void;
  isDisabled: boolean;
}

const CustomMessage: React.FC<CustomMessageProps> = ({ currentMessage, onItemPress, isDisabled }) => {
  const { list } = currentMessage;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const firstElement = list.values[0];
  return (

    <View style={styles.container}>
      <ScrollView indicatorStyle='black' style={styles.scrollView} scrollEnabled={true}  showsVerticalScrollIndicator={true} >

        {list && list.values && list.values.map((item, index) => (
         index !==-1 && <TouchableOpacity 
            onPress={() => !isDisabled && onItemPress(item)}
            key={index}
            onMouseEnter={() => !isDisabled && setHoveredIndex(index)}
            onMouseLeave={() => !isDisabled && setHoveredIndex(null)}

            style={[
              styles.item,
              hoveredIndex === index && styles.hoveredItem,
              isDisabled && styles.disabledItem,
            ]}
            disabled={isDisabled}

          >

            <Text
              style={styles.label}>
              {item.title}
            </Text>
            <Text
              style={styles.description}>
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    width: '80%',
    margin: 10,
    // overflow: 'scroll',
    marginBottom: 20
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  hoveredItem: {
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
  },
  disabledItem: {
    opacity: 0.5,
  },
  scrollView: {
    height:320,
    // backgroundColor: 'pink',
    // marginHorizontal: 20,
  },
});

export default CustomMessage;