function fetchPermissions(id) {
  fetch("/home/profile/permissions/" + id)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let assigned_groups = JSON.parse(data.assigned_groups);
      assigned_groups = assigned_groups.map(function (group) {
        return group.fields.name;
      });
      data = JSON.parse(data.all_groups);
      let all_groups = [];
      for (let i = 0; i < data.length; i++) {
        all_groups.push(data[i].fields.name);
      }
      let headingGroup = (all_groups.map(el=>el.split('@')[0])).filter((el,i,a)=>a.indexOf(el)===i)
      let permissionGroup = (all_groups.map(el=>el.split('@')[1])).filter((el,i,a)=>a.indexOf(el)===i)
      let headingGroupCount = headingGroup.map(el=>all_groups.filter(el2=>el2.split('@')[0]===el).length);
      let headingGroupObject = headingGroup.map((el,i)=>{return {name:el,count:headingGroupCount[i]}});
      let modelBody = document.getElementById("user-permsbody-" + id);
      modelBody.innerHTML = "";
      // for loop for creating the heading and appending the data
      for (let i = 0; i < headingGroupObject.length; i++) {
        let heading = (headingGroupObject[i].name).replace("_"," ");
        for (let j = 0; j < headingGroupObject[i].count; j++) {
          let group = permissionGroup.shift();            
          let assigned = assigned_groups.includes(headingGroupObject[i].name+'@'+group);
          let checkbox = `<input type="checkbox" name="group-${id}" value="${headingGroupObject[i].name+'@'+group}" ${ assigned ? "checked" : ""}>`;
          let innerHTML = `
            ${j==0?`<br> <h6 class='fw-bold' >${heading.split(" ").map(el=>el.slice(0,1).toUpperCase()+el.slice(1)).join(" ")}:</h6>`:''}
                  <div class='row'>
                      <div class = 'col-2'>
                      </div>
                      <div class='col-8'>
                          ${group.split("_").map(el=>el.slice(0,1).toUpperCase()+el.slice(1)).join(" ")}
                      </div>
                      <div class='col-2'>
                      <label class="switch">
                          ${checkbox}
                          <span class="slider round"></span>
                      </label>
  
                      </div>  
                  </div>
                  
              `;
          modelBody.innerHTML += innerHTML;
         }    } 

      let model = new bootstrap.Modal(
        document.getElementById("user-perms-" + id),
        {}
      );

      model.show();
    });
}

function savePermissions(id) {
  id = id.split("-")[1];
  let assigned_groups = [];
  let all_groups = document.getElementsByName("group-" + id);
  for (let i = 0; i < all_groups.length; i++) {
    let group = all_groups[i];
    if (group.checked) {
      assigned_groups.push(group.value);
    }
  }
  let data = JSON.stringify(assigned_groups);
  let csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
  fetch("/home/profile/permissions/" + id, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf_token,
      "Content-Type": "application/json",
    },
    body: data,
  });
}


