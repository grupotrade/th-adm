<template>
<v-app>
    <Nuxt />
    <snackbar />
</v-app>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
        const theme = localStorage.getItem("useDarkTheme");
        if (theme) {
            if (theme == "true") {
                setTimeout(() => {
                    this.toggleThemeDark()
                }, 500)
            }
        }
    },
    methods: {
        toggleThemeDark() {
            this.$vuetify.theme.dark = true
        },
    }
}
</script>
