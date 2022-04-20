
function format ( d ) {
	debugger
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Office 365 Id: </span>'+d[5]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Official Email: </span>'+d[6]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Microsoft Email: </span>'+d[7]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Microsoft Email Password: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Skype Email: </span>'+d[9]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Skype Email Password: </span>'+d[10]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Remarks: </span>'+d[11]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff(d,res){
	debugger
	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Office 365 Id: </span>'+d[5]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Official Email: </span>'+d[6]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Microsoft Email: </span>'+d[7]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Microsoft Email Password: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Skype Email: </span>'+d[9]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Skype Email Password: </span>'+d[10]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Remarks: </span>'+d[11]+'</div></div><br>'+
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

function format_hardware ( d ) {
	debugger
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[6]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Additional: </span>'+d[7]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff_hardware(d,res){
	debugger
	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[6]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Additional: </span>'+d[7]+'</div></div><br>'+
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

function format_software ( d ) {
	debugger
    return '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Validity Start Date: </span>'+d[6]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Validity End Date: </span>'+d[7]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Additonal: </span>'+d[9]+'</div></div><br>'+
	'</div></div>';
}

function format_and_diff_software(d,res){
	debugger
	b = '<div style="background: rgba(0, 105, 255, .2)"><div style=" margin-bottom: 10px;">'+
	'<div><p class="font-weight-bold"><u>Additional Parameters</u></p></div>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Validity Start Date: </span>'+d[6]+'</div><br>'+
	'<div class="col" style="text-align: left"><span class="font-weight-bold">Validity End Date: </span>'+d[7]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Details: </span>'+d[8]+'</div></div><br>'+
	'<div class="row"><div class="col" style="text-align: left"><span class="font-weight-bold">Additonal: </span>'+d[9]+'</div></div><br>'+
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

$(document).ready(function () {
    debugger

    $('#id_employee_name').select2({
        dropdownParent: $('#staticBackdrop')
    });

    $.ajax({
        type: 'GET',
        async: false,
        url: $("#addAllotmentForm").attr('employee-name-url'),
        success: function(data){
            debugger
            $("#id_employee_name").html(data)
        },
        error: function(error, data){
            debugger
        }
    })


    $(".item_names option").remove();

    dataTableRes = $('.allotmentTable').DataTable({
		dom: 'Bfrtip',
        destroy: true,
		retrieve: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7]
			},
		}
		],
		columnDefs: [
			{ orderable: false, targets: 2 },
			{ orderable: false, targets: 3 },
		],
		'pageLength': 8,
		"bLengthChange": false,
		"autoWidth": false,																												
	});	


    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 2;
    var steps = $("fieldset").length;

    setProgressBar(current);

    $(".next").click(function () {
        debugger;
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $(".progressbar li").eq($("fieldset").index(next_fs)).addClass("progress_active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(++current+1);
    });

    $(".previous").click(function () {

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $(".progressbar li").eq($("fieldset").index(current_fs)).removeClass("progress_active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(--current);
    });

    function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar")
            .css("width", percent + "%")
    }

    $(".submit").click(function () {
        return false;
    })

    if (window.File && window.FileList && window.FileReader) {
        $("#id_images_for_damage").on("change", function (e) {
            debugger
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<br/><span class=\"remove\">Remove image</span>" +
                        "</span>").insertAfter("#files");
                    $(".remove").click(function () {
                        $(this).parent(".pip").remove();
                    });
                });
                fileReader.readAsDataURL(f);
            }
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
});


(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()


//...loading page again on closing the add new product form...//
$('#staticBackdrop, #editModal, #historyModal').on('hidden.bs.modal', function () {
    debugger
    window.location.reload();
})


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
            debugger
			$("#tbody-content").html(data);
		}
	});
	dataTableRes1 = $('.historyTable1').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Allotment History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 9 },
			{ orderable: false, targets: 11 }
		],
		'pageLength': 12,
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

		var id = tr[0].children[12].innerText;
		var history_id = tr[0].children[13].innerText;
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


