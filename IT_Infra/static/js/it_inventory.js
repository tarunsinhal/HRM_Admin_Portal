var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {

	$(".js-multiple-system-select").select2({
		dropdownParent: $('#staticBackdrop, #editModal')
	});
	

	dataTableRes = $('.inventoryTable').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			exportOptions: {
				columns: [0, 1, 2, 3, 4,]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,
		// initComplete: function () {		
		// 	$.fn.dataTable.ext.search.push(
		// 		function (settings, data, dataIndex) {	
		// 			debugger;	
		// 			let activeTabId = $('.tablinks.active').attr('data-tab-id');
		// 			let pur_min =$('#pur_min_'+activeTabId).val();
		// 			let pur_max = $('#pur_max_'+activeTabId).val();
		// 			let next_min =$('#next_min_'+activeTabId).val();
		// 			let next_max = $('#next_max_'+activeTabId).val();
					
		// 			let value = $('input[type=radio][name=radiobtn_'+activeTabId+']:checked').val();

		// 			pur_min = (pur_min != "")?new Date(pur_min):null;
		// 			pur_max = (pur_max != "")?new Date(pur_max):null;
		// 			next_min = (next_min != "")?new Date(next_min):null;
		// 			next_max = (next_max != "")?new Date(next_max):null;

		// 			let purchaseDate = new Date(data[8]);
		// 			let nextDate = new Date(data[9]);
		// 			let freq = data[0];
		// 			let recordType  = data[11]

		// 			if(activeTabId == recordType){
		// 				if ((pur_min == null && pur_max == null ) && (next_min == null && next_max == null ) && ((value == freq) || (value == "All"))) 
		// 					return true;
		// 				if (((pur_min == null && purchaseDate <= pur_max) && (next_min == null && nextDate <= next_max )) && ((value == freq) || (value == "All")))
		// 					return true;
		// 				if (((pur_max == null && ( pur_min != null && purchaseDate >= pur_min)) || (next_max == null && (next_min != null && nextDate >= next_min ))) && ((value == freq) || (value == "All")))
		// 					return true;
		// 				if (((purchaseDate <= pur_max && purchaseDate >= pur_min) ||  (nextDate <= next_max && nextDate >= next_min)) && ((value == freq) || (value == "All")))
		// 					return true;
		// 			}else{
		// 				return true;
		// 			}	
		// 		}		
		// 	)	
		// }																													
	});	
});


//...called when edit button is clicked...//
function editfunction(obj, obj2) {
	debugger;
	document.getElementById('editInventoryForm').style.display = 'block'
	var x = Array.from(document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td'));
	var y = Array.from(document.getElementById('editInventoryForm').getElementsByTagName('input'));
	var z = document.getElementById('editInventoryForm').getElementsByTagName('textarea');
	var mySelect = document.getElementById('editInventoryForm').getElementsByTagName('select');

	var item_txt = x[2].textContent.split('-')
	y[3].value = item_txt[0]
	y[4].value = item_txt[1]

	z[1].value = x[10].textContent;

	var temp = x[3].textContent.trim();
	for (var i, j = 0; i = mySelect[1].options[j]; j++) {
		if (temp == i.textContent) {
			mySelect[1].selectedIndex = j;
			break;
		}
	}

	var system_lst = JSON.parse(x[9].textContent.trim())
	// $("#edit_system_names").select2('val', system_lst).trigger('change');
	$("#edit_system_names").val(system_lst).trigger('change');

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
		$("#edit_system_names_input").css("display", "block");
		$("#validity_start_date, #validity_end_date").prop({'required': true });
		$("#item_base_name").prop({'required': false });
		$("#item_number").prop({'required': false });
	}
	else{
		$("#edit_validity_input").css("display", "none");
		$("#edit_system_names_input").css("display", "none");
		$("#edit_system_names_input").val('');
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

	var removeValFromX = [0, 2, 3, 4, 5, 9, 10, 11]
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


// $("#addBag").on('click', function(){
// 	$("#id_item").val("Bag");
// 	$("#id_item").prop({"readonly": true})
// })

// $("#addMouse").on('click', function(){
// 	$("#id_item").val("Mouse");
// 	$("#id_item").prop({"readonly": true})
// })

// $("#addLaptop").on('click', function(){
// 	$("#id_item").val("Laptop");
// 	$("#id_item").prop({"readonly": true})
// })


//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
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
