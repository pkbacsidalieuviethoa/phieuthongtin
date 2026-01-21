(function () {
    var ua = navigator.userAgent.toLowerCase();

    var isZalo =
        ua.includes("zalo") ||
        ua.includes("zaloandroid") ||
        ua.includes("zaloios") ||
        (ua.includes("android") && ua.includes("wv")) || // Android WebView
        (ua.includes("iphone") && !ua.includes("safari")); // iOS WebView

    if (isZalo) {
        sessionStorage.setItem("redirect_after_browser", window.location.href);
        window.location.href = "zalo-block.html";
    }
})();
