<template>
  <div class="col q-ma-md">
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
          v-if="col.name != 'id'"
          :key="col.name"
          :props="props"
        >
          {{ col.value }}
        </q-td>
        <q-td v-else align="right">
          <q-btn @click="cancelOrder(props.row)" flat>cancel order</q-btn>
        </q-td>
      </q-tr>
      <!-- <template v-slot:bottom>
        <div style="display: none"></div>
      </template> -->
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
        {
          name: 'timestemp', align: 'left', label: 'Date', field: 'timestemp', sortable: true,
        },
        {
          name: 'pair', label: 'Pair', field: 'pair', sortable: true,
        },
        { name: 'buyPrice', label: 'Buy price', field: 'buyPrice' },
        { name: 'sellPrice', label: 'Sell price', field: 'sellPrice' },
        { name: 'buyAmount', label: 'Buy amount', field: 'buyAmount' },
        { name: 'sellAmount', label: 'Sell amount', field: 'sellAmount' },
        { name: 'expiration', label: 'Expiration time', field: 'expiration' },
        { name: 'status', label: 'Status', field: 'status' },
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