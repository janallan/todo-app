<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent
      :width="todo.id ? '1000' : '500'">
      <v-card>
        <v-progress-linear
          v-model="bar"
          :color="getprioritizationColor(todo.prioritization)"
        ></v-progress-linear>
        <v-card-title class="text-h5 lighten-2">
          {{ todo.id ? todo.title : 'New Task' }}
        </v-card-title>

        <v-container>
          <v-row>
            <v-col cols="12" sm="12"
              :md="todo.id ? '8' : '12'"
              :lg="todo.id ? '8' : '12'"
            >
              <v-form ref="form" v-model="valid" class="mt-4" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="data.title"
                      label="Title"
                      outlined
                      :rules="rules.title"
                      :error-messages="errors.title"
                      @keyup="errors.title = []"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="data.description"
                      label="Description"
                      name="description"
                      outlined
                      :rules="rules.description"
                      :error-messages="errors.description"
                      @keyup="errors.description = []"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6">
                    <v-select
                      v-model="data.prioritization"
                      label="Prioritization"
                      outlined
                      :items="priority_option"
                      :rules="rules.prioritization"
                      :error-messages="errors.prioritization"
                      @change="errors.prioritization = []"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6">
                    <v-menu
                      ref="menu"
                      v-model="date_menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          :value="data.due_date"
                          label="Archived Date"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="data.due_date" :min="current_date"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="todo.id"
                  color="error"
                  large
                  text
                  @click="confirmDelete = true"
                > Delete </v-btn>
                <v-btn color="accent" large text @click="cancel"> Close </v-btn>
                <v-btn color="primary" large text @click="save">
                  <span v-if="!loading">Save</span>
                  <v-progress-circular
                    v-else
                    indeterminate
                    color="primary"
                    size="25"
                  ></v-progress-circular>
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" sm="12" md="4" lg="4"
              v-if="todo.id"
            >
              <span class="text-subtitle-2 text--secondary">Tags</span>
              <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="details.tags"
                    class="mb-4"
                    hide-selected
                    multiple
                    persistent-hint
                    small-chips
                    :items="tag_options"
                    :search-input.sync="tag_search"
                    @change="setTags"
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            No results matching "<strong>{{ tag_search }}</strong>". Press <kbd>enter</kbd> to create a new one
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-col>
              </v-row>
              <span class="text-subtitle-2 text--secondary">Attachments</span>
              <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col cols="12">
                  <v-chip
                    v-for="(attachment, key) in details.attachments" :key="key"
                    class="ma-1"
                    close
                    @click:close="removeAttachment(attachment.id)"
                  >
                    <a @click="downloadAttachment(attachment.id)">{{ attachment.file_name }}</a>
                  </v-chip>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="files"
                    chips
                    multiple
                    label="Attachments"
                    :error-messages="errors.attachments"
                    @change="fileSelected"
                  ></v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    color="accent"
                    outlined
                    block
                    @click="uploadAttachment"
                  >Upload</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      message="Are you sure you want to delete this Task?"
      :show="confirmDelete"
      :loading="deleting"
      @cancel="confirmDelete = false"
      @confirm="deleteTask"
    />
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      require: true,
    },
    todo: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    bar: 100,
    confirmDelete: false,
    deleting: false,
    dialog: false,
    loading: false,
    data: {},
    details: {},
    valid: false,
    files: {},
    actual_file: '',
    tag_search: '',
    tag_options: [],
    date_menu: false,
    current_date:new Date().toISOString().slice(0,10),
    priority_option: ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'],
    rules: {
      title: [(v) => !!v || 'The title field is required.',],
      description: [(v) => !!v || 'The description field is required.'],
      prioritization: [(v) => !!v || 'The prioritization field is required.'],
      due_date: [],
    },
    errors: {
      title: [],
      description: [],
      prioritization: [],
      due_date: [],
      attachments: [],
    },
  }),
  computed: {
  },
  watch: {
    show(e){
      this.dialog = e
      this.loading = false

      if(e && this.todo.id){
        this.getTags()
      }
    },
    todo(e){
      this.data = {
        title: e.title,
        description: e.description,
        prioritization: e.prioritization,
        due_date: e.due_date,
      }
      this.details = this.todo
    },
  },
  created() {
  },
  methods: {
    async getTags(){
      await this.$store.dispatch('tasks/availableTags', this.todo.id)
        .then((response) => {
          const data = response.data
          const tags = data.data
          this.tag_options = []
          this.tag_options = tags.map((tag) => { return tag.name; })
        })
    },
    getprioritizationColor(prioritization){
      switch (prioritization) {
        case "URGENT":
          return "error"
          break;
        case "HIGH":
          return "warning"
          break;
        case "NORMAL":
          return "primary"
          break;
        case "LOW":
          return "info"
          break;
        default:
          return "primary"
          break;
      }
    },
    cancel(){
      this.$emit('cancel')
    },
    save() {
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        if (this.todo.id) {
          this.updateTask()
        } else {
          this.addTask()
        }
      }
    },
    async addTask(){
      await this.$store.dispatch('tasks/store', this.data)
        .then((response) => {
          this.apiCallback('Task successfully added!',true)
        })
        .catch((error) => {
          if (error.response) {
            const data = error.response.data
            this.errorCallback(data)
          }
        })
    },
    async updateTask(){
      const param = {
        id: this.todo.id,
        data: this.data,
      }
      await this.$store.dispatch('tasks/update', param)
        .then((response) => {
          this.apiCallback('Task successfully updated!',true)
        })
        .catch((error) => {
          if (error.response) {
            const data = error.response.data
            this.errorCallback(data)
          }
        })
    },
    async deleteTask(){
      console.log("delete");
      this.deleting = true
      await this.$store.dispatch('tasks/delete', this.todo.id)
        .then((response) => {
          this.apiCallback('Task successfully deleted!', true)
        })
        .catch((error) => {
          if (error.response) {
            const data = error.response.data
            this.errorCallback(data)
          }
        })
    },
    async setTags(){
      this.loading = true
      const params = {
        tags: this.details.tags,
        id: this.todo.id
      }

      await this.$store.dispatch('tasks/setTags', params)
        .then((response) => {
          this.apiCallback('Tag successfully updated!',false)
          this.loading = false
          const data = response.data
          this.details = data.data
          this.getTags()
        })
        .catch((error) => {
          if (error.response) {
            const data = error.response.data
            this.errorCallback(data)
          }
        })
    },
    async uploadAttachment(){
      // this.files = this.$refs.file.files[0];
      console.log(this.actual_file)
      let formData = new FormData();

      const count =  this.actual_file.length
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          formData.append(`attachments[${i}]`, this.actual_file[i]);
        }

        const url = `/task/${this.todo.id}/attachments/upload`
        this.$axios.post( url,
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
        )
        .then((response) => {
          this.apiCallback('Attachments successfully uploaded!',false)
          this.loading = false
          const data = response.data
          this.details = data.data
          this.files = {}
        })
        .catch((error) => {
          if (error.response) {
            const data = error.response.data
            if (data.http_status === 422) {
              this.errors.attachments = data.message
            }
          }
        })
      }
      else {
        this.errors.attachments = ['Select file to be upload']
      }

    },
    fileSelected(e){
      this.actual_file = e
      this.errors.attachments = []
    },
    async removeAttachment(attachment){
      console.log(attachment)
      const param = {
        id: this.todo.id,
        attachment: attachment
      }
      await this.$store.dispatch('tasks/removeAttachment', param)
      .then((response) => {
        this.apiCallback('Attachment successfully removed!',false)
        this.loading = false
        const data = response.data
        this.details = data.data
      })
      .catch((error) => {
        if (error.response) {
          const data = error.response.data
          this.errorCallback(data)
        }
      })
    },

    async downloadAttachment(attachment)
    {
      const param = {
        id: this.todo.id,
        attachment: attachment
      }
      await this.$store.dispatch('tasks/downloadAttachment', param)
      .then((response) => {
          const url = response.data
          // window.open(url, '_blank')
          location.href = url
        })
    },


    errorCallback(data){
      this.apiCallback(data.message, false)
      if (data.http_status === 422) {
        this.errors = data.errors
      }
      this.loading = false
    },
    apiCallback(message, success) {
      this.$store.commit('snackbar/toggle', message)
      if (success) {
        setTimeout(() => {
          this.cancel()
        }, 300);
      }
      this.deleting = false
      this.confirmDelete = false
    },
  },
}
</script>
