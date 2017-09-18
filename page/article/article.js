$(document).ready(function () {
    //设置title
    document.title = $("#articleTitle").text();
    $("#articleDel").on("click", function () {
        var _id=$(this).data("id")
        if(confirm("确认删除吗？")){
            $.ajax({
                type: "GET",
                url: "",
                data: _id,
                success: function (data) {
                    if (data[0] == 0) {
                        alert("删除成功")
                    } else {
                        alert("删除失败")
                    }
                },
                error: function (xhr, type) {
                    alert("error")
                }
            })
        }
    })
});