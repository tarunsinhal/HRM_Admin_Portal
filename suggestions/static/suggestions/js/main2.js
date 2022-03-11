function formedit(id) {
  id = id.slice(1);
  fetch("/suggestions/edit/" + id + "/")
    .then((response) => response.json())
    .then((data) => {
      const data1 = JSON.parse(data.suggestion)[0]["fields"];
      const data2 = JSON.parse(data.change_suggestion);
      const data3 = JSON.parse(data.choices);
      console.log(data1, data2, data3);
      document.getElementById("select" + id).innerHTML = "";

      for (let i = 0; i < data3.length; i++) {
        console.log(data3[i]["fields"]["status"], data2["suggestion_status"]);
        if (data3[i]["fields"]["status"] == data2["suggestion_status"]) {
          document.getElementById("select" + id).innerHTML += `
          <option value="${data3[i]["pk"]}" selected>${data3[i]["fields"]["status"]}</option>
          `;
        } else {
          document.getElementById("select" + id).innerHTML += `
          <option value="${data3[i]["pk"]}">${data3[i]["fields"]["status"]}</option>
          `;
        }
      }

      let model = new bootstrap.Modal(
        document.getElementById("meta2-" + id),
        {}
      );
      document.getElementById("meta2-name-" + id).value = data1.name;
      document.getElementById("meta2-suggestion-" + id).value =
        data1.suggestion;
      document.getElementById("meta2-time-" + id).value = data1.created_at;
      document.getElementById("meta2-category-" + id).value =
        data2.suggestion_category;
      document.getElementById("meta2-comment-" + id).value = data1.comment;

      model.show();
    })
    .catch((error) => console.log(error));
}

function formupdate(id) {
  id = id.slice(2);
  console.log(id);
  let selectOption = document.querySelector("#select" + id).value;
  let commentData = document.getElementById("meta2-comment-" + id).value;

  let csrftoken = document.querySelector('[name="csrfmiddlewaretoken"]').value;

  fetch("/suggestions/edit/" + id + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      data: [selectOption, commentData],
    }),
  })
    .then((response) => response)
    .then((data) => window.location.reload())
    .catch((error) => console.log(error));
}

function versionhistory(id) {
  id = id.slice(1);
  fetch("/suggestions/history/" + id + "/")
    .then((response) => response.json())
    .then((data) => {
      let category = JSON.parse(data.category);
      let status = JSON.parse(data.status);
      let users = JSON.parse(data.user);
      let status_dict = {},
        category_dict = {},
        type = { "+": "Created", "~": "Updated", "-": "Deleted" },
        user_dict = { null: "" };
      for (let i = 0; i < status.length; i++) {
        status_dict[status[i]["pk"]] = status[i]["fields"]["status"];
      }
      for (let i = 0; i < category.length; i++) {
        category_dict[category[i]["pk"]] = category[i]["fields"]["category"];
      }
      for (let i = 0; i < users.length; i++) {
        user_dict[users[i]["pk"]] = users[i]["fields"]["username"];
      }
      console.log(user_dict);

      data = JSON.parse(data.history);
      console.log(data);
      let tablebody = document.getElementById("tablerows-" + id);
      tablebody.innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        tablebody.innerHTML += `
        <tr>
        <td>${user_dict[data[i]["fields"]["id"]]||'User Removed'}</td>
        <td>${data[i]["fields"]["comment"] || "Empty"}</td>
        <td>${data[i]["fields"]["history_date"]}</td>
        <td>${category_dict[data[i]["fields"]["suggestion_category"]]}</td>
        <td>${status_dict[data[i]["fields"]["suggestion_status"]]}</td>
        <td>${type[data[i]["fields"]["history_type"]]}</td>
        </tr>
        `;
      }

      let model = new bootstrap.Modal(
        document.getElementById("meta3-" + id),
        {}
      );

      model.show();
    })
    .catch((error) => console.log(error));
}

// write a jquery function
(function ($) {
  "use strict";




    
    $(document).ready( function () {
      $('#tableDemo').DataTable({
        "order": [[ 0, "asc" ]]

      });
  } );

  
  $(document).ready( function () {
    $('#tableDemo2').DataTable({
      "order": [[ 0, "asc" ]]

    });
} );
  
  

  

})(jQuery);