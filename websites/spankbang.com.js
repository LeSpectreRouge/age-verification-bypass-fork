/*
Copyright © 2026 🦊 helloyanis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

console.log("spankbang.com bypass script is running");
browser.webRequest.onBeforeRequest.addListener(
    async function (details) {
        console.log("Request intercepted:", details.url);

        const filter = browser.webRequest.filterResponseData(details.requestId);

        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();

        let response = '';
        filter.ondata = event => {
            response += decoder.decode(event.data, { stream: true });
        };

        filter.onstop = async () => {
            try {
                // Create node from the response text
                let parser = new DOMParser();
                let doc = parser.parseFromString(response, "text/html");

                // Remove the #safety-blur element
                doc.querySelector("#safety-blur")?.setAttribute("style", "display: none");

                // Remove the strong-blur class from every element that has it
                let strongBlurElements = doc.querySelectorAll(".strong-blur");
                strongBlurElements.forEach(el => {
                    el.classList.remove("strong-blur");
                });
                // Remove the "18+" label from thumbnails
                doc.querySelectorAll("div[data-testid='video-item']>a>picture>div").forEach(node=>node.remove())
                // Add empty constants for functions showAdvancedAgeVerification() and showAvRegistrationModal() to prevent the age verification modal from re-defining them and showing the modal again
                let script = doc.createElement("script");
                script.textContent = `
                    const showAdvancedAgeVerification = function() {}
                    const showAvRegistrationModal = function() {}
                `;
                doc.body.appendChild(script);
                // Serialize the modified HTML back to a string
                const modifiedHTML =  "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
                filter.write(encoder.encode(modifiedHTML));
                filter.close();
                //console.log("Modified HTML data:", modifiedHTML);
            } catch (error) {
                console.warn("Data is not valid HTML:", error);
                filter.write(encoder.encode(response));
                filter.close();
            }
        }

    },
    { urls: ["https://spankbang.com/*"], types: ["main_frame"] },
    ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
    async function (details) {
        console.log("Request intercepted:", details.url);
        // Block the request
        return { cancel: true };
    },
    { urls: ["https://spankbang.com/users/av-registration?*"]}, //Age verification modal (should never pop up, but block in case of site updates)
    ["blocking"]
);