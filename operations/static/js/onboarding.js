var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	debugger
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Tshirt Inventory',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 1 },
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 5 },
			{ orderable: false, targets: 6 },
			{ orderable: false, targets: 7 }
		],
		
		'rowsGroup': [0, 1, 9],
		'pageLength': 12,
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
					
					pur_min = (pur_min != "")?new Date(pur_min):null ;
					pur_max = (pur_max != "")?new Date(pur_max):null;
					next_min = (next_min != "")?new Date(next_min):null ;
					next_max = (next_max != "")?new Date(next_max):null;

					let purchaseDate = new Date(data[0]);
					let recordType  = data[7]

					if(activeTabId == recordType){
						if ((pur_min == null && pur_max == null ) && (next_min == null && next_max == null )) 
							return true;
						if ((pur_min == null && purchaseDate <= pur_max) && (next_min == null && nextDate <= next_max ))
							return true;
						if ((pur_max == null && ( pur_min != null && purchaseDate >= pur_min)) || (next_max == null && (next_min != null && nextDate >= next_min )))
							return true;
						if ((purchaseDate <= pur_max && purchaseDate >= pur_min) || ( (nextDate <= next_max && nextDate >= next_min)))
							return true;
					}else{
						return true;
					}	
				}		
			)	
		}		
	});	
});
$('.inventory_datepicker_1,.inventory_datepicker_2,.inventory_datepicker_3').on('change', function (e) {
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


// load Paid_by dropdown
$(document).ready(function () {
	var url = $("#addTshirtForm").attr("data-users-url");

	$.ajax({                       // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
		success: function (response) {
		debugger;
			$("#id_form-0-paid_by").html(response);
        }
    });
});


// Add Name field pops up when Other is selected in Add new Product form
$('#id_form-0-paid_by').change(function(){
	if ($(this).val() == "Other"){
		debugger;
		$("#id_form-0-add_name").prop({ 'type': 'text', 'required': true });
		$("#id_form-0-add_name").parent().parent().css("display", "block");
	}
	else {
		$("#id_form-0-add_name").prop({ 'required': false });
		$("#id_form-0-add_name").parent().parent().css("display", "none");
	}
});


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
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

	if(dataTableRes){
		dataTableRes.draw();		
	}		
}

// // Get the element with id="defaultOpen" and click on it
$("#defaultOpen").click();

$(".disable_allotted").each(function(){
	$(this).find('input').attr({"readOnly": true})
})


//...called when edit button is clicked...//
function editfunction(obj) {
	debugger;

	document.getElementById("staticBackdropLabel").textContent = "Update Items";
	document.getElementById("submitButton").textContent = "Update";

	var date = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td')[0].textContent.trim()
	var table1 = document.getElementById('table1').getElementsByTagName('tr')
	var table2 = document.getElementById('table2').getElementsByTagName('tr')

	document.getElementById('order_date').children[1].children[0].value = date

	$.ajax({
		type: 'GET',
		url: $("#addTshirtForm").attr("data-edit-url"),
		data: {'order_date': date},
		dataType: 'json',
		success: function(data){
			debugger
			var ids = {}
			for (var key in data['data']){
				if (data['data'][key] != null){
					if(data['data'][key]['id']){
						ids[key] =  data['data'][key]['id']
					}
				}
			}
			document.getElementById('addTshirtForm').action = 'tshirt_inventory/edit' + '?' + $.param(ids);

			if (data['data']['receiving_date']){
				document.getElementById('tshirt_receiving_date').children[1].children[0].value = data['data']['receiving_date'];
			}
			document.getElementById('paid_by').children[1].children[0].value = data['data']['paid_by']
			document.getElementById('additional').children[1].children[0].value = data['data']['additional']
			for (i=0; i<table1.length-1; i++){
				debugger
				var size = table1[i+1].children[0].children[0].value
				if (data['data'][size]){
					table1[i+1].children[1].children[0].value = data['data'][size]['previous_stock']
					table1[i+1].children[2].children[0].value = data['data'][size]['ordered_quantity']

					table2[i+1].children[1].children[0].readonly = false;
					table2[i+1].children[1].children[0].value = data['data'][size]['previous_stock']
					table2[i+1].children[1].children[0].readonly = true;
					table2[i+1].children[0].children[0].value = data['data'][size]['received_quantity'];
					table2[i+1].children[2].children[0].value = data['data'][size]['total_quantity']
					table2[i+1].children[3].children[0].value = data['data'][size]['allotted']
					if (data['data'][size]['error_message']){
						debugger
						table2[i+1].children[4].style.display = 'block'
						table2[i+1].children[4].children[0].value = data['data'][size]['error_message']
					}
				}
				else{
					table1[i+1].children[1].children[0].readonly = false;
					table1[i+1].children[1].children[0].value = 0
					table1[i+1].children[1].children[0].readonly = true;
				}
			}
		},
		error: function(data){
			debugger
		}
	})


	// var url = $("#addForm").attr("data-users-url");
	// debugger;  
	// $.ajax({                     // initialize an AJAX request
	//     type: "GET",
	// 	url: url,
	// 	dataType: "html",
	// 	success: function (response) {
	// 		debugger;
	// 		$("#paid_by").html(response);

	// 		var paid_by = x[7].textContent.split(/(\s+)/)[0]
	// 		for (var i, j = 0; i = mySelect[3].options[j]; j++) {
	// 			if (paid_by == i.value) {
	// 				mySelect[3].selectedIndex = j;
	// 				break;
	// 			}
	// 		}
    //     }
    // });


}


//...called when delete button is clicked...//
function deletefunction(obj) {
	var date = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td')[0].textContent.trim()
	$.ajax({
		type: 'GET',
		url: $("#addTshirtForm").attr("data-edit-url"),
		data: {'order_date': date},
		dataType: 'json',
		success: function(data){
			var ids = {}
			for (var key in data['data']){
				if (data['data'][key] != null){
					if(data['data'][key]['id']){
						ids[key] =  data['data'][key]['id']
					}
				}
			}
			document.getElementById('deleteTshirtForm').action = 'tshirt_inventory/delete' + '?' + $.param(ids);
		}
	})
}


//...function called when addProduct form is submitted...//
function handleaddnewTshirt(event) {
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
			debugger;
			const newProduct = xhr.response
			const newProduct1 = xhr.response
			console.log(xhr.response)
			alert('Next order should be greater than purchase date.....')
		}
	}
	xhr.send(myFormData)
}

