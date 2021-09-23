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


var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 10 },
			{ orderable: false, targets: 12 }
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,  
		initComplete: function () {		
			$.fn.dataTable.ext.search.push(
				function (settings, data, dataIndex) {	
					debugger;	
					let activeTabId = $('.tablinks.active').attr('data-tab-id');
					let pur_min =$('#pur_min_'+activeTabId).val();
					let pur_max = $('#pur_max_'+activeTabId).val();
					let next_min =$('#next_min_'+activeTabId).val();
					let next_max = $('#next_max_'+activeTabId).val();
					
					let value = $('input[type=radio][name=radiobtn_'+activeTabId+']:checked').val();

					pur_min = (pur_min != "")?new Date(pur_min):null;
					pur_max = (pur_max != "")?new Date(pur_max):null;
					next_min = (next_min != "")?new Date(next_min):null;
					next_max = (next_max != "")?new Date(next_max):null;

					let purchaseDate = new Date(data[8]);
					let nextDate = new Date(data[9]);
					let freq = data[0];
					let recordType  = data[11]

					if(activeTabId == recordType){
						if ((pur_min == null && pur_max == null ) && (next_min == null && next_max == null ) && ((value == freq) || (value == "All"))) 
							return true;
						if (((pur_min == null && purchaseDate <= pur_max) && (next_min == null && nextDate <= next_max )) && ((value == freq) || (value == "All")))
							return true;
						if (((pur_max == null && ( pur_min != null && purchaseDate >= pur_min)) || (next_max == null && (next_min != null && nextDate >= next_min ))) && ((value == freq) || (value == "All")))
							return true;
						if (((purchaseDate <= pur_max && purchaseDate >= pur_min) ||  (nextDate <= next_max && nextDate >= next_min)) && ((value == freq) || (value == "All")))
							return true;
					}else{
						return true;
					}	
				}		
			)	
		}		
	});	
});

$('.inventory_datepicker_1,.inventory_datepicker_2,.inventory_datepicker_3,.inventory_datepicker_4,.inventory_datepicker_5').on('change', function (e) {
	let selDateType = e.target.getAttribute('data-attr-type')
	let selDateTypeVal = (selDateType == "pur")?"next":"pur";
	let activeTabId = $('.tablinks.active').attr('data-tab-id');
	let resetDateIdMin = selDateTypeVal+"_min_"+activeTabId;
	let resetDateIdMax = selDateTypeVal+"_max_"+activeTabId;
	$('#'+resetDateIdMin).val('')
	$('#'+resetDateIdMax).val('')
	$('[data-tab-id="+activeTabId+"]').click();
	dataTableRes.draw();
});
$('.daterefresh').on('click', function (e) {
	let selSecId= e.target.getAttribute('data-section-id')
	$('.inventory_datepicker_'+selSecId).val('');
	dataTableRes.draw();
})

$('.inventory_freqpicker_1,.inventory_freqpicker_2,.inventory_freqpicker_3,.inventory_freqpicker_4,.inventory_freqpicker_5').on('change', function (e) {
	$('[data-tab-id="+activeTabId+"]').click();
	dataTableRes.draw();
});



//...function for switching between radio buttons...//
// $('.radiolinks').on('click', function (e) {
// 	let selFrqType = e.target.getAttribute('data-attr-type')
// 	dataTableRes.search(selFrqType).draw();
// 	// dataTableRes(selFrqType).draw();
// });

$('#id_purchase_date, #id_frequency').on('change', function() {
	debugger;
	// var date = this.value;
	var purDate = $('#id_purchase_date').val()
	var date = new Date(purDate);

	if ($('#id_frequency').val() == "Daily"){
		date.setDate(date.getDate() + 1);
		nextDate = date.toISOString().slice(0,10);
		$("#id_next_order_date").val(nextDate);
	}
	if ($('#id_frequency').val() == "Weekly"){
		date.setDate(date.getDate() + 7);
		nextDate = date.toISOString().slice(0,10);
		$("#id_next_order_date").val(nextDate);
	}
	if ($('#id_frequency').val() == "Bimonthly"){
		date.setDate(date.getDate() + 15);
		nextDate = date.toISOString().slice(0,10);
		$("#id_next_order_date").val(nextDate);
	}
	if ($('#id_frequency').val() == "Monthly"){
		date.setDate(date.getDate() + 30);
		nextDate = date.toISOString().slice(0,10);
		$("#id_next_order_date").val(nextDate);
	}
});

