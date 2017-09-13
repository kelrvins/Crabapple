window.onload = function () {
    console.log("scroll")
    //标题距离顶部高度集合
    var titlesOffsetTop = [];
    //目录悬浮
    var fixed = false;
    function setAsidefixed() {
        var asideTop = $(".aside section").offset().top;
        var scrollTop = document.documentElement.scrollTop;
        if (asideTop - scrollTop < 30 && !fixed) {
            $(".aside section").addClass('fixed-down');
            $("#backTop").show();
            fixed = true;
        } else if (scrollTop < 530 && fixed) {
            $(".aside section").removeClass('fixed-down');
            $("#backTop").hide();
            fixed = false;
        }
    }
    
    var timeout;
    window.onscroll = function () {
        setAsidefixed();
        checkHignLightPos();
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            moveHignLight();
        }, 100);
    }

    setAsidefixed();
    setNav();
    checkHignLightPos();
    moveHignLight();

    //移动高亮条
    function moveHignLight() {
        for (var i = 0; i < titlesOffsetTop.length; i++) {
            // console.log(document.documentElement.scrollTop,titlesOffsetTop[i])
            if ((document.documentElement.scrollTop + 30) > titlesOffsetTop[i]) {
                $(".high-light-title").css("top", parseInt(30 * i + 45) + "px")
            }
        }
    }

    // 生成目录
    function setNav() {
        var titles = $("#articleContent :header");
        // console.log($("#articleContent")[0].offsetTop)
        var fatherTop=$("#articleContent")[0].offsetTop
        var _li = "";
        var ulExist = false;
        for (var i = 0; i < titles.length; i++) {
            titles[i].id = "articleNav" + i;
            titlesOffsetTop.push(titles[i].offsetTop+fatherTop)
            if (titles[i].nodeName == "H1") {
                if (ulExist) {
                    _li += '</ul>';
                    ulExist = false;
                }
                _li += `<li><a href="#${titles[i].id}" data-id="${titles[i].id.slice(10)}">${titles[i].innerHTML}</a></li>`;
            } else {
                if (!ulExist) {
                    _li += '<ul>';
                    ulExist = true;
                }
                _li += `<li><a href="#${titles[i].id}" data-id="${titles[i].id.slice(10)}">${titles[i].innerHTML}</a></li>`;
            }
        }
        $("#articleNavWrap").html(_li)

        /* 点击事件 */
        $('#articleNavWrap li a').click(function () {
            $(".high-light-title").css("top", parseInt(30 * $(this)[0].dataset.id + 45) + "px")
            $('body, html').animate({
                scrollTop: titlesOffsetTop[$(this)[0].dataset.id]
            }, 300);
        });
    }

    //设置目录高亮显示
    function checkHignLightPos() {
        var scrollTop = document.documentElement.scrollTop;
        if (scrollTop < titlesOffsetTop[0]) {
            $(".high-light-title").hide();
        } else {
            $(".high-light-title").show();
        }
    }

    //回到顶部
    $("#backTop").on("click", function () {
        console.log("top")
        $('body,html').animate({
            scrollTop: 0
          },
          500);
          return false;
    })
};