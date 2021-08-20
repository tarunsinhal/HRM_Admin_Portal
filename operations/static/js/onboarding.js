var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	debugger
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
			{ orderable: false, targets: 1 },
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 5 },
			{ orderable: false, targets: 6 },
			{ orderable: false, targets: 7 }
		],
		// columns: [
		// 	{
		// 		name: 'first',
		// 		title: 'receiving_date',
		// 	},
		// ],
		'rowsGroup': [0, 8],
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


//...called when edit button is clicked...//
function editfunction(obj) {
	debugger;
	document.getElementById('editTshirtForm').style.display = 'block'
	var x = Array.from(document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td'));
	var y = document.getElementById('editTshirtForm').getElementsByTagName('input');
	var mySelect = document.getElementById('editTshirtForm').getElementsByTagName('select');
	var txtarea = document.getElementById('editTshirtForm').getElementsByTagName('textarea')

	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (x[1].textContent == i.value) {
			mySelect[0].selectedIndex = j;
			mySelect[0].style.pointerEvents = 'none';
			x.splice(1,1);
			break;
		}
	}

	for (i = 0; i < (y.length-2); i++) {
		var str = x[i].textContent.trim().split(/(\s+)/);
		y[i + 1].value = str[0]
	}

	txtarea[0].textContent = x[x.length - 3].textContent.trim()

	document.getElementById('editTshirtForm').action = obj.id;

}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteTshirtForm').action = obj.id;
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

