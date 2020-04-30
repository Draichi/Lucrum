<template>
  <div>
    <div class="row q-mt-lg">
      <div class="col-6 q-mx-xl" id="tradingview-wrapper">
        <q-card v-if="showGraph" class="custom-graph-card">
          <trading-vue
            :titleTxt="model"
            :width="width"
            :height="height"
            :data="ohlc"
            colorTitle="#00f2c3"
            colorPanel="#46bfdf"
            colorBack="#27293d"
            colorGrid="#20223a"
            colorCandleUp="#00f2c3"
            colorCandleDown="#ec250d"
          />
        </q-card>
      </div>
      <div class="col q-mr-xl">
        <q-card class="q-pa-sm">
          <div class="text-subtitle1 text-primary">Pair</div>
          <q-select @input="getApiPrice" filled v-model="model" :options="options"/>
        </q-card>
        <q-card class="q-pa-sm q-mt-sm">
          <div class="text-subtitle1 text-primary">Place an order</div>
           <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
              <div class="row">
                <div class="col-6">
                  <q-input
                    v-model="buy.amount"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                    label="Buy amount"
                    type="number"
                    ref="buy-amount"
                    filled
                    lazy-rules
                  />
                </div>
                <div class="col q-ml-sm">
                  <q-input
                    v-model="buy.price"
                    :rules="[val => val !== null && val !== '' || 'Please type the price']"
                    type="number"
                    label="Buy price"
                    ref="buy-price"
                    lazy-rules
                    filled
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-6">
                  <q-input
                    v-model="sell.amount"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                    label="Sell amount"
                    type="number"
                    ref="sell-amount"
                    lazy-rules
                    filled
                  />
                </div>
                <div class="col q-ml-sm">
                  <q-input
                    v-model="sell.price"
                    :rules="[val => val !== null && val !== '' || 'Please type the price']"
                    type="number"
                    label="Sell price"
                    ref="sell-price"
                    lazy-rules
                    filled
                  />
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <q-input
                    v-model="expiration"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                    label="Expiration (in days)"
                    ref="expiration"
                    type="number"
                    hint="Maximum time for your contract execution"
                    lazy-rules
                    filled
                  />
                </div>
              </div>

              <div>
                <q-btn label="Submit" type="submit" color="primary"/>
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>

        </q-card>
      </div>
    </div>
    <div class="row" v-if="data.length">
      <div class="col q-ma-xl">
         <q-table
          title="Open orders"
          :data="data"
          :columns="columns"
          row-key="name"
        >
          <q-tr
            slot="body"
            slot-scope="props"
            :props="props"
            class="cursor-pointer"
          >
            <q-td
              v-for="col in props.cols"
              v-if="col.name != 'id'"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td v-else align="right">
              <q-btn @click="cancelOrder(props.row)" flat>cancel order</q-btn>
            </q-td>
          </q-tr>
        </q-table>
      </div>
    </div>
  </div>
</template>
<script>

import TradingVue from 'trading-vue-js';

export default {
  name: 'PageIndex',
  components: { TradingVue },
  data() {
    return {
      buy: {
        amount: null,
        price: null,
      },
      sell: {
        amount: null,
        price: null,
      },
      expiration: null,
      model: 'ETH/USD',
      options: ['ETH/USD', 'BTC/USD'],
      columns: [
        {
          name: 'timestemp', align: 'left', label: 'Date', field: 'timestemp', sortable: true,
        },
        {
          name: 'pair', label: 'Pair', field: 'pair', sortable: true,
        },
        { name: 'buyPrice', label: 'Buy price', field: 'buyPrice' },
        { name: 'sellPrice', label: 'Sell price', field: 'sellPrice' },
        { name: 'buyAmount', label: 'Buy amount', field: 'buyAmount' },
        { name: 'sellAmount', label: 'Sell amount', field: 'sellAmount' },
        { name: 'expiration', label: 'Expiration time', field: 'expiration' },
        { name: 'status', label: 'Status', field: 'status' },
        {
          name: 'id', label: 'Action', align: 'right', field: 'id',
        },
      ],
      data: [],
      width: window.innerWidth,
      height: window.innerHeight,
      showGraph: false,
      ohlc: {
        ohlcv: [],
      },
    };
  },
  methods: {
    onSubmit() {
      this.data.push({
        timestemp: new Date().toUTCString(),
        pair: this.model,
        buyPrice: this.buy.price,
        sellPrice: this.sell.price,
        buyAmount: this.buy.amount,
        sellAmount: this.sell.amount,
        expiration: this.expiration,
        status: 'open',
        id: Math.random(),
      });
      this.onReset();
      const inputRefs = [
        'buy-price',
        'buy-amount',
        'sell-price',
        'sell-amount',
        'expiration',
      ];
      inputRefs.forEach((input) => this.$refs[input].resetValidation());
    },
    onReset() {
      this.buy.price = null;
      this.buy.amount = null;
      this.sell.price = null;
      this.sell.amount = null;
      this.expiration = null;
    },
    onResize() {
      this.width = document.getElementById('tradingview-wrapper').getBoundingClientRect().width - 20;
      this.height = document.getElementById('tradingview-wrapper').getBoundingClientRect().height - 20;
    },
    async getApiPrice() {
      this.showGraph = false;
      const [pairFrom, pairTo] = this.model.split('/');
      const res = await this.$axios.get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${pairFrom}&tsym=${pairTo}&limit=100&api_key=3d7d3e9e6006669ac00584978342451c95c3c78421268ff7aeef69995f9a09ce`);
      const oi = res.data.Data.Data;
      const c = oi.map((item) => [
        item.time * 1000,
        item.open,
        item.high,
        item.low,
        item.close,
        item.volumefrom,
      ]);
      this.ohlc.ohlcv = c;
      this.showGraph = true;
    },
    cancelOrder(row) {
      const index = this.data.indexOf(row);
      // const { id } = this.data[index];
      this.data.splice(index, 1);
    },
  },
  mounted() {
    this.getApiPrice();
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
};

</script>

<style lang="scss">
.custom-graph-card{
  padding: 10px;
}
</style>
