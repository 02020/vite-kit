<template>
      <section v-bind:id="'#'+id" class="shadow-blue white-bg padding-50">
      <div class="overlay bg-content"> </div>
      <h3 class="section-title">{{title}}</h3>

      <div style="margin:20px 0;font-size:18px;line-height:1.8">
        <div v-html="html"></div>
        <slot></slot>
      </div>

      <div class="text-right">
        <a v-bind:href="'#'+nextId" v-on:click="handleClick" class="btn btn-default">{{btn}}</a>
      </div>
    </section>
</template>

<script>

/**

  <script type="text/template" id="v-agenda-item">

  </script>


  <script type="text/template" id="v-agenda">
   
  </script>

    <v-agenda ref="agenda" v-if="agendaVisible"
              v-on:visible="agendaVisible=arguments[0]"></v-agenda>

 */

export default {
  
}
</script>