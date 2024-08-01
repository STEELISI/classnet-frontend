<template>
  <div>
    <v-form ref="search" @submit.prevent="onSubmit">
      <v-text-field
        append-icon="mdi-magnify"
        label="Search"
        placeholder="Type search term..."
        v-model="search"
        loading="true"
        clearable
        class="rounded-0"
        hide-details
        @keydown="onChange"
        solo
        dense
      >
      </v-text-field>
      <v-expansion-panels v-model="adopen" multiple>
        <v-expansion-panel class="rounded-0">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-row no-gutters>
                <v-col cols="4">
                  Advanced
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open" key="0">
                      Select advanced filters for your query
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row align="center">

              <v-col cols="12">
                <v-select
                :items="providers"
                label="Provider"
                v-model = "organization"
                multiple
                dense
                ></v-select>
                
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="advanced.types"
                  :items="types"
                  label="Artifact types"
                  multiple
                  class="rounded-0"
                  hide-details
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            advanced.types.length > 0 ? 'indigo darken-4' : ''
                          "
                        >
                          {{ artifactTypeIcon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0">{{ item }}</span>
                    <span></span>
                    <span v-if="index === 1" class="grey--text caption">
                      (+{{ advanced.types.length - 1 }} others)
                    </span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-if="$auth.loggedIn && this.user_can_admin && this.user_is_admin"
                  label="Owner"
                  placeholder="Search for artifacts by owner name..."
                  v-model="owner"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-btn @click="onSubmit" class="primary mt-3">Search</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <br />
    <v-divider></v-divider>


    <v-container fluid>
      <v-card>
        <v-row class="align-center justify-space-between">
        <v-col cols="auto">
          <v-card-title>Categories</v-card-title>
        </v-col>
        <v-col cols="auto" class="d-flex align-center">
          <v-btn small text @click="setAll" class="clickable-text">Set All</v-btn>
          <v-btn small text @click="clearAll" class="clickable-text ml-2">Clear All</v-btn>
        </v-col>
      </v-row>
        <v-card-text>
      <v-row>

        <v-col v-for="(category, index) in categories.slice(0, 5)" :key="index" >
            <v-switch
              v-model="selectedCategories[index]"
              :label="category[0] + '(' + category[1] + ')'"
              color="success"
              @change="getArtifacts()"
              hide-details
            ></v-switch>
          </v-col>


      </v-row>
      <v-row>
          <!-- Display the remaining switches in the second row -->
          <v-col v-for="(category, index) in categories.slice(5)" :key="index">
            <v-switch
              v-model="selectedCategories[index + 5]"
              :label="category[0] + '(' + category[1] + ')'"
              color="success"
              @change="getArtifacts()"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
    </v-card-text>
    </v-card>

    </v-container>
    <ArtifactList
      :artifacts="artifacts"
      :limit="limit"
      v-bind:related="related"
    ></ArtifactList>
    <span v-if="total === 0 && search !== ''">{{
      searchMessage
    }}</span>
    <span v-if="!searchLoading && artifacts.total == 0 && search === ''"
      ><h3>Type a search term into the input above and press Enter</h3></span
    >
    <v-pagination
      v-if="artifacts"
      v-model="page"
      :length="pages"
      circle
    ></v-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import goTo from 'vuetify/es5/services/goto'
import { getCookie } from '~/helpers'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactList: () => import('@/components/ArtifactList')
  },
  props: {
    related: {
      type: Boolean,
      required: false
    },
    all: {
      type: Boolean,
      required: false
    }
  },
  head() {
    return {
      title: 'SEARCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {
      limit: 10,
      page: 1,
      search: '',
      author: '',
      owner: '',
      organization: '',
      searchMessage: '',
      searchInterval: null,
      submitted: false,
      adopen: [1],
      advanced: {
        types: ['presentation', 'publication', 'dag', 'argus', 'pcap',  'netflow', 'flowtools', 'flowride', 'fsdb', 'csv', 'custom'],
        author: '',
        org: '',
        badge_ids: []
      },
      types: [ 'dag', 'argus', 'pcap',  'netflow', 'flowtools', 'flowride', 'fsdb', 'csv', 'custom'],
      providers: [],
      filters: ['Name', 'Organization'],
      showScrollToTop: 0,
      panel: [],
      items: 5,
      categories: [],
      selectedCategories: [],
      isUpdatingPageInGetArtifacts: false
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    this.fetchProviders() 
    if (this.related) {
      this.$store.dispatch('artifacts/fetchRelatedArtifacts', this.artifact)
    } else if (this.$route.query.keywords) {
      this.search = this.$route.query.keywords
      console.log('keywords: ', this.search)
      this.onSubmit()
    } else if (this.$route.query.author_keywords) {
      this.author = this.$route.query.author_keywords
      console.log('author_keywords: ', this.author)
      this.onSubmit()
      this.adopen = [0]
    } else{
      this.search = this.search_init;
      this.onSubmit();
    }
    if (this.all) {
      this.advanced.types = this.types
    }
    this.$store.dispatch('user/fetchBadges')
  },
  computed: {
    ...mapState({
      badges: state => state.user.badges,
      artifacts: state => state.artifacts.artifacts.artifacts,
      artifact: state => state.artifacts.artifact.artifact,
      pages: state => state.artifacts.artifacts.pages,
      total: state => state.artifacts.artifacts.total,
      search_init: state => state.artifacts.search,
      searchLoading: state => state.artifacts.loading,
      user_is_admin: state => state.user.user_is_admin,
      user_can_admin: state => state.user.user_can_admin,
      search_keyword: state => state.system.search_keyword,
    }),
    allArtifacts() {
      return this.advanced.types.length === this.types.length
    },
    someArtifacts() {
      return this.advanced.types.length > 0 && !this.allArtifacts
    },
    artifactTypeIcon() {
      if (this.allArtifacts) return 'mdi-close-box'
      if (this.someArtifacts) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    allBadges() {
      return this.advanced.badge_ids.length === this.badges.length
    },
    someBadges() {
      return this.advanced.badge_ids.length > 0 && !this.allBadges
    },
    badgeIcon() {
      if (this.allBadges) return 'mdi-close-box'
      if (this.someBadges) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    advancedPlaceholder() {
      if (this.advanced.filter === 'Name') return 'First or Last name'
      if (this.advanced.filter === 'Organization') return 'Organization name'
    }
  },
  methods: {
    async onSubmit() {
      this.submitted = true
      if (this.searchInterval != null) clearTimeout(this.searchInterval)
      this.searchMessage = 'Searching...'
      this.$store.commit('artifacts/RESET_ARTIFACTS') // clear artifacts so the Searching... message is shown
      if (this.related && this.search.trim() === '') {
        this.$store.dispatch('artifacts/fetchRelatedArtifacts', this.artifact)
      } else {
        // We reset selectedCategories and categories only when we do onSubmit (getArtifacts could be called even after a keyword submission (page change, category filtering))
        this.selectedCategories = []
        this.categories = []
        this.getArtifacts()
      }
      this.searchInterval = setTimeout(() => {
        if (!this.searchLoading) {
          this.searchMessage = 'No results found'
        }
      }, 3000)
      this.submitted = false
    },
    setAll() {
      if(this.selectedCategories.every(element => element)){
        return; 
      }
      this.selectedCategories = this.selectedCategories.map(() => true);
      this.getArtifacts();
    },
    clearAll() {
      this.selectedCategories = this.selectedCategories.map(() => false);
      this.getArtifacts();
    },
    async getArtifacts(page = 1) {

      // By default the page is 1 since we want to show the first page of our new results
      // However we want topreserve page number when it is specifically clicked on
      if (page == 1) {
        this.isUpdatingPageInGetArtifacts = true
        this.page = page
        this.isUpdatingPageInGetArtifacts = false
      }

      // The code below is a copy of the artifacts/fetchArtifacts method but with an additional check to see if the search keyword has changed after the response
      this.$store.commit('artifacts/RESET_ARTIFACTS') // clear artifacts so the Searching... message is shown
      
      let getArtifactsKeyword = this.search
      let payload = {
        keywords: this.search,
        page: page,
        items_per_page: this.limit,
        type: this.advanced.types
      }

      this.author ? (payload['author'] = this.author) : false
      this.owner ? (payload['owner'] = this.owner) : false
      this.organization ? (payload['organization'] = this.organization) : false
      this.advanced.badge_ids ? (payload['badge_id'] = this.advanced.badge_ids) : false

      // If we already have retrieved categories then we can check the list of switches to see the selectedCategoryNames upon calling getArtifacts
      if (this.categories.length > 0) {
        const categoryNames = Object.values(this.categories).map(category => category[0]);
        const selectedCategoryNames = categoryNames.filter((category, index) => this.selectedCategories[index]);
        if (selectedCategoryNames.length == 0) {
          this.$store.commit('artifacts/RESET_ARTIFACTS')
          return
        }
        payload['category'] = selectedCategoryNames
      }

      this.$store.commit('artifacts/SET_LOADING', true)
      this.$store.commit('artifacts/SET_SEARCH', payload.keywords)
      let response = await this.$artifactSearchEndpoint.index({
        ...payload
      })

      // If categories is empty then we must populate it for the first time
      if (this.categories.length == 0) {
        let data = []
        for (let i in response.category_dict){
          data.push([i, response.category_dict [i].count])
        }
        this.categories = data
        this.selectedCategories = new Array(this.categories.length).fill(true);
      } 

      if (typeof response !== 'undefined') {
        // Only proceed if the keyword collected before artifactSearchEndpoint's call is the same as the current search keyword
        if (getArtifactsKeyword == this.search) {
          console.log("Setting artifacts", response.artifact_dict)

          this.$store.commit('artifacts/SET_ARTIFACTS', response.artifact_dict)
        }
      }
      this.$store.commit('artifacts/SET_LOADING', false)        
    },
    async fetchProviders() {
      let response = await this.$providerEndpoint.index()
      if(response === undefined || response.length == 0){
        this.providers = ['USC', 'MERIT', 'FRGP']
      }
      else{
        this.providers = response
      } 
    },
    onChange() {
      this.searchMessage = ''
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allArtifacts) {
          this.advanced.types = []
        } else {
          this.advanced.types = this.types.slice()
        }
      })
    },
    toggleBadges() {
      this.$nextTick(() => {
        if (this.allBadges) {
          this.advanced.badge_ids = []
        } else {
          this.advanced.badge_ids = this.badges.map(x => x.id)
        }
      })
    },
    scrollToTop() {
      goTo(0)
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY
    }
  },
  watch: {
    page(newPage, oldPage) {
       if (!this.isUpdatingPageInGetArtifacts) {
        this.getArtifacts(newPage);
      }
    },
    searchLoading(val) {
      if (val) {
        this.searchMessage = 'Searching...'
      } else if (this.search !== '') {
        if (this.searchInterval != null) clearTimeout(this.searchInterval)
        this.searchMessage = 'No results found'
      } else {
        this.searchMessage = ''
      }
    }
  }
}
</script>

<style scoped>
.v-application--is-ltr .v-input__prepend-outer {
  margin-right: 0px;
}
.v-text-field--outlined .v-input__prepend-outer,
.v-text-field--outlined .v-input__append-outer {
  margin-top: 4px;
}
#scrollbtn {
  position: fixed;
  bottom: 50px;
  right: 0px;
  scroll-margin-bottom: 5rem;
}
</style>
