    <script src="jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    </body>
    <script type="text/javascript">
        const timer = ms => new Promise(res => setTimeout(res, ms))

        function delay(t, v) {
            // let res = {
            //     status: 'In Progress'
            // };
            return new Promise(function(resolve) {
                // while (res.status !== 'Completed') {
                console.log('insider set timeout function')
                // setTimeout(function() {
                //     console.log('insider set timeout while settimepout')
                //     res = $.ajax({
                //         "url": "http://75.101.229.169:8080/linkedin/parser/get_status/" + taskId,
                //         "method": "GET",
                //     });
                //     res.then(function(response) {
                //         return response;
                //     });
                // }, 20000)
                setTimeout(resolve.bind(null, v), t)
                // }
                // resolve(res)

            });
        }
        $(document).ready(function() {
            // $.ajax(settings).done(function(response) {
            //     console.log(response);
            //     return 0;
            // });
            var dataToFilter;
            var url;
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
                    return newStatus = $.ajax({
                        "url": "http://75.101.229.169:8080/linkedin/parser/get_status/" + data.task_id,
                        "method": "GET",
                    });
                }).then(function(data, textStatus, jqXHR) {
                    console.log('status returned for the first time is ', data)
                    let varForLoop = data;
                    // return new Promise(function(resolve, reject) {
                    if (varForLoop.status !== 'Completed') {
                        // while (varForLoop.status !== 'Completed') {
                        // console.log('inside while and the value of status is varForLoop.status')
                        return delay(150000).then(function() {
                            console.log('inside setTimeout', taskId)
                            varForLoop = $.ajax({
                                "url": "http://75.101.229.169:8080/linkedin/parser/get_result/" + taskId,
                                "method": "GET",
                            });
                            varForLoop.then(function(response) {
                                console.log('res from results  of if ', response)
                                return response;
                            });
                            let payload = varForLoop;
                            return (payload)
                        })
                    } else {
                        console.log('inside else and the value of status is varForLoop.status')
                        varForLoop = $.ajax({
                            "url": "http://75.101.229.169:8080/linkedin/parser/get_result/" + taskId,
                            "method": "GET",
                        });
                        varForLoop.then(function(response) {
                            return response;
                        });
                        let payload = varForLoop;
                        return (payload)
                    }
                    // })
                }).then(function(data, textStatus, jqXHR) {
                    console.log(data, 'ddadw');
                    if (data.data == null || data.data == "null") {
                        // console.log(data)
                        $(".spinner-border").css("display", "none");
                        $("#response").html("The user could not be found!");
                    } else {
                        console.log('entered', data.data.Certifications);
                        $("#response").html("");

                        let html = "";
                        console.log(data);
                        //populate the list
                        html += "<ul class='list-group text-left'>";
                        // return 0;
                        html +=
                            "<li class='list-group-item'><b> Candidate Name : </b>" +
                            data.data["Candidate Name"]; +
                        "</li>";
                        if (data.data["Summary"] !== "") {
                            html +=
                                "<li class='list-group-item'><b> Summary : </b>" + data.data["Summary"]; +
                            "</li>";
                        } else {
                            html +=
                                "<li class='list-group-item'><b> Summary :</b> No Summary Is Available For This Candidate! </li>";
                        }

                        if (data.data.Certifications.length === 0) {
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
                        if (data.data["Title"].length > 0) {
                            html += "<li class='list-group-item'><b> Title : </b>";
                            for (let i = 0; i < data.data["Title"].length; i++) {
                                html += data.data["Title"][i];
                            }
                        } else {
                            html +=
                                "<li class='list-group-item'><b> Title/Location :</b> No Title/Location Are Available For This Candidate! </li>";
                        }
                        if (data.data["Location"] !== "") {
                            html += "<li class='list-group-item'><b> Location : " + data.data['Location'] + "</b>";
                        } else {
                            html +=
                                "<li class='list-group-item'><b> Location :</b> No Location Is Available For This Candidate! </li>";
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

                })
            })
        })
    </script>