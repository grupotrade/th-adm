<template>
<v-dialog v-model="show" width="550px">
    <v-toolbar flat class="foreground" dense>
        <v-toolbar-title>{{issue.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click.stop="show = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </template>
            <span>{{$t('close')}}</span>
        </v-tooltip>
    </v-toolbar>
    <v-card flat tile class="card-surface">
        <v-card-text>
            <h4 class="body-1 py-4 text-center">{{text}}</h4>
            <v-textarea v-model="comment" outlined @keyup.enter="saveComment" class="body-2" hide-details :label="$t('write_comment')"></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn text depressed @click="show = false">{{$t('cancel')}}</v-btn>
            <v-btn class="primary" depressed @click.stop="updateIssue">{{$t('issues.comment_update')}}</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean
        },
        issue: {
            type: Object,
            require: true
        },
        user: {
            type: Object
        },
        text: {
            type: String
        },
        status: {
            type: String
        },
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            comment: null
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
    mounted() {

    },
    methods: {

        updateIssue() {
            this.$fire.firestore.collection('issues').doc(this.issue.id).update({
                status: this.status,
                changesHistory: this.$fireModule.firestore.FieldValue.arrayUnion({
                    comment: this.comment,
                    date: Date.now(),
                    user: {
                        name: this.user.FirstName + ' ' + this.user.LastName,
                        id: this.user.Id
                    },
                    status: this.status
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

    }
}
</script>
