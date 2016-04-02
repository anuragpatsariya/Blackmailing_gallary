$(document).ready(function() {
    //$('#myModal').modal();
    $('#myModal').on('shown.bs.modal', function() {
        $('#myInput').focus();
        $("#submit")[0].disabled = false;
        $("#upr").addClass("sr-only");
        //$("#imgheading").val() = "";
        //$("#imgdetails").val() = "";
    });
    $.ajax({
        url: "http://localhost:3000/imagedata/?deleted=false",
        type: "GET",
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, item) {
                //alert(item);
                var v = "<li class=\"grid_block\"><figure> <img src=\"" + item.img_path + "\" alt=\"img0" + item.img_id + "\" height=\"150\" width=\"50\"/><figcaption> <h3>" + item.img_heading + "</h3><p>" + item.img_details + "</p></figcaption> </figure></li>";
                $("#grid_id")[0].innerHTML += v;
            });
        },
        Error: function(xhr, status, error) {
            window.alert("Error: " + xhr.status + status + error);
        }
    });
    $("#grid_id").on("click", "li.grid_block div.container a.del_image span.glyphicon-remove", remove_block);
});

var user_details;

function register() {
    var new_username = $("#reg_uname").val();
    var newpwd = $("#newpwd").val();
    var confirm_newpwd = $("#confirm_newrpwd").val();
    $.ajax({
        type: "GET",
        dataType: "JSON",
        url: "http://localhost:3000/userdata/?username=" + new_username,
        success: function(data) {
            if (data.length != 0) {
                window.alert("User Exists.");
            } else {
                //window.alert("User don't exist.");
                if (newpwd != confirm_newpwd) {
                    window.alert("Passwords did not match.");
                }
                else {
                    $.ajax({
                        type: "POST",
                        dataType: "JSON",
                        url: "http://localhost:3000/userdata/",
                        data: { "username": new_username, "pwd": newpwd },
                        success: function(data) {
                            window.alert("User registered successfully");
                            setTimeout(function() { $('#myModalRegister').modal('hide') }, 1500);
                            $("#reg_uname")[0].value = "";
                            $("#newpwd")[0].value = "";
                            $("#confirm_newrpwd")[0].value = "";
                        },
                        Error: function(xhr, status, error) {
                            window.alert("Error: " + xhr.status + status + error);
                            window.alert("Registration failed.");
                        }
                    });
                }
            }
        },
        Error: function(xhr, status, error) {
            window.alert("Error: " + xhr.status + status + error);
        }
    });

}



function remove_block() {
    //$(this).parent().parent().parent(".grid_block").remove();
    var record_id = $(this).parent().parent().parent(".grid_block")[0].dataset.id;
    $.ajax({
        type: "PATCH",
        dataType: "JSON",
        url: "http://localhost:3000/imagedata/" + record_id,
        data: { "deleted": true },
        success: function(data) {
            window.alert("record deleted.");
        },
        Error: function(xhr, status, error) {
            window.alert("Error: " + xhr.status + status + error);
        }

    });
    $(this).parent().parent().parent(".grid_block").remove();
}



function loginSuccess() {
    $("#loginSuccess").toggleClass("sr-only");
    $("#myInput").removeClass("sr-only");
    $("#myLogout").removeClass("sr-only");
    $("#login").addClass("sr-only");
    $("#register").addClass("sr-only");
    $("#uname")[0].value = "";
    $("#pwd")[0].value = "";
    setTimeout(function() { $('#myModalLogin').modal('hide') }, 1500);
    $.ajax({
        url: "http://localhost:3000/imagedata/?uploadedBy=" + user_details.username + "&deleted=false",
        type: "GET",
        dataType: "json",
        success: function(data) {
            $("#grid_id")[0].innerHTML = "";
            $.each(data, function(i, item) {
                //alert(item);

                var v = "<li data-id=\"" + item.id + "\" class=\"grid_block\"><figure> <img src=\"" + item.img_path + "\" alt=\"img0" + item.id + "\" height=\"150\" width=\"50\"/><figcaption> <h3>" + item.img_heading + "</h3><p>" + item.img_details + "</p></figcaption> </figure><div class=\"container\"><a class = \"del_image\"><span class=\"glyphicon glyphicon-remove\"></span></a></div></li>";
                $("#grid_id")[0].innerHTML += v;
            });
        },
        Error: function(xhr, status, error) {
            window.alert("Error: " + xhr.status + status + error);
        }
    });
}

