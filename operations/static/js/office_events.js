var minDate, maxDate, dataTableRes, dataTableRes1;

function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Item</span>'+d[4]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Food</span>'+d[5]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Paid By: </span>'+d[8]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Remarks: </span>'+d[9]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Item</span>'+d[4]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Food</span>'+d[5]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Paid By: </span>'+d[8]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Remarks: </span>'+d[9]+'</div></div><br>'+
		'<div style=" background: #538ddc; margin-bottom: 10px; padding: 10px">'+
			'<div><p class="font-weight-bold" style="color: #ffff">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){
		var prekeyval = Object.entries(res[key]['previous'])
		var curkeyval = Object.entries(res[key]['current'])
		if (key == 'item'){
			for (var i = 0; i < prekeyval.length; i++){
				if ((prekeyval[i][0] != curkeyval[i][0]) || (prekeyval[i][1] != curkeyval[i][1])){
					d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + prekeyval[i][0] + ' : ' + prekeyval[i][1] + '</td><td>' + curkeyval[i][0] + ' : ' + curkeyval[i][1] + '</td></tr>'
					b += d
				}
			}
		}
		if (key == 'food'){
			for (var i = 0; i < prekeyval.length; i++){
				if ((prekeyval[i][0] != curkeyval[i][0]) || (prekeyval[i][1] != curkeyval[i][1])){
					d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + prekeyval[i][0] + ' : ' + prekeyval[i][1] + '</td><td>' + curkeyval[i][0] + ' : ' + curkeyval[i][1] + '</td></tr>'
					b += d
				}
			}
		}
		if (key != 'item' && key != 'food'){
			d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
			b += d
		}
	}
	b += '</tbody></table></div>'
    return b;
}


//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {

	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 9 },
		],
		'pageLength': 5,
		"bLengthChange": false,
		"autoWidth": false,
		initComplete: function () {		
			$.fn.dataTable.ext.search.push(
				function (settings, data, dataIndex) {	
					debugger;	
					let activeTabId = "1";
					let pur_min =$('#pur_min_'+activeTabId).val();
					let pur_max = $('#pur_max_'+activeTabId).val();
					
					pur_min = (pur_min != "")?new Date(pur_min):null;
					pur_max = (pur_max != "")?new Date(pur_max):null;
					
					let purchaseDate = new Date(data[0]);
					let recordType  = data[8]

					if(activeTabId == recordType){
						if (pur_min == null && pur_max == null )
							return true;
						if (pur_min == null && purchaseDate <= pur_max)
							return true;
						if (pur_max == null && ( pur_min != null && purchaseDate >= pur_min))
							return true;
						if (purchaseDate <= pur_max && purchaseDate >= pur_min)
							return true;
					}else{
						return true;
					}	
				}		
			)	
		}		
	});

	var url = $("#addEventForm").attr("data-events-url");
	// ajax request for fetching event name values in add form 
	$.ajax({                       
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#id_event_name").html(response);
        }
    });

	var url = $("#editEventForm").attr("data-events-url");
	// ajax request for fetching event name values in edit form 
	$.ajax({                      
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#event_name").html(response);
        }
    });

	var url = $("#addEventForm").attr("data-users-url");
	// ajax request for fetching paid by values in add form
	$.ajax({                       
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#id_paid_by").html(response);
        }
    });

	var url = $("#editEventForm").attr("data-users-url");
	// ajax request for fetching paid by values in edit form
	$.ajax({                       
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#paid_by").html(response);
        }
    });
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


$("#addButtonI").click(function () {
	debugger;
	var html = $("#itemField1").html(); 
	var itemF = '<div class="row">' + html + '<div class="col-1"><input type="button" value="Remove" class="addedField" onclick=removefunction(this) style="margin: 1 px; padding: 5px; border-radius: 3px; border: 1px solid #635e5e; font-size: 14px;"></div></div>'
	$("#newItemField").append(itemF);
});

$("#addButtonF").click(function () {
	var html = $("#foodField1").html();
	var foodF = '<div class="row">' + html + '<div class="col-1"><input type="button" value="Remove" class="addedField" onclick=removefunction(this) style="margin: 1 px; padding: 5px; border-radius: 3px; border: 1px solid #635e5e; font-size: 14px;"></div></div>'  
	$("#newFoodField").append(foodF);

});

$("#editAddButtonI").click(function () {
	debugger;
	var html = $("#editItemField1").html(); 
	var itemF = '<div class="row">' + html + '<div class="col-1"><input type="button" value="Remove" class="addedField" onclick=removefunction(this) style="margin: 1 px; padding: 5px; border-radius: 3px; border: 1px solid #635e5e; font-size: 14px;"></div></div>'
	$("#editNewItemField").append(itemF);
});

