const default_role = 'generador'

export const states = {
    version: 2,
    user: null,
    token: null
}

export const actions = {
    signInWithPopup({commit}, payload) {
        const provider = new this.$fire.auth.app.firebase_.auth.GoogleAuthProvider()
        return new Promise((resolve, reject) => {
            this.$fire.auth.signInWithPopup(provider).then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = result.credential
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                const collection = this.$fire.firestore.collection('users')
                const collectionGroup = this.$fire.firestore.collection('groups')
                collection.doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data()
                        if (!data.enable) {
                            reject("No autorizado")
                        } else {
                            collectionGroup.doc(data.group).get().then((docGroup) => {
                                const dataGroup = docGroup.data()

                                this.$fire.analytics.setUserId(user.uid);
                                this.$fire.analytics.setUserProperties({
                                    account_type: "Basic" // can help you to define audiences
                                });
                                commit('setUser', {
                                    uid: user.uid,
                                    apiKey: user.apiKey,
                                    displayName: user.displayName,
                                    email: user.email,
                                    role: data.role,
                                    group: dataGroup
                                })

                                commit('setToken', token)
                                resolve("Ingreso autorizado.")
                            })
                        }
                    } else {
                        this.$fire.firestore.collection("users").doc(user.uid).set({
                            displayName: user.displayName,
                            email: user.email,
                            role: default_role,
                            enable: false,
                            group: null,
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
                console.log('no oka')
                reject("Error de autenticación")
            });
        })
    },
    signOut({commit}, payload) {
        this.$fire.auth.signOut().then(() => {
            commit('setUser', null)
            commit('setToken', null)
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