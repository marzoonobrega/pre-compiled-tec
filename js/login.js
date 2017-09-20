// LOGIN COMPONENT

'use strict';


Vue.component('login', {
  template: `
              <form class="login-form">
                <h2>Login</h2>
                <input v-on:click="focus" type="text" id="username" placeholder="Username" class="boxin" >
                <input v-on:click="focus" type="password" id="password" placeholder="Password" class="boxin">
                <div class="clearfix"></div>
                <input v-on:click="checkpass" type="submit" value="Login" class="btn success">
              </form>
            `,
  methods: {
    checkpass: function() {
      event.preventDefault();

      var pass = document.getElementById('password').value; 
      var user = document.getElementById('username').value; 

      if(user === 'mario' && pass === 'mario') {
        alert('Correct!');

        window.location = "./landing.html";
        
      } else {
        alert('Incorrect');
      }
    },
    
    focus: function() {
      var input = document.getElementById('username');
      
      input.style.borderColor = "#FFF";
      
    },
  }
});



var login = new Vue({
  el: '#login'
});
