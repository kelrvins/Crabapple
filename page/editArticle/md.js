//初始化页面
function init() {
	$("#editBox").pasteUploadImage();
	//全屏
	$("#fullcreenBtn").on("click", function () {
		$(".markdown-wrap").toggleClass("be-fullscreen")
		if ($(".markdown-wrap").hasClass("be-fullscreen")) {
			$("#fullcreenBtn").addClass("icon-narrow").removeClass("icon-fullscreen")
		} else {
			$("#fullcreenBtn").addClass("icon-fullscreen").removeClass("icon-narrow")
		}
	})

	var textarea = document.getElementsByTagName('textarea')[0];
	var originText = textarea.value;
	var markdownText = document.getElementsByClassName('markdown-text')[0];
	//页面加载后，先解析textarea里原本的内容
	markdownText.innerHTML = markdownParse(originText);
	//在textarea里输入时，实时解析内容
	textarea.oninput = function (e) {
		markdownText.innerHTML = markdownParse(e.target.value);
	}
	//修复tab键不能缩进的bug
	textarea.onkeydown = function (e) {
		if (e.keyCode == 9) {
			e.preventDefault();
			var indent = '    ';
			var start = this.selectionStart;
			var end = this.selectionEnd;
			var selected = window.getSelection().toString();
			selected = indent + selected.replace(/\n/g, '\n' + indent);
			this.value = this.value.substring(0, start) + selected + this.value.substring(end);
			this.setSelectionRange(start + indent.length, start + selected.length);
		}
	}
	textarea.addEventListener("scroll", srocllEdit)
	markdownText.addEventListener("scroll", srocllPre)

	function srocllEdit() {
		markdownText.removeEventListener("scroll", srocllPre)
		var _editRealHeight = $("#editBox")[0].scrollHeight
		var _editClientHeight = $("#editBox")[0].clientHeight
		var _editScrollTop = Math.round($("#editBox").scrollTop())
		var _editPercentTop = (_editScrollTop / _editRealHeight).toFixed(2)
		var _PreRealHeight = $("#preBox")[0].scrollHeight;
		var _PreClientHeight = $("#preBox")[0].clientHeight;
		// console.log(_editRealHeight, _editClientHeight, _editScrollTop)
		if (_editRealHeight <= _editClientHeight + _editScrollTop) {
			$("#preBox").scrollTop(_PreRealHeight + _PreClientHeight)
		} else {
			$("#preBox").scrollTop(_PreRealHeight * _editPercentTop)
			var _PreScrollTop = $("#preBox").scrollTop()
			var _PrePercentTop = (_PreScrollTop / _PreRealHeight).toFixed(2)
		}

		clearTimeout(timeout);
		var timeout = setTimeout(function () {
			markdownText.addEventListener("scroll", srocllPre)
		}, 300)
	}

	function srocllPre() {
		textarea.removeEventListener("scroll", srocllEdit)
		var _PreRealHeight = $("#preBox")[0].scrollHeight
		var _PreScrollTop = $("#preBox").scrollTop()
		var _PrePercentTop = (_PreScrollTop / _PreRealHeight).toFixed(2)

		var _editRealHeight = $("#editBox")[0].scrollHeight
		var _editScrollTop = Math.round($("#editBox").scrollTop())
		var _editPercentTop = (_editScrollTop / _editRealHeight).toFixed(2)
		$("#editBox").scrollTop(_PrePercentTop * _editRealHeight)
		// console.log(_editPercentTop, _PrePercentTop)
		clearTimeout(timeout);
		var timeout = setTimeout(function () {
			textarea.addEventListener("scroll", srocllEdit)
		}, 300)
	}
}

init();


