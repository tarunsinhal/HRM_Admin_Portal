
function format ( d ) {
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold" style="text-align: center">Additional Parameters:</p></div>'+
	'<div class="row"><div class="col-3" style="text-align: left"><span class="font-weight-bold">OneDrive Access: </span>'+d[16]+'</div><br>'+
	'<div class="col-3" style="text-align: left"><span class="font-weight-bold">NDA Signed: </span>'+d[17]+'</div><br>'+
	'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Id Card: </span>'+d[18]+'</div></div><br>'+
        '<div class="row"><div class="col-3" style="text-align: left"><span class="font-weight-bold">Laptop-Charger: </span>'+d[19]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Bag: </span>'+d[20]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Mouse-Mouse Pad: </span>'+d[21]+'</div></div><br>'+
		'<div class="row"><div class="col-3" style="text-align: left"><span class="font-weight-bold">Gmail Account: </span>'+d[22]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Skype Id: </span>'+d[22]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Email Account: </span>'+d[21]+'</div></div><br>'+
        '</div></div>';
}

function format_and_diff(d,res){

	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold">Additional Parameters:</p></div>'+
	'<div class="row"><div class="col-3" style="text-align: left"><span class="font-weight-bold">OneDrive Access: </span>'+d[16]+'</div><br>'+
	'<div class="col-3" style="text-align: left"><span class="font-weight-bold">NDA Signed: </span>'+d[17]+'</div><br>'+
	'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Id Card: </span>'+d[18]+'</div></div><br>'+
        '<div class="row"><div class="col-3" style="text-align: left"><span class="font-weight-bold">Laptop-Charger: </span>'+d[19]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Bag: </span>'+d[20]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Mouse-Mouse Pad: </span>'+d[21]+'</div></div><br>'+
		'<div class="row"><div class="col-3" style="text-align: left"><span class="font-weight-bold">Gmail Account: </span>'+d[22]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Skype Id: </span>'+d[22]+'</div><br>'+
		'<div class="col-3" style="text-align: left"><span class="font-weight-bold">Email Account: </span>'+d[21]+'</div></div><br>'+
        '</div>'+
		'<div style=" background: #FF6666; margin-bottom: 10px; padding: 10px">'+
			'<div><p class="font-weight-bold">Changes:</p></div><table><thead><tr><td></td><td class="font-weight-bold">Previous</td><td class="font-weight-bold">Current</td></tr></thead><tbody>'
	for (let key in res){ 
		d = '<tr><td class="font-weight-bold">' + key + '</td><td>' + res[key]['previous'] + '</td><td>' + res[key]['current'] + '</td></tr>'
		b += d
	}
	b += '</tbody></table></div>'
    return b;
}

var minDate, maxDate, dataTableRes1, dataTableRes2;

//...datatable plugin for pagination and search tab in tables...//
$(document).ready(function () {
	
	dataTableRes1 = $('.productTable1').DataTable({
		dom: 'Bfrtip',
        scrollX: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 9 }
		],
		
		'pageLength': 12,
		"bLengthChange": true,
		"autoWidth": true,	
	});	


	$('#tab2').on('click', function() {
		dataTableRes2 = $('.productTable2').DataTable( {
			destroy: true,
			scrollX: true,
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
			columnDefs: [
				{ orderable: false, targets: 19 },
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

		var tab_id = tr.parents()[5].id;
		var id = tr[0].children[25].innerText;
		var history_id = tr[0].children[26].innerText;
		var url = $("#boardingTable").attr("data-previous-url");
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			data: {"id": id, "history_id": history_id, "tab_id": tab_id},
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


	// Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#boardingTable2 tbody').on( 'click', 'tr td.details-control2', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes2.row( tr );
		var row1 = tr.parents()[5].children[0].children[1]

		var tab_id = tr.parents()[5].id;
		var id = tr[0].children[21].innerText;
		var history_id = tr[0].children[22].innerText;
		var url = $("#boardingTable2").attr("data-previous-url");
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			data: {"id": id, "history_id": history_id, "tab_id": tab_id},
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


	// On each draw, loop over the `detailRows` array and show any child rows
	dataTableRes2.on( 'draw', function () {
		$.each( detailRows, function ( i, id ) {
			$('#'+id+' td.details-control').trigger( 'click' );
		} );
	} );

    // var r = dataTableRes.data()
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
