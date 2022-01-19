
$(document).ready(function () {
    debugger
    $.ajax({
        type: 'GET',
        async: false,
        url: $("#addAllotmentForm").attr('employee-code-url'),
        success: function(data){
            debugger
            $("#id_employee_id").html(data)
        },
        error: function(error, data){
            debugger
        }
    })


    $(".item_names option").remove();

    dataTableRes = $('.allotmentTable').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'csv',
			text: 'Export',
			exportOptions: {
				columns: [0, 1, 2, 3, 4,]
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
$('#staticBackdrop, #editModal').on('hidden.bs.modal', function () {
    debugger
    window.location.reload();
})


$("#id_employee_id").on('change', function () {
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
    newInput.style.cssText = 'margin-bottom: 2px;'

    var newButton = document.createElement('button')
    newButton.textContent = 'Remove'
    newButton.type = 'button'
    newButton.onclick = function () {
        return this.parentNode.remove();
    }
    newButton.style.cssText = 'border: none; float: right; margin-bottom: 5px'

    newDiv.append(newInput, newButton);
    image.append(newDiv)
}


function previewImages() {

    var preview = document.querySelector('#preview');

    if (this.files) {
        [].forEach.call(this.files, readAndPreview);
    }

    function readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
            return alert(file.name + " is not an image");
        } // else...

        var reader = new FileReader();

        reader.addEventListener("load", function () {
            var image = new Image();
            image.height = 100;
            image.title = file.name;
            image.src = this.result;
            preview.appendChild(image);
        });

        reader.readAsDataURL(file);

    }

}

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
    var x = document.getElementById(evt.id).parentElement.parentElement.getElementsByTagName('td')
    
    var y = document.getElementById('editAllotmentForm').getElementsByTagName('input')
    var edit_ac_inputs = document.getElementById('edit_accounts').getElementsByTagName('input')
    var edit_ac_data = Array.from([...x].filter(element => element.classList.contains('edit_accounts')));
    // var edit_ac_data = $('#edit_accounts').findAll('td [class="edit_accounts"]')

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
            $("#edit_allotment_body").html(data)
        }
    })

    document.getElementById('editAllotmentForm').action = evt.id;
}


function handleEditItemCheckboxclick(evt){
    debugger
    var d = evt.parentElement;
    var tr = evt.closest('tr').children;
    var td = tr[0].children[0]

    if (tr[0].children[0].checked == true){
        tr[1].children[0].disabled = false
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
