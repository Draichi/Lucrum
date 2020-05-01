<template>
  <div class="col-6 q-mx-xl" id="tradingview-wrapper">
    <q-card v-if="showGraph" class="custom-graph-card">
      <trading-vue
        :titleTxt="model"
        :width="width"
        :height="height"
        :data="data"
        colorTitle="#00f2c3"
        colorPanel="#46bfdf"
        colorBack="#27293d"
        colorGrid="#20223a"
        colorCandleUp="#00f2c3"
        colorCandleDown="#ec250d"
      />
    </q-card>
  </div>
</template>

<script>
import TradingVue from 'trading-vue-js';
import { mapGetters } from 'vuex';

export default {
  components: {
    TradingVue,
  },
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  methods: {

    onResize() {
      this.width = document.getElementById('tradingview-wrapper').getBoundingClientRect().width - 20;
      this.height = document.getElementById('tradingview-wrapper').getBoundingClientRect().height - 20;
    },
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  computed: {
    ...mapGetters('pairs', [
      'model',
      'data',
      'showGraph',
    ]),
  },


};
</script>

<style lang="scss" scoped>
.custom-graph-card{
  padding: 10px;
}
</style>
