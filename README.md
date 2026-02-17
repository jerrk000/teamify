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
Integrate my project into Ignite-boilerplate, because there are already many configs set up that will help us later, like EAS, theme-engine, api-part for backend (with docker?)

### Integrating current project into Ignite-boilerplate (expo-router version)

Pretty much only copy and paste of files, and installing packages that were missing. Some files that were not needed in previous iteration were not copied.

### Added simple auth-flow to app.

Made a new group called **(app)** which checks for authentication in corresponding `_layout.tsx` when used.
If not authenticated, you get redirected to loginscreen. AuthStore in zustand was also created. 
Logout-Button in modal also has functionality now.

### Theming using `styled-components` or just local ThemeProvider.

I just used the local ThemeProvider. Now I am not using stylesheets anymore, but themed objects where the theme is imported from theme-folder, so I only have to define each theme once. The app has to look similar throughout all screens. Changed tabmodal.tsx and now index.tsx. IconSymbol now also change with darkmode. Placeholder colored too.
There is now more or less a basic theme in white/grey and also darkmode. All the important files can be found in the `theme`-folder. 
How to do theming:
For every component/screen do:
At the top:
import { View, type ViewStyle } from "react-native"
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';

In the functional part:
const {
    themed, theme, themeContext,
  } = useAppTheme()

In the render part:
<View style={themed($container)}>

Under the render, where the styles are:
const $container: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.background,
  color: theme.colors.palette.angry500,
})



## Features to implement

### Categorize later

- [ ] Implement option where you can create different teams, to more easily add people to a game. 
- [ ] Think about option of giving people a quick rating (or just yourself), so that it is possible to balance teams without using winrate.
- [ ] Add local player for this session with possibility to add foto too.


### General
- [ ] Darkmode. Also include tabs at the bottom.
- [ ] use more animations in general for more smoothness
- [ ] Create different themes and tell players that some layouts change when you change the theme. Do a standard one, but in settings/preferences you can change it to volleyball/football/basketball, which changes the colours, where the players are located on the partioned teams and the pitch in the background for partitioned teams. Maybe background more green-ish and the pitch too green with white stripes. Volleyball yellow blue (red) (i already took color probes from pictures of beach-volleyballs). Basketball orange??? Standard maybe just white and black, and night mode black and yellow?. Add more realistic football pitch and beach volleyball pitch (maybe with little lines indicating sand). Create your own file for each theme, or add it to light and dark mode as a flavour? Find out what makes more sense, my guess is individual file, as it is its own theme for the whole app.
- [ ] Make notifications in other player apps when they played a game on another phone. Show them who played and who won. Also tell them if a match was deleted again.
- [ ] Give people the possibility to report wrong games, when they get a message of a reported game.
- [ ] Write a bigger README with app-structure of frontend and backend, database structure, screenshots of the app, cool features.
- [ ] Like in Strong-App, show as a push-notification that a match is currently running, how long it is running. And if you click on it you get back to the partitioned teams screen. (maybe use Voltra for this, or the expo thing when Expo 55 is released and stable.)
- [ ] Currently stats for winrate just uses naive bayes. with just pure winrates. Maybe expand this so that it makes a difference playing with/against specific players.
- [ ] Local first data management, in case you dont have internet at this moment. See ignite cookbook "PowerSync for Local-First Data Management"
- [ ] Docker to set up everything with  docker-compose, especially when testing connection to backend.
- [ ] Style the modal more, so that it is just a list on the bottom right corner (style it with reanimated)
- [ ] Use Hermes v1 when Expo 55 is released.
- [ ] Check in general if it makes a difference to change the pressedStyle of buttons (e.g. changing backgroundcolor when pressed)


### Auth and friends
- [ ] use MMKV to stay logged in even after closing the app. Doublecheck because kind of implemented with `persistent` in `AuthStore`.
- [ ] Feature to add the official account of another person to a game without him having the app, so just two accounts in one??
- [ ] Adding a person to a game (e.g. with QR-Code or with Invite by pressing button), so that winrate can be officially tracked. Adding friends to friendslist with QR-Code, design similar to whatsapp or discord with buttonlayout of qr-code, but also posibility to type a name/number combination or send/copy friendcodes. Add a message that accepting friend requests can be risky because then they can add you to games without asking for permission. I guess when displaying your QR-code you can choose between Game-QR-Code and FrienshipRequest-QR-Code.
- [ ] Make button that displays your own QR-Code. Like Whatsapp, also make it possible to open camera to scan qr-code.
- [ ] Add player without official account to the game. Their stats will not be written down or just be marked as "Unknown player"
- [ ] Mark friends in friendlist as favourits, so they show up at the top in the searchbar for everything.
- [ ] Make simplified version of app where you can just add local players for splitting up teams FAST.
- [ ] Make a tab for friends to swipe over, to get to the personalised part about yourself. Make it possible to change the name and add a picture, so that the lineup in initial screen and partitioned screen are nicer to look at



