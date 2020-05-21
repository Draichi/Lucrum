<template>
  <div class="col q-mt-md">
    <q-table
      :data="openOrders"
      :columns="columns"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      style="height: 27vh"
      title="Open orders"
      row-key="name"
      virtual-scroll
    >
      <q-tr
        slot="body"
        slot-scope="props"
        :props="props"
        class="cursor-pointer"
      >
        <q-td
          v-for="col in props.cols"
          v-if="col.name != 'id' && col.name != 'etherscan'"
          :key="col.name"
          :props="props"
        >
          {{ col.value }}
        </q-td>
        <q-td v-else-if="col.name == 'etherscan'" align="right">
          <a :href="col.value" target="_blank">View on etherscan</a>
        </q-td>
        <q-td v-else-if="col.name == 'id'" align="right">
          <q-btn @click="cancelOrder(props.row)" flat>cancel order</q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 1000,
      },
      columns: [
        // {
        //   name: 'timestemp', align: 'left', label: 'Date', field: 'timestemp', sortable: true,
        // },
        {
          name: 'pair', label: 'Pair', field: 'pair', sortable: true, align: 'left',
        },
        { name: 'price', label: 'Price', field: 'price' },
        { name: 'amount', label: 'Amount', field: 'amount' },
        { name: 'expiration', label: 'Expiration time', field: 'expiration' },
        { name: 'type', label: 'Buy/Sell', field: 'type' },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'gain', label: 'Gains', field: 'gain' },
        { name: 'etherscan', label: 'Link', field: 'etherscan' },
        {
          name: 'id', label: 'Action', align: 'right', field: 'id',
        },
      ],
    };
  },
  methods: {
    cancelOrder(row) {
      const index = this.openOrders.indexOf(row);
      // const { id } = this.openOrders[index];
      this.$store.commit('orders/cancel', index);
    },
  },
  computed: {
    openOrders() {
      return this.$store.getters['orders/data'];
    },
  },
};
</script>

<style lang="scss">
  .q-table__bottom {
    display: none;
  }
</style>
