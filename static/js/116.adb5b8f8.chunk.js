(this.webpackJsonpreadme_generator=this.webpackJsonpreadme_generator||[]).push([[116],{193:function(e,a){!function(e){e.languages.etlua={delimiter:{pattern:/^<%[-=]?|-?%>$/,alias:"punctuation"},"language-lua":{pattern:/[\s\S]+/,inside:e.languages.lua}},e.hooks.add("before-tokenize",(function(a){e.languages["markup-templating"].buildPlaceholders(a,"etlua",/<%[\s\S]+?%>/g)})),e.hooks.add("after-tokenize",(function(a){e.languages["markup-templating"].tokenizePlaceholders(a,"etlua")}))}(Prism)}}]);
//# sourceMappingURL=116.adb5b8f8.chunk.js.map