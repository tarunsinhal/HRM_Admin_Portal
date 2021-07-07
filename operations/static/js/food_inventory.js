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


var minDate, maxDate;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	var table=$('.productTable1').DataTable({
		columnDefs: [
			{ orderable: false, targets: 1 },
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 6 }
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,
		initComplete: function () {
			$.fn.dataTable.ext.search.push(
				function(settings, data, dataIndex) {
					var min = $('#min').val() ? new Date($('#min').val()) : null;
					var max = $('#max').val() ? new Date($('#max').val()) : null;
					var startDate = new Date(data[4]);
					var endDate = new Date(data[5]);
					if (min == null && max == null) {
					  return true;
					}
					if (min == null && startDate <= max) {
					  return true;
					}
					if (max == null && startDate >= min) {
					  return true;
					}
					if (startDate <= max && startDate >= min) {
					  return true;
					}
					return false;
				  }
				);
		  }

	});


	$('#min, #max').on('change', function () {
		table.draw();
		$('#defaultOpen').click();
    });

});


//...function for switching between different tabs...//
function openTab(evt, tabName) {
	debugger;
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


//...called when edit button is clicked...//
function editfunction(obj, obj2) {

	document.getElementById('editForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editForm').getElementsByTagName('input');

	for (i = 0; i < (y.length - 2); i++) {
		y[i + 1].value = x[i + 1].textContent
	}
	document.getElementById('editForm').action = obj.id;

	var url = $("#foodForm").attr("data-products-url");
	var typeId = obj2;

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'Type': typeId
		},
		success: function (data) {
			$("#product").html(data);
			var temp = x[0].textContent;
			var mySelect = document.getElementById('editForm').getElementsByTagName('select')[0];
			console.log(mySelect)
			for (var i, j = 0; i = mySelect.options[j]; j++) {
				if (temp.trim() == i.textContent) {
					console.log('hello')
					mySelect.selectedIndex = j;
					break;
				}
			}
		}
	});
}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
}



$('#id_product').change(function () {
	var value = $(this).val();
	if (value == "other") {
		$("#id_new_product").prop({ 'type': 'text', 'required': true });
		$("#id_new_product").parent().parent().css("display", "block");
	}
	else {
		$("#id_new_product").prop({ 'required': false });
		$("#id_new_product").parent().parent().css("display", "none");
	}
	// var datearray = $('#id_last_order_date input').val().split("-");
	// console.log(datearray)
	// var montharray = ["Jan", "Feb", "Mar","Apr", "May", "Jun","Jul", "Aug", "Sep","Oct", "Nov", "Dec"];
	// var year = datearray[2];
	// var month = montharray.indexOf(datearray[1])+1;
	// var day = datearray[0];
	// var minDate = (year +"-"+ month +"-"+ day);
	// $('#id_expected_order_date input').attr('min',minDate); 
});



//.... for getting products list based on selected type in add product form...//
$("#id_type").change(function () {
	var url = $("#foodForm").attr("data-products-url");
	var typeId = $(this).val();

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'Type': typeId
		},
		success: function (data) {
			$("#id_product").html(data);
		}
	});

});




// $("#saveNew").click(function (){
// 	var url = $("#foodForm").attr("action");
// 	var data = $("#foodForm").serialize();
// $.ajax({
//     type: "POST",
//     url: url,
//     data: data,
    
//     success: function(data,textStatus) {
		
// 		console.log(data)
//         if (data.redirect) {
//             // data.redirect contains the string URL to redirect to
// 			console.log("hello")
//             window.location.href = data.redirect;
//         } else {
//             // data.form contains the HTML for the replacement form
// 			console.log("hello123")
//             // $("#myform").replaceWith(data.form);
//         }
//     }
// });
// });



$('#id_price, #id_quantity').on('change', function () {
	var total = $("#id_price").val() * $("#id_quantity").val();
	// var total = mul - $("id_discount").val();
	document.getElementById("id_amount").value = total;
});