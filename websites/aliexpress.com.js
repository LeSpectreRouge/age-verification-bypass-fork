/*
Copyright © 2026 🦊 helloyanis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// This one is super clunky but works. It gets runned every time a new product is in view because they get loaded with the age restriction elements so I need to re-run the code every time to remove them (the whole page isn't rendered if you don't scroll)
console.log("Aliexpress bypass script is running");

browser.webRequest.onBeforeRequest.addListener(
    async function (details) {
        console.log("Request intercepted:", details.url);
        const ruleSelector = ".card-dsa-wrapper img";
        const styleRule = "filter: none !important; -webkit-filter: none !important;";

        const detection = await browser.scripting.executeScript({
            target: {
                tabId: details.tabId,
            },
            func: () => {
                console.log("INIT")
                // Check existing stylesheets
                for (const sheet of document.styleSheets) {
                    try {
                        for (const rule of sheet.cssRules) {
                            if (
                                rule.selectorText === ruleSelector &&
                                rule.style &&
                                rule.style.filter === "none" &&
                                rule.style.webkitFilter === "none"
                            ) {
                                return true;
                                break;
                            }
                        }
                    } catch (e) {
                        // Ignore inaccessible cross-origin stylesheets
                        continue;
                    }

                    if (found) break;
                }

                return false;
            }
        });

        const found = detection[0].result;



        // Add rule if not found
        if (!found) {
            browser.scripting.executeScript({
                target: {
                    tabId: details.tabId,
                },
                func: (ruleSelector, styleRule) => {
                    const style = document.createElement("style");
                    style.textContent = `
                    .card-dsa-wrapper img {
                       filter: none !important; -webkit-filter: none !important;
                    }
                    .dsa--visible--wrapper img {
                       filter: none !important; -webkit-filter: none !important;
                    }
                    `;
                    document.head.appendChild(style);
                }
            });

        }



        browser.scripting.executeScript({
            target: {
                tabId: details.tabId,
            },
            func: () => {
                console.log("Running Aliexpress bypass script on the page");
                // Popup on the product page
                document.querySelectorAll(".J_SAFETY_FILER_MODAL").forEach(elt => elt.style.display = "none")

                document.querySelectorAll(".card-dsa-wrapper").forEach(elt => elt.classList.remove("card-dsa-wrapper"))

                // Crossed eye icon in search results
                document.querySelectorAll("img[src='https://ae-pic-a1.aliexpress-media.com/kf/S082ae95bce89462b9548a1d53f222ab4p/72x72.png']").forEach(elt => elt.style.display = "none")

                // Blur on search results mobile
                document.querySelectorAll("div[data-anc='body']>div>div>div>div>div>div, div[data-spm='platformRecommendH5']>div>div>div").forEach(elt=>elt.style.display="none")

                // Remove the overlay over the products that opens the popup
                if (document.querySelector("#card-list")) {
                    for (const item of document.querySelector("#card-list").children) {
                        const wrapper = item.querySelector(":scope > div");
                        if (!wrapper) continue;

                        const divs = wrapper.querySelectorAll(":scope > div");
                        if (divs.length === 2) {
                            divs[1].style.display = "none";
                        }
                    }
                }

                // Recommended products on the product page
                if (document.querySelector(".slick-slide")) {
                    for (const item of document.querySelectorAll(".slick-slide")) {

                        const wrapper = item.querySelector(":scope > div > div > div");
                        if (!wrapper) continue;

						console.log(wrapper)

                        const divs = wrapper.querySelectorAll(":scope > div");
                        if (divs.length === 2) {
                            divs[1].style.display = "none";
                        }
                    }
                }
            }
        })




    },
    { urls: ["https://aplus.aliexpress.com/Product.Exposure.Event*", "https://assets.aliexpress-media.com/g/AWSC/fireyejs/*/fireyejs.js"] },
    []
)