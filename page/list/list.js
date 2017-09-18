$(document).ready(function () {
  $(".pagination-wrap").on("click", paginationOpera)
})
var totalPagina = $(".pagination li a")[$(".pagination li a").length - 1].innerHTML; //总页码
var pagina = 1; //页码  
function paginationOpera(e) {
  //点击页码
  if (e.target.nodeName == "A") {
    if (e && e.preventDefault) e.preventDefault();
    $(".node-wrap .node").remove();
    //页码
    if (e.target.parentNode.nodeName == "LI") {
      pagina = e.target.innerHTML;
    }
    //首页
    if (e.target.className == "first-page" && pagina > 1) {
      pagina = 1;
    }
    //尾页
    if (e.target.className == "last-page" && pagina != totalPagina) {
      pagina = totalPagina;
    }
    //上一页
    if (e.target.className == "preview-page" && pagina > 1) {
      pagina--;
    }
    //下一页
    if (e.target.className == "next-page" && pagina < totalPagina) {
      pagina++;
    }
    getData();
  }

  //获取数据
  function getData() {
    $("#loadingAnimate").show();
    $.ajax({
      type: 'GET',
      url: 'https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/huluList',
      data: pagina,
      datatype: 'json',
      success: function (data) {
        console.log(data)
        var result = ``;
        for (var i = 0; i < data.length; i++) {
          result += `<div class="node"><span class="node-title"><a href="/article/${data[i].articleID}">${data[i].title}</a>
        <div class="node-bg"></div></span><p class="node-content">${data[i].contents}</p><div class="node-info">
        <span class="node-submit"><a href="#" class="node-anthor">${data[i].author} </a>
        <span class="node-time">${data[i].res}</span></span><span class="node-tags">`
          for (var j = 0; j < data[i].tag.length; j++) {
            result += `<a href="#">${data[i].tag[j]}</a>`
            if (j != data[i].tag.length - 1) {
              result += `、`
            }
          }
          result += `</span></div></div>`
        }
        $("#loadingAnimate").hide();
        $(".node-wrap").append(result)
      },
      error: function (data) {
        alert("error")
      }
    })
    $('body,html').animate({
        scrollTop: 0
      },
      200);
  }
}