/* global bootstrap: false */
(function () {
  'use strict'
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()


$(document).ready(function() {
  debugger
  $.ajax({     
      type: 'GET',             // initialize an AJAX request
  url: '/home/ajax/get_notifications',
      dataType: 'json',
  success: function (data) {
          debugger
    console.log('success')
  }
});

  $.ajax({                       // initialize an AJAX request
      
      type: 'GET',
      url: '/home/ajax/get_notifications_count',
      dataType: 'json',
      success: function (data) {
          debugger
          $("#notification").append( "<strong>" + data.notification_count + "</strong>" );
      }
  });
})