function markdownParse(str) {
	var result = "";
	var lines = str.split('\n');
	var reader = {
		index: 0,
		length: lines.length,
		read: function () {
			if (this.eof()) {
				return;
			}
			return lines[this.index++];
		},
		nextLine: function () {
			return lines[this.index];
		},
		eof: function () {
			return this.index >= this.length;
		}
	}
	//没有读到最后一行时
	while (!reader.eof()) {
		var line = reader.read();
		var temporary = line;
		//读到空行
		if (line === "") {
			result += '\n';
			continue;
		}
		//非空行
		//解析段落文本
		var pReg = /^([\u4e00-\u9fa5_a-zA-Z0-9\S\s]+?)(:?\n|$)/;
		if (pReg.test(line)) {
			function parseP(pReg, line) {
				return line.replace(pReg, function (match, g1) {
					return "<p>" + g1 + "</p>";
				})
			}
			temporary = parseP(pReg, line);
		}
		//解析标题
		var headingReg = /^\s*(#{1,6})\s*([^\n]+?)\s*#*\s*(?:\n+|$)/;
		if (headingReg.test(line)) {
			function parseHeading(headingReg, line) {
				return line.replace(headingReg, function (match, g1, g2) {
					var headingLevel = g1.length;
					return "<h" + headingLevel + ">" + g2 + "</h" + headingLevel + ">";
				})
			}
			temporary = parseHeading(headingReg, line);
		}
		//解析分界线
		var hrReg = /^(\*{3,}|-{3,})$/;
		if (hrReg.test(line)) {
			function parseHr() {
				return "<hr></hr>"
			}
			temporary = parseHr();
		}
		//解析块级引用
		var blockquoteReg = /^\s*>\s+(.+?)$/;
		if (blockquoteReg.test(line)) {
			function parseBlockquote(blockquoteReg, line) {
				var quoteContent = line.match(blockquoteReg)[1] + "\n";
				while (!reader.eof()) {
					var next = reader.nextLine();
					if (blockquoteReg.test(next)) {
						quoteContent += next.match(blockquoteReg)[1] + "\n";
						reader.read();
					} else {
						break;
					}
				}
				return "<blockquote>" + quoteContent + "</blockquote>";
			}
			temporary = parseBlockquote(blockquoteReg, line);
		}
		//解析列表
		var listReg = [
			// ul
			/^(\s*)\-\s+(.+?)$/,
			// ol
			/^(\s*)\d+\.\s+(.+?)$/
		]
		if (listReg[0].test(line) || listReg[1].test(line)) { // 如果有列表标记
			function parseList(isOl, indent, line) {
				var listHtml = line ? ("<li>" + line.match(listReg[isOl])[2] + "</li>") : "";
				while (!reader.eof()) {
					var next = reader.nextLine();
					var reverse = 0;
					if (!listReg[isOl].test(next)) {
						if (listReg[(isOl + 1) % 2].test(next)) {
							reverse = 1;
						} else {
							break;
						}
					}
					var nextIndent = next.match(listReg[(isOl + (reverse ? 1 : 0)) % 2])[1].length;
					//用缩进距离判断是否有子列表
					if (nextIndent > indent) {
						listHtml += parseList(reverse ? (isOl + 1) % 2 : isOl, nextIndent);
					} else if (nextIndent == indent) {
						if (reverse) {
							listHtml += parseList(reverse ? (isOl + 1) % 2 : isOl, nextIndent);
						} else {
							listHtml += "<li>" + next.match(listReg[isOl])[2] + "</li>";
							reader.read();
						}
					} else {
						break;
					}
				}
				return "<" + (isOl === 0 ? 'u' : 'o') + "l>" + listHtml + "</" + (isOl === 0 ? 'u' : 'o') + "l>";
			}
			var isOl = listReg[0].test(line) ? 0 : 1;
			temporary = parseList(isOl, line.match(listReg[isOl])[1].length, line);
		}
		//解析代码块
		var codeReg = /^```$/;
		if (codeReg.test(line) != false) {
			function parseCode(codeReg, line) {
				var codeContent = '';
				while (!reader.eof() && reader.nextLine() != "```") {
					codeContent += reader.read() + '\n';
				}
				reader.read();
				return "<pre><code>" + codeContent + "</code></pre>"
			}
			temporary = parseCode(codeReg, line);
		}
		result += temporary;
	}

	//解析图片+链接+加粗+斜体+代码
	var imgReg = /!\[([^\[\]]+?)\]\(([^\(\)]+?)(\s*"(.+?)")*\)/gm;
	var linkReg = /\[([^\[\]]+?)\]\(([^\(\)]+?)(\s*"(.+?)")*\)/gm;
	var strongReg = /\*\*([^*]+?)\*\*/gm;
	var emReg = /\*([^*]+?)\*/gm;
	var inlineCodeReg = /`([^*]+?)`/gm;
	//在全文中直接替换
	function parseInline(str) {
		//解析图片
		str = str.replace(imgReg, function (match, g1, g2, g3, g4) {
			if (g4) {
				return "<img src=" + g2 + " alt=" + g1 + " title=" + g4 + "><span>" + g1 + "</span>";
			} else {
				return "<img src=" + g2 + " alt=" + g1 + "><span>" + g1 + "</span>";
			}
		})
		//解析链接
		str = str.replace(linkReg, function (match, g1, g2, g3, g4) {
			if (g4) {
				return "<a href=" + g2 + " title=" + g4 + ">" + g1 + "</a>";
			} else {
				return "<a href=" + g2 + ">" + g1 + "</a>";
			}
		})
		//解析强调
		str = str.replace(strongReg, function (match, g1) {
			return "<strong>" + g1 + "</strong>";
		})
		str = str.replace(emReg, function (match, g1) {
			return "<em>" + g1 + "</em>";
		})
		str = str.replace(inlineCodeReg, function (match, g1) {
			console.log("<code>" + g1 + "</code>")
			return "<code>" + g1 + "</code>";
		})
		return str;
	}
	result = parseInline(result);
	return result;
}