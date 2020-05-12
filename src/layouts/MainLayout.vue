<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar :class="textColor">
      <q-avatar>
        <!-- <q-icon name="texture"></q-icon> -->
        <img src="~/assets/logo.jpg" alt="logo" class="custom-img">
      </q-avatar>
      <q-toolbar-title>
        Buy Low Sell High
      </q-toolbar-title>
      <q-btn
        @click="$q.dark.toggle()"
        icon="wb_incandescent"
        size="sm"
        class="q-mr-md"
        round
      />
      <q-btn
        v-if="!providerReady"
        @click="connectMetamask"
        icon="img:statics/metamask.svg"
        label="metamask"
        flat
      />
      <q-avatar
        v-else
        color="primary"
        size="md"
        text-color="white"
      >0x</q-avatar>
    </q-toolbar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data() {
    return {
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
      window.ethereum.enable();
    },
    setWalletStatus(obj) {
      this.walletAddress = obj.selectedAddress;
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