const addNewTshirtForm = document.getElementById('addTshirtForm')
addNewTshirtForm.addEventListener("submit", handleaddnewTshirt)


//...function called when edit form is submitted...//
function handleTshirtEdit(event) {
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

const editTshirtForm = document.getElementById('editTshirtForm')
editTshirtForm.addEventListener("submit", handleTshirtEdit)


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

const deleteTshirtForm = document.getElementById('deleteTshirtForm')
deleteTshirtForm.addEventListener("submit", handleDeleteProduct)


//...function called when import form is submitted...//
function handleImportTshirt(event) {
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
			// alert('Wrong Formate, Try again.')
			var $parentTag = $('#id_import_file').parent();
			if ($parentTag[0].className != "form-group mb-0 files error") {
				$parentTag.addClass('error').prepend('<span class="error" style="color: red; font-size=10px;">Wrong Format, Please Try again !</span>');
			}				
		}
	}
	xhr.send(myFormData)
}

const importTshirtForm = document.getElementById('importTshirtForm')
importTshirtForm.addEventListener("submit", handleImportTshirt)


function showDropdown() {
	document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}


var sizes = document.getElementsByClassName("tshirt-size")
for(var i = 0, length = sizes.length; i < length; i++) {
	   sizes[i].style.pointerEvents = 'none';
 }


