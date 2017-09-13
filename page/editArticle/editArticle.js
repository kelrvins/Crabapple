$(document).ready(function () {

    $("#editTitle").on("change", function () {
        var title = $("#editTitle")[0].value.trim();
        console.log(title,getLength(title))
        if (getLength(title) > 80) {
            alert("标题过长，中文请保持在40字以内，英文80字")
        }
    })
    $("#editTags").on("change", function () {
        var tags = $("#editTags")[0].value;
        var tagsArr = tags.split(/[,_、|。.]/)
        var tagslength = tagsArr.length
        if (tagslength > 3) {
            alert("tag过多，请保持在3个以内,顿号“ 、 ”以区分")
        }
    })

    // 获取字符长度 字母1，汉字2
    function getLength(str) {
        var l = str.length;
        var blen = 0;
        for (i = 0; i < l; i++) {
            if ((str.charCodeAt(i) & 0xff00) != 0) {
                blen++;
            }
            blen++;
        }
        return blen
    }

    $("#postArticle").on("click", function () {
        var title = $("#editTitle")[0].value.trim;
        var tags = $("#editTags")[0].value;
        var tagsArr = tags.split(/[,_、|。/+-*/().]/)
        var tagslength = tagsArr.length
        var articleText = $("#preBox")[0].innerHTML;

        console.log(articleText)

        if (getLength(title) > 80) {
            alert("标题过长，请保持在40字以内")
            return
        }
        if (tagslength > 3) {
            alert("tag过多，请保持在3个以内,顿号“ 、 ”以区分")
            return
        }
        if (articleText.length < 10) {
            alert("文章内容过短，检查一下吧")
            return
        }
        $({
            type: "POST",
            url: "",
            data: {
                title: title,
                tagsArr: tagsArr,
                articleText: articleText
            },
            success: function (data, xhr) {
                if (xhr.status == 0) {
                    alert("发表成功")
                } else {

                }
            },
            error: function (xhr, type) {
                alert("error")
            }
        })
    })
})