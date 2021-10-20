

var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Adhoc Inventory',
			exportOptions: {
				columns: [ 2, 3, 4, 5, 6, 7, 8, 9, 10,11]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 0 },
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 10 }
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,
		initComplete: function () {
			$.fn.dataTable.ext.search.push(
				function (settings, data, dataIndex) {

					let activeTabId = $('.tablinks.active').attr('data-tab-id');
					let pur_min =$('#pur_min_'+activeTabId).val();
					let pur_max = $('#pur_max_'+activeTabId).val();
					let next_min =$('#next_min_'+activeTabId).val();
					let next_max = $('#next_max_'+activeTabId).val();

					pur_min = (pur_min != "")?new Date(pur_min):null ;
					pur_max = (pur_max != "")?new Date(pur_max):null;
					next_min = (next_min != "")?new Date(next_min):null;
					next_max = (next_max != "")?new Date(next_max):null;

					let purchaseDate = new Date(data[2]);
					let nextDate = new Date(data[3]);
					let recordType  = data[12]

					if(activeTabId == recordType){
						if ((pur_min == null && pur_max == null ) && (next_min == null && next_max == null )) 
							return true;
						if (((pur_min == null && purchaseDate <= pur_max) && (next_min == null && nextDate <= next_max )))
							return true;
						if (((pur_max == null && ( pur_min != null && purchaseDate >= pur_min)) || (next_max == null && (next_min != null && nextDate >= next_min ))))
							return true;
						if (((purchaseDate <= pur_max && purchaseDate >= pur_min) ||  (nextDate <= next_max && nextDate >= next_min)))
							return true;
					}else{
						return true;
					}
				}
			)
		}
	});
	$('#quantity_0').attr({'min':0});
});
$('.inventory_datepicker_1,.inventory_datepicker_2').on('change', function (e) {
debugger;
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

});

// load Paid_by dropdown
$(document).ready(function () {
	var url = $("#addFormAdhoc").attr("data-users-url");

	$.ajax({                       // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#paid_by").html(response);
        }
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
		if(document.getElementById(tabName)){
			document.getElementById(tabName).style.display = "block";
			evt.currentTarget.className += " active";
		}
	
		if(dataTableRes){
			dataTableRes.draw();
		}
}

// Amount field calculation in Add Product form
$('#price, #quantity_0').on('keyup', function () {
	debugger;
	let total = $("#price").val() * $("#quantity_0").val();
	$("#amount").val(total)
});

// Balance amount field calculation in Add Product Form 
$('#amount, #advance_pay').on('keyup', function () {
	debugger;
	let balance = $("#amount").val() - $("#advance_pay").val();
	$("#balance_amount").val(balance)
});

// Used to set balance amount based on received date for Add form
// $('#addBtn').on('click', function() {
// 	debugger;
// 	if ($('#received_date').val() == ''){
// 		$('#balance_amount').removeAttr('max');	
// 	} else {
// 		$('#balance_amount').attr({'max':0});
// 	}
// 	if($('#balance_amount').val() == 0){
// 		$('#received_date').prop('required',true);
// 	} else {
// 		$('#received_date').prop('required',false);
// 	}
// });
	

// // Get the element with id="defaultOpen" and click on it
// document.getElementById("defaultOpen").click();
	
$("#defaultOpen").click();
	


//...called when edit button is clicked...//
function editfunction(obj) {
	debugger;
	document.getElementById('editFormAdhoc').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editFormAdhoc').getElementsByTagName('input');
	var mySelect = document.getElementById('editFormAdhoc').getElementsByTagName('select');
	var myText = document.getElementById('editFormAdhoc').getElementsByTagName('textarea');
    
	var quantity_1= x[5].textContent.split(/(\s+)/)[2]
	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (quantity_1 == i.value) {
			mySelect[0].selectedIndex = j;
			break;
		}
	}

	for (i = 1; i < (y.length-2); i++) {
		var str = x[i + 1].textContent;
		y[i].value = str;
	}
	var str = x[5].textContent.split(/(\s+)/);
	y[4].value = str[0];
	
	myText[0].value = x[11].textContent;
    document.getElementById('editFormAdhoc').action = obj.id;

	var url = $("#addFormAdhoc").attr("data-users-url");
	debugger;  
	$.ajax({                     // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
			debugger;
			$("#id_paid_by").html(response);

			var paid_by = x[10].textContent.split(/(\s+)/)[0]
			for (var i, j = 0; i = mySelect[1].options[j]; j++) {
				if (paid_by == i.value) {
					mySelect[1].selectedIndex = j;
					break;
				}
			}
        }
    });
}

// Amount field calculation in Update new Product form
$('#id_price, #id_quantity_0').on('keyup', function () {
	let total = $("#id_price").val() * $("#id_quantity_0").val();
	$("#id_amount").val(total)
});

// Balance amount field calculation in Update New Product Form
$('#id_amount, #id_quantity_0').on('keyup', function () {
    debugger;
	let balance = $("#id_amount").val() - $("#id_advance_pay").val();
	$("#id_balance_amount").val(balance)
});

