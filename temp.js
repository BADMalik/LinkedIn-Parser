if (data.data == null || data.data == "null") {
  // console.log(data)
  $(".spinner-border").css("display", "none");
  $("#response").html("The user could not be found!");
} else {
  console.log(data);
  return 0;
  $("#response").html("");

  let html = "";
  console.log(data);
  //populate the list
  html += "<ul class='list-group text-left'>";

  html +=
    "<li class='list-group-item'><b> Candidate Name : </b>" +
    data.data["Candidate Name"];
  +"</li>";
  if (data.data["Summary"] !== "") {
    html +=
      "<li class='list-group-item'><b> Summary : </b>" + data.data["Summary"];
    +"</li>";
  } else {
    html +=
      "<li class='list-group-item'><b> Summary :</b> No Summary Is Available For This Candidate! </li>";
  }

  if (data.data["Certifications"].length == 0) {
    html +=
      "<li class='list-group-item'><b> Certifications : </b> No Certifications are available for this candidate!</li>";
  } else {
    html += "<li class='list-group-item'><b> Certifications : </b>";
    for (let i = 0; i < data.data["Certifications"].length; i++) {
      html += " " + data.data["Certifications"][i] + ",";
    }
    html = html.slice(0, -1);
    html += "</li>";
  }
  if (data.data["Experience"].length > 0) {
    html +=
      "<li class='list-group-item'> <span style='text-align:center;margin:0 auto;'><b>Experiences : </b></span><br>";
    html +=
      "<table class='table table-hover'><thead><tr><th scope='col'>#</th><th scope='col'>Company</th><th scope='col'>Location</th><th scope='col'>Duration</th><th scope='col'>Summary</th><th scope='col'>Title</th></tr></thead><tbody>";
    for (let j = 0; j < data.data["Experience"].length; j++) {
      html += "<tr>";
      html += "<th scope='row'>" + (j + 1) + "</th>";
      html +=
        "<td>" +
        data.data["Experience"][j].company +
        "</td><td>" +
        data.data["Experience"][j].location +
        "</td><td>" +
        data.data["Experience"][j].duration +
        "</td><td>" +
        data.data["Experience"][j].summary +
        "</td><td>" +
        data.data["Experience"][j].title +
        "</td></tr>";
    }
    html += "</tbody></table></li>";
  } else {
    html +=
      "<li class='list-group-item'><b> Experience : </b>No Experiences are available for this candidate!</li>";
  }

  if (data.data["Education"].length == 0) {
    html +=
      "<li class='list-group-item'><b> Education : </b>No Education are available for this candidate!</li>";
  } else {
    html += "<li class='list-group-item'><b> Education : </b>";
    for (let j = 0; j < Object.keys(data.data["Education"]).length; j++) {
      if (j == 0) {
        html += "<span style='margin-left: 1.5rem'>";
      } else {
        html += "<span style='margin-left: 6.5rem'>";
      }
      for (let i = 0; i < data.data["Education"][j].length; i++) {
        html += " " + data.data["Education"][j][i] + ",";
      }
      html = html.slice(0, -1);
      html += "</span><br>";
    }
    html += "</li>";
  }
  if (data.data["Title/Location"].length > 0) {
    html += "<li class='list-group-item'><b> Title/Location : </b>";
    for (let i = 0; i < data.data["Title/Location"].length; i++) {
      html += data.data["Title/Location"][i];
    }
  } else {
    html +=
      "<li class='list-group-item'><b> Title/Location :</b> No Title/Location Are Available For This Candidate! </li>";
  }
  if (data.data["Top Skills"].length > 0) {
    html += "<li class='list-group-item'><b> Top Skills : </b>";
    for (let i = 0; i < data.data["Top Skills"].length; i++) {
      html += data.data["Top Skills"][i] + ", ";
    }
    html = html.slice(0, -2);
  } else {
    html +=
      "<li class='list-group-item'><b> Top Skills :</b> No Top Skills Are Available For This Candidate! </li>";
  }
  html += "</ul>";
  // await new Promise(r => setTimeout(r, 2000));
  $(".spinner-border").css("display", "none");
  $("#response").html(html);
  // settimeout(function() {
}
