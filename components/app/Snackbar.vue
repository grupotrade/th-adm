<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
    <v-btn color="black" icon @click="show = false"><v-icon>mdi-close</v-icon></v-btn>
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
      if (mutation.type === "snackbar/show") {
        this.text = state.snackbar.text;
        this.color = state.snackbar.color;
        this.timeout = state.snackbar.timeout;
        this.show = true;
      }
    });
  }
};
</script>