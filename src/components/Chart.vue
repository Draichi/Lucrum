<template>
    <q-card v-if="showGraph" class="custom-graph-card">
      <trading-vue
        :titleTxt="'WETH/DAI'"
        :width="width"
        :height="height"
        :data="data"
        :colorBack="colorBack"
        :colorGrid="colorGrid"
        :colorText="colorText"
      />
    </q-card>
    <div
      v-else
      class="fit row items-center justify-center"
    >
      <q-spinner-hourglass
        color="primary"
        size="4em"
      />
    </div>
  <!-- <div class="col-9 q-mx-md" id="tradingview-wrapper">
  </div> -->
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
      width: '500',
      height: '500',
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
    colorBack() {
      return this.$q.dark.isActive ? '#27293d' : '#f5f5f5';
    },
    colorGrid() {
      return this.$q.dark.isActive ? '#20223a' : '#edeff2';
    },
    colorText() {
      return this.$q.dark.isActive ? '#f5f5f5' : '#000000';
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-graph-card{
  padding: 10px;
}
</style>
