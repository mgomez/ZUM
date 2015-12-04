var apiKey = "mwteuqmdy4crfdvmswvzwkpf";
var Productos = (localStorage.Productos === undefined) ? [] : JSON.parse(localStorage.Productos);
var Total = 0;
$(function (){
    ProductInfo();
    $("#scann").on("click", QRCode);
});

function ProductInfo () {
    var rows = [];
    $.Enumerable.From(Productos).ForEach(m => {
        rows.push($("<li>", {
            class: "collection-item",
            html: `<h3>${m.items[0].name}</h3><p>$${m.items[0].salePrice}</p><img src="${m.items[0].thumbnailImage}">`
        }));
        Total += Number(m.salePrice);
    });
    $("#Productos").html(rows);
}

function QRCode () {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");
    scanner.scan(function(result) {
        if (!result.cancelled) {
            call(result.text);
        }
    }, function(error) {
        console.log("Scanning failed: ", error);
    });
}

function call (number) {
    $.ajax({
            url: "http://api.walmartlabs.com/v1/items?apiKey={0}&upc={1}".format(apiKey,number),
            //url: "http://api.upcdatabase.org/json/6ee2e78a090274caaf946b79d836f1db/"+number,
            type: 'POST',
            dataType: 'jsonp',
            data: {},
            crossDomain: true,
        })
        .done(function(r) {
            console.log("success", r);
            if (!r.errors) {
                Productos.push(r);
                localStorage.Productos = JSON.stringify(Productos);
                ProductInfo();
            } else {
                alert("ERROR", r);
            }
        })
        .fail(function(err) {
            console.error("error", err);
        });
}
//****************************************************************//
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};