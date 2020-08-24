
import fetch from 'node-fetch';
import * as fs from 'fs';

let token = "";
let host = "";
let pageType = 1;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const get = (accessToken, url) => {
    let status = 0;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-PM-Token': accessToken
            },
        })
        .then(response => {
            status = response.status; 
            if (status == 200) {
                // console.log("request sucess");
                return response.json();
                // return response.json()
            } else {
                console.log("request failed");
                return response.text();
            }
        })
        .then(data => {
            if (status != 200) {
                // console.log(status, data, url);
                throw data
            } else {
                // console.log("success: ", data)
                resolve(data)
            }
        })
        .catch(ex => {
            console.log("error: ", ex)
            // resolve({
            //     succes: false
            // })
            reject(ex)
        })
    });
}

// let put = async function (url: string, token: string, data: any, dontExpectData?: boolean): Promise<string> {
//     let response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json',
//             'X-PM-Token': token
//         },
//         body: JSON.stringify(data)
//     });

//     // console.log('put', JSON.stringify(data));

//     if (response.status == 200) {
//         if (dontExpectData) {
//             return response.statusText;
//         }
//         else {
//             let json = await response.json();
//             return json;
//         }
//     } else {
//         console.log("Put failed:" + response.statusText, data.guid);
//         // console.log(JSON.stringify(data));
//         // process.exit();
//         return null;
//     }

// };

const post = (accessToken, url, body) => {
    let status = 0;
    return new Promise((resolve, reject) => {
        fetch(encodeURI(url), {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-PM-Token': accessToken
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            status = response.status; 
            if (status == 200) {
                // console.log("request sucess");
                return response.text();
                // return response.json()
            } else {
                console.log("request failed");
                return response.text();
            }
        })
        .then(data => {
            if (status != 200) {
                console.log(status, data, url);
                throw data
            } else {
                // console.log("success: ", data)
                resolve(data)
            }
        })
        .catch(ex => {
            console.log("error: ", ex)
            // resolve({
            //     succes: false
            // })
            reject(ex)
        })
    });
}

const put = (accessToken, url, body) => {
    let status = 0;
    return new Promise((resolve, reject) => {
        fetch(encodeURI(url), {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-PM-Token': accessToken
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            status = response.status; 
            if (status == 200) {
                // console.log("request sucess");
                return response.text();
                // return response.json()
            } else {
                console.log("request failed");
                return response.text();
            }
        })
        .then(data => {
            if (status != 200) {
                console.log(status, data, url);
                throw data
            } else {
                // console.log("success: ", data)
                resolve(data)
            }
        })
        .catch(ex => {
            console.log("error: ", ex)
            // resolve({
            //     succes: false
            // })
            reject(ex)
        })
    });
}

let getJson = async function (url, token) {

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-PM-Token': token
        }
    });

    if (response.status == 200) {
        let json = await response.json();
        return json;
    } else {
        console.log("Get failed:" + response.statusText);
        return null;
    }
};

