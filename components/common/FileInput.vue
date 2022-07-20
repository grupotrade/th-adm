<template>
<div draggable="true" dropzone="true" @dragstart="$event.stopPropagation(); $event.preventDefault();dropping=true" @dragenter="$event.stopPropagation(); $event.preventDefault();" @dragend="$event.stopPropagation(); $event.preventDefault();dropping=false" @dragover="$event.stopPropagation(); $event.preventDefault();dropping=true" @dragleave="dropping=false" @drop="$event.stopPropagation(); $event.preventDefault();doDrop($event)">
    <label>{{ label }}</label>
    <v-btn @click="selectFile" class="btn-file-input" depressed>
        <v-icon>{{icon}}</v-icon>
        <span v-if="!select && !dropping">
            {{ title }}
        </span>
        <span v-if="select && !dropping" v-html="select.name" />
        <span v-if="dropping">{{$t('drop_file_here')}}</span>
    </v-btn>
    <v-file-input @change="processFile($event)" ref="file" type="file" :required="validated" :accept="filetype" v-show="false" />
</div>
</template>

<script>
export default {
    name: 'file-input',
    props: {
        value: {
            type: File
        },
        icon: {
            type: String
        },
        title: {
            type: String
        },
        label: {
            type: String,
            default: ''
        },
        validated: {
            type: Boolean,
            default: false
        },
        filetype: {
            type: String,
            default: ''
        },
        change: {
            type: Function,
            default: () => {
                return
            }
        }
    },
    data() {
        return {
            dropping: false,
            required: [
                v => !!v || this.$t('rules.required'),
            ],
            extensionImage: [
                v => !!v || this.$t('rules.type_user'),
                v => !!v || this.$t('rules.type_email'),
                v => /.+@.+\..+/.test(v) || this.$t('rules.valid_email'),
            ],
        }
    },
    model: {
        event: `modified`
    },
    computed: {
        select: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit("modified", val);
            }
        }
    },
    methods: {
        selectFile(evt) {
            this.$refs.file.$el.children[1].children[0].children[0].children[1].click()
        },
        processFile(event) {
            this.select = event
            this.change(this.select)
            this.$emit('save', event)
        },
        doDrop(event) {
            let dt = event.dataTransfer;
            let files = dt.files;

            let count = files.length;

            if (count > 0) {
                this.select = files[0]
            }

            this.dropping = false
        }
    }
}
</script>

<style scoped>
.btn-file-input {
    font-size: 14px;
    font-weight: 600;
    color: #007C97;
    background-color: white;
    display: inline-block;
    transition: all .5s;
    cursor: pointer;
    padding: 0 40px !important;
    text-transform: uppercase;
    width: 100% !important;
    height: 100px !important;
    border: 1px dashed #C7C7CC !important;
    text-align: center;
    text-transform: initial !important;
    white-space: pre-wrap
}

input {
    visibility: hidden !important;
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
}
</style>