// Used to set balance amount based on received date for Update form
// $('#updateBtn').on('click', function() {
// 	debugger;
// 	if ($('#id_received_date').val() == ''){
// 		$('#id_balance_amount').removeAttr('max');	
// 	} else {
// 		$('#id_balance_amount').attr({'max':0});
// 	}
// 	if($('#id_balance_amount').val() == 0){
// 		$('#id_received_date').prop('required',true);
// 	} else {
// 		$('#id_received_date').prop('required',false);
// 	}
// });


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
}


// Add Name field pops up when Other is selected in Add new Product form
$('#id_paid_by').change(function(){
	if ($(this).val() == "Other"){
		debugger;
		$("#id_add_name").prop({ 'type': 'text', 'required': true });
		$("#id_add_name").parent().parent().css("display", "block");
	}
	else {
		$("#id_add_name").prop({ 'required': false });
		$("#id_add_name").parent().parent().css("display", "none");
	}
});

// Add Name field pops up when Other is selected in Update Product form
$('#paid_by').change(function(){
    if ($(this).val() == "Other"){
    	debugger;
    	$("#add_name").prop({ 'type': 'text', 'required': true });
		$("#add_name").parent().parent().css("display", "block");
     }
     else {
		$("#add_name").prop({ 'required': false });
		$("#add_name").parent().parent().css("display", "none");
	}
});


//...called when save and add another button on addProduct form is clicked...//
$("#saveNew").click(function (e) {
	debugger;
	e.preventDefault()
	var $formId = $(this).parents('form');
	var url = $("#addFormAdhoc").attr("action");
	var data = $("#addFormAdhoc").serialize();
	
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		success: function (data, status) {
			if (status === "success") {
				document.getElementById('addFormAdhoc').reset()

				$('.chk', $formId).each(function () {
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
			document.getElementById('addFormAdhoc').reset()
			var url = $("#addFormAdhoc").attr("data-users-url");

			$.ajax({                       // initialize an AJAX request
				type: "GET",
				url: url,
				dataType: "html",
				success: function (response) {
				debugger;
					$("#paid_by").html(response);
				}
			});
			$("#add_name").parent().parent().css("display", "none");
		},
		error: function (request, status, error) {
			// console.log(request.responseJSON['price'].responseTEXT)
			if ('non_field_errors' in request.responseJSON) {
				alert(request.responseJSON['non_field_errors'][0])
			}
			Inval = request.responseJSON
			$('.chk', $formId).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" id="err" style="color: red; font-size: 15px">' + Inval[ipVal] + '</span>')
					}
				} else {
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					} else {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					}
				}
			});
			// $('.required', $formId).each(function () {
			// 	var inputVal = $(this).val();

			// 	var $parentTag = $(this).parent();
			// 	if (inputVal == '') {
			// 		if($parentTag[0].className!=="col-6 error"){
			// 			$parentTag.addClass('error').append('<span class="error" style="color: red; font-size=12px;"><i class="material-icons">&#xe001;</i>This field is required </span>');
			// 		}
			// 	}else{
			// 		if($(this).nextAll().length==2){
			// 			$parentTag.removeClass("error");
			// 			$(this).nextAll()[1].remove();
			// 		}else{
			// 			$parentTag.removeClass("error");
			// 			$(this).next().remove();
			// 		}
			// 	}
			// })
		}
	});
});


//...function called when addProduct form is submitted...//
function handleaddnewProduct(event) {
debugger;
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
		else if (xhr.status === 400) {
			var Inval = xhr.response
			if (Inval['non_field_errors']) {
				//alert("Name already exists.");
				$('#add-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + Inval['non_field_errors'] + '</span></center>')
			}
			$('.chk', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" id="err" style="color: red; font-size: 12px">' + Inval[ipVal] + '</span>')
					}
				}
				else {
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					} else {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					}
				}
			});	
		}

	}
	xhr.send(myFormData)
}

const addNewForm = document.getElementById('addFormAdhoc')
addNewForm.addEventListener("submit", handleaddnewProduct)


//...function called when edit form is submitted...//
function handleEditProduct(event) {
debugger;
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
		else if (xhr.status === 400) {
			var Inval = xhr.response
			if (Inval['non_field_errors']) {
				//alert("Name already exists.");
				$('#add-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + Inval['non_field_errors'] + '</span></center>')
			}
			$('.chk', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" id="err" style="color: red; font-size: 12px">' + Inval[ipVal] + '</span>')
					}
				}
				else {
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					} else {
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					}
				}
			});	
		}

	}
	xhr.send(myFormData)
}

const editFormAdhoc = document.getElementById('editFormAdhoc')
editFormAdhoc.addEventListener("submit", handleEditProduct)


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

//...function called when import form is submitted...//
function handleImportAdhoc(event) {
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
		else if (xhr.status === 400){
			debugger;
			// alert('Wrong Formate, Try again.')
			var $parentTag = $('#id_import_file').parent();
			if ($parentTag[0].className != "form-group mb-0 files error") {
				$parentTag.addClass('error').prepend('<span class="error" style="color: red; font-size=12px;">Wrong Format, Try again !!!</span>');
			}				
		}
	}
	xhr.send(myFormData)
}

const importAdhocForm = document.getElementById('importAdhocForm')
importAdhocForm.addEventListener("submit", handleImportAdhoc)


//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	window.location.reload();
})


