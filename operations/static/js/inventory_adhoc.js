var minDate, maxDate, dataTableRes, dataTableRes1;

function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Type: </span>'+d[8]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[9]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Advance Pay: </span>'+d[10]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Balance Amount: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Received Date: </span>'+d[12]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Additional Info: </span>'+d[13]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Type: </span>'+d[8]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[9]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Advance Pay: </span>'+d[10]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Balance Amount: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Received Date: </span>'+d[12]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Additional Info: </span>'+d[13]+'</div></div><br>'+
        '</div>'+
		'<div style=" background: #538ddc; margin-bottom: 10px; padding: 10px">'+
			'<div><p class="font-weight-bold" style="color: #ffff">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){
		d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
		b += d
	}
	b += '</tbody></table></div>'
    return b;
}

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
		order: [],
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
	var x = document.getElementById(obj.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td');
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

	var val = $("#id_purchase_date").val();
	$("#id_received_date").attr('min', val);
	
}

function historyfunction(obj, obj2){
	debugger
	var url = $("#historyModal").attr("data-history-url");
	var rowId = obj2;

	$.ajax({                       // initialize an AJAX request
		url: url,
		async: false,
		data: {
			'id': rowId
		},
		success: function (data) {
			$("#tbody-content").html(data);
		}
	});
	dataTableRes1 = $('.historyTable1').DataTable({
		dom: 'Bfrtip',
		destroy: true,
		retrieve: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Adhoc History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 9 },
			{ orderable: false, targets: 16 }
		],

		'pageLength': 6,
		"bLengthChange": false,
		"autoWidth": false		
	});	
	
	debugger
	var r = dataTableRes1.data()

	//  Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#historyTableId tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes1.row( tr );

		var id = tr[0].children[14].innerText;
		var history_id = tr[0].children[15].innerText;
		var url = $("#historyTableId").attr("data-previous-url");
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			data: {"id": id, "history_id": history_id},
			dataType: 'json',
			success: function(data){
				debugger
				if (data['data']){
					res = data['data'];
				}
				else{
					res = null
				}
			}
		})


		var idx = $.inArray( tr.attr('id'), detailRows );
		if ( row.child.isShown() ) {
			tr.removeClass( 'details' );
			row.child.hide();
			// Remove from the 'open' array
			detailRows.splice( idx, 1 );
		}
		else {
			tr.addClass( 'details' );
			if (res){
				row.child( format_and_diff( row.data(), res ) ).show();
			}
			else{
				row.child( format( row.data()) ).show();
			}
			// Add to the 'open' array
			if ( idx === -1 ) {
				detailRows.push( tr.attr('id') );
			}
		}
	});

	// On each draw, loop over the `detailRows` array and show any child rows
	dataTableRes1.on( 'draw', function () {
		 $.each( detailRows, function ( i, id ) {
			 $('#'+id+' td.details-control').trigger( 'click' );
		 } );
	 } );
	 
    var r = dataTableRes1.data()
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
						$parentTag.addClass('error').append('<span class="error" id="err" style="color: red; font-size: 15px">' + Inval[ipVal] + '</span>')
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
			window.location.reload();
		}
		else {
			debugger;
			const data = xhr.response['error']
			data_len = xhr.response['length'] 

			var $parentTag = $('#id_import_file').parent();

			if ($parentTag[0].classList.contains("error")) {
				$parentTag.removeClass("error");
				$('.err').remove();
			}
          
			if (!$parentTag[0].classList.contains("error")) {
				if (typeof(data) == "object") {
					for (i=0; i < data_len; i++) {
						$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ Object.keys(data)[i] +" : "+ Object.values(data)[i] +'</span><br>');
					}
				}
				else {
					$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ data +'</span>');
				}		
			}	
		}
	}
	xhr.send(myFormData)
}

const importAdhocForm = document.getElementById('importAdhocForm')
importAdhocForm.addEventListener("submit", handleImportAdhoc)


// //...loading page again on closing the add new product form...//
// $('#staticBackdrop').on('hidden.bs.modal', function () {
// 	window.location.reload();
// })
// $('#historyModal').on('hidden.bs.modal', function () {
// 	window.location.reload();
// })
// $('#editModal').on('hidden.bs.modal', function () {
// 	window.location.reload();	
// })
// $('#importModal').on('hidden.bs.modal', function () {
// 	window.location.reload();
// })

//...loading page again on click on closing button of form...//
$('.btn-close').on('click', function () {
	debugger
	window.location.reload();
}) 

// Used for three dots click event in action column
$(".dropout").on('click', function(){
	debugger
	if (!this.classList.contains('more')) {
	document.querySelectorAll('.dropout.activeActn').forEach(
	  (d) => d !== this && d.classList.remove('activeActn')
	)}
	this.classList.toggle('activeActn')
});

$("#id_purchase_date").on('change', function(){
	debugger
	var val = $(this).val();
	$("#id_received_date").attr('min', val)
});

$("#purchase_date").on('change', function(){
	debugger
	var val = $(this).val();
	$("#received_date").attr('min', val)
});

$(document).ready(function(){
	$('.info').popover({title: "<h6><strong>Information</strong></h6>", content: "<ul><li>Type column should be present.</li><li>Date format should be in yyyy-mm-dd.</li><li>Supported file format are CSV, XLSX and XLS.</li></ul>", html: true, placement: "right"});
});
