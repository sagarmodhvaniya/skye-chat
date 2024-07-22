import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, Dimensions, StyleSheet, Text, View, Pressable } from 'react-native';
import { GiftedChat, InputToolbar, IMessage, Reply, Send } from 'react-native-gifted-chat';
import { colors, BOT, INITIAL_MESSAGES } from './constants';
import TypingIndicator from '../components/TypingIndicator';
import CustomBubble from '../components/ChatBubble';
import CustomMessage from '../components/CustomMessage';
import { processBotResponse, handleGoogleResponse } from '../services/chatService';
import uuid from 'react-native-uuid';
import { useNavigation, useRoute } from '@react-navigation/native';
import { QuickReplies } from 'react-native-gifted-chat/lib/QuickReplies';

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [messages, setMessages] = useState<IMessage[]>(INITIAL_MESSAGES);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [flowId, setFlowId] = useState<string | undefined>(undefined);
  const [flowName, setFlowName] = useState<string>('');
  const [isListDisabled, setIsListDisabled] = useState(false);

  // Initialize chat on component mount
  useEffect(() => {
    if (route?.params?.flowId) {
      setFlowId(route.params.flowId);
      setFlowName(route.params.flowName);
    }

    setIsTyping(true);
    const initializeChat = async () => {
      const result = await processBotResponse(route?.params?.flowId ? route.params.flowName : "Hello", route?.params?.sessionId);
      handleGoogleResponse(result, sendBotResponse);
    };
    initializeChat();
  }, [route]);

  // Handle sending a message
  const onSend = async (messages: IMessage[]) => {
    const messageText = extractMessageText(messages);
    setIsTyping(true);
    messages[0].createdAt = undefined;  // Remove the creation date for new messages
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    try {
      const result = await processBotResponse(messageText, route?.params?.sessionId);
      handleGoogleResponse(result, sendBotResponse);
      setIsTyping(false);
      if (messageText.includes('endsession')) {
        endSession();
      }
    } catch (error) {
      setIsTyping(false);
      setInputDisabled(false);
    }
  };

  // Extract text from message object
  const extractMessageText = (messages: IMessage[]) => {
    const { text, isQuickReply, value } = messages[0];
    if (isQuickReply) {
      return value;
    }
    delete messages[0].isQuickReply;
    delete messages[0].value;
    return text;
  };

  // Handle item press in custom message component
  const handleItemPress = (item: { title: string }) => {
    setIsListDisabled(true);
    setInputDisabled(true);
    const msg: IMessage = {
      _id: uuid.v4(),
      text: item.title,
      isQuickReply: false,
      value: item.title,
      user: { _id: 1 },
    };
    onSend([msg]);
  };

  // Render custom message component based on message type
  const renderCustomMessage = (props: any) => {
    const { currentMessage } = props;
    if (currentMessage.list) {
      return <CustomMessage {...props} onItemPress={handleItemPress} isDisabled={isListDisabled} />;
    }
    return currentMessage.system ? <TypingIndicator /> : <CustomBubble {...props} />;
  };

  // Send bot response and handle different response types
  const sendBotResponse = (response: any) => {
    const msg: IMessage = {
      _id: uuid.v4(),
      text: response.text,
      user: BOT,
    };
    if (response.quickReplies) {
      msg.quickReplies = response.quickReplies;
    } else if (response.list) {
      msg.list = response.list;
    }
    setInputDisabled(response.isBlockMode || false);
    setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
    setIsTyping(false);
  };

  // Render typing indicator if bot is typing
  const renderFooter = () => (isTyping ? <TypingIndicator /> : null);

  // Custom send button
  const renderSend = (props: any) => (
    <Send {...props} alwaysShowSend={true}>
      <View>
        <Image
          style={styles.sendButtonIcon}
          source={props.text.length ? require("../assets/icons/send-text.png") : require("../assets/icons/send.png")}
        />
      </View>
    </Send>
  );

  // Render custom bubble component
  const renderBubble = (props: any) => (
    props.currentMessage.system ? <TypingIndicator /> : <CustomBubble {...props} />
  );

  // Handle quick reply button press
  const onQuickReply = (quickReplies: Reply[]) => {
    setInputDisabled(true);
    const msg: IMessage = {
      _id: uuid.v4(),
      text: quickReplies[0].title,
      isQuickReply: true,
      value: quickReplies[0].value,
      user: { _id: 1 },
    };
    onSend([msg]);
  };

  // End chat session and navigate to home screen
  const endSession = () => {
    const msg: IMessage = {
      _id: uuid.v4(),
      user: BOT,
      system: true,
      text: 'You will be redirected to the home screen shortly.',
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
    navigation.navigate("index");
  };

  // Custom input toolbar based on inputDisabled state
  const customInputToolbar = (props: any) => (
    !inputDisabled && (
      <InputToolbar
        {...props}
        primaryStyle={styles.inputToolbarPrimary}
        containerStyle={styles.inputToolbarContainer}
      />
    )
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.statusBarColor} />
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.navigate("index")}>
          <Image source={require("../assets/icons/left-arrow.png")} style={styles.back} />
        </Pressable>
        <Pressable style={styles.headingLogoMain} onPress={() => navigation.navigate("index")}>
          <Image source={require("../assets/icons/main.png")} style={styles.headingLogo} />
        </Pressable>
        <Text style={styles.headingTitle}>Skye</Text>
        <Text style={styles.flowName}>{flowName}</Text>
      </View>
      <GiftedChat
            accessoryStyle={{height: "auto"}}
        renderBubble={renderBubble}
        renderMessage={renderCustomMessage}
        renderSend={renderSend}
        messages={messages}
        renderAvatar={null}
        renderTime={null}
        onQuickReply={onQuickReply}
        onSend={onSend}
        isTyping={isTyping}
        renderFooter={renderFooter}
        renderInputToolbar={customInputToolbar}
        keyboardShouldPersistTaps={ 'always' }
        renderQuickReplies={(props) => (
          <QuickReplies
            {...props}
            containerStyle={{
              flexDirection: inputDisabled ? 'column-reverse' : 'row',
            }}
            quickReplyStyle={styles.quickReply}
            quickReplyTextStyle={{
              ...styles.quickReplyText,
              color: inputDisabled ? '#3f8783' : '#707070',
            }}
            color={inputDisabled ? '#3f8783' : '#707070'}
          />
        )}
        user={{ _id: 1 }}
        placeholder="Type a message..."
      />
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 33,
    backgroundColor: colors.backgroundColor,
  },
  headingLogoMain: {
    backgroundColor: "#5cc9aa",
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 2,
  },
  headingLogo: {
    margin: -7,
    width: 70,
    height: 70,
  },
  headingTitle: {
    justifyContent: 'center',
    fontSize: 15,
    marginTop: 15,
    fontWeight: 'bold',
    left: 10,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  back: {
    width: 20,
    height: 20,
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center',
    opacity: 0.6,
  },
  flowName: {
    position: 'absolute',
    fontSize: 20,
    right: 10,
    top: 15,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  sendButtonIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    position: 'relative',
    top: -10,
  },
  inputToolbarPrimary: {
    backgroundColor: "white",
    borderColor: "#707070",
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderRadius: 8,
  },
  inputToolbarContainer: {
    borderTopWidth: 0,
  },
  quickReply: {
    borderRadius: 8,
    borderWidth: 2.5,
    justifyContent: 'flex-start',
    minHeight: 20,
    width: 'auto',
    marginBottom: 25,
    marginLeft: 10,
    marginTop: -15,
  },
  quickReplyText: {
    justifyContent: 'flex-start',
    fontSize: 16,
    padding: 0,
    fontWeight: '600',
  },
});

export default ChatScreen;
