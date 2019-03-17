const vscode = require('vscode');
const request = require('./request/index');
const languages = require('./languages');

//创建快速拾取器
const quickPick = vscode.window.createQuickPick();
quickPick.canSelectMany = false
quickPick.matchOnDescription = true
quickPick.matchOnDetail = true
quickPick.onDidAccept(() => {
	quickPick.busy = true
	let item = quickPick.selectedItems[0]
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
    request.post({
        url: encodeURI(`https://fanyi.baidu.com/transapi?from=${from}&to=${to}&query=${query}`)
    }, function(err, res, result){
        if(err){
            vscode.window.showInformationMessage('翻译出错了：'+err.message);
            return;
        }
        try{
            let msg = JSON.parse(result);
            if(msg.error_code){
                vscode.window.showInformationMessage('翻译出错了：'+msg.error_msg);
            }else{
                let strArr = [];
                for (const key in msg.data) {
                    strArr.push(msg.data[key].dst);
                }
                vscode.window.showInformationMessage(strArr.join(','));
            }
        }catch(err){
            vscode.window.showInformationMessage(err.message);
        }
    })
}


//命令数组
const commands = {
    translate: () => {
        let document = vscode.window.activeTextEditor.document;
		let selection = vscode.window.activeTextEditor.selection;
        let text = document.getText(selection);
        if(!!text){
            fillQuickPick(languages.map(item => ({
                label: item.label,
                description: item.des,
                action: () => translate(text, 'auto', item.tag)
            })), '请选择目标语言');
        }else{
            vscode.window.showInputBox({
                placeHolder: "翻译源文本",
                prompt: "请输入需要翻译的文本"
            }).then( text => {
                let tempLanguages = [
                    {
                        label: '自动检测',
                        des: 'auto',
                        tag: 'auto'
                    }
                ];
                languages.forEach(language => {
                    tempLanguages.push(language);
                })
                fillQuickPick(tempLanguages.map(item => ({
                    label: item.label,
                    description: item.des,
                    action: () => {
                        fillQuickPick(languages.map(item_2 => ({
                            label: item_2.label,
                            description: item_2.des,
                            action: () => translate(text, item.tag, item_2.tag)
                        })), '请选择目标语言');
                    }
                })), '请选择源文本语言');
            });
        }

    }
}

const control = {
    activate: context => {
        const registration = Object.keys(commands).map(name => vscode.commands.registerCommand(`translator.${name}`, commands[name]));
        registration.forEach(command => context.subscriptions.push(command));
    }
}

module.exports = control