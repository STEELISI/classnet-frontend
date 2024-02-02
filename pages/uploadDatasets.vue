<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-card class="pa-5" outlined tile>
            <v-file-input
              v-model="files"
              show-size
              @change="handleFiles"
              multiple
              small-chips
              label="Drag and drop files here"
              hint="or click to select files"
              persistent-hint
              prepend-icon="mdi-file-multiple"
              accept="*/*"
            ></v-file-input>
            <v-btn color="primary" class="mt-3" @click="uploadFiles">
              Upload
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    head() {
      return {
        title: 'SEARCCH Upload Dataset',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'SEARCCH Upload Dataset'
          }
        ]
        }
    },
    data: () => ({
      files: [],
    }),
    methods: {
      handleFiles(event) {
        const inputFiles = event.target.files;
        if (inputFiles.length > 0) {
          this.files = [...inputFiles];
        }
      },
      async uploadFiles() {
        if (this.files.length > 0) {
          // Placeholder: Implement the upload logic here
          // This could be an API call to your backend server
          // Example:
          /*
          const formData = new FormData();
          this.files.forEach(file => {
            formData.append('files[]', file);
          });
          try {
            const response = await axios.post('your-upload-endpoint', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log('Upload successful', response.data);
          } catch (error) {
            console.error('Upload failed', error);
          }
          */
          console.log("Files ready for upload:", this.files);
        }
      }
    }
  };
  </script>
  
  
  