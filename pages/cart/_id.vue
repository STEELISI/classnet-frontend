<template>
    <div>
      <a @click="$router.go(-1)">Back</a>
        <Cart></Cart>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  
  export default {
    components: {
      Cart: () => import('@/components/Cart'),
      LazyHydrate: () => import('vue-lazy-hydration')
    },
    head() {
      return {
        title: 'Cart',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'cart'
          }
        ]
      }
    },
    data() {
      return {
        loadingMessage: 'Loading...'
      }
    },

  }
  </script>
  