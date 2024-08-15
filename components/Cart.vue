<template>
  <div v-if="cart && Object.keys(cartGroupedByProviderCollection).length">
    <v-card-title class="text-h6 mb-4" style="margin-bottom: 30px;">
      Artifacts grouped by artifact provider and use agreement
    </v-card-title>
    <v-card v-for="(artifactGroup, key) in cartGroupedByProviderCollection" :key="key" class="mx-auto">
      <v-container fluid>
        <v-row class="d-flex align-center justify-space-between">
          <v-col class="d-flex align-center" cols="10">
            <v-card-title class="align-start py-0 my-0">
              <v-btn @click="toggleDropdown(key)" outlined text>
                Provider: {{ key.split(',')[0] }}, Use Agreement: {{ key.split(',')[1] }}
              </v-btn>
            </v-card-title>
          </v-col>
          <v-col cols="2">
            <v-btn @click="navigateToRequestPage(key)" text>Request</v-btn>
          </v-col>
        </v-row>
        <v-expand-transition>
          <v-row v-if="artifactGroup.showDropdown" class="d-flex flex-column">
            <v-col v-for="([artifact_group_id, artifact_id], index) in artifactGroup.artifact_ids" :key="index" class="d-flex align-center">
              <v-card-subtitle class="py-0 my-0">Artifact ID: {{ artifact_id }}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-container>
    </v-card>
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
</template>

<script>
import { mapState } from 'vuex'
import { getCartGroupedByProviderCollection } from '@/helpers'

export default {
  name: 'Cart',

  data() {
    return {
      cartGroupedByProviderCollection: {},
    }
  },

  async mounted() {
    await this.$store.dispatch('user/fetchUser')
    this.cartGroupedByProviderCollection = getCartGroupedByProviderCollection(this.cart)
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
    }
  },
}
</script>
