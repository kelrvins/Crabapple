(function ($) {
    var $this;
    var $ajaxUrl = 'https://www.easy-mock.com/mock/591c6b989aba4141cf25b708/step/ReturnData';
    $.fn.pasteUploadImage = function () {
        $this = $(this);
        $this.on('paste', function (event) {
            var filename, image, pasteEvent, text;
            pasteEvent = event.originalEvent;
            if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
                image = isImage(pasteEvent);
                if (image) {
                    event.preventDefault();
                    filename = getFilename(pasteEvent) || "image.png";
                    text = "![" + filename + "]+(uploading...)";
                    pasteText(text);
                    return uploadFile(image.getAsFile(), filename);
                }
            }
        });
        $this.on('drop', function (event) {
            var filename, image, pasteEvent, text;
            pasteEvent = event.originalEvent;
            if (pasteEvent.dataTransfer && pasteEvent.dataTransfer.files) {
                image = isImageForDrop(pasteEvent);
                if (image) {
                    event.preventDefault();
                    filename = pasteEvent.dataTransfer.files[0].name || "image.png";
                    text = "![" + filename + "]+(uploading...)";
                    pasteText(text);
                    return uploadFile(image, filename);
                }
            }
        });
    };

    pasteText = function (text) {
        var afterSelection, beforeSelection, caretEnd, caretStart, textEnd;
        caretStart = $this[0].selectionStart;
        caretEnd = $this[0].selectionEnd;
        textEnd = $this.val().length;
        beforeSelection = $this.val().substring(0, caretStart);
        afterSelection = $this.val().substring(caretEnd, textEnd);
        $this.val(beforeSelection + text + afterSelection);
        $this.get(0).setSelectionRange(caretStart + text.length, caretEnd + text.length);
        return $this.trigger("input");
    };
    isImage = function (data) {
        var i, item;
        i = 0;
        while (i < data.clipboardData.items.length) {
            item = data.clipboardData.items[i];
            if (item.type.indexOf("image") !== -1) {
                return item;
            }
            i++;
        }
        return false;
    };
    isImageForDrop = function (data) {
        var i, item;
        i = 0;
        while (i < data.dataTransfer.files.length) {
            item = data.dataTransfer.files[i];
            if (item.type.indexOf("image") !== -1) {
                return item;
            }
            i++;
        }
        return false;
    };
    getFilename = function (e) {
        var value;
        if (window.clipboardData && window.clipboardData.getData) {
            value = window.clipboardData.getData("Text");
        } else if (e.clipboardData && e.clipboardData.getData) {
            value = e.clipboardData.getData("text/plain");
        }
        value = value.split("\r");
        return value[0];
    };
    uploadFile = function (file, filename) {
        var formData = new FormData();
        formData.append('imageFile', file);

        $.ajax({
            url:  $ajaxUrl,
            data: formData,
            type: 'post',
            processData: false,
            contentType: false,
            success: function (data) {
                data = data[0]
                replaceLoadingTest(filename,data);
                pasteText("\n");
                // console.log(data);
            },
            error: function (xOptions, textStatus) {
                insertToTextArea(filename,"error");
            }
        });
    };
    insertToTextArea = function (filename, data) {
        $("#editBox")[0].value=$("#editBox")[0].value.replace("![" + filename + "]+(uploading...)","!["+filename+"]("+data+")")
        
    };
    replaceLoadingTest = function (filename,data) {
        $("#editBox")[0].value=$("#editBox")[0].value.replace("![" + filename + "]+(uploading...)","!["+filename+"]("+data+")")
        // console.log($("#editBox")[0].value.replace("![" + filename + "]+(uploading...)","!["+filename+"]("+data+")"));
        // return $this.val(function (index, val) {
        //     console.log(index,val)
        //     return val.replace(val,"!["+filename+"]("+data+")");
        // });
    };
})(jQuery);