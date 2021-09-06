//...called when edit button is clicked...//
function editfunction(obj) {
debugger;
	document.getElementById('editUserForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	var y = document.getElementById('editUserForm').getElementsByTagName('input');
//	var mySelect = document.getElementById('editFormAdhoc').getElementsByTagName('select');
//	var myText = document.getElementById('editFormAdhoc').getElementsByTagName('textarea');
//	var username = x[0].textContent.split(/(\s+)/)[0]
//    var email= x[1].textContent.split(/(\s+)/)[0]

//	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
//				if (quantity_1 == i.value) {
//					mySelect[0].selectedIndex = j;
//					break;
//				}
//			}
//    for (var i, j = 0; i = mySelect[1].options[j]; j++) {
//				if (paid_by == i.value) {
//					mySelect[1].selectedIndex = j;
//					break;
//				}
//			}

	for (i = 1; i < (y.length-2); i++) {
		var str = x[i + 1].textContent.split(/(\s+)/);
				y[i].value = str[0]
	}
//	myText[0].value = x[8].textContent
	document.getElementById('editUserForm').action = obj.id;


//...function called when edit form is submitted...//
function handleEditProduct(event) {
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
			window.location.reload();
		}


	}
	xhr.send(myFormData)
}

const editUserForm = document.getElementById('editUserForm')
editUserForm.addEventListener("submit", handleEditProduct)

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
			alert('There is some problem in deleting the product.');
		}
	}
	xhr.send(myFormData);
}
const deleteForm = document.getElementById('deleteUserForm');
deleteForm.addEventListener("submit", handleDeleteProduct);
}


//...called when delete button is clicked...//
function deleteFunction(obj) {
document.getElementById('deleteUserForm').action = obj.id;

}



