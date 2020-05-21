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
            {{item.pair}}
          </td>
          <td class="center-align">
            {{(item.price._hex)?item.price._hex:0}}
          </td>
          <td class="center-align">
            {{item.srcAmount}}
          </td>
          <td class="center-align">
            {{item.dstAmount}}
          </td>
          <td class="center-align">
            {{(new Date(item.expiration)).toLocaleDateString()}}
          </td>
          <td class="center-align capitalize">
            {{item.type}}
          </td>
          <td class="center-align capitalize">
            {{(item.isCancelled || item.isExecuted)?'closed': 'open'}}
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
              <q-btn v-if="!item.isExecuted"
              size="xs" color="primary" text-color="white" label="Execute"
              @click = "executeOrder(item)">
              </q-btn>
              <q-btn v-if="item.isExecuted"
              size="xs" color="primary" text-color="white" label="Withdraw"
              @click = "withdrawOrder(item)">
              </q-btn>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <q-btn v-if="!item.isCancelled" size="xs" color="primary" text-color="white"
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
import { abi as lucrumAbi } from '../contracts/Lucrum.json';

const lucrumAddress = '0x65fc06E0Ae8b770CE5a6F9C457F14491D9fE5C76';

const {
  Contract,
  // getDefaultProvider,
  // Wallet,
  providers,
  utils,
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
          name: 'pair', label: 'Pair', field: 'pair', sortable: true, align: 'left',
        },
        { name: 'price', label: 'Price', field: 'price' },
        { name: 'source amount', label: 'Source Amount', field: 'source amount' },
        { name: 'destination amount', label: 'Destination Amount', field: 'destination amount' },
        { name: 'expiration', label: 'Expiration time', field: 'expiration' },
        { name: 'type', label: 'Buy/Sell', field: 'type' },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'etherscan', label: 'Link', field: 'etherscan' },
        { name: 'action', label: '', field: '' },
      ],
      contract: new Contract(lucrumAddress, lucrumAbi, signer),
      orders: [],
    };
  },
  methods: {
    async cancelOrder(row) {
      if (row.address) {
        try {
          const orderContract = new Contract(row.address, orderAbi, signer);
          const cancelTx = await orderContract.cancel(
            {
              gasLimit: utils.bigNumberify('7000000'),
            },
          );
          await cancelTx.wait();
          const index = this.openOrders.indexOf(row);
          this.$store.commit('orders/cancel', index);
        } catch (err) {
          console.log(err);
        }
      }
    },
    async executeOrder(row) {
      if (row.address) {
        const orderContract = new Contract(row.address, orderAbi, signer);
        const tx = await orderContract.execute({
          gasLimit: utils.bigNumberify('7000000'),
        });
        await tx.wait();
      }
    },
    async withdrawOrder(row) {
      if (row.address) {
        const orderContract = new Contract(row.address, orderAbi, signer);
        const tx = await orderContract.close({
          gasLimit: utils.bigNumberify('7000000'),
        });
        await tx.wait();
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
  async mounted() {
    let orderAddrs = [];
    let userOrders = [];
    let orderContract = [];
    let orders = [];
    const self = this;

    if (window.web3 && window.web3.eth && window.web3.eth.accounts[0]) {
      console.log('Before userToOrderIds', window.web3.eth.accounts[0]);
      for (let i = 0; i < 10; i += 1) {
        userOrders.push(this.contract.userToOrderIds(window.web3.eth.accounts[0], i));
      }
      userOrders = await Promise.all(userOrders);
      for (let i = 0; i < userOrders.length; i += 1) {
        const temp = this.contract.orders(userOrders[i]);
        orderAddrs.push(temp);
      }
      orderAddrs = await Promise.all(orderAddrs);
      for (let i = 0; i < orderAddrs.length; i += 1) {
        orderContract = new Contract(orderAddrs[i], orderAbi, signer);
        orders.push(orderContract.detail());
      }
      orders = await Promise.all(orders);
      this.orders = orders;
      this.orders.forEach(
        (item, index) => {
          self.$store.commit('orders/newOrder', {
            // pair: (item.isBuy)? self.srcToken: self.destToken,
            pair: item.isBuy ? 'WETH/DAI' : 'DAI/WETH',
            price: item.triggerPrice,
            type: self.isBuy ? 'buy' : 'sell',
            srcAmount: Number(utils.formatEther(item.srcAmount)),
            dstAmount: Number(utils.formatEther(item.dstAmount)),
            expiration: new Date(item.expiryTime * 1000).toUTCString(),
            etherscan: `https://kovan.etherscan.io/address/${orderAddrs[index]}`,
            isCancelled: item.isCancelled,
            isExecuted: item.isExecuted,
            address: orderAddrs[index],
          });
        },
      );
      // this.$store.commit('order/newOrder', {
      //   pair: self.type === 'buy' ? 'WETH/DAI' : 'DAI/WETH',
      //   price: self.price,
      //   type: self.type,
      //   amount: Number(utils.formatEther(returnAmount)),
      //   expiration: new Date(self.expirationTimestamp * 1000).toUTCString(),
      //   etherscan: `https://kovan.etherscan.io/address/${address}`,
      //   status: 'open',
      //   address,
      //   id: Number(orderID),
      // });
    }
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
