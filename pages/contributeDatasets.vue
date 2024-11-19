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
      <h1>Contribute Dataset</h1>
      <v-divider></v-divider>
    </v-layout>
    <v-container v-if="providerPermissionsReceived && isApprovedProvider || isAdmin">
      <v-row class="py-5">
        <div>For help, please see the <a href="https://steelisi.github.io/CLASSNET-DOCS/contribute/">Contributing Datasets</a> documentation</div>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <!-- Card component to create the box effect -->
          <v-card>
            <v-card-title>
              Metadata Details
            </v-card-title>
          <v-card-text>
          <v-form ref="form" validate-on="submit" fast-fail @submit.prevent="submit" >
            <div style="font-weight: bold; margin-top:20px;">Enter dataset name<span style='color: red;'><strong> *</strong></span></div>
            <v-text-field
            name="datasetName"
            v-model="datasetName"
            :rules="datasetNameRules"
            type="text"
            auto-grow
            clearable
            required></v-text-field>

            <div style="margin-top: 20px; font-weight: bold;">Briefly describe the dataset<span style='color: red;'><strong> *</strong></span></div>
            <v-text-field
              name="shortDescription"
              v-model="shortDesc"
              type="text"
              @blur="validateShortDesc"
              @input="resetShortDescError"
              auto-grow
              clearable
              required
              :maxlength="shortDescCharLimit"
            ></v-text-field>
            <p v-if="shortDescError" style="font-size:12px; color: red;">
              {{ shortDescErrorMessage }}
            </p>
            <span>{{ shortDesc.trim().length }} / {{ shortDescCharLimit }}</span>
            
            <div style="font-weight: bold; margin-top:20px;">Provide a detailed description of the dataset<span style='color: red;'><strong> *</strong></span></div>
            <v-textarea
            name="longDescription"
            v-model="longDesc"
            @blur="validateLongDesc"
            @input="resetLongDescError"
            type="text"
            auto-grow
            clearable
            :maxlength="longDescCharLimit"
            required></v-textarea>
            <p v-if="longDescError" style="font-size:12px; color: red;">
              {{ longDescErrorMessage }}
            </p>
            <span>{{ longDesc.trim().length }} / {{ longDescCharLimit }}</span>
        
            <div style="font-weight: bold; margin-top:20px;">Dataset Class </div>
            <div style="font-size: 12px; color: grey; margin-top: 5px;">This field determines the restriction placed on access request to this dataset.</div>
            <v-select
              name="datasetClass"
              v-model="datasetClass"
              :items="classificationListOptions"
              clearable
            ></v-select>

            <div style="font-weight: bold; margin-top:20px;">Is commercial use of the dataset allowed?</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                name="commercialUse"
                v-model="commercialAllowed"
                :items="trueFalseOptions"
                auto-grow
                clearable
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">Should the results obtained from the dataset be reviewed by the provider before publication?</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                name="productReview"
                v-model="productReviewRequired"
                :items="trueFalseOptions"
                auto-grow
                clearable
                ></v-select>
              </v-col>
            </v-row>

        
            <div style="font-weight: bold; margin-top:20px;">When does the dataset become available?<span style='color: red;'><strong> *</strong></span></div>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="availabilityStartDateTime.dialog"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="availabilityStartDateTime.val"
                        :rules="availabilityStartDateTimeRules"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="availabilityStartDateTime.val" @input="availabilityStartDateTime.dialog= false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

            <div style="font-weight: bold; margin-top:20px;">When does the dataset cease to be available?<span style='color: red;'><strong> *</strong></span></div>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="availabilityEndDateTime.dialog"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="availabilityEndDateTime.val"
                        :rules="availabilityEndDateTimeRules"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="availabilityEndDateTime.val" @input="availabilityEndDateTime.dialog= false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
          

            <div style="font-weight: bold; margin-top:20px;">Is the collection still in progress?</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                name="ongoingMeasurement"
                v-model="ongoingMeasurement"
                :items="trueFalseOptions"
                auto-grow
                clearable
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">When did the collection start?<span style='color: red;'><strong> *</strong></span></div>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="collectionStartDateTime.dialog"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="collectionStartDateTime.val"
                        :rules="collectionStartDateTimeRules"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="collectionStartDateTime.val" @input="collectionStartDateTime.dialog= false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

            <!-- collection end date : When did the collection end? -->
            <div style="font-weight: bold; margin-top:20px;">When did the collection stop?<span style='color: red;'><strong> *</strong></span></div>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="collectionEndDateTime.dialog"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="collectionEndDateTime.val"
                        :rules="collectionEndDateTimeRules"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="collectionEndDateTime.val" @input="collectionEndDateTime.dialog= false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

            <div style="font-weight: bold; margin-top:20px;">What is the size of the dataset?<span style='color: red;'><strong> *</strong></span></div>
            <v-row>
              <v-col cols="3" sm="3">
                <v-text-field
                  name="byteSize"
                  type="number"
                  v-model="byteSize"
                  :rules="byteSizeRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2" md="2">
                <v-select
                  name="Unit"
                  v-model="byteSizeUnit"
                  :rules="byteSizeUnitRules"
                  :items="byteSizeUnitOptions"
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">What is the uncompressed size of the dataset?</div>
            <v-row>
              <v-col cols="3" md="3">
                <v-text-field
                  name="uncompressedSize"
                  v-model="uncompressedSize"
                  :rules="uncompressedSizeRules"
                  @input="handleNumericInput"
                ></v-text-field>
              </v-col>
              <v-col cols="2" md="2">
                <v-select
                  name="Unit"
                  v-model="uncompressedSizeUnit"
                  :items="byteSizeUnitOptions"
                  placeholder="Select unit"
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;"> Once downloaded, can the contents be retained and used indefinitely?</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                name="archivingAllowed"
                v-model="archivingAllowed"
                :items="trueFalseOptions"
                auto-grow
                clearable
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">What is the dataset category?</div>
            <v-row>
              <v-col cols="12" sm = "6" md="4">
                <v-combobox
                v-model="selectedCategory"
                :items="categoryOptions"
                :rules="datasetCategoryRules"
                label="Select or enter category"
                clearable
                placeholder="Choose or type a category"
                allow-overflow
                ></v-combobox>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;"> Keywords to facilitate search (Press space to add more)?<span style='color: red;'><strong> *</strong></span> </div>
              <div class="input-bubble-container">
                <div class="bubbles">
                  <span class="bubble" v-for="(word, index) in keywordList" :key="index"
                    >{{ word }}
                    <span class="delete-bubble" @click="deleteWord(index)">×</span>
                  </span>
                  <v-text-field
                    type="text"
                    v-model="keywordInput"
                    :rules="keywordListRules"
                    @keydown.space.prevent="addWord"
                    @blur="addWord"
                    class="bubble-input"
                    ref="keywordInput"
                  ></v-text-field>
              </div>
            </div>
            <div style="margin-top: 20px; font-weight: bold;">What format was used if any?<span style='color: red;'><strong> *</strong></span></div>
            <v-select
              name="formatList"
              v-model="formatList"
              :rules="formatListRules"
              :items="formatListOptions"
              auto-grow
              clearable
              required
            ></v-select>
            <div style="margin-top: 20px; font-weight: bold;">What anonymization was used if any?<span style='color: red;'><strong> *</strong></span></div>
            <v-select
              name="anonymizationList"
              v-model="anonymizationList"
              :rules="anonymizationListRules"
              :items="anonymizationListOptions"
              auto-grow
              clearable
              required
            ></v-select>

            <div style="margin-top: 20px; font-weight: bold;">Types of access given?</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  name="accessList"
                  v-model="accessList"
                  :items="accessListOptions"
                  auto-grow
                  clearable
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">Duration of access (in days)</div>
            <div style="font-size: 12px; color: grey; margin-top: 5px;">How many days will access be granted for?</div>

            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                name="expirationDate"
                v-model="expirationDays"
                :rules="expirationDaysRules"
                type="number"
                auto-grow
                clearable
                required
                ></v-text-field>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">Grouping ID</div>
            <div style="font-size: 12px; color: grey; margin-top: 5px;">A word or phrase that you want this dataset and other related datasets to be grouped under. Eg: 'internet address survey'</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                name="groupingId"
                :rules="groupingIdRules"
                v-model="groupingId"
                type="text"
                auto-grow
                clearable
                ></v-text-field>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">Select Provider and User Agreement<span style='color: red;'><strong> *</strong></span></div>
            <v-col cols="12" sm="6" md="4">
              <v-select
              name="providerName"
              v-model="providerCollection"
              :rules="providerCollectionRules"
              :items="providerCollectionOptions"
              type="text"
              auto-grow
              clearable
              required
              ></v-select>
            </v-col>

            <div>
              <label>
                <input type="checkbox" v-model="autoApproveDataset">
                Auto-approve dataset
              </label>
            </div>

            <div style="font-weight: bold; margin-top:20px;"> Is IRB approval required for access?</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                name="irbRequired"
                v-model="irbRequired"
                :items="trueFalseOptions"
                auto-grow
                clearable
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;"> Accessible for download or on-site?</div>
            <v-select
            name="retrievalInstructions"
            v-model="retrievalInstructions"
            :items="retrievalInstructionsOptions"
            auto-grow
            clearable
            ></v-select>

            <div style="font-weight: bold; margin-top:20px;">Upload a README file for the dataset<span style='color: red;'><strong> *</strong></span></div>
            <div style="font-size: 12px; color: grey; margin-top: 5px;">Supported format: .txt, .md, .wiki only</div>
            <div style="margin-top: 10px; margin-bottom: 10px;"></div>
            <input
              type="file"
              @input="resetReadmeError"
              @change="handleFileUpload"
              accept=".txt,.md, .wiki"
              required
            />
            <div v-if="datasetReadmeError" style="font-size:12px; color: red;">{{ datasetReadmeErrorMessage }}</div>
            <div v-if="!datasetReadmeError" style="font-size:12px; color: green;">{{ datasetReadmeSuccessMessage }}</div>

            <v-card-actions>
              <v-btn color="primary" type="submit">Submit</v-btn>
            </v-card-actions>

          </v-form>

          </v-card-text>
          <v-col cols="12" v-if="submitCardMessage">
                    <span style="color:red">{{submitCardMessage}}</span>
          </v-col> 
         </v-card>
      </v-col>
      
      </v-row>
    </v-container>
    <v-col cols="12" sm="8" md="8" v-if="providerPermissionsReceived && !isApprovedProvider  && !isAdmin">
            <v-alert
              icon="mdi-shield-lock-outline"
              prominent
              text
              type="info"
            >
            You currently do not have access to this page as an approved provider.
            </v-alert>
    </v-col>

    <v-dialog v-model="isProcessing" persistent max-width="300">
      <v-card>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="auto">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="auto">Processing...</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

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
            <p>Dataset contributed successfully!</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="$router.push('/');">Go to homepage</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    Logo: () => import('@/components/Logo'),
    ArtifactList: () => import('@/components/ArtifactList')
  },
  head() {
    return {
      title: 'SEARCCH Favorite Artifacts',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Contribute Datasets'
        }
      ]
    }
  },
  

  data() {
    return {
      datasetName:'',
      datasetNameRules: [
          value => !!value || 'Dataset name is required',
          value => /^[A-Za-z0-9_.-]{5,250}$/.test(value) || 'Dataset name must only contain letters, numbers, underscores, hyphens, and dots, and be between 5 and 250 characters long',
      ],
      shortDesc:'',
      shortDescError:true,
      shortDescErrorMessage:'',
      shortDescCharLimit:350,
      longDesc:'',
      longDescError:true,
      longDescErrorMessage:'',
      longDescCharLimit:10000, 
      datasetClass:'',
      classificationListOptions:[{text:'Restricted', value:'restricted'},{text:'Quasi Restricted', value:'quasi-restricted'},{text:'Classified', value:'classified'},{text:'Unclassified (default)', value:"unclassified"}],
      commercialAllowed:'',
      productReviewRequired:'',
      availabilityStartDateTime:{dialog:false, val:null},
      availabilityStartDateTimeRules: [
        value => (value!=undefined && value.length > 0)  || 'Availability Start Date Time is required',
      ],
      availabilityEndDateTime:{dialog:false, val:null},
      availabilityEndDateTimeRules: [
        value => (value!=undefined && value.length > 0)  || 'Availability End Date Time is required',
        value => (value>= this.availabilityStartDateTime.val)  || 'Availability End Date Time must be the on or after Start time',
      ],
      ongoingMeasurement:'',
      collectionStartDateTime:{dialog:false, val:null},
      collectionStartDateTimeRules: [
        value => (value!=undefined && value.length > 0)  || 'Collection Start Date Time is required',
      ],
      collectionEndDateTime:{dialog:false, val:null},
      collectionEndDateTimeRules: [
        value => (value!=undefined && value.length > 0)  || 'Collection End Date Time is required',
        value => (value>= this.collectionStartDateTime.val)  || 'Collection End Date Time must be the on or after Start time',
      ],

      byteSize:'',
      byteSizeRules: [
        value => !!value || 'Byte size (in digits) is required',
        value => /^[1-9][0-9]{1,19}$/.test(value) || 'Byte size must be a positive integer between 2 to 20 digits and cannot start with 0s',
      ],
      byteSizeUnit:0,
      byteSizeUnitRules: [
        value => value!=undefined || 'Byte size unit is required',
      ],
      archivingAllowed:'',
      keywordInput:'',
      keywordList:[],
      keywordListRules: [
        value => (value == '' || value.length > 1) || 'Keyword length must be greater than 1',
        value => (value!=undefined  && this.keywordList.length > 0)  || 'You must enter at least one keyword',
      ],
      formatList:'',
      formatListRules: [
        value => (value!=undefined && value.length > 0)  || 'Format method is required',
      ],
      anonymizationList:'',
      anonymizationListRules: [
        value => (value!=undefined && value.length > 0)  || 'Anonymization method is required',
      ],
      accessList:'',
      providerCollection:'',
      providerCollectionRules: [
        value => !!value || 'Provider name is required',
      ],
      uncompressedSize:'',
      uncompressedSizeUnit:0,
      uncompressedSizeRules: [
        value => (/^[0-9]{0}$|^[1-9][0-9]{1,19}$/.test(value)) || 'Uncompressed size must be empty or a number with 2 to 20 digits and cannot start with 0s',
      ],
      expirationDays:'14',
      expirationDaysRules: [
        value => (/^[0-9]{0,3}$/.test(value)) || 'Expiration can be a maximum of 3 digits',
      ],
      groupingId:'',
      groupingIdRules: [
        value => /^(^$|^[A-Za-z0-9_.\- ]{5,250})$/.test(value) || 'Grouping Id must be between 5 and 250 characters long, and can only contain alphanumeric characters, underscores ("_"), hyphens ("-"), periods (".") or spaces (" ")',
      ],
      datasetCategoryRules : [
        value => /^[A-Za-z0-9_\- ]{0,50}$/.test(value) || 'Category can have a maximum of 50 characters and can only contain , hyphen ("-") or underscore ("_") ',
      ],
      irbRequired:'',
      retrievalInstructions:'',
      retrievalInstructionsOptions:['download','on-site'] ,
      trueFalseOptions:[{text:'Yes',value:"True"},{text:'No',value:"False"}],
      byteSizeUnitOptions:[{text:'B', value:0},{text:'KB', value:1},{text:'MB', value:2},{text:'GB', value:3}],
      formatListOptions:[{text:'address-bitstring',value:'address-bitstring'},{text:'adjacency-list',value:'adjacency-list'},{text:'binary',value:'binary'},{text:'coral',value:'coral'},{text:'csv',value:'csv'},{text:'dag',value:'dag'},{text:'netflow-v5',value:'netflow-v5'},{text:'netflow-v8',value:'netflow-v8'},{text:'netflow-v9',value:'netflow-v9'},{text:'pcap',value:'pcap'},{text:'snort',value:'snort'},{text:'syslog',value:'syslog'},{text:'text',value:'text'},{text:'other',value:'other'}],
      anonymizationListOptions:[{text:'cryptopan/full', value:'cryptopan/full'},{text:'cryptopan/host', value:'cryptopan/host'},{text:'None', value:'none'},{text:'Other', value:"other"}],
      accessListOptions:[{text:'Google BigQuery', value:'Google BigQuery'},{text:'https', value:'https'},{text:'rsync', value:'rsync'},{text:'other', value:'other'}],
      datasetReadme:'',
      datasetReadmeError: true,
      datasetReadmeErrorMessage: '',
      datasetReadmeCharLimit:10000, 
      submitCardMessage: '',
      formSubmitted: false,
      formSubmittedError: false,
      formSubmittedErrorMessage: '',
      isApprovedProvider: false,
      providerPermissionsReceived:false,
      isProcessing: false,
      readmeFormat:'',
      datasetReadmeSuccessMessage:'',
      processedReadme:'',
      pairs: [],
      providerCollectionOptions:[],
      selectedCategory: '',
      categoryOptions: [],
      autoApproveDataset: false,
      isEdit:false,
      artifactId: ''
    }
  },
  watch: {
    longDesc(newVal) {
      if (newVal.length > this.longDescCharLimit) {
        this.longDesc = newVal.slice(0, this.longDescCharLimit);
      }
    },
    shortDesc(newVal) {
      if(newVal.length > this.shortDescCharLimit){
        this.shortDesc = newVal.slice(0, this.shortDescCharLimit);
      }
    },
    isAdmin(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadProviderOptions();
      }
    },
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.favorites,
      userid: state => state.user.userid,
      isAdmin: state => state.user.user_is_admin
    })
  },
  async mounted(){
    this.isEdit = this.$route.query.isEdit === 'true';
    this.artifactId = this.$route.query.artifactId;
    if (this.isEdit && this.artifactId) {
      await this.getData()
    }
  },
  async created() {
    if (!this.$auth.loggedIn){
      this.$router.push('/login')
      return
    }
    await this.fetchCategoryOptions(); 
    await this.loadProviderOptions();
  },
  methods:{
    async getData(){
      try {
          const response = await this.$artifactContributeEndpoint.index({'artifactId':this.artifactId})
          console.log(response)
          // Call setFormData to populate the form fields
          this.setFormData(response);
      } 
      catch (error) {
          console.error("Error fetching data", error);
      }
    },
    normalizeBooleanString(value) {
      if (value) {
        return value.toLowerCase() === 'true' ? 'True' : 'False'; // Normalize 'true'/'false' to 'True'/'False'
      }
      return ''; // Return empty if the value is undefined, null, or empty
    },
    parseKeywords(keywords) {
      // Split the keywords by commas
      const keywordArray = keywords.split(',');

      // Initialize the variables
      const regularKeywords = [];
      let actionValue = null;
      let categoryValue = null;

      // Iterate over each keyword
      keywordArray.forEach((keyword) => {
        const parts = keyword.split(':'); // Check for ':' delimiter

        if (parts.length === 2) {
          const [key, value] = parts;
          // Check for magic words 'action' and 'category'
          if (key === 'action') {
            this.autoApproveDataset = value === 'autoapprove' ? true : false;
          } else if (key === 'category') {
            this.selectedCategory = value;
          }
        } else {
          // Regular keyword (no ':' found)
          regularKeywords.push(keyword.trim());
        }
      });
      // Set the keyword list to the regular keywords array
      this.keywordList = regularKeywords;
    },
    setFormData(data){
    this.datasetName = data.dataSetName || ''
    this.shortDesc = data.shortDesc || ''
    this.longDesc = data.longDesc || ''
    this.datasetClass = data.datasetClass || ''
    this.commercialAllowed = this.normalizeBooleanString(data.commercialAllowed) 
    this.productReviewRequired = this.normalizeBooleanString(data.productReviewRequired)
    this.availabilityStartDateTime.val = data.availabilityStartDate || ''
    this.availabilityEndDateTime.val = data.availabilityEndDate  || ''
    this.ongoingMeasurement = this.normalizeBooleanString(data.ongoingMeasurement)
    this.collectionStartDateTime.val = data.collectionStartDate || ''
    this.collectionEndDateTime.val = data.collectionEndDate || ''
    this.byteSize = data.byteSize ||'' 
    this.uncompressedSize = this.normalizeBooleanString(data.uncompressedSize)
    this.archivingAllowed = this.normalizeBooleanString(data.archivingAllowed)
    this.selectedCategory = ''
    this.parseKeywords(data.keywords)
    this.formatList = data.format || ''
    this.anonymizationList = data.anonymization || ''
    this.accessList = data.access || ''
    this.expirationDays = data.expirationDays
    this.groupingId = data.groupingId || ''
    // this.providerCollection = 
    this.irbRequired = this.normalizeBooleanString(data.irbRequired)
    },
    handleDateChange(value) {
      this.dateDialog = false;
      this.availabilityStartDateTime = value;
    },
    validateShortDesc(){
      if(!this.shortDesc.trim().length){
        this.shortDescError = true
        this.shortDescErrorMessage = 'Description is required'
      }
      else if(this.shortDesc.trim().length < 10 || this.shortDesc.trim().length > 350){
        this.shortDescError = true
        this.shortDescErrorMessage = 'Description must be between 10 and 350 characters long'
      }
      else{
        this.shortDescError = false
        this.shortDescErrorMessage = ''
      }
    },
    resetShortDescError(){
      this.shortDescError = false
      this.shortDescErrorMessage = ''
    },
    validateLongDesc(){
      if(!this.longDesc.trim().length){
        this.longDescError = true
        this.longDescErrorMessage = 'Description is required'
      }
      else if(this.longDesc.trim().length < 20 || this.longDesc.trim().length > 10000){
        this.longDescError = true
        this.longDescErrorMessage = 'Description must be between 20 and 10000 characters long'
      }
      else{
        this.longDescError = false
        this.longDescErrorMessage = ''
      }
    },
    resetLongDescError(){
      this.longDescError = true
      this.longDescErrorMessage = ''
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".wiki"))) {
        if(file.name.endsWith(".md")){
          this.readmeFormat = 'md'
        }
        else if(file.name.endsWith(".wiki")){
          this.readmeFormat = 'wiki'
        }
        else{
          this.readmeFormat = 'txt'
        }
        this.readFile(file);
      } else {
        this.datasetReadmeError = true;
        this.datasetReadmeErrorMessage = 'Unsupported file format. Please upload only .txt, .md or .wiki file'
      }
    },
    readFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.datasetReadme = e.target.result;
        this.validateReadme();
      };
      reader.readAsText(file);
    },
    validateReadme(){
      if(!this.datasetReadme.trim()){
        this.datasetReadmeError = true
        this.datasetReadmeErrorMessage = 'The file uploaded is empty'
      }
      else if(this.datasetReadme.trim().length < 20 || this.datasetReadme.trim().length > 100000){
        this.datasetReadmeError = true
        this.datasetReadmeErrorMessage = 'Dataset README must be between 20 and 100,000 characters long'
      }
      else{
        this.datasetReadmeError = false
        this.datasetReadmeErrorMessage = ''
        switch (this.readmeFormat) {
        case 'txt':
          this.processedReadme = `<pre> ${this.datasetReadme} </pre>`;
          break;
        case 'md':
          this.processedReadme = `<markdown> ${this.datasetReadme} </markdown>`;
          break;
        case 'mediawiki':
          this.processedReadme = this.datasetReadme;
          break;
        default:
          this.processedReadme = this.datasetReadme;
      }
        this.datasetReadmeSuccessMessage = 'File uploaded successfully.'
      }
    },

    resetReadmeError(){
      this.datasetReadmeError = true
      this.datasetReadmeErrorMessage = ''
      this.datasetReadmeSuccessMessage = ''
    },

    addWord() {
      if (this.keywordInput.trim().length < 2) {
        return;
      }
      if (this.keywordInput.trim() !== '') {
        this.keywordList.push(this.keywordInput.trim())
        this.keywordInput = '' // Clear input field after adding the word
      }
    },
    deleteWord(index) {
      this.keywordList.splice(index, 1); // Remove the word at the specified index
    },
    async fetchCategoryOptions() {
      try {
        const response = await this.$artifactCategoriesEndpoint.index();
        if (response) {
          this.categoryOptions = response.categories
        } else {
          console.error('Failed to fetch category options:');
        }
      } 
      catch (error) {
        console.error('Error fetching category options:', error);
      }
    },

    async loadProviderOptions() {
      let response;

      if (this.isAdmin) {
        response = await this.$providerCollectionEndpoint.index();
      } else {
        response = await this.$providerPermissionsList.index([]);
      }

      this.pairs = response;

      this.providerCollectionOptions = this.pairs.map((pair) => ({
        text: `Provider: ${pair.provider} - Use Agreement: ${pair.collection}`,
        value: [pair.provider, pair.collection],
      }));

      if (this.providerCollectionOptions.length > 0) {
        this.isApprovedProvider = true;
      }
      else{
        this.isApprovedProvider = false;
      }

      this.providerPermissionsReceived = true;
    },

    async submit(){
      this.submitCardMessage = '';
      const valid = await this.$refs.form.validate();
      if (!valid || this.datasetReadmeError || this.longDescError || this.shortDescError){
        this.submitCardMessage = 'Please  fill in all required fields in the expected format.'
        return
      }
      this.isProcessing = true

      let uniqueKeywords = [...new Set(this.keywordList)]

      if(this.autoApproveDataset){
        uniqueKeywords.push('action:autoapprove');
      }

      if(this.selectedCategory){
        uniqueKeywords.push('category:'+this.selectedCategory)
      }
      
      let metadata = {"datasetName":this.datasetName,
                  "shortDesc":this.shortDesc,
                  "longDesc":this.longDesc,
                  "datasetClass":(this.datasetClass === null)||(this.datasetClass === '')? 'unclassfied' : this.datasetClass,
                  "commercialAllowed":this.commercialAllowed,
                  "productReviewRequired":this.productReviewRequired,
                  "availabilityStartDateTime":this.availabilityStartDateTime.val,
                  "availabilityEndDateTime":this.availabilityEndDateTime.val,
                  "ongoingMeasurement":this.ongoingMeasurement,
                  "collectionStartDateTime":this.collectionStartDateTime.val,
                  "collectionEndDateTime":this.collectionEndDateTime.val,
                  "byteSize":this.byteSize*(1024**this.byteSizeUnit),
                  "archivingAllowed":this.archivingAllowed,
                  "keywordList":uniqueKeywords.join(','),
                  "formatList":this.formatList,
                  "anonymizationList":this.anonymizationList,
                  "accessList":this.accessList,
                  "providerName":this.providerCollection[0],
                  "uncompressedSize": (this.uncompressedSize === '')|| (this.uncompressedSize === null) ? '' : this.uncompressedSize*(1024**this.uncompressedSizeUnit),
                  "expirationDays":(this.expirationDays === '') || (this.expirationDays === null) ?14:this.expirationDays,
                  "groupingId":this.groupingId,
                  "useAgreement":this.providerCollection[1],
                  "irbRequired":this.irbRequired,
                  "retrievalInstructions":this.retrievalInstructions,
                  "datasetReadme":this.processedReadme,
                } 
      
      for (const key in metadata) {
        if(metadata[key] === null){
          metadata[key] = ''
        }
        if(key !== 'datasetReadme'){
          metadata[key] = this.$sanitize(metadata[key]);
        }
        
      }
      console.log(metadata)
      let response = await this.$artifactContributeEndpoint.create(metadata);

      this.isProcessing = false

      this.formSubmitted = true
      if (response.success == "true") {
        this.formSubmittedError = false
      } else {
        this.formSubmittedError = true
        this.formSubmittedErrorMessage = response.message
      }

    },
    handleNumericInput() {
      // Remove any non-numeric characters from the input
      this.uncompressedSize = this.uncompressedSize.replace(/\D/g, '');
    }
  }
}
//dates and required field validation
</script>

<style scoped>
  .input-bubble-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .bubbles {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .bubble {
    background-color: #e0e0e0;
    border-radius: 16px;
    padding: 5px 10px;
    margin-right: 5px;
    font-size: 14px;
  }

  .bubble-input {
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 14px;
    padding: 5px;
    min-width: 100px; /* Ensure there is space for typing */
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
</style>
