var minDate, maxDate, dataTableRes1, dataTableRes2, dataTableRes3, dataTableRes4;

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
	
	dataTableRes1 = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
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
			{ orderable: false, targets: 29 }
		],
		
		'pageLength': 12,
		"bLengthChange": true,
		"autoWidth": true,	
	});	


	$('#tab2').on('click', function() {
		dataTableRes2 = $('.productTable2').DataTable( {
			destroy: true,
			dom: 'Bfrtip',
			buttons: [{
				extend: 'csv',
				text: 'Export',
				title: 'Exit Formalities',
				exportOptions: {
					columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
				},
			},
			],
			order: [],
			columnDefs: [
				{ orderable: false, targets: 9 },
				{ orderable: false, targets: 10 },
				{ orderable: false, targets: 25 },
				{ orderable: false, targets: 26 },
			],
			'pageLength': 12,
			"bLengthChange": true,
			"autoWidth": true,
		});
	});


	debugger
	var r = dataTableRes1.data()

	 // Array to track the ids of the details displayed rows
	 var detailRows = [];

	$('#boardingTable tbody').on( 'click', 'tr td.details-control1', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes1.row( tr );

		var id = tr[0].children[26].innerText;
		var history_id = tr[0].children[27].innerText;
		var url = $("#boardingTable").attr("data-previous-url");
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


	// Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#boardingTable2 tbody').on( 'click', 'tr td.details-control2', function () { 
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes2.row( tr );

		var id = tr[0].children[23].innerText;
		var history_id = tr[0].children[24].innerText;
		var url = $("#boardingTable2").attr("data-previous-url");
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
	dataTableRes1.on( 'draw', function () {
		 $.each( detailRows, function ( i, id ) {
			 $('#'+id+' td.details-control').trigger( 'click' );
		 } );
	} );


	// On each draw, loop over the `detailRows` array and show any child rows
	dataTableRes2.on( 'draw', function () {
		$.each( detailRows, function ( i, id ) {
			$('#'+id+' td.details-control').trigger( 'click' );
		} );
	} );

    // var r = dataTableRes.data()
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

//...loading page again on closing the all joining forms...//
$('.btn-close').on('click', function () { 
	window.location.reload();
}) 