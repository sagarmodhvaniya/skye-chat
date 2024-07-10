import { colors } from '@/app/constants';
import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Bubble, BubbleProps } from 'react-native-gifted-chat';

const CustomBubble: React.FC<BubbleProps> = (props) => {
  const { wrapperStyle, textStyle, ...restProps } = props;

  return (
    <Bubble
      {...restProps}
      wrapperStyle={{
        left: [styles.leftBubble, wrapperStyle?.left],
        right: [styles.rightBubble, wrapperStyle?.right],
      }}
      textStyle={{
        left: [styles.leftText, textStyle?.left],
        right: [styles.rightText, textStyle?.right],
      }}
    />
  );
};

const commonBubble: ViewStyle = {
  padding: 8,
  marginVertical: 5,
};

const commonText: TextStyle = {
  fontFamily: 'Poppins',
  fontWeight: '500',
  fontSize: 19,
  lineHeight: 20,
};

const styles = StyleSheet.create({
  leftBubble: {
    ...commonBubble,
    backgroundColor: colors.recieveContainerColor,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 20,
    marginBottom: 25,
    marginTop: -5,
    marginLeft: 10,
  },
  rightBubble: {
    ...commonBubble,
    backgroundColor: colors.sendContainerColor,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 20,
    marginBottom: 20,
    marginRight: 10,
  },
  leftText: {
    ...commonText,
    color: colors.recieveTextColor,
  },
  rightText: {
    ...commonText,
    color: colors.sendTextColor,
  },
});

export default CustomBubble;
