export const states = {
    list: []
}

export const actions = {
    listUsers({commit}, payload) {
        return new Promise((resolve, reject) => {
            let users = []
            const ref = this.$fire.firestore.collection('users')
            ref.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let item = doc.data()
                    item.id = doc.id
                    users.push(item)
                })
                    
                commit('setUsers', users)
                resolve(users)
            }, error => {
                reject('Error al listar los usuarios')
            })
            
        })
    }
}

export const mutations = {
    setUsers (state, payload) {
        state.list = JSON.parse(JSON.stringify(payload))
    }
}

export const getters = {
    getUsers: (state) => {
        return state.list
    }
}