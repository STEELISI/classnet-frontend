<template>
  <v-container>
    <v-row align="center">
        <v-col cols="3">
          <h3>Total requests: {{ num_requests }}</h3>
        </v-col>
        <v-col cols="3">
          <h3>Total reviews: {{ num_reviews }}</h3>
        </v-col>
        <v-col cols="3">
          <h3>Total ratings: {{ num_ratings }}</h3>
        </v-col>
    </v-row>
    <br>
    <h3>Dataset Categories</h3>
    <br>
    <v-card>
      
      <v-data-table
        :headers="categoryHeaders"
        :items="categories"
        :sort-by="['count']" 
        :sort-desc="[true]"
      >
        <template v-slot:items="props">
          <td>{{ props.item.category }}</td>
          <td>{{ props.item.count }}</td>
        </template>
      </v-data-table>
    </v-card>  
    <br>
    <h3>Dataset Providers</h3>
    <br>
    <v-card>
     
      <v-data-table
        :headers="providerHeaders"
        :items="providers"
        :sort-by="['count']" 
        :sort-desc="[true]"
      >
        <template v-slot:items="props">
          <td>{{ props.item.provider }}</td>
          <td>{{ props.item.count }}</td>
        </template>
      </v-data-table>
    </v-card>  
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      categoryHeaders: [
        { text: 'Category', value: 'category' },
        { text: 'Count', value: 'count' },
      ],
      categories: [],
      providerHeaders: [
        { text: 'Provider', value: 'provider' },
        { text: 'Count', value: 'count' },
      ],
      providers: [],
      num_requests: 0,
      num_reviews: 0,
      num_ratings: 0
    };
  },
  async mounted() {
    // Load data from the JSON file when the component is created
    if (this.user_is_admin) {
      let response = await this.$adminStatisticsEndpoint.index([])
      this.num_ratings = response.num_ratings
      this.num_requests = response.num_requests
      this.num_reviews = response.num_reviews
      
      this.categories = Object.keys(response.category_count).map(category => ({
            category,
            count: response.category_count[category],
      }));
      this.providers = Object.keys(response.provider_count).map(provider => ({
            provider,
            count: response.provider_count[provider],
      }));
      this.num_ratings = response.num_ratings
      this.num_requests = response.num_requests
      this.num_reviews = response.num_reviews
  }
  },
  computed: {
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
    })
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      console.log('watch updateUsers')
    },
  },
  methods: {
    
  },
};
</script>
