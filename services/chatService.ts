import { detectIntent, formateQuickReplyMessage } from '../services/dialogflow';

interface QuickReplyElement {
  isBlockMode?: boolean; // Corrected typo
  text: string;
  quickReplies?: any;
}

export const processBotResponse = async (msg: string, sessionId: string) => {
  try {
    const result = await detectIntent(msg, sessionId);
    return result;
  } catch (error) {
    console.error('Error processing bot response:', error);
    throw error;
  }
};

export const handleGoogleResponse = async (result: any[], sendBotResponse: (text: QuickReplyElement) => void) => {
  try {
    for (const element of result) {
      if (element.message === 'text' && element.text?.text?.[0]) {
        sendBotResponse({ text: element.text.text[0] });
      } else if (element.message === 'payload' && element.payload?.richContent) {
        const response = formateQuickReplyMessage(element.payload.richContent);
        response.message.forEach((quickReplyElement: QuickReplyElement) => {
          quickReplyElement.isBlockMode = response.isBlockMode; // Corrected typo
          sendBotResponse({ text: element.text, ...quickReplyElement });
        });
      }
    }
  } catch (error) {
    console.error('Error handling Google response:', error);
    throw error;
  }
};
