<template>

  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
      </div>
      <v-carousel
    cycle
    height="auto"
    hide-delimiter-background
    show-arrows-on-hover
  >
      <v-carousel-item>
        <v-card color="#eef2bf">
          <v-card-title class="primary white--text">
            ANT Censuses of the Internet Address Space
          </v-card-title>
        <v-card-text class ="body-1" >
          <br />
          <v-row>
            <v-col cols = "8">
              <p><b>
              Starting in 2003, researchers at ISI have been collecting data about the Internet address space.
           As part of this work we have been probing all addresses in the allocated Internet address space.
            This web page summarizes this research, the datasets, and related papers.
             We also have a plot of the entire internet at scale (one dot is one address), an interactive,
              browsable map (details), and video description, and (new Jan. 2015) an animation showing 8 years of Internet censuses.
            </b></p>
            <v-btn
            depressed
            color="primary"
            href = "/search?keywords=census"
            >
      Link to dataset
    </v-btn>
              </v-col>
            <v-col cols="4">

              <v-img src="https://ant.isi.edu/address/it.37.all.16-subnet_stats.3px-per-point.annotated.png"
              height="300"
              width="300"></v-img>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>

        </v-card-actions>

        </v-card>
      </v-carousel-item>
      <v-carousel-item>
        <v-card color="#eef2bf">
          <v-card-title class="primary white--text">
            Distributed Denial-of-Service (DDoS) attacks Datasets
          </v-card-title>
        <v-card-text class ="body-1" >
          <br />
          <v-row>
            <v-col cols = "8">
              <p><b>
                Distributed Denial-of-Service (DDoS) attacks exhaust resources, leaving a server unavailable to legitimate clients.
                The Domain Name System (DNS) is a frequent target of DDoS attacks. Since DNS is a critical infrastructure service,
                protecting it from DoS is imperative. Many prior approaches have focused on specific filters or anti-spoofing
                techniques to protect generic services. DNS root nameservers are more challenging to protect, since they use
                fixed IP addresses, serve very diverse clients and requests, receive predominantly UDP traffic that can be spoofed,
                and must guarantee high quality of service.
                We show that this layered defense approach provides exceptional protection against all attack types using traces of ten real attacks from a DNS root nameserver.
                Our automated system can select the best defense within seconds and quickly reduces traffic to the server within a manageable range, while keeping collateral damage lower than 2%.


            </b></p>
            <v-btn
            depressed
            color="primary"
            to = "/search?keywords=ddidd"
            >
      Link to dataset
    </v-btn>
              </v-col>
            <v-col cols="4">

              <v-img src="https://steel.isi.edu/ddidd.jpg"
              height="300"
              width="300"></v-img>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>

        </v-card-actions>

        </v-card>
      </v-carousel-item>

  </v-carousel>
  <br/>
      <LazyHydrate never>

        <div>
          <v-card>
            <v-card-title class="primary white--text">
              COMUNDA is a collaborative, community-driven platform for network dataset sharing and reuse.
            </v-card-title>
            <v-card-text>
              <br />

              <div class="text-center">
                <v-row>
                <v-card
    class="mx-auto"
     href ="/search"
    flat color="transparent"
  >
    <v-card-text>

       <v-avatar color="indigo" size="150">
      <v-icon dark size = "120">
       mdi-cloud-search
      </v-icon>
    </v-avatar>
      <p class ="font-weight-bold subtitle-1">
	      Search Datasets</p>
    </v-card-text>

      </v-card>
            <v-divider
           inset vertical
></v-divider>
            <v-card
    class="mx-auto"
    href="https://steelisi.github.io/CLASSNET-DOCS/dataset/"
    flat color="transparent"
  >
    <v-card-text>

       <v-avatar color="orange" size="150">
      <v-icon dark size = "120">
       mdi-comment-account
      </v-icon>
    </v-avatar>
      <p class ="font-weight-bold subtitle-1">
	     Rate and comment on existing datasets</p>
    </v-card-text>

      </v-card>
            <v-divider
           inset vertical
