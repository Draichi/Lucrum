<template>
  <div>
    <div class="row q-mt-sm custom-row">
      <div class="col-9 q-mx-md" id="tradingview-wrapper">
        <Chart/>
      </div>
      <div class="column col q-mr-md">
        <!-- <PairSelector/> -->
        <NewOrder/>
        <Price class="price-fire" />
      </div>
    </div>
    <OpenOrders/>

  </div>
</template>
<script>


import OpenOrders from '../components/OpenOrders';
import NewOrder from '../components/NewOrder';
import Chart from '../components/Chart';
import Price from '../components/Price';
// import PairSelector from '../components/PairSelector';
import config from '../../config';

export default {
  name: 'PageIndex',
  components: {
    Chart,
    OpenOrders,
    NewOrder,
    Price,
    // PairSelector,
  },
  created() {
    this.$store.commit('pairs/updateShowGraphState', false);
    this.getApiPrice();
    setInterval(() => {
      this.getApiPrice();
    }, 60000);
  },
  methods: {
    async getApiPrice() {
      // const [pairFrom, pairTo] = this.model.split('/');
      const res = await this.$axios.get(`https://min-api.cryptocompare.com/data/v2/histominute?fsym=ETH&tsym=DAI&limit=100&api_key=${config.cryptoCompareApiKey}`);
      const { Data } = res.data.Data;
      const ohlcv = Data.map((item) => [
        item.time * 1000,
        item.open,
        item.high,
        item.low,
        item.close,
        item.volumefrom,
      ]);
      this.$store.commit('pairs/setData', ohlcv);
      this.$store.commit('pairs/updateShowGraphState', true);
    },
  },
};

</script>

<style lang="scss">
.custom-row {
  // height: 60vh;
}
.price-fire {
  position: relative;
  top: 15px;
}
</style>
