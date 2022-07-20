<template>
    <v-btn fixed color="secondary" dark fab small right bottom @click="go">
        <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
</template>

<script>
export default {
    methods: {
        go() {
            this.$emit('go')
        },
    }
}
</script>
