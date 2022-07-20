<template>
<v-app class="app-bg">
    <perfect-scrollbar style="height:100vh">
        <v-navigation-drawer v-model="menuDrawer" :mini-variant="miniVariant" app floating class="drawer-td" :mobile-breakpoint="400">
            <perfect-scrollbar style="height:100%">
                <v-row no-gutters>
                    <v-col cols="8" :class="(!miniVariant) ? 'py-8 pl-3' : ''">
                        <CommonTHLogo v-show="!miniVariant" />
                    </v-col>
                    <v-col :cols="miniVariant ? '12' : '4'" class="text-center py-8">
                        <v-btn icon small @click.stop="fixedDrawer()">
                            <v-icon>{{ miniVariant ? 'mdi-menu' : 'mdi-menu-open' }}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-list shaped>
                    <var :set="enabledMenus = menu.filter(x => !x.disabled)">
                    </var>
                    <div v-for="(link, i) in enabledMenus" :key="i">
                        <v-divider class="my-1" v-if="link.header">{{link.header}}</v-divider>
                        <v-subheader v-if="link.header && !miniVariant">{{link.header}}</v-subheader>
                        <v-list-item v-if="!link.subLinks" :key="i" :to="link.to" active-class="primary-light primary--text">
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-list-item-icon v-on="on">
                                        <v-icon :class="link.iconClass">{{ link.icon }}</v-icon>
                                    </v-list-item-icon>
                                </template>
                                <span>{{ link.text }}</span>
                            </v-tooltip>
                            <v-list-item-title v-text="link.text" />
                        </v-list-item>
                        <v-list-group v-else :key="link.text">
                            <template v-slot:activator>
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-list-item-icon v-on="on">
                                            <v-icon :class="link.iconClass">{{ link.icon }}</v-icon>
                                        </v-list-item-icon>
                                    </template>
                                    <span>{{ link.text }}</span>
                                </v-tooltip>
                                <v-list-item-title>{{ link.text }}</v-list-item-title>
                            </template>
                            <v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.text" active-class="primary-light" dense :class="!miniVariant ? 'pl-8 mr-6' : 'pl-5'">
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-list-item-icon v-on="on">
                                            <v-icon :class="sublink.iconClass" :small="miniVariant">{{ sublink.icon }}</v-icon>
                                        </v-list-item-icon>
                                    </template>
                                    <span>{{ link.text + ' > ' + sublink.text }}</span>
                                </v-tooltip>
                                <v-list-item-title v-text="sublink.text" />
                            </v-list-item>
                        </v-list-group>
                    </div>
                </v-list>
            </perfect-scrollbar>
        </v-navigation-drawer>
        <v-app-bar app sticky class="mx-2" flat>
            <v-btn icon small v-if="$vuetify.breakpoint.xs" @click="menuDrawer = true" class="ml-1">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-toolbar-title>
                {{ breadcrum }}
            </v-toolbar-title>
            <v-spacer />
            <v-menu offset-y left v-if="!minimizedNewIssue">
                <template v-slot:activator="{ on: onMenu }">
                    <v-tooltip bottom content-class="bottom" color="tranparent">
                        <template v-slot:activator="{ on: onTooltip }">
                            <v-btn icon v-on="{ ...onTooltip, ...onMenu }">
                                <v-icon color="secondary_text">bug_report</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t('issues.report_issue')}}</span>
                    </v-tooltip>
                </template>
                <v-list dense flat>
                    <v-list-item link @click="newIssueDialog = true; issueType = 'bug'">
                        <v-list-item-title>{{$t('issues.report_bug')}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="newIssueDialog = true; issueType = 'feature'">
                        <v-list-item-title>{{$t('issues.suggest_feature')}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-tooltip bottom content-class="bottom" v-else>
                <template v-slot:activator="{ on: onTooltip }">
                    <v-btn icon v-on="{ ...onTooltip }" @click="newIssueDialog = true">
                        <v-icon color="secondary_text">mdi-bug-check</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('issues.restore_report_issue')}}</span>
            </v-tooltip>
            <v-tooltip bottom content-class="bottom" v-if="this.$vuetify.theme.dark">
                <template v-slot:activator="{ on }">
                    <v-btn icon @click.stop="toggleTheme" v-on="on">
                        <v-icon color="secondary_text">light_mode</v-icon>
                    </v-btn>
                </template>
                <span>{{ $t('change_to_theme_light')}}</span>
            </v-tooltip>
            <v-tooltip bottom content-class="bottom" v-if="!this.$vuetify.theme.dark">
                <template v-slot:activator="{ on }">
                    <v-btn icon @click.stop="toggleTheme" v-on="on">
                        <v-icon color="secondary_text">dark_mode</v-icon>
                    </v-btn>
                </template>
                <span>{{ $t('change_to_theme_dark')}}</span>
            </v-tooltip>
            <v-tooltip bottom content-class="bottom">
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="notificationDrawer = true" v-on="on" class="mr-2" :disabled="!notifications">
                        <v-badge bordered overlap :content="unreadNotificationsCount" :value="unreadNotificationsCount" color="primary">
                            <v-icon color="secondary_text">notifications</v-icon>
                        </v-badge>
                    </v-btn>
                </template>
                <span>{{$t('notifications.view_notifications')}}</span>
            </v-tooltip>
            <v-btn fab class="body-2 mr-3 primary--text" depressed @click="userDrawer = !userDrawer">
                <v-badge bordered bottom color="success" class="float-right" dot offset-x="10" offset-y="10">
                    <CommonAvatar :alt="user + ' ' + user" size="40" />
                </v-badge>
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-container fluid class="px-8">
                <Nuxt />
            </v-container>
        </v-main>
        <IssuesNewIssueDialog v-model="newIssueDialog" :user="user" :type="issueType" @minimize="minimizeNewIssue()" @cancel="cancelNewIssue()" />
        <LayoutNotificationsDrawer v-model="notificationDrawer" :notifications="notifications" />
        <LayoutUserOptionsDrawer v-model="userDrawer" :user="user" :userName="user + ' ' + user" />
        <confirm-dialog />
    </perfect-scrollbar>
