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
                    <v-tab class="mr-3">
                      <v-icon class="mr-2">
                        mdi-star
                      </v-icon>
                      Ratings
                    </v-tab>
                    <v-tab class="mr-3" v-if="contributed_artifacts.length > 0">
                      <v-icon class="mr-2">
                        mdi-database
                      </v-icon>
                      Contributed Datasets
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
                          <v-btn color="secondary" @click="setModal(item.agreement_file)">
                            View Signed DUA
                          </v-btn>
                          <transition name="modal-fade">
                            <DUAReviewModal
                              v-show="isModal"
                              @close="closeModal"
                              @submitRequest="closeModal"
                              v-bind:duaHTML="duaHTML"
                              :isViewOnly=true>
                            </DUAReviewModal>
                          </transition>
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
                          <v-btn color="secondary" @click="setModal(item.agreement_file)">
                            View Signed DUA
                          </v-btn>
                          <transition name="modal-fade">
                            <DUAReviewModal
                              v-show="isModal"
                              @close="closeModal"
                              @submitRequest="closeModal"
                              v-bind:duaHTML="duaHTML"
                              :isViewOnly=true>
                            </DUAReviewModal>
                          </transition>
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
                  <v-tab-item v-if="contributed_artifacts.length > 0">
                    <!-- artifacts -->
                    <v-card class="mb-4">
                      <v-card-title>Released Artifacts Overview</v-card-title>
                      <v-card-text>
                        <div>Total Number of Released Artifacts: <strong>{{ dashboard.released_artifacts_overview.total_number_released }}</strong></div>
                        <div>Total Number of Users Released To: <strong>{{ dashboard.released_artifacts_overview.total_number_users_released_to }}</strong></div>
                        
                        <div class="mt-4">
                          <v-data-table
                            :headers="headers"
                            :items="formattedUsers"
                            item-value="name"
                            class="elevation-1"
                          >
                            <template v-slot:top>
                              <v-toolbar flat>
                                <v-toolbar-title>Users Released To</v-toolbar-title>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.organizations="{ item }">
                              <v-chip
                                v-for="(org, index) in item.organizations"
                                :key="index"
                                class="mr-1"
                                color="primary"
                              >
                                {{ org }}
                              </v-chip>
                            </template>
                          </v-data-table>
                        </div>
                      </v-card-text>
                    </v-card>

                    <v-timeline align-top dense v-if="dashboard.contributed_artifacts">
                      <div class="d-flex justify-end mb-2">
                        <v-btn class="v-btn--simple mr-4" color="primary" :href="embedLink" target="_blank">
                          <v-icon left>mdi-open-in-new</v-icon> Visit Embed Link
                        </v-btn>
                        <v-btn class="v-btn--simple" color="success" @click="copyEmbedLink">
                          <v-icon left>mdi-content-copy</v-icon> Copy Embed Link
                        </v-btn>
                      </div>
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

                            <v-btn
                              class="v-btn--simple"
                              color="secondary"
                              icon
                              :to="`/contributeDatasets?isEdit=true&artifactId=${item.id}`"
                            >
                              <v-icon color="secondary">
                                mdi-pencil
                              </v-icon>
                            </v-btn>
                          </div>
                           <!-- Dropdown for revealing artifact.users -->
                          <v-expansion-panels focusable>
                            <v-expansion-panel>
                              <v-expansion-panel-header>
                                Show Users Released To
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list dense>
                                  <v-list-item v-for="(user, index) in item.users" :key="index">
                                    <v-list-item-content>
                                      <v-list-item-title>{{ user }}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
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
      ArtifactChips: () => import('@/components/ArtifactChips'),
      DUAReviewModal: () => import('@/components/DUAReviewModal')
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
        contributed_artifacts:[],
        isModal: false,
        duaHTML: "",
        embedLink: "",
        headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Position', value: 'position' },
        { text: 'Organizations', value: 'organizations' }
        ],
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
        if (typeof this.dashboard.contributed_artifacts !== 'undefined') {
          return this.dashboard.contributed_artifacts.sort(function(a, b) {
            // reverse sort order
            if (a.ctime < b.ctime) return 1
            if (a.ctime > b.ctime) return -1
            return 0
          })
        } else return []
      },
      formattedUsers() {
        return Object.entries(this.dashboard.released_artifacts_overview.users_released_to).map(([name, details]) => ({
          name,
          email: details.requester_email,
          position: details.requester_position,
          organizations: details.requester_organizations,
        }));
      },
    },
    async mounted() {
      this.$store.dispatch('user/fetchUser')
      this.localuser = JSON.parse(JSON.stringify(this.user))
      let response = await this.$dashboardEndpoint.index()
      this.dashboard = response
      this.embedLink = `${window.location.origin}/search?contributor_id=${this.dashboard.contributor_id}`;
      this.contributed_artifacts = this.dashboard.contributed_artifacts
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
      setModal(duaData){
        this.isModal = true
        // 1. atob(b64) - Decodes base64 string to binary
        // 2. Uint8Array.from(..., c => c.charCodeAt(0)) - Converts binary to UTF-8 byte array
        // 3. TextDecoder().decode() - Converts UTF-8 bytes to proper Unicode string
        this.duaHTML = new TextDecoder().decode(Uint8Array.from(atob(duaData), c => c.charCodeAt(0)));
      },
      closeModal(){
        this.isModal = false
      },
      copyEmbedLink() {
        navigator.clipboard.writeText(this.embedLink)
      }
    }
  }
  </script>
  
  <style scoped>
  .custom-link {
    text-decoration: none; /* Remove underline */
    color: #000000; /* Customize hyperlink color */
  }
  </style>
  