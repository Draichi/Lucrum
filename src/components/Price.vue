<template>
  <q-card class="q-my-md q-pa-lg column items-center">
    <div class="label">WETH/DAI</div>
    <div class="label">Price: <strong>{{ lastPrice }}</strong> DAI</div>
    <div class="icon" style="">
      <iframe src="https://giphy.com/embed/47GPQ7ZzivsemHKPvB" width="50" height="60" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
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
