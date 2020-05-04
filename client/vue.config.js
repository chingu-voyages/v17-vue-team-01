module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    themeColor: '#1c5485',
    msTileColor: '#FFF',
    name: 'Chingu Time'
  },
  devServer: {
    proxy: 'https://chingutime.herokuapp.com/',
  }
}