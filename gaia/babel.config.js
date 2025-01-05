module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./'], // Point de départ pour les chemins
        alias: {
          // Par exemple, si tes fichiers sont dans "app/types"
          types: './app/types',
          components: './app/components',
        },
      },
    ],
  ],
};
