var minDate, maxDate, dataTableRes;

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

	$.ajax({                       // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#id_event_name").html(response);
        }
    });
	var url = $("#editEventForm").attr("data-events-url");

	$.ajax({                       // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#event_name").html(response);
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
	console.log(obj);
	jsonobj = JSON.stringify(obj);
	console.log($('#id_food').val());
	$('#id_food').val(jsonobj);
	console.log($('#id_food').val());

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

	myText[2].value = x[7].textContent;
	document.getElementById('editEventForm').action = obj.id;
}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteEventForm').action = obj.id;
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
			var $parentTag = $('#id_import_file').parent();
			if (!$parentTag[0].classList.contains("error")) {
				$parentTag.addClass('error').prepend('<span class="error" style="color: red; font-size=12px;">Wrong Format, Try again !!</span>');
			}				
		}
	}
	xhr.send(myFormData)
}

const importVendorForm = document.getElementById('importEventsForm')
importVendorForm.addEventListener("submit", handleImportEvent)


//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	window.location.reload();
})

$('#editModal').on('hidden.bs.modal', function () {
	window.location.reload();
})

// Used for three dots click event in action column
document.querySelector('table').onclick = ({
	target
  }) => {
	if (!target.classList.contains('more')) return
	document.querySelectorAll('.dropout.activeActn').forEach(
	  (d) => d !== target.parentElement && d.classList.remove('activeActn')
	)
	target.parentElement.classList.toggle('activeActn')
}