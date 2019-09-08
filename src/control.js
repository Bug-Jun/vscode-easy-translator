const vscode = require('vscode');
const request = require('request');
const md5 = require('js-md5');
const languages = require('./languages');
const errorMsg = require('./errorMsg');
const sha256 = require("js-sha256").sha256;

//创建快速拾取器
const quickPick = vscode.window.createQuickPick();
quickPick.canSelectMany = false
quickPick.matchOnDescription = true
quickPick.matchOnDetail = true
quickPick.onDidAccept(() => {
	quickPick.busy = true
	let item = quickPick.selectedItems[0]
	// @ts-ignore
	if (typeof item.action === 'function') item.action()
})


//填充快速拾取器
const fillQuickPick = (items, title) => {
	quickPick.busy = false
	quickPick.value = ''
	quickPick.items = items
	quickPick.placeholder = title
	quickPick.show()
}

//发送翻译请求
const translate = (...arg) => {
    let type = vscode.workspace.getConfiguration().get('easyTranslator.API.type');
    switch(type){
        case "Google":
            googleTranslate(...arg);
            break;
        case "baidu":
            baiduTranslate(...arg);
            break;
        case "youdao":
            youdaoTranslate(...arg);
            break;
    }
}

const googleTranslate = (query, from, to, fn) => {
    console.log(encodeURI(`http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=${from}&tl=${to}&q=${query}`))
    //发送请求
    request.get({
        url: encodeURI(`http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=${from}&tl=${to}&q=${query}`)
    }, function(err, res, result){
        if(err){
            vscode.window.showErrorMessage('翻译出错了');
            console.log('错误', err.message);
        }else{
            console.log('错误', result);
        }
    });
}

const baiduTranslate = (query, from, to, fn) => {
    let appid = vscode.workspace.getConfiguration().get('easyTranslator.API.baiduAPPID');
    let key = vscode.workspace.getConfiguration().get('easyTranslator.API.baiduKey');
    if(!!appid && !!key){
        let url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
        let salt = Math.ceil(Math.random() * 100000000);
        let sign = md5(appid + query + salt + key);
        
        //发送请求
        request.get({
            url: encodeURI(`${url}?q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`)
        }, function(err, res, result){
            if(err){
                fn('翻译出错了');
                return;
            }else{
                try{
                    let msg = JSON.parse(result);
                    if(msg.error_code){
                        fn(`翻译出错了：${errorMsg.baidu[msg.error_code]}`);
                        return;
                    }else{
                        fn(false, {
                            type: "baidu",
                            msg
                        });
                    }
                }catch(error){
                    fn('翻译出错了');
                    return;
                }
            }
        });
    }else{
        fn('请设置百度翻译APPID以及密钥');
        return;
    }
}

const youdaoTranslate = (query, from, to, fn) => {
    let appid = vscode.workspace.getConfiguration().get('easyTranslator.API.youdaoAppKey');
    let key = vscode.workspace.getConfiguration().get('easyTranslator.API.youdaoKey');
    if(!!appid && !!key){
        let url = 'https://openapi.youdao.com/api';
        //生成随机字符串
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let salt = '';
        for (let i = 0; i < 16; i++) {
            salt += chars.charAt(Math.ceil(Math.random() * chars.length));
        }
        //时间戳
        let curtime = Math.round(new Date().getTime() / 1000) + "";
        //生成input
        let input = query;
        if (query.length > 20) {
            input = query.substr(0, 10) + query.length + query.substr(-10, 10);
        }
        let sign = sha256(appid + input + salt + curtime + key);

        //发送请求
        request.get({
            url: encodeURI(`${url}?q=${query}&from=${from}&to=${to}&appKey=${appid}&salt=${salt}&sign=${sign}&signType=v3&curtime=${curtime}`)
        }, function(err, res, result){
            if(err){
                console.log(1);
                fn('翻译出错了');
                return;
            }else{
                try{
                    let msg = JSON.parse(result);
                    if(msg.errorCode != '0'){
                        fn(`翻译出错了：${errorMsg.youdao[msg.errorCode]}`);
                        return;
                    }else{
                        fn(false, {
                            type: "youdao",
                            msg
                        });
                    }
                }catch(error){
                    fn('翻译出错了');
                    return;
                }
            }
        });
    }else{
        fn('请设置有道翻译应用ID以及应用密钥');
        return;
    }
}


