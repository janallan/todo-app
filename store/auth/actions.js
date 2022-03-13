
export default {
  login({commit}, data){
      return this.$axios.post('/auth/login', data)
  },

  async logout({commit}){
      await this.$axios.post('/auth/logout')
      localStorage.removeItem('token')
      location.href = '/'
  },

  register({commit}, data){
    return this.$axios.post('/register', data)
  },


  async profile({commit, state}){
    if(!state.user.id){
        const response = await this.$axios.get('/auth/profile')
        const data = response.data.data
        commit('setUserDetails', data)
        return response.data
    }
  },

}