$('#purchase_date, #frequency').on('change', function() {
	debugger;
	// var date = this.value;
	var purDate = $('#purchase_date').val()
	var date = new Date(purDate);

	if ($('#frequency').val() == "Daily"){
		date.setDate(date.getDate() + 1);
		nextDate = date.toISOString().slice(0,10);
		$("#next_order_date").val(nextDate);
	}
	if ($('#frequency').val() == "Weekly"){
		date.setDate(date.getDate() + 7);
		nextDate = date.toISOString().slice(0,10);
		$("#next_order_date").val(nextDate);
	}
	if ($('#frequency').val() == "Bimonthly"){
		date.setDate(date.getDate() + 15);
		nextDate = date.toISOString().slice(0,10);
		$("#next_order_date").val(nextDate);
	}
	if ($('#frequency').val() == "Monthly"){
		date.setDate(date.getDate() + 30);
		nextDate = date.toISOString().slice(0,10);
		$("#next_order_date").val(nextDate);
	}
});
//.... for getting products list based on selected type in add product form...//
$("#id_type").change(function () {
	debugger
	var url = $("#addForm").attr("data-products-url");
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


//...called when edit button is clicked...//
function editfunction(obj, obj2) {
	debugger;
	document.getElementById('editForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editForm').getElementsByTagName('input');
	var z = document.getElementById('editForm').getElementsByTagName('textarea');
	var mySelect = document.getElementById('editForm').getElementsByTagName('select');
	
	var feq = x[0].textContent.split(/(\s+)/);
	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (feq == i.value) {
			mySelect[0].selectedIndex = j;
			break;
		}
	}
		
	for (i = 0; i < (y.length - 5); i++) {
		var str = x[i + 2].textContent.split(/(\s+)/);
		y[i + 2].value = str[0]
	}

    y[7].value = x[8].textContent.split(/(\s+)/);
	y[8].value = x[9].textContent.split(/(\s+)/);
	z[0].value = x[10].textContent;

	document.getElementById('editForm').action = obj.id;

	var url = $("#addForm").attr("data-products-url");
	var typeId = obj2;

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'Type': typeId
		},
		success: function (data) {
			$("#product").html(data);
			$("#product option[value='other']").remove();

			var temp = x[1].textContent;
			for (var i, j = 0; i = mySelect[1].options[j]; j++) {
				if (temp == i.textContent) {
					mySelect[1].selectedIndex = j;
					break;
				}
			}
		}
	});
	var unit = x[3].textContent.split(/(\s+)/)[2]
	for (var i, j = 0; i = mySelect[2].options[j]; j++) {
		if (unit == i.value) {
			mySelect[2].selectedIndex = j;
			break;
		}
	}

	var paid_by = x[7].textContent;
	for (var i, j = 0; i = mySelect[3].options[j]; j++) {
		if (paid_by == i.value) {
			mySelect[3].selectedIndex = j;
			break;
		}
	}

}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
}


//...called when repeat button is clicked...//
function repeatfunction(obj, obj2) {
	debugger;
	document.getElementById('staticBackdropLabel').textContent = 'Repeat Product';
	document.getElementById('saveNew').remove();
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('addForm').getElementsByTagName('input');
	var z = document.getElementById('addForm').getElementsByTagName('textarea');
	var mySelect = document.getElementById('addForm').getElementsByTagName('select');
    
	var feq = x[0].textContent.split(/(\s+)/);
    for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (feq == i.value) {
			mySelect[0].selectedIndex = j;
			break;
		}
	}

	for (i = 0; i < (y.length - 4); i++) {
		var str = x[i + 2].textContent.split(/(\s+)/);
		y[i + 2].value = str[0]
	}
	
    // y[7].value = x[8].textContent.split(/(\s+)/);
	// y[8].value = x[9].textContent.split(/(\s+)/);
	z[0].value = x[10].textContent;

	for (var i, j = 0; i = mySelect[1].options[j]; j++) {
		if (obj2 == i.value) {
			mySelect[1].selectedIndex = j;
			var url = $("#addForm").attr("data-products-url");
			var typeId = i.value;

			$.ajax({                       // initialize an AJAX request
				url: url,
				data: {
					'Type': typeId
				},
				success: function (data) {
					$("#id_product").html(data);
					for (var i, j = 0; i = mySelect[2].options[j]; j++) {
						if (x[1].textContent == i.textContent) {
							mySelect[2].selectedIndex = j;
							// document.getElementById("id_product").style.pointerEvents = 'none';

							var url = $("#addForm").attr("data-date-url");
							var productId = $("#id_product").val();

							$.ajax({                      
								url: url,
								data: {
									'product': productId
								},
								success: function (data) {
									if (data) {
										$("#id_purchase_date").val(data['data'])
										if ($("#id_purchase_date").val()){
											var purDate = $('#id_purchase_date').val()
											var date = new Date(purDate);
						
											if ($('#id_frequency').val() == "Daily"){
												date.setDate(date.getDate() + 1);
												nextDate = date.toISOString().slice(0,10);
												$("#id_next_order_date").val(nextDate);
											}
											if ($('#id_frequency').val() == "Weekly"){
												date.setDate(date.getDate() + 7);
												nextDate = date.toISOString().slice(0,10);
												$("#id_next_order_date").val(nextDate);
											}
											if ($('#id_frequency').val() == "Bimonthly"){
												date.setDate(date.getDate() + 15);
												nextDate = date.toISOString().slice(0,10);
												$("#id_next_order_date").val(nextDate);
											}
											if ($('#id_frequency').val() == "Monthly"){
												date.setDate(date.getDate() + 30);
												nextDate = date.toISOString().slice(0,10);
												$("#id_next_order_date").val(nextDate);
											}
										}	
									}
								}
							});
							break;
						}
					}
				}
			});
			break;
		}
	}
	var unit = x[3].textContent.split(/(\s+)/)[2]
	for (var i, j = 0; i = mySelect[3].options[j]; j++) {
		if (unit == i.value) {
			mySelect[3].selectedIndex = j;
			// mySelect[3].style.pointerEvents = 'none';
			break;
		}
	}

	var paid_by = x[7].textContent.split(/(\s+)/); 
	for (var i, j = 0; i = mySelect[4].options[j]; j++) {
		if (paid_by == i.value) {
			mySelect[4].selectedIndex = j;
			break;
		}
	}
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
});


