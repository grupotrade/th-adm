<template>
  <v-alert v-model="show" :type="type" :border="border" :color="color" :dark="dark" :colored-border="colored_border" :dense="dense" dismissible>
    {{ text }}
  </v-alert>
</template>

<script>
export default {
  name: "alert",
  data() {
    return {
      show: false,
      text: null,
      color: null,
      border: null,
      type: null,
      dark: false,
      colored_border: false,
      dense: false,
      timeout: 0
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "alerts/show") {
        this.text = state.alerts.text;
        this.color = state.alerts.color;
        this.timeout = state.alerts.timeout;
        this.type = state.alerts.type;
        this.colored_border = state.alerts.colored_border;
        this.dense = state.alerts.dense;
        this.show = true;
      }
    });
  },
  watch: {
    show(val) {
      if(val){
        setTimeout(() => {
          this.show = false
        }, this.timeout)
      }
    }
  }
};
</script>