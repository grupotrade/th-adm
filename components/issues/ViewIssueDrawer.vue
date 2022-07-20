<template>
<v-navigation-drawer v-model="show" app temporary right disable-resize-watcher class="issuesDrawer" stateless>
    <v-toolbar flat class="foreground" dense>
        <v-toolbar-title class="body-2"><span class="secondary_text--text">{{issue.category}} ></span> <strong class="primary_text--text">{{issue.title}} #{{issue.issueid}}</strong></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="closeViewIssueDrawer">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </template>
            <span>{{$t('close')}}</span>
        </v-tooltip>
    </v-toolbar>
    <v-sheet>
        <v-container>
            <v-row>
                <v-col cols="1">
                    <v-badge bordered bottom color="success" dot offset-x="10" offset-y="10">
                        <CommonAvatar size="45" :alt="issue.user.name" />
                    </v-badge>
                </v-col>
                <v-col cols="4">
                    <h4 class="body-1-semi secondary_text--text">{{ issue.user.name }}</h4>
                    <span class="body-3 secondary_text--text">{{$t('issues.created_on')}} {{$moment(issue.date).fromNow()}}</span>
                </v-col>
                <v-col class="text-right">
                    <v-menu offset-y left v-if="issue.status != 'closed'">
                        <template v-slot:activator="{ on: onMenu }">
                            <v-tooltip top content-class="top">
                                <template v-slot:activator="{ on: onTooltip }">
                                    <v-btn small depressed color="secondary_lighten" v-on="{ ...onTooltip, ...onMenu }">
                                        <v-icon small>rotate_90_degrees_ccw</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{$t('issues.change_status')}}</span>
                            </v-tooltip>
                        </template>
                        <v-list dense flat>
                            <v-list-item link @click="updateIssueStatus(issue.id,'pending')">
                                <v-list-item-title>{{$t('issues.status.pending')}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="updateIssueStatus(issue.id,'in_progress')">
                                <v-list-item-title>{{$t('issues.status.in_progress')}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click.prevent="updateIssueStatusComment(issue,'blocked')">
                                <v-list-item-title>{{$t('issues.status.blocked')}}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn small depressed v-if="issue.status != 'closed'" color="success" @click.prevent="updateIssueStatusComment(issue,'closed')">
                        <v-icon small left>done</v-icon> {{$t('issues.close_issue')}}
                    </v-btn>
                    <v-btn small depressed v-else color="secondary_text--text" @click.prevent="updateIssueStatus(issue,'pending')">
                        {{$t('issues.reopen_issue')}}
                    </v-btn>
                    <v-btn small depressed color="secondary_lighten secondary--text" @click.prevent="editIssue(issue)" v-if="issue.status != 'closed' && editing == false">
                        <v-icon small left>edit</v-icon> {{$t('edit')}}
                    </v-btn>
                    <v-btn small depressed color="success" @click.prevent="confirmEditIssue()" v-if="editing == true">
                        <v-icon small left>save</v-icon> {{$t('confirm_edit')}}
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
    <v-sheet class="priority-sheet body-1 pa-3" v-if="issue.priority">
        <v-icon color="error">push_pin</v-icon> Esta incidencia fue marcada como <strong>urgente</strong>
    </v-sheet>
    <v-card flat tile class="card-surface">
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="9">
                        <v-text-field v-model="edit.title" outlined v-if="editing"></v-text-field>
                        <h2 class="primary_text--text" v-else>
                            {{issue.title}} #{{issue.issueid}}
                            <v-chip small :color="getStatusColor(issue.status)" class="body-2">{{ $t('issues.status.'+issue.status)}}</v-chip>
                        </h2>
                        <v-textarea v-model="edit.description" outlined v-if="editing"></v-textarea>
                        <p class="body-2 primary_text--text my-4" v-else>{{issue.description}}</p>
                        <v-row>
                            <light-box :items="issue.screens" :index="indexScreen" :useZoomBar="true" :fullScreen="true" :effect="'fade'" @close="indexScreen = null">
                            </light-box>
                            <v-col cols="6" v-for="(image, imageIndex) in issue.screens" :key="imageIndex">
                                <v-img :src="image" @click="indexScreen = imageIndex" class="cursor-zoom"></v-img>
                            </v-col>
                        </v-row>
                        <v-divider class="my-4" />
                        <h3 class="secondary_text--text">
                            <v-icon small color="secondary_text" left>comment</v-icon>{{$t('comments')}}
                        </h3>
                        <IssuesCommentsCard :issue="issue" :user="user" />
                    </v-col>
                    <v-col cols="3">
                        <div class="body-2">
                            {{ $t('issues.assigned_to') }}
                            <v-menu offset-y left>
                                <template v-slot:activator="{ on: onMenu }">
                                    <v-tooltip top content-class="top">
                                        <template v-slot:activator="{ on: onTooltip }">
                                            <v-btn small icon color="secondary_lighten" v-on="{ ...onTooltip, ...onMenu }">
                                                <v-icon small>edit</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{$t('issues.assign_issue')}}</span>
                                    </v-tooltip>
                                </template>
                                <v-list dense flat>
                                    <v-list-item v-for="dev in developers" :key="dev.id" link @click="updateIssueAssignment(dev)">
                                        <v-list-item-title>{{ dev.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            <h4 v-if="issue.assigned != null">{{issue.assigned.name}}</h4>
                            <p v-else>Sin asignar</p>
                        </div>
                        <v-divider class="my-4" />
                        <div class="body-2">
                            {{ $t('category') }}
                            <v-menu offset-y left>
                                <template v-slot:activator="{ on: onMenu }">
                                    <v-tooltip top content-class="top">
                                        <template v-slot:activator="{ on: onTooltip }">
                                            <v-btn small icon color="secondary_lighten" v-on="{ ...onTooltip, ...onMenu }">
                                                <v-icon small>edit</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{$t('issues.assign_issue')}}</span>
                                    </v-tooltip>
                                </template>
                                <v-list dense flat>
                                    <v-list-item v-for="cat in categories" :key="cat" link @click="updateIssueCategory(category)">
                                        <v-list-item-title>{{ cat }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            <h4 v-if="issue.category != null">{{issue.category}}</h4>
                        </div>
                        <v-divider class="my-4" />
                        <div class="body-2">
                            <p>Labels</p>
                            <v-chip small :color="(issue.priority) ? 'error' : ''">{{ (issue.priority) ? 'Urgente' : 'Normal' }}</v-chip>
                        </div>
                        <v-divider class="my-4" />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</v-navigation-drawer>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean
        },
        issue: {
            type: Object,
            default: null
        },
        user: {
            type: Object,
        },
        developers: {
            type: Array,
        }
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            indexScreen: null,
            loading: false,
            editing: false,
            categories: [
                'General del ADM',
                'Administración',
                'Reserva',
                'Proveedor',
            ],
            edit: {
                title: this.issue.title,
                description: this.issue.description
            }
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
        updateIssueStatus(item, status) {
            this.$emit('updateStatus', item, status)
        },
        updateIssueStatusComment(item, status) {
            this.$emit('updateStatusComment', item, status)
        },
        updateIssueAssignment(user) {
            this.$fire.firestore.collection('issues').doc(this.issue.id).update({
                assigned: {
                    id: user.id,
                    name: user.name
                },
                changesHistory: this.$fireModule.firestore.FieldValue.arrayUnion({
                    date: Date.now(),
                    user: {
                        name: this.user.FirstName + ' ' + this.user.LastName,
                        id: this.user.Id
                    },
                    assigned: user.name
                })

            }).then(result => {
                this.$toasted.success(this.$t('issues.success.update'), {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
                this.show = false,
                    this.$emit('refresh')
            }, error => [
                this.$toasted.error(error, {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
            ])
        },
        updateIssueCategory(category) {
            this.$fire.firestore.collection('issues').doc(this.issue.id).update({
                category: category,
                changesHistory: this.$fireModule.firestore.FieldValue.arrayUnion({
                    date: Date.now(),
                    user: {
                        name: this.user.FirstName + ' ' + this.user.LastName,
                        id: this.user.Id
                    },
                    category: category
                })

            }).then(result => {
                this.$toasted.success(this.$t('issues.success.update'), {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
                this.show = false,
                    this.$emit('refresh')
            }, error => [
                this.$toasted.error(error, {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
            ])
        },
        editIssue() {
            this.editing = true
            this.edit = {
                title: this.issue.title,
                description: this.issue.description
            }
        },
        confirmEditIssue() {
            this.$fire.firestore.collection('issues').doc(this.issue.id).update({
                title: this.edit.title,
                description: this.edit.description,
                changesHistory: this.$fireModule.firestore.FieldValue.arrayUnion({
                    date: Date.now(),
                    user: {
                        name: this.user.FirstName + ' ' + this.user.LastName,
                        id: this.user.Id
                    },
                    title: this.edit.title,
                    description: this.edit.description,
                })

            }).then(result => {
                this.$toasted.success(this.$t('issues.success.update'), {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
                this.show = false
                this.$emit('refresh')
                this.editing = false

            }, error => [
                this.$toasted.error(error, {
                    theme: "bubble",
                    position: "top-right",
                    duration: 2000
                })
            ])
        },
        closeViewIssueDrawer() {
            this.show = false
            this.editing = false
        }
    }
}
</script>

<style>
.issuesDrawer {
    width: 800px !important;
}
.priority-sheet {
    background-color: var(--v-error_lighten-base) !important;
    border-left: 3px solid var(--v-error-base) !important;
    color: var(--v-error-base) !important;
}
</style>
