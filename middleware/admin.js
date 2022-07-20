export default function ({store, redirect, route, $fire}) {
    if(!store.getters['auth/getUser']) return redirect('/login')
    if(store.getters['auth/getUser'].role !== 'admin') return redirect('/')
    
    $fire.analytics.logEvent(route.path, 1);
}