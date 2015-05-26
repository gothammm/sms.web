function Utility() {
  var sideBar, _self = this, onHiddenCbs = [], mainContent = '#main-content';

  //Close sidebar
  this.hideSidebar = function() {
    sideBar
    .sidebar('hide');
  }

  //open sidebar
  this.showSidebar = function() {
    sideBar
    .sidebar('show')
  }

  //Load template
  this.load = function(templateUrl, callback) {
    $(mainContent)
    .fadeOut('fast', function() {
      $(mainContent)
      .load(templateUrl, function() {
        $(mainContent).fadeIn();
        if(callback)
          callback();
      });
    });
  }

  this.init = function() {
    sideBar = $('#sidebar-main')
    .sidebar('setting', {
      transition: 'overlay'
    });
    sideBar
    .find('a')
    .click(function() {
      _self.hideSidebar();
    })
  }
}