function loginFailure() {
    $("#loginFailure").removeClass("sr-only");
    $("#uname")[0].value = "";
    $("#pwd")[0].value = "";
    //$('#myModalLogin').modal('hide');
    setTimeout(function() { $('#myModalLogin').modal('hide') }, 1500);
}

function login() {
    var uname = $("#uname").val();
    var pwd = $("#pwd").val();

    $.ajax({
        url: "http://localhost:3000/userdata/?username=" + uname + "&pwd=" + pwd,
        type: "GET",
        dataType: "json",
        success: function(data) {

            if (data.length === 1) {
                console.log("Successful login.");
                user_details = data[0];
                loginSuccess();
            }
            else {
                console.log("Login unsuccessful.");
                loginFailure();
            }
        },
        error: function(xhr, status, error) {
            alert("");
            window.alert("Error: " + xhr.status + status + error);
        }
    });
}

function logout() {
    user_details = null;
    $("#loginSuccess").toggleClass("sr-only");
    $("#login").removeClass("sr-only");
    $("#register").removeClass("sr-only");
    $("#myInput").addClass("sr-only");
    $("#myLogout").addClass("sr-only");
    $("#grid_id")[0].innerHTML = "";
    $.ajax({
        url: "http://localhost:3000/imagedata/?deleted=false",
        type: "GET",
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, item) {
                //alert(item);
                var v = "<li  data-id=\"" + item.id + "\" class=\"grid_block\"><figure> <img src=\"" + item.img_path + "\" alt=\"img0" + item.id + "\" height=\"150\" width=\"50\"/><figcaption> <h3>" + item.img_heading + "</h3><p>" + item.img_details + "</p></figcaption> </figure></li>";
                $("#grid_id")[0].innerHTML += v;
            });
        },
        Error: function(xhr, status, error) {
            window.alert("Error: " + xhr.status + status + error);
        }
    });

}



var file_path_name;
var imgheading;
var imgdetails;
function uploadimg() {
    $("#submit")[0].disabled = true;
    var data = new FormData();
    //console.log(data.dataType);
    //console.log(data.type);
    $.each($('#imgfile')[0].files, function(i, file) {

        data.append("userphoto", file);
    });
    $.ajax({
        url: 'api/photo',
        //url: 'http://localhost:5000/img/large',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data) {
            //alert("Photo uploaded successfully.");
            $("#up").removeClass("sr-only");
            file_path_name = data;
            console.log(file_path_name);
            imgheading = $("#imgheading").val();
            imgdetails = $("#imgdetails").val();
            console.log(file_path_name, imgheading, imgdetails);
        },
        error: function(xhr, status, error) {
            alert("Photo upload failed.");
            window.alert("Error: " + xhr.status + status + error);
        }
    });
}

function uploadRecord() {
    //$("#uploadrecord").disabled=true;
    console.log(file_path_name, imgheading, imgdetails);
    $.ajax({
        url: "http://localhost:3000/imagedata",
        type: "POST",
        data: { "img_path": file_path_name, "img_heading": imgheading, "img_details": imgdetails, "deleted": false, "uploadedBy": user_details.username },
        dataType: "JSON",
        success: function(data) {

            var text = "<li  data-id=\"" + data.id + "\" class=\"grid_block\"><figure> <img src=\"" + data.img_path + "\" alt=\"img0" + "" + "\" height=\"150\" width=\"50\"/><figcaption> <h3>" + data.img_heading + "</h3><p>" + data.img_details + "</p></figcaption> </figure><div class=\"container\"><a class = \"del_image\"><span class=\"glyphicon glyphicon-remove\"></span></a></li>";
            $("#grid_id")[0].innerHTML += text;
            $("#imgfile")[0].value = null;
            $("#imgheading")[0].value = "";
            $("#imgdetails")[0].value = "";
            $("#up").addClass("sr-only");
            $("#upr").removeClass("sr-only");
            $("#submit")[0].disabled = false;
            new CBPGridGallery(document.getElementById('grid-gallery'));

        },
        error: function(xhr, status, error) {
            window.alert("Error: " + xhr.status + status + error);
        }
    });
} 