$('#id_status').on('change', function(){
	debugger
	var value = $(this).val();
	if (value == "ordered"){
		$("#tshirt_receiving_date, #tshirt_received_data").hide();
		$(".tshirt_error_message").hide()
		$("#id_form-0-receiving_date").prop({"required": false})
		$(".tshirt_error_message").each(function(){
			var a = $(this).find('textarea').attr({"required": false})
		})
	}
	if (value == "received"){
		$("#tshirt_receiving_date, #tshirt_received_data").show();
		$("#id_form-0-receiving_date").prop({"required": true});
		$(".tshirt_error_message").each(function(){
			debugger
			var a = $(this).find('textarea').val();
			if (a){
				$(this).show();
			}
		})
		// $("#table1").parent('div').addClass('col-4').removeClass('col')
	}
})


$('.tshirt_error_message').hide();


$('.tshirt_ordered_quantity').on('change', function(){
	debugger

	var status = $("#id_status").val();
	var ordered_val = $(this).find('input').val();
	var rowIndex = $(this).parent('tr').index()

	var received_val = $('#tbody2').find('tr')[rowIndex].children[0].children[0].value

	if (ordered_val != received_val && status != "ordered"){
		var error_id = $('#tbody2').find('tr')[rowIndex].children[4].children[0].id;
		$('#'+ error_id).parent().show();
		$('#'+ error_id).attr({"required": true});
	}
	else{
		var error_id = $('#tbody2').find('tr')[rowIndex].children[4].children[0].id;
		$('#'+ error_id).parent().hide();
		$('#'+ error_id).val('');
		$('#'+ error_id).attr({"required": false});
	}
})



$('.tshirt_received_quantity').on('change', function(){
	debugger
	var x = $(this).find('input').val();

	var rowIndex = $(this).parent('tr').index()
	var ordered_val = $('#tbody1').find('tr')[rowIndex].children[2].children[0].value;

	if (ordered_val != x){
		var error_id = $('#tbody2').find('tr')[rowIndex].children[4].children[0].id;
		$('#'+ error_id).parent().show();
		$('#'+ error_id).attr({"required": true});
	}
	else{
		var error_id = $('#tbody2').find('tr')[rowIndex].children[4].children[0].id;
		$('#'+ error_id).parent().hide();
		$('#'+ error_id).val('');
		$('#'+ error_id).attr({"required": false});
	}

	var c = $(this).parent('tr').children('td')
	var total = parseInt(x) + parseInt(c[1].children[0].value)
	c[2].children[0].value = total;
	
	if (total>0){
		var y = $(this).parent('tr').find('td')[3].children[0].id
		$("#"+y).attr({"readOnly": false, "max": total})
	}
	else{
		var y = $(this).parent('tr').find('td')[3].children[0].id
		$("#"+y).attr({"readOnly": true, "max": total})
	}	
})


$(".tshirt_allotted").each(function(){
	var a = $(this).parent('tr').children('td')[2].firstChild.value
	$(this).find('input').attr({"max": a})
})



//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	window.location.reload();
})



// let TshirtForm = document.querySelectorAll(".add-form-container")
// let container = document.querySelector(".add-tshirt-container")
// let addButton = document.querySelector("#add-form")
// let totalForms = document.querySelector("#id_form-TOTAL_FORMS")

// let formNum = TshirtForm.length-1

// addButton.addEventListener('click', addTshirtFunction)

// function addTshirtFunction(e) {
//     e.preventDefault()
//     debugger
//     let newForm = TshirtForm[0].cloneNode(true) //Clone the bird form
//     let formRegex = RegExp(`form-(\\d){1}-`,'g') //Regex to find all instances of the form number

//     formNum++ //Increment the form number
//     newForm.innerHTML = newForm.innerHTML.replace(formRegex, `form-${formNum}-`) //Update the new form to have the correct form number
    
//     let d = document.getElementById("id_form-0-purchase_date").value;
//     $(`#id_form-${formNum}-purchase_date`).val(d);
//     var c = `id_form-${formNum}-purchase_date`
    
//     container.insertBefore(newForm, addButton) //Insert the new form at the end of the list of forms
//     var el = $(`#id_form-${formNum}-purchase_date`).parent().parent();
//     el.hide()
//     totalForms.setAttribute('value', `${formNum+1}`) //Increment the number of total forms in the management form
// }