//命令数组
const commands = {
    translate: () => {
        vscode.window.showInputBox({
            placeHolder: "翻译源文本",
            prompt: "请输入需要翻译的文本"
        }).then( text => {
            let sourceLanguages = getLanguages();
            fillQuickPick(sourceLanguages.map(item => ({
                label: item.label,
                description: item.des,
                action: () => {
                    let targetLanguages = getTarget(item, sourceLanguages);

                    fillQuickPick(targetLanguages.map(item_2 => ({
                        label: item_2.label,
                        description: item_2.des,
                        action: () => translate(text, item.tag, item_2.tag, showMessage)
                    })), '请选择目标语言');
                }
            })), '请选择源文本语言');
        });
    },
    target: () => {
        let targetLanguages = getLanguages();
        fillQuickPick(targetLanguages.map(item => ({
            label: item.label,
            description: item.des,
            action: () => {
                vscode.workspace.getConfiguration().update('easyTranslator.QuickTarget', item.tag, true);
                targetBtn.text = `快速翻译为${item.label}`;
                quickPick.hide();
            }
        })), '请选择快速翻译的目标语言');
    },
    api: () => {
        let apis = [{
            name: '百度翻译',
            code: 'baidu'
        },{
            name: '有道智云',
            code: 'youdao'
        }];
        fillQuickPick(apis.map(api => ({
            label: api.name,
            description: api.code,
            action: () => {
                vscode.workspace.getConfiguration().update('easyTranslator.API.type', api.code, true);
                quickPick.hide();
            }
        })), '请选择快速翻译的目标语言');
    },
    baidu: () => {
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            value: vscode.workspace.getConfiguration().get('easyTranslator.API.baiduAPPID'),
            placeHolder: "百度翻译APPID",
            prompt: "设置百度翻译API的APPID"
        }).then(appid => {
            if(typeof appid !== 'undefined'){
                vscode.workspace.getConfiguration().update('easyTranslator.API.baiduAPPID', appid, true);
            }
            vscode.window.showInputBox({
                ignoreFocusOut: true,
                value: vscode.workspace.getConfiguration().get('easyTranslator.API.baiduKey'),
                placeHolder: "百度翻译密钥",
                prompt: "设置百度翻译API的密钥"
            }).then(key => {
                if(typeof key !== 'undefined'){
                    vscode.workspace.getConfiguration().update('easyTranslator.API.baiduKey', key, true);
                }
            });
        });
    },
    youdao: () => {
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            value: vscode.workspace.getConfiguration().get('easyTranslator.API.youdaoAppKey'),
            placeHolder: "有道智云应用ID",
            prompt: "设置有道智云翻译API的应用ID"
        }).then(appid => {
            if(typeof appid !== 'undefined'){
                vscode.workspace.getConfiguration().update('easyTranslator.API.youdaoAppKey', appid, true);
            }
            vscode.window.showInputBox({
                ignoreFocusOut: true,
                value: vscode.workspace.getConfiguration().get('easyTranslator.API.youdaoKey'),
                placeHolder: "有道智云密钥",
                prompt: "设置有道智云翻译API的应用密钥"
            }).then(key => {
                if(typeof key !== 'undefined'){
                    vscode.workspace.getConfiguration().update('easyTranslator.API.youdaoKey', key, true);
                }
            });
        });
    },
    quick: () => {
        let target = vscode.workspace.getConfiguration().get('easyTranslator.QuickTarget');
        
        let document = vscode.window.activeTextEditor.document;
		let selection = vscode.window.activeTextEditor.selection;
        let text = document.getText(selection);
        translate(text, 'auto', target, showMessage);
    }
}

