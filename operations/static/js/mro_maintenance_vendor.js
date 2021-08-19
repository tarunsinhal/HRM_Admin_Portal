var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export as CSV',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 5 },
			{ orderable: false, targets: 7 }
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
					let recordType = data[6]

					if (activeTabId == recordType) {
						if ((pur_min == null && pur_max == null))
							return true;
						if ((pur_min == null && purchaseDate <= pur_max))
							return true;
						if ((pur_max == null && (pur_min != null && purchaseDate >= pur_min)))
							return true;
						if ((purchaseDate <= pur_max && purchaseDate >= pur_min))
							return true;
					} else {
						return true;
					}
				}
			)
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


//...called when save and add another button on addProduct form is clicked...//
$("#saveNew").click(function (e) {
	debugger;
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
				// alert(request.responseJSON['non_field_errors'])
				$('#add-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + request.responseJSON['non_field_errors'] + '</span></center>')
			}
			// $('.required', $formId).each(function () {
			// 	console.log(request)
			// 	var inputVal = $(this).val();

			// 	var $parentTag = $(this).parent();
			// 	if (inputVal == '') {
			// 		if($parentTag[0].className!=="col-6 error"){
			// 		$parentTag.addClass('error').append('<span class="error" style="color: red; font-size=12px;"><i class="material-icons">&#xe001;</i>This field is required </span>');}
			// 	}else{
			// 		if($(this).nextAll().length==2){
			// 			$parentTag.removeClass("error");
			// 			$(this).nextAll()[1].remove();
			// 		}else{
			// 			$parentTag.removeClass("error");
			// 			$(this).next().remove();
			// 		}
			// 	}
			// });
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
				//alert("Name already exists.");
				$('#add-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + Inval['non_field_errors'] + '</span></center>')
			}
			$('.chk', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 12px">' + Inval[ipVal] + '</span>')
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
				// alert("Name already exists.");
				$('#edit-form-body').prepend('<center><span style="color: red; font-size: 15px; padding-bottom: 30px;">' + Inval['non_field_errors'] + '</span></center>')
		    }
		    $('.chk', myForm).each(function () {
				var ipVal = $(this).attr('name');

				var $parentTag = $(this).parent();
				if (Inval[ipVal]) {
					if ($parentTag[0].className != "col-6 error") {
						$parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 12px">' + Inval[ipVal] + '</span>')
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


//...loading page again on closing the add new product form...//
$('#staticBackdrop').on('hidden.bs.modal', function () {
	window.location.reload();
})
