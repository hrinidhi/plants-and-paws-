(function () {
    "use strict";

    function createSplashScreen() {

        if (document.getElementById("pp-splash")) {
            return;
        }

        const splashHTML = `
            <div id="pp-splash">

                <div class="pp-splash-content">

                    <div class="pp-logo-mark">
                        <span class="pp-paw">🐾</span>
                        <span class="pp-leaf">🌿</span>
                    </div>

                    <div class="pp-brand">
                        <h1>Plants <span>&</span> Paws</h1>
                        <p>Care • Connect • Belong</p>
                    </div>

                    <div class="pp-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div class="pp-loading-text">
                        Growing a kinder community...
                    </div>

                </div>

            </div>
        `;

        document.body.insertAdjacentHTML(
            "afterbegin",
            splashHTML
        );

        const style = document.createElement("style");

        style.textContent = `
            #pp-splash {
                position: fixed;
                inset: 0;
                z-index: 9999999;

                display: flex;
                align-items: center;
                justify-content: center;

                background:
                    radial-gradient(
                        circle at center,
                        #f5fbf5 0%,
                        #e7f2e8 45%,
                        #d8e9db 100%
                    );

                opacity: 1;

                transition:
                    opacity 0.7s ease,
                    visibility 0.7s ease;
            }

            #pp-splash.pp-hide {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            .pp-splash-content {
                text-align: center;
                animation: ppAppear 0.8s ease both;
            }

            .pp-logo-mark {
                position: relative;

                width: 125px;
                height: 125px;

                margin: 0 auto 22px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                background: rgba(255,255,255,0.8);

                box-shadow:
                    0 15px 40px rgba(35,79,54,0.15);

                animation: ppFloat 2.5s ease-in-out infinite;
            }

            .pp-paw {
                font-size: 62px;
                position: relative;
                z-index: 2;

                animation: ppPaw 1.8s ease-in-out infinite;
            }

            .pp-leaf {
                position: absolute;
                right: 18px;
                top: 12px;

                font-size: 42px;

                transform: rotate(-20deg);

                animation: ppLeaf 2s ease-in-out infinite;
            }

            .pp-brand h1 {
                margin: 0;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                font-size: 38px;
                font-weight: 800;
                letter-spacing: -1px;

                color: #234f36;
            }

            .pp-brand h1 span {
                color: #7c9f75;
            }

            .pp-brand p {
                margin: 8px 0 0;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                font-size: 13px;
                letter-spacing: 4px;

                color: #617568;
            }

            .pp-loader {
                display: flex;
                justify-content: center;
                gap: 7px;

                margin-top: 32px;
            }

            .pp-loader span {
                width: 8px;
                height: 8px;

                border-radius: 50%;

                background: #234f36;

                animation:
                    ppDots 1.2s ease-in-out infinite;
            }

            .pp-loader span:nth-child(2) {
                animation-delay: 0.15s;
            }

            .pp-loader span:nth-child(3) {
                animation-delay: 0.3s;
            }

            .pp-loading-text {
                margin-top: 12px;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                font-size: 11px;

                color: #718278;

                opacity: 0.8;
            }

            @keyframes ppAppear {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.97);
                }

                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes ppFloat {
                0%, 100% {
                    transform: translateY(0);
                }

                50% {
                    transform: translateY(-7px);
                }
            }

            @keyframes ppPaw {
                0%, 100% {
                    transform: rotate(0deg);
                }

                50% {
                    transform: rotate(-7deg) scale(1.05);
                }
            }

            @keyframes ppLeaf {
                0%, 100% {
                    transform: rotate(-20deg);
                }

                50% {
                    transform: rotate(-8deg) translateY(-4px);
                }
            }

            @keyframes ppDots {
                0%, 80%, 100% {
                    transform: scale(0.6);
                    opacity: 0.4;
                }

                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @media (max-width: 600px) {

                .pp-logo-mark {
                    width: 105px;
                    height: 105px;
                }

                .pp-paw {
                    font-size: 52px;
                }

                .pp-leaf {
                    font-size: 34px;
                    right: 15px;
                    top: 10px;
                }

                .pp-brand h1 {
                    font-size: 30px;
                }

                .pp-brand p {
                    font-size: 10px;
                    letter-spacing: 3px;
                }
            }
        `;

        document.head.appendChild(style);

        // Prevent scrolling while splash is visible
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        setTimeout(function () {

            const splash =
                document.getElementById("pp-splash");

            if (!splash) {
                return;
            }

            splash.classList.add("pp-hide");

            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";

            setTimeout(function () {
                splash.remove();
            }, 750);

        }, 1800);
    }

    document.addEventListener("glsStudioIntroExit", createSplashScreen, { once: true });

})();