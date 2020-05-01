<template>
  <div>
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
</template>

<script>
import config from '../../config';

export default {
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
      options: ['ETH/USD', 'BTC/USD'],
    };
  },
  created() {
    this.getApiPrice();
  },
  methods: {
    async getApiPrice() {
      this.$store.commit('pairs/updateShowGraphState', false);
      const [pairFrom, pairTo] = this.model.split('/');
      const res = await this.$axios.get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${pairFrom}&tsym=${pairTo}&limit=100&api_key=${config.cryptoCompareApiKey}`);
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
    onSubmit() {
      this.$store.commit('orders/newOrder', {
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
  },
  computed: {
    model: {
      get() {
        return this.$store.getters['pairs/model'];
      },
      set(val) {
        this.$store.commit('pairs/updatePair', val);
      },
    },
    data() {
      return this.$store.getters['pairs/data'];
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
