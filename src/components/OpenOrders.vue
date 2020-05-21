<template>
  <div class="col q-mt-md">
    <table :class="{'light': !isDark, 'dark': isDark}" class="order-table">
      <thead>
        <tr>
          <td :class="{'center-align' : (title.name != 'id' && title.name != 'pair'),
          'left-align': !(title.name != 'id' && title.name != 'pair')}"
          v-for="(title, index) in columns" :key="index">
            <span class="heading">
              {{title.name}}
            </span>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in openOrders" :key="index">
          <td>
            {{item.id}}
          </td>
          <td>
            {{item.pair}}
          </td>
          <td class="center-align">
            {{(item.price)?item.price:0}}
          </td>
          <td class="center-align">
            {{item.amount}}
          </td>
          <td class="center-align">
            {{(new Date(item.expiration)).toLocaleDateString()}}
          </td>
          <td class="center-align capitalize">
            {{item.type}}
          </td>
          <td class="center-align capitalize">
            {{item.status}}
          </td>
          <td class="center-align">
            {{item.gain}}
          </td>
          <td class="center-align">
            <a :href="item.etherscan">
              <img v-if="!isDark" height="15" width="15"
              :src="require('../assets/icons8-external-link.svg')"/>
              <img v-else height="15" width="15"
              :src="require('../assets/icons8-external-link-dark.svg')"/>
            </a>
          </td>
          <td class="center-align">
            <div class="button-box">
              <q-btn size="xs" color="primary" text-color="white" label="Execute"
              @click = "executeOrder(item)">
              </q-btn>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <q-btn size="xs" color="primary" text-color="white"
              @click = "cancelOrder(item)" label="Cancel">
              </q-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <q-table
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
          v-if="col.name != 'id' && col.name != 'etherscan' && col.name != 'execute'"
          :key="col.name"
          :props="props"
        >
          {{ col.value }}
        </q-td>
        <q-td v-else-if="col.name == 'etherscan'" align="right">
          <a :href="col.value" target="_blank">View on etherscan</a>
        </q-td>
        <q-td v-else-if="col.name == 'execute'" align="right">
          <q-btn @click="executeOrder(props.row)" flat>execute order</q-btn>
        </q-td>
        <q-td v-else-if="col.name == 'id'" align="right">
          <q-btn @click="cancelOrder(props.row)" flat>cancel order</q-btn>
        </q-td>
      </q-tr>
    </q-table> -->
  </div>
</template>

<script>

import { abi as orderAbi } from '../contracts/Order.json';

const {
  Contract,
  // getDefaultProvider,
  // Wallet,
  providers,
  // utils,
} = require('ethers');

const provider = new providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();


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
          name: 'id', label: 'Action', align: 'right', field: 'id',
        },
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
        { name: 'action', label: '', field: '' },
      ],
    };
  },
  methods: {
    async cancelOrder(row) {
      if (row.address) {
        const orderContract = new Contract(row.address, orderAbi, signer);
        await orderContract.cancel();
        const index = this.openOrders.indexOf(row);
        this.$store.commit('orders/cancel', index);
      }
    },
    async executeOrder(row) {
      if (row.address) {
        const orderContract = new Contract(row.address, orderAbi, signer);
        debugger;
        const res = await orderContract.execute();
        console.log(res);
      }
    },
  },
  computed: {
    openOrders() {
      return this.$store.getters['orders/data'];
    },
    isDark() {
      return this.$store.getters['theme/textColor'] === 'text-secondary';
    },
  },
};
</script>

<style lang="scss">
  .q-table__bottom {
    display: none;
  }
  .heading {
    text-transform: capitalize;
    font-size: 500;
  }
  .order-table {
    width: 100%;
  }
  .capitalize {
    text-transform: capitalize;
  }
  .center-align {
    text-align: center;
  }
  .left-align {
    text-align: left;
  }
  .dark {
    background: rgb(39, 41, 61);
  }
  .right-align {
    text-align: right;
    width: fit-content;
  }
</style>
