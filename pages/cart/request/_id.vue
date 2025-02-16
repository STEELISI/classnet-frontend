<template>
    <div>
      <a @click="$router.go(-1)">Back</a>
  
      <div v-if="!(collection.toLowerCase().includes('frgp-continuous') || collection.toLowerCase().includes('frgp-download') || collection.toLowerCase().includes('dua-lasic') || collection.toLowerCase().includes('dua-lasic'))">
          <RequestCart></RequestCart>
      </div>
      <div v-else-if="(collection.toLowerCase().includes('frgp-continuous') || collection.toLowerCase().includes('frgp-download') ) ">
        <RequestCartFRGP></RequestCartFRGP>
      </div>
      <div v-else-if="(collection.toLowerCase().includes('dua-lasic') || collection.toLowerCase().includes('dua-lasic'))">
        <RequestCartLasic></RequestCartLasic>
      </div>
      <div v-else>{{ loadingMessage }}</div>
    </div>
  </template>
  
  <script>

import RequestCartLasic from '~/components/RequestCartLasic.vue';

  
  export default {
    components: {
      RequestCart: () => import('@/components/RequestCart'),
      RequestCartFRGP: () => import('@/components/RequestCartFRGP'),
      RequestCartLasic: () => import('@/components/RequestCartLasic'),
      LazyHydrate: () => import('vue-lazy-hydration')
    },
    head() {
      return {
        title: 'Request Cart',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: ''
          }
        ]
      }
    },
    data() {
      return {
        loadingMessage: 'Loading...',
        provider: '',
        collection:''
      }
    },

    mounted() {
        this.provider = this.$route.query.provider
        this.collection = this.$route.query.collection
    }
  }
  </script>
  