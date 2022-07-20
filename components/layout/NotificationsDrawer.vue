<template>
<v-navigation-drawer v-model="show" app temporary right disable-resize-watcher class="notificationDrawer">
    <v-row no-gutters>
        <v-col cols="9" class="title pt-8 pl-3">
            {{$t('notifications.title')}}
        </v-col>
        <v-col cols="3" class="text-center py-6">
            <v-tooltip left>
                <template v-slot:activator="{on, attrs}">
                    <v-btn icon v-on="on" v-bind="attrs"  @click="readNotificationBatch">
                        <v-icon color="secondary_text">mark_email_read</v-icon>
                    </v-btn>
                </template>
                <span> {{$t('notifications.mark_read_all')}}</span>
            </v-tooltip>
            <v-tooltip left>
                <template v-slot:activator="{on, attrs}">
                    <v-btn icon v-on="on" v-bind="attrs" @click="closeNotificationBatch">
                        <v-icon color="secondary_text">close</v-icon>
                    </v-btn>
                </template>
                <span> {{$t('notifications.remove_all')}}</span>
            </v-tooltip>
        </v-col>
    </v-row>
    <v-list class="px-4">
        <v-slide-x-reverse-transition group tag="v-list">
            <v-list-item v-for="(item, i) in notifications" :key="i" @click="viewNotification(item)" class="notification-list-item" :class="getNotificationClass(item.status)" router>
                <v-list-item-action>
                    <v-icon class="notification-icon" :class="getNotificationClass(item.status)">{{ getNotificationIcon(item.module) }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <h3 class="body-1-semi">{{item.text}}</h3>
                    <h5 class="body-2">{{$t('notifications.modules.'+item.module)}} | <span class="body-3">{{$moment(item.date).fromNow()}}</span></h5>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn small icon @click.stop="closeNotification(item)">
                        <v-icon small>mdi-window-close</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-slide-x-reverse-transition>
    </v-list>
</v-navigation-drawer>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true,
        },
        notifications: {
            type: [Object, Array]
        }
    },
    model: {
        event: `modified`
    },
    data() {
        return {

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
        viewNotification(item) {
            this.$fire.database.ref('notifications/' + item.user + '/' + item.date).update({
                status: 'readed',
            })
            this.$router.push(item.action)
        },
        closeNotification(item) {
            this.$fire.database.ref('notifications/' + item.user + '/' + item.date).update({
                deleted: true,
            })
        },
        readNotificationBatch() {
            if (this.notifications != null) {
                Object.entries(this.notifications).forEach(([key, value]) => {
                    this.$fire.database.ref('notifications/' + value.user + '/' + key).update({
                        status: 'new',
                    })
                });
            }
        },
        closeNotificationBatch() {
            if (this.notifications != null) {
                Object.entries(this.notifications).forEach(([key, value]) => {
                    this.$fire.database.ref('notifications/' + value.user + '/' + key).update({
                        deleted: false,
                    })
                });
            }
        },
        getNotificationClass(status) {
            switch (status) {
                case 'readed':
                    return 'notification-list-item-readed'
                case 'new':
                    return 'notification-list-item-new'
            }
        },
        getNotificationIcon(module) {
            switch (module) {
                case 'issues':
                    return 'bug_report'
            }
        }
    }
}
</script>

<style>
.notificationDrawer {
    width: 95% !important;
    max-width: 450px !important;
    background-color: var(--v-midground-base) !important;
}

.notification-check-icon {
    color: #4CAF50 !important;
}

.notifications-enter,
.notifications-leave-to {
    opacity: 0;
}

.notifications-enter {
    transform: translateY(30%);
}

.notifications-leave-to {
    transform: translateX(300%);
}

.notifications-leave-active {
    position: absolute;
}

.notification-list-item {
    border-width: 1px !important;
    border-style: solid !important;
    border-radius: 8px !important;
    margin-bottom: 4px;
}

.notification-icon {
    padding: 6px !important;
    border-radius: 100px !important;
}

.notification-list-item.notification-list-item-new {
    background-color: var(--v-secondary_lighten-base) !important;
    border-color: var(--v-secondary-base) !important;
}

.notification-icon.notification-list-item-new {
    background-color: var(--v-secondary_lighten_hover-base) !important;
    color: var(--v-secondary-base) !important;
}

.notification-list-item.notification-list-item-readed {
    background-color: white !important;
    border-color: var(--v-secondary_lighten-base) !important;
}

.notification-icon.notification-list-item-readed {
    background-color: var(--v-background-base) !important;
    color: var(--v-secondary_text-base) !important;
}
</style>
