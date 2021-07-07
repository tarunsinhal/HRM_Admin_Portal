
/* global bootstrap: false */
(function () {
    $(".nav").on("click", function() {
        localStorage.setItem("active",(this).text.trim().toLowerCase())
    });
    $(document).ready( function() {
        $(".nav").removeClass("active");
        $("."+localStorage.getItem("active")).addClass("active");
    })
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    }
  })()