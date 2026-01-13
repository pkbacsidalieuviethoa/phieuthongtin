(function () {
    var ua = navigator.userAgent.toLowerCase();
    var isZalo = ua.indexOf("zalo") !== -1;

    if (isZalo) {
        sessionStorage.setItem("redirect_after_browser", window.location.href);
        window.location.replace("zalo-block.html");
    }
})();
