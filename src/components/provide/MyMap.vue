<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker,
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135,
      x: 1,
      y: 1,
    })

    const updateLocation = () => {
      location.value = 'South Pole' + +new Date()
      geolocation.x = +new Date()
      geolocation.y = +new Date()
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)
  },
}
</script>