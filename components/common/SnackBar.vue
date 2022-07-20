<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
    <v-btn color="black" icon @click="show = false" class="float-right" small><v-icon small>mdi-window-close</v-icon></v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "snackbar",
  data() {
    return {
      show: false,
      text: null,
      color: null,
      timeout: -1
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbars/show") {
        this.text = state.snackbars.text;
        this.color = state.snackbars.color;
        this.timeout = state.snackbars.timeout;
        this.show = true;
      }
    });
  }
};
</script>