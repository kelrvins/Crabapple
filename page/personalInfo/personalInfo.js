$(document).ready(function () {
    //输入昵称
    $("#inputNickName").on("input propertychange", function () {
        var nickname = $(this).val().trim();
        if (nickname.length < 3 || nickname.length > 16) {
            $(this).css("border", "1px #f00 solid");
            $(this).siblings().show().html("昵称长度应大于3小于16")
            return
        } else {
            $(this).css("border", "1px #1abc9c solid")
            $(this).siblings().hide().html("");
        }
    });

    $("#saveInfos").on("click", function () {
        var inputNickName = $("#inputNickName").val().trim();
        var inputCareer = $("#inputCareer").val().trim();
        var inputAddress = $("#inputAddress").val().trim();
        var inputGoodat = $("#inputGoodat").val().trim();
        var inputShortintro = $("#inputShortintro").val().trim();
        if (inputNickName.length < 3 || inputNickName.length > 16) {
            // $("#LoginnickName").css("border", "1px #f00 solid");
            $("#inputNickName").siblings().show().html("<span style='color:#f00'>昵称长度应大于5小于16<span>")
            return
        }

        var userInfo = {
            userName: inputNickName,
            userCareer: inputCareer,
            userAddress: inputAddress,
            userGoodat: inputGoodat,
            userShortintro: inputShortintro
        }
        $.ajax({
            type: 'GET',
            url: "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/getStatus",
            data: userInfo,
            success: function (data) {
                var data = data[0];
                if (data == 0) {
                    alert("修改成功");
                }
                if (data == 1) {
                    $("#userName").css("border", "1px #f00 solid");
                    alert("用户名重复");
                }
            },
            error: function (xhr, type) {
                $("#userName").css("border", "1px #f00 solid")
                $("#userPwd").css("borsder", "1px #f00 solid")
            }
        })
    });

    // input change
    $("#updataImgInput").on("change", function () {
        var objUrl = getObjectURL(this.files[0]);
        console.log("objUrl = " + objUrl);
        if (objUrl) {
            $("#avatarWrap img").attr("src", objUrl);
        }

        var pic = $('#updataImgInput')[0].files[0];
        var fd = new FormData();
        fd.append('uploadFile', pic);
        $.ajax({
            type:"get",
            url: 'https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/getStatus',
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            success:function(data){
                console.log(data)
                var data = data[0];
                if (data == 0) {
                    alert("头像修改成功");
                }
                if (data == 1) {
                    alert("头像修改失败");
                }
            },
            error:function(data){
                alert("头像修改失败");
            }
        });

    });

    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
})