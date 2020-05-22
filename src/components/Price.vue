<template>
  <q-card class="q-my-md q-pa-lg column items-center">
    <div class="label">WETH/DAI</div>
    <div class="label">Price: <strong>{{ lastPrice }}</strong> DAI</div>
    <div class="icon" style="">
      <iframe src="https://giphy.com/embed/47GPQ7ZzivsemHKPvB" width="50" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
    </div>
    <div>
      POWERED BY CHAINLINK<img style="position: relative; top: 10px; left: 5px;" width="30" src="https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/link.svg"/>
    </div>
  </q-card>
</template>

<script>
export default {
  computed: {
    lastPrice() {
      return this.$store.getters['pairs/data'].ohlcv[this.$store.getters['pairs/data'].ohlcv.length - 1][4];
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  line-height: 2em;
  letter-spacing: .2em;
}
</style>
