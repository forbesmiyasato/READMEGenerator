(this.webpackJsonpreadme_generator=this.webpackJsonpreadme_generator||[]).push([[190],{267:function(e,a){!function(e){var a=e.languages.javadoclike={parameter:{pattern:/(^\s*(?:\/{3}|\*|\/\*\*)\s*@(?:param|arg|arguments)\s+)\w+/m,lookbehind:!0},keyword:{pattern:/(^\s*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,lookbehind:!0},punctuation:/[{}]/};Object.defineProperty(a,"addSupport",{value:function(a,n){"string"===typeof a&&(a=[a]),a.forEach((function(a){!function(a,n){var t="doc-comment",r=e.languages[a];if(r){var o=r[t];if(!o){var i={"doc-comment":{pattern:/(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,lookbehind:!0,alias:"comment"}};o=(r=e.languages.insertBefore(a,"comment",i))[t]}if(o instanceof RegExp&&(o=r[t]={pattern:o}),Array.isArray(o))for(var s=0,p=o.length;s<p;s++)o[s]instanceof RegExp&&(o[s]={pattern:o[s]}),n(o[s]);else n(o)}}(a,(function(e){e.inside||(e.inside={}),e.inside.rest=n}))}))}}),a.addSupport(["java","javascript","php"],a)}(Prism)}}]);
//# sourceMappingURL=190.d301e4be.chunk.js.map