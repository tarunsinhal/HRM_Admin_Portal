var dataTableRes;
$(document).ready(function(){
	dataTableRes = $('.billsReimburseTable').DataTable({
		dom: 'Bfrtip',
		destroy: true,
		buttons: [{
			extend: 'csv',
			text: 'Export',
			title: 'Bills Data',
			exportOptions: {
				columns: [0, 1, 2, 3]
			},
		},
		],
		order: [],
		columnDefs: [
			{ orderable: false, targets: 4 },
			{ orderable: false, targets: 5 },
		],
		'pageLength': 8,
		"bLengthChange": true,
		"autoWidth": true,  
	});
})


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
    newPreview.innerHTML = '<a target="_blank"><img class="output" width="100" /></a>'

    newDiv.append(newInput, newPreview, newButton);
    image.append(newDiv)
}


// ...loading page again on click on closing button of form...//
$('.Close').on('click', function () {
	debugger
	window.location.reload();
})

// function called for fetching data of adhoc, recurring and mro module name clicked
function detailfunction(obj){
    debugger;
    var url = $("#detailsModal").attr("data-user-url");
	var dateData = obj.parentElement.parentElement.parentElement.parentElement.children[1].textContent;
	var userName = $('#user').text()
	var moduleName = obj.id;

	$.ajax({                     
		url: url,
		data: {
			'moduleName':  moduleName,
			'userName': userName,
			'dateData': dateData
		},
        dataType: "html", 
		success: function (response) {
			$("#moduleData").html(response);
        }
    });
}

// function called for fetching data of t-shirt module name clicked
function detailfunction1(obj){
    debugger;
    var url = $("#detailsModal1").attr("data-user-url");
	var dateData = obj.parentElement.parentElement.parentElement.parentElement.children[1].textContent;
	var userName = $('#user').text()
	var moduleName = obj.id;

	$.ajax({                     
		url: url,
		data: {
			'moduleName':  moduleName,
			'userName': userName,
			'dateData': dateData
		},
        dataType: "html", 
		success: function (response) {
			$("#moduleData1").html(response);
        }
    });
}


// function called for fetching data of office event module name clicked
function detailfunction2(obj){
    debugger;
    var url = $("#detailsModal2").attr("data-user-url");
	var dateData = obj.parentElement.parentElement.parentElement.parentElement.children[1].textContent;
	var userName = $('#user').text()
	var moduleName = obj.id;

	$.ajax({                     
		url: url,
		data: {
			'moduleName':  moduleName,
			'userName': userName,
			'dateData': dateData
		},
        dataType: "html", 
		success: function (response) {
			$("#moduleData2").html(response);
        }
    });
}

function detailsBtn(obj){
    debugger
	if (obj.nextElementSibling.style.display == "none"){
		obj.nextElementSibling.style.display = "block"
	}
	else{
		obj.nextElementSibling.style.display = "none"
	}
}

// function called for edit reimbursement status
function editstatusfunction(obj){
	debugger;
	var x = obj.parentElement.children[0].textContent;
	var mySelect = document.getElementById('editStatusForm').getElementsByTagName('select');
	for (var i, j = 0; i = mySelect[0].options[j]; j++) {
		if (x == i.value) {
			mySelect[0].selectedIndex = j;
			break;
		}
	}
	document.getElementById('editStatusForm').action = obj.id;	
}

// function called for upload images
function editimagesfunction(obj){
	debugger;
	user = $("#user").text();
	dateVal = obj.parentElement.parentElement.children[1].textContent;
	$.ajax({
        url: $("#editImagesForm").attr('image-url'),
        data: {'user': user, 'dateVal': dateVal},
        async: false,
        success: function(imagelist){
            debugger
            $("#edit_images").html(imagelist)
        }
    })
	document.getElementById('editImagesForm').action = obj.id;	
}

