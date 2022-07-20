<template>
<v-navigation-drawer v-model="show" app temporary class="midground" right disable-resize-watcher>
    <v-row class="mt-3">
        <v-col class="body-2 text-right">
            {{userName}}<br>
        </v-col>
        <v-col>
            <v-badge bordered bottom color="success" dot offset-x="10" offset-y="10">
                <CommonAvatar size="45" :alt="userName" />
            </v-badge>
        </v-col>
    </v-row>
    <v-divider class="my-3" />
    <v-list shaped>
        <v-list-item v-for="(item, i) in menuUser" :key="i" :to="item.to" @click="item.action && item.action()" router exact>
            <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title class="body-1" v-text="item.title" />
            </v-list-item-content>
        </v-list-item>
        <v-divider class="my-3" />
        <v-list-item to="logout" exact active-class="list-active">
            <v-list-item-action>
                <v-icon color="error">logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title class="body-1 error--text">
                    {{$t('logout')}}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
    <CommonChangePasswordDialog :user="user" v-model="changePasswordDialog" />
    <UsersEditUserDialog :user="user" v-model="editUserDialog" />
</v-navigation-drawer>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true,
        },
        userName: {
            type: String,
            default: ''
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
            changePasswordDialog: false,
            editUserDialog: false,
            menuUser: [{
                    icon: 'edit',
                    title: this.$t('edit_profile'),
                    action: () => this.editUser()
                },
                {
                    icon: 'password',
                    title: this.$t('profile.change_password'),
                    action: () => this.changePassword()
                },

                {
                    icon: this.$vuetify.theme.dark ? 'dark_mode' : 'light_mode',
                    title: this.$t('change_theme'),
                    action: () => this.toggleTheme()
                },
                {
                    icon: 'bug_report',
                    title: this.$t('issues.reported_issues'),
                    to: '/issues/list'
                }
            ],
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
        },
    },
    methods: {
        toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString())
        },
        changePassword() {
            this.changePasswordDialog = true
        },
        editUser() {
            this.editUserDialog = true
        }
    }
}
</script>

<style>

</style>
