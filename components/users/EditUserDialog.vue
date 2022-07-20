<template>
<v-dialog v-model="value" width="450px">
    <v-toolbar dense flat color="midground">
        <v-toolbar-title>{{$t('users.edit_user')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="show = false">
            <v-icon>mdi-window-close</v-icon>
        </v-btn>
    </v-toolbar>
    <v-card flat tile class="card-surface pt-2">
        <v-form v-model="valid" v-on:submit.prevent="onSubmitEditUser">
            <v-card-text>
                <v-sheet rounded outlined class="transparent">
                    <v-card-title>
                        {{$t('profile.personal_info')}}
                    </v-card-title>
                    <v-text-field dense color="secondary" outlined type="text" required :rules="rulesGlobal.name" v-model="firstName" :label="$t('users.first_name')">
                    </v-text-field>
                    <v-text-field dense color="secondary" outlined type="text" required :rules="rulesGlobal.surname" v-model="lastName" :label="$t('users.last_name')">
                    </v-text-field>
                </v-sheet>
                <v-divider>
                </v-divider>
                <v-sheet rounded outlined class="transparent">
                    <v-card-title>
                        {{$t('phones')}}
                    </v-card-title>
                    <v-text-field dense v-for="(phone, i) in phones" :key="i" color="secondary" outlined type="text" required :rules="rulesGlobal.phone" v-model="phones[i]">
                        <template v-slot:append-outer>
                            <v-btn icon @click="deletePhone(phone)" class="align-start">
                                <v-icon color="error">
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                    <v-card-actions class="transparent justify-end">
                        <v-btn tile depressed class="transparent" @click="addPhone">
                            <v-icon>mdi-plus</v-icon>{{$t('users.edit.add_phone')}}
                        </v-btn>
                    </v-card-actions>
                </v-sheet>
                <v-divider>
                </v-divider>
                <v-sheet rounded outlined class="transparent">
                    <v-card-title>
                        {{$t('email')}}
                    </v-card-title>
                    <v-text-field dense v-for="(email, i) in emails" :key="i" color="secondary" outlined type="text" required :rules="rulesGlobal.email" v-model="emails[i].EmailAddress">
                        <template v-slot:append-outer>
                            <v-btn icon v-if="i > 0" @click="deleteEmail(email)" class="align-start">
                                <v-icon color="error">
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                    <v-card-actions class="transparent justify-end">
                        <v-btn tile depressed class="transparent" @click="addEmail">
                            <v-icon>mdi-plus</v-icon>{{$t('users.edit.add_email')}}
                        </v-btn>
                    </v-card-actions>
                </v-sheet>
            </v-card-text>
            <v-card-actions class="transparent justify-end">
                <v-btn block tile depressed color="primary" type="submit" :disabled="!valid" :loading="loading">
                    {{$t('users.edit_user')}}
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean
        },
        user: {
            type: Object
        }
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            valid: false,
            emails: [],
            phones: [],
            firstName: '',
            lastName: '',
            loading: false
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
    watch: {

    },
    created() {
        // const userClone = JSON.parse(JSON.stringify(this.user))
        // this.emails = userClone.ContactInfo.Emails
        // this.phones = userClone.ContactInfo.Phones
        // this.firstName = userClone.FirstName
        // this.lastName = userClone.LastName
    },
    methods: {

        deleteEmail(email) {
            const indexOf = this.emails.indexOf(email)
            if (indexOf > -1) {
                this.emails.splice(indexOf, 1)
            }
        },
        addEmail() {
            this.emails.push({
                EmailType: 0
            })
        },
        deletePhone(phone) {
            const indexOf = this.phones.indexOf(phone)
            if (indexOf > -1) {
                this.phones.splice(indexOf, 1)
            }
        },
        addPhone() {
            this.phones.push('')
        },
        onSubmitEditUser() {
            this.loading = true
            const payload = {
                ContactInfo: {
                    Emails: this.emails,
                    Phones: this.phones,
                },
                FirstName: this.firstName,
                LastName: this.lastName,
                Id: this.user.Id,
                UserName: this.user.UserName
            }
            this.$store.dispatch('users/editUser', payload)
                .then(res => {
                    this.$store.dispatch('users/get')
                    this.show = false
                })
                .catch(err => {
                    this.$toasted.error(err, {
                        duration: 1500
                    })
                })
                .finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>

<style>

</style>
