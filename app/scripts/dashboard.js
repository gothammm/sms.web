function Dashboard() {
  this.init = function() {
    $('#dashboard-menu-btn').addClass('active');
    Utility.load('/views/Dashboard.html');
  }

  this.exit = function() {
    //Unbind all events
    $('#dashboard-menu-btn').removeClass('active');
  }
}
