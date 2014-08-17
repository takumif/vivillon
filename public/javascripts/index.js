$(function() {
  $(".image-picker").imagepicker({
    show_label: true
  });

  //-------- INDEX PAGE ---------------

  $("#registerFcInput").mask('0000-0000-0000');
  $("#loginFcInput").mask('0000-0000-0000');

  // validate the registration form
  $('#registerButton').click(function(event) {
    if ($('#registerPasswordInput').val() != $('#registerPasswordConfirmInput').val()) {
      alert('Passwords don\'t match!');
      event.preventDefault();
    } else if ($('#registerOfferingInput').val() == null ||
               ($('#registerLookingForInput').val() == null && !$('#somethingElseCheckbox').is(':checked'))) {
      alert('Choose the Vivillons you have/want!');
      event.preventDefault();
    } else if (!validFC($('#registerFcInput').val())) {
      alert('Invalid Friend Code!');
      event.preventDefault();
    } else if ($('#selectNativePattern').val() == 'Native pattern') {
      alert('Choose your native pattern!');
      event.preventDefault();
    }
  });

  $('#sendButton').click(function(event) {
    if ($('#messageTextarea').val() == '') {
      event.preventDefault();
    }
  });

  $('#loginTimeOffsetInput, #registerTimeOffsetInput').val(moment().zone());
  var rightNow = new Date();
  $('#loginTimezoneAbbrInput, #registerTimezoneAbbrInput').val(String(String(rightNow).split("(")[1]).split(")")[0]);

  //----------- USER PAGE ----------------

  $('.messageSort').change(function() {
    var selection = $('.messageSort').val();
    $('.messageBox').children().css('display', 'none');
    $('.'+selection+'Messages').css('display', 'block');
  });
 
  $('.toggleSender').click(function(event) {
    $(this).siblings('img').toggle();
    $(this).siblings('.message').slideToggle();
  })

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

  // --------- UPDATE PAGE -------------

  $('#updateButton').click(function(event) {
    if ($('#selectNativePattern').val() == 'Native pattern') {
      alert('Choose your native pattern!');
      event.preventDefault();
    } else if ($('#offeringList').val() == null ||
               ($('#lookingForList').val() == null && !$('#somethingElseCheckbox').is(':checked'))) {
      alert('Choose the Vivillons you have/want!');
      event.preventDefault();
    }
  });

  //------------- ABOUT PAGE ------------

  $('#feedbackButton').click(function(event) {
    if ($('#feedbackTextarea').val() == '') {
      event.preventDefault();
    } else {
      alert('Thanks for the feedback!');
    }
  });

});


// ^^^^^  ON LOAD FUNCTIONS ENDS  ^^^^^
// =====================================

function validFC(fc) {
    return /^([0-9]{12})$/.test(fc.replace(/-/g, ''));
}


function sortMessages()  {

}

function applySelection() {
  var offering = $('.offeringSelection').val();
  var lookingFor = $('.lookingForSelection').val();
  var people = [];
  if (offering == 'All') {
    if (lookingFor == 'All') {
      $('.othersInfo').css('display', 'block');
    }
    else if (lookingFor == 'Vivillons I offer') {
      $('.othersInfo').css('display', 'none');
      people = lookingForWhatIOfferList;
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
    else {
      $('.othersInfo').css('display', 'none');
      people = lookingForList[lookingFor];
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
  }
  else {
    if (lookingFor == 'All') {
      $('.othersInfo').css('display', 'none');
      people = offeringList[offering];
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
    else if (lookingFor == 'Vivillons I offer') {
      $('.othersInfo').css('display', 'none');
      people = $(lookingForWhatIOfferList).filter(offeringList[offering]);
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
    else {
      $('.othersInfo').css('display', 'none');
      people = $(lookingForList[lookingFor]).filter(offeringList[offering]);
      for (var i = 0; i < people.length; i++) {
        $('#' + people[i]).css('display', 'block');
      }
    }
  }
  if (people.length == 0 && offering != 'All') {
    $('.noOffersFound').css('display', 'block');
  } else {
    $('.noOffersFound').css('display', 'none');
  }
}
