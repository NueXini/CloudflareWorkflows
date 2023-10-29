// NueXini

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        // 订阅链接
        let urls = [];

        switch (path.toLowerCase()) {
            case '/freenode':
                urls = [
                    'https://raw.githubusercontent.com/ripaojiedian/freenode/main/sub',
                    'https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub',
                    'https://sub.sharecentre.online/sub',
                    'https://sub.pmsub.me/base64',
                    'https://sub.yxjnode.com/sub',
                ];
                break;

            default:
                break;
        }

        return handleRequest(urls);
    }
};

var code = new CodecTransform();

async function handleRequest(urls) {
    try {
        const init = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            },
        };

        const responses = await Promise.all(urls.map(url => fetch(url, init)));
        const contents = await Promise.all(responses.map(response => response.text()));
        const nodes = await Promise.all(contents.map(text => handleLinks(text)));
        let result = code.base64_encode(nodes.join());
        return new Response(result,
            {
                headers: {
                    "Content-Type": "text/plain",
                }
            });

    } catch (error) {
        console.log(error);
        return new Response(error,
            {
                headers: {
                    "Content-Type": "text/plain",
                }
            });
    }
}

// 节点关键词
var keywords = [
    { cn: '香港/广港/深港', en: ['HK', 'HongKong', 'Hong Kong'] },
    { cn: '台湾/台北', en: ['TW', 'Taiwan', 'Tai wan'] },
    { cn: '日本/东京/大阪', en: ['JP', 'Japan'] },
    { cn: '新加坡/狮城', en: ['SG', 'Singapore'] },
    { cn: '美国/洛杉矶/硅谷', en: ['US', 'United States', 'America'] },
    { cn: '英国', en: ['UK', 'United Kingdom', 'Great Britain'] },
    { cn: '韩国/首尔', en: ['KR', 'Korea', 'Seoul'] },
    { cn: '朝鲜', en: ['South Korea', 'SouthKorea'] },
    { cn: '澳大利亚/澳洲', en: ['AU', 'Australia'] },
    { cn: '泰国', en: ['Thailand'] },
    { cn: '印度', en: ['IN', 'India'] },
    { cn: '俄罗斯', en: ['Russia'] },
    { cn: '荷兰', en: ['NL', 'Netherlands'] },
    { cn: '德国', en: ['DE', 'Germany'] },
    { cn: '加拿大', en: ['CA', 'Canada'] },
    { cn: '意大利', en: ['Italy'] },
    { cn: '阿根廷', en: ['Argentina'] },
    { cn: '法国/巴黎', en: ['France'] },
    { cn: '马来西亚', en: ['Malaysia'] },
    { cn: '墨西哥', en: ['Mexico'] },
    { cn: '澳门', en: ['Macao'] },
    { cn: '土耳其', en: ['Turkey'] },
    { cn: '巴基斯坦', en: ['Pakistan'] },
    { cn: '印度尼西亚', en: ['ID', 'Indonesia'] },
    { cn: '菲律宾', en: ['PH', 'Philippine'] },
    { cn: '越南', en: ['VietNam', 'Viet Nam'] },
    { cn: '柬埔寨', en: ['Cambodia'] },
    { cn: '乌克兰', en: ['Ukraine'] },
    { cn: '阿联酋', en: ['UAE', 'United Arab Emirates'] },
    { cn: '迪拜', en: ['Dubai'] },
    { cn: '卢森堡', en: ['LU', 'Luxembourg'] },
    { cn: '以色列', en: ['Israel'] },
    { cn: '瑞典', en: ['Sverige'] },
    { cn: '冰岛', en: ['Iceland'] },
    { cn: '巴西', en: ['Brazil'] },
    { cn: '西班牙', en: ['Spain'] },
    { cn: '埃及', en: ['Egypt'] },
    { cn: '尼日利亚', en: ['Nigeria'] },
    { cn: '其他', en: ['DP', 'BuyVM', 'SW', 'NNC'] },
];

const pattern = new RegExp(`(${keywords.map(kw => kw.cn.split('/').map(subkw => subkw.trim()).join('|') + '|' + kw.en.join('|')).join('|')})`);

function handleLinks(text) {
    let node = code.base64_decode(text).split("\n");
    let ret = '';
    for (const link of node) {
        // 将链接拆分成协议类型和其他部分
        let [protocol, rest] = link.split('://');
        // 对应协议匹配
        switch (protocol.toLocaleLowerCase()) {
            case "trojan":
            case "ss":
                let a = handleSS(rest);
                if (a) {
                    ret += `${protocol}://${a}\r\n`;
                }
                break;
            case "ssr":
                let b = handleSSR(rest);
                if (b) {
                    ret += `${protocol}://${b}\r\n`;
                }
                break;
            case "vmess":
                let c = handleVmess(rest);
                if (c) {
                    ret += `${protocol}://${c}\r\n`;
                }
                break;
            default:
                break;
        }
    }
    return ret;
}

function handleSS(rest) {
    if (rest) {
        const isPlugin = rest.indexOf("plugin");
        const isObfs = rest.indexOf("obfs");
        if ((isPlugin > 0 && isObfs > 0) || (isPlugin < 0 && isObfs < 0)) {
            const hashIndex = rest.lastIndexOf('#');
            if (hashIndex > 0) {
                let remark = '';
                remark = decodeURIComponent(rest.substring(hashIndex + 1));
                const matched = remark.match(pattern);
                if (matched) {
                    remark = matched[0];
                    return rest.substring(0, hashIndex + 1) + encodeURIComponent(remark);
                }
            }
        }
    }
}

function handleSSR(rest) {
    if (rest) {
        const a = code.base64_decode(rest);
        const text = '&remarks=';
        const hashIndex = a.lastIndexOf(text);
        if (hashIndex > 0) {
            let remark = '';
            remark = code.base64_decode(a.substring(hashIndex + text.length));
            const matched = remark.match(pattern);
            if (matched) {
                remark = matched[0];
                return code.base64_encode(a.substring(0, hashIndex + text.length) + code.base64_encode(remark));
            }
        }
    }
}

function handleVmess(rest) {
    if (rest) {
        const text = "remarks=";
        // ?remarks=
        const hashIndex = rest.indexOf(text);
        if (hashIndex > 0) {
            const endIndex = rest.indexOf("&", hashIndex);
            let remark = '';
            remark = decodeURIComponent(rest.substring(hashIndex + text.length, endIndex));
            const matched = remark.match(pattern);
            if (matched) {
                remark = matched[0];
                return rest.substring(0, hashIndex + text.length) + encodeURIComponent(remark) + rest.substring(endIndex);
            }
        } else {
            try {
                let json = JSON.parse(code.base64_decode(rest));
                const matched = json['ps'].match(pattern);
                if (matched) {
                    json['ps'] = matched[0];
                    return code.base64_encode(JSON.stringify(json));
                } else {
                    return '';
                }
            } catch (error) {
                return;
            }
        }
    }
}

function CodecTransform() {
    // private property 
    const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding 
    this.base64_encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this.utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    // public method for decoding 
    this.base64_decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this.utf8_decode(output);
        return output;
    }

    // UTF-8 encoding 
    this.utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    //  UTF-8 decoding 
    this.utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
