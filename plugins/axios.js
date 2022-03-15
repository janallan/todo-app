export default function ({ $axios, redirect, store, route}) {
  $axios.onError(error => {
      if(!error.response || error.response.status === 500){
          store.commit('snackbar/toggle', "Ooops! Something wen't wrong on the server.");
      }

      if(error.response.status === 401 && route.path !== '/'){
          localStorage.removeItem('token')
          location.reload()
      }
  })

  if(store.state.auth.token){
      $axios.setHeader('Authorization', 'Bearer '+store.state.auth.token)
  }
}
