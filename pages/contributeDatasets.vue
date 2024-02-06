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
              Form Title
            </v-card-title>
          <v-card-text>
          <v-form @submit.prevent="submitForm" >
            <div style="font-weight: bold; margin-top:20px;">Enter dataset name<span style='color: red;'><strong> *</strong></span></div>
            <v-text-field
            name="datasetName"
            v-model="datasetName"
            type="text"
            auto-grow
            clearable
            required></v-text-field>

            <div style="margin-top: 20px; font-weight: bold;">Briefly describe the dataset<span style='color: red;'><strong> *</strong></span></div>
            <v-text-field
              name="shortDescription"
              v-model="shortDesc"
              type="text"
              auto-grow
              clearable
              required
            ></v-text-field>

            <div style="font-weight: bold; margin-top:20px;">Provide a detailed description of the dataset<span style='color: red;'><strong> *</strong></span></div>
            <v-textarea
            name="longDescription"
            v-model="longDesc"
            type="text"
            auto-grow
            clearable
            required></v-textarea>

            <div style="font-weight: bold; margin-top:20px;">Enter dataset class</div>
            <v-text-field
            name="datasetClass"
            v-model="datasetClass"
            type="text"
            auto-grow
            clearable
            ></v-text-field>

            <div style="font-weight: bold; margin-top:20px;">Is commercial use of the dataset allowed?</div>
            <v-select
            name="commercialUse"
            v-model="commercialAllowed"
            :items="trueFalseOptions"
            auto-grow
            clearable
            ></v-select>

            <div style="font-weight: bold; margin-top:20px;">Should the results obtained from the dataset be reviewed by the provider before publication?</div>
            <v-select
            name="productReview"
            v-model="productReviewRequired"
            :items="trueFalseOptions"
            auto-grow
            clearable
            ></v-select>

            <div style="font-weight: bold; margin-top:20px;">Is the collection still in progress?</div>
            <v-select
            name="ongoingMeasurement"
            v-model="ongoingMeasurement"
            :items="trueFalseOptions"
            auto-grow
            clearable
            ></v-select>

            <div style="font-weight: bold; margin-top:20px;">What is the size of the dataset?<span style='color: red;'><strong> *</strong></span></div>
            <v-row>
              <v-col cols="3" sm="3">
                <v-text-field
                  name="byteSize"
                  type="number"
                  v-model="byteSize"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="1" md="1">
                <v-select
                  name="Unit"
                  v-model="byteSizeUnit"
                  :items="byteSizeUnitOptions"
                ></v-select>
              </v-col>
            </v-row>


            <div style="font-weight: bold; margin-top:20px;"> Once downloaded, can the contents be retained and used indefinitely?</div>
            <v-select
            name="archivingAllowed"
            v-model="archivingAllowed"
            :items="trueFalseOptions"
            auto-grow
            clearable
            ></v-select>

            <div style="margin-top: 20px; font-weight: bold;">What anonymization was used if any?<span style='color: red;'><strong> *</strong></span></div>
            <v-select
              name="anonymizationList"
              v-model="anonymizationList"
              :items="anonymizationListOptions"
              auto-grow
              clearable
              required
            ></v-select>

            <div style="margin-top: 20px; font-weight: bold;">Types of access given?</div>
            <v-select
              name="accessList"
              v-model="accessList"
              :items="accessListOptions"
              auto-grow
              clearable
            ></v-select>

            <div style="font-weight: bold; margin-top:20px;">Provider Name<span style='color: red;'><strong> *</strong></span></div>
            <v-text-field
            name="providerName"
            v-model="providerName"
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
                  type="number"
                  v-model="uncompressedSize"
                ></v-text-field>
              </v-col>
              <v-col cols="1" md="1">
                <v-select
                  name="Unit"
                  v-model="uncompressedSizeUnit"
                  :items="byteSizeUnitOptions"
                  placeholder="Select unit"
                ></v-select>
              </v-col>
            </v-row>

            <div style="font-weight: bold; margin-top:20px;">Duration of access (in weeks)</div>
            <v-text-field
            name="expirationDate"
            v-model="expirationDays"
            type="number"
            auto-grow
            clearable
            required
            ></v-text-field>

            <div style="font-weight: bold; margin-top:20px;"> Is IRB approval required for access?</div>
            <v-select
            name="irbRequired"
            v-model="irbRequired"
            :items="trueFalseOptions"
            auto-grow
            clearable
            ></v-select>
          </v-form>

          </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="submitForm">Submit</v-btn>
            </v-card-actions>
      
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
      shortDesc:'',
      longDesc:'',
      datasetClass:'',
      commercialAllowed:'',
      productReviewRequired:'',
      availabilityStartDateTime:'',
      availabilityEndDateTime:'',
      ongoingMeasurement:'',
      collectionStartDateTime:'',
      collectionEndDateTime:'',
      byteSize:'',
      byteSizeUnit:0,
      archivingAllowed:'',
      keywordList:'',
      anonymizationList:'',
      accessList:'',
      providerName:'',
      uncompressedSize:'',
      uncompressedSizeUnit:0,
      expirationDays:'',
      groupingId:'',
      useAgreement:'',
      irbRequired:'',
      retrievalInstructions:'',
      trueFalseOptions:[{text:'Yes',value:true},{text:'No',value:false}],
      byteSizeUnitOptions:[{text:'B', value:0},{text:'KB', value:1},{text:'MB', value:2},{text:'GB', value:3}],
      anonymizationListOptions:[{text:'cryptopan/full', value:'cryptopan/full'},{text:'cryptopan/host', value:'cryptopan/host'},{text:'None', value:'None'},{text:'Other', value:"Other"}],
      accessListOptions:[{text:'Google BigQuery', value:'Google BigQuery'},{text:'https', value:'https'},{text:'rsync', value:'rsync'},{text:'other', value:'other'}]
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
    submitForm(){
    let metadata = {"datasetName":this.datasetName,
                  "shortDesc":this.shortDesc,
                  "longDesc":this.longDesc,
                  "datasetClass":this.datasetClass,
                  "commercialAllowed":this.commercialAllowed,
                  "productReviewRequired":this.productReviewRequired,
                  "availabilityStartDateTime":'',
                  "availabilityEndDateTime":'',
                  "ongoingMeasurement":this.ongoingMeasurement,
                  "collectionStartDateTime":'',
                  "collectionEndDateTime":'',
                  "byteSize":this.byteSize*(1024**this.byteSizeUnit),
                  "archivingAllowed":this.archivingAllowed,
                  "keywordList":'',
                  "anonymizationList":this.anonymizationList,
                  "accessList":this.accessList,
                  "providerName":this.providerName,
                  "uncompressedSize":this.uncompressedSize*(1024**this.uncompressedSizeUnit),
                  "expirationDays":this.expirationDays,
                  "groupingId":'',
                  "useAgreement":'',
                  "irbRequired":this.irbRequired,
                  "retrievalInstructions":''} 
      console.log("Form Submitted",metadata)
    }

  }
}
</script>
