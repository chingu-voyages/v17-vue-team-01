module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    themeColor: '#1976d2',
    msTileColor: '#FFF',
    name: 'Chingu Time'
  },
  devServer: {
    proxy: 'https://chingutime.herokuapp.com/',
  }
}