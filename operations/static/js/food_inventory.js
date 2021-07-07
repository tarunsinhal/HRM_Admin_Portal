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
			{ orderable: false, targets: 9 }
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,
		initComplete: function () {
			$.fn.dataTable.ext.search.push(
				function (settings, data, dataIndex) {
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
	console.log(x)
	var y = document.getElementById('editForm').getElementsByTagName('input');
	console.log(y)
	for (i = 0; i < (y.length - 3); i++) {
		var str = x[i + 1].textContent.split(/(\s+)/);
		y[i + 2].value = str[0]
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
			$("#product option[value='other']").remove();
			var temp = x[0].textContent;
			var unit = x[2].textContent.split(/(\s+)/)[2]
			var mySelect = document.getElementById('editForm').getElementsByTagName('select');
			console.log(mySelect)
			for (var i, j = 0; i = mySelect[0].options[j]; j++) {
				if (temp.trim() == i.textContent) {
					console.log('hello')
					mySelect[0].selectedIndex = j;
					break;
				}
			}

			for (var i, j = 0; i = mySelect[1].options[j]; j++) {
				debugger
				if (unit == i.value) {
					console.log('hello')
					mySelect[1].selectedIndex = j;
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


$('#id_price, #id_quantity, #id_discount').on('keyup', function () {
	debugger
	let mul = $("#id_price").val() * $("#id_quantity").val();
	// let d = ($("#id_discount").val() == undefined)?0:$("#id_discount").val() ;
	let d = $("#id_discount").val() ;
	let totalVal = mul - d;
	$("#id_amount").val(totalVal)
});


//...called when save and add another button on addProduct form is clicked...//
$("#saveNew").click(function (e) {
	e.preventDefault()
	var $formId = $(this).parents('form');
	console.log($formId)
	var url = $("#foodForm").attr("action");
	var data = $("#foodForm").serialize();

	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		success: function (data, status) {
			if (status === "success") {
				console.log(data)
				document.getElementById('foodForm').reset()
			}
			console.log(data)
			document.getElementById('foodForm').reset()
			// if (data.redirect) {
			//     // data.redirect contains the string URL to redirect to
			// 	console.log("hello")
			//     window.location.href = data.redirect;
			// } else {
			//     // data.form contains the HTML for the replacement form
			// 	console.log("hello123")
			//     // $("#myform").replaceWith(data.form);
			// }
		},
		error: function (request, status, error) {
			debugger
			// console.log(request.responseJSON['price'].responseTEXT)
			if ('non_field_errors' in request.responseJSON) {
				alert(request.responseJSON['non_field_errors'][0])
			}
			$('.required', $formId).each(function () {
				debugger
				console.log(request)
				var inputVal = $(this).val();
				// var inputName = $(this).attr('name')
				// if (inputName in request.responseJSON){
				// 	console.log('hello')
				// }

				var $parentTag = $(this).parent();
				if (inputVal == '') {
					$parentTag.addClass('error').append('<span class="error" style="color: red; font-size=12px;"><i class="material-icons">&#xe001;</i>This field is required </span>');
				}

			})
		}
	});
});


//...function called when addProduct form is submitted...//
function handleaddnewProduct(event) {
	event.preventDefault()
	const myForm = event.target
	const myFormData = new FormData(myForm)
	const url = myForm.getAttribute("action")
	const method = myForm.getAttribute("method")
	const xhr = new XMLHttpRequest()
	xhr.open(method, url)

	xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

	const responseType = "json"
	xhr.responseType = responseType

	xhr.onload = function () {
		if (xhr.status === 201) {
			const newProduct = xhr.response
			myForm.reset()
			window.location.reload();
			document.getElementById("addNew").click();
			// window.location.href = "/operations/food"
		}
		else {
			alert('Next order should be greater than purchase date.')
		}
	}
	xhr.send(myFormData)
}

const addNewForm = document.getElementById('foodForm')
addNewForm.addEventListener("submit", handleaddnewProduct)


//...function called when edit form is submitted...//
function handleEditProduct(event) {
	event.preventDefault()
	const myForm = event.target
	const myFormData = new FormData(myForm)
	const url = myForm.getAttribute("action")
	const method = myForm.getAttribute("method")
	const xhr = new XMLHttpRequest()
	xhr.open(method, url)

	xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

	const responseType = "json"
	xhr.responseType = responseType

	xhr.onload = function () {
		if (xhr.status === 201) {
			const newProduct = xhr.response
			window.location.reload();
		}
		else {
			alert('Next order should be greater than purchase date.')
		}
	}
	xhr.send(myFormData)
}

const editForm = document.getElementById('editForm')
editForm.addEventListener("submit", handleEditProduct)


//...function called when delete form is submitted...//
function handleDeleteProduct(event) {
	event.preventDefault()
	const myForm = event.target
	const myFormData = new FormData(myForm)
	const url = myForm.getAttribute("action")
	const method = myForm.getAttribute("method")
	const xhr = new XMLHttpRequest()
	xhr.open(method, url)

	xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

	const responseType = "json"
	xhr.responseType = responseType

	xhr.onload = function () {
		if (xhr.status === 201) {
			window.location.reload();
			// window.location.href = "/operations/food"
		}
		else {
			alert('There is some problem in deleting the product.')
		}
	}
	xhr.send(myFormData)
}

const deleteForm = document.getElementById('deleteForm')
deleteForm.addEventListener("submit", handleDeleteProduct)


//...called for loading the purchase date in addProduct form...//
$("#id_product").change(function () {
	var url = $("#foodForm").attr("data-date-url");
	var productId = $(this).val();

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'product': productId
		},
		success: function (data) {
			debugger
			if (data) {
				$("#id_purchase_date").val(data['data'])
			}
		}
	});
});



//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	window.location.reload();
})
