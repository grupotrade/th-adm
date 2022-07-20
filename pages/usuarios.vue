<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="10">        
    <dialogEditUser v-if="userSelected" v-model="dialogEdit" :user="userSelected" :groups="groups" @save="saveEdit" />
    <dialogDeleteUser v-if="userSelected" v-model="dialogDelete" :user="userSelected" @save="saveDelete" />
    <dialogRestoreUser v-if="userSelected" v-model="dialogRestore" :user="userSelected" @save="saveRestore" />
      <material-card
          color="orange"
          full-header
        >
          <template #heading>
            <v-row class="pa-8 white--text">
                    <v-col>
                        <h3 class="text-h4 font-weight-light">
                            Usuarios
                        </h3>
                        <div class="text-caption">

                        </div>
                    </v-col>
                    <v-col cols="5" class="text-right">

                        <v-btn color="red" @click="deletedUsers = !deletedUsers;listUsers()">
                            <v-icon>
                                mdi-eye
                            </v-icon>
                            {{ (deletedUsers) ? 'Mostrar usuarios activos' : 'Mostrar usuarios eliminados' }}
                        </v-btn>
                    </v-col>
                </v-row>
          </template>
          <v-card-text>
            <v-data-table :headers="headers" :items="users" item-key="email">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" @click="openDialogEditUser(item)">
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip top v-if="!deletedUsers">
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" @click="openDialogDeleteUser(item)">
                                    <v-icon>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                        <v-tooltip top v-else>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" @click="openDialogRestoreUser(item)">
                                    <v-icon>
                                        mdi-delete-restore
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Restaurar</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.group="{ item }">
                        {{ getGroup(item) }}
                    </template>
                    <template v-slot:item.enable="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-switch v-model="item.enable" @change="updateStatus(item)" :label="(item.enable) ? 'Autorizado' : 'No autorizado'"></v-switch>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
          </v-card-text>
        </material-card>
    </v-col>
  </v-row>
</template>

<script>

import dialogEditUser from '@/components/dialogs/EditUser.vue'
import dialogDeleteUser from '@/components/dialogs/DeleteUser.vue'
import dialogRestoreUser from '@/components/dialogs/RestoreUser.vue'

export default {
    middleware: 'admin',
    name: 'Usuarios',
    components: {
        dialogEditUser,
        dialogDeleteUser,
        dialogRestoreUser
    },
    data: () => ({
        headers: [
            {
                sortable: false,
                text: 'Email',
                value: 'email',
            },
            {
                sortable: false,
                text: 'Grupo',
                value: 'group',
            },
            {
                sortable: false,
                text: 'Rol',
                value: 'role',
            },
            {
                sortable: false,
                text: 'Habilitado',
                value: 'enable',
            },
            {
                sortable: false,
                text: 'Acciones',
                value: 'actions',
            }
        ],
        users: [],
        dialogEdit: false,
        dialogDelete: false,
        dialogRestore: false,
        userSelected: null,
        deletedUsers: false,
        groups: []
    }),
    mounted() {
        this.listUsers() 
        this.readGroups()    
    },
    methods: {
        listUsers () {
            const ref = this.$fire.firestore.collection('users').where('deleted_at', (this.deletedUsers) ? '!=': '==', "")
            ref.get().then((querySnapshot) => {                
                this.users = []
                querySnapshot.forEach((doc) => {
                    let item = doc.data()
                    item.id = doc.id
                    this.users.push(item)
                })
                    
            }, error => {
            })   
        },
        readGroups() {
            let ref = this.$fire.firestore.collection('groups').where('deleted_at', (this.deletedUsers) ? '!=': '==', "")
            ref.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let item = doc.data()
                    item.id = doc.id
                    this.groups.push(item)
                })
            })
        },
        getGroup(item) {
            const group = this.groups.find(x => x.id === item.group)

            if (group) return group.name

            return null
        },
        updateStatus(item) {
            this.$fire.firestore.collection('users').doc(item.id).update({
                enable: item.enable
            }).then(result => {
                this.$snackbar.show({
                    text: 'Estado actualizado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        },
        openDialogEditUser(item) {
            this.userSelected = Object.assign({}, item)
            this.dialogEdit = true
        },
        openDialogDeleteUser(item) {
            this.userSelected = Object.assign({}, item)
            this.dialogDelete = true
        },
        openDialogRestoreUser(item) {
            this.userSelected = Object.assign({}, item)
            this.dialogRestore = true
        },
        saveEdit(item) {
            this.$fire.firestore.collection('users').doc(item.id).update({
                role: item.role,
                group: item.group
            }).then(result => {
                this.listUsers()
                this.dialogEdit = false
                this.$snackbar.show({
                    text: 'Rol actualizado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        },
        saveDelete(item) {
            const deleted_at = new Date()

            this.$fire.firestore.collection('users').doc(item.id).update({
                deleted_at: deleted_at.toISOString()
            }).then(result => {
                this.listUsers()
                this.dialogDelete = false
                this.$snackbar.show({
                    text: 'Usuario eliminado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        },
        saveRestore(item) {
            this.$fire.firestore.collection('users').doc(item.id).update({
                deleted_at: ""
            }).then(result => {
                this.listUsers()
                this.dialogRestore = false
                this.$snackbar.show({
                    text: 'Usuario restaurado',
                    color: 'success'
                })
            }, error => [
                this.$snackbar.show({
                    text: error,
                    color: 'error'
                })
            ])
        }
    }
  }
</script>