let getTokenV2 = async function (baseUrl, username, tenantGuid) {

    let postData = {
        u: username,
        t: tenantGuid,
        dp: false
    };

    let response = await fetch(baseUrl + 'api/v2/auth/GetToken', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    let text = await response.text();
    return text;
};

let getToken = async function(host) {

    if (!process.env.PM_CREDENTIALS) {
        console.log("You need to set process.env.PM_CREDENTIALS");
        process.exit();
    }

    let parts = process.env.PM_CREDENTIALS.split('|');

    let username = parts[0];
    let userTenantGuid = parts[1];
    let baseUrl = host;
    const token = await getTokenV2(baseUrl, username, userTenantGuid);
    return token;
};

let loadPage = function (host, tenantGuid, guid, pageType, token){
    return new Promise((resolve, reject) => {
        if (tenantGuid && guid) {
            let url = host + 'api/v2/pagedata/GetPage/' + tenantGuid + '/' + guid + '?iov=true&pageType=' + (pageType || 1).toString();
            getJson(url, token)
                .then(result => {
                    resolve(result ? result.page : null);
                })
                .catch(reason => {
                    reject(reason);
                });
        }
        else {
            reject("bad request");
        }
    });
};

let addSymbols = async function(host, token, tenantGuid, pageGuid, pageType, symbols) {

    let body = {
        breadcrumbs: [], // only used for new pages
        forcePublish: false,
        lang: "se", // only used for new pages
        pageGuid: pageGuid,
        pageType: pageType,
        parentPageGuid: "", // only used for new pages
        symbols: JSON.stringify(symbols),
        tenantGuid: tenantGuid
    }
    
    let url = host + 'api/v2/symbols/add';
    let addPageResult = await post(token, url, body);
    console.log(addPageResult);
}


let loadFullPage = async function(host, token, tenantGuid, pageGuid) {
    let url = host + `api/v2/rest/pages/${pageGuid}/${tenantGuid}?pageType=1`;
    // console.log("url", url);
    let page = await get(token, url);
    return page;
}

let updatePageData = async function(host, token, tenantGuid, pageGuid, data) {
    let url = host + `api/v2/pagedata/updatepage/${tenantGuid}/${pageGuid}/1`;
    let updates = { "updates": [
        {
            "propPath": "properties.data",
            "value": data
        }
    ]};
    let updatePageResult = await post(token, url, updates);
    return updatePageResult;
}

let createFullPage = async function(host, token, page, newGuid) {

    let body = {
        ...page,
        guid:newGuid
    };

    delete body._id;
    let url = host + 'api/v2/rest/pages';
    let addPageResult = await post(token, url, body);
    // console.log(addPageResult);
    return addPageResult;
}

let updateFullPage = async function(host, token, page) {

    let url = host + 'api/v2/rest/pages';
    let updatePageResult = await put(token, url, page);
    // console.log(addPageResult);
    return updatePageResult;
}

const init = async (_host) => {
    token = await getToken(_host);
    host = _host;
    console.log("init done", host); 
}

const addPageLinkGuid = (page, text, stepsGuid, templateGuid) => {
    if (page && page.symbols) {
        let symbols = page.symbols; 
        let addUsersSymbol = templateGuid ? symbols.find((i) => i.pageLinkGuid == templateGuid) : symbols.find((i) => i.titles && i.titles.se == text);
        if (addUsersSymbol) {
            addUsersSymbol.pageLinkGuid = stepsGuid;
            console.log(`addPageLinkGuid ${stepsGuid}`);
        } else {
            console.log(`addPageLinkGuid ${stepsGuid} failed for ${text}`);
            // console.error("very bad, did not find page.symbol");
            // process.exit();
        }
    }    
}

const createModuleSymbols = (module) => {

    // fs.writeFileSync("./module.json", JSON.stringify(module, null, 2));

    console.log("module2", module);

    let symbols = module.rules.map((rule, index) => {
        let guid = uuidv4();
        return {
            guid: guid,
            symbolTypeGuid: "d2929ced-2465-4bd0-ad10-ac1af30e5aab",
            _t: "Shape",
            type: 0,
            x: 220 + (index%4)*300,  // +520
            y: 120 + Math.floor(index/4)*60,   // +50
            width: 280,
            height: 50,
            titles: {
                se: rule.title,
                uk: rule.title
            },
            properties: {
                external:{
                    css: rule.props
                }
            }
        }
    })

    // fs.writeFileSync("./shapes.json", JSON.stringify(module, null, 2));
    return symbols;
}

const createModules = async (modules, settings) => {

    for (var t=0;t<modules.length; t++) {

        let module = modules[t];

        console.log(module);
        // let moduleName = "alignContent";
        let moduleName = module.title;

        await createModule(moduleName, module, settings);
  
        if (!module) {
            console.log("Very bad, module is missing");
            process.exit();
        }
    }




}

const createModule = async (moduleName, module, settings) => {

    let result = { 
        success:false
    }
    console.log("createModule start");

    try {

        // let moduleName = "accessibility"; // "alignContent";

        console.log("loadFullPage - tailwind");
        const tailwindPage = await loadFullPage(host, token, settings.tenantGuid, settings.instancePage);
        // fs.writeFileSync("./tailwind.json", JSON.stringify(tailwindPage, null, 2));
        let moduleSymbol = tailwindPage.symbols.find(s => s.titles.uk == moduleName);
        console.log("found the symbol", moduleSymbol);

        const emptyPage = await loadFullPage(host, token, settings.tenantGuid, settings.templatePageGuid);

        let modulePage = emptyPage;
        let modulePageGuid = "";
        if (moduleSymbol.pageLinkGuid) {
            console.log("module exists");
            modulePage = await loadFullPage(host, token, settings.tenantGuid, moduleSymbol.pageLinkGuid);
            // fs.writeFileSync("./accessibility.json", JSON.stringify(tailwindPage, null, 2));
            // modulePage.symbols = [];
            modulePageGuid = moduleSymbol.pageLinkGuid;

            await updateFullPage(host, token, modulePage);

        } else {
            console.log("module does not exists");
            modulePage.parentGuid = settings.instancePage; 
            modulePage.titles.se = moduleName;
            modulePage.titles.uk = moduleName;
            modulePageGuid = moduleSymbol.guid;
            moduleSymbol.pageLinkGuid = moduleSymbol.guid;
            await updateFullPage(host, token, tailwindPage);
            await createFullPage(host, token, modulePage, modulePageGuid);
        }

        console.log("save module page without shapes");

        const shapes = createModuleSymbols(module);
        await addSymbols(host, token, settings.tenantGuid, modulePageGuid, pageType, shapes);

        return;

    } catch (ex) {
        console.error(ex);
    }

    return result;
}


let PMService = {
    init,
    createModules,
}

export {
    PMService
}