const showMessage = (err, data) => {
    if(!!err){
        vscode.window.showErrorMessage(err);
    }else{
        switch(data.type){
            case "baidu":
                let strArr = [];
                for (const key in data.msg.trans_result) {
                    strArr.push(data.msg.trans_result[key].dst);
                }
                vscode.window.showInformationMessage(strArr.join(';'));
                break;
            case "youdao":
                let basic = data.msg.basic;
                let info = '';
                if(basic && basic["explains"] && basic["explains"].length > 0){
                    info = basic["explains"].join('; ');
                    if(basic && basic["phonetic"]){
                        vscode.window.showInformationMessage('[' + basic["phonetic"] + ']  ' + info);
                    }else{
                        vscode.window.showInformationMessage(info);
                    }
                }else{
                    info = data.msg.translation.join('; ');
                    vscode.window.showInformationMessage(info);
                }
                break;
        }
    };
    quickPick.hide();
}

const showHove = text => {
    return new Promise(resolve  => {
        let result = '';
        let language = vscode.workspace.getConfiguration().get('easyTranslator.QuickTarget');
        translate(text, 'auto', language, (err, data) => {
            if(err){
                resolve(err);
            }else{
                switch(data.type){
                    case "baidu":
                        result += '**百度翻译**\n';
                        let arr = data.msg.trans_result.map( item => `- ${item.dst}`);
                        console.log(arr)
                        result += arr.join('\n');
                        break;
                    case "youdao":
                        result += '**有道智云**\n';
                        let translation = data.msg.translation.map( item => `- ${item}`);
                        result += translation.join('\n');
                        result += '\n\n';
                        if(data.msg['basic']){
                            let basic = data.msg['basic'];
                            result += '基本释义：\n';
                            if(basic['phonetic']){
                                result += `\n[${basic.phonetic}] ${text}\n`;
                            }
                            if(basic['explains']){
                                let explains = basic.explains.map( item => `- ${item}`)
                                result += explains.join('\n');
                                result += '\n\n';
                            }
                        }
                        if(data.msg['web']){
                            let web = data.msg['web'];
                            result += '网络释义：\n';
                            web.forEach(item => {
                                result += `- ${item.key} - ${item.value.join('、')}\n`;
                            });
                        }
                        break;
                }
                resolve(result);
            }
        });
    });
}

let provide = {
    async provideHover (document, position, token) {
        let range = document.getWordRangeAtPosition(position)
        let selection = vscode.window.activeTextEditor.selection
        let string = document.getText(selection) ? document.getText(selection) : range ? document.getText(range) : ""
        if(!string) return

        let result = await showHove(string);

        if(!!result){
            return new vscode.Hover(result);
        }
    }
}

//根据API获取语言列表
const getLanguages = () => {
    let type = vscode.workspace.getConfiguration().get('easyTranslator.API.type');
    let temp = [];
    languages.forEach(language => {
        if(language.tag[type]){
            temp.push({
                label: language.label,
                des: language.des,
                tag: language.tag[type],
                target: language.target[type],
            })
        }
    });
    return temp;
}

//根据所选语言获取目标语言
const getTarget = (item, sourceLanguages) => {
    let temp = [];
    sourceLanguages.forEach(language => {
        if((item.target.indexOf(language.label) > -1 || item.target == 'all') && (item.label !== language.label || item.label == '自动检测')){
            temp.push({
                label: language.label,
                des: language.des,
                tag: language.tag
            })
        }
    });
    return temp;
}

const labelToLanguage = () => {
    languages.forEach(language => {
        if(language == vscode.workspace.getConfiguration().get('easyTranslator.QuickTarget')){
            let type = vscode.workspace.getConfiguration().get('easyTranslator.API.type');
            return language.tag[type];
        }
    });
}

//创建状态栏项
const targetBtn = vscode.window.createStatusBarItem(2);
languages.forEach(language => {
    let type = vscode.workspace.getConfiguration().get('easyTranslator.API.type');
    if(language.tag[type] == vscode.workspace.getConfiguration().get('easyTranslator.QuickTarget')){
        targetBtn.text = `快速翻译为${language.label}`;
    }
});
targetBtn.tooltip = '选择快速翻译的目标语言';


const control = {
    activate: context => {
        Object.keys(commands).map(name => {
            context.subscriptions.push(vscode.commands.registerCommand(`translator.${name}`, commands[name]));
        });
        context.subscriptions.push(vscode.languages.registerHoverProvider('*', provide));
        
        targetBtn.command = 'translator.target';
        if(!targetBtn.text) targetBtn.text = '快速翻译为英语';
        targetBtn.show();
    }
}

module.exports = control