window.onload = function () {
    function $(id) {
        return document.getElementById(id);
    }

    // ====================================================================== //

    function Bitmap(width, height, ctx) {
        this.width   = width;
        this.height  = height;
        this.context = ctx;
        this.data    = new Array(width * height * 4);
    }

    Bitmap.prototype = {
        put: function (x, y, pixel) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                return;

            var pos = 4 * (x + y * this.width);
            for (var i = 0; i < 4; ++i)
                this.data[pos + i] = pixel[i];
        },

        get: function (x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                return null;

            var pixel = [];
            var pos   = x + y * this.width;
            for (var i = 0; i < 4; ++i)
                pixel.push(this.data[pos + i]);
            return pixel;
        },

        draw: function (x, y, ctx) {
            if (!ctx)
                ctx = this.context;

            var imgData  = ctx.createImageData(this.width, this.height);

            var n = this.data.length;
            while (n--)
                imgData.data[n] = this.data[n];

            ctx.putImageData(imgData, x || 0, y || 0);
        }
    };

    // ====================================================================== //

    const TYPE_REAL    = 0;
    const TYPE_COMPLEX = 1;

    function calcTable(callback, arg_type, width, height, loopCount, arg_a, arg_b, arg_c, arg_d) {
        var table = new Array(width * height);
        for (var i = 0; i < table.length; ++i)
            table[i] = 0;

        var x, y;

        if (arg_type === TYPE_REAL)
        {
            x = 0.1;
            y = 0.0;
        }
        else
        {
            x = 0.1;
            y = 0.1;
        }

        var interval = ~~(loopCount / Math.min(100, ~~(20 * (loopCount / 1000000))));
        var progress = 0;

        canceled = false;

        progress = 0;
        window.setTimeout(
            function () {
                var tbl = table;

                var local_x = x;
                var local_y = y;

                const xMax = 1.8;
                const xMin = -xMax;
                const yMax = xMax;
                const yMin = xMin;

                var w = width;
                var h = height;

                const wdiv2  = w / 2;
                const hdiv2  = h / 2;
                const xConst = w / (2.0 * xMax);
                const yConst = h / (2.0 * yMax);

                var a = arg_a, b = arg_b, c = arg_c, d = arg_d;
                var type = arg_type;

                var pixX, pixY;

                var oldx, oldy;
                var xpow2, ypow2, k;

                var to = progress + interval;

                for (var n = progress; n < to; ++n)
                {
                    oldx = local_x;
                    oldy = local_y;

                    if (type === TYPE_REAL)
                    {
                        local_x = oldy + a * oldx;
                        local_y = oldx * oldx + b;
                    }
                    else
                    {
                        xpow2 = oldx * oldx;
                        ypow2 = oldy * oldy;
                        k     = a * (xpow2 + ypow2) + b * oldx * (xpow2 - 3 * ypow2) + c;

                        local_x = k * oldx + d * (xpow2 - ypow2);
                        local_y = oldy * (k - 2 * d * oldx);
                    }

                    if (local_x > xMin && local_x < xMax && local_y > yMin && local_y < yMax)
                    {
                        pixX = ~~(wdiv2 + xConst * local_x);
                        pixY = ~~(hdiv2 + yConst * local_y);

                        tbl[pixX + w * pixY]++;
                    }
                }

                if (canceled)
                {
                    input.startButton.style.display = "inline";
                    input.stopButton.style.display  = "none";
                    input.progress.value = "Canceled";

                    return;
                }

                x = local_x;
                y = local_y;

                if (progress < loopCount)
                {
                    input.progress.value = ~~(100 * (progress / loopCount)) + " % done";
                    progress += interval;

                    window.setTimeout(arguments.callee, 0);
                }
                else
                {
                    input.startButton.style.display = "inline";
                    input.stopButton.style.display  = "none";
                    input.progress.value = "Done";

                    callback(table);
                }
            }, 1);
    }

    function table2imgSimple(table, width, height, saturation, r, g, b) {
        var img = new Bitmap(width, height);

        var max = table[0];
        var i;

        for (i = 1; i < table.length; ++i)
            if (table[i] > max)
                max = table[i];

        var frac = max * (1 - saturation);

        var data    = img.data;
        var dataPos = 0;

        var tablePos = 0;

        var coef;
        var cr, cg, cb;

        var len = width * height;

        for (i = 0; i < len; ++i)
        {
            coef = table[tablePos++] / frac;

            cr = ~~(r * coef);
            cg = ~~(g * coef);
            cb = ~~(b * coef);

            data[dataPos + 0] = cr > 255 ? 255 : cr;
            data[dataPos + 1] = cg > 255 ? 255 : cg;
            data[dataPos + 2] = cb > 255 ? 255 : cb;
            data[dataPos + 3] = 255;

            dataPos += 4;
        }

        return img;
    }

    // ====================================================================== //

    var spinButtons = {};

    function suspendSpinButtons() {
        var button;
        for (var name in spinButtons)
        {
            button = spinButtons[name];
            button.StopListening.call(button);
        }
    }

    function resumeSpinButtons() {
        var button;
        for (var name in spinButtons)
        {
            button = spinButtons[name];
            button.StartListening.call(button);
        }
    }

    function createSpin(name, options) {
        var spinCtrl = new SpinControl();

        spinButtons[name] = spinCtrl;

        setSpinValues(name, options);

        return spinCtrl;
    }

    function setSpinValues(name, options) {
        if (!(name in spinButtons))
            return;

        var spinCtrl = spinButtons[name];

        var getMethod = {
            "max"       : "SetMaxValue",
            "min"       : "SetMinValue",
            "value"     : "SetCurrentValue",
            "width"     : "SetWidth",
            "increment" : "SetIncrement"
        };

        for (var option in options)
        {
            if (option in getMethod)
                spinCtrl[getMethod[option]].call(spinCtrl, options[option]);
        }
    }

    function getSpinValue(name, option) {
        var getMethod = {
            "max"       : "GetMaxValue",
            "min"       : "GetMinValue",
            "value"     : "GetCurrentValue",
            "width"     : "GetWidth",
            "increment" : "GetIncrement"
        };

        if (!(name in spinButtons) || !(option in getMethod))
            return null;

        var spinCtrl = spinButtons[name];

        return spinCtrl[getMethod[option]].call(spinCtrl);
    }

    var input = {
        typeReal     : $("chaos-type-real"),
        typeComplex  : $("chaos-type-complex"),
        iteration    : $("chaos-iteration"),
        coefContainer: $("chaos-coef-container"),
        scale        : $("chaos-scale-pixel"),
        color        : $("chaos-color"),
        startButton  : $("chaos-start-button"),
        stopButton   : $("chaos-stop-button"),
        progress     : $("chaos-progress-meter"),
        presetlist   : $("chaos-preset-list")
    };

    var opts = {
        type       : null,
        scale      : null,
        iteration  : null,
        coefA      : null,
        coefB      : null,
        coefC      : null,
        coefD      : null,
        color      : null
    };

    var presets = {
        "Crystal" : {
            type       : TYPE_COMPLEX,
            coefA      : 1.05,
            coefB      : 0.20,
            coefC      : -1.92,
            coefD      : 0.38,
            color      : "4453ff",
            saturation : 0.91
        },

        "In the Ocean" : {
            type       : TYPE_REAL,
            coefA      : 0.33,
            coefB      : -1.21,
            color      : "5591E0",
            saturation : 0.90
        },

        "Red fraction" : {
            type       : TYPE_COMPLEX,
            coefA      : 1.0,
            coefB      : 0.17,
            coefC      : -1.86,
            coefD      : 0.36,
            color      : "FF2E2E",
            saturation : 0.94
        },

        "Nitro" : {
            type       : TYPE_COMPLEX,
            coefA      : 1.0,
            coefB      : 0.0,
            coefC      : -1.9,
            coefD      : 0.4,
            color      : "7AFF00",
            saturation : 0.926
        },

        "Pan2": {
            type       : TYPE_COMPLEX,
            coefA      : 0.8,
            coefB      : 0.2,
            coefC      : -1.75,
            coefD      : 0.33,
            color      : "F4FF5C",
            saturation : 0.76
        },

        "Toxic": {
            type       : TYPE_COMPLEX,
            coefA      : 1.02,
            coefB      : 0.14,
            coefC      : -1.83,
            coefD      : 0.36,
            color      : "F94AFF",
            saturation : 0.82
        }
    };

    var canceled = false;
    var canvas = $("chaos-canvas");
    var ctx    = canvas.getContext('2d');

    function setScale(scale) {
        canvas.setAttribute("width", scale);
        canvas.setAttribute("height", scale);
        input.scale.setAttribute("value", scale);
    }

    function setType(type) {
        opts.type = type;

        if (type === TYPE_COMPLEX)
        {
            input.typeReal.removeAttribute("checked");
            input.typeComplex.setAttribute("checked", "checked");

            spinButtons.coefC.GetContainer().style.display = "inline-block";
            spinButtons.coefD.GetContainer().style.display = "inline-block";
        }
        else
        {
            input.typeComplex.removeAttribute("checked");
            input.typeReal.setAttribute("checked", "checked");

            spinButtons.coefC.GetContainer().style.display = "none";
            spinButtons.coefD.GetContainer().style.display = "none";
        }
    }

    function setColor(color) {
        input.color.color.fromString(color);
    }

    function setValue(key, value) {
        input[key].value = value;
        opts[key] = value;
    }

    function getValue(key) {
        return input[key].value;
    }

    function getIntValue(key) {
        return ~~input[key].value;
    }

    function getDoubleValue(key) {
        return parseFloat(input[key].value);
    }

    function createPresetList() {
        var i = 0;
        for (var name in presets)
        {
            var item  = document.createElement("option");
            var label = document.createTextNode(name);
            item.appendChild(label);

            input.presetlist.appendChild(item);
        }
    }

    function setFromPreset(n) {
        var i = 0;
        var name;
        for (name in presets)
            if (n === i++) break;

        var settings = presets[name];

        setType(settings.type);

        setSpinValues("coefA", { value: settings.coefA });
        setSpinValues("coefB", { value: settings.coefB });
        setSpinValues("coefC", { value: settings.coefC || 0 });
        setSpinValues("coefD", { value: settings.coefD || 0 });

        setSpinValues("saturation", { value: settings.saturation });

        setColor(settings.color);
    }

    function word(col) {
        return ~~(col * 255);
    }

    // ====================================================================== //

    function init() {
        var nameID = {
            coefA : "chaos-coef-a",
            coefB : "chaos-coef-b",
            coefC : "chaos-coef-c",
            coefD : "chaos-coef-d"
        };

        for (var name in nameID)
        {
            var id = nameID[name];
            var coefButton = createSpin(name, {value: 0, max: 4.0, min: -4.0, width: "100", increment: 0.01});

            input.coefContainer.replaceChild(coefButton.GetContainer(), $(id));
            coefButton.StartListening();
        }

        var saturationButton = createSpin("saturation",
                                          {value: 0, max: 1.0, min: 0.0, width: "100", increment: 0.01});
        var saturationElem = $("chaos-saturation");
        saturationElem.parentNode.replaceChild(saturationButton.GetContainer(), saturationElem);
        saturationButton.StartListening();

        // ======================================== //

        setScale(400);
        setValue("iteration", 1000000);

        input.typeReal.onclick    = function () { setType(TYPE_REAL); };
        input.typeComplex.onclick = function () { setType(TYPE_COMPLEX); };

        input.startButton.onclick = function () { start(); };

        input.stopButton.onclick  = function () { canceled = true; };
        input.stopButton.style.display = "none";

        createPresetList();
        setFromPreset(0);

        input.presetlist.onchange = function () {
            setFromPreset(input.presetlist.selectedIndex);
        };
    }

    function start() {
        var scale = getIntValue("scale");
        setScale(scale);

        var iteration = getIntValue("iteration");
        setValue("iteration", iteration);

        var coefA = getSpinValue("coefA", "value");
        var coefB = getSpinValue("coefB", "value");
        var coefC = getSpinValue("coefC", "value");
        var coefD = getSpinValue("coefD", "value");

        var saturation = getSpinValue("saturation", "value");

        input.progress.value = "Started!";
        input.startButton.style.display = "none";
        input.stopButton.style.display  = "inline";

        // resumeSpinButtons();
        // suspendSpinButtons();

        var from = new Date();
        calcTable(function (table) {
                      var to = new Date();
                      // window.alert(to - from);
                      // window.status = (to - from) + " msec";

                      var rgb   = input.color.color.rgb;
                      var img   = table2imgSimple(table, scale, scale, saturation,
                                                  word(rgb[0]),
                                                  word(rgb[1]),
                                                  word(rgb[2]),
                                                  255);

                      input.progress.value = "";

                      img.draw(0, 0, ctx);
                  }, opts.type, scale, scale, iteration, coefA, coefB, coefC, coefD);
    }

    init();
};
