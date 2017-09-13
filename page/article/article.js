$(document).ready(function () {
    //设置title
    document.title = $("#articleTitle").text();
    $("#articleDel").on("cilck", function (e) {
        console.log(e);
        // confirm("确认删除吗？")
    })
    console.log($("#articleDel"))
});