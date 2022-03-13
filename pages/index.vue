<template>
  <div class="d-md-flex">
    <div class="section-one">
      <!-- <img class="bg" src="/img/login-background.png" alt="" /> -->
      <div class="content">
        <p class="text1">ToDo App</p>
        <p class="text2">by Jan Allan Verano</p>
      </div>
    </div>
    <LoginForm v-if="loginform" @show="loginform = !loginform"/>
    <RegistrationForm v-else @show="loginform = !loginform"/>
  </div>
</template>

<script>
export default {
  layout: 'login',
  data: () => ({
    loginform: true,
  })
}
</script>

<style lang="scss">
@import '~/assets/variables.scss';
.section-one {
  width: 100%;
  position: relative;
  background: $primary;
  .bg {
    position: relative;
    width: 100%;
    opacity: 0.1;
  }
  .text1 {
    text-decoration: underline;
    margin-top: 59px;
    font-weight: 300;
    font-size: 27px;
    line-height: 109.19%;
    padding-bottom: 9px;
  }
  .text2 {
    font-size: 14px;
    line-height: 16px;
    padding-bottom: 92px;
  }
  .content {
    z-index: 9;
    position: absolute;
    color: $white;
    left: 33px;
    top: 69px;
    p {
      margin-bottom: 0;
    }
  }
}
@media (min-width: 768px) {
  .section-one {
    height: 100vh;
    .bg {
      height: 100vh;
    }
    .content {
      left: 10%;
      top: 30%;
      .text1 {
        font-size: 60px;
      }
      .text2 {
        font-size: 25px;
      }
    }
  }
}
@media (min-width: 960px) {
  .section-one {
    .content {
      left: 10%;
      top: 10%;
      .text1 {
        font-size: 54px;
      }
    }
  }
}
</style>
