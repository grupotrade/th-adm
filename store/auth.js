const default_role = 'public'

export const states = {
    version: 2,
    user: null,
    token: null
}

export const actions = {
    signInWithPopup({commit}, payload) {
        return new Promise((resolve, reject) => {
            this.$fire.auth.signInWithEmailAndPassword(payload.email, payload.password).then((result) => {
                // The signed-in user info.
                const user = result.user;
                console.log(user)
                const collection = this.$fire.firestore.collection('users')
                collection.doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data()
                        if (!data.enable) {
                            reject("No autorizado")
                        } else {
                              //  this.$fire.analytics.setUserId(user.uid);
                                commit('setUser', {
                                    uid: user.uid,
                                    apiKey: user.apiKey,
                                    displayName: user.email,
                                    email: user.email,
                                    role: default_role
                                })
                                resolve("Ingreso autorizado.")
                                location.replace('/')
                        }
                    } else {
                        this.$fire.firestore.collection("users").doc(user.uid).set({
                            displayName: user.email,
                            email: user.email,
                            role: default_role,
                            enable: false,
                            deleted_at: ""
                        })
                        .then(() => {
                            reject("No autorizado")
                        })
                        .catch((error) => {
                            reject("No autorizado")
                        });                        
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage)
                reject("Error de autenticación")
            });
        })
    },
    signOut({commit}, payload) {
        this.$fire.auth.signOut().then(() => {
            commit('setUser', null)
        }).catch((error) => {
        // An error happened.
        });
    }
}

export const mutations = {
   setUser(state, payload) {
       state.user = payload
   },
   setToken(state, payload) {
       state.token = payload
   }
}

export const getters = {
    getUser: (state) => {
        return state.user
    },
    getToken: (state) => {
        return state.token
    }
}