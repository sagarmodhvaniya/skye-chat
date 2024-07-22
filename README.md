# Welcome to your Skye-chat 👋


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Change auth and agentId
1. Clone project(and go to function folder cd ./function)
   Method 1 using HTTP --```bash git clone https://github.com/sagarmodhvaniya/skye-chat.git```
   Method 2 using SSH -- ```bash  git@github.com:sagarmodhvaniya/skye-chat.git ```

2. Install Firebase CLI: If you haven't already, install the Firebase CLI:
   ```bash
      npm install -g firebase-tools
   ```
3. Login to Firebase: Authenticate with Firebase:
```bash
      firebase login
   ```
   
4. Navigate to your project directory: Move to the directory where your Firebase project is located.   

5. Chnage required value into `index.js`
   - projectId 
   - location 
   - agentId 
   - serviceAccount(JSON)

6. Deploy function (DO NOT PUSH SECRET ON GIT BEFORE PUSH REMOVE IT)
   ```bash
      firebase deploy --only functions
   ```
   
## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