//...function for showing the version history of allotted items for each row...//
function allottedItemshistoryfunction(obj, obj2){
    debugger
    // $("#defaultOpen").click();

	var url = $("#allottedItemsHistoryModal").attr("data-history-url");
	var rowId = obj2;

    $.ajax({                       // initialize an AJAX request
		url: url,
		async: false,
		data: {
			'id': rowId
		},
		success: function (data) {
            debugger
			$("#allotted-item-modalBody").html(data);
		}
	});
	dataTableRes1 = $('.hardwareHistoryTable').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Hardware Allotted Item History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 8 },
		],
		'pageLength': 12,
		"bLengthChange": false,
		"autoWidth": false		
	});	
	

    dataTableRes2 = $('.softwareHistoryTable').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Software Allotted Item History',
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			},
		}
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 7 },
			{ orderable: false, targets: 8 },
			{ orderable: false, targets: 9 },
			{ orderable: false, targets: 11 }
		],
		'pageLength': 12,
		"bLengthChange": false,
		"autoWidth": false		
	});	
	
	debugger
	var r1 = dataTableRes1.data()
    var r2 = dataTableRes2.data()

	//  Array to track the ids of the details displayed rows
	var detailRows = [];

	$('#hardwareHistoryTableId tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes1.row( tr );

		var id = tr[0].children[8].innerText;
		var history_id = tr[0].children[9].innerText;
		var url = $("#hardwareHistoryTableId").attr("data-previous-url");
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
				row.child( format_and_diff_hardware( row.data(), res ) ).show();
			}
			else{
				row.child( format_hardware( row.data()) ).show();
			}
			// Add to the 'open' array
			if ( idx === -1 ) {
				detailRows.push( tr.attr('id') );
			}
		}
	});


	$('#softwareHistoryTableId tbody').on( 'click', 'tr td.details-control', function () {
		debugger
		var res
		var tr = $(this).closest('tr');

		var row = dataTableRes2.row( tr );

		var id = tr[0].children[10].innerText;
		var history_id = tr[0].children[11].innerText;
		var url = $("#softwareHistoryTableId").attr("data-previous-url");
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
				row.child( format_and_diff_software( row.data(), res ) ).show();
			}
			else{
				row.child( format_software( row.data()) ).show();
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



$("#id_employee_name").on('change', function () {
    debugger
    var id = $(this).val()

    var url = $("#addAllotmentForm").attr("data-products-url");
    $.ajax({
        url: url,
        data: { 'code': id },
        dataType: 'json',
        success: function (data) {
            debugger
            $("#id_employee_name").val(data['name']);
        },
        error: function (data) {
            debugger
        }
    })
})


$(".item_names").on('change', function () {
    var _d = this;
    var id = $(this).val();
    if (id) {
        var url = $("#addAllotmentForm").attr('data-item_details-url');

        $.ajax({
            url: url,
            data: { 'id': id },
            success: function (data) {
                debugger
                if (data['data']['type_id'] == 1) {
                    $(_d).parent().parent().siblings().find(':input').filter(':first').val(data['data']['details'])
                }
                else {
                    var q = $(_d).parent().parent().siblings().find(':input').filter(":nth-child(n)")
                    q[0].value = data['data']['details']
                    q[1].value = data['data']['validity_start_date']
                    q[2].value = data['data']['validity_end_date']
                }
            }
        })
    }

})


function handleTypeCheckboxclick(evt) {
    debugger
    var name = evt.name
    if (evt.checked == true) {
        document.getElementById(name).style.display = 'block'
    } else {
        document.getElementById(name).style.display = 'none'
    }
}


function handleItemCheckboxclick(evt) {
    debugger

    var url = $("#addAllotmentForm").attr("data-item_name-url")
    var item_id = evt.value

    $.ajax({
        url: url,
        data: { 'itemId': item_id },
        async: false,
        success: function (data) {
            debugger
            evt.parentNode.nextElementSibling.getElementsByTagName('select')[0].disabled = false
            var i = evt.parentNode.nextElementSibling.getElementsByTagName('select')[0].id;
            $("#" + i).html(data);

            var j = evt.parentNode.nextElementSibling.getElementsByTagName('select')[1].id;
            // var s_id = j.id
            var s_val = $("#" + j).val();
            $("#" + j).val(item_id)
            var s_val = $("#" + j).val();
            // var new_selection = $("#" + j).find('option:selected');
            // $("#" + j).not(new_selection).removeAttr('selected');
            // new_selection.attr("selected",false);

            // $("#" + j).val(item_id);
            // $('#' + j +  'option:selected').removeAttr('selected');

            // $("#" + s_id + "option").each(function () {
            //     debugger
            //     // (this).removeAttr('selected'); 
            // });

            // $('#' + j + 'option[value=item_id]').attr('selected','selected');

            // $('#j.id option:selected').removeAttr('selected');


            // for (var i = 0; i < j.options.length; i++) {
            //     j.options[i].selected = false
            //     var new_selection = $("#" + s_id).find('option:selected');
            //     $("#" + s_id).not(new_selection).removeAttr('selected');
            //     new_selection.attr("selected",false);
            //     if (j.options[i].value == item_id) {
            //         j.options[i].selected = true;
            //         // var new_selection = $("#" + s_id).find('option:selected');
            //         // new_selection.attr("selected",true);
            //         break;
            //     }
            // }


            // var s_val = $("#"+s_id).val()

        },
        error: function (data) {
            debugger
        }
    })

    if (evt.checked == true) {
        evt.parentNode.nextElementSibling.style.display = 'block';
    } else {
        evt.parentNode.nextElementSibling.style.display = 'none';
        var i = evt.parentNode.nextElementSibling.getElementsByTagName('select')[0].id;
        $("#" + i).html('');
    }
}


var loadFile = function(event) {
    debugger
	// var image = document.getElementById('output');
    
    var image_anchor = event.target.nextElementSibling.children[0];
    var image = event.target.nextElementSibling.children[0].children[0]
    // event.target.nextElementSibling.style.display = "block";
    image_anchor.href = URL.createObjectURL(event.target.files[0]);
	image.src = URL.createObjectURL(event.target.files[0]);
};


function addImageInput(evt) {
    debugger

    if (evt.children[0].classList.contains("edit_images"))
        var image = document.getElementById('edit_images')
    else{
        var image = document.getElementById('images')
    }
    var newDiv = document.createElement('div')

    var newInput = document.createElement('input')
    newInput.type = 'file'
    newInput.name = 'file[]'
    newInput.accept = 'image/*'
    newInput.onchange = loadFile
    newInput.style.cssText = 'margin-bottom: 2px;'

    var newButton = document.createElement('button')
    newButton.textContent = 'Remove'
    newButton.type = 'button'
    newButton.onclick = function () {
        return this.parentNode.remove();
    }
    newButton.style.cssText = 'border: none; float: right; margin-bottom: 5px'

    var newPreview = document.createElement('p')
    newPreview.innerHTML = '<a target="_blank"><img class="output" width="200" /></a>'

    newDiv.append(newInput, newPreview, newButton);
    image.append(newDiv)
}


// function previewImages() {

//     var preview = document.querySelector('#preview');

//     if (this.files) {
//         [].forEach.call(this.files, readAndPreview);
//     }

//     function readAndPreview(file) {

//         // Make sure `file.name` matches our extensions criteria
//         if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
//             return alert(file.name + " is not an image");
//         } // else...

//         var reader = new FileReader();

//         reader.addEventListener("load", function () {
//             var image = new Image();
//             image.height = 100;
//             image.title = file.name;
//             image.src = this.result;
//             preview.appendChild(image);
//         });

//         reader.readAsDataURL(file);

//     }

// }

// document.querySelector('#id_images_for_damage').addEventListener("change", previewImages);


//...function called when addAllotment form is submitted...//
function handleaddnewAllotment(event) {
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
        else if (xhr.status === 400) {
            debugger
            var Inval = xhr.response
            if (Inval['non_field_errors']) {
                alert("Name already exists.");
            }
            $('.chk', myForm).each(function () {
                debugger
                var ipVal = $(this).attr('name');

                if (ipVal == 'item_base_name') {
                    ipVal = 'name'
                }

                var $parentTag = $(this).parent();
                if (Inval[ipVal]) {
                    if (!$parentTag[0].classList.contains("error")) {
                        $parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 13px">' + Inval[ipVal] + '</span>')
                    }
                }
                else {
                    if ($(this).nextAll().length == 2) {
                        $parentTag.removeClass("error");
                        $(this).nextAll()[1].remove();
                    } else {
                        $parentTag.removeClass("error");
                        $(this).next().remove();
                    }
                }
            });
        }
    }
    xhr.send(myFormData)
}
const addNewallotmentForm = document.getElementById('addAllotmentForm')
addNewallotmentForm.addEventListener("submit", handleaddnewAllotment)


//...function called when addAllotment form is submitted...//
function handleEditAllotment(event) {
    debugger
    var items = document.getElementById('editAllotmentForm').getElementsByClassName('edit_item_names')
    for (var i = 0; i < items.length; i++) { 
        items[i].disabled = false;
    }
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
        else if (xhr.status === 400) {
            debugger
            var Inval = xhr.response
            if (Inval['non_field_errors']) {
                alert("Name already exists.");
            }
            $('.chk', myForm).each(function () {
                debugger
                var ipVal = $(this).attr('name');

                if (ipVal == 'item_base_name') {
                    ipVal = 'name'
                }

                var $parentTag = $(this).parent();
                if (Inval[ipVal]) {
                    if (!$parentTag[0].classList.contains("error")) {
                        $parentTag.addClass('error').append('<span class="error" style="color: red; font-size: 13px">' + Inval[ipVal] + '</span>')
                    }
                }
                else {
                    if ($(this).nextAll().length == 2) {
                        $parentTag.removeClass("error");
                        $(this).nextAll()[1].remove();
                    } else {
                        $parentTag.removeClass("error");
                        $(this).next().remove();
                    }
                }
            });
        }
    }
    xhr.send(myFormData)
}
const editAllotmentForm = document.getElementById('editAllotmentForm')
editAllotmentForm.addEventListener("submit", handleEditAllotment)


