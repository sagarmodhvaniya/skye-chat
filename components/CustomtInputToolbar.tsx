import {GiftedChat, InputToolbar} from 'react-native-gifted-chat'

const CustomtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "green",
          borderColor: "red",
          borderWidth: 3,
          borderRadius:1.5,
          padding: 8,
          margin:2,
          height:10,
          width:20x
        }}
      />
    );
  };
  
  export default CustomtInputToolbar;
