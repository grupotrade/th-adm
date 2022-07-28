<template>
<v-dialog v-model="show" width="950px">
    <v-toolbar dense flat color="midground">
        <v-toolbar-title v-if="type == 'bug'">{{$t('issues.report_bug')}}</v-toolbar-title>
        <v-toolbar-title v-else>{{$t('issues.suggest_feature')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="minimizeNewIssueDialog()">
                    <v-icon>mdi-window-minimize</v-icon>
                </v-btn>
            </template>
            <span>{{ $t("minimize") }}</span>
        </v-tooltip>
        <v-tooltip bottom content-class="bottom">
            <template v-slot:activator="{ on }">
                <v-btn depressed icon v-on="on" @click="cancelNewIssue()">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </template>
            <span>{{ $t("cancel") }}</span>
        </v-tooltip>
    </v-toolbar>
    <v-card flat tile class="card-surface pt-2">
        <v-form v-model="validIssue" v-on:submit.prevent="saveIssue">
            <v-card-text>
                <v-container v-if="type == 'bug'">
                    <v-row dense>
                        <v-col>
                            <v-text-field dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="issue.title" label="Título del error" hint="Título que describa brevemente el error" color="secondary"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="issue.category" :items="categories" label="Área o servicio afectado"></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field dense outlined class="body-1" background-color="foreground" v-model="issue.link" label="Link al error y/o Localizador" hint="Link de búsqueda, link al ADM y/o localizador de reserva" color="secondary"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-textarea dense outlined class="body-1" background-color="foreground" required :rules="rulesGlobal.required" v-model="issue.description" label="Descripción del error" hint="Detalles respecto al comportamiento del error, asi como el comportamiento esperado" placeholder="Al tratar de revisar una reserva de hoteles, aparece un error que detalla 'No se pudo sincronizar a sistema de agencia...'. En su lugar, deberia actualizar la reserva">
                            </v-textarea>
                        </v-col>
                        <v-col>
                            <v-textarea dense outlined class="body-1" background-color="foreground" v-model="issue.steps" label="Paso a paso para reproducir el error" hint="Proceso o pasos para reproducir el error" placeholder="1. Buscar en **Miami Y Sus Alrededores**, el **03/09/2021**, **2 adultos**
2. Hacer click en **Rodeway Inn Miami** 
3. Reservar **1 King Bed**
4. Ir al adm y revisar reserva">
                            </v-textarea>
                        </v-col>
                    </v-row>
                    <v-row dense justify="center">
                        <v-col class="text-center">
                            <v-file-input v-model="issue.file" placeholder="Seleccione sus archivos" color="secondary" background-color="foreground" outlined prepend-icon="mdi-paperclip" @change="onFilePicked" :disabled="processing" multiple>
                                <template v-slot:selection="{ index, text }">
                                    <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
                                        {{ text }}
                                    </v-chip>

                                    <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                        +{{ files.length - 2 }} {{ $t('files') }}
                                    </span>
                                </template>
                            </v-file-input>
                            <v-row dense>
                                <v-col cols="3">
                                    <span v-if="progress > 0 && progress < 100">Subiendo archivos...</span>
                                    <span v-if="progress == 100" class="success--text">Archivos subidos</span>
                                </v-col>
                                <v-col>
                                    <v-progress-linear class="my-3" :value="progress" :buffer-value="100" :color="(progress == 100) ? 'success' : 'primary'" v-if="progress > 0 && progress < 100"></v-progress-linear>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="3" v-for="image in blobs" :key="image">
                                    <v-btn icon small class="white float-right mt-n4 ml-n4 z-index1000" @click="removeImage(image)">
                                        <v-icon small>close</v-icon>
                                    </v-btn>
                                    <v-img contain :src="image" width=""></v-img>
                                </v-col>
                            </v-row>
                            <v-checkbox label="Marcar como urgente" class="body-1" v-model="issue.priority" hide-details></v-checkbox>
                        </v-col>
                    </v-row>
                </v-container>
                <v-container v-if="type == 'feature'">
                    <v-row dense>
                        <v-col>
                            <v-text-field dense outlined required :rules="rulesGlobal.required" v-model="issue.title" class="body-1" background-color="foreground" label="Título de la sugerencia" hint="Título que describa brevemente la sugerencia" color="secondary"></v-text-field>
                            <v-select dense outlined required :rules="rulesGlobal.required" v-model="issue.category" class="body-1" background-color="foreground" :items="categories" label="Área o servicio afectado"></v-select>
                        </v-col>
                        <v-col cols="8">
                            <v-textarea dense outlined required :rules="rulesGlobal.required" v-model="issue.description" class="body-1" background-color="foreground" label="Descripción de la mejora" hint="Detalles respecto a la sugerencia" placeholder="Sería de gran utilidad poder filtrar los productos de atracciones en base a el idioma del guía, de tal manera que sea mas fácil encontrar productos adecuados para cada cliente
Por ejemplo - poder filtrar por Guía en Español y/o Audioguia en Inglés.">
                            </v-textarea>

                        </v-col>
                    </v-row>
                    <v-row dense justify="center">
                        <v-col class="text-center">
                            <v-file-input v-model="issue.file" :placeholder="$t('select_files')" color="secondary" background-color="foreground" outlined prepend-icon="mdi-paperclip" @change="onFilePicked" :disabled="processing" multiple>
                                <template v-slot:selection="{ index, text }">
                                    <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
                                        {{ text }}
                                    </v-chip>

                                    <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                        +{{ files.length - 2 }} {{ $t('files') }}
                                    </span>
                                </template>
                            </v-file-input>
                            <v-row dense>
                                <v-col cols="3">
                                    <span v-if="progress > 0 && progress < 100">Subiendo archivos...</span>
                                    <span v-if="progress == 100" class="success--text">Archivos subidos</span>
                                </v-col>
                                <v-col>
                                    <v-progress-linear class="my-3" :value="progress" :buffer-value="100" :color="(progress == 100) ? 'success' : 'primary'" v-if="progress > 0 && progress < 100"></v-progress-linear>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="3" v-for="image in blobs" :key="image">
                                    <v-btn icon small class="white float-right mt-n4 ml-n4 z-index1000" @click="removeImage(image)">
                                        <v-icon small>close</v-icon>
                                    </v-btn>
                                    <v-img contain :src="image" width=""></v-img>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions class="justify-center background">
                <v-btn large color="primary" type="submit" :disabled="!validIssue || processing" depressed>{{$t('issues.send_issue')}}</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean
        },
        user: {
            type: Object
        },
        type: {
            type: String,
            default: 'bug'
        },
    },
    model: {
        event: `modified`
    },
    data() {
        return {
            validIssue: false,
            processing: false,
            fileURL: null,
            progress: 0,
            files: [],
            blobs: [],
            images: [],
            categories: [
                'General del ADM',
                'Administración',
                'Reserva',
                'Proveedor',
            ],
            issueId: null,
            issue: {
                title: '',
                category: '',
                link: '',
                description: '',
                steps: '',
                file: null,
                priority: false,
                screens: [],
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
    mounted() {
        this.issueIncrementId()
    },
    methods: {
        async issueIncrementId() {
            this.issueId = null
            const issueIdRef = this.$fire.database.ref('issueid')
            try {
                await issueIdRef.on(
                    'value', (snapshot) => {
                        const data = snapshot.val();
                     //   this.issueId = data.current
                    });

            } catch (e) {
                console.log(e)
            }
        },
        minimizeNewIssueDialog() {
            this.show = false;
            this.$emit("minimize");
        },
        cancelNewIssue() {
            this.$dialog.show({
                title: `${this.$t("confirm_dialog.cancel_new_issue")}`,
                text: `${this.$t("confirm_dialog.confirm_cancel")} ${this.$t(
          "confirm_dialog.new_issue"
        )}`,
                buttons: [{
                    text: this.$t("accept"),
                    color: "primary",
                    handle: () => {
                        this.$dialog.hide();
                        this.show = false;
                        this.$emit("cancel");
                    },
                }, ],
            });
        },
        saveIssue: function (e) {
            e.preventDefault()
            const issuesRef = this.$fire.firestore.collection("issues")
            const dateTime = new Date()
            issuesRef.add({
                title: this.issue.title,
                category: this.issue.category,
                link: this.issue.link,
                description: this.issue.description,
                steps: this.issue.steps,
                screens: this.issue.screens,
                date: dateTime.toISOString(),
                status: 'pending',
                label: this.type,
                priority: this.issue.priority,
                user: {
                    name: this.user.FirstName + ' ' + this.user.LastName,
                    id: this.user.Id
                },
                issueid: this.issueId++
            }, )
            this.saveNotification(this.issue.title, this.user.Id, 'issues', 'new', '/issues/list')
            this.incrementIssueId(this.issueId++)
            this.issue.title = ''
            this.issue.category = ''
            this.issue.link = ''
            this.issue.description = ''
            this.issue.steps = ''
            this.issue.priority = false,
                this.issue.file = null
            this.success = true
            this.screens = []
            this.files = []
            this.blobs = []
            this.images = []
            this.$dialog.hide();
            this.show = false;
        },
        onFileSelected(file) {
        },
        async onFilePicked(files) {
            for (let file of files) {
                this.images.push(file)
                let blob = await this.prepareImagesForUpload(file)
                this.blobs.push(blob)
            }
            this.uploadImagesToFirebase()
        },
        prepareImagesForUpload(file) {
            return new Promise((resolve, reject) => {
                let filename = file.name
                if (filename.lastIndexOf(".") <= 0) {
                    alert("Please add a valid file: ", filename)
                    reject()
                }
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.addEventListener("load", async () => {
                    resolve(fileReader.result)
                })
            })
        },
        async uploadImagesToFirebase() {
            this.issue.screens = []
            this.processing = true
            for (let image of this.images) {
                const filePath = `${Date.now()}-${image.name}`;
                var storageRef = await this.$fire.storage.ref(this.user.Id).child(filePath)
                let uploadTask = storageRef.put(image)
                uploadTask.on('state_changed', (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        this.progress = progress
                        this.progress = 0
                    },
                    (error) => {
                        console.log(error);
                    })
                uploadTask.then(
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            this.issue.screens.push(downloadURL);
                        })
                    }
                )

            }
        },
        removeImage(image) {
            const indexOf = this.blobs.indexOf(image)
            if (indexOf > -1) {
                this.blobs.splice(indexOf, 1)
            }
        }
    }
}
</script>
