<template>
<div>
    <v-avatar v-if="src && !checkUrl()" :size="size">
        <img :src="this.src" :alt="alt" />
    </v-avatar>
    <v-avatar v-else color="primary" :size="size">
        <span class="white--text no_avatar">{{ noAvatar(alt) }}</span>
    </v-avatar>
</div>
</template>

<script>

export default {
    name: 'avatar',
    props: {
        src: {
            type: String,
            required: false,
            default: null
        },
        alt: {
            type: String,
            required: false,
            default: null
        },
        size: {
            type: String,
            required: false,
            default: '32'
        }
    },
    data () {
        return {
            no_avatar: null
        };
    },
    methods: {
        checkUrl() {
            let src = this.src
            src = src.split("/null")
            return src.length > 1
        },
        noAvatar(alt) {
            let full_name = alt.split(' ')
            let no_avatar = (full_name[0].slice(0,1) + full_name[1].slice(0,1)).toUpperCase()
            return no_avatar
        }
    }
    

}
</script>

<style scoped>
.no_avatar {
    font-size: 1.2rem !important;
    font-weight: 400;
    line-height: 2rem;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
};
</style>

