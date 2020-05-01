<template>
  <div>
    <div class="row q-mt-lg">
      <Chart/>
      <div class="col q-mr-xl">
        <NewOrder/>
      </div>
    </div>
    <div class="row">
      <OpenOrders/>
    </div>
  </div>
</template>
<script>


import OpenOrders from '../components/OpenOrders';
import NewOrder from '../components/NewOrder';
import Chart from '../components/Chart';

export default {
  name: 'PageIndex',
  components: {
    Chart,
    OpenOrders,
    NewOrder,
  },
};

</script>
