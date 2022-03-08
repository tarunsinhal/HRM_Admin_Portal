var dataTableRes1, dataTableRes2, dataTableRes3, dataTableRes4;

function format1 ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold" style="text-align: center"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Joining Date: </span>'+d[9]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">LOI: </span>'+d[10]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Offer Letter: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Joining Hamper: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Add to Skype Group: </span>'+d[13]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Add to Whatsapp Group: </span>'+d[14]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Microsoft Account Created: </span>'+d[15]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">System Configuration: </span>'+d[16]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Add Upwork Account to Team: </span>'+d[17]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Add Upwork Account: </span>'+d[18]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">OneDrive Access: </span>'+d[19]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Id Card: </span>'+d[20]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Mouse-Mouse Pad: </span>'+d[21]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Bag: </span>'+d[22]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Laptop-Charger: </span>'+d[23]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Gmail Account: </span>'+d[24]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Joining Letter: </span>'+d[25]+'</div><br>'+
	'</div></div>';
}

function format_and_diff1(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold" style="text-align: center"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Joining Date: </span>'+d[9]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">LOI: </span>'+d[10]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Offer Letter: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Joining Hamper: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Add to Skype Group: </span>'+d[13]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Add to Whatsapp Group: </span>'+d[14]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Microsoft Account Created: </span>'+d[15]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">System Configuration: </span>'+d[16]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Add Upwork Account to Team: </span>'+d[17]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Add Upwork Account: </span>'+d[18]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">OneDrive Access: </span>'+d[19]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Id Card: </span>'+d[20]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Mouse-Mouse Pad: </span>'+d[21]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Bag: </span>'+d[22]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Laptop-Charger: </span>'+d[23]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Gmail Account: </span>'+d[24]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Joining Letter: </span>'+d[25]+'</div><br>'+
	'</div><br>'+
	'<div style=" background: #538ddc; margin-bottom: 10px; padding: 10px">'+
	'<div><p class="font-weight-bold" style="color: #ffff">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){ 
		d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
		b += d
	}
	b += '</tbody></table></div>'
    return b;
}

function format2 ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold" style="text-align: center"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Last Working Date: </span>'+d[11]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Remove from Skype Group: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Remove from Whatsapp Group: </span>'+d[13]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Microsoft Account Deleted: </span>'+d[14]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">System Format: </span>'+d[15]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Remove Upwork Account from Team: </span>'+d[16]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Close Upwork Account: </span>'+d[17]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Laptop-Charger: </span>'+d[18]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Mouse-Mouse Pad: </span>'+d[19]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Bag: </span>'+d[20]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Gmail Account: </span>'+d[21]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">FNF: </span>'+d[22]+'</div><br>'+
	'</div></div>';
}

