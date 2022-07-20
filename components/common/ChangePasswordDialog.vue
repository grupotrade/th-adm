<template>
<v-dialog v-model="show" persistent width="450px">
    <v-toolbar dense flat color="midground">
        <v-toolbar-title>{{$t('profile.change_password')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="show = false">
            <v-icon>mdi-window-close</v-icon>
        </v-btn>
    </v-toolbar>
    <v-card flat tile class="card-surface pt-2">
        <v-form v-model="validChange" v-on:submit.prevent="onSubmitChangePassword">
            <v-card-text>
                <v-text-field v-if="profile" v-model="form.current_password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" :label="$t('profile.old_password')" outlined counter @click:append="showPass = !showPass" color="secondary"></v-text-field>
                <v-text-field v-model="form.password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" required :rules="rulesGlobal.password" :type="showPass ? 'text' : 'password'" :label="$t('profile.new_password')" outlined counter @click:append="showPass = !showPass" @keyup="idConfirmationPassword++" color="secondary"></v-text-field>
                <v-text-field v-model="form.password_confirmation" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" required :rules="rulesGlobal.passwordConfirm" :type="showPass ? 'text' : 'password'" :label="$t('confirm_password')" outlined counter @click:append="showPass = !showPass" :key="idConfirmationPassword" color="secondary"></v-text-field>
            </v-card-text>
            <v-card-actions class="d-block">
                <v-btn color="primary" type="submit" :disabled="!validChange" block tile depressed>{{$t('change')}}</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</v-dialog>
</template>

<script>
import {
    mapGetters
} from 'vuex'

export default {
    props: {
        value: {
            type: Boolean
        },
        user: {
            type: Object
        },
        profile: {
            type: Boolean,
            default: false
        }
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            showPass: false,
            validChange: false,
            form: {
                current_password: '',
                password: '',
                password_confirmation: ''
            },
            idConfirmationPassword: 0,
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit("modified", val);
            }
        }
    },
    methods: {
        onSubmitChangePassword(evt) {
            const payload = {
                user: this.user,
                newPassword: this.form.password
            }
            this.$store.dispatch('users/updateUserAndPassword', payload)
                .then(res => {
                    this.$toasted.success('users.alerts.password_reset.success', {
                        duration: 1500
                    })
                    this.$store.dispatch('users/logout')
                        .finally(() => {
                            localStorage.setItem("lastPage", this.$nuxt.$route.path)
                            location.replace('/login')
                        })
                })
                .catch(err => {
                    this.$toasted.error(err, {
                        duration: 1500
                    })
                })
                
        }
    }
}
</script>
