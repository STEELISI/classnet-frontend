<template>
  <v-layout column justify-left align-top>
    <v-container fill-height fluid>
      <v-row justify="center">
        <v-col cols="12" md="4" v-if="localuser">
          <LazyHydrate never>
            <material-card class="v-card-profile">
              <v-avatar
                slot="offset"
                class="mx-auto d-block elevation-6"
                size="130"
              >
                <v-img :src="profileImage(localuser.email)"></v-img>
              </v-avatar>
              <v-card-text class="text-center">
                <h6 class="overline mb-3">
                  {{ localuser.name }}
                </h6>
                <h6
                  class="overline mb-3"
                  v-if="userAffiliation"
                  v-for="affil in userAffiliation"
                >
                  <div v-if="affil.org">{{ affil.org.name }}</div>
                </h6>

                <p class="font-weight-light">
                  {{ userEmail }}
                  <v-icon v-if="(userEmail == localuser.email) && localuser.emailAuthenticated && !userUpdateIncomplete" class="font-weight-light" style="color: green;">
                  mdi-checkbox-marked-circle
                </v-icon>
                </p>

              </v-card-text>
            </material-card>
          </LazyHydrate>
        </v-col>

        <v-col cols="12" md="8">
          <material-card
            color="primary"
            title="Edit Profile"
            text="Complete your profile"
          >
            <v-form>
              <v-container class="py-0">
                <v-row v-if="localuser">
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Name"
                      class="primary-input"
                      v-model="localuser.name"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Email Address"
                      class="primary-input"
                      v-model="userEmail"
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      label="Website"
                      class="primary-input"
                      v-model="localuser.website"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-combobox
                      v-if="localuser"
                      label="Interests"
                      multiple
                      small-chips
                      deletable-chips
                      persistent-hint
                      :items="hardcodedInterests"
                      v-model="researchInterests"
                      hint="Select applicable items from the list or type in your own"
                      :search-input.sync="interestSearch"
                      return-object
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{
                                interestSearch
                              }}</strong
                              >". Press <kbd>tab</kbd> to create a new one item.
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-combobox
                      label="Affiliation"
                      multiple
                      small-chips
                      deletable-chips
                      persistent-hint
                      :items="orgNames"
                      v-model="userAffiliation"
                      hint="Select applicable organization from the list or type in your own"
                      :search-input.sync="orgSearch"
                      item-text="org.name"
                      item-value="org.name"
                      return-object
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{
                                orgSearch
                              }}</strong
                              >". Press <kbd>tab</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-text-field
                      label="Position"
                      class="primary-input"
                      v-model="localuser.position"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                    auto-grow
                      label="SSH Public Key"
                      class="primary-input"
                      v-model="localuser.publicKey"
                    />
                  </v-col>
                  <v-col cols="12" class="text-right">
                    <v-btn color="success" @click="updateProfile">
                      Update Profile
                    </v-btn>
                  </v-col>
                  <v-col cols="12" v-if="profileCardMessage">
                    <span style="color:red">{{profileCardMessage}}</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </material-card>
        </v-col>
      </v-row>
    </v-container>

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
    <v-dialog persistent
    v-model="otpSentDialog"
    width="300"
    >
      <v-card>
        <v-card-text>
          <div style="padding-top: 20px; font-weight: bold;">
            <p>A One-time password will be sent to your new email for verification.</p>
          </div>
          <v-form>
            <v-container class="py-0">
              <v-row v-if="localuser">
                <v-col cols="12" md="12">
                  <v-text-field
                    label="Email Address"
                    class="primary-input"
                    v-model="userEmail"
                  />
                </v-col>

                <v-col cols="12" md="4" v-if="otpSent">
                  <v-text-field
                    label="OTP"
                    class="primary-input"
                    v-model="localuser.userOTP"
                  />
                </v-col>
                <v-col cols="12" v-if="dialogMessage">
                    <span style="color:red">{{dialogMessage}}</span>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block  @click="updateProfile">{{dialogBtnMessage}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { artifactIcon, artifactColor, isReleased } from '@/helpers'
import $RefParser from 'json-schema-ref-parser'
import schemaWithPointers from '~/schema/affiliation.json'

export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration'),
    ArtifactChips: () => import('@/components/ArtifactChips')
  },
  head() {
    return {
      title: 'SEARCCH User Profile',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH User Profile'
        }
      ]
    }
  },
  data() {
    return {
      // TODO: FIXME get dynamically from backend once there are enough entries
      hardcodedInterests: [
        'Application Security',
        'Artificial Intelligence',
        'Biometrics',
        'Cloud Computing',
        'Cybersecurity',
        'Data Security',
        'Human-based Behavior',
        'Internet of Things',
        'Machine Learning',
        'Mobile',
        'Organizational Security Management',
        'Policy',
        'Privacy',
        'Secure Development',
        'Software Development',
        'Testbeds'
      ],
      tabs: 0,
      dashboard: {},
      // owned_artifacts: [],
      schema: {},
      schemaLoaded: false,
      userAffiliation: [],
      orgSearch: null,
      interestSearch: null,
      localuser: null,
      userPosition:null,
      userEmail:'',
      requested_artifacts: [],
      released_artifacts: [],
      owned_artifacts:[],
      dialogMessage: '',
      dialogBtnMessage:'',
      profileCardMessage:'',
      otpSent: false,
      otpSentDialog: false,
      publicKey: '',
      userUpdateIncomplete: false,
      emailOnPageLoad: '',
      publicKeyPatternRegex: /^(ssh-(ed25519|rsa|dss|ecdsa)) AAAA(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})( [^@]+@[^@]+)?$/
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      organization: state => state.user.organization,
      userid: state => state.user.userid,
      orgs: state => state.user.orgs,
      interests: state => state.user.interests,
      authUser: state => state.auth.user,
      position: state => state.user.user.position,
      publicKey: state => state.user.publicKey
    }),
    orgNames: {
      get: function() {
        return this.orgs ? this.orgs.map(m => m.name) : []
      }
    },
    researchInterests: {
      get: function() {
        return this.localuser.research_interests
          ? this.localuser.research_interests.split(',')
          : ''
      },
      set: function(newValue) {
        this.localuser.research_interests = newValue.join(',')
      }
    },
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
  watch: {
    userAffiliation(newValue, oldValue) {
      if(! this.$auth.loggedIn){
        return
      }
      // delete case
      let diff = oldValue.filter(
        affil => newValue.findIndex(newAffil => newAffil.id == affil.id) == -1
      )
      if (diff.length > 0) {
        diff.forEach(affil => {
          if (typeof affil === 'object') {
            // cannot use await here as this is inside a foreach loop
            this.$userAffiliationEndpoint.delete(affil.id)
          }
        })
        diff = []
      }
    },
    organization(val) {
      this.userAffiliation = val
    },
    user(val) {
      this.localuser = JSON.parse(JSON.stringify(val))
      if (!this.localuser.emailAuthenticated) {
        if (!this.otpSent) {
          this.dialogBtnMessage = 'Verify Email'
        }
        this.otpSentDialog = true
      }
    },
    userPosition(val){
      this.userPosition = val
    },
    userPublicKey(val){
      this.publicKey = val
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.$store.dispatch('user/fetchOrgs')
    this.$store.dispatch('user/fetchInterests')
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

    this.userAffiliation = this.organization ? this.organization : []
    this.userEmail = this.localuser.email
    this.userPosition = this.position
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
    validatePublicKey() {
      var match = this.localuser.publicKey.match(this.publicKeyPatternRegex)
      return match && this.localuser.publicKey === match[0];
    },
    async updateProfile() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        this.dialogMessage = ''
        this.dialogBtnMessage = 'Submit'
        this.profileCardMessage = ''

        // Validate the format of the SSH public key before proceeding
        let isValidPublicKey = this.validatePublicKey()
        if (!isValidPublicKey) {
          console.log("Invalid format for the submitted SSH public key.");
          this.profileCardMessage = 'Invalid format for the submitted SSH public key.'
          return
        }
        
        this.userUpdateIncomplete = true
        this.localuser.email = this.userEmail
        if (this.otpSent) {
          if ((this.localuser.userOTP && this.localuser.userOTP.length == 0) || (this.localuser.userOTP == undefined)) { // This is to handle the case where a user sends an empty OTP
            this.localuser.userOTP = 'undefined'
          }
        }
        await this.$userEndpoint.update(this.userid, this.localuser).then(response => {
          if(response.action){
            if (response.action == "OTP_SENT" || response.action == "OTP_INVALID") {
              this.localuser.userOTP = ''
              this.otpSentDialog = true
              this.dialogMessage = response.message
              if (response.action == "OTP_SENT") {
                this.otpSent = true
              }
              else if (response.action == "OTP_INVALID") {
                this.otpSent = false
                this.dialogBtnMessage = 'Verify Email'
              }
            }
            else {
              this.otpSentDialog = false
              this.profileCardMessage = response.message
            }
            return
          } else {
            this.otpSent = false
            this.otpSentDialog = false
          }
          this.userUpdateIncomplete = false
        })

        // create any affiliations that were added
        this.userAffiliation.forEach((affil, index, object) => {
          if (typeof affil === 'string') {
            this.$store.dispatch('user/createAffiliation', affil)
            object.splice(index, 0)
          }
        })

        this.$store.dispatch('user/fetchUser')
      }
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    profileImage(email) {
      if (typeof this.authUser !== 'undefined') {
        if (typeof this.authUser.avatar_url !== 'undefined'
            && this.authUser.avatar_url.length > 0) {
          return this.authUser.avatar_url + '&size=130'
        }
      }
      var md5 = require('md5')
      const url =
        'https://www.gravatar.com/avatar/' +
        md5(email.toLowerCase().trim()) +
        '?size=130'
      return url
    },
    async fetchGravatar(email) {
      let image = await this.$axios.get(
        '/avatar/' + this.gravatarImage(this.user.email).split('/')[4]
      )
      return Buffer.from(encodeURI(image.data), 'base64')
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
