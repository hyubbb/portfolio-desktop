/*
 * 사례 페이지 공통: 한국어/일본어 전환.
 * 언어는 주소의 #lang=ja (포트폴리오 창에서 넘김) 또는 ?lang=ja 로 정한다.
 * - data-i="키"      → textContent
 * - data-i-html="키" → innerHTML (줄바꿈·코드 태그가 들어간 문장)
 */
(function () {
  var source = location.hash + "&" + location.search;
  var lang = /(^|[?&#])lang=ja(&|$)/.test(source) ? "ja" : "ko";

  function init(dict) {
    var table = dict[lang];
    function t(key, vars) {
      var text = table[key] != null ? table[key] : dict.ko[key] != null ? dict.ko[key] : key;
      if (vars) Object.keys(vars).forEach(function (k) { text = text.split("{" + k + "}").join(String(vars[k])); });
      return text;
    }
    document.documentElement.lang = lang;
    if (table.title) document.title = table.title;
    document.querySelectorAll("[data-i]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i")); });
    document.querySelectorAll("[data-i-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i-html")); });
    return t;
  }

  /** 로그 목록에 한 줄 추가 (최근 줄이 보이도록 스크롤) */
  function log(list, time, text, tone) {
    var li = document.createElement("li");
    var stamp = document.createElement("span");
    stamp.className = "t";
    stamp.textContent = time;
    var body = document.createElement("span");
    if (tone) body.className = tone;
    body.textContent = text;
    li.appendChild(stamp);
    li.appendChild(body);
    list.appendChild(li);
    list.scrollTop = list.scrollHeight;
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.Case = { lang: lang, init: init, log: log, reduceMotion: reduceMotion };
})();
