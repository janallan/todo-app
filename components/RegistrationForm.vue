<template>
  <div class="section-two">
    <p class="mb-6">Register</p>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="register"
    >
      <v-text-field
        v-model="data.name"
        :rules="rules.name"
        :error-messages="errors.name"
        label="Name"
        outlined
        @keyup="errors.name = []"
      ></v-text-field>
      <v-text-field
        v-model="data.email"
        :rules="rules.email"
        :error-messages="errors.email"
        label="Email"
        outlined
        @keyup="errors.email = []"
      ></v-text-field>
      <v-text-field
        v-model="data.password"
        :rules="rules.password"
        :error-messages="errors.password"
        label="Password"
        outlined
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'password' : 'text'"
        @keyup="errors.password = []"
        @click:append="() => (showPassword = !showPassword)"
      ></v-text-field>
      <v-text-field
        v-model="data.password_confirmation"
        :rules="rules.password_confirmation"
        label="Password Confirmation"
        outlined
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'password' : 'text'"
        @click:append="() => (showPassword = !showPassword)"
      ></v-text-field>
      <v-btn type="submit" light color="primary" width="100%">
        <span v-if="!loading">Sign Up</span>
        <v-progress-circular
          v-else
          indeterminate
          color="white"
          size="25"
        ></v-progress-circular>
      </v-btn>
    </v-form>
    <div class="forgot-signup mt-4">
      <p class="text-center">
        Already have an account? <a href="#" @click="show">Sign In</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    data: {},
    errors:{
        email:[]
    },
    showPassword:true,
    valid: false,
    loading:false,
    rules: {
      email: [
        (v) => !!v || 'The email field is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: [(v) => !!v || 'The password field is required'],
      password_confirmation: [(v) => !!v || 'The password field is required'],
      name: [(v) => !!v || 'The name field is required'],
    },
    errors: {
      name: [],
      email: [],
      password: [],

    }
  }),
  methods: {
    show() {
      this.$emit('show')
    },
    register() {
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        this.$store
          .dispatch('auth/register', this.data)
          .then((res) => {
            const response = res.data
            this.loading = false
            this.$store.commit('auth/setAuthUser', response.data)
            location.href = '/tasks'
          }).catch((err) => {
              this.loading = false
              const response = err.response
              if(response && response.status === 422){
                  this.errors = response.data.errors
              }
          })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/variables.scss';
.v-icon.v-icon.v-icon--link {
    top: -7px !important;
}
.section-two {
  z-index: 9;
  position: relative;
  width: 100vw;
  background: $white;
  border-radius: 40px 40px 0 0;
  padding: 30px 29px 0 29px;
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
    padding-top: 10%;
  }
}
</style>
