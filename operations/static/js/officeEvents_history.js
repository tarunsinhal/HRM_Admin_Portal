var dataTableRes, dataTableRes1;

function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Item</span>'+d[4]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Food</span>'+d[5]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Paid By: </span>'+d[8]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Remarks: </span>'+d[9]+'</div></div><br>'+
    '</div></div>';
}

function format_and_diff(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Item</span>'+d[4]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Food</span>'+d[5]+'</div></div><br>'+
	'<div class="row"><div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Paid By: </span>'+d[8]+'</div><br>'+
	'<div class="col-6" style="text-align: left; margin-bottom: 10px"><span class="font-weight-bold">Remarks: </span>'+d[9]+'</div></div><br>'+
        '</div>'+
		'<div style=" background: #538ddc; margin-bottom: 10px; padding: 10px">'+
			'<div><p class="font-weight-bold" style="color: #ffff">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){
		var prekeyval = Object.entries(res[key]['previous'])
		var curkeyval = Object.entries(res[key]['current'])
		if (key == 'item'){
			for (var i = 0; i < prekeyval.length; i++){
				if ((prekeyval[i][0] != curkeyval[i][0]) || (prekeyval[i][1] != curkeyval[i][1])){
					d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + prekeyval[i][0] + ' : ' + prekeyval[i][1] + '</td><td>' + curkeyval[i][0] + ' : ' + curkeyval[i][1] + '</td></tr>'
					b += d
				}
			}
		}
		if (key == 'food'){
			for (var i = 0; i < prekeyval.length; i++){
				if ((prekeyval[i][0] != curkeyval[i][0]) || (prekeyval[i][1] != curkeyval[i][1])){
					d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + prekeyval[i][0] + ' : ' + prekeyval[i][1] + '</td><td>' + curkeyval[i][0] + ' : ' + curkeyval[i][1] + '</td></tr>'
					b += d
				}
			}
		}
		if (key != 'item' && key != 'food'){
			d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
			b += d
		}
	}
	b += '</tbody></table></div>'
    return b;
}


//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	
	dataTableRes = $('.productTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Office Event History',
			exportOptions: {
				columns: [0, 1, 2, 6, 7]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 12 }
		],
		
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,
		
	});	

	debugger
	var r = dataTableRes.data()

	// Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#productTable1 tbody').on('click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes.row( tr );
 
		var id = tr[0].children[10].innerText;
		var history_id = tr[0].children[11].innerText;
		var url = $("#productTable1").attr("data-previous-url");
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
				row.child( format_and_diff( row.data(), res ) ).show();
			}
			else{
				row.child( format( row.data() ) ).show();
			}
			// Add to the 'open' array
			if ( idx === -1 ) {
				detailRows.push( tr.attr('id') );
			}
		}
	});

	// On each draw, loop over the `detailRows` array and show any child rows
	dataTableRes.on( 'draw', function () {
		 $.each( detailRows, function ( i, id ) {
			 $('#'+id+' td.details-control').trigger( 'click' );
		 } );
	 } );

    var r = dataTableRes.data()
}); 

//...called when history button is clicked...//
function historyfunction(obj, obj2){
	debugger
	var url = $("#historyModal").attr("data-history-url");
	var rowId = obj2;

	$.ajax({                       // initialize an AJAX request
		url: url,
		async: false,
		data: {
			'id': rowId
		},
		success: function (data) {
			$("#tbody-content").html(data);
		}
	});
	dataTableRes1 = $('.historyTable1').DataTable({
		dom: 'Bfrtip',
		destroy: true,
		retrieve: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Office Events History',
			exportOptions: {
				columns: [0, 1, 2, 6, 7]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
			{ orderable: false, targets: 12 }
		],

		'pageLength': 6,
		"bLengthChange": false,
		"autoWidth": false		
	});	
	
	debugger
	var r = dataTableRes1.data()

	//  Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#historyTableId tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes1.row( tr );

		var id = tr[0].children[10].innerText;
		var history_id = tr[0].children[11].innerText;
		var url = $("#historyTableId").attr("data-previous-url");
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
				row.child( format_and_diff( row.data(), res ) ).show();
			}
			else{
				row.child( format( row.data()) ).show();
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

    var r = dataTableRes1.data()
}

$('#historyModal').on('hidden.bs.modal', function () {
	window.location.reload();
})
