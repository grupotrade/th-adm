<template>
    <v-dialog v-model="show" width="750px">
        <material-card color="primary" full-header>
            <template #heading>
                <v-row class="pa-8 white--text">
                    <v-col>
                        <h3 class="text-h4 font-weight-light">
                            Editar usuario
                        </h3>
                        <div class="text-caption">

                        </div>
                    </v-col>
                </v-row>
            </template>
            <v-card-text>
                <v-form v-model="form" method="POST" @submit="save">
                    <v-col cols="12">
                        <v-select v-model="user.role" label="Rol" required :rules="rulesGlobal.required" :items="roles" outlined></v-select>
                        <v-select v-model="user.group" label="Grupo" required :rules="rulesGlobal.required" :items="groups" item-value="id" item-text="name" outlined></v-select>
                    </v-col>                   
                    <v-col cols="12" class="text-center">
                        <v-btn color="success" :disabled="!form" type="submit">
                            Editar
                        </v-btn>
                    </v-col>
                </v-form>
            </v-card-text>
        </material-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'dialogEditUser',
    props: {
        value: {
            type: Boolean,
            required: true,
        }, 
        user: {
            type: Object,
            required: true,
        }, 
        groups: {
            type: Array,
            required: true,
        }, 
    },
    data () {
        return {
            show: this.value,
            form: false,
            roles: [
                'admin',
                'generador'
            ]
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