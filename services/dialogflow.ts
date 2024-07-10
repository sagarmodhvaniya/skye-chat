import axios, { AxiosRequestConfig } from "axios";
import type { DialogFlowResponse } from "../types/dialogflow";

const url = 'https://helloworld-crnm5jhpia-uc.a.run.app/';
// Uncomment below for local development
// const url = 'http://localhost:3000/';

const BUTTON_TYPE = "button";
const LIST_TYPE = "list";
const EVENT_MARKER = "00EVENT00";

/**
 * Function to detect intent using DialogFlow.
 * @param text - Text to send to DialogFlow.
 * @param sessionId - Session ID for maintaining context.
 * @returns Promise<DialogFlowResponse>
 */
const detectIntent = async (text: string, sessionId: string): Promise<DialogFlowResponse> => {
  // Prepare data to be sent in the request
  const data = { text, sessionId };

  try {
    // Configure the request
    const config: AxiosRequestConfig = {
      url: url,
      data,
      method: 'post'
    };

    // Send the request and get the response
    const response = await axios(config);

    // Return the response data cast to the expected type
    return response.data as DialogFlowResponse;
  } catch (error) {
    // Log the error
    console.error('Error in dialogflow communication', error);

    // Return a generic error response
    return {
      message: 'text',
      text: { text: ['Sorry, something went wrong. Please try again later.'] }
    };
  }
};

/**
 * Format the quick reply message from DialogFlow payload.
 * @param data - Array of payloads from DialogFlow response.
 * @returns { isBlockMode: boolean, message: any[] }
 */
const formateQuickReplyMessage = (data: any[]): { isBlockMode: boolean, message: any[] } => {
  try {
    const message: any[] = [];
    let isBlockMode = false;
    let isButton = false;
    const values: { title: any; value: any, subtitle?: any }[] = [];

    data.forEach((element: any[]) => {
      element.forEach((payloadElement: {
        title: any;
        subtitle: any;
        mode: string;
        type: string;
        text: any;
        event: { event: string };
      }) => {
        const { type, mode, text, event } = payloadElement;

        if (type === BUTTON_TYPE) {
          // Process button type payload
          isButton = true;
          const value = event?.event ? `${EVENT_MARKER}${event.event}${EVENT_MARKER}` : text;
          values.push({ title: text, value });
          isBlockMode = mode === 'blocking';
        } else if (type === LIST_TYPE) {
          // Process list type payload
          const value = `${EVENT_MARKER}${payloadElement.title}${EVENT_MARKER}`;
          values.push({ title: payloadElement.title, subtitle: payloadElement.subtitle, value });
        }
      });
    });

    // Determine message format based on payload type
    const messageType = isButton ? 'quickReplies' : 'list';
    message.push({
      [messageType]: {
        type: isButton ? 'radio' : undefined,
        keepIt: false,
        values: values,
      },
    });

    // Return formatted message and blocking mode flag
    return {
      isBlockMode,
      message
    };
  } catch (error) {
    // Handle any errors during formatting (if necessary)
    console.error('Error formatting quick reply message:', error);
    throw error; // Propagate the error
  }
};

export { detectIntent, formateQuickReplyMessage };
