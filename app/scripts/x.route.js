function Routes() {
  this.init = function() {
    Path
    .map("#/users")
    .to(function(){
      alert("Users!");
    });

    //Dashboard route
    Path
    .map('#/dashboard')
    .to(function() {
      console.log('Dashboard');
      Dashboard.init();
    })
    .exit(function() {
      Dashboard.exit();
    });

    //Search students
    Path
    .map('#/search/students')
    .to(function() {
      console.log('Search students');
      SearchStudents.init();
    })
    .exit(function() {
      SearchStudents.exit();
    });


    Path.root("#/dashboard");
    Path.rescue(function(){
      window.location.href = '#/dashboard';
    });
    Path.listen();
  }
}