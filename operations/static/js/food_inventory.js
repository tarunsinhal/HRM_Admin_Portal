/* global bootstrap: false */
// (function () {
//   'use strict'
//   var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//   tooltipTriggerList.forEach(function (tooltipTriggerEl) {
//     new bootstrap.Tooltip(tooltipTriggerEl)
//   })
// })()

// $(document).ready(function(){
// 	$('[data-toggle="tooltip"]').tooltip();
// 	var actions = $("table td:last-child").html();
// 	// Add row on add button click
// 	$(document).on("click", ".add", function(){
// 		var empty = false;
// 		var input = $(this).parents("tr").find('input[type="text"]');
//         input.each(function(){
// 			if(!$(this).val()){
// 				$(this).addClass("error");
// 				empty = true;
// 			} else{
//                 $(this).removeClass("error");
//             }
// 		});
// 		$(this).parents("tr").find(".error").first().focus();
// 		if(!empty){
// 			input.each(function(){
// 				$(this).parent("td").html($(this).val());
// 			});			
// 			$(this).parents("tr").find(".add, .edit").toggle();
// 			$(".add-new").removeAttr("disabled");
// 		}		
//     });
// 	// Edit row on edit button click
// 	$(document).on("click", ".edit", function(){		
//         $(this).parents("tr").find("td:not(:last-child)").each(function(){
//           if (this.className != undefined && this.className == "last-date"){
//             $(this).html('<input type="date" class="form-control" value="' + $(this).text() + '">');
//           }
//           else{
//             $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
//           }
// 		});		
// 		$(this).parents("tr").find(".add, .edit").toggle();
// 		$(".add-new").attr("disabled", "disabled");
//     });
// 	// Delete row on delete button click
// 	$(document).on("click", ".delete", function(){
//         $(this).parents("tr").remove();
// 		$(".add-new").removeAttr("disabled");
//     });
// });

// function openCity(evt, cityName) {
// 	var i, tabcontent, tablinks;
// 	tabcontent = document.getElementsByClassName("tabcontent");
// 	for (i = 0; i < tabcontent.length; i++) {
// 	  tabcontent[i].style.display = "none";
// 	}
// 	tablinks = document.getElementsByClassName("tablinks");
// 	for (i = 0; i < tablinks.length; i++) {
// 	  tablinks[i].className = tablinks[i].className.replace(" active", "");
// 	}
// 	document.getElementById(cityName).style.display = "block";
// 	evt.currentTarget.className += " active";
//   }



function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tab-panel");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

  function editfunction(obj){
	console.log('Hello');
	  document.getElementById('editForm').style.display = 'block'
	  var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	  var y = document.getElementById('editForm').getElementsByTagName('input');

	  for (i=0; i<(y.length-2); i++){
		  y[i+1].value = x[i].textContent
	  }
	document.getElementById('editForm').action = obj.id;
}


function deletefunction(obj){
	document.getElementById('deleteForm').action = obj.id;
}