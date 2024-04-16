# GAIA-APP
Technologie :   
https://expo.dev/   
https://reactnative.dev/

## Dans le dossier du projet /GAIA-APP
https://reactnative.dev/docs/environment-setup
```
npm i -g expo-cli
```
## Dans le dossier /gaia-medication
La première fois :
```ts
cd gaia-medication
yarn
npm install -g eas-cli
eas login
eas build:configure
// -> android
eas update:configure
```

De temps en temps :
```
cd gaia-medication
yarn
```


## Lancer l'application en dev
Avec Expo Go sur Android
```
npx-expo start
```

## Build l'application
https://docs.expo.dev/build/introduction/
```
eas build -p android --profile preview
```
Page du build :   
https://expo.dev/accounts/helldeal/projects/gaia-medication/builds
