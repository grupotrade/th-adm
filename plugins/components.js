import Vue from 'vue'
import Avatar from '@/components/common/Avatar'
import FileInput from '@/components/common/FileInput'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import SnackBar from '@/components/common/SnackBar.vue'
import Alert from '@/components/common/Alert.vue'
import GoToTop from '@/components/common/GoToTop.vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import SpeechBubble from '~/components/common/SpeechBubble.vue'

Vue.use(PerfectScrollbar)
Vue.component('avatar', Avatar)
Vue.component('file-input', FileInput)
Vue.component('confirm-dialog', ConfirmDialog)
Vue.component('snackbar', SnackBar)
Vue.component('alert', Alert)
Vue.component('go-to-top', GoToTop);
Vue.component('speech-bubble', SpeechBubble)

