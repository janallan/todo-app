<template>
  <div>
    <v-fab-transition>
      <v-btn
        color="success"
        class="add-button"
        fab
        @click="add()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <template v-if="loading">
      <v-row v-for="i in 3" :key="i + 'tr'">
        <v-col v-for="j in 3" :key="j + 'td'"
          cols="12" sm="12" md="4" lg="4"
        >
          <v-skeleton-loader
            height="300"
            class="mb-6"
            :boilerplate="true"
            elevation="2"
            type="article, actions"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

    </template>
    <template v-else>
      <v-row>
        <v-col cols="12">
          <SearchFilterForm
            :show="showFilter"
            @click="showFilter = !showFilter"
            @apply="applyFilter"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(todo, key) in todos" :key="key"
          cols="12" sm="12" md="4" lg="4"
        >
          <v-card>
            <div
              @click="update(todo)"
            >
              <v-progress-linear
                v-model="bar"
                :color="getTagColor(todo.prioritization)"
              ></v-progress-linear>

                <v-chip
                  :color="getTagColor(todo.prioritization)"
                  class="ma-1 float-right float-top"
                >
                  {{ todo.prioritization }}
                </v-chip>
              <v-card-title
                class="d-block text-truncate"
              >
                <span class="text-h6 font-weight-light">{{ todo.title}}</span>
              </v-card-title>
              <v-card-text>
                <template>
                  <v-card
                    tile
                    elevation="0"
                    max-height="100"
                    class="overflow-auto ma-0"
                  >
                    <v-card-text>{{ todo.description }}</v-card-text>
                  </v-card>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col cols="12">
                    <v-tooltip
                      v-if="todo.due_date"
                      bottom
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          :color="todo.days_before_due > 3
                                ? 'primary'
                                : (todo.days_before_due <= 0 ? 'error' : 'warning')"
                          v-bind="attrs"
                          v-on="on"
                          outlined
                          rounded
                          small
                        >
                          <v-icon
                            left
                            dark
                          >
                            mdi-calendar
                          </v-icon>
                          {{ todo.due_date }}
                        </v-btn>
                      </template>
                      <span>Due Date</span>
                    </v-tooltip>
                    <v-tooltip
                      v-if="arrayCount(todo.attachments) > 0"
                      bottom
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          outlined
                          rounded
                          small
                        >
                          <v-icon
                            left
                            dark
                          >
                            mdi-attachment
                          </v-icon>
                          {{ arrayCount(todo.attachments) }}
                        </v-btn>
                      </template>
                      <span>Attachment</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-card-subtitle
                v-if="arrayCount(todo.tags)"
              >
                <span class="text-subtitle-2">Tags:</span>
                <v-chip
                  v-for="(tag, key) in todo.tags" :key="key"
                  outlined
                >
                  {{ tag }}
                </v-chip>
              </v-card-subtitle>
              <v-divider></v-divider>
            </div>
            <v-card-actions>
              <v-row>
                <v-col cols="12"
                  align="right"
                >

                  <v-btn
                    v-if="todo.completed_at"
                    color="primary"
                    small
                    text
                    @click="incomplete(todo.id)"
                  >
                    Mark as To Do
                  </v-btn>
                  <v-btn
                    v-else
                    color="success"
                    small
                    text
                    @click="completed(todo.id)"
                  >
                    Mark as Completed
                  </v-btn>

                  <v-btn
                    v-if="todo.archived_at"
                    color="warning"
                    small
                    text
                    @click="restore(todo.id)"
                  >
                    Restore
                  </v-btn>
                  <v-btn
                    v-else
                    color="error"
                    small
                    text
                    @click="archive(todo.id)"
                  >
                    Archive
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <div v-if="last_page !== 1" class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination
                  v-model="page"
                  class="my-4"
                  :length="last_page"
                  next
                  prev
                  @input="list"
                ></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>

    <TaskFormModal
      :show="showForm"
      :todo="todoData"
      @cancel="close()"
    />
  </div>
</template>
<script>
export default {
  data: () => ({
    loading:false,
    todos: {},
    bar: 100,
    prio: 'ma-2 urgent',
    page: 1,
    showFilter: false,
    dates: [],
    menu: false,
    filterString: '&sort=-created_at&filter[show_completed]=0&filter[show_archived]=0',
    last_page: 1,
    showForm: false,
    todoData: {},
    tag_options: {},
  }),
  computed: {
    filterSearchSortString(){
      return this.filterString
    },
  },
  watch: {
    filterString(e){
      this.list()
    },
    dates(e) {
      if (e.length === 2) {
        this.menu = false
        this.list()
      }
    },
  },
  created() {
    this.list(this.page);
  },
  methods: {
    list(page = 1){
      this.page = page
      this.loading = true
      this.$axios
        .get(
          `task?page=${page}${this.filterSearchSortString}`
        )
        .then((response) => {
          const data = response.data
          this.todos = data.data
          this.last_page = data.meta.last_page
          this.loading = false
        })
    },
    applyFilter(filter){
      this.showFilter = !this.showFilter
      this.filterString = filter
    },
    getTagColor(tag){
      switch (tag) {
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
          return ""
          break;
      }
    },

    arrayCount(array){
      return array.length
    },
    close(){
      this.showForm = false
      this.list()
    },
    update(todo){
      this.todoData = todo
      this.showForm = true
    },
    add(){
      this.todoData = {}
      this.showForm = true
    },
    async completed(taskId){
      this.loading = true

      await this.$store.dispatch('tasks/completed', taskId)
        .then((response) => {
          this.loading = false
          this.$store.commit('snackbar/toggle', "Task successfully marked as Completed");
          this.list(this.page)
        })
    },
    async incomplete(taskId){
      this.loading = true
      await this.$store.dispatch('tasks/incomplete', taskId)
        .then((response) => {
          this.loading = false
          this.$store.commit('snackbar/toggle', "Task successfully marked as To Do/Incomplete");
          this.list(this.page)
        })
    },
    async archive(taskId){
      this.loading = true
      await this.$store.dispatch('tasks/archive', taskId)
        .then((response) => {
          this.loading = false
          this.$store.commit('snackbar/toggle', "Task successfully marked as Archived");
          this.list(this.page)
        })
    },
    async restore(taskId){
      this.loading = true
      await this.$store.dispatch('tasks/restore', taskId)
        .then((response) => {
          this.loading = false
          this.$store.commit('snackbar/toggle', "Task successfully marked as Restored");
          this.list(this.page)
        })
    },
  },
}
</script>
<style lang="scss">
.add-button {
  z-index: 9;
	position:fixed;
	bottom:20px;
	right:20px;
  color:red;
	box-shadow: 2px 2px 3px #999;
}
</style>
