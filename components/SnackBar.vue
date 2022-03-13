<template>
  <v-snackbar v-model="snackbar_" :timeout="timeout" @input="toggle"
    color="blue-grey"
    top
    right
    tile
  >
    {{ message }}

    <template #action="{ attrs }">
      <v-btn style="height:35px !important;" text v-bind="attrs" @click="toggle"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    snackbar_: false,
  }),
  computed: {
    ...mapState({
      snackbar_value: (state) => state.snackbar.snackbar,
      timeout: (state) => state.snackbar.timeout,
      message: (state) => state.snackbar.message,
    }),
  },
  watch: {
    snackbar_value(e) {
      this.snackbar_ = e
    },
  },
  methods: {
    toggle(){
      this.$store.commit('snackbar/toggle');
    },
  },
}
</script>
