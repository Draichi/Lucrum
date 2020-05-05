<template>
  <q-card class="q-pa-sm">
    <div :class="['text-subtitle1', textColor]">Pair</div>
    <q-select
      @input="getApiPrice"
      v-model="model"
      :options="options"
      outlined
    />
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import config from '../../config';

export default {
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
    ...mapGetters('pairs', [
      'options',
    ]),
    ...mapGetters('theme', [
      'textColor',
    ]),
  },
};
</script>

<style lang="scss">
.q-field--auto-height .q-field__control,
.q-field--auto-height .q-field__native {
  min-height: -webkit-fill-available;
}

.q-field__marginal {
  height: unset;
}

.q-select {
  font-size: .9em;
  top: .8em;
  height: 3em;
}
</style>
