// C 코드 색칠 (가벼운 자체 구현)
(function () {
  var esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  var re = new RegExp([
    "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",                          // 1 주석
    "(#\\s*(?:include|define))",                                              // 2 전처리
    "(<[A-Za-z_.]+\\.h>)",                                                    // 3 헤더
    "(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')",          // 4 문자열
    "(\\b0[xX][0-9a-fA-F]+\\b|\\b\\d+(?:\\.\\d+)?[fFlLuU]*\\b)",              // 5 숫자
    "(\\b(?:int|char|short|long|float|double|void|unsigned|signed|const|size_t)\\b)", // 6 자료형
    "(\\b(?:return|if|else|switch|case|default|break|continue|while|for|do|sizeof|typedef|struct)\\b)", // 7 키워드
    "([A-Za-z_]\\w*)(?=\\s*\\()"                                              // 8 함수
  ].join("|"), "g");
  function str(t) {
    return '<span class="s">' + esc(t).replace(/\\.|%[-0-9.]*[a-zA-Z]+/g, function (m) { return '<span class="se">' + m + "</span>"; }) + "</span>";
  }
  function color(code) {
    var out = "", last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      var t = m[0];
      if (m[1]) out += '<span class="c1">' + esc(t) + "</span>";
      else if (m[2]) out += '<span class="cp">' + esc(t) + "</span>";
      else if (m[3]) out += '<span class="cpf">' + esc(t) + "</span>";
      else if (m[4]) out += str(t);
      else if (m[5]) out += '<span class="mi">' + t + "</span>";
      else if (m[6]) out += '<span class="kt">' + t + "</span>";
      else if (m[7]) out += '<span class="k">' + t + "</span>";
      else out += '<span class="nf">' + t + "</span>";
      last = m.index + t.length;
    }
    return out + esc(code.slice(last));
  }
  document.querySelectorAll("pre.hl code.language-c").forEach(function (el) {
    el.innerHTML = color(el.textContent);
  });
})();

// 코드 복사, 목차 현재 위치 표시
(function () {
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.closest(".codewrap").querySelector("code").innerText;
      var done = function () { btn.textContent = "복사됨"; setTimeout(function () { btn.textContent = "복사"; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
      else {
        var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done();
      }
    });
  });

  var links = document.querySelectorAll(".toc a");
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("on"); });
          var a = map[en.target.id]; if (a) a.classList.add("on");
        }
      });
    }, { rootMargin: "-20px 0px -70% 0px" });
    document.querySelectorAll(".prose h2[id]").forEach(function (h) { io.observe(h); });
  }
})();