function format_and_diff2(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold" style="text-align: center"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Last Working Date: </span>'+d[11]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Remove from Skype Group: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Remove from Whatsapp Group: </span>'+d[13]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Microsoft Account Deleted: </span>'+d[14]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">System Format: </span>'+d[15]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Remove Upwork Account from Team: </span>'+d[16]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Close Upwork Account: </span>'+d[17]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Laptop-Charger: </span>'+d[18]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Mouse-Mouse Pad: </span>'+d[19]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Bag: </span>'+d[20]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Gmail Account: </span>'+d[21]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">FNF: </span>'+d[22]+'</div><br>'+
	'</div><br>'+
	'<div style=" background: #538ddc; margin-bottom: 10px; padding: 10px">'+
	'<div><p class="font-weight-bold" style="color: #ffff">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){ 
		d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
		b += d
	}
	b += '</tbody></table></div>'
    return b;
}

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	debugger;
	dataTableRes1 = $('.productTable1').DataTable( {
		destroy: true,
		order: [],
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Joining Formalities',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
			},
		},
		],
		columnDefs: [
			{ orderable: false, targets: 24 },
			{ orderable: false, targets: 25 },
		],
		'pageLength': 12,
		"bLengthChange": true,
		"autoWidth": true,
	});

	$('#tab2').on('click', function() {
		dataTableRes2 = $('.productTable2').DataTable( {
			destroy: true,
			order: [],
			dom: 'Bfrtip',
			buttons: [{
				extend: 'csv',
				text: 'Export',
				title: 'Exit Formalities',
				exportOptions: {
					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
				},
			},
			],
			order: [],
			columnDefs: [
				{ orderable: false, targets: 21 },
				{ orderable: false, targets: 22 },
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

//...function for switching between different tabs...//
function openTabView(evt, tabName) {
	debugger;
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tab-panel-view");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	if(document.getElementById(tabName)){
		document.getElementById(tabName).style.display = "block";
		evt.currentTarget.className += " active";
	}
}

// set details option joining formalities as selected and remove dashed selected option
$("select").children("option").filter(":selected").remove();
$('#id_details option[value=1]').attr('selected','selected')

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
		// $('.joinDate').parent().show();
		// $('.exitDate').parent().hide();
		$("#id_microsoft_account_created").prop({ 'required': true });
		$("#id_microsoft_account_deleted").prop({ 'required': false });
		$("#id_joining_date").prop({ 'required': true });
		$("#id_last_working_date").prop({ 'required': false });
	}else {
		$('.commonC').parent().show();
		$('.joiningC').parent().hide();
		$('.exitC').parent().show();
		// $('.joinDate').parent().hide();
		// $('.exitDate').parent().show();
		$("#id_microsoft_account_created").prop({ 'required': false });
		$("#id_microsoft_account_deleted").prop({ 'required': true });
		$("#id_joining_date").prop({ 'required': false });
		$("#id_last_working_date").prop({ 'required': true });
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
		$("#microsoft_account_created").prop({ 'required': true });
		$("#microsoft_account_deleted").prop({ 'required': false });
		$("#joining_date").prop({ 'required': true });
		$("#last_working_date").prop({ 'required': false });
		
		var y = document.getElementById('editJoiningForm').getElementsByClassName('jsFd');

		for (i = 0; i < (y.length); i++) {
			var str = x[i].textContent;
			y[i].children[0].value = str;
		}
	}else {
		$('.commonC').parent().show();
		$('.joiningC').parent().hide();
		$('.exitC').parent().show();
		$("#microsoft_account_created").prop({ 'required': false });
		$("#microsoft_account_deleted").prop({ 'required': true });
		$("#joining_date").prop({ 'required': false });
		$("#last_working_date").prop({ 'required': true });
		
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
	debugger
	document.getElementById('deleteJoiningForm').action = obj.id;
}


//...called when remaining info link is clicked...//
function viewfunction(obj) {
	debugger;
	document.getElementById('viewModal').style.display = 'block'
	var x = document.getElementById(obj.id).parentElement.parentElement.getElementsByTagName('td');
	
	if($('.tablinks.active').attr('data-tab-id') == '1') {
		$('.commonC').parent().show();
		$('.joiningC').parent().show();
		$('.exitC').parent().hide();

		var y = document.getElementById('viewModal').getElementsByClassName('jsFd');

		for (i = 0; i < (y.length); i++) {
			var str = x[i].textContent;
			y[i].children[0].value = str;
			y[i].children[0].readOnly = true;
		}
	}else {
		$('.commonC').parent().show();
		$('.joiningC').parent().hide();
		$('.exitC').parent().show();

		var y = document.getElementById('viewModal').getElementsByClassName('exFd');
		
		for (i = 0; i < (y.length); i++) {
			var str = x[i].textContent;
			y[i].children[0].value = str;
			y[i].children[0].readOnly = true;
		}
	}
	
	$("#default").click();
}


//...called when history button is clicked...//
function historyfunction1(obj, obj2){
	debugger
	var url = $("#historyModal1").attr("data-history-url");
	var rowId = obj2;

	$.ajax({                       // initialize an AJAX request
		url: url,
		async: false,
		data: {
			'id': rowId
		},
		success: function (data) {
			$("#tbody-content1").html(data);
		}
	});
	dataTableRes3 = $('.historyTable1').DataTable({
		dom: 'Bfrtip',
		destroy: true,
		retrieve: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Boarding History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 28 },
		],

		'pageLength': 6,
		"bLengthChange": false,
		"autoWidth": false		
	});	
	
	debugger
	var r = dataTableRes3.data()

	//  Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#historyTableId1 tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes3.row( tr );

		var id = tr[0].children[26].innerText;
		var history_id = tr[0].children[27].innerText;
		var url = $("#historyTableId1").attr("data-previous-url");
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			data: {"id": id, "history_id": history_id},
			dataType: 'json',
			success: function(data){
				debugger
				if (data['data']){
					res = data['data'];
				}
				else{
					res = null
				}
			}
		})


		var idx = $.inArray( tr.attr('id'), detailRows );
		if ( row.child.isShown() ) {
			tr.removeClass( 'details' );
			row.child.hide();
			// Remove from the 'open' array
			detailRows.splice( idx, 1 );
		}
		else {
			tr.addClass( 'details' );
			if (res){
				row.child( format_and_diff1( row.data(), res ) ).show();
			}
			else{
				row.child( format1( row.data()) ).show();
			}
			// Add to the 'open' array
			if ( idx === -1 ) {
				detailRows.push( tr.attr('id') );
			}
		}
	});

	// On each draw, loop over the `detailRows` array and show any child rows
	dataTableRes3.on( 'draw', function () {
		 $.each( detailRows, function ( i, id ) {
			 $('#'+id+' td.details-control').trigger( 'click' );
		 } );
	 } );

    var r = dataTableRes3.data()
}

