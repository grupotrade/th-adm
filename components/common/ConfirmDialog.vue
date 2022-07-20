<template>
  <v-dialog v-model="show" width="450px">
    <v-card tile class="midground">
      <v-card-title v-html="title"></v-card-title>
      <v-spacer></v-spacer>
      <v-card-text v-html="text"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed color="grey" dark @click="show = false" text v-if="!hidecancel"> {{$t('cancel')}}</v-btn>
        <v-btn depressed v-for="(btn, index) in buttons" :key="index" :color="btn.color" v-html="btn.text" @click="btn.handle"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "confirm-dialog",
  data() {
    return {
     show: false,
     text: null,
     title: null,
     buttons: [],
     hidecancel: false
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'dialogs/show') {
        this.text = state.dialogs.text
        this.title = state.dialogs.title
        this.buttons = state.dialogs.buttons
        this.hidecancel = state.dialogs.hidecancel
        this.show = true
      } else if (mutation.type === 'dialogs/hide') {
        this.show = false
      }
    })
  }
}
</script>
