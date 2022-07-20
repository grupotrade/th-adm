<template>
    
</template>
<script>
export default {
    middleware: 'auth',
    name: "logout",
    mounted () {
        this.$store.dispatch('auth/signOut', null).then(result => {
            this.$snackbar.show({
                text: result,
                color: 'success'
            })
            setTimeout(() => {
                this.$router.push('/login')
            }, 1000)
        }, error => {
            this.$snackbar.show({
                text: error,
                color: 'error'
            })
        })
    }
}
</script>