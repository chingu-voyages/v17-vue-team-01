module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    themeColor: '#225c88',
    msTileColor: '#FFF'
  },
  devServer: {
    proxy: 'https://chingutime.herokuapp.com/',
  }
}