</v-app>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    middleware: 'auth',
    data() {
        return {
            menuDrawer: true,
            newIssueDialog: false,
            issueType: '',
            minimizedNewIssue: false,
            notificationDrawer: false,
            userDrawer: false,
            miniVariant: true,
            notifications: [],
            unreadNotificationsCount: 0,
            breadcrum: '',
            menu: [

                {
                    to: '/',
                    icon: 'space_dashboard',
                    text: this.$t('menu.dashboard'),
                }
                
            ],

        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
    },
    created() {
        process.on('unhandledRejection', (err, origin) => {
            this.$router.push('/login')
        });
        const theme = localStorage.getItem("useDarkTheme");
        if (theme) {
            if (theme == "true") {
                setTimeout(() => {
                    this.toggleThemeDark()
                }, 500)
            }
        }
    },
    mounted() {
        // this.listNotifications()
    },
    methods: {
        toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString())
        },
        toggleThemeDark() {
            this.$vuetify.theme.dark = true
        },
        changePassword() {
            this.changePasswordDialog = true
        },
        fixedDrawer() {
            this.miniVariant = !this.miniVariant
        },
        minimizeNewIssue() {
            this.minimizedNewIssue = true
        },
        cancelNewIssue() {
            this.minimizedNewIssue = false
        },
        // async listNotifications() {
        //     this.notifications = []
        //     const notificationsRef = this.$fire.database.ref('notifications/' + this.user.Id + '/')
        //     try {
        //         await notificationsRef.orderByChild('deleted/').equalTo(false).on(
        //             'value', (snapshot) => {
        //                 const data = snapshot.val();
        //                 this.notifications = data
        //                 if (this.notifications != null) {
        //                     let unreadNotifications = Object.values(this.notifications)
        //                     unreadNotifications = unreadNotifications.filter(x => x.status != "readed")
        //                     this.unreadNotificationsCount = unreadNotifications.length
        //                 }
        //             });

        //     } catch (e) {
        //         console.log(e)
        //     }
        // },
    }
}
</script>
