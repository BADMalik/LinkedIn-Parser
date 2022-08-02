    <script src="jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    </body>
    <script type="text/javascript">
        const timer = ms => new Promise(res => setTimeout(res, ms))

        function delay(t, v) {
            return new Promise(function(resolve) {
                console.log('insider set timeout function')
                setTimeout(resolve.bind(null, v), t)

            });
        }
        $(document).ready(function() {
            var dataToFilter;
            var url;
            let newStatus = null;
            $("#apiCallForm").submit(function(e) {
                url = $("#inputURL").val();
                $("#response").html("");
                $('.spinner-border').css('display', 'block');
                let taskId = null;
                e.preventDefault();
                let request = $.ajax({
                    "url": "http://75.101.229.169:8080/linkedin/parser",
                    "method": "POST",
                    "timeout": 0,
                    "contentType": "application/json",
                    "data": JSON.stringify({
                        "url": url
                    }),
                });
                request.then(function(data, textStatus, jqXHR) {
                    taskId = data.task_id;
                    console.log('taskId', data)
                    if (data.task_id) {
                        newStatus = $.ajax({
                            "url": "http://75.101.229.169:8080/linkedin/parser/get_status/" + data.task_id,
                            "method": "GET",
                        });
                    } else if (data.error || data.message) {
                        $(".spinner-border").css("display", "none");
                        console.log(data)
                        if (data.error) {
                            $("#response").html(data.error + ", Please contact support.");
                        } else if (data.message) {
                            $("#response").html(data.message + ", Please contact support.");
                            // }
                        }
                        return 0;
                    }
                })
                if (newStatus) {
                    if (newStatus.status !== 'Completed') {

                        $(".spinner-border").css("display", "none");
                        console.log(newStatus)
                        if (newStatus.status == 'In progress') {
                            $("#response").html(newStatus.status + ", Please try a few minutes later.");
                        } else {
                            $("#response").html(newStatus.status + ", Please contact support.");
                        }
                        return 0;
                    }
                    if (newStatus.status == 'Completed') {
                        let request = $.ajax({
                            "url": "http://75.101.229.169:8080/linkedin/parser/get_result/" + taskId,
                            "method": "GET",
                        });
                        request.then(function(newStatus, textStatus, jqXHR) {

                            if (newStatus.data == null || newStatus.data == "null") {
                                // console.log(data)
                                $(".spinner-border").css("display", "none");
                                $("#response").html("The user could not be found!");
                            } else {
                                console.log('entered', newStatus.data.Certifications);
                                $("#response").html("");

                                let html = "";
                                console.log(newStatus);
                                //populate the list
                                html += "<ul class='list-group text-left'>";
                                // return 0;
                                html +=
                                    "<li class='list-group-item'><b> Candidate Name : </b>" +
                                    newStatus.data["Candidate Name"]; +
                                "</li>";
                                if (newStatus.data["Summary"] !== "") {
                                    html +=
                                        "<li class='list-group-item'><b> Summary : </b>" + newStatus.data["Summary"]; +
                                    "</li>";
                                } else {
                                    html +=
                                        "<li class='list-group-item'><b> Summary :</b> No Summary Is Available For This Candidate! </li>";
                                }

                                if (newStatus.data.Certifications.length === 0) {
                                    html +=
                                        "<li class='list-group-item'><b> Certifications : </b> No Certifications are available for this candidate!</li>";
                                } else {
                                    html += "<li class='list-group-item'><b> Certifications : </b>";
                                    for (let i = 0; i < newStatus.data["Certifications"].length; i++) {
                                        html += " " + newStatus.data["Certifications"][i] + ",";
                                    }
                                    html = html.slice(0, -1);
                                    html += "</li>";
                                }
                                if (newStatus.data["Experience"].length > 0) {
                                    html +=
                                        "<li class='list-group-item'> <span style='text-align:center;margin:0 auto;'><b>Experiences : </b></span><br>";
                                    html +=
                                        "<table class='table table-hover'><thead><tr><th scope='col'>#</th><th scope='col'>Company</th><th scope='col'>Location</th><th scope='col'>Duration</th><th scope='col'>Summary</th><th scope='col'>Title</th></tr></thead><tbody>";
                                    for (let j = 0; j < newStatus.data["Experience"].length; j++) {
                                        html += "<tr>";
                                        html += "<th scope='row'>" + (j + 1) + "</th>";
                                        html +=
                                            "<td>" +
                                            newStatus.data["Experience"][j].company +
                                            "</td><td>" +
                                            newStatus.data["Experience"][j].location +
                                            "</td><td>" +
                                            newStatus.data["Experience"][j].duration +
                                            "</td><td>" +
                                            newStatus.data["Experience"][j].summary +
                                            "</td><td>" +
                                            newStatus.data["Experience"][j].title +
                                            "</td></tr>";
                                    }
                                    html += "</tbody></table></li>";
                                } else {
                                    html +=
                                        "<li class='list-group-item'><b> Experience : </b>No Experiences are available for this candidate!</li>";
                                }

                                if (newStatus.data["Education"].length == 0) {
                                    html +=
                                        "<li class='list-group-item'><b> Education : </b>No Education are available for this candidate!</li>";
                                } else {
                                    html += "<li class='list-group-item'><b> Education : </b>";
                                    for (let j = 0; j < Object.keys(newStatus.data["Education"]).length; j++) {
                                        if (j == 0) {
                                            html += "<span style='margin-left: 1.5rem'>";
                                        } else {
                                            html += "<span style='margin-left: 6.5rem'>";
                                        }
                                        for (let i = 0; i < newStatus.data["Education"][j].length; i++) {
                                            html += " " + newStatus.data["Education"][j][i] + ",";
                                        }
                                        html = html.slice(0, -1);
                                        html += "</span><br>";
                                    }
                                    html += "</li>";
                                }
                                if (newStatus.data["Title"].length > 0) {
                                    html += "<li class='list-group-item'><b> Title : </b>";
                                    for (let i = 0; i < newStatus.data["Title"].length; i++) {
                                        html += newStatus.data["Title"][i];
                                    }
                                } else {
                                    html +=
                                        "<li class='list-group-item'><b> Title/Location :</b> No Title/Location Are Available For This Candidate! </li>";
                                }
                                if (newStatus.data["Location"] !== "") {
                                    html += "<li class='list-group-item'><b> Location : " + newStatus.data['Location'] + "</b>";
                                } else {
                                    html +=
                                        "<li class='list-group-item'><b> Location :</b> No Location Is Available For This Candidate! </li>";
                                }
                                if (newStatus.data["Top Skills"].length > 0) {
                                    html += "<li class='list-group-item'><b> Top Skills : </b>";
                                    for (let i = 0; i < newStatus.data["Top Skills"].length; i++) {
                                        html += newStatus.data["Top Skills"][i] + ", ";
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

                        })
                    }
                }

            })
        })
    </script>