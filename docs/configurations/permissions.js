/**
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
 */

const PERMISSIONS = document.getElementById("permissions");

// Checks the latest version of Taterzens
const versionCheck = new XMLHttpRequest();
versionCheck.onreadystatechange = () => {
    if (versionCheck.readyState == 4 && versionCheck.status == 200) { //
        let version = versionCheck.responseText;
        version = JSON.parse(version);
        version = version.tag_name;
        checkCache(version);
    }
};

versionCheck.open("GET", "https://api.github.com/repos/samolego/Taterzens/releases/latest", true);
versionCheck.send();


async function checkCache(version) {
    let cache = JSON.parse(localStorage.getItem("PermissionCache"));
    let CACHED_VERSION = JSON.parse(localStorage.getItem("TaterzensVersion"));
    if(cache == null || CACHED_VERSION != version) {
        fetchNewestPermissions(version);
    } else {
        PERMISSIONS.innerHTML = cache;
    }
}

async function fetchNewestPermissions(version) {
    const xhttp = new XMLHttpRequest();
    let processed = false;

    xhttp.onreadystatechange = () => {
        if(xhttp.responseText != "" && !processed) {
            processed = true;
            PERMISSIONS.innerHTML = "";
    
            let configText = xhttp.responseText;
            let i = j = 0;
            let level = -1;
    
            // Reading by lines
            while ((j = configText.indexOf("\n", i)) !== -1) {
                let line = configText.substring(i, j);
    
                if(line != "" && !line.includes("*") && !line.includes("@")) {
                    level += (line.match(/\{/g)  || []).length;
                    if(line.includes("public final String _comment")) {
                        // Comment line
                        const start = line.lastIndexOf(" = \"");
                        // + 7 to not include String & space
                        const COMMENT = document.createElement("SPAN");
                        COMMENT.style = "color: lightgreen;";
                        COMMENT.innerHTML = line.substring(start + 4, line.length - 2);
                        PERMISSIONS.appendChild(COMMENT);
                        PERMISSIONS.innerHTML += "\n";
                    } else if(line.includes("public static class ")) {
                        const SECTION = document.createElement("SPAN");
                        SECTION.style = "color: #2c84fa; font-size: large;";
    
                        let start = line.indexOf("public static class ");
                        let option = line.substring(start + 20, line.indexOf(" {")).toUpperCase();
    
                        SECTION.innerHTML = "    ".repeat(level - 1) + option;
    
                        PERMISSIONS.innerHTML += "\n";
                        PERMISSIONS.appendChild(SECTION);
                        PERMISSIONS.innerHTML += "\n";
                    } else if(line.includes("public final String ") && line.includes("=") && line.includes(";") && !line.includes("new")) {
                        // Probably an option line
                        let start = line.indexOf("public final String ");
                        let option = line.substring(start + 19, line.length - 1);
                        start = option.indexOf(" ");
    
                        option = option.substring(start + 1, option.length);
    
                        let spaceIndex = option.indexOf(" ");
    
                        const KEY = document.createElement("SPAN");
                        KEY.innerHTML = "    ".repeat(level) + option.substring(0, spaceIndex);
                        KEY.style = "color: cyan;";
    
                        let value = option.substring(spaceIndex, option.length);
    
                        PERMISSIONS.appendChild(KEY);
                        PERMISSIONS.innerHTML += value + "\n\n";
                    }
                    level -= (line.match(/\}/g)  || []).length;
                }
                i = j + 1;
            }

            localStorage.setItem("PermissionCache", JSON.stringify(PERMISSIONS.innerHTML));
            localStorage.setItem("TaterzensVersion", JSON.stringify(version));
        }
    };
    
    xhttp.open("GET", `https://raw.githubusercontent.com/samolego/Taterzens/${version}/common/src/main/java/org/samo_lego/taterzens/storage/PermissionList.java`, true);
    xhttp.send();
}