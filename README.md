# Teamify
App written in React Native and Python, which can split up people in balanced teams, add friends, track winrate, lets you choose different gamemodes and see your own stats (everything needs to be implemented first)

# Good-To-Knows

## Setup & Installtion

Make sure you have the latest version of Python installed. TODO: specific python version needed?

### Clone repo
```bash
git clone <repo-url>
```

### Create venv
```bash
cd teamify
python -m venv venv
```

### Activating venv
```bash
source .venv/bin/activate
```
### Or on windows
```bash
.\.venv\Scripts\activate
```

### Freeze needed requirements
```bash
pip freeze > requirements.txt
```

### Install requirements
```bash
pip install -r requirements.txt
```

## Running The App (deprecated, use flask command at the bottom)

```bash
python main.py
```

## Viewing The App (deprecated, as it is now on expo go)

Go to `http://127.0.0.1:5000`


### Deactivating venv
```bash
source deactivate
```

### Or on windows
```bash
deactivate
```

# New setup:

### Adapt local ip address of laptop
Local ip address for laptop in network changes, find out by using the command "ip a" in terminal (ip address under wlp3s0)

### Run this in the folder where main.py is located, to activate flask API for other devices in network
```bash
flask --app main run --host=0.0.0.0
```

### Then start the expo application by doing this in the folder where app.json is located (i think there is currently also a README.md file explaining within the folder how to start the app, but it is just the next line)
```bash
npx expo start
```

In case you want to use Expo Go on your phone to look at the app, do not forget to press "s" after the QR-Code was generated, so that you actually use Expo Go and not some other version!

This currently works for frontend/Teamify (after I updated to SDK 54) with the line from above in combination with Expo Go 

I tried using the Expo Go App to try the ignite-boilerplate, but they are currently not compatible. (4.2.2026)

So instead, if we want to use something that is based on the ignite-boilerplate, we have to do this in the root of our frontend:
```bash
npx expo prebuild
```
Luckily, we only have to do the prebuild-command when we change `app.json/app.config.*`. This step sometimes takes a while.
As the metro bundler just uses the files outside of the android/ios folder, it is not needed if we just change the UI a little bit.

```bash
npx expo run:android
```
to run the app. If everything is running properly, the Android Studio Emulator should open up automatically with your app running.

### Prerequisites
Why didnt it work immediately? 
Had to
- figure out that boilerplate-code dropped support of Expo Go
- download Android Studio
- add Android SDK to PATH (build failed)
- install proper JDK and add it to PATH (build failed)

## Next steps
Integrate my project into Ignite-boilerplate, because there are already many configs set up that will help us later, like EAS, theme-engine, api-part for backend

### Integrating current project into Ignite-boilerplate (expo-router version)

Pretty much only copy and paste of files, and installing packages that were missing. Some files that were not needed in previous iteration were not copied.

### Added simple auth-flow to app.

Made a new group called **(app)** which checks for authentication in corresponding `_layout.tsx` when used.
If not authenticated, you get redirected to loginscreen. AuthStore in zustand was also created. 
Logout-Button in modal als has functionality now.


## TODO

- Look through all TODOs in code which were created when merging ignite-boilerplate and  original app
- SafeAreaView is deprecated, use "react-native-safe-area-context" instead (https://github.com/th3rdwave/react-native-safe-area-context)
- DONE ALREADY: Look at src/screens folder. Is it needed, is it better to store my screens there? If no, delete
- integrate login and auth
- use MMKV to check if user is already logged in (i can still use zustand "persistent", i just can use MMKV as backend). Delete the `context` folder, as soon as MMKV for zustand is implemented
-fix all the small errors in LoginScreen.tsx. I think i did not copy all types from the DemoApp, so rewrite this.