//...called when delete button is clicked...//
function deletefunction(obj) {
	document.getElementById('deleteAllotmentForm').action = obj.id;
}


//...function called when delete form is submitted...//
function handleDeleteAllotment(event) {
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
const deleteForm = document.getElementById('deleteAllotmentForm')
deleteForm.addEventListener("submit", handleDeleteAllotment)


function togglePassword(slf) {
    debugger
    slf.previousElementSibling.type = slf.previousElementSibling.type == "password" ? "text" : "password"
    if (slf.children[0].classList.contains('fa-eye-slash')) {
        slf.children[0].classList.remove('fa-eye-slash')
        slf.children[0].classList.add('fa-eye')
    } else{
        slf.children[0].classList.add('fa-eye-slash')
        slf.children[0].classList.remove('fa-eye')
    }

}


function allotmentFunction(evt, obj1){
    debugger
    $.ajax({
        url: $("#allotmentModal").attr('data-allotment-url'),
        data: {'employee_id': obj1},
        async: false,
        success: function(data){
            debugger
            $("#allotment-modal-body").html(data)
        }
    })
}


function editfunction(evt, obj1){
    debugger

    var x = document.getElementById(evt.id).parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('td')
    var y = document.getElementById('editAllotmentForm').getElementsByTagName('input')
    var edit_ac_inputs = document.getElementById('edit_accounts').getElementsByTagName('input')
    var edit_ac_data = Array.from([...x].filter(element => element.classList.contains('edit_accounts')));

    for (i=0; i<(edit_ac_data.length); i++){
        edit_ac_inputs[i].value = edit_ac_data[i].textContent
    }

    y[1].value = x[0].textContent;
    y[2].value = x[1].textContent.trim();

    $.ajax({
        url: $("#editAllotmentForm").attr('data-edit-allotment-url'),
        data: {'emp_code': x[0].textContent},
        async: false,
        success: function(data){
            debugger
            $("#edit_allotment_body").html(data)
        }
    })

    $.ajax({
        url: $("#editAllotmentForm").attr('data-edit-image-url'),
        data: {'allotment_id': obj1},
        async: false,
        success: function(data){
            debugger
            $("#edit_images").html(data)
        }
    })

    $(".edit_status option[value='3']").remove();
    document.getElementById('editAllotmentForm').action = evt.id;
}


function handleEditItemCheckboxclick(evt){
    debugger
    var d = evt.parentElement;
    var tr = evt.closest('tr').children;
    var td = tr[0].children[0]

    if (tr[0].children[0].checked == true){
        tr[1].children[0].disabled = false
        var url = $("#addAllotmentForm").attr("data-item_name-url")
        var item_id = evt.value
    
        $.ajax({
            url: url,
            data: { 'itemId': item_id },
            async: false,
            success: function (data) {
                debugger
                var j = tr
                var i = tr[1].children[0].id;
                $("#" + i).html(data);
    
                // var j = evt.parentNode.nextElementSibling.getElementsByTagName('select')[1].id;
                // // var s_id = j.id
                // var s_val = $("#" + j).val();
                // $("#" + j).val(item_id)
                // var s_val = $("#" + j).val();
            }
            })
    } else{
        tr[1].children[0].disabled = true
        tr[2].children[0].disabled = true
    }
}


function editItemNamesChange(evt) {
    debugger
    var id = evt.value;
    var tr = evt.closest('tr')
    var _d = this;
    
    if (id) {
        var url = $("#addAllotmentForm").attr('data-item_details-url');

        $.ajax({
            url: url,
            data: { 'id': id },
            async: false,
            success: function (data) {
                debugger
                if (data['data']['type_id'] == 1) {
                    debugger
                    // $(_d).parent().parent().siblings().find(':input').filter(':first').val(data['data']['details'])
                    tr.children[2].children[0].value = data['data']['details']
                }
                else {
                    debugger
                    tr.children[2].children[0].value = data['data']['details']
                    tr.children[3].children[0].value = data['data']['validity_start_date']
                    tr.children[4].children[0].value = data['data']['validity_end_date']
                }
            }
        })
    }
    else{
        tr.children[2].children[0].value = '';
    }
}


//...function for switching between different tabs...//
function openAllotmentDetailsTab(evt, tabName) {
	debugger
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tab-panel");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	
	document.getElementById(tabName).style.display = 'block';
	evt.currentTarget.className += " active";
	
	// if(dataTableRes){
	// 	dataTableRes.draw();		
	// }		
}

// // Get the element with id="defaultOpen" and click on it
$("#defaultOpen").click();



// Used for three dots click event in action column
$(".dropout").on('click', function(){
	debugger
	if (!this.classList.contains('more')) {
	document.querySelectorAll('.dropout.activeActn').forEach(
	  (d) => d !== this && d.classList.remove('activeActn')
	)}
	this.classList.toggle('activeActn')
});
