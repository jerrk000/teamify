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

This currently works fo frontend/Teamify (after I updated to SDK 54) with the line from above in combination with Expo Go 

I tried using the Expo Go App to try the ignite-boilerplate, but they are currently not compatible. (4.2.2026)
