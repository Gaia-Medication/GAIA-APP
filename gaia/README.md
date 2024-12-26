# Welcome to Gaia!

## First time
```bash
npm i
npm run start
```

IOS :
```bash
npm run pods OR npx pod-install
npm start ios
```

Android :
```bash
npm start android
```

## Common bugs
`Unimplemented Component (IOS)` :

```bash
cd ios && pod install && cd ..
```

if doesn't works :
```bash
npx pod-install
```

When a new library is installed, if error related, try this : 
```bash
cd ios && pod install && cd ..
npx react-native start --reset-cache
```

## Dependencies Instructions :
`nativewind@2.0.11`