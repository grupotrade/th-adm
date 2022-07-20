<template>
<v-dialog v-model="show" width="700px">
    <v-toolbar flat class="foreground" dense>
        <v-toolbar-title>{{issue.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="show = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </template>
            <span>{{$t('close')}}</span>
        </v-tooltip>
    </v-toolbar>
    <v-card flat tile class="card-surface">
        <v-card-text>
            Está seguro de cerrar la incidencia?
            <v-textarea v-model="comment" outlined @keyup.enter="saveComment" label="Escriba motivo o comentario"></v-textarea>
        </v-card-text>
        <v-card-actions>
            <v-btn class="primary" depressed @click="cancelIssue">Comentar y cerrar</v-btn>
            <v-btn class="grey" depressed @click="show = false">{{$t('cancel')}}</v-btn>
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
            default: null
        },
        user: {
            type: Object
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

        cancelIssue() {
            this.$fire.firestore.collection('issues').doc(this.issue.id).update({
                status: 'canceled',
                changesHistory: this.$fireModule.firestore.FieldValue.arrayUnion({
                    comment: this.comment,
                    date: Date.now(),
                    user: this.user.Id,
                    status: 'canceled'
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
