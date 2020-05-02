<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar :class="textColor">
      <q-avatar>
        <q-icon name="texture"></q-icon>
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
        icon="img:statics/metamask.svg"
        label="metamask"
        flat
      />
      <!-- <q-avatar color="primary" size="md" text-color="white">J</q-avatar> -->
    </q-toolbar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  computed: {
    textColor() {
      return this.$store.getters['theme/textColor'];
    },
  },
};
</script>