$("#editAddButtonF").click(function () {
	var html = $("#editFoodField1").html();
	var foodF = '<div class="row">' + html + '<div class="col-1"><input type="button" value="Remove" class="addedField" onclick=removefunction(this) style="margin: 1 px; padding: 5px; border-radius: 3px; border: 1px solid #635e5e; font-size: 14px;"></div></div>'  
	$("#editNewFoodField").append(foodF);

});

function removefunction(obj){
	debugger;
	$(obj).parent().parent().remove();
}

$('#id_event_name').change(function(){
    debugger;
	if ($(this).val() == "Other"){
		$("#id_new_event").prop({'required': true });
		$("#id_new_event").parent().parent().css("display", "block");
	}
	else {
		$("#id_new_event").prop({ 'required': false });
		$("#id_new_event").parent().parent().css("display", "none");
	}
});

$('#event_name').change(function(){
    debugger;
	if ($(this).val() == "Other"){
		$("#new_event").prop({'required': true });
		$("#new_event").parent().parent().css("display", "block");
	}
	else {
		$("#new_event").prop({ 'required': false });
		$("#new_event").parent().parent().css("display", "none");
	}
});

$('#addButton').click(function() {
	debugger;
    var obj = {}
	var obj1 = {}

    x = document.getElementsByClassName('foodName');
    y = document.getElementsByClassName('foodPrice');
    for (i = 0; i < x.length; i++) {
        obj[x[i].value] = y[i].value;
	}
	
	jsonobj = JSON.stringify(obj);
	$('#id_food').val(jsonobj);

	x1 = document.getElementsByClassName('itemName');
	y1 = document.getElementsByClassName('itemPrice');
	for (i = 0; i < x1.length; i++) {
        obj1[x1[i].value] = y1[i].value;
    }
	jsonobj1 = JSON.stringify(obj1);
	$('#id_item').val(jsonobj1);
});

$('#updateButton').click(function() {
	debugger;
    var obj = {}
	var obj1 = {}

    x = document.getElementsByClassName('editFoodName');
    y = document.getElementsByClassName('editFoodPrice');
    for (i = 0; i < x.length; i++) {
        obj[x[i].value] = y[i].value;
	}
	console.log(obj);
	jsonobj = JSON.stringify(obj);
	$('#food').val(jsonobj);

	x1 = document.getElementsByClassName('editItemName');
	y1 = document.getElementsByClassName('editItemPrice');
	for (i = 0; i < x1.length; i++) {
        obj1[x1[i].value] = y1[i].value;
    }
	jsonobj1 = JSON.stringify(obj1);
	$('#item').val(jsonobj1);
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

//...called when save and add another button on addOfficeEvent form is clicked...//
$("#saveNew").click(function (e) {
	debugger;
	e.preventDefault()
	var obj = {}
	var obj1 = {}

    x = document.getElementsByClassName('foodName');
    y = document.getElementsByClassName('foodPrice');
    for (i = 0; i < x.length; i++) {
        obj[x[i].value] = y[i].value;
	}
	console.log(obj);
	jsonobj = JSON.stringify(obj);
	$('#id_food').val(jsonobj);

	x1 = document.getElementsByClassName('itemName');
	y1 = document.getElementsByClassName('itemPrice');
	for (i = 0; i < x1.length; i++) {
        obj1[x1[i].value] = y1[i].value;
    }
	jsonobj1 = JSON.stringify(obj1);
	$('#id_item').val(jsonobj1);

	var $formId = $(this).parents('form');
	var url = $("#addEventForm").attr("action");
	var data = $("#addEventForm").serialize();

	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		success: function (data, status) {
			debugger;
			if (status === "success") {
				document.getElementById('addEventForm').reset()

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
			document.getElementById('addEventForm').reset()
			$("#id_new_event").parent().parent().css("display", "none");
			$("#id_add_name").parent().parent().css("display", "none");
			$(".addedField").parent().parent().remove();
		},
		error: function (request, status, error) {
			debugger;
			if ('non_field_errors' in request.responseJSON) {
				alert(request.responseJSON['non_field_errors'][0])
			}
			Inval = request.responseJSON
			$('.required', $formId).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if(!$parentTag[0].classList.contains("error")){
						$parentTag.addClass('error').append('<span class="error" id="err" style="color: red; font-size: 14px;">' + Inval[ipVal] + '</span>');
					}
				}else{
					debugger;
					if($(this).nextAll().length==2){
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					}else{
						$parentTag.removeClass("error");
						$(this).siblings('#err').remove();
					}
				}

			})
		}
	});
});


