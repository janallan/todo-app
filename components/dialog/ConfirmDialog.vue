<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text class="text-center">{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="height:35px !important;" light color="primary" @click="cancel"> Cancel </v-btn>
          <v-btn style="height:35px !important;" light color="error" @click="confirm">
            <span v-if="!loading">Confirm</span>
            <v-progress-circular
              v-else
              indeterminate
              color="white"
              size="25"
            ></v-progress-circular>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialog() {
      return this.show
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel', false)
    },
    async confirm() {
      await this.$emit('confirm')
    },
  },
}
</script>
