function SearchStudents() {
  var _self = this;
  _self.data = [];
  this.init = function() {
    _self.data = [];
    Utility
    .load('/views/students.html', function() {
      refresh();
      //Attaching events
      attachEvents();
    });
  }

  this.exit = function() {

  }

  function refresh() {
    $
    .get(apiUrl + '/student')
    .then(function(data) {
      _self.data = data;
      renderData(_self.data);
    })
    .fail(function(data) {
      _self.data = [];
      renderData(_self.data);
    });
  } 

  function attachEvents() {
    //List out all the events to be attached.
    var formRules = {
      name: {
        identifier: 'name',
        rules: [{
          type: 'empty',
          prompt: "Please enter student's name"
        }]
      }, 
      dob: {
        identifier: 'dob',
        rules: [{
          type: 'empty',
          prompt: "Please enter student's age"
        }]
      },
      school: {
        identifier: 'school',
        rules: [{
          type: 'empty',
          prompt: "Please enter student's school details"
        }]
      },
      level: {
        identifier: 'level',
        rules: [{
          type: 'empty',
          prompt: 'Please enter current level'
        }]
      },
      country: {
        identifier: 'country',
        rules: [{
          type: 'empty',
          prompt: 'Please enter country'
        }]
      },
      score: {
        identifier: 'score',
        rules: [{
          type: 'empty',
          prompt: 'Please enter SAT score'
        }]
      }
    };
    $('#add-student-button').click(addStudent);

    $('#search-student-field').keyup(searchStudent);

    $('#add-student-form')
    .find('.form')
    .form(formRules, {
      inline: true,
      onSuccess: function() {
        submitStudentDetails('save');
      },
      onFailure: function(v) {
        console.log(v);
      }
    });

    //Update form
    $('#update-student-form')
    .find('.form')
    .form(formRules, {
      inline: true,
      onSuccess: function() {
        if(_self.stopEditSubmit) {
          _self.stopEditSubmit = false;
          return false;
        }
        submitStudentDetails('edit');
      },
      onFailure: function(v) {
        console.log(v);
      }
    });
  }

  function submitStudentDetails(type) {
    var req;
    if(type === 'save') {
      var form = $('#add-student-form').find('.form');
      req =  $.post(apiUrl + '/student', form.form('get values'));
    } else {
      var form = $('#update-student-form').find('.form');
      req = $.ajax({
        url: apiUrl + '/student',
        method: 'PUT',
        data: form.form('get values')
      });//$.put(apiUrl + '/student', form.form('get values'));
    }

    req
    .then(function(data) {
      refresh();
      console.log(data);
      alert('Student data ' + type === 'save' ? 'saved' : 'updated' + ' successfully!');
      $('#add-student-form').modal('hide');
      $('#update-student-form').modal('hide');
    })
    .fail(function(err) {
      refresh();
      console.log(err);
    });
  }

  function searchStudent(text) {
    var field = $(this), val = field.val();
    if(val) {
      var filteredStudents = _self.data.filter(function(item) {
        return item.name.indexOf(val) > -1;
      });
      renderData(filteredStudents);
    } else {
      renderData(_self.data);
    }
  }

  function deleteStudent(data) {
    console.log(data.data);
    var data = data.data;
    $.ajax({
      method: 'DELETE',
      url: apiUrl + '/student/' + data._id,
    })
    .then(function() {
      refresh();
    })
    .fail(function() {
      alert("unexpected error occurred");
      refresh();
    });
  }


  function addStudent() {
    $('#add-student-form')
    .modal({
      closable: false,
      onDeny: function() {
        return false;
      },
      onApprove: function() {
        $('#add-student-form')
        .find('.form')
        .form('validate form');
        return false;
      }
    })
    .modal('show');
  }

  function getFormattedDate(date) {
    var newDate = new Date(date);
    var dd = newDate.getDate();
    var mm = newDate.getMonth()+1; //January is 0!

    var yyyy = newDate.getFullYear();
    if(dd < 10) {
        dd= '0'+dd
    } 
    if(mm < 10) {
        mm='0'+mm
    } 
    return yyyy + '-' + mm +'-'+ dd;
  }

  function editStudent(data) {
    _self.stopEditSubmit = true;
    console.log(data.data);
    var data = data.data;
    $('#update-student-form')
    .find('.form')
    .form('set values', {
      id: data._id,
      name: data.name,
      gender: data.gender,
      dob: getFormattedDate(data.dob),
      school: data.school,
      level: data.level,
      country: data.country,
      score: data.satScore
    });
    
    $('#update-student-form')
    .modal({
      closable: false,
      onDeny: function() {
        return false;
      },
      onApprove: function() {
        $('#update-student-form')
        .find('.form')
        .form('validate form');
        return false;
      }
    })
    .modal('show');
  }

  function renderData(data) {
    $('.students-grid').empty();
    for(var i = 0; i < data.length; i++) {
      var template = getCardTemplate(data[i]);
      $('.students-grid').append(template);
    }
  }

  function getCardTemplate(obj) {
    var cardDiv = $('<div class="ui card" id="' + obj._id + '"></div>');
    var contentDiv = $('<div class="content"></div>');
    var deleteButton = $('<i class="right floated trash icon"></i>').click(obj, deleteStudent);
    var editButton = $('<i class="right floated edit icon"></i>').click(obj, editStudent);
    var nameHeader = $('<div class="header">' + obj.name + '</div>');
    var schoolMeta = $('<div class="meta">' + obj.level + ', ' + obj.school + '</div>');
    var description = $('<div class="description">student description</div>');

    return $(cardDiv)
    .append(contentDiv
      .append(deleteButton)
      .append(editButton)
      .append(nameHeader)
      .append(schoolMeta)
      .append(description));
  }

}
