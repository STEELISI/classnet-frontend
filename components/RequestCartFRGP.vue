<template>
    <div v-if="provider">
      <v-dialog
        v-model="incompleteProfileDialog"
        persistent
        max-width="450"
      >
  
        <v-card>
          <v-card-title class="text-h5">
            Action Required!
          </v-card-title>
          <v-card-text>
            <v-alert dense text type="warning">
              Your profile must be complete before you can request access to datasets. Go to Manage account page to complete profile.<br><br>
              
              <span style="color: red;" v-html="incompleteProfileDialogMessage"></span>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="navigateToProfile"
            >
              Go to Profile
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

     <div>
      <transition name="modal-fade">
            <DUAReviewModal
              v-show="isModalVisible"
              @close="closeModal"
              @submitRequest="submitRequest"
              v-bind:duaHTML="duaHTML">
            </DUAReviewModal>
          </transition>
       <form @submit.prevent="submitForm" ref="request_form">
       <!-- <div style="margin-top: 20px; font-weight: bold;">Please download and fill out data use agreement from<a @click="fetchDUA"> this link</a></div>
        <div style="margin-top: 20px; margin-bottom: 20px; font-weight: normal;">Upload filled data use agreement here (in PDF format) <input type="file" @change="uploadFile" ref="file" required accept="application/pdf"></div> -->
        <div v-if="artifacts.length === 0">Loading...</div>
        <div v-else style= "margin-bottom: 30px;">
          <div class="text-h6" style="margin-top: 10px;  font-weight: bold;">Request the following artifacts:</div>
          <div v-for="(artifact, index) in artifacts" :key="index"> 
            <div style="margin-bottom: 10px;">{{artifact.artifact.title}}</div>
          </div>
        </div>
        <div style="font-weight: bold;">Enter project name<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
          name="project"
          v-model="project"
          type="text"
          hint="Please indicate the name of research project (including funder, if any), project URL (if any) and supporting organization (school, business, etc.) where the work will be done."
          auto-grow
          clearable
          required
        ></v-text-field>
        <div style="margin-top: 20px; font-weight: bold;">Briefly describe the research to be done with the dataset<span style='color: red;'><strong> *</strong></span></div>
        <v-textarea
          name="project_description"
          v-model="project_description"
          type="text"
          hint="Please briefly describe the research you plan to do"
          auto-grow
          clearable
          required
        ></v-textarea>
        <div v-if="provider == 'USC'">
        <div style="margin-top: 20px; font-weight: bold;">Briefly justify (a few sentences) about why the dataset is needed to advance that research.<span style='color: red;'><strong> *</strong></span></div>
        <v-textarea
          name="project_justification"
          v-model="project_justification"
          type="text"
          hint="Please describe why the dataset is needed to advance the research."
          auto-grow
          clearable
          required
        ></v-textarea>
        </div>
        <div style="margin-top: 20px; font-weight: bold;">Details of the researcher representative (Fetched from your profile)</div>
        <v-container>
          <v-row align="center">
            <v-col md="4">
              <v-text-field
                v-model="requester.name"
                type="text"
                hint="Enter researcher name"
                disabled
                required>
                <template #label>
                    <span>Name<span style='color: red;'> *</span></span>
                </template>
              </v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field
                v-model="requester.email"
                label="Email"
                type="email"
                hint="Enter researcher email"
                disabled
                required>
                <template #label>
                    <span>Email<span style='color: red;'> *</span></span>
                </template>
              </v-text-field>
            </v-col>
            <v-col md="1">
              <v-text-field
              v-model="requester.countryCode"
            label="Country Code"
            type="number"
            prefix="+"
            hint="Enter country code"
            min = "1"
            pattern="^[0-9]+$"
            required
            disabled
            ></v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field
                v-model="requester.mobileNumber"
                type="text"
                hint="Enter researcher phone number"
                required
                min = "1"
                pattern="^[0-9]+$"
                disabled>
                <template #label>
                    <span>Phone Number (only digits)<span style='color: red;'> *</span></span>
                </template>
              </v-text-field>
            </v-col>
            <v-col md="5">
              <v-combobox
                        label="Affiliation"
                        multiple
                        small-chips
                        deletable-chips
                        persistent-hint
                        :items="orgNames"
                        v-model="requester_orgs"
                        :search-input.sync="orgSearch"
                        item-text="org.name"
                        item-value="org.name"
                        disabled
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
            <v-col md="5">
              <v-text-field
  
                v-model="requester.position"
                type="text"
                hint="Enter researcher title"
                disabled
                required>
                <template #label>
                    <span>Researcher Title<span style='color: red;'> *</span></span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
        
        <div style="margin-top: 20px; font-weight: bold;">Enter details of Supervisor</div>
        <v-container>
            <v-row align="center">
              <v-col md="5">
                <v-text-field
                  v-model="frgpData.supervisor_researcher.name"
                  type="text"
                  hint="Enter supervisor name"
                  required>
                  <template #label>
                    <span>Name<span style='color: red;'> *</span></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                  v-model="frgpData.supervisor_researcher.email"
                  type="email"
                  hint="Enter supervisor email"
                  required>
                  <template #label>
                    <span>Email<span style='color: red;'> *</span></span>
                  </template>
                </v-text-field>
              </v-col>  
              <v-col md="3">
                <v-text-field
                  v-model="frgpData.supervisor_researcher.title"
                  type="text"
                  hint="Enter supervisor title"
                  required>
                  <template #label>
                    <span>Title<span style='color: red;'> *</span></span>
                  </template>
                </v-text-field>
              </v-col>  
            </v-row>
        </v-container>

        <div style="margin-top: 20px; font-weight: bold;">Enter details of all other researchers that will interact with the data:
          <div style="font-weight: normal; font-size: smaller; margin-top: 5px;">Please identify any researchers (in addition to the dataset requester) that will use the data. Please provide their name and e-mail address.</div>
        </div>
        <div v-for="(researcher, index) in researchers_that_interact" :key="index">
          <v-container>
            <v-row align="center">
              <v-col md="5">
                <v-text-field
                  v-model="researcher.name"
                  type="text"
                  hint="Enter researcher name"
                  required>
                  <template #label>
                    <span>Name<span style='color: red;'> *</span></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                  v-model="researcher.email"
                  type="email"
                  hint="Enter researcher email"
                  required>
                  <template #label>
                    <span>Email<span style='color: red;'> *</span></span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                  v-model="researcher.number"
                  label="Phone Number (only digits)"
                  type="text"
                  hint="Enter researcher phone number"
                  pattern="^[0-9]+$"
                ></v-text-field>
              </v-col>
              <v-col md="1">
                <div>
                  <v-icon
                    v-if="researchers_that_interact.length > 0"
                    color="error"
                    @click="deleteResearcher(index)"
                  >
                    mdi-delete
                  </v-icon>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div style="margin-top: 20px;">
          <v-btn
            class="success ml-2 mb-2"
            fab
            x-small
            @click="addResearcher"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
  
        </div>

        <div style="margin-top: 20px;font-weight: bold;">Enter nationality of researcher (for UCAR export restrictions):<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="nationality"
            v-model="frgpData.nationality"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">What is the estimated time period of the project?<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="timeperiod"
            v-model="frgpData.timeperiod"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">Where will the data be stored, is it at your institution, a cloud provider, or other? Please specify.<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="storage"
            v-model="frgpData.storageLocation"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">How many people will have direct access to the data?<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="number_researchers"
            v-model="frgpData.numberOfResearchers"
            type="number"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">Is the data to be used as part of a NSF (or other) grant? Please list<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="grant"
            v-model="frgpData.grants"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">What do you propose to do with the data?<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="data_usage"
            v-model="frgpData.dataUsage"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">How will the research results from the data be shared?<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="results_shared"
            v-model="frgpData.resultSharing"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

        <div style="margin-top: 20px;font-weight: bold;">Who is the audience for the research?<span style='color: red;'><strong> *</strong></span></div>
        <v-text-field
            name="target_audience"
            v-model="frgpData.targetAudience"
            type="text"
            auto-grow
            clearable
            required
        ></v-text-field>

            <div style="margin-top: 20px;font-weight: bold;">How will the data be disposed of once finished?<span style='color: red;'><strong> *</strong></span></div>
            <div style="font-weight: normal; font-size: smaller; margin-top: 5px;">Once data has been safely disposed of, frgp-eng@ucar.edu must be notified.</div>
            <v-text-field     
            name="data_disposal"
            v-model="frgpData.dataDisposal"
            type="text"
            auto-grow
            clearable
            required
            ></v-text-field>
  
          <div style="margin-top: 20px; font-weight: bold;">Your SSH public key for datasets download (optional)</div>
          <v-text-field
              v-model="requester.publicKey"
              :type=" 'text' "
              name="input-10-1"
              hint="We support dataset download by HTTPS with username and password, or via ssh+rsync. Please provide the public part of your ssh key if you want to use rsync"
              disabled
          ></v-text-field>
  
          <div v-if="artifacts.length === 0">Loading...</div>
          <div v-else>
            <div v-for="(artifact, index) in artifacts" :key="index"> 
              <div v-if ="artifact.artifact.irb" style="margin-top: 20px; font-weight: bold;">Upload IRB approval Letter for {{artifact.artifact.title}}</div>
              <v-file-input v-if ="artifact.artifact.irb" v-model = "irbContentList[index]" clearable label="Upload IRB approval letter" variant="underlined" @change ="getContent(index)"></v-file-input>
            </div>
          </div>

          <div>
              <input type="submit" value="Review" class="btn-submit" style="margin-top: 20px;" :disabled="requestMode">
          </div>
      </form>
  
      <v-dialog
      v-model="formSubmitted"
      width="auto "
      >
        <v-card>
          <v-card-text>
            <div v-if="formSubmittedError" class="form-submit-error">
              <p>{{formSubmittedErrorMessage}}</p>
            </div>
            <div v-else class="form-submit-success">
              <p>Request submitted successfully!</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="cart.length>1" color="primary" block @click="$router.push('/cart');">Go to Cart</v-btn>
            <v-btn v-else color="primary" block @click="$router.push('/');">Go to homepage</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  
     </div>
    <div v-else>
      {{ loadingMessage }}
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  import { marked } from 'marked'
  import { getCartGroupedByProviderCollection } from '@/helpers'

  export default {
    name: 'RequestCart',
    props: {
      record: {
        type: Object,
        required: true
      }
    },
    components: {
      JsonPrettyPrint: () => import('@/components/pretty-print'),
      DUAReviewModal: () => import('@/components/DUAReviewModal')
    },
    data() {
      return {
        loading: true,
        loaded: false,
        expanded: false,
        history_expanded: false,
        diff_from: -1,
        diff_to: -1,
        diff_results: [],
        diff_results_dialog: false,
        diff_results_tab: "visual",
        loadingMessage: 'Loading...',
        incompleteProfileDialog: false,
        incompleteProfileDialogMessage: "",
        project: "",
        project_description: "",
        project_justification: "",
        people: "",
        Images: null,
        formSubmitted: false,
        formSubmittedError: false,
        formSubmittedErrorMessage: "",
        representative_researcher: {name: "", email: "", number: "", organization:"", title:""},
        researchers_that_interact: [],
        frgpData: {supervisor_researcher:{name:"", email:"",title:""},nationality:'',timeperiod:'',
                   storageLocation:'',numberOfResearchers:'',grants:"",dataUsage:'',resultSharing:'',targetAudience:'',dataDisposal:''},
        researchers: [],
        requestMode: false,
        dua: null,
        duaHTML: null,
        isModalVisible: false,
        irbContentList : [],
        irbDataList: [],
        publicKey: '',
        show1: false,
        password: 'Password',
        rules: {
            required: value => !!value || 'Required.',
            min: v => v.length >= 8 || 'Min 8 characters',
  
        },
        provider:'',
        collection:'',
        cartGroupedByProviderCollection:[],
        artifacts:[],
        listOfArtifactIDs:[]

      }
    },
    async mounted() {
      this.provider = this.$route.query.provider
      this.collection = this.$route.query.collection
      

      setTimeout(() => {
        this.loadingMessage = 'Error loading'
      }, 5000)
      await this.$store.dispatch('user/fetchUser').then(response => {
        
        if (!(this.userAffiliation.length > 0 && this.userDetails && this.userDetails.mobileNumber && this.userDetails.name && this.userDetails.email && this.userDetails.position)) {
          this.incompleteProfileDialogMessage = "Please fill the following:<br><ul>"
          if (!this.userDetails.name) {
            this.incompleteProfileDialogMessage = this.incompleteProfileDialogMessage + "<li>Name</li>"
          }
          if (!this.userDetails.email) {
            this.incompleteProfileDialogMessage = this.incompleteProfileDialogMessage + "<li>Email</li>"
          }
          if (this.userAffiliation.length ===  0) {
            this.incompleteProfileDialogMessage = this.incompleteProfileDialogMessage + "<li>Affiliation</li>"
          }
          if (!this.userDetails.position) {
            this.incompleteProfileDialogMessage = this.incompleteProfileDialogMessage + "<li>Position</li>"
          }
          if (!this.userDetails.mobileNumber) {
            this.incompleteProfileDialogMessage = this.incompleteProfileDialogMessage + "<li>Phone Number</li>"
          }
          this.incompleteProfileDialogMessage = this.incompleteProfileDialogMessage + "</ul>"
  
          this.incompleteProfileDialog = true
        } else {
        this.incompleteProfileDialog = false
        }
      })
      if (this.cart.length && this.cart.length == 0) {
        this.$router.push('/')
      }
      this.cartGroupedByProviderCollection = getCartGroupedByProviderCollection(this.cart)

      // If there are no artifacts given the provider, collection pair then we redirect to the homepage
      const key = `${this.provider},${this.collection}`;
      if (this.cartGroupedByProviderCollection[key] && this.cartGroupedByProviderCollection[key]['artifact_ids']) {
        this.listOfArtifactIDs = this.cartGroupedByProviderCollection[key]['artifact_ids'];
      } else {
        // If the key or artifact_ids does not exist, redirect to the homepage
        this.$router.push('/');
        return; // Stop further execution if redirection occurs
      }
      
      // Map over listOfArtifactIDs to create an array of promises
      let promises = this.listOfArtifactIDs.map(async (ids) => {
        // Await the result of each asynchronous call to this.$artifactEndpoint.show(ids)
        let artifact = await this.$artifactEndpoint.show(ids);
        return artifact;
      });

      // Use Promise.all to wait for all promises to resolve
      this.artifacts = await Promise.all(promises);
      this.irbContentList =  Array(this.artifacts.length).fill(null);
      this.irbDataList =  Array(this.artifacts.length).fill(null);

      this.$store.dispatch('user/fetchOrgs')
  
    },
    computed: {
  
      ...mapState({
        userid: state => state.user.userid,
        requester: state=> state.user.user,
        user_is_admin: state => state.user.user_is_admin,
        requester_orgs: state =>state.user.organization,
        requ: state => state.user,
        userAffiliation: state => state.user.organization,
        userDetails:state => state.user.user,
        cart:state => state.user.cart,
      }),
      hideOverflow() {
        return {
          hideoverflow: !this.expanded
        }
      },
    },
    methods: {
      navigateToProfile(){
        this.dialog = false
        this.$router.push('/profile')
      },
      showModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
      async deleteResearcher(index) {
        this.researchers_that_interact.splice(index, 1);
      },
      async addResearcher() {
        let researcherObj = {
          name: "",
          email: "",
          number: ""
        }
        this.researchers_that_interact.push(researcherObj);
      },
      uploadFile() {
          this.Images = this.$refs.file.files[0];
      },
      getContent(index){
  
        if (this.irbContentList[index] == null){
          return
        }
  
        if (!this.irbContentList[index]) {this.data = "No File Chosen"}
        var reader = new FileReader();
  
        // Use the javascript reader object to load the contents
        // of the file in the v-model prop
        reader.readAsBinaryString(this.irbContentList[index]);
        reader.onload = () => {
          this.irbDataList[index] = reader.result;
        }
  
  
      },
      submitForm() {
        this.project = this.project.trim();
        this.project_description = this.project_description.trim();
        this.project_justification = this.project_justification.trim();
        this.representative_researcher.name = this.requester.name.trim();
        this.representative_researcher.email = this.requester.email.trim();
        this.representative_researcher.number = "+" +this.requester.countryCode + this.requester.mobileNumber.trim();
  
        let orgNames = []
        for (let i of this.requester_orgs){
          orgNames.push(i.org.name)
        }
  
        this.representative_researcher.organization = orgNames.join(", ")
        this.representative_researcher.title = this.requester.position.trim();
        this.representative_researcher.publicKey = this.requester.publicKey
        this.researchers_that_interact.forEach((researcher) => {
          researcher.name = researcher.name.trim();
          researcher.email = researcher.email.trim();
          researcher.number = researcher.number.trim();
        });
        // Researchers is a combination of representative_researcher and the researchers_that_interact list
        this.researchers = [this.representative_researcher].concat(this.researchers_that_interact)
        if (this.$refs.request_form.checkValidity()) {
          // this.submitRequest();
          this.fetchDUA();
        } else {
          this.$refs.request_form.reportValidity();
        }
      },
      async submitRequest() {
        this.formSubmitted = false;
        let isEntryEmpty = false;
        console.log(this.representative_researcher)
        if ((this.representative_researcher.name == "" || this.representative_researcher.email == "" || this.representative_researcher.number == "" || this.representative_researcher.organization == "" || this.representative_researcher.title == "")) {
            isEntryEmpty = true;
        }
        this.researchers.forEach((researcher) => {
          if ((researcher.name == "" || researcher.email == "")) {
            isEntryEmpty = true;
          }
        });
        if(this.provider == 'USC') {
          if (this.project_justification == "") {
            isEntryEmpty = true;
          }
        }
  
        if(!(this.project_description) || isEntryEmpty || !(this.project)) {
          console.log(this.project_description)
          console.log(isEntryEmpty)
          console.log(this.project)
          this.formSubmittedError = true;
          this.formSubmittedErrorMessage = "Please fill all the fields";
          this.formSubmitted = true;
          return;
        }
  
  
        this.formSubmittedError = false;
        this.formSubmittedErrorMessage = "";
        this.requestMode = true;
        const payload = new FormData();
  
  
  
        let blob = new Blob([this.duaHTML], { type: 'text/plain' });
        let file = new File([blob], "signed_dua.html", {type: "text/plain"});
        let researchersJSON = JSON.stringify(this.researchers);
        payload.append('file', file);

        if (this.irbDataList && Array.isArray(this.irbDataList)) {
          // Create an array to hold the files, including nulls
          let filesArray = this.irbDataList.map((data, index) => {
            if (data !== null) {
              let pdfBlob = new Blob([data], { type: 'application/pdf' });
              return new File([pdfBlob], `IRB_approval_letter_${this.artifacts[index].artifact_group_id}_${this.artifacts[index].id}_${this.userid}.pdf`, { type: 'application/pdf' });
            }
            return null; // Preserve the index with null
          });
          filesArray.forEach((file, index) => {
              if (file !== null) {
                  payload.append(`irb_file_${index}`, file);
              }
          });
        }
        payload.append('project', this.project);
        payload.append('project_description', this.project_description);
        payload.append('project_justification', this.project_justification);
        payload.append('researchers', researchersJSON);
        payload.append('representative_researcher_email', this.representative_researcher['email']);
        payload.append('public_key', this.representative_researcher['publicKey'])
        payload.append('listOfArtifactIDs', JSON.stringify(this.listOfArtifactIDs))
        payload.append('frgpData',JSON.stringify(this.frgpData));

        let response = await this.$artifactRequestCartEndpoint.create(payload);
        if(response.status && response.status == 1) {
          this.formSubmittedError = true;
          this.formSubmittedErrorMessage = response.error;
        }
        else if (response.status && response.status == 500){
          this.formSubmittedError = true;
          this.formSubmittedErrorMessage = response.message;
        }
         else {
          this.formSubmittedError = false;
        }
        this.formSubmitted = true;
        this.requestMode = false;
        this.closeModal();
      },
      async fetchDUA() {
        // get representative from researchers
        console.log("listOfArtifactIDs", this.listOfArtifactIDs)

        let payload = {
            'researchers': JSON.stringify(this.researchers),
            'project': this.project,
            'project_description': this.project_description,
            'representative_researcher': JSON.stringify(this.representative_researcher),
            'provider': this.provider,
            'collection': this.collection,
            'frgpData':JSON.stringify(this.frgpData),
            'listOfArtifactIDs': JSON.stringify(this.listOfArtifactIDs)
          }
        console.log('in fetch dua!', payload)
        let response = await this.$duaEndpoint.index(payload);
        console.log('in fetch dua2!', payload,response)

        this.dua = response.dua;
        this.duaHTML = marked(this.dua);
        this.showModal();
        //TODO: Sign DUA
      },
    }
  }
  </script>
  
  <style scoped>
  .hideoverflow {
    max-height: 250px;
    overflow: hidden;
  }
  </style>
  
  <style>
    form {
      padding: 10px;
      border-radius: 5px;
    }
  
    input {
      padding: 4px 8px;
      margin: 4px;
    }
  
    /* span {
      font-size: 18px;
      margin: 4px;
      font-weight: 500;
    } */
  
    .submit {
      font-size: 15px;
      color: #fff;
      padding: 6px 12px;
      border: none;
      margin-top: 8px;
      cursor: pointer;
      border-radius: 5px;
    }
  
    .form-submit-error {
      color: red;
      padding: 10px;
      font-size: 15px;
    }
  
    .form-submit-success {
      color: green;
      padding: 10px;
      font-size: 15px;
    }
  
    .btn-submit {
      background-color: #4CAF50;
      color: white;
      font-weight: bold;
      border-radius: 4px;
      padding: 8px;
      width: 100px;
    }
  
  
  
  </style>
  