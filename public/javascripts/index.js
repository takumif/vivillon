$(function() {
  $(".image-picker").imagepicker({
    show_label: true
  });

  $("#registerFcInput").mask('0000-0000-0000');
  $("#loginFcInput").mask('0000-0000-0000');

  // validate the registration form
  $('#registerButton').click(function(event) {
    if ($('#registerPasswordInput').val() != $('#registerPasswordConfirmInput').val()) {
      alert('Passwords don\'t match!');
      event.preventDefault();
    } else if ($('#registerOfferingInput').val() == null ||
               $('#registerLookingForInput').val() == null) {
      alert('Choose the Vivillons you have/want!');
      event.preventDefault();
    } else if (!validFC($('#registerFcInput').val())) {
      alert('Invalid Friend Code!');
      event.preventDefault();
    }
  });

  $('#sendButton').click(function(event) {
    if ($('#messageTextarea').val() == '') {
      event.preventDefault();
    }
  });

  $('.toggleVivillons').click(function(event) {
    $('.irrelevant').toggle();
    if ($('.toggleVivillons').html() == 'Show irrelevant patterns') {
      $('.toggleVivillons').html('Hide irrelevant patterns');
    } else {
      $('.toggleVivillons').html('Show irrelevant patterns');
    }
  });

  $(".offeringSelection").change(function() {
    applySelection();
  });

  $(".lookingForSelection").change(function() {
    applySelection();
  });

});

function validFC(fc) {
    return /^([0-9]{12})$/.test(fc.replace(/-/g, ''));
}

function applySelection() {
  var offering = $('.offeringSelection').val();
  var lookingFor = $('.lookingForSelection').val();
  if (offering == 'All') {
    if (lookingFor == 'All') {
      $('.othersInfo').css('display', 'block');
    }
    else {
      $('.othersInfo').css('display', 'none');
      var people = lookingForList[lookingFor];
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
  }
  else {
    if (lookingFor == 'All') {
      $('.othersInfo').css('display', 'none');
      var people = offeringList[offering];
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
    else {
      $('.othersInfo').css('display', 'none');
      var people = $(lookingForList[lookingFor]).filter(offeringList[offering]);
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
  }
}
