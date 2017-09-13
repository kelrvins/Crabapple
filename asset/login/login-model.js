$(document).ready(function () {
    var loginHTML = `<div class="login-wrap" id="loginWrap"><div class="login-shade" id="loginShade"></div><div class="login"><span class="close-login iconfont icon-guanbi" id="closeLogin"></span><div class="login-title-wrap"><span class="inputBox-title" id="loginIN">Sign in</span><span class="inputBox-title" id="loginUP">Sign up</span></div><div class="input-box-Wrap clear"><ul class="inputBox" id="loginInwrap"><li><input type="text" name="username" id="userName" class="user-name-input" placeholder="用户名"><i></i></li><li><input type="password" name="password" id="userPwd" class="user-pwd-input" placeholder="密码"><i></i></li><label class="remember-pwd"><input type="checkbox" name="rememberpwd" id="rememberPwd"><span>记住密码</span></label><button type="submit" class="submit-btn" id="submitBtn">Enter</button></ul><ul class="inputBox login-up-wrap" id="loginUpwrap"><li><input type="text" name="username" id="LoginUpName" class="user-name-input" placeholder="用户名"><i></i></li><li><input type="text" name="nickname" id="LoginnickName" class="user-name-input" placeholder="昵称"><i></i></li><li><input type="password" name="password" id="LoginUpPwd" class="user-pwd-input" placeholder="密码"><i></i></li><li><input type="password" name="repassword" id="LoginUprePwd" class="user-pwd-input" placeholder="确认密码"><i></i></li><li><button type="submit" class="submit-btn" id="submitLoginUpBtn">Enter</button></li></ul></div></div></div>`
    //插入登录模态窗
    $("body").append(loginHTML)
    //用户名检测，输入停止后1秒检测
    var userFlag = false;
    var timeout;
    $("#LoginUpName").on("input propertychange", function () {
        var _this = this;
        var username = $(_this).val().trim();
        if (username.length < 6 || username.length > 16) {
            $(_this).css("border", "1px #f00 solid");
            $(_this).siblings().show().html("用户名长度应大于6小于16")
            return
        } else {
            $(_this).css("border", "1px #1abc9c solid")
            $(_this).siblings().hide().html("")
        }
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            $.ajax({
                type: 'GET',
                url: "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/getStatus",
                data: username,
                success: function (data) {
                    console.log(data[0])
                    if (data[0] == 0) {
                        $(_this).css("border", "1px #1abc9c solid")
                        console.log("用户名可用！！")
                        $(_this).siblings().hide().html("")
                        userFlag = true;
                    }
                    if (data[0] == 1) {
                        $(_this).css("border", "1px #f00 solid");
                        console.log("用户名已存在！！")
                        $(_this).siblings().show().html("用户名已存在！！")
                        userFlag = false;
                    }
                },
                error: function (xhr, type) {
                    alert("用户名重复");
                }
            })
        }, 1000)
    });

    //输入昵称
    $("#LoginnickName").on("input propertychange", function () {
        var nickname = $(this).val().trim();
        if (nickname.length < 3 || nickname.length > 16) {
            $(this).css("border", "1px #f00 solid");
            $(this).siblings().show().html("昵称长度应大于3小于16")
            return
        } else {
            $(this).css("border", "1px #1abc9c solid")
            $(this).siblings().hide().html("")
        }
    });

    //输入密码
    $("#LoginUpPwd").on("input propertychange", function () {
        var LoginUpPwd = $(this).val().trim();
        if (LoginUpPwd.length < 6 || LoginUpPwd.length > 16) {
            $(this).css("border", "1px #f00 solid");
            $(this).siblings().show().html("密码长度应大于6小于16")
            return
        } else {
            $(this).css("border", "1px #1abc9c solid")
            $(this).siblings().hide().html("")
        }
    });

    //确认密码
    $("#LoginUprePwd").on("input propertychange", function () {
        var LoginUpPwd = $("#LoginUpPwd").val().trim();
        var LoginUprePwd = $(this).val().trim();
        if (LoginUprePwd != LoginUpPwd) {
            $(this).css("border", "1px #f00 solid");
            $(this).siblings().show().html("两次输入密码不一致")
            return
        } else {
            $(this).css("border", "1px #1abc9c solid")
            $(this).siblings().hide().html("")
        }
    });

    //提交注册信息
    $("#submitLoginUpBtn").on("click", function () {
        var username = $("#LoginUpName").val().trim();
        var nickname = $("#LoginnickName").val().trim();
        var userpwd = $("#LoginUpPwd").val().trim();
        var userrepwd = $("#LoginUprePwd").val().trim();
        if (username.length < 6 || username.length > 16) {
            $("#LoginUpName").siblings().show().html("用户名长度应大于6小于16")
            return
        }
        if (!userFlag) {
            $("#LoginUpName").siblings().show().html("用户名重复")
            return
        }
        if (nickname.length < 3 || nickname.length > 16) {
            $("#LoginnickName").siblings().show().html("昵称长度应大于3小于16")
            return
        }
        if (userpwd.length < 6 || userpwd.length > 16) {
            $("#LoginUpPwd").siblings().show().html("密码长度应大于6小于16")
            return
        }
        if (userpwd !== userrepwd) {
            $("#LoginUprePwd").siblings().show().html("请确认输入一致的密码")
            return
        }
        var userInfo = {
            userName: username,
            userNickName: nickname,
            userPwd: userpwd
        }
        console.log(userInfo)
        $.ajax({
            type: 'GET',
            url: "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/getStatus",
            data: userInfo,
            success: function (data) {
                var data = data[0];
                if (data == 0) {
                    window.location.href = "http://www.baidu.com"
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

    //切换登录
    $("#loginIN").on("click", function () {
        $(this).siblings().css("border-bottom", " 1px solid #fff")
        $(this).css("border-bottom", " 1px solid #000")
        $("#loginUpwrap").hide()
        $("#loginInwrap").show()

    });

    //切换注册
    $("#loginUP").on("click", function () {
        $(this).siblings().css("border-bottom", " 1px solid #fff")
        $(this).css("border-bottom", " 1px solid #000")
        $("#loginUpwrap").show()
        $("#loginInwrap").hide()
    })


    //登录按钮
    $("#submitBtn").on("click", function () {
        var username = $("#userName").val().trim();
        var userpwd = $("#userPwd").val().trim();
        if (username == "" || userpwd == "") {
            $("#userPwd").siblings().show().html("<span style='color:#f00'>不能为空</span>")
            return
        } else {
            $("#userPwd").siblings().show().html("")
        }
        $.ajax({
            type: 'GET',
            url: "https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/getStatus",
            data: {
                username: username,
                userpwd: userpwd
            },
            success: function (data) {
                var data = data[0];
                if (data == 0) {
                    window.location.href = "http://www.baidu.com"
                }
                if (data == 1) {
                    $("#userPwd").siblings().show().html("账号或密码错误")
                }
            },
            error: function (xhr, type) {
                alert("something wrong!")
            }
        })
    });

    $("#closeLogin").on("click", function () {
        $("#loginWrap").fadeOut("fast", 0);
    })
    $("#loginShade").on("click", function () {
        $("#loginWrap").fadeOut("fast", 0);
    })

    $("#personalUnlogin a").on("click", function () {
        $("#loginWrap").fadeIn("fast");
    })
})