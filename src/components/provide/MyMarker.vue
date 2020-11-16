<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation,
    }
  }
}
</script>


<template>
  {{userLocation}}
  <div class="space-x-1 bg-gray-400">
    <span class="md:m-1 p-2 ">{{userGeolocation.x}}</span>
    <span class="md:m-1 p-2 ">{{userGeolocation.y}}</span>
  </div>
  
  <button class="btn" @click="updateUserLocation">update</button>
</template>