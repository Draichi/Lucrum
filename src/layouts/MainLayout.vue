<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      :reveal-offset="10"
      class="custom-toolbar q-mx-xl"
      reveal
    >
      <q-toolbar>
        <q-avatar>
          <q-icon name="texture"></q-icon>
          <!-- <img src="https://via.placeholder.com/40"> -->
        </q-avatar>
        <q-toolbar-title>
          Buy Low Sell High
        </q-toolbar-title>
        <q-btn
          @click="$q.dark.toggle()"
          :class="{ 'text-dark': !$q.dark.isActive }"
          icon="wb_incandescent"
          size="sm"
          round
        />
        <q-btn flat class="text-dark">metamask</q-btn>
        <!-- <q-avatar color="primary" size="md" text-color="white">J</q-avatar> -->
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
};
</script>

<style lang="scss">
.body--light {
  .custom-toolbar {
    box-shadow: 1px 13px 20px 0px #00000024;
  }
}
.body--dark {
  .custom-toolbar {
    box-shadow:
      0 1px 5px rgba(0, 0, 0, 0.2),
      0 2px 2px rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
  }
}
.custom-toolbar {
  margin-top: 5px;
  background: linear-gradient(to right, $primary, $secondary);
  border-radius: 8px;
}
</style>
