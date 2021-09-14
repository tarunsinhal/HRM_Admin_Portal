
/* global bootstrap: false */
(function () {
    $(".nav").on("click", function() {
        // localStorage.setItem("active",(this).text.trim().toLowerCase())

        if((this).text.trim().toLowerCase().length>0){	
            localStorage.setItem("active",(this).text.trim().toLowerCase().replace(" ","_"))	
            if($("."+localStorage.getItem("active")).parent().prop('className').split(" ")[0]!="dropdown-container"){	
                localStorage.setItem("ddl","")	
            }	
        }else{	
            debugger;	
            localStorage.setItem("active",(this).text.trim().toLowerCase())	
            if($("."+localStorage.getItem("active")).parent().prop('className').split(" ")[0]!="dropdown-container"){	
                localStorage.setItem("ddl","")	
            }	
        }



    });
    $(document).ready( function() {
        $(".nav").removeClass("active");
        $("."+localStorage.getItem("active")).addClass("active");

        $('.'+localStorage.getItem("ddl")).css('display','block');
    })
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {
            // this.classList.toggle("active");

            debugger;	
            localStorage.setItem("ddl",this.textContent.split("\n")[0].trim().toLowerCase().replace("&","").trim().replace("  ","_").trim())

            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }


            document.getElementsByClassName(localStorage.getItem("ddl")).style.display = "block";


        });
    }
  })()