//...called when edit button of officeEvent form is clicked...//
function editfunction(obj, itemLen, foodLen) {
	debugger;

	for (var i = 0; i < (itemLen - 1); i++) {
		var html = $("#editItemField1").html(); 
		var itemF = '<div class="row">' + html + '<div class="col-1"><input type="button" value="Remove" class="addedField" onclick=removefunction(this) style="margin: 1 px; padding: 5px; border-radius: 3px; border: 1px solid #635e5e; font-size: 14px;"></div></div>'
		$("#editNewItemField").append(itemF);
	}
	for (var i = 0; i < (foodLen - 1); i++) {
		var html = $("#editFoodField1").html();
		var foodF = '<div class="row">' + html + '<div class="col-1"><input type="button" value="Remove" class="addedField" onclick=removefunction(this) style="margin: 1 px; padding: 5px; border-radius: 3px; border: 1px solid #635e5e; font-size: 14px;"></div></div>'  
		$("#editNewFoodField").append(foodF);
	}

	document.getElementById('editEventForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editEventForm').getElementsByTagName('input');
	var mySelect = document.getElementById('editEventForm').getElementsByTagName('select');
	var myText = document.getElementById('editEventForm').getElementsByTagName('textarea');

	var event = x[1].textContent;
	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (event == i.value) {
			mySelect[0].selectedIndex = j;
			break;
		}
	}

	// for (var i = 0; i < (y.length - (((itemLen-1)*3) + ((foodLen-1)*3) + 7)); i++) {
	for (var i = 0; i < 3; i++) {
		var str = x[i].textContent;
		y[i + 1].value = str;
	}
	
    for (var i = 0, j = 4; i < itemLen; i++) {
		y[j].value = x[3].children[i].textContent;
		if (i == 0){
			j = j + 2;
		}
		else{
			j = j + 3;
		}
	}
	for (var i = 0, j = j + 1; i < foodLen; i++) {
		y[j].value = x[5].children[i].textContent;
		if (i == 0){
			j = j + 2;
		}
		else{
			j = j + 3;
		}
	}
	
	for (var i = 0, j = 5; i < itemLen; i++) {
		y[j].value = x[4].children[i].textContent;
		if (i == 0){
			j = j + 2;
		}
		else{
			j = j + 3;
		}
	}
	for (var i = 0, j = j + 1; i < foodLen; i++) {
		y[j].value = x[6].children[i].textContent;
		if (i == 0){
			j = j + 2;
		}
		else{
			j = j + 3;
		}
	}

	var paid_by = x[7].textContent;
	for (var i, j = 0; i = mySelect[1].options[j]; j++) {
		if (paid_by == i.value) {
			mySelect[1].selectedIndex = j;
			break;
		}
	}

	myText[2].value = x[8].textContent;
	document.getElementById('editEventForm').action = obj.id;
}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteEventForm').action = obj.id;
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
			title: 'Office Events History',
			exportOptions: {
				columns: [0, 1, 2, 6, 7]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 12 }
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

		var id = tr[0].children[10].innerText;
		var history_id = tr[0].children[11].innerText;
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


//...function called when addOfficeEvent form is submitted...//
function handleaddnewEvent(event) {
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
			var Inval = xhr.response
		    $('.required', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if (!$parentTag[0].classList.contains("error")) {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 14px">' + Inval[ipVal] + '</span>')
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

const addNewForm = document.getElementById('addEventForm')
addNewForm.addEventListener("submit", handleaddnewEvent)


//...function called when edit form is submitted...//
function handleEditEvent(event) {
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
			$('.required', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if (!$parentTag[0].classList.contains("error")) {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 14px">' + Inval[ipVal] + '</span>')
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

const editForm = document.getElementById('editEventForm')
editForm.addEventListener("submit", handleEditEvent)


//...function called when delete form is submitted...//
function handleDeleteEvent(event) {
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

const deleteForm = document.getElementById('deleteEventForm')
deleteForm.addEventListener("submit", handleDeleteEvent)


//...function called when import form is submitted...//
function handleImportEvent(event) {
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

const importVendorForm = document.getElementById('importEventsForm')
importVendorForm.addEventListener("submit", handleImportEvent)


//...loading page again on click on closing button of form...//
$('.btn-close').on('click', function () {
	debugger
	window.location.reload();
}) 

$(document).ready(function(){
	$('.info').popover({title: "<h6><strong>Information</strong></h6>", content: "<ul><li>Date format should be in yyyy-mm-dd.</li><li>Supported file format are CSV, XLSX and XLS.</li></ul>", html: true, placement: "right"});
});

// Used for three dots click event in action column
$(".dropout").on('click', function(){
	debugger
	if (!this.classList.contains('more')) {
	document.querySelectorAll('.dropout.activeActn').forEach(
	  (d) => d !== this && d.classList.remove('activeActn')
	)}
	this.classList.toggle('activeActn')
});