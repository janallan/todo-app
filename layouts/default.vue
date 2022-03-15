<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      left
      app
      width="299px"
      class="py-3 px-3"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img v-if="avatar" :src="avatar.url" />
            <img v-else src="/img/icons/avatar.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="user">
              <p class="name">{{ user.name }}</p>
              <p class="role">{{ user.email }}</p>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon color="accent" @click.stop="drawer = !drawer">
              mdi-close
            </v-icon>
          </v-list-item-icon>
          <hr />
        </v-list-item>
        <template v-for="(item, i) in items">
          <v-list-item
            v-if="!item.subitems"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else
            :key="i + 'k'"
            :value="'/' + $route.path.split('/')[1] === item.to"
            @click="$router.push(item.to)"
          >
            <template #activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="(subitem, k) in item.subitems"
              :key="k + 'i'"
              :to="subitem.to"
              router
              exact
            >
              <v-list-item-title
                style="padding-left: 10px"
                v-text="subitem.title"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
        <v-list-item @click="$store.dispatch('auth/logout')">
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app flat left height="50" color="white">
      <v-app-bar-nav-icon v-if="!drawer" @click.stop="drawer = !drawer" />
      <v-spacer></v-spacer>
      <v-avatar size="36px">
        <img v-if="avatar" :src="avatar.url" />
        <img v-else src="/img/icons/avatar.png" />
      </v-avatar>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <SnackBar/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          title: 'Tasks',
          to: '/tasks',
        },
      ],
      avatar: {
        url: '/img/icons/avatar.jpg',
      },
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      // avatar: (state) => state.auth.user.avatar,
    }),
  },
  created() {
    this.$store.dispatch('auth/profile')
  },
}
</script>

<style lang="scss">
@import '~/assets/variables.scss';
.user {
  text-overflow: ellipsis;
  p {
    margin-bottom: 0;
  }
  .name {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: $black;
    overflow: hidden;
  }
  .role {
    font-weight: normal;
    font-size: 9px;
    line-height: 11px;
    color: $grey;
  }
}
.v-list .v-list-item--active {
  // background: $primaryLight;
  color: $primary;
  // border-radius: 84.8485px;
}
.v-list-item--active {
  .v-image__image {
    filter: invert(87%) sepia(74%) saturate(2413%) hue-rotate(235deg)
      brightness(100%) contrast(85%);
  }
}

.v-list-item--link:before {
  background: none;
}
</style>
