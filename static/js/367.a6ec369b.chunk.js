(this.webpackJsonpreadme_generator=this.webpackJsonpreadme_generator||[]).push([[367],{444:function(s,n){!function(s){var n=[/(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/.source,/<<-?\s*(\w+?)[ \t]*(?!.)[\s\S]*?[\r\n]\2/.source,/<<-?\s*(["'])(\w+)\3[ \t]*(?!.)[\s\S]*?[\r\n]\4/.source].join("|");s.languages["shell-session"]={info:{pattern:/^[^\r\n$#*!]+(?=[$#])/m,alias:"punctuation",inside:{path:{pattern:/(:)[\s\S]+/,lookbehind:!0},user:/^[^\s@:$#*!/\\]+@[^\s@:$#*!/\\]+(?=:|$)/,punctuation:/:/}},command:{pattern:RegExp(/[$#](?:[^\\\r\n'"<]|\\.|<<str>>)+/.source.replace(/<<str>>/g,(function(){return n}))),greedy:!0,inside:{bash:{pattern:/(^[$#]\s*)[\s\S]+/,lookbehind:!0,alias:"language-bash",inside:s.languages.bash},"shell-symbol":{pattern:/^[$#]/,alias:"important"}}},output:/.(?:.*(?:[\r\n]|.$))*/}}(Prism)}}]);
//# sourceMappingURL=367.a6ec369b.chunk.js.map