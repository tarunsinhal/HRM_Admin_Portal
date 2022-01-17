var minDate, maxDate, dataTableRes, dataTableRes1;

function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Service Type.: </span>'+d[7]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Charges: </span>'+d[8]+'</div></div><br>'+
    '<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[9]+'</div><br>'+
    '<div class="col-6" style="text-align: left"><span class="font-weight-bold">Payment Mode: </span>'+d[10]+'</div></div><br>'+
    '<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Next Service Date: </span>'+d[11]+'</div><br>'+
    '<div class="col-6" style="text-align: left"><span class="font-weight-bold">Additonal Info: </span>'+d[12]+'</div></div><br>'+
    '</div></div>';
}

function format_and_diff(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Service Type.: </span>'+d[7]+'</div><br>'+
	'<div class="col-6" style="text-align: left"><span class="font-weight-bold">Charges: </span>'+d[8]+'</div></div><br>'+
    '<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[9]+'</div><br>'+
    '<div class="col-6" style="text-align: left"><span class="font-weight-bold">Payment Mode: </span>'+d[10]+'</div></div><br>'+
    '<div class="row"><div class="col-6" style="text-align: left"><span class="font-weight-bold">Next Service Date: </span>'+d[11]+'</div><br>'+
    '<div class="col-6" style="text-align: left"><span class="font-weight-bold">Additonal Info: </span>'+d[12]+'</div></div><br>'+
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
			title: 'Service/Repair Details',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 9 },
			{ orderable: false, targets: 11 }
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,	
		initComplete: function () {		
			$.fn.dataTable.ext.search.push(
				function (settings, data, dataIndex) {	
					debugger;	
					let activeTabId = "1";
					let pur_min =$('#pur_min_'+activeTabId).val();
					let pur_max = $('#pur_max_'+activeTabId).val();
					let next_min =$('#next_min_'+activeTabId).val();
					let next_max = $('#next_max_'+activeTabId).val();
					
					pur_min = (pur_min != "")?new Date(pur_min):null;
					pur_max = (pur_max != "")?new Date(pur_max):null;
					next_min = (next_min != "")?new Date(next_min):null;
					next_max = (next_max != "")?new Date(next_max):null;

					let purchaseDate = new Date(data[0]);
					let nextDate = new Date(data[8]);
					let recordType  = data[10]

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
	select = document.getElementById('id_vendor_name');
	var opt = document.createElement('option');
    opt.value = "";
    opt.innerHTML = "---------";
    select.appendChild(opt);
});

$('.inventory_datepicker_1').on('change', function (e) {
	let selDateType = e.target.getAttribute('data-attr-type')
	let selDateTypeVal = (selDateType == "pur")?"next":"pur";
	let activeTabId = "1";
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

// load Paid_by dropdown
$(document).ready(function () {
	var url = $("#addForm").attr("data-users-url");

	$.ajax({                       // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#id_paid_by").html(response);
        }
    });
});


//.... for getting vendor list based on selected service in add repair/service form ....//
$("#id_service_of").change(function () {
	debugger;
	var url = $("#addForm").attr("data-vendor-url");
	var serviceName = $(this).find(":selected").text();

	$.ajax({                      // initialize an AJAX request
		url: url,
		data: {
			'service_of': serviceName
		},
		success: function (data) {
			$("#id_vendor_name").html(data);
		}
	});
});

//.... for getting vendor contact no. based on selected vendor name ....//
$("#id_vendor_name").change(function () {
	debugger;
	var url = $("#addForm").attr("data-vendor-no-url");
	var vendorName = $(this).find(":selected").text();
	var serviceName = $('#id_service_of').find(":selected").text();

	$.ajax({                      // initialize an AJAX request
		url: url,
		data: {
			'vendor_name': vendorName,
			'service_name': serviceName
		},
		success: function (contact_no) {
			if (contact_no) {
				$("#id_contact_no").val(contact_no['contact_no'])
				document.getElementById("id_contact_no").style.pointerEvents = 'none';
			}
		}
	});
});

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


//...called when edit button is clicked...//
function editfunction(obj) {
	debugger
	document.getElementById('editForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editForm').getElementsByTagName('input');
	var z = document.getElementById('editForm').getElementsByTagName('textarea');
	var mySelect = document.getElementById('editForm').getElementsByTagName('select');

	// for (var i = 0; i < (y.length - 2); i++) {
	// 	var str = x[i].textContent.split(/(\s+)/);
	// 	y[i + 1].value = str[0]
	// }

	y[1].value = x[0].textContent;
    
	var temp = x[1].textContent;
	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (temp === i.value) {
			mySelect[0].selectedIndex = j;
			break;
		}
	}

	y[2].value = x[2].textContent;

	y[3].value = x[3].textContent;
	
    var url = $("#addForm").attr("data-vendor-url");
	var s = document.getElementById('service_of');
	var serviceName = s.options[s.selectedIndex].text;
	// var serviceName = $(a'#id_service_of').text();

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'service_of': serviceName
		},
		success: function (data) {
			debugger;
			$("#vendor_name").html(data);
			var temp1 = x[4].textContent;
			for (var i, j = 0; i = mySelect[1].options[j]; j++) {
				if (temp1 === i.value) {
					mySelect[1].selectedIndex = j;
					break;
				}
			}
		}
	});

	
	$("#vendor_name").change(function () {
		var url = $("#addForm").attr("data-vendor-no-url");
		var v = document.getElementById('vendor_name');
		var vendorName = v.options[v.selectedIndex].text;

		var s = document.getElementById('service_of');
		var serviceName = s.options[s.selectedIndex].text;
	
		$.ajax({                      // initialize an AJAX request
			url: url,
			data: {
				'vendor_name': vendorName,
				'service_name': serviceName
			},
			success: function (contact_no) {
				if (contact_no) {
					$("#contact_no").val(contact_no['contact_no'])
					document.getElementById('contact_no').style.pointerEvents = 'none';
					}
			}
		});
	});
    
	y[4].value = x[5].textContent;

	var url = $("#addForm").attr("data-users-url");
	debugger;  
	$.ajax({                     // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
			debugger;
			$("#paid_by").html(response);

			var paid_by = x[6].textContent.split(/(\s+)/)[0]
			for (var i, j = 0; i = mySelect[2].options[j]; j++) {
				if (paid_by == i.value) {
					mySelect[2].selectedIndex = j;
					break;
				}
			}
        }
    });
				
	// var paid_by = x[6].textContent
	// for (var i, j = 0; i = mySelect[2].options[j]; j++) {
	// 	if (paid_by === i.value) {
	// 		mySelect[2].selectedIndex = j;
	// 		break;
	// 	}
	// }

	var payment = x[7].textContent
	for (var i, j = 0; i = mySelect[3].options[j]; j++) {
		if (payment === i.value) {
			mySelect[3].selectedIndex = j;
			break;
		}
	}

	y[6].value = x[8].textContent;

	z[0].value = x[9].textContent;
	document.getElementById('editForm').action = obj.id;

	var val = $("#service_date").val();
	$("#next_service_date").attr('min', val)

}

