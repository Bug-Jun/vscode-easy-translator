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
const translate = (query, from, to) => {
    let type = vscode.workspace.getConfiguration().get('easyTranslator.API.type');
    switch(type){
        case "Google":
            googleTranslate(query, from, to);
            break;
        case "baidu":
            baiduTranslate(query, from, to);
            break;
        case "youdao":
            youdaoTranslate(query, from, to);
            break;
    }
}

const googleTranslate = (query, from, to) => {
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

const baiduTranslate = (query, from, to) => {
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
                vscode.window.showErrorMessage('翻译出错了');
                quickPick.hide();
                return;
            }else{
                try{
                    let msg = JSON.parse(result);
                    if(msg.error_code){
                        vscode.window.showErrorMessage(`翻译出错了：${errorMsg.baidu[msg.error_code]}`);
                    }else{
                        let strArr = [];
                        for (const key in msg.trans_result) {
                            strArr.push(msg.trans_result[key].dst);
                        }
                        vscode.window.showInformationMessage(strArr.join(';'));
                    }
                    quickPick.hide();
                }catch(error){
                    vscode.window.showErrorMessage('翻译出错了');
                    quickPick.hide();
                }
            }
        });
    }else{
        vscode.window.showErrorMessage('请设置百度翻译APPID以及密钥');
        quickPick.hide();
    }
}

const youdaoTranslate = (query, from, to) => {
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
                vscode.window.showErrorMessage('翻译出错了');
                quickPick.hide();
                return;
            }else{
                try{
                    let msg = JSON.parse(result);
                    if(msg.errorCode != '0'){
                        vscode.window.showErrorMessage(`翻译出错了：${errorMsg.youdao[msg.errorCode]}`);
                    }else{
                        let basic = msg.basic;
                        let info = '';
                        if(basic && basic["explains"] && basic["explains"].length > 0){
                            info = basic["explains"].join('; ');
                            if(basic && basic["phonetic"]){
                                vscode.window.showInformationMessage('[' + basic["phonetic"] + ']  ' + info);
                            }else{
                                vscode.window.showInformationMessage(info);
                            }
                        }else{
                            info = msg.translation.join('; ');
                            vscode.window.showInformationMessage(info);
                        }
                    }
                    quickPick.hide();
                }catch(error){
                    vscode.window.showErrorMessage('翻译出错了');
                    quickPick.hide();
                }
            }
        });
    }else{
        vscode.window.showErrorMessage('请设置有道翻译应用ID以及应用密钥');
        quickPick.hide();
    }
}


//命令数组
const commands = {
    translate: () => {
        let document = vscode.window.activeTextEditor.document;
		let selection = vscode.window.activeTextEditor.selection;
        let text = document.getText(selection);

        if(!!text){
            let sourceLanguages = getLanguages();
            fillQuickPick(sourceLanguages.map(item => ({
                label: item.label,
                description: item.des,
                action: () => translate(text, 'auto', item.tag)
            })), '请选择目标语言');
        }else{
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
                            action: () => {
                                translate(text, item.tag, item_2.tag);
                            }
                        })), '请选择目标语言');
                    }
                })), '请选择源文本语言');
            });
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

const control = {
    activate: context => {
        const registration = Object.keys(commands).map(name => vscode.commands.registerCommand(`translator.${name}`, commands[name]));
        registration.forEach(command => context.subscriptions.push(command));
    }
}

module.exports = control