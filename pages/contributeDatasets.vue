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

    <v-container>
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
              :rules="shortDescRules"
              type="text"
              auto-grow
              clearable
              required
              :maxlength="shortDescCharLimit"
            ></v-text-field>
            <span>{{ shortDesc.length }} / {{ shortDescCharLimit }}</span>

            <div style="font-weight: bold; margin-top:20px;">Provide a detailed description of the dataset<span style='color: red;'><strong> *</strong></span></div>
            <v-textarea
            name="longDescription"
            v-model="longDesc"
            :rules="longDescRules"
            type="text"
            auto-grow
            clearable
            :maxlength="longDescCharLimit"
            required></v-textarea>
            <span>{{ longDesc.length }} / {{ longDescCharLimit }}</span>

            <div style="font-weight: bold; margin-top:20px;">Enter dataset class</div>
            <v-text-field
            name="datasetClass"
            v-model="datasetClass"
            :rules="datasetClassRules"
            type="text"
            auto-grow
            clearable
            ></v-text-field>

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

            <div style="font-weight: bold; margin-top:20px;"> Keywords to facilitate search ? </div>
              <div class="input-bubble-container">
                <div class="bubbles">
                  <span class="bubble" v-for="(word, index) in keywordList" :key="index"
                    >{{ word }}
                    <span class="delete-bubble" @click="deleteWord(index)">×</span>
                  </span>
                  <v-text-field
                    type="text"
                    v-model="keywordInput"
                    @keydown.space.prevent="addWord"
                    @blur="addWord"
                    class="bubble-input"
                  ></v-text-field>
                </div>
              </div>

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

            <div style="font-weight: bold; margin-top:20px;">Provider Name<span style='color: red;'><strong> *</strong></span></div>
            <v-text-field
            name="providerName"
            v-model="providerName"
            :rules="providerNameRules"
            type="text"
            auto-grow
            clearable
            required
            ></v-text-field>

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

            <div style="font-weight: bold; margin-top:20px;">Duration of access (in days)</div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                name="expirationDate"
                v-model="expirationDays"
                type="number"
                auto-grow
                clearable
                required
                ></v-text-field>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">Grouping ID</div>
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

            <!-- USE DUA DROPDOWN -->

            <div style="font-weight: bold; margin-top:20px;">What User Agreement should be used?<span style='color: red;'><strong> *</strong></span></div>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                name="useAgreement"
                v-model="useAgreement"
                :items="duaListOptions"
                auto-grow
                clearable
                required
                ></v-select>
              </v-col>
            </v-row>


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

            <div style="font-weight: bold; margin-top:20px;"> Link to dataset</div>
            <v-text-field
            name="retrievalInstructions"
            v-model="retrievalInstructions"
            auto-grow
            clearable
            ></v-text-field>
            <v-card-actions>
              <v-btn color="primary" type="submit">Submit</v-btn>
            </v-card-actions>
          </v-form>

          </v-card-text>
            
      
         </v-card>
      </v-col>
      </v-row>
      </v-container>
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
      shortDescRules: [
        value => !!value || 'Short description is required',
        value => /^.{10,350}$/.test(value) || 'Short description must be between 10 and 350 characters long',
      ],
      shortDescCharLimit:350,
      longDesc:'',
      longDescRules: [
        value => !!value || 'Long description is required',
        value => /^.{20,10000}$/.test(value) || 'Long description must be between 20 and 10000 characters long',
      ],
      longDescCharLimit:10000, 
      datasetClass:'',
      datasetClassRules: [
        value => /^.{0,30}$/.test(value) || 'Dataset class can be a maximum of 30 characters long',
      ],
      commercialAllowed:'',
      productReviewRequired:'',
      availabilityStartDateTime:{dialog:false, val:null},
      // datetime rule??
      availabilityEndDateTime:{dialog:false, val:null},
      ongoingMeasurement:'',
      collectionStartDateTime:{dialog:false, val:null},
      collectionEndDateTime:{dialog:false, val:null},
      byteSize:'',
      byteSizeRules: [
        value => !!value || 'Byte size (in digits) is required',
        value => /^\d+$/.test(value) || 'Byte size must be a positive integer',
      ],
      byteSizeUnit:0,
      byteSizeUnitRules: [
        value => value!=undefined || 'Byte size unit is required',
      ],
      archivingAllowed:'',
      keywordInput:'',
      keywordList:[],
      anonymizationList:'',
      anonymizationListRules: [
        value => value!=undefined || 'Anonymization method is required',
      ],
      accessList:'',
      providerName:'',
      providerNameRules: [
        value => !!value || 'Provider name is required',
        value => /^COMUNDA:.*/.test(value) || 'Provider name must start with "COMUNDA:"',
      ],
      uncompressedSize:'',
      uncompressedSizeUnit:0,
      uncompressedSizeRules: [
        value => (/^[0-9]{0,20}$/.test(value)) || 'Uncompressed size must be empty or a number with 0 to 20 digits',
      ],
      expirationDays:14,
      groupingId:'',
      groupingIdRules: [
        value => /^.{0,250}$/.test(value) || 'Grouping Id can be a maximum of 250 characters long',
      ],
      useAgreement:'',
      irbRequired:'',
      retrievalInstructions:'',
      trueFalseOptions:[{text:'Yes',value:true},{text:'No',value:false}],
      byteSizeUnitOptions:[{text:'B', value:0},{text:'KB', value:1},{text:'MB', value:2},{text:'GB', value:3}],
      anonymizationListOptions:[{text:'cryptopan/full', value:'cryptopan/full'},{text:'cryptopan/host', value:'cryptopan/host'},{text:'None', value:'None'},{text:'Other', value:"Other"}],
      accessListOptions:[{text:'Google BigQuery', value:'Google BigQuery'},{text:'https', value:'https'},{text:'rsync', value:'rsync'},{text:'other', value:'other'}],
      duaListOptions:['USC','FRGP','MERIT'] 
    }
  },
  watch: {
    longDesc(newVal) {
      if (newVal.length > longDescCharLimit) {
        this.longDesc = newVal.slice(0, longDescCharLimit);
      }
    },
    shortDesc(newVal) {
      if(newVal.length > shortDescCharLimit){
        this.shortDesc = newVal.slice(0, shortDescCharLimit);
      }
    }
  },
  async mounted() {
    
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.favorites,
      userid: state => state.user.userid
    })
  },
  methods:{
    handleDateChange(value) {
      this.dateDialog = false;
      this.availabilityStartDateTime = value;
    },
    addWord() {
        if (this.keywordInput.trim() !== '') {
          this.keywordList.push(this.keywordInput.trim())
          this.keywordInput = '' // Clear input field after adding the word
        }
    },
    deleteWord(index) {
      this.keywordList.splice(index, 1); // Remove the word at the specified index
    },
    async submit(){
      
      const valid = await this.$refs.form.validate();
      if (!valid){
        console.log("not valid!")
        return
      }
      
      let metadata = {"datasetName":this.datasetName,
                  "shortDesc":this.shortDesc,
                  "longDesc":this.longDesc,
                  "datasetClass":this.datasetClass,
                  "commercialAllowed":this.commercialAllowed,
                  "productReviewRequired":this.productReviewRequired,
                  "availabilityStartDateTime":this.availabilityStartDateTime.val,
                  "availabilityEndDateTime":this.availabilityEndDateTime.val,
                  "ongoingMeasurement":this.ongoingMeasurement,
                  "collectionStartDateTime":this.collectionStartDateTime.val,
                  "collectionEndDateTime":this.collectionEndDateTime.val,
                  "byteSize":this.byteSize*(1024**this.byteSizeUnit),
                  "archivingAllowed":this.archivingAllowed,
                  "keywordList":this.keywordList,
                  "anonymizationList":this.anonymizationList,
                  "accessList":this.accessList,
                  "providerName":this.providerName,
                  "uncompressedSize":this.uncompressedSize*(1024**this.uncompressedSizeUnit),
                  "expirationDays":this.expirationDays==''?14:this.expirationDays,
                  "groupingId":this.groupingId,
                  "useAgreement":this.useAgreement,
                  "irbRequired":this.irbRequired,
                  "retrievalInstructions":this.retrievalInstructions} 
      console.log("Form Submitted",metadata)
      
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
</style>
