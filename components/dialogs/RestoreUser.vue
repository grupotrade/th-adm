<template>
    <v-dialog v-model="show" width="750px">
        <material-card color="success" full-header>
            <template #heading>
                <v-row class="pa-8 white--text">
                    <v-col>
                        <h3 class="text-h4 font-weight-light">
                            Restaurar usuario
                        </h3>
                        <div class="text-caption">

                        </div>
                    </v-col>
                </v-row>
            </template>
            <v-card-text>       
                ¿Desea restaurar al usuario {{user.email}}?        
                <v-col cols="12" class="text-center">
                    <v-btn color="success" @click="save">
                        Si
                    </v-btn>
                    <v-btn color="grey" @click="show=false">
                        No
                    </v-btn>
                </v-col>
            </v-card-text>
        </material-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'dialogRestoreUser',
    props: {
        value: {
            type: Boolean,
            required: true,
        }, 
        user: {
            type: Object,
            required: true,
        }, 
    },
    data () {
        return {
            show: this.value
        }
    },
    watch: {
        show(val) {
            this.$emit('input', val)
        },
        value(val) {
            this.show = val
        }
    },
    methods: {
        save (event) {
            event.preventDefault()
            this.$emit('save', this.user)
        }
    }
}
</script>