//...called when history button is clicked...//
function historyfunction2(obj, obj2){
	debugger
	var url = $("#historyModal2").attr("data-history-url");
	var rowId = obj2;

	$.ajax({                       // initialize an AJAX request
		url: url,
		async: false,
		data: {
			'id': rowId
		},
		success: function (data) {
			$("#tbody-content2").html(data);
		}
	});
	dataTableRes4 = $('.historyTable2').DataTable({
		dom: 'Bfrtip',
		destroy: true,
		retrieve: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Boarding History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 9 },
			{ orderable: false, targets: 10 },
			{ orderable: false, targets: 25 },
		],

		'pageLength': 6,
		"bLengthChange": false,
		"autoWidth": false		
	});	
	
	debugger
	var r = dataTableRes4.data()

	//  Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#historyTableId2 tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes4.row( tr );

		var id = tr[0].children[23].innerText;
		var history_id = tr[0].children[24].innerText;
		var url = $("#historyTableId2").attr("data-previous-url");
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			data: {"id": id, "history_id": history_id},
			dataType: 'json',
			success: function(data){
				debugger
				if (data['data']){
					res = data['data'];
				}
				else{
					res = null
				}
			}
		})


		var idx = $.inArray( tr.attr('id'), detailRows );
		if ( row.child.isShown() ) {
			tr.removeClass( 'details' );
			row.child.hide();
			// Remove from the 'open' array
			detailRows.splice( idx, 1 );
		}
		else {
			tr.addClass( 'details' );
			if (res){
				row.child( format_and_diff2( row.data(), res ) ).show();
			}
			else{
				row.child( format2( row.data()) ).show();
			}
			// Add to the 'open' array
			if ( idx === -1 ) {
				detailRows.push( tr.attr('id') );
			}
		}
	});

	// On each draw, loop over the `detailRows` array and show any child rows
	dataTableRes4.on( 'draw', function () {
		 $.each( detailRows, function ( i, id ) {
			 $('#'+id+' td.details-control').trigger( 'click' );
		 } );
	 } );

    var r = dataTableRes4.data()
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
			alert('There is some problem in adding the details')
		}
	}
	xhr.send(myFormData)
}

const addNewJoiningForm = document.getElementById('addJoiningForm')
addNewJoiningForm.addEventListener("submit", handleaddnewJoining)


//...function called when edit form is submitted...//
function handleJoiningEdit(event) {
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
			const data = xhr.response['error']
			data_len = xhr.response['length'] 

			var $parentTag = $('#id_import_file').parent();

			if ($parentTag[0].classList.contains("error")) {
				$parentTag.removeClass("error");
				$('.err').remove();
			}
          
			if (!$parentTag[0].classList.contains("error")) {
				if (typeof(data) == "object") {
					for (i=0; i < data_len; i++) {
						$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ Object.keys(data)[i] +" : "+ Object.values(data)[i] +'</span><br>');
					}
				}
				else {
					$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ data +'</span>');
				}		
			}			
		}
	}
	xhr.send(myFormData)
}

const importJoiningForm = document.getElementById('importJoiningForm')
importJoiningForm.addEventListener("submit", handleImportJoining)

//...function called when import form is submitted...//
function handleImportExit(event) {
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
			const data = xhr.response['error']
			data_len = xhr.response['length'] 

			var $parentTag = $('#import_file');

			if ($parentTag[0].classList.contains("error")) {
				$parentTag.removeClass("error");
				$('.err').remove();
			}
          
			if (!$parentTag[0].classList.contains("error")) {
				if (typeof(data) == "object") {
					for (i=0; i < data_len; i++) {
						$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ Object.keys(data)[i] +" : "+ Object.values(data)[i] +'</span><br>');
					}
				}
				else {
					$parentTag.addClass('error').prepend('<span class="err" style="color: red; font-size=12px;">'+ data +'</span>');
				}		
			}			
		}
	}
	xhr.send(myFormData)
}

const importExitForm = document.getElementById('importExitForm')
importExitForm.addEventListener("submit", handleImportExit)

//...loading page again on click on closing button of form...//
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

$(document).ready(function(){
	$('.info').popover({title: "<h6><strong>Information</strong></h6>", content: "<ul><li>Supported file format are CSV, XLSX and XLS.</li><li>Date should be in YYYY-MM-DD format.</ul>", html: true, placement: "right"});
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
