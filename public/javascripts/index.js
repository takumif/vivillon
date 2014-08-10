$(function() {
  $("select").imagepicker({
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
});

function validFC(fc) {
    return /^([0-9]{12})$/.test(fc.replace(/-/g, ''));
}