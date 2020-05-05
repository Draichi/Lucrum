<template>
  <q-card class="col q-pa-sm q-mt-sm">
    <div :class="['text-subtitle1', textColor]">Place an order</div>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="column justify-evenly fit"
      >
        <div class="col">
          <div class="row">
            <div class="col-6">
              <q-input
                v-model="amount"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                :label="`${type} amount`"
                type="number"
                ref="amount"
                outlined
                no-error-icon
                lazy-rules
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                v-model="price"
                :rules="[val => val !== null && val !== '' || 'Please type the price']"
                :label="`${type} price`"
                type="number"
                ref="price"
                lazy-rules
                no-error-icon
                outlined
              />
            </div>
          </div>
        </div>
        <div class="col self-cente">
          <div class="row justify-evenly">
            <q-radio name="type" v-model="type" val="buy" label="Buy" color="green" />
            <q-radio name="type" v-model="type" val="sell" label="Sell" color="red" />
          </div>
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
        <div class="col self-center gain__container">
          You will profit <div v-if="amount && price" class="gain__text">{{ gain }}</div>
        </div>
        <div class="col justify-end custom-buttons__container">
          <div class="column items-end">
            <div class="row">
              <q-btn label="Submit" type="submit" color="primary"/>
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
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
      type: 'buy',
      amount: null,
      price: null,
      expiration: null,
      gain: Math.random().toFixed(4),
    };
  },
  methods: {
    onSubmit() {
      this.$store.commit('orders/newOrder', {
        pair: this.model,
        price: this.price,
        type: this.type,
        amount: this.amount,
        gain: this.gain,
        expiration: new Date(new Date().getTime() * 1.01).toUTCString(),
        status: 'open',
        id: Math.random(),
      });
      this.onReset();
      const inputRefs = [
        'price',
        'amount',
        'expiration',
      ];
      inputRefs.forEach((input) => this.$refs[input].resetValidation());
    },
    onReset() {
      this.price = null;
      this.amount = null;
      this.expiration = null;
    },
  },
  computed: {
    textColor() {
      return this.$store.getters['theme/textColor'];
    },
    model() {
      return this.$store.getters['pairs/model'];
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
  height: 3em;
}
.gain__container {
  margin-top: 2em;
  .gain__text {
    border: 2px solid $primary;
    border-radius: .5em;
    padding: 1em;
    display: inline;
    margin: 0 .7em;
  }
}
.custom-buttons__container {
  margin-bottom: 1em;
}
</style>
