/**
 * @fileOverview REPL for MiSPLi
 * @name repl.js
 * @author mooz <stillpedant@gmail.com>
 * @license The MIT License
 */

(function () {
     const REPL_INPUT  = "repl-input";
     const REPL_OUTPUT = "repl-output";
     const REPL_RESULT = "repl-result";
     const REPL_ERROR  = "repl-error";

     var replHistory = [null];
     var histIndex   = 0;

     var replInputOriginalBG;
     var replInputWargingBG = "#580015";

     function $(id) { return document.getElementById(id); }

     function inputBoxKeyHandler(ev) {
         if (ev.keyCode === 14 || ev.keyCode === 13)
         {
             replEval(ev.target);
             return;
         }
         else if (ev.keyCode === 38 || ev.keyCode === 40)
         {
             // trail back history
             // 40 => down
             // 38 => up
             trailHistory(ev.keyCode === 38);
         }
         else
         {
             replHistory[0] = null;
         }

         var input = ev.target;

         if (!input.value || input.value[0] === "\\" || Mispli.syntaxChecker(input.value))
             input.style.backgroundColor = replInputOriginalBG;
         else
             input.style.backgroundColor = replInputWargingBG;
     }

     function trailHistory(back) {
         histIndex += back ? -1 : 1;

         if (histIndex < 0)
             histIndex = replHistory.length - 1;
         else if (histIndex >= replHistory.length)
             histIndex = 0;

         insertHistoryToInputArea();
     }

     function insertHistoryToInputArea() {
         var input = $("main-repl-input");

         if (replHistory[0] === null)
             replHistory[0] = input.value;

         input.value = replHistory[histIndex];
     }

     function setText(elem, text) {
         text.toString().split("\n").forEach(
             function (line, i) {
                 if (i) elem.appendChild(document.createElement('br'));
                 elem.appendChild(document.createTextNode(line));
             });

         return elem;
     }

     Mispli.print = function (txt) {
         echo(txt, REPL_OUTPUT);
     };

     function getScrollMaxY() { return window.scrollMaxY || document.documentElement.scrollHeight - document.documentElement.clientHeight; }

     function replInsertInputsAndResults(inputCode, blocks) {
         var scrollFrom;

         function gradPrinter (i) {
             if (i >= blocks.length)
                 return;

             var savedY = window.scrollY;

             echo(Mispli.sexpToStr(blocks[i]), REPL_INPUT);
             echo(Mispli.sexpToStr(Mispli.evalBlock(blocks[i])), REPL_RESULT);

             smoothScrollY(savedY, getScrollMaxY(), function () {
                               window.setTimeout(function () { gradPrinter(i + 1); }, 500);
                           });
         }

         gradPrinter(0);
     }

     function replEval(input) {
         var inputCode  = input.value;

         if (inputCode[0] === "\\")
         {
             var commands = {
                 "?" : ["Display this help", function () {
                            echo("COMMANDS", REPL_RESULT);
                            for (var k in commands)
                                Mispli.print("\\" + k + "\t" + commands[k][0]);
                        }],
                 "b" : ["Show builtin functions", function () { for (var k in Mispli.builtins) Mispli.print(k); }],
                 "m" : ["Show macros", function () { for (var k in Mispli.macros) Mispli.print(k); }],
                 "s" : ["Show special forms", function () { for (var k in Mispli.specials) Mispli.print(k); }],
                 "f" : ["Show global functions", function () {
                            for (var k in Mispli.globalEnv)
                            {
                                var sym = Mispli.globalEnv[k];
                                if (Mispli.hasSymbolType(sym, Mispli.SYM_FUNCTION))
                                    Mispli.print(sym.name + "\t" + Mispli.sexpToStr(Mispli.getSymbolValue(sym, Mispli.SYM_FUNCTION)));
                            }
                        }],
                 "v" : ["Show global variables", function () {
                            for (var k in Mispli.globalEnv)
                            {
                                var sym = Mispli.globalEnv[k];
                                if (Mispli.hasSymbolType(sym, Mispli.SYM_VARIABLE))
                                    Mispli.print(sym.name + "\t" + tos.sexpToStr(Mispli.getSymbolValue(sym, Mispli.SYM_VARIABLE)));
                            }
                        }],
                 "j" : ["Evaluate JavaScript Code", function (command) {
                            try
                            {
                                var result = eval(command.substring(2));
                                if (result)
                                    echo(result, REPL_RESULT);
                            }
                            catch (x) { echo(x, REPL_ERROR); }
                        }]
             };

             function unknown(cmd) {
                 Mispli.print("Unknown command `" + cmd + "'. Type \\? to see available commands");
             }

             echo(inputCode, REPL_INPUT);

             (commands[inputCode[1]] || { "1" : unknown })[1](inputCode);

             var savedY = window.scrollY;
             smoothScrollY(savedY, getScrollMaxY());
         }
         else
         {
             try
             {
                 var blocks  = Mispli.parse(inputCode, true);
                 replInsertInputsAndResults(inputCode, blocks);
             }
             catch (x)
             {
                 if (x.stack)
                     echo("js error:\n" + x + "\n" + x.stack, "repl-error", REPL_ERROR);
                 else
                     echo(x, "repl-error", REPL_ERROR);
             }
         }

         if (inputCode)
             replHistory.push(inputCode);
         histIndex = 0;

         input.value = "";
     }

     function echo(text, className) {
         var resultArea = $("main-repl-result-area");
         var textElem   = document.createElement("pre");
         textElem.setAttribute("class", className);
         setText(textElem, text);

         resultArea.appendChild(textElem);
     };

     var replScrollTimer = null;

     // http://piro.sakura.ne.jp/latest/blosxom/mozilla/xul/2009-04-08_tween.htm
     function smoothScrollY(from, to, callback) {
         if (window.scrollY !== from)
             window.scrollTo(from, window.scrollX);

         var delta = to - from;

         if (delta < 20)
         {
             window.scrollTo(to, window.scrollX);
             if (typeof callback === "function")
                 callback();
             return;
         }

         var duration  = Math.sqrt(delta / 50) * 200;
         var startTime = +new Date();

         if (replScrollTimer)
             window.clearInterval(replScrollTimer), replScrollTimer = null;

         replScrollTimer = window.setInterval(
             function () {
                 var progress = Math.min(1, (+new Date() - startTime) / duration);
                 var x = window.scrollX;
                 var y = (progress === 1) ? to : from + (delta * progress);

                 window.scrollTo(x, y);

                 if (progress === 1)
                 {
                     window.clearInterval(replScrollTimer);

                     if (typeof callback === "function")
                         callback();
                 }
             }, 16);
     }

     // ============================================================ //
     // Helper
     // ============================================================ //

     function createHelper(text, command) {
         var li = document.createElement("li");
         li.setAttribute("class", "main-repl-helper");
         setText(li, text);
         li.onclick = function () {
             var input = $("main-repl-input");
             input.value = command;
             replEval(input);
             input.focus();
         };
         return li;
     }

     function setUpHelperArea() {
         var ul = $("main-repl-helpers");

         [["Help", "\\?"],
          ["Builtin Functions", "\\b"],
          ["Macros", "\\m"],
          ["Special Forms", "\\s"],
          ["Global Functions", "\\f"],
          ["Global Variables", "\\v"]
         ].forEach(function (row) {
                       ul.appendChild(createHelper(row[0], row[1]));
                   });
     }

     // ============================================================ //
     // Snippets
     // ============================================================ //

     function createSnippet(text, command) {
         var li = document.createElement("li");
         li.setAttribute("class", "main-repl-snippet");
         setText(li, text);
         li.onclick = function () {
             var input = $("main-repl-input");
             input.value = command;
             replEval(input);
             input.focus();
         };
         return li;
     }

     function setUpSnippetsArea() {
         var ul = $("main-repl-snippets");

         [["Fibonatti", "(defun fib (n) (cond ((= n 0) 0) ((= n 1) 1) ((= n 2) 1) (t (+ (fib (1- n)) (fib (- n 2)))))) (fib 3) (fib 5) (fib 10)"],
          ["FizzBuzz", '(mapc \'print (mapcar (lambda (x) (cond ((= (% x 15) 0) "FizzBuzz") ((= (% x 5) 0) "Buzz") ((= (% x 3) 0) "Fizz") (t x))) (iota 100 1)))'],
          ["Lexical-Closure-Test", "(defun gen-counter (n) (lambda (&optional d) (setq n (+ n (or d 1))))) (setq counter (gen-counter 10)) (funcall counter) (funcall counter 10) (funcall counter 40) (funcall counter -20)"],
          ["Tak (very slow)", "(defun tak (x y z) (if (<= x y) y (tak (tak (1- x) y z) (tak (1- y) z x) (tak (1- z) x y)))) (time (tak 8 4 0))"]
         ].forEach(function (row) {
                       ul.appendChild(createSnippet(row[0], row[1]));
                   });
     }

     window.onload = function () {
         var input = $("main-repl-input");
         replInputOriginalBG = input.style.backgroundColor;
         input.addEventListener("keyup", inputBoxKeyHandler, false);

         Mispli.print("MiSPLi 0.1.3");
         Mispli.print("Input Lisp code and press `Enter' key.");
         Mispli.print("You can take back history by pressing `Up' and `Down' key.");
         Mispli.print("Type \\? to see available REPL commands.");

         setUpHelperArea();
         setUpSnippetsArea();
     };
 })();
