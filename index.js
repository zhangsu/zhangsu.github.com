(function(){$(window).load(function(){var a,b,c,d;return b=$("#scroll"),a=$("#container .roll-container:last"),d=b.height(),c=a.height(),b.height(d),setTimeout(function(){return b.addClass("scrolling")}),$(".roll").click(function(){return b.height()>0?(b.height(0),a.addClass("collapsed")):(b.height(d),a.removeClass("collapsed"))})})}).call(this);