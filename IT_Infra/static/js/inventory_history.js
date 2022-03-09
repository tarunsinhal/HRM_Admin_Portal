function format ( d ) {
	debugger
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Type: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[9]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Id: </span>'+d[10]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Name: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity Start Date: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity End Date: </span>'+d[13]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[14]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Remarks: </span>'+d[15]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff(d,res){
	debugger
	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Type: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[9]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Id: </span>'+d[10]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Past Allottee Name: </span>'+d[11]+'</div></div><br>'+
	'<div class="row"><div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity Start Date: </span>'+d[12]+'</div><br>'+
	'<div class="col-4" style="text-align: left"><span class="font-weight-bold">Validity End Date: </span>'+d[13]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Paid By: </span>'+d[14]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Remarks: </span>'+d[15]+'</div></div><br>'+
	'</div></div>'+
	'</div>'+
	'<div style=" background: #538ddc; margin-bottom: 10px; padding: 10px">'+
	'<div><p class="font-weight-bold" style="color: #ffff">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){
		d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
		b += d
	}
	b += '</tbody></table></div>'
    return b;
}


var minDate, maxDate, dataTableRes;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	
	dataTableRes = $('.productTable1').DataTable({
        
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export as CSV',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12]
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
		],
		
		'pageLength': 12,
		"bLengthChange": false,
		"autoWidth": false,
	
	});	

	debugger
	var r = dataTableRes.data()

	 // Array to track the ids of the details displayed rows
	 var detailRows = [];


	$('#productTable1 tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes.row( tr );
 
		var id = tr[0].children[16].innerText;
		var history_id = tr[0].children[17].innerText;
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
				row.child( format( row.data()) ).show();
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


