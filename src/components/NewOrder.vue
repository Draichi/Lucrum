<template>
  <q-card class="col q-pa-md">
    <div :class="['text-subtitle1', textColor]">Place an order</div>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="column justify-evenly fit"
      >
        <div class="col">
          <q-input
            v-model="amount"
            :rules="[ val => val && val.length > 0 || 'Please type something']"
            label="Amount"
            type="number"
            ref="amount"
            outlined
            no-error-icon
            lazy-rules
          />
        </div>
        <div class="col">
          <q-input
            v-model="price"
            :rules="[ val => val && val.length > 0 || 'Please type the price']"
            label="Price"
            type="number"
            ref="price"
            lazy-rules
            no-error-icon
            outlined
          />
        </div>

        <div class="col">
          <q-btn-toggle
            v-model="type"
            spread
            no-caps
            :toggle-color="type == 'buy' ? 'positive' : 'negative'"
            color="white"
            text-color="black"
            :options="[
              {label: 'Buy', value: 'buy'},
              {label: 'Sell', value: 'sell'}
            ]"
          />
        </div>
          <!-- <div class="col self-cente">
            <div class="row justify-evenly">
              <q-radio name="type" v-model="type" val="buy" label="Buy" color="green" />
              <q-radio name="type" v-model="type" val="sell" label="Sell" color="red" />
            </div>
          </div> -->
        <div class="col">
          <q-input
            v-model="expiration"
            :rules="[ val => val && val.length > 0 || 'Please type something']"
            label="Expiration (in days)"
            ref="expiration"
            type="number"
            lazy-rules
            no-error-icon
            outlined
          />
        </div>

        <!-- <div class="col self-center gain__container">
          You will profit <div v-if="amount && price" class="gain__text">{{ gain }}</div>
        </div> -->
        <div class="col column justify-end custom-buttons__container">
          <q-btn
            @click="onSubmit"
            label="Submit"
            color="primary"/>
          <div class="column items-end">
            <div class="row">
              <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
            </div>
          </div>
        </div>
      </q-form>
  </q-card>
</template>

<script>
import { abi as lucrumAbi } from '../contracts/Lucrum.json';
import { abi as ierc20Abi } from '../contracts/IERC20.json';

const {
  Contract,
  // getDefaultProvider,
  // Wallet,
  providers,
  utils,
} = require('ethers');
// const abi = require('../../contracts/Lucrum.json');


// const provider = getDefaultProvider('kovan');
// const provider = new providers.Web3Provider(window.web3.currentProvider);
const provider = new providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
// console.log(signer);
const lucrumAddress = '0x65fc06E0Ae8b770CE5a6F9C457F14491D9fE5C76';

const daiAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD';
const wethAddress = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
const wethContract = new Contract(wethAddress, ierc20Abi, signer);
// const contract = new Contract(contractAddress, abi, signer);
// const ad = '0x60215911b9cdcc25834efa09026d05a7a95a8e42';
// const wallet = new Wallet(ad);

// console.log(contract);

export default {
  data() {
    return {
      type: 'buy',
      amount: null,
      price: null,
      expiration: null,
      expirationTimestamp: null,
      gain: Math.random().toFixed(4),
      provider: new providers.Web3Provider(window.ethereum),
      signer: provider.getSigner(),
      contract: new Contract(lucrumAddress, lucrumAbi, signer),
      tx: { hash: null },
    };
  },
  methods: {
    async onSubmit() {
      const date = new Date();
      this.expirationTimestamp = Math.round(
        date.setDate(parseInt(date.getDate(), 10) + parseInt(this.expiration, 10)) / 1000,
      );

      try {
        this.tx = await this.contract.open(
          wethAddress,
          daiAddress,
          utils.parseEther(this.amount),
          utils.bigNumberify(this.price * 10 ** 8),
          utils.bigNumberify(this.expirationTimestamp),
          this.type === 'buy',
          {
            gasLimit: utils.bigNumberify('7000000'),
          },
        );
      } catch (err) {
        /* Trigger for Reject button */
        console.log('ERROR', err);
      }

      // this.onReset();
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
  created() {
    // const price = parseInt(this.price, 10) * 10 ** 8;
    // const type = JSON.stringify(this.type);
    const self = this;
    self.price = parseInt(this.price, 10) * 10 ** 8;
    // const gain = parseFloat(this.gain);
    // const expirationTimestamp = parseInt(this.expirationTimestamp, 10);
    this.contract.on('LogOrderOpen', (orderID, address, returnAmount, sender) => {
      console.log({
        orderID: Number(orderID), address, returnAmount, sender,
      });
      this.$store.commit('orders/newOrder', {
        pair: self.type === 'buy' ? 'WETH/DAI' : 'DAI/WETH',
        price: self.price,
        type: self.type,
        srcAmount: Number(utils.formatEther(returnAmount)),
        dstAmount: Number(utils.formatEther(returnAmount)),
        expiration: new Date(self.expirationTimestamp * 1000).toUTCString(),
        etherscan: `https://kovan.etherscan.io/address/${address}`,
        status: 'open',
        isCancelled: false,
        isExecuted: false,
        isWithdrawn: false,
        address,
        id: Number(orderID),
      });
    });
  },
  async mounted() {
    const tx = await wethContract.approve(lucrumAddress, '10000000000000000000000000000');
    console.log(tx);
  },
  computed: {
    textColor() {
      return this.$store.getters['theme/textColor'];
    },
    model() {
      return this.$store.getters['pairs/model'];
    },
    contractTx() {
      return localStorage.getItem('contractTx');
      // return this.$store.getters['orders/contractTx'];
    },
    selectedAddress() {
      return this.$store.getters['orders/selectedAddress'];
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
  margin-bottom: 1.5em;
}
</style>
