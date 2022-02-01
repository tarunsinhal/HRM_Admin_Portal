var minDate, maxDate, dataTableRes, dataTableRes1;

function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Alternate No.: </span>'+d[6]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Nominal Charges: </span>'+d[7]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Additonal Info: </span>'+d[8]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Alternate No.: </span>'+d[6]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Nominal Charges: </span>'+d[7]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Additonal Info: </span>'+d[8]+'</div></div><br>'+
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
			title: 'Vendor Details',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 5 },
			{ orderable: false, targets: 7 }
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,
	});
});


//...called when edit button is clicked...//
function editfunction(obj) {
	debugger
	document.getElementById('editForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editForm').getElementsByTagName('input');
	var z = document.getElementById('editForm').getElementsByTagName('textarea');

	for (var i = 0; i < (y.length - 2); i++) {
		// var str = x[i].textContent.split(/(\s+)/);
		// y[i + 1].value = str[0]
		y[i + 1].value = x[i].textContent;
	}

	z[0].value = x[5].textContent;
	document.getElementById('editForm').action = obj.id;

}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
}

//...called when click here link clicked in history...//
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
			title: 'Recurring History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 5 },
			{ orderable: false, targets: 11 }
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

		var id = tr[0].children[9].innerText;
		var history_id = tr[0].children[10].innerText;
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


//...called when save and add another button on addProduct form is clicked...//
$("#saveNew").click(function (e) {
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
			if (status === "success") {
				console.log(data)
				document.getElementById('addForm').reset()

				$('.chk', $formId).each(function () {
					var $parentTag = $(this).parent();
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).nextAll()[1].remove();
					} else {
						$parentTag.removeClass("error");
						$(this).next().remove();
					}
				})
			}
			console.log(data)
			document.getElementById('addForm').reset()

		},
		error: function (request, status, error) {
			if (request.responseJSON['non_field_errors']){
				alert(request.responseJSON['non_field_errors'])
				// $('#add-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + request.responseJSON['non_field_errors'] + '</span></center>')
			}
			
			Inval = request.responseJSON
			$('.chk', $formId).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 13px">' + Inval[ipVal] + '</span>')
					}
				} else {
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).nextAll()[1].remove();
					} else {
						$parentTag.removeClass("error");
						$(this).next().remove();
					}
				}
			});
		}
	});
});


//...function called when addProduct form is submitted...//
function handleaddnewProduct(event) {
	debugger
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
				alert("Name already exists.");
				// $('#add-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + Inval['non_field_errors'] + '</span></center>')
			}
			$('.chk', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 13px">' + Inval[ipVal] + '</span>')
					}
				}
				else {
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).nextAll()[1].remove();
					} else {
						$parentTag.removeClass("error");
						$(this).next().remove();
					}
				}
			});	
		}	
	}
	xhr.send(myFormData)
}

const addNewForm = document.getElementById('addForm')
addNewForm.addEventListener("submit", handleaddnewProduct)


//...function called when edit form is submitted...//
function handleEditProduct(event) {
	debugger
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
				alert("Name already exists.");
				// $('#edit-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + Inval['non_field_errors'] + '</span></center>')
		    }
		    $('.chk', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 13px">' + Inval[ipVal] + '</span>')
					}
				}
				else {
					if ($(this).nextAll().length == 2) {
						$parentTag.removeClass("error");
						$(this).nextAll()[1].remove();
					} else {
						$parentTag.removeClass("error");
						$(this).next().remove();
					}
				}
			});	
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


//...function called when import form is submitted...//
function handleImportVendor(event) {
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

const importVendorForm = document.getElementById('importVendorForm')
importVendorForm.addEventListener("submit", handleImportVendor)

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

$(document).ready(function(){
	$('.info').popover({title: "<h6><strong>Information</strong></h6>", content: "<ul><li>Date format should be in yyyy-mm-dd.</li><li>Supported file format are CSV, XLSX and XLS.</li></ul>", html: true, placement: "right"});
});

