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
        @keydown="onChange"
        @click:append="onSubmit"
        solo
        dense
        :rules="searchRegexRule"
        ref="searchField"
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
    <v-row align="center" class="py-1">
      <v-col cols="auto" class="d-flex align-center">
        <v-switch
          v-model="showGroups"
          label="Show Groups"
        ></v-switch>
      </v-col>

      <v-col cols="auto" class="d-flex align-center">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="primary"
              small
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>Show Groups will combine and display artifacts by their group . Switch off to view artifacts individually</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <div v-if="showGroups">
      <v-container fluid>
        <v-card v-for="(group, index) in groups" :key="index" class="mx-auto mt-2 mb-2 overflow-hidden" elevation="3" @click="selectGroup(index)">
          <v-container fluid>
            <v-row class="d-flex align-center justify-space-between">
              <v-col class="d-flex align-center" cols="12">
                <v-card-title class="align-start py-0 my-0">
                  <span class="headline custom-link">{{ capitalizeFirstLetter(group[0]) }} ({{ group[1] }})</span>
                </v-card-title>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <span v-if="groups.length === 0 && search !== ''">{{
        searchMessage
      }}</span>
      <span v-if="!searchLoading && artifacts.total == 0 && search === ''"
        ><h3>Type a search term into the input above and press Enter</h3></span
      >
      </v-container>
    </div>
    <div v-else>
      <v-container class="d-flex align-items-center">
        <span class="sort-by-label mr-3">Order by:</span>

        <div v-for="option in sortOptions" :key="option.key" class="sort-option mr-4 d-flex align-items-center">
          <span class="option-label">{{ option.label }}</span>
          <div class="arrows-container ml-2">
            <v-icon
            class="arrow up-arrow"
            :class="{ highlighted: isActive(option.key, 'asc') }"
            @click.stop="setSort(option.key, 'asc')"
            >
              mdi-arrow-up-thin
            </v-icon>
            <v-icon
            class="arrow down-arrow"
            :class="{ highlighted: isActive(option.key, 'desc') }"
            @click.stop="setSort(option.key, 'desc')"
            >
            mdi-arrow-down-thin
            </v-icon>
          </div>
        </div>
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
      selectedGroupNames: [],
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
      groups: [],
      showGroups:true,
      selectedGroups: [],
      isUpdatingPageInGetArtifacts: false,
      sortOptions: [
        { key: 'collection_date', label: 'Published Date' },
        { key: 'provider', label: 'Provider' },
        { key: 'rating', label: 'Average Rating' },
        { key: 'reviews', label: 'Reviews' },
      ],
      sortBy: 'default',
      sortOrder: '',
      currentSort: null,
      searchRegexRule:  [
        value => (value === '' || /^[a-zA-Z0-9][a-zA-Z0-9-_ ]*$/.test(value)) || 'Invalid input. Only letters, digits, dashes, underscores, and spaces are allowed, and it must start with a letter or digit.',
      ],
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
    } else if (this.$route.query) {
      this.search = this.$route.query.keywords || this.search
      this.organization = this.$route.query.organization || this.organization
      this.showGroups = this.$route.query.showGroups ? this.$route.query.showGroups!='0' : this.showGroups
      this.selectedGroupNames = this.$route.query.groupingId?.split(',') || this.selectedGroupNames
      this.advanced.types = this.$route.query.types?.split(',').slice() || this.advanced.types
      this.author = this.$route.query.author_keywords
      console.log('keywords: ', this.search, this.organization, this.selectedGroupNames, this.types, this.author)
      this.onSubmit()
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
    },
  },
  methods: {
    async onSubmit() {
      if(!this.$refs.searchField.validate()) {
        return
      }
      this.submitted = true
      if (this.searchInterval != null) clearTimeout(this.searchInterval)
      this.searchMessage = 'Searching...'
      this.$store.commit('artifacts/RESET_ARTIFACTS') // clear artifacts so the Searching... message is shown
      if (this.related && this.search.trim() === '') {
        this.$store.dispatch('artifacts/fetchRelatedArtifacts', this.artifact)
      } else {
        // We reset selectedGroups and groups only when we do onSubmit (getArtifacts could be called even after a keyword submission (page change, group filtering))
        this.selectedGroups = []
        this.groups = []
        this.getArtifacts()
      }
      this.searchInterval = setTimeout(() => {
        if (!this.searchLoading && this.artifacts.total === 0) {
          this.searchMessage = 'No results found'
        }
      }, 3000)
      this.submitted = false
    },

    setSort(key = 'default', order) {
      if (this.currentSort === key && this.sortOrder === order) {
        // Toggle off if the same sort is clicked again
        this.currentSort = null;
        this.sortOrder = null;
      } else {
        this.currentSort = key;
        this.sortOrder = order;
      }

      this.getArtifacts();
    },
    isActive(key, order) {
      return this.currentSort === key && this.sortOrder === order;
    },
    getSortIcon(sortKey) {
      if (this.sortBy === sortKey) {
        return this.sortOrder === 'asc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
      }
      return 'fas fa-sort';
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
        type: this.advanced.types,
        orderkey : this.currentSort,
        order:this.sortOrder
      }

      this.author ? (payload['author'] = this.author) : false
      this.owner ? (payload['owner'] = this.owner) : false
      this.organization ? (payload['organization'] = this.organization) : false
      this.advanced.badge_ids ? (payload['badge_id'] = this.advanced.badge_ids) : false

      // If we already have retrieved groups then we can check the list of switches to see the selectedGroupNames upon calling getArtifacts
      console.log(this.groups, this.selectedGroups)
      if (this.groups.length > 0) {
        const groupNames = Object.values(this.groups).map(group => group[0]);
        this.selectedGroupNames = groupNames.filter((group, index) => this.selectedGroups[index]);
        if (this.selectedGroupNames.length == 0) {
          this.$store.commit('artifacts/RESET_ARTIFACTS')
          return
        }
      }
      payload['groupingId'] = this.selectedGroupNames
      

      this.$store.commit('artifacts/SET_LOADING', true)
      this.$store.commit('artifacts/SET_SEARCH', payload.keywords)
      let response = await this.$artifactSearchEndpoint.index({
        ...payload
      })

      // If groups is empty then we must populate it for the first time
      if (this.groups.length == 0) {
        let data = []
        for (let i in response.groupingId_dict){
          if (i.trim()!=='') {
            data.push([i, response.groupingId_dict[i].count])
          }
        }
        // Sort the groups array by the group name (first element in each sub-array)
        data.sort((a, b) => a[0].localeCompare(b[0]))
        this.groups = data
        this.selectedGroups = new Array(this.groups.length).fill(true);
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
    selectGroup(index) {
      this.selectedGroups = new Array(this.groups.length).fill(false);
      this.selectedGroups[index] = true;
      this.showGroups = false;
      this.getArtifacts();
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
    },
    capitalizeFirstLetter(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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
.v-icon {
  margin: 0 !important;
  padding: 0 !important;
  vertical-align: middle;
}

.sort-option {
  display: flex;
  align-items: center;
}

.arrows-container {
  display: flex;
  align-items: center; /* Ensure icons are centered */
  justify-content: center;
  gap: 0px; 
}

.arrow {
  margin: 0;
  padding: 0;
}

.arrow + .arrow {
  margin-left: 0px;        /* Space between up and down arrows */
}

.arrow.highlighted {
  color: blue;            /* Highlight color */
}

/* Optional: Change color on hover */
.arrow:hover {
  color: darkblue;
}

</style>