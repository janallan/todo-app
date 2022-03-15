<template>
  <div class="section-two">
    <p class="mb-6 text-center">Login</p>
    <v-alert
      v-if="invalid_credentials"
      border="right"
      colored-border
      type="error"
      elevation="2"
      class="mb-6"
    >
      Invalid Credentials.
    </v-alert>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
      <v-text-field
        v-model="data.email"
        label="Email"
        :rules="rules.email"
        :error-messages="errors.email"
        outlined
        required
        @keyup="clearError('email')"
      ></v-text-field>
      <v-text-field
        v-model="data.password"
        type="password"
        label="Password"
        :rules="rules.password"
        outlined
        required
      ></v-text-field>
      <v-btn type="submit" light color="primary" width="100%">
        <span v-if="!loading">Login</span>
        <v-progress-circular
          v-else
          indeterminate
          color="white"
          size="25"
        ></v-progress-circular>
      </v-btn>
    </v-form>
    <div class="forgot-signup mt-4">
      <p class="mb-10">Forgot password?</p>
      <p class="text-center">Don't have an account? <a href="#" @click="show">Sign Up</a></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    data: {
      role: 'ADMIN',
    },
    valid: false,
    rules: {
      email: [
        (v) => !!v || 'The email field is required',
        (v) => /.+@.+\..+/.test(v) || 'email must be valid',
      ],
      password: [(v) => !!v || 'The password field is required'],
    },
    invalid_credentials: false,
    loading: false,
  }),
  computed: {
    ...mapState({
      token: (state) => state.auth.token,
      errors: (state) => state.auth.errors,
    }),
  },
  watch: {
    token(e) {
      if (e) {
        location.href = '/tasks'
      }
    },
  },
  methods: {
    login() {
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        this.$store
          .dispatch('auth/login', this.data)
          .then((res) => {
            const response = res.data
            this.$store.commit('auth/setAuthUser', response.data)
            console.log(this.token);
          })
          .catch((err) => {
            this.loading = false
            if (err.response && err.response.status !== 500) {
              this.setErrors({email: err.response.data.message})
            }
          })
      }
    },
    clearError(key){
      this.$store.commit('auth/removeErrors', key)
    },
    setErrors(errors){
      this.$store.commit('auth/setErrors', errors)
    },
    show(){
      this.$emit('show')
    }
  },
}
</script>

<style lang="scss">
@import '~/assets/variables.scss';
.section-two {
  z-index: 9;
  position: relative;
  width: 100vw;
  background: $white;
  border-radius: 40px 40px 0 0;
  padding: 32px 29px 0 29px;
  bottom: 40px;
  .forgot-signup {
    p {
      font-size: 12px;
      line-height: 14px;
      color: $grey;
    }
  }
  p {
    margin-bottom: 0;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: $black;
  }
}
@media (min-width: 960px) {
  .section-two {
    bottom: 0;
    width: 50%;
    padding-top: 15%;
  }
}
</style>
