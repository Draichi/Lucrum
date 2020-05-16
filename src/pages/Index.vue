<template>
  <div>
    <div class="row q-mt-sm custom-row">
      <div class="col-9 q-mx-md" id="tradingview-wrapper">
        <Chart/>
        <OpenOrders/>
      </div>
      <div class="column col q-mr-md">
        <PairSelector/>
        <NewOrder/>
      </div>
    </div>
  </div>
</template>
<script>


import OpenOrders from '../components/OpenOrders';
import NewOrder from '../components/NewOrder';
import Chart from '../components/Chart';
import PairSelector from '../components/PairSelector';

export default {
  name: 'PageIndex',
  components: {
    Chart,
    OpenOrders,
    NewOrder,
    PairSelector,
  },
};

</script>

<style lang="scss">
.custom-row {
  height: 60vh;
}
</style>
