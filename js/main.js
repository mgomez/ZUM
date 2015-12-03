"use strict";
const apiKey = "mwteuqmdy4crfdvmswvzwkpf";
var Productos = (localStorage.Productos === undefined) ? [] : JSON.parse(localStorage.Productos);
var Total = 0;
$(()=>{
	ProductInfo();
	$("#scann").on("click", (e)=>{
		let code = QRCode();		
	});
});
function ProductInfo(){
	let rows = [];
	$.Enumerable.From(Productos).ForEach(m=>{
		rows.push($("<li>",{class:"collection-item", html:`<h3>${m.items[0].name}</h3><p>$${m.items[0].salePrice}</p><img src="${m.items[0].thumbnailImage}">`}));
		Total += Number(m.salePrice);
	});
	$("#Productos").html(rows);
}
function QRCode(){
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan( function (result) {        
            if(!result.cancelled){
                call(result.text);
            } 
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    }
function call(number){
	$.ajax({
		url: `http://api.walmartlabs.com/v1/items?apiKey=${apiKey}&upc=${number}`,
		type: 'GET',
		contentType: "application/json; charset=utf-8",
		dataType: 'jsonp',
		data: {},
		crossDomain: true,
	})
	.done(function(r) {
		console.log("success", r);
		Productos.push(r);
		localStorage.Productos = JSON.stringify(Productos);
		ProductInfo();
	})
	.fail(function(err) {
		console.error("error", err);
	});
}  
//****************************************************************//
$.fn.serializeObject = function()
{
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