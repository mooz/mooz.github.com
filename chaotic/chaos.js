function $(id) {
    return content.wrappedJSObject.document.getElementById(id);
}

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

        let imgData  = ctx.createImageData(this.width, this.height);
        imgData.data = this.data;

        ctx.putImageData(imgData, x || 0, y || 0);
    }
};

// ====================================================================== //

function real(x, y, a, b) {
    return [y + a * x, x * x + b];
}

function complex(x, y, a, b, c, d) {
    let xpow2 = x * x;
    let ypow2 = y * y;
    let k     = a * (xpow2 + ypow2) + b * x * (xpow2 - 3 * ypow2) + c;

    return [k * x + d * (xpow2 - ypow2), y * (k - 2 * d * x)];
}

const TYPE_REAL    = 0;
const TYPE_COMPLEX = 1;

function calcTable(type, width, height, loopCount, a, b, c, d) {
    let xMax = 1.8;
    let xMin = -xMax;
    let yMax = xMax;
    let yMin = xMin;

    let table = Array.apply(null, Array(width * height)).map(function () 0);

    let x, y;

    if (type === TYPE_REAL)
        [x, y] = [0.1, 0.0];
    else
        [x, y] = [0.1, 0.1];

    const wdiv2  = width / 2;
    const hdiv2  = height / 2;
    const xConst = width / (2.0 * xMax);
    const yConst = height / (2.0 * yMax);

    let pixX, pixY;

    let oldx, oldy;
    let xpow2, ypow2, k;

    for (let n = 0; n < loopCount; ++n)
    {
        // 1200
        // [x, y] = calculator(x, y, a, b, c, d);

        // 975
        oldx = x;
        oldy = y;

        if (type === TYPE_REAL)
        {
            x = y + a * oldx;
            y = oldx * oldx + b;
        }
        else
        {
            xpow2 = x * x;
            ypow2 = y * y;
            k     = a * (xpow2 + ypow2) + b * x * (xpow2 - 3 * ypow2) + c;

            x = k * oldx + d * (xpow2 - ypow2);
            y = oldy * (k - 2 * d * oldx);
        }

        if (x > xMin && x < xMax && y > yMin && y < yMax)
        {
            pixX = ~~(wdiv2 + xConst * x);
            pixY = ~~(hdiv2 + yConst * y);

            table[pixX + width * pixY]++;
        }
    }

    return table;
}

function table2imgSimple(table, width, height, saturation, baseRGB) {
    let [r, g, b] = baseRGB;
    let img = new Bitmap(width, height);

    let max = table[0];

    for (let i = 1; i < table.length; ++i)
        if (table[i] > max)
            max = table[i];

    let frac = max * (1 - saturation);

    let data = img.data;
    let dataPos  = 0;

    let tablePos = 0;

    let coef;
    let cr, cg, cb;

    for (let x = 0; x < width; ++x)
    {
        for (let y = 0; y < height; ++y)
        {
            coef = table[tablePos++] / frac;

            cr = ~~(r * coef);
            cg = ~~(g * coef);
            cb = ~~(b * coef);

            data[dataPos + 0] = cr > 255 ? 255 : cr;
            data[dataPos + 1] = cg > 255 ? 255 : cg;
            data[dataPos + 2] = cb > 255 ? 255 : cb;

            // data[dataPos + 0] = Math.min(parseInt(r * coef), 255);
            // data[dataPos + 1] = Math.min(parseInt(g * coef), 255);
            // data[dataPos + 2] = Math.min(parseInt(b * coef), 255);

            data[dataPos + 3] = 255;

            dataPos += 4;

            // img.put(x, y, [
            //             Math.min(parseInt(r * coef), 255),
            //             Math.min(parseInt(g * coef), 255),
            //             Math.min(parseInt(b * coef), 255),
            //             255
            //         ]
            //        );
        }
    }

    return img;
}

var canvas   = $("canvas-test");
var ctx      = canvas.getContext('2d');

const width  = 512;
const height = 512;

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

let beg, til;

beg = new Date();
// let tbl = calcTable(real, width, height, 100000, 0.33, -1.24);
let tbl = calcTable(TYPE_COMPLEX, width, height, 3000000, 1.05, 0.20, -1.92, 0.38);
til = new Date();

window.alert("calcTable :: " + (til - beg));

// , 0.847

beg = new Date();
let img = table2imgSimple(tbl, width, height, 0.847, [68, 83, 255, 100]);
til = new Date();

window.alert("table2imgSimple :: " + (til - beg));

img.context = ctx;
img.draw();
