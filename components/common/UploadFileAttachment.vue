<template>
<v-dialog v-model="show" width="600px">
    <v-toolbar dense flat class="midground">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="show = false">
            <v-icon>mdi-window-close</v-icon>
        </v-btn>
    </v-toolbar>
    <v-card flat tile class="card-surface">
        <v-card-text class="pa-6 text-center ">
            <v-progress-circular indeterminate :size="90" :width="7" class="my-8" color="primary" v-show="loading" />
            <file-input :title="$t('select_drag_file')" class="mb-5" v-model="file" @save="save" />
        </v-card-text>
        <v-card-actions>
            <v-btn text @click="cancelUpload">
                {{$t('cancel')}}
            </v-btn>
            <v-spacer />
            <v-btn depressed class="px-6" color="primary">
                {{$t('upload')}}
            </v-btn>
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
        title: {
            type: String,
            default: 'Adjuntar archivo'
        }
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            file: null
        }
    },
    computed: {
        loading: false,
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
        uploadFile() {
            this.loading = true
        },
        cancelUpload() {
            this.show = false
        },
        save(file) {
            this.$emit("save", file)
        }
    }
}
</script>
