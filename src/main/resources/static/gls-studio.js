(function () {
    function startGLSIntro() {
        var intro = document.getElementById("glsStudioIntro");

        if (!intro) return;

        setTimeout(function () {
            intro.classList.add("glsStudioIntroHide");
            document.dispatchEvent(new Event("glsStudioIntroExit"));

            setTimeout(function () {
                intro.remove();
            }, 800);
        }, 2600);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startGLSIntro);
    } else {
        startGLSIntro();
    }
})();
