

function format ( d ) {
	debugger
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Type: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[9]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Id: </span>'+d[10]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Name: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity Start Date: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity End Date: </span>'+d[13]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[14]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Remarks: </span>'+d[15]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff(d,res){
	debugger
	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Type: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[9]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Id: </span>'+d[10]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Name: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity Start Date: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity End Date: </span>'+d[13]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[14]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Remarks: </span>'+d[15]+'</div></div><br>'+
	'</div></div>'+
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


var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {

	// $(".js-multiple-system-select").select2({
	// 	dropdownParent: $('#staticBackdrop, #editModal')
	// });
	
	// $(".edit_status option[value='2']").remove();

	dataTableRes = $('.inventoryTable').DataTable({
		dom: 'Bfrtip',
		destroy: true,
		retrieve: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			exportOptions: {
				columns: [0, 1, 2, 3, 4,5 ,6,7,8,9,10,11]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 6 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 9 },
			{ orderable: false, targets: 10 },
			{ orderable: false, targets: 11 },
			{ orderable: false, targets: 12 },
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,																				
	});	

	

});


//...called when edit button is clicked...//
function editfunction(obj, obj2) {
	debugger;
	document.getElementById('editInventoryForm').style.display = 'block'
	// var x = Array.from(document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td'));
	var x =  Array.from(document.getElementById(obj.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td'));
	var y = Array.from(document.getElementById('editInventoryForm').getElementsByTagName('input'));
	var z = document.getElementById('editInventoryForm').getElementsByTagName('textarea');
	var mySelect = document.getElementById('editInventoryForm').getElementsByTagName('select');

	var item_txt = x[2].textContent.split('-')
	y[3].value = item_txt[0]
	y[4].value = item_txt[1]

	z[0].value = x[11].textContent;

	var temp = x[3].textContent.trim();
	for (var i, j = 0; i = mySelect[1].options[j]; j++) {
		if (temp == i.textContent) {
			mySelect[1].selectedIndex = j;
			break;
		}
	}

	// var system_lst = JSON.parse(x[9].textContent.trim())
	// $("#edit_system_names").select2('val', system_lst).trigger('change');
	
	// $("#edit_system_names").val(system_lst).trigger('change');

	// $.each(system_lst, function(i,e){
	// 	$("#edit_system_names option[value=" + e + "]").prop("selected", true);
	// });


	// var opt = mySelect[2].options;
	// for (var k = 0; k < system_lst.length; k++){
	// 	for (var i, j = 0; i = mySelect[2].options[j]; j++) {
	// 		if (system_lst[k] == i.value) {
	// 			i.selected = true;
	// 			break;
	// 		}
	// 	}
	// }

	if (obj2 == '2'){
		debugger
		$("#item_base_name").prop({'readonly': false});
		$("#edit_validity_input").css("display", "block");
		// $("#edit_system_names_input").css("display", "block");
		$("#validity_start_date, #validity_end_date").prop({'required': true });
		$("#item_base_name").prop({'required': false });
		$("#item_number").prop({'required': false });
	}
	else{
		$("#edit_validity_input").css("display", "none");
		// $("#edit_system_names_input").css("display", "none");
		// $("#edit_system_names_input").val('');
		$("#validity_start_date, #validity_end_date").val('');
		$("#validity_start_date, #validity_end_date").prop({'required': false });
		$("#item_base_name").prop({'required': true });
		$("#item_number").prop({'required': true });
	}

	// var name = x[4].textContent;
	// for (var i, j = 0; i = mySelect[0].options[j]; j++) {
	// 	if (name == i.value) {
	// 		mySelect[0].selectedIndex = j;
	// 		break;
	// 	}
	// }
	// x.splice(4, 1)
	// z[0].value = x[5].textContent;
	// for (i = 0; i < (y.length - 1); i++) {
	// 	var str = x[i].textContent.trim();
	// 	y[i+1].value = str
	// }

	var url = $("#addInventoryForm").attr("data-item-url");
	var typeId = obj2;

	$.ajax({                      
		url: url,
		data: {
			'Type': typeId
		},
		async: false,
		success: function (data) {
			debugger
			$("#item").html(data);
			$("#item option[value='other']").remove();

			var temp = x[0].textContent.trim();
			for (var i, j = 0; i = mySelect[0].options[j]; j++) {
				if (temp == i.textContent) {
					mySelect[0].selectedIndex = j;
					break;
				}
			}
		}
	});

	var removeValFromX = [0, 2, 3, 4, 5, 6, 7, 11]
	x = x.filter(function(value, index) {
		return removeValFromX.indexOf(index) == -1;
   	})

	var removeValFromY = [0, 1, 3, 4, 8]
	y = y.filter(function(value, index) {
		return removeValFromY.indexOf(index) == -1;
   	})
	
	for (i = 0; i < (y.length); i++) {
		var str = x[i].textContent.trim();
		y[i].value = str
	}

	document.getElementById('editInventoryForm').action = obj.id;
	
}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
}


//...called when discard button is clicked...//
function discardfunction(obj) {
	document.getElementById('discardForm').action = obj.id;
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
			title: 'Inventory History',
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
		'pageLength': 12,
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

		var id = tr[0].children[16].innerText;
		var history_id = tr[0].children[17].innerText;
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


//...function called when addProduct form is submitted...//
function handleaddnewInventory(event) {
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
			debugger
			var Inval = xhr.response
			if (Inval['non_field_errors']) {
				alert("Name already exists.");
			}
			$('.chk', myForm).each(function () {
				debugger
				var ipVal = $(this).attr('name');

				if (ipVal == 'item_base_name'){
					ipVal = 'name'
				}

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if (!$parentTag[0].classList.contains("error")) {
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

const addNewInventoryForm = document.getElementById('addInventoryForm')
addNewInventoryForm.addEventListener("submit", handleaddnewInventory)


//...function called when edit form is submitted...//
function handleEditInventory(event) {
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
			debugger
			var Inval = xhr.response
			if (Inval['non_field_errors']) {
				alert("Name already exists.");
			}
			$('.chk', myForm).each(function () {
				debugger
				var ipVal = $(this).attr('name');

				if (ipVal == 'item_base_name'){
					ipVal = 'name'
				}

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if (!$parentTag[0].classList.contains("error")) {
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

const editForm = document.getElementById('editInventoryForm')
editForm.addEventListener("submit", handleEditInventory)


//...function called when delete form is submitted...//
function handleDeleteInventory(event) {
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
		else if (xhr.status === 400) {
			debugger
			var Inval = xhr.response
			if (Inval['non_field_errors']) {
				alert(Inval['non_field_errors']);
			}
			else{
				$parentTag = $("#deleteModalbody").parent()
				if ($parentTag[0].classList.contains("error")) {
					$parentTag.removeClass("error");
					$('.err').remove();
				}
			  
				if (!$parentTag[0].classList.contains("error")) {
					$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ Inval['error_data'] +'</span>');
					
				}
			}
		}
	}
	xhr.send(myFormData)
}

const deleteForm = document.getElementById('deleteForm')
deleteForm.addEventListener("submit", handleDeleteInventory)


//...function called when delete form is submitted...//
function handleDiscardInventoryItem(event) {
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
		else if (xhr.status === 400) {
			debugger
			var Inval = xhr.response
			if (Inval['non_field_errors']) {
				alert(Inval['non_field_errors']);
			}
			else{
				$parentTag = $("#deleteModalbody").parent()
				if ($parentTag[0].classList.contains("error")) {
					$parentTag.removeClass("error");
					$('.err').remove();
				}
			  
				if (!$parentTag[0].classList.contains("error")) {
					$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ Inval['error_data'] +'</span>');
					
				}
			}
		}
	}
	xhr.send(myFormData)
}

const discardForm = document.getElementById('discardForm')
discardForm.addEventListener("submit", handleDiscardInventoryItem)


//...function called when import form is submitted...//
function handleImportHardwareInventory(event) {
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

const importHardwareInventoryForm = document.getElementById('importHardwareInventoryForm')
importHardwareInventoryForm.addEventListener("submit", handleImportHardwareInventory)


//...function called when Software import form is submitted...//
function handleImportSoftwareInventory(event) {
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

const importSoftwareInventoryForm = document.getElementById('importSoftwareInventoryForm')
importSoftwareInventoryForm.addEventListener("submit", handleImportSoftwareInventory)


//...loading page again on closing the add new product form...//
$('#staticBackdrop, #deleteModal, #historyModal').on('hidden.bs.modal', function () {
	debugger
	window.location.reload();
})


$('#id_allottee_id').on('change', function(){
	debugger
	var val = $(this).val();
	
	var url = $("#addInventoryForm").attr("data-products-url");
	$.ajax({
		url: url,
		data: {'code': val},
		dataType: 'json',
		success: function(data){
			debugger
			$("#id_allotte_name").val(data['name']);

		},
		error: function(data){
			debugger
		}
	})
})


$('#allottee_id').on('change', function(){
	debugger
	var val = $(this).val();
	$("#id_allotte_name").val();
	$("#allotte_name").val();
	var url = $("#addInventoryForm").attr("data-products-url");
	$.ajax({
		url: url,
		data: {'code': val},
		dataType: 'json',
		success: function(data){
			debugger
			$("#allotte_name").val(data['name']);
		},
		error: function(data){
			debugger
		}
	})
})


//.... for getting products list based on selected type in add product form...//
$("#id_type").change(function () {
	debugger
	var url = $("#addInventoryForm").attr("data-item-url");
	var typeId = $(this).val();

	$.ajax({                       // initialize an AJAX request
		url: url,
		data: {
			'Type': typeId
		},
		success: function (data) {
			$("#id_item").html(data);
		}
	});

	if (typeId == 2){
		debugger
		$("#item_base_name").prop({'readonly': false, 'value': '' });
		$("#validity_input").css("display", "block");
		$("#system_names_input").css("display", "block");
		$("#id_validity_start_date, #id_validity_end_date").prop({'required': true });
		$("#item_base_name").prop({'required': false });
		$("#item_number").prop({'required': false });
	}
	else{
		$("#validity_input").css("display", "none");
		$("#system_names_input").css("display", "none");
		$("#system_names_input").val('');
		$("#id_validity_start_date, #id_validity_end_date").val('');
		$("#id_validity_start_date, #id_validity_end_date").prop({'required': false });
		$("#item_base_name").prop({'required': true });
		$("#item_number").prop({'required': true });
	}
});


$('#id_item').change(function () {
	debugger
	var value = $(this).val();

	if (value == '1') {
		$("#item_base_name").val('Certainty')
		$("#item_base_name").prop({'readonly': true });
		$("#id_new_item").prop({ 'required': false });
		$("#id_new_item").parent().parent().css("display", "none");
	}

	else if (value == '2'){
		$("#item_base_name").val('M')
		$("#item_base_name").prop({'readonly': true });
		$("#id_new_item").prop({ 'required': false });
		$("#id_new_item").parent().parent().css("display", "none");
	}

	else if (value == '3'){
		$("#item_base_name").val('B')
		$("#item_base_name").prop({'readonly': true });
		$("#id_new_item").prop({ 'required': false });
		$("#id_new_item").parent().parent().css("display", "none");
	}

	else if (value == "other") {
		$("#id_new_item").prop({ 'type': 'text', 'required': true });
		$("#id_new_item").parent().parent().css("display", "block");
		$("#item_base_name").val('')
		$("#item_base_name").prop({'readonly': false });
	}
	else {
		$("#id_new_item").prop({ 'required': false });
		$("#id_new_item").parent().parent().css("display", "none");
		$("#item_base_name").val('')
		$("#item_base_name").prop({'readonly': false });
	}
});


$("#id_validity_start_date").on('change', function(){
	debugger
	var val = $(this).val();
	$("#id_validity_end_date").attr('min', val)
})


//...function for switching between different tabs...//
function openTab(evt, tabName) {
	debugger
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


// Used for three dots click event in action column
$(".dropout").on('click', function(){
	debugger
	if (!this.classList.contains('more')) {
	document.querySelectorAll('.dropout.activeActn').forEach(
	  (d) => d !== this && d.classList.remove('activeActn')
	)}
	this.classList.toggle('activeActn')
});
