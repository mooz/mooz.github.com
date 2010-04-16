function $(id) { return document.getElementById(id); }

function setText(elem, text) {
    text.toString().split("\n").forEach(
        function (line, i) {
            if (i) elem.appendChild(document.createElement('br'));
            elem.appendChild(document.createTextNode(line));
        });

    // if ("innerText" in elem)
    //     elem.innerText = text;
    // else if ("textContent" in elem)
    //     elem.textContent = text;

    return elem;
}

function print(txt) {
    addResult(txt, "repl-output");
}

function dir2(obj) {
    var buf = [];
    for (k in obj)
        buf.push(k);
    alert(buf.join(""));
}

function replEval(input) {
    var inputCode = input.value;

    addInput("> " + inputCode);

    try {
        evalLisp(inputCode)
            .map(function (result) { return tos(result); })
            .forEach(function (str) { addResult(str); });
    } catch (x) {
        if (x.stack)
            addResult("js error ::\n" + x + "\n" + x.stack, "repl-error");
        else
            addResult("error ::" + x, "repl-error");
    }

    input.value = "";
}

function addInput(input) {
    var resultArea = $("main-repl-result-area");
    var inputElem  = document.createElement("p");
    inputElem.setAttribute("class", "repl-input");
    setText(inputElem, input);

    resultArea.appendChild(inputElem);
}

function addResult(result, className) {
    var resultArea = $("main-repl-result-area");
    var resultElem = document.createElement("p");
    resultElem.setAttribute("class", className || "repl-result");
    setText(resultElem, result);

    resultArea.appendChild(resultElem);
}

window.onload = function () {
    var input = $("main-repl-input");
    input.addEventListener(
        "keypress", function (ev) {
            if (ev.keyCode === 14 || ev.keyCode === 13)
                replEval(input);
        }, false
    );
};