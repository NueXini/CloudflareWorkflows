// NueXini

addEventListener('fetch', event => {
  return event.respondWith(handleRequest());
});

async function handleRequest() {
  // 订阅链接
  let urls = [
    'https://raw.githubusercontent.com/ripaojiedian/freenode/main/sub',
    'https://raw.githubusercontent.com/zhanghua6666/Putian-Share/main/Permanent%20Subscription',
    'https://sub.sharecentre.online/sub',
    'https://sub.pmsub.me/base64'
  ];

  // Headers
  const init = {
    headers: {
      'content-type': 'text/plain',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    },
  };

  try {
    // 并发访问
    const requests = urls.map(url => fetch(url));
    const responses = await Promise.all(requests);
    // 获取每个响应的内容
    const contents = await Promise.all(responses.map(response => response.text()));
    // 将所有内容合并为一个字符串
    const result = contents.join('\n');
    // 进行分割
    let code = new CodecTransform();
    let node = code.base64_decode(result).split("\n");
    let ret = '';
    node.forEach(link => {
      // 将链接拆分成协议类型和其他部分
      let [protocol, rest] = link.split('://');
      // 对应协议匹配
      switch (protocol.toLocaleLowerCase()) {
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
    })

    ret = code.base64_encode(ret);
    return new Response(ret, init);

  } catch (error) {
    console.log("Error: " + error);
  }
}

// 节点关键词
var keywords = [
  { cn: '香港', en: ['HK', 'HongKong', 'Hong Kong'] },
  { cn: '台湾/台北', en: ['TW', 'Taiwan', 'Tai wan'] },
  { cn: '日本/东京/大阪', en: ['JP', 'Japan'] },
  { cn: '新加披/狮城', en: ['SG', 'Singapore'] },
  { cn: '美国/洛杉矶', en: ['US', 'United States'] },
  { cn: '英国', en: ['EN', 'United Kingdom'] },
  { cn: '韩国', en: ['KR', 'Korea', 'Seoul'] },
  { cn: '澳大利亚', en: ['AU', 'Australia'] },
  { cn: '泰国', en: ['TH', 'Thailand'] },
  { cn: '印度', en: ['India'] },
  { cn: '俄罗斯', en: ['RU', 'Russia'] },
  { cn: '荷兰', en: ['Netherlands'] },
  { cn: '德国', en: ['Germany'] },
];

function handleSS(rest) {
  if (rest) {
    const hashIndex = rest.lastIndexOf('#');
    let remark = '';
    if (hashIndex > 0) {
      remark = decodeURIComponent(rest.substring(hashIndex + 1));
      const pattern = new RegExp(`(${keywords.map(kw => kw.cn.split('/').map(subkw => subkw.trim()).join('|') + '|' + kw.en.join('|')).join('|')})`);
      const matched = remark.match(pattern);
      if (matched) {
        remark = matched[0];
        return rest.substring(0, hashIndex + 1) + encodeURIComponent(remark);
      } else {
        return '';
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function handleSSR(rest) {
  if (rest) {
    let code = new CodecTransform();
    const a = code.base64_decode(rest);
    const text = '&remarks=';
    const hashIndex = a.lastIndexOf(text);
    let remark = '';
    if (hashIndex > 0) {
      remark = code.base64_decode(a.substring(hashIndex + text.length));
      const pattern = new RegExp(`(${keywords.map(kw => kw.cn.split('/').map(subkw => subkw.trim()).join('|') + '|' + kw.en.join('|')).join('|')})`);
      const matched = remark.match(pattern);
      if (matched) {
        remark = matched[0];
        return code.base64_encode(a.substring(0, hashIndex + text.length) + code.base64_encode(remark));
      } else {
        return '';
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function handleVmess(rest) {
  if (rest) {
    const text = "remarks=";
    let code = new CodecTransform();
    // ?remarks=
    const hashIndex = rest.indexOf(text);
    if (hashIndex > 0) {
      const endIndex = rest.indexOf("&", hashIndex);
      let remark = '';
      remark = decodeURIComponent(rest.substring(hashIndex + text.length, endIndex));
      const pattern = new RegExp(`(${keywords.map(kw => kw.cn.split('/').map(subkw => subkw.trim()).join('|') + '|' + kw.en.join('|')).join('|')})`);
      const matched = remark.match(pattern);
      if (matched) {
        remark = matched[0];
        return rest.substring(0, hashIndex + text.length) + encodeURIComponent(remark) + rest.substring(endIndex);
      } else {
        return '';
      }
    } else {
      // json
      let json = JSON.parse(code.base64_decode(rest));
      if (json) {
        const pattern = new RegExp(`(${keywords.map(kw => kw.cn.split('/').map(subkw => subkw.trim()).join('|') + '|' + kw.en.join('|')).join('|')})`);
        const matched = json['ps'].match(pattern);
        if (matched) {
          json['ps'] = matched[0];
          return code.base64_encode(JSON.stringify(json));
        } else {
          return '';
        }
      } else {
        return '';
      }
    }
  } else {
    return '';
  }
}

function CodecTransform() {
  // private property 
  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
    var c = c1 = c2 = 0;
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
