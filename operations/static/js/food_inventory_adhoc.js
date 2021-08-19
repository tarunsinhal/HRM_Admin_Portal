

var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export as CSV',
			exportOptions: {
				columns: [ 2, 3, 4, 5, 6, 7, 8]
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

					pur_min = (pur_min != "")?new Date(pur_min):null ;
					pur_max = (pur_max != "")?new Date(pur_max):null;

					let purchaseDate = new Date(data[6]);
//					let nextDate = new Date(data[8]);
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
});
//$('.inventory_datepicker_1,.inventory_datepicker_2,.inventory_datepicker_3').on('change', function (e) {
//	let selDateType = e.target.getAttribute('data-attr-type')
//	let selDateTypeVal = (selDateType == "pur")?"next":"pur";
//	let activeTabId = $('.tablinks.active').attr('data-tab-id');
//	let resetDateIdMin = selDateTypeVal+"_min_"+activeTabId;
//	let resetDateIdMax = selDateTypeVal+"_max_"+activeTabId;
//	$('#'+resetDateIdMin).val('')
//	$('#'+resetDateIdMax).val('')
//	$('[data-tab-id="+activeTabId+"]').click();
//	dataTableRes.draw();
//});
$('.daterefresh').on('click', function (e) {
	let selSecId= e.target.getAttribute('data-section-id')
	$('.inventory_datepicker_'+selSecId).val('');
	dataTableRes.draw();

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
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

	if(dataTableRes){
		dataTableRes.draw();
	}
}


$("#defaultOpen").click();

// // Get the element with id="defaultOpen" and click on it
// document.getElementById("defaultOpen").click();


//...called when edit button is clicked...//
function editfunction(obj) {
debugger;
		document.getElementById('editFormAdhoc').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editFormAdhoc').getElementsByTagName('input');
	var mySelect = document.getElementById('editFormAdhoc').getElementsByTagName('select');
	var myText = document.getElementById('editFormAdhoc').getElementsByTagName('textarea');
	var paid_by = x[7].textContent.split(/(\s+)/)[0]
    var quantity_1= x[4].textContent.split(/(\s+)/)[2]

	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
				if (quantity_1 == i.value) {
					mySelect[0].selectedIndex = j;
					break;
				}
			}
    for (var i, j = 0; i = mySelect[1].options[j]; j++) {
				if (paid_by == i.value) {
					mySelect[1].selectedIndex = j;
					break;
				}
			}

	for (i = 1; i < (y.length-1); i++) {
		var str = x[i + 1].textContent.split(/(\s+)/);
				y[i].value = str[0]
	}
	myText[0].value = x[8].textContent
	document.getElementById('editFormAdhoc').action = obj.id;

	var url = $("#editFormAdhoc").attr("data-paidby-url");

//	var typeId = obj2;

	$.ajax({                       // initialize an AJAX request
	    type: "GET",
		url: url,
		dataType: "html",
//		data: {
//			'Product': productId

//		},
		success: function (response) {
			$("#paid_by").html(response);
			}
			});
}
$('select[name="paid_by"]').change(function(){

    if ($(this).val() == "other"){
    debugger;
            alert("call the do something function on option 2");
//
//    	$("#id_add_name").prop({ 'type': 'text', 'required': true });
//		$("#id_add_name").parent().parent().css("display", "block");
////   $("#id_add_user").show('<input type="text" placeholder="Name" name="name"/>');

     }
     else {


		$("#id_add_name").prop({ 'required': false });
		$("#id_add_name").parent().parent().css("display", "none");
	}
});

$('#price, #quantity_0').on('keyup', function () {
debugger;
	let total = $("#price").val() * $("#quantity_0").val();
	$("#amount").val(total)
});

	var url = $("#addFormAdhoc").attr("data-users-url");
$('select[name="paid_by"]').change(function(){

    if ($(this).val() == "add_name"){
    debugger;
            alert("call the do ");

    	$("#add_name").prop({ 'type': 'text', 'required': true });
		$("#add_name").parent().parent().css("display", "block");

     }
     else {
		$("#add_name").prop({ 'required': false });
		$("#add_name").parent().parent().css("display", "none");
	}
});

//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteForm').action = obj.id;
}




//.... for getting products list based on selected type in add product form...//
//$("#id_paid_by").click(function () {
//	var url = $("#addFormAdhoc").attr("data-users-url");
////	var typeId = $(this).val();
////
//	$.ajax({                       // initialize an AJAX request
//        type: "GET",
//		url: url,
//		dataType: "html",
//		success: function (response) {
//			$("#id_paid_by").html(response);
//			}
//			});
//}


//		data: {
//			'Type': typeId
//		},
//		success: function (html) {
//			$("#id_product").html(data);
//		}
//	});
//
//});


$('#id_price, #id_quantity_0').on('keyup', function () {
    debugger;
	let total = $("#id_price").val() * $("#id_quantity_0").val();
	$("#id_amount").val(total)
});


//...called when save and add another button on addProduct form is clicked...//
$("#saveNew").click(function (e) {
	e.preventDefault()
	var $formId = $(this).parents('form');
	console.log($formId)
	var url = $("#addFormAdhoc").attr("action");
	var data = $("#addFormAdhoc").serialize();

	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		success: function (data, status) {
			if (status === "success") {
				console.log(data)
				document.getElementById('addFormAdhoc').reset()
			}
			console.log(data)
			document.getElementById('addFormAdhoc').reset()
		},
		error: function (request, status, error) {
			// console.log(request.responseJSON['price'].responseTEXT)
			if ('non_field_errors' in request.responseJSON) {
				alert(request.responseJSON['non_field_errors'][0])
			}
			$('.required', $formId).each(function () {
				console.log(request)
				var inputVal = $(this).val();

				var $parentTag = $(this).parent();
				// if (inputVal == '') {
				// 	$parentTag.addClass('error').append('<span class="error" style="color: red; font-size=12px;"><i class="material-icons">&#xe001;</i>This field is required </span>');
				// }


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

	}
	xhr.send(myFormData)
}

const addNewForm = document.getElementById('addFormAdhoc')
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




