//Create instance for each division
var Dashboard = new Dashboard();
var SearchStudents = new SearchStudents();
var Utility = new Utility();
var apiUrl = 'http://localhost:9000'

$(document)
.ready(function() {
  //Initialize routes
  new Routes().init();

  //Intialize utlity
  Utility.init();

  $('#full-spinner').fadeOut();

  $('#menu-button')
  .click(function() {
    Utility.showSidebar();
  });
});