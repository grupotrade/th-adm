<template>
<div>{{ loggedUser }}</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
export default {
    name: 'IndexPage',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
            loggedUser: 'auth/getUser',
        }),
    }
}
</script>
