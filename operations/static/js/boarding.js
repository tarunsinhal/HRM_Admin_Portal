var dataTableRes1, dataTableRes2;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	debugger;
	dataTableRes1 = $('.productTable1').DataTable( {
		scrollX: true,
		fixedColumns:   {
			left: 1,
			rightColumns: 1
		},
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Joining Formalities',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
			},
		},
		],
		columnDefs: [
			{ orderable: false, targets: 23 },
		],
		'pageLength': 12,
		"bLengthChange": true,
		"autoWidth": true,
	});

	$('#tab2').on('click', function() {
		dataTableRes2 = $('.productTable2').DataTable( {
			destroy: true,
			scrollX: true,
			fixedColumns:   {
				left: 1,
				rightColumns: 1
			},
			dom: 'Bfrtip',
			buttons: [{
				extend: 'csv',
				text: 'Export',
				title: 'Exit Formalities',
				exportOptions: {
					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
				},
			},
			],
			order: [],
			columnDefs: [
				{ orderable: false, targets: 19 },
			],
			'pageLength': 12,
			"bLengthChange": true,
			"autoWidth": true,
		});
	});
});



// multiform js for UI functionality
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	debugger;
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active12");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
                'transform': 'scale('+scale+')',
                'position': 'absolute'
            });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});


$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active12");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});


//...function for switching between different tabs...//
function openTab(evt, tabName) {
	debugger;
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tab-panel");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	if(document.getElementById(tabName)){
		document.getElementById(tabName).style.display = "block";
		evt.currentTarget.className += " active";
	}
	
	if($('.tablinks.active').attr('data-tab-id') == '1') {
		if(dataTableRes1){
			dataTableRes1.draw();
		}
	}else{
		if(dataTableRes2){
			dataTableRes2.draw();
		}
	}
}


// // Get the element with id="defaultOpen" and click on it
$("#defaultOpen").click();


// call hideShow when the user clicks on the details dropdownlist
$('#id_details, #addNew').click(function(){
	hideShow();
});

// The jquery function below hides/shows fields depending on the selected details 
function hideShow(){
	debugger;
	if(document.getElementById('id_details').options[document.getElementById('id_details').selectedIndex].value == "1")
	{
		$('.commonC').parent().show();
		$('.joiningC').parent().show();
		$('.exitC').parent().hide();
		// $('#id_email_account').parent().parent().show();
	}else {
		$('.commonC').parent().show();
		$('.joiningC').parent().hide();
		$('.exitC').parent().show();
	}
}

//...called when edit button of joining form is clicked...//
function editfunction(obj) {
	debugger;
	document.getElementById('editJoiningForm').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td');
	if($('.tablinks.active').attr('data-tab-id') == '1') {
		$('.commonC').parent().show();
		$('.joiningC').parent().show();
		$('.exitC').parent().hide();
		
		var y = document.getElementById('editJoiningForm').getElementsByClassName('jsFd');

		for (i = 0; i < (y.length); i++) {
			var str = x[i].textContent;
			y[i].children[0].value = str;
		}
	}else {
		$('.commonC').parent().show();
		$('.joiningC').parent().hide();
		$('.exitC').parent().show();
		
		var y = document.getElementById('editJoiningForm').getElementsByClassName('exFd');

		for (i = 0; i < (y.length); i++) {
			var str = x[i].textContent;
			y[i].children[0].value = str;
		}
	}
	
	document.getElementById('editJoiningForm').action = obj.id;
}


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteJoiningForm').action = obj.id;
}


//...function called when addProduct form is submitted...//
function handleaddnewJoining(event) {
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
			alert('There is some problem in adding the details')
		}
	}
	xhr.send(myFormData)
}

const addNewJoiningForm = document.getElementById('addJoiningForm')
addNewJoiningForm.addEventListener("submit", handleaddnewJoining)


//...function called when edit form is submitted...//
function handleJoiningEdit(event) {
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
			alert('There is some problem in editing the details.')
		}
	}
	xhr.send(myFormData)
}

const editJoiningForm = document.getElementById('editJoiningForm')
editJoiningForm.addEventListener("submit", handleJoiningEdit)


//...function called when delete form is submitted...//
function handleDeleteJoining(event) {
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
			alert('There is some problem in deleting the details.')
		}
	}
	xhr.send(myFormData)
}

const deleteJoiningForm = document.getElementById('deleteJoiningForm')
deleteJoiningForm.addEventListener("submit", handleDeleteJoining)


//...function called when import form is submitted...//
function handleImportJoining(event) {
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
		else{
			debugger;
			// alert('Wrong Formate, Try again.')
			var $parentTag = $('#id_import_file').parent();
			if ($parentTag[0].className != "form-group mb-0 files error") {
				$parentTag.addClass('error').prepend('<span class="error" style="color: red; font-size=12px;">Wrong Format,Please Try again !!!</span>');
			}				
		}
	}
	xhr.send(myFormData)
}

const importJoiningForm = document.getElementById('importJoiningForm')
importJoiningForm.addEventListener("submit", handleImportJoining)


//...loading page again on closing the all joining forms...//
$('.btn-close').on('click', function () {
	debugger
	window.location.reload();
})  

// Used for three dots click event in action column
$(".dropout").on('click', function(){
	debugger
	if (!this.classList.contains('more')) {
	document.querySelectorAll('.dropout.activeActn').forEach(
	  (d) => d !== this && d.classList.remove('activeActn')
	)}
	this.classList.toggle('activeActn')
});

// $('input[data-toggle="tab"]').on('shown.bs.tab', function(e){
// 	debugger;
// 	$($.fn.dataTable.tables(true)).DataTable()
// 	   .columns.adjust()
// 	   .responsive.recalc()
// 	   .fixedColumns().relayout();
// });


//...loading page again on closing the add new joining form...//
// $('#staticBackdrop').on('hidden.bs.modal', function () {
// 	debugger
// 	window.location.reload();
// })


// function showDropdown() {
// 	document.getElementById("myDropdown").classList.toggle("show");
// }

// // Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
// 	if (!event.target.matches('.dropbtn')) {
// 		var dropdowns = document.getElementsByClassName("dropdown-content");
// 		var i;
// 		for (i = 0; i < dropdowns.length; i++) {
// 			var openDropdown = dropdowns[i];
// 			if (openDropdown.classList.contains('show')) {
// 				openDropdown.classList.remove('show');
// 			}
// 		}
// 	}
// }
