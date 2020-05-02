<template>
  <q-card class="col q-pa-sm q-mt-sm">
    <div :class="['text-subtitle1', textColor]">Place an order</div>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="fit"
      >
        <div class="column fit">
          <div class="col">
            <div class="row">
              <div class="col-6">
                <q-input
                  v-model="buy.amount"
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  label="Buy amount"
                  type="number"
                  ref="buy-amount"
                  outlined
                  no-error-icon
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
                  no-error-icon
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="col">
            <q-radio name="shape" v-model="shape" val="line" label="Buy" color="green" />
            <q-radio name="shape" v-model="shape" val="rectangle" label="Sell" color="red" />
          </div>
          <div class="col">
            <q-input
              v-model="expiration"
              :rules="[ val => val && val.length > 0 || 'Please type something']"
              label="Expiration (in days)"
              ref="expiration"
              type="number"
              hint="Maximum time for your contract execution"
              lazy-rules
              no-error-icon
              outlined
            />
          </div>
          <div class="col justify-end">
            <div class="column items-end">
              <div class="row">
                <q-btn label="Submit" type="submit" color="primary"/>
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </div>
          </div>
        </div>
      </q-form>

  </q-card>
</template>

<script>
export default {
  data() {
    return {
      group: null,
      shape: 'line',
      options: [
        { label: 'Buy', value: 'friend', color: 'green' },
        { label: 'Sell', value: 'upload', color: 'red' },
      ],
      buy: {
        amount: null,
        price: null,
      },
      sell: {
        amount: null,
        price: null,
      },
      expiration: null,
    };
  },
  methods: {
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
    textColor() {
      return this.$store.getters['theme/textColor'];
    },
  },
};
</script>

<style lang="scss">
.q-field__label {
  font-size: .9em;
  top: .8em;
}
.q-field__control {
  height: 40px;
}
</style>