### Initial Screen where you search players
- [ ] Add other game-formats on the initial page. Make a strip at the top where you can change it. Currently only one game, but i could split players also into smaller teams and create a whole tournament-tree. Create a intermediate screen with more controls like maximum team size, group-phase yes no, how many games/sets. Another game format: Keep Score, with possibility of predefined scores when having a specific theme (football, volleyball, maybe tennis (needs different count), basketball)
- [ ] One new game mode: Custom: choose players to participate, but then find a way to add people to individual teams yourself
- [ ] Layout like this 
Change color of field if added. Rounded edges. Little bit of space between each player.
--------------------------------------------------------------------
-                                                                  -
- Picture, Name               ^SignForMoreStats, StarForFavourite  -
-                                                                  -
--------------------------------------------------------------------

- [ ] Theming of buttons. Do clicked items for first primary color, other buttons secondary color. Do this for volleyball theme and darkmode too. Choose very basic primary and secondary colors for 

### Partitioned Teams Screen
- [ ] Drag-and-Drop after teams were created to change the teams howevery you want. Winrate per team should also refresh. (use panhandler and reanimated maybe?). When doing drag and drop, make a grid that makes it easily possible to change players by dragging one playername on the other. Also make a button or zone "Add to Team" which if dragged there, the players gets added to the team without switching another player only show this button/zone if a name is currently dragged. Alternatively no drag and drop, but long presses where  you get a menu with "Change Team" or sth like that. Dont forget to recalculate winrates.
- [ ] Maybe show the number of different combinations. Also when go to previous screen and then back to partioned screen, start again with first combination.
- [ ] Do another view of partitioned teams if phone is in horizontal (landscape) mode
- [ ] Show stats for each game (on partitioned teams screen) when pressing an information button. Either the average radar-chart per team, or winrate and amount of games per player. Maybe turn the "face" of each player around like the playercards in FIFA to reveal more stats.
- [ ] Randomized team should start with fairest team (so winrate closest to 50%), then each "randomize team" button press it gives you the next fairest team. 
- [ ] Short list of last played matches. How long did the game last, which team won.
- [ ] Make a timer which shows how long the current game is running, so that you are always sure if you typed in who won. Reset the timer every time the team changes, obviously. Dont use this time for any stats, it should just help players determine if they already entered the result.
- [ ] Add cutout-pictures of face/upper-body over name, to make it similar like lineup in football. Info button somewhere that spins the icons around to reveal some stats.



### Stats Screen
- [ ] Do more radar charts (maybe implement it yourself? Probably not). Maybe do one radar-chart where you can rate yourself, and do another one where other people can rate you? Maybe bad idea.
- [ ] show more stats. Show general winrate andamount of matches played. For each friend: amount of matches played with each person, Winrate. Show how often you lost against each player, player combination. Do a general ranking of best/worst teammates/opponents independ of friends.
- [ ] Show the last played matches here, and also make the possibility to delete a wrong match.
- [ ] Maybe advanced stats to show you if results are statistically significant.



## TODO

- [ ] Look through all TODOs in code which were created when merging ignite-boilerplate and  original app
- [ ] SafeAreaView is deprecated, use "react-native-safe-area-context" instead (https://github.com/th3rdwave/react-native-safe-area-context)
- [x] Look at src/screens folder. Is it needed, is it better to store my screens there? If no, delete
- [x] integrate login and auth in the frontend
- [ ] use MMKV to check if user is already logged in (i can still use zustand "persistent", i just can use MMKV as backend). Delete the `context` folder, as soon as MMKV for zustand is implemented. Dont forget to check `utils`-Folder, as there are already some functions to load/save values using MMKV.
- [ ]fix all the small errors in LoginScreen.tsx. I think i did not copy all types from the DemoApp, so rewrite this.
- [x]**theme** the app with a common theme and delete the individual themes from the app.
- [ ] Make Randomize-Team Button for partitioned teams exactly in the center
- [x] Bigger line between selected players and list of players (initial screen)
- [ ] Add a cancel-button on the winner-chooser overlay at partitioned players, so that people know how to get back from there.
- [ ] Make it possible to cancel after choosing a winner team in partitioned players overlay.
- [ ] Use EAS to build and submit to playstore.
- [ ] Create and check icons and splashscreens, logos, background pictures
- [ ] Make the partitioned teams screen look good on every screensize.
- [x] Check out IconSymbol in index.tsx. Currently color is hardcoded.
- [ ] Check out HapticTap, i am not sure if there is no feedback when clicking different tabs only on the simulator or in any case. I would like feedback when clicking things.
- [ ] NOW: Make a normal theme, starting with index.tsx.
- [ ] NOW: Fix all the weirdness in index.tsx (like same button design, maybe switch to button from ignite)
- [ ] NOW: Do a clean layout of index.tsx. Do the playernames layout correctly (Picture- Name            ^SignForMoreStats, StarForFavourite)
- [ ] Check how the +not_found page is reachable and if it works
- [ ] Update PlayerList.tsx. Move avatar icon slightly to the left. Check what happens when the name is too long for row. Check if favouritedisabled actually works? Make the whole bar similar to how it was before (bordercolor, backgroundcolor, roundness i like too). Use Icons instead of just emoji star and down arrow. Make it possible to make a little drop down menu when pressing the down arrow.Check to reuse this for friends-list
- [ ] SelectedPlayers:Maybe rewrite this so that the amount of players per row is dependant on the screensize, and also stretch it maybe so that it fills the row?
- [ ] Add functionality for gamemode "Keep Score" to keep score, also having functionality in backend to write final score in database. Also dont forget that it is already mentioned in another task that different sports themes need different point counts.

