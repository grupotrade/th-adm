import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default ctx => {
  const vuetify = new Vuetify({
    lang: {
      t: (key, ...params) => ctx.app.i18n.t(key, params),
    },
    config: {
     silent : true
    },
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      options: {
        customProperties: true,
        ripples: false
      },
      themes: {        
        light: {
          primary_text: '#212C3D',
          secondary_text: '#5C6E8A',
          border: '#A9B7CC',
          background: '#F1F4F9',
          midground: '#F5F9FF',
          foreground: '#FFFFFF',
          primary: '#484591',
          primary_hover: '#FF6C33',
          primary_active: '#F9B99F',
          primary_lighten_hover: '#FED4C3',
          primary_lighten: '#FDE7DE',
          secondary_darken: '#0E63F1',
          secondary: '#4285F4',
          secondary_hover: '#5C99FF',
          secondary_active: '#9FC1F9',
          secondary_lighten_hover: '#CFE0FC',
          secondary_lighten: '#E3EDFD',
          accent: '#FF8F00',
          error: '#ED5E65',
          error_map: '#F7B5B9',
          error_lighten: '#FDE7E8',
          success: '#40BF95',
          success_map: '#B5E7D7',
          success_lighten: '#E2F5EF',
          warning: '#F39525',
          warning_map: '#F7D8B6',
          warning_lighten: '#FDEFDE',
          shade_light: '#ffffff',
          shade_dark: '#0A1129' ,
      },
      dark: {
          primary_text: '#EFF3F8',
          secondary_text: '#96A9C5',
          border: '#5B79A4',
          background: '#121F3D',
          midground: '#1C2A4A',
          foreground: '#1F355C',
          primary: '#8298F9',
          primary_hover: '#ED622C',
          primary_active: '#F9B99F',
          primary_lighten_hover: '#484866',
          primary_lighten: '#3E3E58',
          secondary_darken: '#99BFFF',
          secondary: '#4285F4',
          secondary_hover: '#5C99FF',
          secondary_active: '#9FC1F9',
          secondary_lighten_hover: '#16305A',
          secondary_lighten: '#142C52',
          accent: '#F5A43D' ,
          error: '#ED5E65',
          error_map: '#864A61',
          error_lighten: '#3E3B5D',
          success: '#40BF95',
          success_map: '#367B7D',
          success_lighten: '#244A65',
          warning: '#F6AC55',
          warning_map: '#917255',
          warning_lighten: '#3F475B',
          shade_light: '#ffffff' ,
          shade_dark: '#0A1129',
        }
      }
    }
  })
  ctx.app.vuetify = vuetify
  ctx.$vuetify = vuetify.framework
}

