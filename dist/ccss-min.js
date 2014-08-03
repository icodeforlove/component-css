/**
 * ccss.js v0.0.3
 */
var ccss=function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){function d(a){return a.replace(/([a-z][A-Z])/g,function(a){return a[0]+"-"+a[1]}).toLowerCase()}function e(a,b,c){var e=/\@component\s*([^\{]+|)\s*\{/,g=/^\s*(.+?)\s*$/gim;return k.replacements({source:b,head:e,open:"{",close:"}",replace:function(b,h){var i=h.match(e)[1].trim()||a;if(b=l(b,{autosemicolon:!0}),b=b.replace(g,"$1"),b=b.replace(/\}/g,"}\n"),b=f(d(i),b,c),b=l(b,{autosemicolon:!0,indent:c.spacing}),b=b.replace(/\n{2,}/g,"\n"),c.header){var j="/* Component CSS for "+i+" */\n";b=j+b}return b}})}function f(a,b,c){return b=g(a,b,c),b=i(a,b,c),b=j(a,b,c),b.trim()}function g(a,b,c){var d=/((?:[\@a-z0-9\-\_\.\:\*\#\>\[\]])(?:[a-z0-9\%\-\_\+\.\:\s\*\[\]\=\'\"\,\(\)\#\\\>\~]+)?)(?:\s+)?([\{\[])/gi,e=/^(?!.*state\:\:|\:|self)(\S+)(?!.*state\:\:)/,f=/\bself\b/,g=new RegExp("([#\\.])(?!"+c.prefix+")([a-z0-9\\-_]*)","ig");return b.replace(d,function(b,d){return d=d.split(",").map(function(b){return b=b.trim(),b=b.replace(e,"."+c.prefix+"component."+c.prefix+a+" $1"),b=b.replace(f,"."+c.prefix+"component."+c.prefix+a),b=h(a,b,c),b=b.replace(g,"$1"+c.prefix+a+"_$2"),b.trim()}),d.join(", ")+" {"})}function h(a,b,c){var d,e=/state\:\:(\S+)/;return b=b.replace(e,function(b,e){return e=e.split("::").map(function(b){return"."+c.prefix+a+"_state-"+b}),d=e.join(""),""}),d&&(b="."+c.prefix+"component."+c.prefix+a+d+" "+b),b}function i(a,b,c){var d=/^\s*(\:\S+)\s*\{/gim,e=k.matches({source:b,open:"{",close:"}"});return b.replace(d,function(b,d,f){for(var g=0;g<e.length;g++)if(f>=e[g].index&&f+b.length<=e[g].index+e[g].length)return b;return"."+c.prefix+"component."+c.prefix+a+d+" {"})}function j(a,b,c){var d=/^([\@a-z0-9\-\_\.\:\*\#][a-z0-9\-\_\.\:\s\*\[\]\=\'\"\,\(\)\#]*)(?:\s+)?:\s*(.+);$/gim,e="",f=k.matches({source:b,open:"{",close:"}"});return b=b.replace(d,function(a,b,c,d){for(var g=0;g<f.length;g++)if(d>=f[g].index&&d+a.length<=f[g].index+f[g].length)return a;return e+=b+": "+c+";\n",""}),e&&(b="."+c.prefix+"component."+c.prefix+a+" {\n"+e.trim()+"\n}\n"+b),b}var k=c(1),l=c(2);a.exports=function(a){if(a=a||{},a.prefix=a.prefix||"",a.spacing=a.spacing||"  ",a.header=void 0!==a.header?a.header:!0,!a.data)throw new Error('ComponentCSS: you must specify a "data" property');return e(a.name,a.data,{prefix:a.prefix,spacing:a.spacing,header:a.header})}},function(a,b){function c(a){if(a=a||{},!a.open)throw new Error('Balanced: please provide a "open" property');if(!a.close)throw new Error('Balanced: please provide a "close" property');this.head=a.head||a.open,this.balance=a.balance||!1,this.exceptions=a.exceptions||!1,this.close=a.close,this.open=a.open}c.prototype={escapeRegExp:function(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},matchContentsInBetweenBrackets:function(a){for(var b,c=this.head instanceof RegExp&&this.head.ignoreCase,d=this.head instanceof RegExp?this.head:new RegExp(this.escapeRegExp(this.head)),e=this.open instanceof RegExp?this.open:new RegExp(this.escapeRegExp(this.open)),f=this.close instanceof RegExp?this.close:new RegExp(this.escapeRegExp(this.close)),g=new RegExp(d.source+"|"+e.source+"|"+f.source,"g"+(c?"i":"")),h=[],i=null,j=0,k=!0;b=g.exec(a);){if(i||!b[0].match(d)||this.balance&&(!this.balance||j)?b[0].match(e)?j++:b[0].match(f)&&j--:(i=b,j=this.balance?j+1:1),this.balance&&0>j){if(k=!1,this.exceptions)throw new Error("Balanced: expected open bracket at "+b.index);break}null!==i&&0===j&&(h.push({index:i.index,length:b.index+b[0].length-i.index,head:i[0],tail:b[0]}),i=null)}if(this.balance){if(this.exceptions&&(!k||0!==j))throw new Error("Balanced: expected close bracket at "+(a.length-1));return k&&0===j?h:null}return h},replaceMatchesInString:function(a,b,c){for(var d=0,e=0;e<a.length;e++){var f=a[e],g=c(b.substr(f.index+d+f.head.length,f.length-f.head.length-f.tail.length),f.head,f.tail);b=b.substr(0,f.index+d)+g+b.substr(f.index+d+f.length,b.length-(f.index+d+f.length)),d+=g.length-f.length}return b},replaceMatchesInBetweenBrackets:function(a,b){var c=this.matchContentsInBetweenBrackets(a);return this.replaceMatchesInString(c,a,b)}},b.replaceMatchesInString=c.prototype.replaceMatchesInString,b.replacements=function(a){a=a||{};var b=new c({head:a.head,open:a.open,close:a.close,balance:a.balance,exceptions:a.exceptions});if(!a.source)throw new Error('Balanced: please provide a "source" property');if("function"!=typeof a.replace)throw new Error('Balanced: please provide a "replace" function');return b.replaceMatchesInBetweenBrackets(a.source,a.replace)},b.matches=function(a){var b=new c({head:a.head,open:a.open,close:a.close,balance:a.balance,exceptions:a.exceptions});if(!a.source)throw new Error('Balanced: please provide a "source" property');return b.matchContentsInBetweenBrackets(a.source)}},function(a,b){!function(){"use strict";function c(a,b){function c(a){return" "===a||"\n"===a||"	"===a||"\r"===a||"\f"===a}function d(a){return"'"===a||'"'===a}function e(a){return k>="a"&&"z">=k||k>="A"&&"Z">=k||k>="0"&&"9">=k||"-_*.:#[]".indexOf(a)>=0}function f(){var a;for(a=p;a>0;a-=1)v+=i.indent}function g(){v=s(v),w?v+=" {":(v+="\n",f(),v+="{"),"\n"!==l&&(v+="\n"),p+=1}function h(){var a;p-=1,v=s(v),v.length>0&&x&&(a=v.charAt(v.length-1),";"!==a&&"{"!==a&&(v+=";")),v+="\n",f(),v+="}",j.push(v),v=""}var i,j,k,l,m,n,o,p,q,r,s,t=0,u=a.length,v="",w=!0,x=!1;for(i=arguments.length>1?b:{},"undefined"==typeof i.indent&&(i.indent="    "),"string"==typeof i.openbrace&&(w="end-of-line"===i.openbrace),"boolean"==typeof i.autosemicolon&&(x=i.autosemicolon),s=String.prototype.trimRight?function(a){return a.trimRight()}:function(a){return a.replace(/\s+$/,"")},o={Start:0,AtRule:1,Block:2,Selector:3,Ruleset:4,Property:5,Separator:6,Expression:7,URL:8},p=0,n=o.Start,r=!1,j=[],a=a.replace(/\r\n/g,"\n");u>t;)if(k=a.charAt(t),l=a.charAt(t+1),t+=1,d(q))v+=k,k===q&&(q=null),"\\"===k&&l===q&&(v+=l,t+=1);else if(d(k))v+=k,q=k;else if(r)v+=k,"*"===k&&"/"===l&&(r=!1,v+=l,t+=1);else if("/"!==k||"*"!==l){if(n===o.Start){if(0===j.length&&c(k)&&0===v.length)continue;if(" ">=k||k.charCodeAt(0)>=128){n=o.Start,v+=k;continue}if(e(k)||"@"===k){if(m=s(v),0===m.length)j.length>0&&(v="\n\n");else if("}"===m.charAt(m.length-1)||";"===m.charAt(m.length-1))v=m+"\n\n";else for(;;){if(l=v.charAt(v.length-1)," "!==l&&9!==l.charCodeAt(0))break;v=v.substr(0,v.length-1)}v+=k,n="@"===k?o.AtRule:o.Selector;continue}}if(n!==o.AtRule)if(n!==o.Block)if(n!==o.Selector)if(n!==o.Ruleset)if(n!==o.Property)if(n!==o.Separator)if(n!==o.Expression)n===o.URL&&")"===k&&v.charAt(v.length-1!=="\\")?(v+=k,n=o.Expression):v+=k;else{if("}"===k){h(),n=o.Start,p>0&&(n=o.Block);continue}if(";"===k){v=s(v),v+=";\n",n=o.Ruleset;continue}if(v+=k,"("===k&&"l"===v.charAt(v.length-2)&&"r"===v.charAt(v.length-3)&&"u"===v.charAt(v.length-4)){n=o.URL;continue}}else{if(!c(k)){v+=k,n=o.Expression;continue}d(l)&&(n=o.Expression)}else{if(":"===k){v=s(v),v+=": ",n=o.Expression,c(l)&&(n=o.Separator);continue}if("}"===k){h(),n=o.Start,p>0&&(n=o.Block);continue}v+=k}else{if("}"===k){h(),n=o.Start,p>0&&(n=o.Block);continue}if("\n"===k){v=s(v),v+="\n";continue}if(!c(k)){v=s(v),v+="\n",f(),v+=k,n=o.Property;continue}v+=k}else{if("{"===k){g(),n=o.Ruleset;continue}if("}"===k){h(),n=o.Start;continue}v+=k}else{if(e(k)){if(m=s(v),0===m.length)j.length>0&&(v="\n\n");else if("}"===m.charAt(m.length-1))v=m+"\n\n";else for(;;){if(l=v.charAt(v.length-1)," "!==l&&9!==l.charCodeAt(0))break;v=v.substr(0,v.length-1)}f(),v+=k,n=o.Selector;continue}if("}"===k){h(),n=o.Start;continue}v+=k}else{if(";"===k){v+=k,n=o.Start;continue}if("{"===k){m=s(v),g(),n="@font-face"===m?o.Ruleset:o.Block;continue}v+=k}}else r=!0,v+=k,v+=l,t+=1;return v=j.join("")+v}a.exports=b=c}()}]);