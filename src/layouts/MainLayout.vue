<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar :class="[textColor, 'q-px-lg']">
      <q-avatar>
        <img
          src="~/assets/logo.png" alt="logo" class="custom-img">
      </q-avatar>
      <q-toolbar-title>
        Lucrum
      </q-toolbar-title>
      <q-btn
        v-if="!providerReady"
        @click="connectMetamask"
        icon="img:statics/metamask.svg"
        label="Connect wallet"
        no-caps
        flat
      />
      <q-avatar
        v-else
        color="primary"
        size="md"
        text-color="white"
      >0x</q-avatar>
      <q-toggle
        v-model="darkTheme"
        @input="$q.dark.toggle()"
        :label="darkTheme ? 'Dark' : 'Light'"
      />
    </q-toolbar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { abi as ierc20Abi } from '../contracts/IERC20.json';

const { Contract, providers } = require('ethers');

const provider = new providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const lucrumAddress = '0x65fc06E0Ae8b770CE5a6F9C457F14491D9fE5C76';
const wethAddress = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
const wethContract = new Contract(wethAddress, ierc20Abi, signer);

export default {
  name: 'MainLayout',
  data() {
    return {
      darkTheme: this.$q.dark.isActive,
      providerReady: false,
      walletAddress: null,
      ETHBalance: null,
    };
  },
  created() {
    window.web3.currentProvider.publicConfigStore.on('update', this.setWalletStatus);
    this.providerReady = !!window.web3.currentProvider.selectedAddress;
  },
  methods: {
    connectMetamask() {
      window.ethereum.enable().then(async () => {
        const contractTx = await wethContract.approve(lucrumAddress, '10000000000000000000000000000');
        // this.$store.commit('orders/addTx', contractTx);
        localStorage.setItem('contractTx', contractTx.hash);
      });
    },
    setWalletStatus(obj) {
      console.log(obj);
      this.walletAddress = obj.selectedAddress;
      this.$store.commit('orders/addSelectedAddress', obj.selectedAddress);
      if (obj.selectedAddress) {
        window.web3.eth.getBalance(obj.selectedAddress, (error, result) => {
          this.ETHBalance = window.web3.fromWei(Number(result), 'ether');
        });
      }
      this.providerReady = obj.isUnlocked;
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
.custom-img {
  object-fit: cover;
}
</style>
