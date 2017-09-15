Vue.directive("draggable", {
  //adapted from https://codepen.io/kminek/pen/pEdmoo
  inserted: function(el, binding, a) {
    Sortable.create(el, {
      draggable: ".draggable",
      onEnd: function(e) {
        /* vnode.context is the context vue instance: "This is not documented as it's not encouraged to manipulate the vm from directives in Vue 2.0 - instead, directives should be used for low-level DOM manipulation, and higher-level stuff should be solved with components instead. But you can do this if some usecase needs this. */
        // fixme: can this be reworked to use a component?
        // https://github.com/vuejs/vue/issues/4065
        // https://forum.vuejs.org/t/how-can-i-access-the-vm-from-a-custom-directive-in-2-0/2548/3
        // https://github.com/vuejs/vue/issues/2873 "directive interface change"
        // `binding.expression` should be the name of your array from vm.data
        // set the expression like v-draggable="items"
        var clonedItems = a.context[binding.expression].filter(function(item) {
          return item;
        });
        clonedItems.splice(e.newIndex, 0, clonedItems.splice(e.oldIndex, 1)[0]);
        a.context[binding.expression] = [];
        Vue.nextTick(function() {
          a.context[binding.expression] = clonedItems;
        });
      }
    });
  }
});

Vue.component("table-head", {
  template: `
    <th 
        v-show="!column.hide" 
        :class=\"{draggable: column.canMove}\"
        @click="sortMe({column: column, event: true})"  
    >
      {{column.name}}
      <i v-if="column.sortable && sort.on === column.id"
          class="fa"
          :class="{'fa-sort-amount-asc': sort.direction === 'asc',
          'fa-sort-amount-desc': sort.direction === 'desc'}"
          aria-hidden="true">
      </i>    
    </th>`,
  props: ["column", "sort"],
  methods: {
    sortMe: function(data) {
      this.$emit("sortcolumn", data);
    }
  }
});

Vue.component("row-person", {
  template: `
    <tr>
      <template v-for="column in columns">
        <td v-show="!column.hide">{{person[column.id]}}</td>
      </template>
    </tr>
`,
  props: ["person", "columns"]
});

var myColumns = [
  { name: "I.D.", id: "id", canMove: false, hide: true },
  { name: "First Name", id: "firstName", canMove: true, sortable: true },
  { name: "Last Name", id: "lastName", canMove: true, sortable: true },
  { name: "Email", id: "email", canMove: true, sortable: true },
];

var people = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "jdoe@example.com",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jsmith@example.com",
  },
  {
    id: 3,
    firstName: "Brian",
    lastName: "Rogers",
    email: "brogers@example.com",
  }
];

var app = new Vue({
  el: "#app",
  data: {
    searchQuery: "",
    columns: myColumns,
    people: people,
    sort: { on: "lastName", direction: "asc", type: "text" }
  },
  methods: {
    sortCol: function(data) {
      var column = data.column;
      if (!column.sortable) return;

      //respond to click vs set from settings
      if (data.event) {
        //change sort order
        if (this.sort.on === column.id) {
          //change sort order
          if (this.sort.direction === "desc" || !this.sort.direction) {
            this.sort.direction = "asc";
          } else {
            this.sort.direction = "desc";
          }
        } else {
          //change sort column, default to asc
          this.sort.on = column.id;
          this.sort.direction = "asc";
          this.sort.type = column.type;
        }
      }

      var direction = this.sort.direction;
      var on = this.sort.on;
      var type = this.sort.type; //fixme implement search functions per type

      this.people.sort(function(a, b) {
        if (direction === "asc") {
          return getProp(a, on).localeCompare(getProp(b, on));
        } else if (direction === "desc") {
          return getProp(b, on).localeCompare(getProp(a, on));
        }
      });
    }
  },
  computed: {
    filteredData: function() {
      //https://vuejs.org/examples/grid-component.html
      var filterKey = this.searchQuery && this.searchQuery.toLowerCase();
      var data = this.people;
      var cols = this.columns;
      if (filterKey) {
        data = data.filter(function(row) {
          return cols.reduce(function(accumulator, col) {
            if (accumulator || !col.id) {
              return accumulator;
            }
            var colVal = col.id;

            return (
              String(getProp(row, colVal)).toLowerCase().indexOf(filterKey) > -1
            );
          }, false);
        });
      }
      return data;
    }
  }
});

function getProp(obj, path) {
  var parts = path.split(".");
  while (parts.length) {
    obj = obj[parts.shift()];
  }
  return obj;
}