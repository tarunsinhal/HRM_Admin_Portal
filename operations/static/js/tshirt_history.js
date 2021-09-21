function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold">Additional Parameters:</p></div>'+
	'<div class="row"><div class="col-3"><span class="font-weight-bold">Order Date: </span>'+d[6]+'</div><br>'+
	'<div class="col-6"><span class="font-weight-bold">Receiving Date: </span>'+d[7]+'</div></div><br>'+
        '<div class="row"><div class="col-3"><span class="font-weight-bold">Total quantity: </span>'+d[8]+'</div><br>'+
		'<div class="col-3"><span class="font-weight-bold">Allotted: </span>'+d[9]+'</div><br>'+
		'<div class="col-3"><span class="font-weight-bold">Remaining: </span>'+d[10]+'</div></div><br>'+
		'<div class="row"><div class="col-3"><span class="font-weight-bold">Paid By: </span>'+d[11]+'</div><br>'+
		'<div class="col-3"><span class="font-weight-bold">Additional Info: </span>'+d[12]+'</div></div><br>'+
        '</div></div>';
}

function format_and_diff(d,res){
	debugger

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold">Additional Parameters:</p></div>'+
	'<div class="row"><div class="col-3"><span class="font-weight-bold">Order Date: </span>'+d[6]+'</div><br>'+
	'<div class="col-6"><span class="font-weight-bold">Receiving Date: </span>'+d[7]+'</div></div><br>'+
        '<div class="row"><div class="col-3"><span class="font-weight-bold">Total quantity: </span>'+d[8]+'</div><br>'+
		'<div class="col-3"><span class="font-weight-bold">Allotted: </span>'+d[9]+'</div><br>'+
		'<div class="col-3"><span class="font-weight-bold">Remaining: </span>'+d[10]+'</div></div><br>'+
		'<div class="row"><div class="col-3"><span class="font-weight-bold">Paid By: </span>'+d[11]+'</div><br>'+
		'<div class="col-3"><span class="font-weight-bold">Additional Info: </span>'+d[12]+'</div></div><br>'+
        '</div>'+
		'<div style=" background: #FF6666; margin-bottom: 10px; padding: 10px">'+
			'<div><p class="font-weight-bold">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){
		// d = '<div class="col-8"><span class="font-weight-bold">'+ key + ' ' + '</span>' + '<span>' + res[key]['previous'] + '<span class="font-weight-bold">----></span>' + res[key]['current'] + ' </span></div><br>'
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
        // "processing": true,
        // "serverSide": true,
        // "columns": [
        //     {
        //         "class": "details-control",
        //         "orderable": false,
        //         "data": null,
        //         "defaultContent": ""
        //     },
           
        // ],
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
			{ orderable: false, targets: 13 }
		],
		
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

	debugger
	var r = dataTableRes.data()

	 // Array to track the ids of the details displayed rows
	 var detailRows = [];


	// $('#history_data').on('click', function(){
	// 	debugger
	// 	var res
	// 	var tr = $(this).closest('tr');
	// 	var row = dataTableRes.row( tr );

	// 	var id = tr[0].children[13].innerText;
	// 	var url = $("#productTable1").attr("data-previous-url");
	// 	$.ajax({
	// 		url: url,
	// 		async: false,
	// 		type: 'GET',
	// 		data: {"id": id},
	// 		dataType: 'json',
	// 		success: function(data){
	// 			debugger
	// 			if (data['data']){
	// 				res = data['data'];
	// 			}
	// 			else{
	// 				res = null
	// 			}
	// 		}
	// 	})
	// })


	$('#productTable1 tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes.row( tr );
 
		var id = tr[0].children[13].innerText;
		var history_id = tr[0].children[14].innerText;
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