//...called when history button is clicked...//
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
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 5 },
			{ orderable: false, targets: 6 },
			{ orderable: false, targets: 15 }
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

		var id = tr[0].children[13].innerText;
		var history_id = tr[0].children[14].innerText;
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

$('#service_of').change(function () {
	var url = $("#addForm").attr("data-vendor-url");
	var s = document.getElementById('service_of');
	var serviceName = s.options[s.selectedIndex].text;

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'service_of': serviceName
		},
		success: function (data) {
			debugger;
			$("#vendor_name").html(data);
			var temp1 = x[4].textContent;
			for (var i, j = 0; i = mySelect[1].options[j]; j++) {
				if (temp1 === i.value) {
					mySelect[1].selectedIndex = j;
					break;
				}
			}
	
		}
	});
});

//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
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

				$('.required', $formId).each(function () {
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
			var url = $("#addForm").attr("data-users-url");

			$.ajax({                       // initialize an AJAX request
				type: "GET",
				url: url,
				dataType: "html",
				success: function (response) {
				debugger;
					$("#id_paid_by").html(response);
				}
			});
			$("#id_add_name").parent().parent().css("display", "none");
		},
		error: function (request, status, error) {
			if ('non_field_errors' in request.responseJSON) {
				alert(request.responseJSON['non_field_errors'][0])
			}
			// if (request.responseJSON['non_field_errors']){
			// 	alert(request.responseJSON['non_field_errors'])
			// }
			$('.required', $formId).each(function () {
				console.log(request)
				var inputVal = $(this).val();

				var $parentTag = $(this).parent();
				if (inputVal == '') {
					if($parentTag[0].className!=="col-6 error"){
					$parentTag.addClass('error').append('<span class="error" style="color: red; font-size=12px;"><i class="material-icons">&#xe001;</i>This field is required </span>');}
				}else{
					if($(this).nextAll().length==2){
						$parentTag.removeClass("error");
						$(this).nextAll()[1].remove();
					}else{
						$parentTag.removeClass("error");
						$(this).next().remove();
					}
				}
			})
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
		else {
			alert('Unable to add data.')
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
		else {
			alert('There is some problem in updating the product.')
		}
	}
	xhr.send(myFormData)
}

const editForm = document.getElementById('editForm')
editForm.addEventListener("submit", handleEditProduct)


//...function called when delete form is submitted...//
function handleDeleteProduct(event) {
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
			alert('There is some problem in deleting the product.')
		}
	}
	xhr.send(myFormData)
}

const deleteForm = document.getElementById('deleteForm')
deleteForm.addEventListener("submit", handleDeleteProduct)

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

$("#id_service_date").on('change', function(){
	debugger
	var val = $(this).val();
	$("#id_next_service_date").attr('min', val)
});

$("#service_date").on('change', function(){
	debugger
	var val = $(this).val();
	$("#next_service_date").attr('min', val)
});