<template>
<v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4" align="center">
        <v-card width="500" class="elevation-4 text-left">
            <v-card-title>Ingresar</v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field label="Email" name="login" prepend-icon="mdi-account" type="text" v-model="auth.email"></v-text-field>

                    <v-text-field label="Contraseña" name="password" prepend-icon="mdi-lock" type="password" v-model="auth.password"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="text-center">
                <v-btn class="login-button" @click="login" depressed large>Entrar</v-btn>
                <v-btn class="reset-button" @click="forgotPassword" depressed large>Recordar contraseña</v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar :timeout="4000" v-model="snackbar" absolute bottom center>
            {{ snackbarText }}
        </v-snackbar>
    </v-col>
</v-row>
</template>

<script>
export default {
    layout: 'clean',
    data() {
        return {
            snackbar: false,
            snackbarText: 'No error message',
            auth: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            this.loading = true
            this.$store.dispatch('auth/signInWithPopup', this.auth.email, this.auth.password).then(
                result => { 
                    this.$snackbar.show({
                        text: result,
                        color: 'success'
                    })
                    this.$router.push('/')
                    this.loading = false
                    this.$fire.analytics.logEvent("login", 1);
                }, error => {
                    this.loading = false
                    this.$snackbar.show({
                        text: error,
                        color: 'error'
                    })  
                })
        },
        forgotPassword() {
            let that = this
            this.$fire.auth.sendPasswordResetEmail(this.auth.email)
                .then(function () {
                    that.snackbarText = 'reset link sent to ' + that.auth.email
                    that.snackbar = true
                })
                .catch(function (error) {
                    that.snackbarText = error.message
                    that.snackbar = true
                })
        }
    }
}
</script>

<style>

</style>
