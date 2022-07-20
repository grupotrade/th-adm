<template>
<v-card flat tile class="card-surface">
    <v-card-text class="pa-0">
        <template v-for="(msg) in comments">
            <div :class="{ 'd-flex flex-row-reverse text-right mr-2': user.Id === msg.userid }" :key="msg">
                <div class="ml-2">
                    <h6 v-if="user.Id != msg.userid" :class="{ 'text-right': user.Id === msg.userid }">{{msg.username}}
                    </h6>
                    <p class="mr-1 mb-1 chat-date">{{ $t('sended')}} {{$moment(msg.date).format('DD-MM-YYYY HH:mm')}}</p>
                    <v-chip :color="user.Id === msg.userid ? 'chat-me chat-bubble body-2 text-right' : 'chat-others chat-bubble'" :close="user.role_id === 1" :close-icon="user.role_id === 1 ? 'mdi-delete' : ''" @click:close="deleteMessage(msg.id)">
                        {{ msg.text }}
                    </v-chip>
                </div>
            </div>
        </template>
        <v-divider class="my-4" />
        <v-container>
            <v-row align="center">
                <v-col cols="9">
                    <v-textarea v-model="comment" class="body-2" outlined @keyup.enter="saveComment" hide-details></v-textarea>
                </v-col>
                <v-col cols="3">
                    <v-btn small depressed color="primary" @click="saveComment">{{$t('send')}}
                        <v-icon right small>send</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

    </v-card-text>
</v-card>
</template>

<script>
export default {
    props: {
        issue: {
            type: Object,
            default: null
        },
        user: {
            type: Object
        },
    },
    data() {
        return {
            comment: '',
            comments: []
        }
    },
    watch: {
        issue: {
            handler: function () {
                this.listComments()
            },
            deep: true
        }
    },
    methods: {
        async listComments() {
            this.comments = []
            const messageRef = this.$fire.database.ref('comments/' + this.issue.id)
            try {
                await messageRef.on(
                    'value', (snapshot) => {
                        const data = snapshot.val();
                        this.comments = data
                    });

            } catch (e) {
                console.log(e)
            }
        },
        async saveComment() {
            const date = Date.now()
            const messageRef = this.$fire.database.ref('comments/' + this.issue.id + '/' + date)
            try {
                await messageRef.set({
                    date: date,
                    text: this.comment,
                    username: this.user.FirstName + ' ' + this.user.LastName,
                    userid: this.user.Id
                })

            } catch (e) {
                console.log(e)
            }
            this.comment = ''
        }
    }
}
</script>