></v-divider>
        <v-card
    class="mx-auto"
    href = "/addLabels"
    flat color="transparent"
  >
    <v-card-text>

       <v-avatar color="teal" size="150">
      <v-icon dark size = "120">
       mdi-label-multiple
      </v-icon>
    </v-avatar>
      <p class ="font-weight-bold subtitle-1">
	      Contribute Labels to Existing Datasets</p>
    </v-card-text>

      </v-card>


            <v-divider
           inset vertical
></v-divider>
        <v-card
    class="mx-auto"
    href = "https://steelisi.github.io/CLASSNET-DOCS/contribute/"
    flat color="transparent"
  >
    <v-card-text>

       <v-avatar color="blue" size="150">
      <v-icon dark size = "120">
       mdi-database-import
      </v-icon>
    </v-avatar>
      <p class ="font-weight-bold subtitle-1">
	      Contribute datasets to COMUNDA</p>
    </v-card-text>

      </v-card>

        </v-row>
              </div>

            </v-card-text>
            </v-card>
            <br/><br/>
          <v-card>
            <v-card-title class="primary white--text">
              Welcome to the COMUNDA Portal
            </v-card-title>
            <v-card-text>
              <br />
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-network</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <p class ="body-1"><b>
	      COMUNDA is a collaborative, community-driven platform for
              network dataset sharing and reuse. Datasets can be contributed
              by anyone in the community, and approval process is streamlined to
	      include the dataset provider. Datasets can reside on COMUNDA or at
	      the provider's machines. Datasets can be offered for download, or
                    for access on the provider's machines.</b>
	                </p>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-forum</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <p class ="body-1">
              In later stages of the project, COMUNDA will support discussions around
              dataset records, and it will support collaborative labeling of ground truth.
	      COMUNDA will also support researchers' sharing their code, which does dataset
	      cleaning, processing and interpretation.
            </p>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-lan</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <p class ="body-1">
	     COMUNDA also facilitates community-building around these datasets. It
              allows data providers to share the metadata of their datasets with
              the community, and it allows researchers to share their experience with different datasets.
            </p>
                </v-list-item-content>
              </v-list-item>
            </v-list>
	     <p class ="body-1">
              For more information on COMUNDA, check out the
              <a href="https://ant.isi.edu/classnet/" target="_blank" rel="noopener">
                project homepage.
              </a>
	      </p> <p class ="body-1">
              To get started click CONTINUE.
              </p>
              <v-row align="center">
                <v-col cols="12" sm="1" align="right">
                  <v-img
                    src="/images/nsf.png"
                    alt="NSF Logo"
                    width="50"
                  ></v-img>
                </v-col>
                <v-col align="left">
		<em class ="body-1">
                  COMUNDA is supported by the National Science Foundation
                  (NSF) under grant number 8115780 and 1823192.
                  </em>
                </v-col>
              </v-row>

            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" nuxt to="/search">
                Continue
              </v-btn>
            </v-card-actions> </v-card><br />


	    <br/>

	    <br/>
	    </div>

      </LazyHydrate>
  <br />
  <v-card>
        <v-card-title class="primary white--text">
              Supporters
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-handshake</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <p class ="body-1">The COMUNDA portal is community infrastructure supported by the National Science Foundation's CCRI program. Visit the <a href ="https://www.ccrivo.org">CCRI-VO website</a>
                   to discover other infrastructure supported by the CCRI program.</p>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <br/>

    </v-flex>
    <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
      </template>
      <v-card>
        <v-card-title>
          Enter Affiliation, Designation and Phone Number
        </v-card-title>
        <v-col cols="12" >
          <v-text-field
            label="Name*"
            required
            v-model ="userName"
          ></v-text-field>
        </v-col>
        <v-col cols="12" >
          <v-text-field
            label="Institutional Email* | Verify with a One-time password (OTP)"
            required
            v-model ="userEmail"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="otpSent">
          <v-text-field
            label="OTP"
            v-model ="userOTP"
          ></v-text-field>
        </v-col>
        <v-col cols="12" >
          <v-text-field
            label="Position*"
            required
            v-model ="userPosition"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-combobox
            label="Affiliation*"
            multiple
            small-chips
            deletable-chips
            persistent-hint
            :items="orgNames"
            v-model="userAffiliation"
            hint="Type your affiliation name and hit tab to enter (you can also select if present in the dropdown)"
            :search-input.sync="orgSearch"
            item-text="org.name"
            item-value="org.name"
            :menu-props="menuProps"
            @update:search-input="onAffiliationInput"
            return-object
            required
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{
                      orgSearch
                    }}</strong>". Press <kbd>tab</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
        <v-row class="pl-3">
        <v-col md = "2">
          <v-text-field
            v-model="userCountryCode"
            label="Country Code"
            type="number"
            prefix="+"
            hint="Enter country code"
            min = "1"
            required
          ></v-text-field>
        </v-col>
        <v-col md="6" >
          <v-text-field
            v-model="userMobileNumber"
            type="text"
            hint="Enter researcher phone number"
            required
            min = "1"
            >
            <template #label>
                <span>Phone Number<span style='color: red;'> *</span></span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
        <v-col cols="12" v-if="dialogMessage">
          <span style="color:red">{{dialogMessage}}</span>
        </v-col>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="logout()">Logout</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="addFields"
          >
          {{submitMessage}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
      return {
        dialog: false,
        localuser:'',
        userAffiliation:[],
        userPosition:'',
        userName:'',
        userEmail:'',
        userOTP:'',
        userCountryCode:'',
        userMobileNumber:'',
        orgSearch: null,
        otpSent: false,
        model: 0,
        dialogMessage: '',
        submitMessage:'Verify Email',
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
        countryCodePattern: /\d+/g,
        mobileNumberPattern: /\(?\d{1,3}\)?[- ]?\d{3}[- ]?\d{4}$/g,
        menuProps: {
        value: false, // Initially hide the menu
        }
      }
    },
  components: {
    Logo: () => import('@/components/Logo'),
    LazyHydrate: () => import('vue-lazy-hydration'),
    Supporters: () => import('@/components/Supporters')
  },
  computed:{
    ...mapState({
      user: state => state.user,
      person:state =>state.user.user,
      organization: state => state.user.organization,
      userid: state => state.user.userid,
      orgs: state => state.user.orgs,
    }),
    orgNames: {
      get: function() {
        console.log("from here",this.orgs.map(m => m.name))
        return this.orgs ? this.orgs.map(m => m.name) : []
      }
    },
  },
  watch:{
    person(val) {
      this.localuser = JSON.parse(JSON.stringify(val))
    },
    organization(val) {
      this.userAffiliation = val
    },
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
    userEmail(val) {
      console.log(val)
      if(this.localuser.email && this.localuser.email == val) { // If a user's email is already stored in the backend we do not need to verify it, thus we change the submitMessage from 'Verify email' to 'Submit'
          this.submitMessage = 'Submit'
      } else {
          this.submitMessage = 'Verify Email'
      }
    },
    userid(val) {
      console.log("user_id: ", val)
      this.showUserInfoModal()
    }
  },
  async mounted() {
    // let emails = await this.$axios.$get("https://api.github.com/user/emails")
    //Generate hash from current time
    var sha1 = require('sha1');
    var hash = sha1(Date.now());
    //Get expire time
    let offset = 24*60*60*1000;
    let expireTime = new Date();
    offset += expireTime.getTime();
    expireTime.setTime(offset);
    //Set session id per user
    document.cookie = `session_id=${hash};expires=${expireTime.toUTCString()}`;
    console.log(this.user)
  },
  methods:{
    validateNumber() {
      if (this.userCountryCode|| this.userMobileNumber) { // if countryCode or mobileNumber was entered ensure it matches the expected format
        var match1 = this.userCountryCode.match(this.countryCodePattern)
        var match2 = this.userMobileNumber.match(this.mobileNumberPattern)
        return match1 && (this.userCountryCode === match1[0]) && match2 && (this.userMobileNumber === match2[0]);
      }
      return true// an empty countryCode and mobileNumber at the same time is allowed
    },
    async addFields(){
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        this.dialogMessage = ''
        this.localuser.position = this.userPosition
        let isValidNumber = this.validateNumber()
        if (!isValidNumber) {
          this.dialogMessage = 'Please enter valid charaters for Mobile Number'
        }
        else{
          this.localuser.countryCode = this.userCountryCode
          this.localuser.mobileNumber = this.userMobileNumber.replace(/\D/g, '');
        }
        this.localuser.name = this.userName
        this.localuser.email = this.userEmail
        this.localuser.userOTP = this.userOTP.length == 0 && this.otpSent ? 'undefined' : this.userOTP
        let response = await this.$userEndpoint.update(this.userid, this.localuser)
        if(response.action){ 
          this.dialogMessage = response.message
          if (response.action == "OTP_SENT") {
            this.otpSent = true
            this.submitMessage = 'Submit'
          }
          if (response.action == "OTP_INVALID") {
            this.userOTP = ''
            this.submitMessage = 'Verify Email'
            this.otpSent = false
          }
          return
        }

        if(this.localuser.position && this.userAffiliation.length && this.localuser.email && this.localuser.name && this.localuser.mobileNumber && this.localuser.countryCode && isValidNumber){
          this.dialog=false
        }

        // create any affiliations that were added
        this.userAffiliation.forEach((affil, index, object) => {
          if (typeof affil === 'string') {
            console.log('here')
            this.$store.dispatch('user/createAffiliation', affil)
            object.splice(index, 0)
          }
        })
        this.$store.dispatch('user/fetchUser') // adds latest user data to store

      }
    },
    async logout() {
      if (confirm('Log out of COMUNDA?')) {
        this.dialog=false
        console.log('Logging out')
        this.$store.commit('user/LOGOUT')
        this.$store.commit('system/LOGOUT')
        this.$auth.logout()
      }
    },
    async showUserInfoModal () {
      if (this.$auth.loggedIn){
        await this.$store.dispatch('user/fetchOrgs')

        await this.$store.dispatch('user/fetchUser').then(response => {

          if(this.organization.length == 0 || !this.localuser.position || !this.localuser.email || !this.localuser.name || !this.localuser.countryCode || !this.localuser.mobileNumber  ){
            this.dialog = true
          }
          this.localuser = JSON.parse(JSON.stringify(this.person))
          this.userAffiliation = this.organization ? this.organization : []

          this.localuser.position = this.localuser.position ? this.localuser.position : ''
          this.localuser.countryCode = this.localuser.countryCode ? this.localuser.countryCode : ''
          this.localuser.mobileNumber = this.localuser.mobileNumber ? this.localuser.mobileNumber : '' 
          this.userPosition = this.localuser.position
          this.user.countryCode = this.localuser.countryCode
          this.user.mobileNumber = this.localuser.mobileNumber
          if(this.localuser.email) { // If a user's email is already stored in the backend we do not need to verify it, thus we change the submitMessage from 'Verify email' to 'Submit'
            this.submitMessage = 'Submit'
          }
          this.userName = this.localuser.name

          this.localuser.email = this.localuser.email ? this.localuser.email : ''
          this.userEmail = this.localuser.email
          console.log(this.localuser)
        })

      }
    },
    onAffiliationInput(value) {
      if (value && value.length > 0) {
        this.menuProps.value = true; // Show the menu if there's input
      } else {
        this.menuProps.value = false; // Hide the menu if input is cleared
      }
    },
  }
  // async computed(){

  // }
}
</script>
