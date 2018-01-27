function resize(){
    var w = document.getElementsByTagName('body')[0].clientWidth;
    var h = document.getElementsByTagName('body')[0].clientHeight;
    var s = w/720;
    document.getElementById("main").style.height=h/s;
    document.getElementById("main").style.transform='scale3d('+s+','+s+',1)'
}
resize()
window.onresize=resize;
