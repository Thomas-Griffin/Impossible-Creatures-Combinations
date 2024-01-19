<template>
  <div class="fullscreen bg-blue text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div
        class="text-h2"
        style="opacity: 0.4"
        >Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        label="Go Home"
        no-caps
        text-color="blue"
        to="/"
        unelevated
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent} from 'vue';

defineComponent({
  name: 'ErrorNotFound'
});
</script>
