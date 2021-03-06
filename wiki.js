function format(html){
    var fake = document.createElement("div")
    fake.innerHTML = html;
    [].map.call(fake.getElementsByTagName("a"), function(elem){
        elem.href = "http://en.wikipedia.org"+elem.getAttribute("href")
        elem.target = "_blank"});
    return fake.innerHTML.replace(/\[[^\]]*\]/, "");
}
function wikireq(pages){
    return new Promise(function(resolve, reject){
        var url = "http://en.wikipedia.org/w/api.php?" + [
            "action=query",
            "titles="+encodeURI(pages.join("|")),
            "format=json",
            "prop=revisions",
            //"rvsection=0",
            "rvprop=content",
            "rvparse=",
        ].join("&");
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(json){
                resolve(json)
            },
            error: function(err){
                reject(err)
            },
            type: "GET",
            headers: { 'Api-User-Agent': 'Geology Tree' }
        });
    });
};
function fulfill(obj){
    wikireq(Object.keys(obj)).then(function(res){
        console.log(res)
            pages = res.query.pages;
            for(var i in pages){
                if(pages[i].missing)continue;
                obj[pages[i].title].body = format(pages[i].revisions[0]["*"]);
            }
            rerender()
        },function(){console.log(arguments)})
}
