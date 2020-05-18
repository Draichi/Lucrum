<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script >
export default {
  name: 'App',
  beforeCreate() {
    this.$q.dark.set(true);
  },
  async mounted() {
    if (window.ethereum) {
      window.web3 = new window.Web3(window.ethereum);
      window.console.log('1', window.web3);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        window.web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    } else if (window.web3) {
      window.console.log('2', window.web3);
      window.web3 = new window.Web3(window.web3.currentProvider);
      // Acccounts always exposed
      window.web3.eth.sendTransaction({/* ... */});
    } else {
      window.console.log('3', window.web3);
      window.console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },
};
</script>
