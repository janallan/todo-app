export default function({store, redirect, route }){

  if(!store.state.auth.token && route.path !== '/'){
      return redirect('/')
  }

  if(route.path === '/' && store.state.auth.token){
      return redirect('/inspire')
  }
}
