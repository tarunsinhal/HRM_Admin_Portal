/* global bootstrap: false */
(function () {
  'use strict'
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()


$(document).ready(function () {
  $.ajax({
    type: 'GET',             // initialize an AJAX request
    url: '/home/ajax/get_notifications',
    dataType: 'json',
    success: function (data) {
      console.log('success')
    }
  });

  $.ajax({                       // initialize an AJAX request
    type: 'GET',
    url: '/home/ajax/get_notifications_count',
    dataType: 'json',
    success: function (data) {
      $("#notification").append("<strong class='badge'>" + data.notification_count + "</strong>");
      if (data.notification_count > 0){
        $.ajax({
          type: 'GET',
          url: '/home/ajax/desktop_notification',
        })
      }
    }
  });
})



$(document).ready(function(){
  // Hide submenus
  $('#body-row .collapse').collapse('hide'); 
  
  // Collapse/Expand icon
  $('#collapse-icon').addClass('fa-angle-double-left'); 
  
  // Collapse click
  $('[data-toggle=sidebar-colapse]').click(function() {
      SidebarCollapse();
  });
  
  function SidebarCollapse () {
      $('.menu-collapsed').toggleClass('d-none');
      $('.sidebar-submenu').toggleClass('d-none');
      $('.submenu-icon').toggleClass('d-none');
      $('#title_heading').toggleClass('d-none');
      
      $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
      
      // Collapse/Expand icon
      $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
  }
  });



// var mini = true;

// function toggleSidebar() {
//   debugger
//   if (mini) {
//     document.getElementById("body-row").style.width = "250px";
//     $('.menu-collapsed').toggleClass('d-none');
//     $('.sidebar-submenu').toggleClass('d-none');
//     $('.submenu-icon').toggleClass('d-none');
//     $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
    
//     // Collapse/Expand icon
//     $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
//     this.mini = false;
//   } else {
//     console.log("closing sidebar");
//     document.getElementById("body-row").style.width = "85px";
//     $('.menu-collapsed').toggleClass('d-none');
//     $('.sidebar-submenu').toggleClass('d-none');
//     $('.submenu-icon').toggleClass('d-none');
//     $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
    
//     // Collapse/Expand icon
//     $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
//     this.mini = true;
//   }
// }
