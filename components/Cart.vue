<template>
  <div v-if="cart && Object.keys(cartGroupedByProviderCollection).length">
    <v-card-title class="text-h6 mb-4" style="margin-bottom: 30px;">
      Artifacts grouped by artifact provider and use agreement
    </v-card-title>
    <v-card v-for="(artifactGroup, key) in cartGroupedByProviderCollection" :key="key" class="mx-auto">
      <v-container fluid>
        <v-row class="d-flex align-center justify-space-between">
          <v-col class="d-flex align-center" cols="8">
            <v-card-title class="align-start py-0 my-0">
              <v-btn @click="toggleDropdown(key)" outlined text :class="{ 'highlight-animation': key === `${highlightProvider},${highlightCollection}` }">
                Provider: {{ key.split(',')[0] }}, Use Agreement: {{ key.split(',')[1] }}
              </v-btn>
            </v-card-title>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-btn class="secondary " @click="viewDUA(key)" text>View DUA</v-btn>
            <v-btn class="primary ml-2" @click="navigateToRequestPage(key)" text>Request</v-btn>
            <transition name="modal-fade">
              <DUAReviewModal
                v-show="isModal"
                @close="closeModal"
                @submitRequest="closeModal"
                v-bind:duaHTML="duaHTML"
                :isViewOnly=true>
              </DUAReviewModal>
          </transition>
          </v-col>
        </v-row>
        <v-expand-transition>
          <v-row v-if="artifactGroup.showDropdown" class="d-flex flex-column">
            <v-col v-for="(title, index) in artifactGroup.titles" :key="index" class="d-flex align-center">
              <v-card-subtitle class="py-0 my-0">{{title}}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-container>
    </v-card>
  </div>
  <div v-else>
    <div v-if="!cartFetched">
      <v-col cols="12" sm="8" md="8">
        <v-alert
          icon="mdi-loading"
          prominent
          text
          type="info"
        >
          Loading...
        </v-alert>
      </v-col>
    </div>
    <div v-else>
      <v-col cols="12" sm="8" md="8">
        <v-alert
          icon="mdi-shield-lock-outline"
          prominent
          text
          type="info"
        >
          Your cart is currently empty. You can add an artifact to cart on the artifact view page.
        </v-alert>
      </v-col>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCartGroupedByProviderCollection } from '@/helpers'
import { marked } from 'marked'

export default {
  components: {
      DUAReviewModal: () => import('@/components/DUAReviewModal')
    },
  name: 'Cart',

  data() {
    return {
      cartGroupedByProviderCollection: {},
      cartFetched:false,
      isModal:false,
      duaHTML: '',
      
    }
  },

  async mounted() {
    await this.$store.dispatch('user/fetchUser')
    this.cartFetched = true;
    this.cartGroupedByProviderCollection = getCartGroupedByProviderCollection(this.cart)
    this.highlightProvider = this.$route.query.provider
    this.highlightCollection = this.$route.query.collection
  },

  computed: {
    ...mapState({
      cart: state => state.user.cart,
      userid: state => state.user.userid,
    }),
  },

  methods: {
    toggleDropdown(key) {
      this.$set(this.cartGroupedByProviderCollection, key, {
        ...this.cartGroupedByProviderCollection[key],
        showDropdown: !this.cartGroupedByProviderCollection[key].showDropdown
      });
    },
    navigateToRequestPage(providerCollection) {
      const [provider, collection] = providerCollection.split(',');
      this.$router.push({ path: '/cart/request', query: { provider, collection } });
    },
    async fetchDUA(providerCollection) {
        const [provider, collection] = providerCollection.split(',');
        let payload = {
            'provider': provider,
            'collection': collection
          }
        let response = await this.$duaPreviewEndpoint.index(payload);
        this.dua = response.dua;
        this.duaHTML = marked(this.dua);
        this.isModal = true
      },
    async viewDUA(providerCollection) {
      await this.fetchDUA(providerCollection)
    },
    closeModal(){
        this.isModal = false
    }
  },
}
</script>
<style scoped>
.highlight-animation {
  animation: pulsate 1s ease-in 3;
}


@keyframes pulsate {
  0% {
    background-color: #FFFDE7;;
  }
  50% {
    background-color: white;
  }
  100% {
    background-color: #FFFDE7;;
  }
}
</style>
