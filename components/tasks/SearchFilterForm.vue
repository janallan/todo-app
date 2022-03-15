<template>
  <v-expansion-panels
    v-model="showFilter"
  >
    <v-expansion-panel>
      <v-expansion-panel-header>Search, Filter &amp; Sort</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" sm="12" md="8" lg="8">
            <v-text-field
              v-model="search"
              label="Search Title or Description"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-select
              v-model="priority_by"
              :items="priority_option"
              label="Prioritization"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-menu
              ref="menu"
              v-model="completed_menu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="completed_dates.join(' ~ ')"
                  label="Completed Date"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="completed_dates" range :min="completed_dates[0]"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-menu
              ref="menu"
              v-model="due_menu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="due_dates.join(' ~ ')"
                  label="Due Date"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="due_dates" range :min="due_dates[0]"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-menu
              ref="menu"
              v-model="archived_menu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="archived_dates.join(' ~ ')"
                  label="Archived Date"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="archived_dates" range :min="archived_dates[0]"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="12" md="8" lg="8">
            <v-select
              v-model="sort_using"
              label="Sort Using"
              outlined
              :items="sort_using_option"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-select
              v-model="sort_by"
              label="Sort By"
              outlined
              :items="sort_by_option"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="3" lg="3">
            <v-switch
              v-model="show_completed"
              label="Show Completed"
              class="mt-0"
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="12" md="3" lg="3">
            <v-switch
              v-model="show_archived"
              label="Show Archived"
              class="mt-0"
            ></v-switch>

          </v-col>
          <v-col cols="12" sm="12" md="3" lg="3">
            <v-btn
              color="accent"
              block
              outlined
              @click="clear()"
            >
              Clear Filter
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="3" lg="3">
            <v-btn
              color="primary"
              block
              @click="apply()"
            >
              Apply Filter
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      require: true,
    },
  },
  data: () => ({
    search: '',
    show_archived: false,
    show_completed: false,
    showFilter: false,
    completed_dates: [],
    due_dates: [],
    archived_dates: [],
    completed_menu: false,
    due_menu: false,
    archived_menu: false,
    priority_by: '',
    priority_option: ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'],
    filters: '',
    sort_by: '-',
    sort_by_option:[
      {
        text: "ASC",
        value:""
      },
      {
        text:"DESC",
        value: "-",
      }
    ],
    sort_using: 'created_at',
    sort_using_option: [
      {
        text: "Title",
        value: "title",
      },
      {
        text: "Description",
        value: "description",
      },
      {
        text: "Created Date",
        value: "created_at",
      },
      {
        text: "Due Date",
        value: "due_date",
      },
      {
        text: "Priotization",
        value: "prioritzation",
      }

    ],
  }),
  computed: {
    sortString(){
      return `&sort=${this.sort_by}${this.sort_using}`
    },
    searchTextString(){
      if (this.search === '') {
        return ''
      }
      return `&filter[search]=${this.search}`
    },
    priorityString(){
      if (this.priority_by === '') {
        return ''
      }
      return `&filter['prioritization]=${this.priority_by}`
    }
  },
  watch: {
    show(e){
      this.showFilter = e
    },
    completed_dates(e) {
      if (e.length === 2) {
        this.completed_menu = false
      }
    },
    due_dates(e) {
      if (e.length === 2) {
        this.due_menu = false
      }
    },
    archived_dates(e) {
      if (e.length === 2) {
        this.archived_menu = false
      }
    },
  },
  created() {
  },
  methods: {
    apply() {
      const archived = `&filter[show_archived]=${this.show_archived ? 1 : 0}`
      const completed = `&filter[show_completed]=${this.show_completed ? 1 : 0}`
      this.dateFilterString()
      this.filters = `${this.sortString}${completed}${archived}${this.filters}${this.searchTextString}${this.priorityString}`
      this.$emit('apply', this.filters)
    },
    clear(){
      this.show_archived = false
      this.show_completed = false
      this.search = ''
      this.completed_dates = []
      this.due_dates = []
      this.archived_dates = []
      this.priority_by = ''
      this.sort_by = '-'
      this.sort_using = 'created_at'
      this.apply()
    },
    dateFilterString() {
      let filter = '';
      if (this.completed_dates.length === 2) {
        filter = `&filter[completed][from]=${this.completed_dates[0]}&filter[date][to]=${this.completed_dates[1]}`
      }
      if (this.due_dates.length === 2) {
        filter += `&filter[due][from]=${this.due_dates[0]}&filter[date][to]=${this.due_dates[1]}`
      }
      if (this.archived_dates.length === 2) {
        filter += `&filter[archived][from]=${this.archived_dates[0]}&filter[date][to]=${this.archived_dates[1]}`
      }

      this.filters = filter
    },
  },
}
</script>
