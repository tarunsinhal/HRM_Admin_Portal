// var editor, dataTableRes1, dataTableRes2;

// // Display an Editor form that allows the user to pick the CSV data to apply to each column
// function selectColumns ( editor, csv, header ) {
//     var selectEditor = new $.fn.dataTable.Editor();
//     var fields = editor.order();
 
//     for ( var i=0 ; i<fields.length ; i++ ) {
//         var field = editor.field( fields[i] );
 
//         selectEditor.add( {
//             label: field.label(),
//             name: field.name(),
//             type: 'select',
//             options: header,
//             def: header[i]
//         } );
//     }
 
//     selectEditor.create({
//         title: 'Map CSV fields',
//         buttons: 'Import '+csv.length+' records',
//         message: 'Select the CSV column you want to use the data from for each field.',
//         onComplete: 'none'
//     });
 
//     selectEditor.on('submitComplete', function (e, json, data, action) {
//         // Use the host Editor instance to show a multi-row create form allowing the user to submit the data.
//         editor.create( csv.length, {
//             title: 'Confirm import',
//             buttons: 'Submit',
//             message: 'Click the <i>Submit</i> button to confirm the import of '+csv.length+' rows of data. Optionally, override the value for a field to set a common value by clicking on the field below.'
//         } );
 
//         for ( var i=0 ; i<fields.length ; i++ ) {
//             var field = editor.field( fields[i] );
//             var mapped = data[ field.name() ];
 
//             for ( var j=0 ; j<csv.length ; j++ ) {
//                 field.multiSet( j, csv[j][mapped] );
//             }
//         }
//     } );
// }
 
// $(document).ready(function() {
//     // Regular editor for the table
//     editor = new $.fn.dataTable.Editor( {
//         ajax: "../php/staff.php",
//         table: "#boardingTable",
//         fields: [ {
//                 label: "Employee Name:",
//                 name: "employee_name"
//             }, {
//                 label: "Email Account:",
//                 name: "email_account"
//             }, {
//                 label: "Upwork Account-Add to Team:",
//                 name: "upwork_account_Add_to_team"
//             }, {
//                 label: "Upwork Account-Add Account:",
//                 name: "upwork_account_Add_account"
//             }, {
//                 label: "Grant Onedrive Access:",
//                 name: "grant_onedrive_accesse"
//             }, {
//                 label: "Microsoft Account Created:",
//                 name: "microsoft_account_created"
//             }, {
//                 label: "Gmail Account:",
//                 name: "gmail_account"
//             }, {
//                 label: "Skype Id:",
//                 name: "skype_id"
//             }, {
//                 label: "System Config.:",
//                 name: "system_configration"
//             }, {
//                 label: "LOI:",
//                 name: "loi"
//             }, {
//                 label: "Offer Letter:",
//                 name: "offer_letter"
//             }, {
//                 label: "NDA-Signed:",
//                 name: "nda_signed"
//             }, {
//                 label: "Joining Letter:",
//                 name: "joining_letter"
//             }, {
//                 label: "Joining Docs:",
//                 name: "joining_documents"
//             }, {
//                 label: "Joining Hamper:",
//                 name: "joining_hamper"
//             }, {
//                 label: "Laptop-Charger:",
//                 name: "laptop_charger"
//             }, {
//                 label: "Mouse:",
//                 name: "mouse_mousePad"
//             }, {
//                 label: "Bag:",
//                 name: "bag"
//             }, {
//                 label: "Id Card:",
//                 name: "id_card"
//             }, {
//                 label: "Induction:",
//                 name: "induction"
//             }, {
//                 label: "Add to Skype Group:",
//                 name: "add_to_skype_group"
//             }, {
//                 label: "Add to Whatsapp Group:",
//                 name: "add_to_whatsapp_group"
//             }
//         ]
//     } );
 
//     // Upload Editor - triggered from the import button. Used only for uploading a file to the browser
//     var uploadEditor = new $.fn.dataTable.Editor( {
//         fields: [ {
//             label: 'CSV file:',
//             name: 'csv',
//             type: 'upload',
//             ajax: function ( files, done ) {
//                 // Ajax override of the upload so we can handle the file locally. Here we use Papa
//                 // to parse the CSV.
//                 Papa.parse(files[0], {
//                     header: true,
//                     skipEmptyLines: true,
//                     complete: function (results) {
//                         if ( results.errors.length ) {
//                             console.log( results );
//                             uploadEditor.field('csv').error( 'CSV parsing error: '+ results.errors[0].message );
//                         }
//                         else {
//                             selectColumns( editor, results.data, results.meta.fields );
//                         }
 
//                         // Tell Editor the upload is complete - the array is a list of file
//                         // id's, which the value of doesn't matter in this case.
//                         done([0]);
//                     }
//                 });
//             }
//         } ]
//     });
 
// 		dataTableRes1 = $('.productTable1').DataTable( {
// 		scrollX: true,
// 		fixedColumns:   {
// 			left: 1,
// 			rightColumns: 1
// 		},
// 		dom: 'Bfrtip',
// 		buttons: [{
// 			extend: 'csv',
// 			text: 'Export',
// 			exportOptions: {
// 				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
// 			},
// 		},
// 		{
// 			text: 'Import',
// 			action: function () {
// 				uploadEditor.create( {
// 					title: 'CSV file import'
// 				} );
// 			}
// 		},
// 		],
// 		columnDefs: [
// 			{ orderable: false, targets: 23 },
// 		],
// 		'pageLength': 12,
// 		"bLengthChange": true,
// 		"autoWidth": true,
// 	});

// 	$('#tab2').on('click', function() {
// 		dataTableRes2 = $('.productTable2').DataTable( {
// 			destroy: true,
// 			scrollX: true,
// 			fixedColumns:   {
// 				left: 1,
// 				rightColumns: 1
// 			},
// 			dom: 'Bfrtip',
// 			buttons: [{
// 				extend: 'csv',
// 				text: 'Export',
// 				exportOptions: {
// 					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
// 				},
// 			},
// 			// {
// 			// 	text: 'Import',
// 			// 	action: function () {
// 			// 		uploadEditor.create( {
// 			// 			title: 'CSV file import'
// 			// 		} );
// 			// 	}
// 			// },
// 			],
// 			columnDefs: [
// 				{ orderable: false, targets: 19 },
// 			],
// 			'pageLength': 12,
// 			"bLengthChange": true,
// 			"autoWidth": true,
// 		});
// 	});
// });

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
		// {
		// 	text: 'Import',
		// 	action: function () {
		// 		uploadEditor.create( {
		// 			title: 'CSV file import'
		// 		} );
		// 	}
		// },
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
			// {
			// 	text: 'Import',
			// 	action: function () {
			// 		uploadEditor.create( {
			// 			title: 'CSV file import'
			// 		} );
			// 	}
			// },
			],
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
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
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
	// document.getElementById('editJoiningForm').style.display = 'block'
	// var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	// var y = document.getElementById('editJoiningForm').getElementsByTagName('input');

	// for (i = 0; i < (y.length-1); i++) {
	// 	var str = x[i].textContent;
	// 	y[i + 1].value = str;
	// }
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
		else if (xhr.status === 400){
			debugger;
			// alert('Wrong Formate, Try again.')
			var $parentTag = $('#id_import_file').parent();
			if ($parentTag[0].className != "form-group mb-0 files error") {
				$parentTag.addClass('error').prepend('<span class="error" style="color: red; font-size=12px;">Wrong Format, Try again !!!</span>');
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
