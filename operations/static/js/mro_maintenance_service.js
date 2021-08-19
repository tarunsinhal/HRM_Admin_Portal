var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export as CSV',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
			},
		}
		],
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
					let activeTabId = $('.tablinks.active').attr('data-tab-id');
					// let pur_min =$('#pur_min_'+activeTabId).val();
					// let pur_max = $('#pur_max_'+activeTabId).val();
					
					// pur_min = (pur_min != "")?new Date(pur_min):null ;
					// pur_max = (pur_max != "")?new Date(pur_max):null;
					
					// let purchaseDate = new Date(data[0]);
					let recordType  = data[10]

					if(activeTabId == recordType){
						if ((pur_min == null && pur_max == null )) 
							return true;
						if ((pur_min == null && purchaseDate <= pur_max))
							return true;
						if ((pur_max == null && ( pur_min != null && purchaseDate >= pur_min)))
							return true;
						if ((purchaseDate <= pur_max && purchaseDate >= pur_min))
							return true;
					}else{
						return true;
					}	
				}		
			)	
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

//...called when edit button is clicked...//
function editfunction(obj) {
	debugger
	document.getElementById('editForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
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
				
	var paid_by = x[6].textContent
	for (var i, j = 0; i = mySelect[2].options[j]; j++) {
		if (paid_by === i.value) {
			mySelect[2].selectedIndex = j;
			break;
		}
	}

	var payment = x[7].textContent
	for (var i, j = 0; i = mySelect[3].options[j]; j++) {
		if (payment === i.value) {
			mySelect[3].selectedIndex = j;
			break;
		}
	}

	y[5].value = x[8].textContent;

	z[0].value = x[9].textContent;
	document.getElementById('editForm').action = obj.id;

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
			}
			console.log(data)
			document.getElementById('addForm').reset()
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


// $(".form-select option").val(function(val) {
// 	$(this).siblings('[value="'+ val +'"]').remove();
// });


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
			alert('Next order should be greater than purchase date.')
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


//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	window.location.reload();
});