$('#id_price, #id_quantity, #id_discount').on('keyup', function () {
	let mul = $("#id_price").val() * $("#id_quantity").val();
	// let d = ($("#id_discount").val() == undefined)?0:$("#id_discount").val() ;
	let d = $("#id_discount").val();
	let totalVal = mul - d;
	$("#id_amount").val(totalVal)
});

$('#price, #quantity, #discount').on('keyup', function () {
	let mul = $("#price").val() * $("#quantity").val();
	// let d = ($("#id_discount").val() == undefined)?0:$("#id_discount").val() ;
	let d = $("#discount").val();
	let totalVal = mul - d;
	$("#amount").val(totalVal)
});


$('#price, #quantity, #discount').on('keyup', function () {
	let mul = $("#price").val() * $("#quantity").val();
	// let d = ($("#id_discount").val() == undefined)?0:$("#id_discount").val() ;
	let d = $("#discount").val();
	let totalVal = mul - d;
	$("#amount").val(totalVal)
});


//...called when save and add another button on addProduct form is clicked...//
$("#saveNew").click(function (e) {
	debugger;
	e.preventDefault()
	var $formId = $(this).parents('form');
	console.log($formId)
	var url = $("#addForm").attr("action");
	var data = $("#addForm").serialize();

	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		success: function (data, status) {
			debugger;
			if (status === "success") {
				console.log(data)
				document.getElementById('addForm').reset()

				$('.required', $formId).each(function () {
					var $parentTag = $(this).parent();
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					} else {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					}
				})
			}
			console.log(data)
			document.getElementById('addForm').reset()
		},
		error: function (request, status, error) {
			debugger;
			// console.log(request.responseJSON['price'].responseTEXT)
			if ('non_field_errors' in request.responseJSON) {
				alert(request.responseJSON['non_field_errors'][0])
			}
			$('.required', $formId).each(function () {
				console.log(request)
				var inputVal = $(this).val();

				var $parentTag = $(this).parent();
				if (inputVal == '') {
					if($parentTag[0].className!=="col-6 error"){
					$parentTag.addClass('error').append('<span class="error" id="err" style="color: red; font-size=12px;"><i class="material-icons">&#xe001;</i>This field is required </span>');}
				}else{
					debugger;
					if($(this).nextAll().length==2){
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
						// $(this).nextAll()[1].remove();
					}else{
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
						// $(this).next().remove();
					}
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
		}
		else {
			alert('Next order should be greater than purchase date.')
		}
	}
	xhr.send(myFormData)
}

const addNewForm = document.getElementById('addForm')
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
	var url = $("#addForm").attr("data-date-url");
	var productId = $(this).val();

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'product': productId
		},
		success: function (data) {
			if (data) {
				debugger;
				$("#id_purchase_date").val(data['data'])
				if ($("#id_purchase_date").val()){
					var purDate = $('#id_purchase_date').val()
					var date = new Date(purDate);

					if ($('#id_frequency').val() == "Daily"){
						date.setDate(date.getDate() + 1);
						nextDate = date.toISOString().slice(0,10);
						$("#id_next_order_date").val(nextDate);
					}
					if ($('#id_frequency').val() == "Weekly"){
						date.setDate(date.getDate() + 7);
						nextDate = date.toISOString().slice(0,10);
						$("#id_next_order_date").val(nextDate);
					}
					if ($('#id_frequency').val() == "Bimonthly"){
						date.setDate(date.getDate() + 15);
						nextDate = date.toISOString().slice(0,10);
						$("#id_next_order_date").val(nextDate);
					}
					if ($('#id_frequency').val() == "Monthly"){
						date.setDate(date.getDate() + 30);
						nextDate = date.toISOString().slice(0,10);
						$("#id_next_order_date").val(nextDate);
					}
				}	
			}
		}
	});
});



//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	debugger
	window.location.reload();
	
})




//...function for switching between different tabs...//
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
	
	document.getElementById("section-" + tabName).style.display = 'block';
	evt.currentTarget.className += " active";
	

	if(dataTableRes){
		dataTableRes.draw();		
	}		
}

// // Get the element with id="defaultOpen" and click on it
$("#defaultOpen").click();
