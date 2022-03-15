export default{
  setAuthUser(state, data){
      state.token = data.access_token

      state.user = data.user

      console.log(data);
      localStorage.setItem('token', state.token)

  },

  setUserDetails(state, data){
      state.user = data
  },

  setErrors(state, errors){
      if(errors.email){
          state.errors.email = errors.email
      }
  },

  removeErrors(state, key){
    if (key === 'email') {
      state.errors.email = []
    }
  }

}
