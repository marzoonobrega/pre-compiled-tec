var users = [];
var templates = [
  { id: 1, name: 'Dark', value: 'css/nightmode.css'},
  { id: 2, name: 'Light', value: 'css/light.css'}
];

var app = new Vue({
  el: '#interface',
  data: {
    templates: templates,
    current_template: templates[0]
  },
  methods: {
    setTemplate: function(id){
      var selected_template = this.templates.filter(function(ele){
        return (ele.id == id)
      })[0];

      this.current_template = selected_template;
    }
  }
});
