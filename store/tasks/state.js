export default () => ({
  user: {},
  token: localStorage.getItem('token') || null,
  errors : {
      email:[],
  }
})
