<template>
<v-container fluid class="d-flex align-center flex-column pa-0">
    <v-sheet class="tail bottom" v-if="bottom" :color="color">

    </v-sheet>
    <v-sheet rounded flat class="bubble" :color="color">
        {{text}}
    </v-sheet>
    <v-sheet class="tail" :color="color" v-if="!bottom">

    </v-sheet>
</v-container>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: '[Inserte texto aquí]'
        },
        color: {
            type: String,
            default: 'midground'
        },
        bottom: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style>
.tail {
    height: 12px;
    width: 12px;
    -webkit-clip-path: polygon(50% 100%, 0 0, 100% 0);
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    box-shadow: 0 0 0 24px rgba(32, 57, 96, 0.25) !important;
}
.tail.bottom {
   transform: rotate(180deg);
}

.bubble {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    position: static;
    width: 160px;
    height: 36px;
    left: 0px;
    top: 0px;
    border-radius: 8px;
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0 !important;
    box-shadow: 0px 4px 24px rgba(32, 57, 96, 0.25) !important;
}
</style>
