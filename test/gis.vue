 <script>
import Sketch from './gis/single/Sketch.vue'
import Draw from './gis/single/Draw.vue'
import HelloGIS from './gis/HelloGIS.vue'
import Symbol from './gis/single/Symbol.vue'
import Shape from './gis/single/Shape.vue'
import Test from './gis/Test.vue'

import ShapePopup from './gis/ShapePopup.vue'
import EventsHitTest from './gis/EventsHitTest.vue'
import Layer from './gis/single/Layer.vue'
import ShapeLayer from './gis/single/ShapeLayer.vue'
import PrintTask from './gis/single/PrintTask.vue'
import GIS from './gis92'
import Mark from './gis/Mark.vue'

export default {
  name: 'TestGIS',
  components: {
    HelloGIS,
    Symbol,
    Shape,
    ShapePopup,
    Test,
    EventsHitTest,
    Sketch,
    Draw,
    Layer,
    ShapeLayer,
    PrintTask,
    Mark,
  },
  data() {
    return {
      visible: false,
    }
  },
  beforeCreate() {
    console.log('beforeCreate')
    GIS()
  },
  mounted() {
    gis.on('init', () => {
      console.log('init')
      // this.visible = true
    })
  },
}
</script>

<template>
  <div id="viewMap"></div>
  <div v-if="visible">
    <div class="flex space-x-1 mt-2">
      <HelloGIS />
      <Draw />
      <Mark />
      <ShapeLayer />
      <Symbol />
    </div>

    <div class="flex flex-col space-x-1 mt-2"></div>

    <div
      style="right: 20px; top: 50px"
      class="flex flex-col space-y-1 absolute"
    >
      <PrintTask></PrintTask>
      <Sketch></Sketch>
      <Shape />
      <ShapePopup />
      <EventsHitTest></EventsHitTest>
      <Layer></Layer>
      <Test />
    </div>
  </div>
</template>

<style>
#viewMap {
  padding: 10px;
  top: 30px;
  position: absolute;
  width: 100%;
  height: 700px;
}

.esri-view .esri-view-root {
  border: 2px solid #333;
}

.dijitMenuPopup {
  position: absolute;
  background-color: azure;
}

.esri-view-height-less-than-medium .esri-popup__main-container,
.esri-view-height-large .esri-popup__main-container {
  max-height: 600px;
  width: 300px;
}

.esri-ui {
  z-index: 1;
}
.esri-editor {
  top: 60px;
  right: 20px;
  z-index: 1000;
}

.esri-editor__header {
  height: 36px;
}

.esri-editor__feature-list-item {
  padding: 8px 3px;
}

/* .esri-feature-form__form   :after,.esri-feature-form__form  :before{
  box-sizing:border-box
} */

.esri-feature-form__input {
}

.esri-feature-form__label {
  /* flex-direction:row; */
}
</style>
