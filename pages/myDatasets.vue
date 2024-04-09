<template>
    <span>
      <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
          <div class="text-center">
            <logo />
          </div>
        </v-flex>
      </v-layout>
      <v-layout column justify-left align-top>
      <h1>My Datasets</h1>
      <v-divider></v-divider>
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="12">
            <LazyHydrate when-visible>
              <material-card class="card-tabs" color="primary">
                <template v-slot:header>
                  <v-tabs
                    v-model="tabs"
                    background-color="transparent"
                    slider-color="white"
                    class="ml-4"
                  >
                    <v-tab>
                      <v-icon class="mr-2">
                        mdi-database-plus
                      </v-icon>
                      Requested
                    </v-tab>
                    <v-tab v-if="released_artifacts.length > 0">
                      <v-icon class="mr-2">
                        mdi-download
                      </v-icon>
                      Available
                    </v-tab>
                    <v-tab>
                      <v-icon class="mr-2">
                        mdi-heart
                      </v-icon>
                      Favorites
                    </v-tab>
                    <v-tab class="mr-3">
                      <v-icon class="mr-2">
                        mdi-star
                      </v-icon>
                      Ratings
                    </v-tab>
                    <v-tab class="mr-3" v-if="owned_artifacts.length > 0">
                      <v-icon class="mr-2">
                        mdi-database
                      </v-icon>
                      Owned Datasets
                    </v-tab>
  
                  </v-tabs>
  
                </template>
  
                <v-tabs-items v-model="tabs">
                  <v-tab-item>
                    <!-- requested -->
                    <v-list
                      single-line
                      class="py-0"
                      v-for="(item, i) in requested_artifacts"
                      v-if="requested_artifacts.length > 0"
                      :key="i"
                    >
                      <v-list-item>
                        <ArtifactChips
                          :field="[item.type]"
                          :type="item.type"
                        ></ArtifactChips>
                        <router-link :to="`/artifact/view/${item.artifact_group_id}`" class="custom-link"><v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title></router-link>
                        <div class="d-flex">
                          <v-tooltip top content-class="top">
                            <template v-slot:activator="{ attrs, on }">
                              <v-btn
                                class="v-btn--simple"
                                color="primary"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                :to="`/artifact/${item.artifact_group_id}`"
                                nuxt
                              >
                                <v-icon color="primary">
                                  mdi-arrow-top-right-thick
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Goto Artifact</span>
                          </v-tooltip>
                        </div>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                    <h3 v-if="requested_artifacts.length == 0">Search for individual artifacts under the Search Datasets tab and request access.</h3>
                  </v-tab-item>
                  <v-tab-item v-if="released_artifacts.length > 0">
                    <!-- available -->
                    <v-list
                      single-line
                      class="py-0"
                      v-for="(item, i) in released_artifacts"
                      :key="i"
                    >
                      <v-list-item>
                        <ArtifactChips
                          :field="[item.type]"
                          :type="item.type"
                        ></ArtifactChips>
                        <router-link :to="`/artifact/view/${item.artifact_group_id}`" class="custom-link"><v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title></router-link>
                        <div class="d-flex">
                          <v-tooltip top content-class="top">
                            <template v-slot:activator="{ attrs, on }">
                              <v-btn
                                class="v-btn--simple"
                                color="primary"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                :to="`/artifact/${item.artifact_group_id}`"
                                nuxt
                              >
                                <v-icon color="primary">
                                  mdi-arrow-top-right-thick
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Goto Artifact</span>
                          </v-tooltip>
                        </div>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </v-tab-item>
                  <v-tab-item>
                    <!-- favorites -->
                    <v-list
                      single-line
                      class="py-0"
                      v-for="(item, i) in dashboard.favorite_artifacts"
                      :key="i"
                    >
                      <v-list-item>
                        <ArtifactChips
                          :field="[item.type]"
                          :type="item.type"
                        ></ArtifactChips>
                        <router-link :to="`/artifact/view/${item.artifact_group_id}`" class="custom-link"><v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title></router-link>
                        <div class="d-flex">
                          <v-tooltip top content-class="top">
                            <template v-slot:activator="{ attrs, on }">
                              <v-btn
                                class="v-btn--simple"
                                color="primary"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                :to="`/artifact/${item.artifact_group_id}`"
                                nuxt
                              >
                                <v-icon color="primary">
                                  mdi-arrow-top-right-thick
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Goto Artifact</span>
                          </v-tooltip>
                        </div>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </v-tab-item>
                  <v-tab-item>
                    <!-- ratings -->
                    <v-list
                      single-line
                      class="py-0"
                      v-for="(item, i) in dashboard.given_ratings"
                      :key="i"
                    >
                      <v-list-item>
                        <ArtifactChips
                          :field="[item.type]"
                          :type="item.type"
                        ></ArtifactChips>
  
                        <router-link :to="`/artifact/view/${item.artifact_group_id}`" class="custom-link"><v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title></router-link>
  
                        <div class="d-flex">
                          <v-tooltip top content-class="top">
                            <template v-slot:activator="{ attrs, on }">
                              <v-chip
                                color="amber"
                                class="ma-2"
                                label
                                :to="`/artifact/review/${item.artifact_group_id}`"
                                nuxt
                              >
                                <v-avatar left>
                                  <v-icon> mdi-star </v-icon>
                                </v-avatar>
                                <div>{{ item.rating }}</div>
                              </v-chip>
                            </template>
                            <span>Goto Rating</span>
                          </v-tooltip>
                        </div>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </v-tab-item>
                  <v-tab-item v-if="owned_artifacts.length > 0">
                    <!-- artifacts -->
                    <v-timeline align-top dense v-if="dashboard.owned_artifacts">
                      <v-timeline-item
                        v-for="item in sortedArtifacts"
                        :key="item.id"
                        :color="iconColor(item.type)"
                        :icon="iconImage(item.type)"
                        small
                      >
                        <div>
                          <div class="font-weight-normal">
                            <router-link :to="`/artifact/view/${item.artifact_group_id}`" class="custom-link"> <strong>{{ new Date(item.ctime) }}</strong></router-link>
                          </div>
                          <div>
                            {{ item.title }}
                            <v-btn
                              class="v-btn--simple"
                              color="primary"
                              icon
                              :to="`/artifact/${item.artifact_group_id}/${item.id}`"
                              nuxt
                            >
                              <v-icon color="primary">
                                mdi-arrow-top-right-thick
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-tab-item>
                </v-tabs-items>
              </material-card>
            </LazyHydrate>
          </v-col>
        </v-row>
      </v-container>
    </v-layout>
    </span>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  import { artifactIcon, artifactColor, isReleased } from '@/helpers'
  import $RefParser from 'json-schema-ref-parser'
  import schemaWithPointers from '~/schema/affiliation.json'
  
  export default {
    components: {
      Logo: () => import('@/components/Logo'),
      LazyHydrate: () => import('vue-lazy-hydration'),
      ArtifactChips: () => import('@/components/ArtifactChips')
    },
    head() {
      return {
        title: 'SEARCCH User Datasets',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'SEARCCH User Datasets'
          }
        ]
      }
    },
    data() {
      return {
        // TODO: FIXME get dynamically from backend once there are enough entries

        tabs: 0,
        dashboard: {},
        localuser: null,
        schema: {},
        schemaLoaded: false,
        requested_artifacts: [],
        released_artifacts: [],
        owned_artifacts:[],
      }
    },
    computed: {
      ...mapState({
        user: state => state.user.user,
        userid: state => state.user.userid,
      }),

      types: function() {
        if (this.schemaLoaded) {
          return this.schema.properties.type.enum
        } else return []
      },
      sortedArtifacts: function() {
        if (typeof this.dashboard.owned_artifacts !== 'undefined') {
          return this.dashboard.owned_artifacts.sort(function(a, b) {
            // reverse sort order
            if (a.ctime < b.ctime) return 1
            if (a.ctime > b.ctime) return -1
            return 0
          })
        } else return []
      }
    },
    async mounted() {
      this.$store.dispatch('user/fetchUser')
      this.localuser = JSON.parse(JSON.stringify(this.user))
      let response = await this.$dashboardEndpoint.index()
      this.dashboard = response
      this.owned_artifacts = this.dashboard.owned_artifacts
      for (let index in this.dashboard.requested_artifacts) {
        let requested_artifact = this.dashboard.requested_artifacts[index]
  
        let status = await this.$artifactRequestStatusEndpoint.show(requested_artifact.artifact_group_id)
  
        if (status && isReleased(status.ticket_status)) {
          this.released_artifacts.push(requested_artifact)
        }
        if (status && status.ticket_status != "unrequested" && !isReleased(status.ticket_status)) {
          this.requested_artifacts.push(requested_artifact)
        }
      }
    },
    created() {
      $RefParser.dereference(schemaWithPointers, (err, schema) => {
        if (err) {
          console.error(err)
        } else {
          // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
          // including referenced files, combined into a single object
          this.schema = schema
          this.schemaLoaded = true
        }
      })
    },
    methods: {
      iconColor(type) {
        return artifactColor(type)
      },
      iconImage(type) {
        return artifactIcon(type)
      },
    }
  }
  </script>
  
  <style scoped>
  .custom-link {
    text-decoration: none; /* Remove underline */
    color: #000000; /* Customize hyperlink color */
  }
  </style>
  