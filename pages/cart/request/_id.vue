<template>
    <div>
      <a @click="$router.go(-1)">Back</a>
  
      <div v-if="!(collection.toLowerCase().includes('frgp-continuous') || collection.toLowerCase().includes('frgp-download') )">
          <RequestCart></RequestCart>
      </div>
      <div v-else-if="(collection.toLowerCase().includes('frgp-continuous') || collection.toLowerCase().includes('frgp-download') ) ">
          
      </div>
      <div v-else>{{ loadingMessage }}</div>
    </div>
  </template>
  
  <script>
  
  export default {
    components: {
      RequestCart: () => import('@/components/RequestCart'),
      RequestArtifactFRGP: () => import('@/components/RequestArtifactFRGP'),
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
  