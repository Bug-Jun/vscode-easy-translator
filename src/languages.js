const languages = [
	{
		label: '自动检测',
		des: 'Auto',
		tag: {
			Google: 'auto',
			baidu: 'auto',
			youdao: 'auto'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: 'all'
		}
	},
  	{
		label: '英语',
		des: 'English',
		tag: {
			Google: 'en',
			baidu: 'en',
			youdao: 'en'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文,日语'
		}
 	},
	{
		label: '中文',
		des: 'Chinese',
		tag: {
			Google: 'zh-CN',
			baidu: 'zh',
			youdao: 'zh-CHS'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: 'all'
		}
 	},
	{
		label: '繁体中文',
		des: 'Traditional Chinese',
		tag: {
			Google: 'zh-TW',
			baidu: 'cht'
		},
		target: {
			baidu: 'all'
		}
	},
	{
		label: '法语',
		des: 'French',
		tag: {
			Google: 'fr',
			baidu: 'fra',
			youdao: 'fr'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '日语',
		des: 'Japanese',
		tag: {
			Google: 'ja',
			baidu: 'jp',
			youdao: 'ja'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '英语,中文'
		}
	},
	{
		label: '西班牙语',
		des: 'Spanish',
		tag: {
			Google: 'es',
			baidu: 'spa',
			youdao: 'es'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '德语',
		des: 'German',
		tag: {
			Google: 'de',
			baidu: 'de',
			youdao: 'de'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '意大利语',
		des: 'Italian',
		tag: {
			Google: 'it',
			baidu: 'it',
			youdao: 'it'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '俄语',
		des: 'Russian',
		tag: {
			Google: 'ru',
			baidu: 'ru',
			youdao: 'ru'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '韩语',
		des: 'Korean',
		tag: {
			Google: 'ko',
			baidu: 'kor',
			youdao: 'ko'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '葡萄牙语',
		des: 'Portuguese',
		tag: {
			Google: 'pt',
			baidu: 'pt',
			youdao: 'pt'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '阿拉伯语',
		des: 'Arabic',
		tag: {
			Google: 'ar',
			baidu: 'ara',
			youdao: 'ar'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '阿尔巴尼亚语',
		des: 'Albanian',
		tag: {
			Google: 'sq'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '阿塞拜疆语',
		des: 'Azerbaijani',
		tag: {
			Google: 'az'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '爱尔兰语',
		des: 'Irish',
		tag: {
			Google: 'ga'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '爱沙尼亚语',
		des: 'Estonian',
		tag: {
			Google: 'et',
			baidu: 'est'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '白俄罗斯语',
		des: 'Belarusian',
		tag: {
			Google: 'be'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '保加利亚语',
		des: 'Bulgarian',
		tag: {
			Google: 'bg',
			baidu: 'bul'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '冰岛语',
		des: 'Icelandic',
		tag: {
			Google: 'is'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '波兰语',
		des: 'Polish',
		tag: {
			Google: 'pl',
			baidu: 'pl'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '波斯语',
		des: 'Persian',
		tag: {
			Google: 'fa'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '布尔语(南非荷兰语)',
		des: 'Afrikaans',
		tag: {
			Google: 'af'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '丹麦语',
		des: 'Denish',
		tag: {
			Google: 'da',
			baidu: 'dan'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '菲律宾语',
		des: 'Filipino',
		tag: {
			Google: 'tl'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '芬兰语',
		des: 'Finnish',
		tag: {
			Google: 'fi',
			baidu: 'fin'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '荷兰语',
		des: 'Dutch',
		tag: {
			Google: 'nl',
			baidu: 'nl'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '捷克语',
		des: 'Czech',
		tag: {
			Google: 'cs',
			baidu: 'cs'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '拉丁语',
		des: 'Latin',
		tag: {
			Google: 'la'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '罗马尼亚语',
		des: 'Romanian',
		tag: {
			Google: 'ro',
			baidu: 'rom'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
	label: '蒙古语',
		des: 'Mongolian',
		tag: {
			Google: 'mn'
		},
		target: {
			Google: 'all'
		}
	},
	{
		label: '瑞典语',
		des: 'Swedish',
		tag: {
			Google: 'sv',
			baidu: 'swe',
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '斯洛文尼亚语',
		des: 'Slovene',
		tag: {
			Google: 'sl',
			baidu: 'slo'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '泰语',
		des: 'Thai',
		tag: {
			Google: 'th',
			baidu: 'th'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '希腊语',
		des: 'Greek',
		tag: {
			Google: 'el',
			baidu: 'el'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '匈牙利语',
		des: 'Hungarian',
		tag: {
			Google: 'hu',
			baidu: 'hu'
		},
		target: {
			Google: 'all',
			baidu: 'all'
		}
	},
	{
		label: '越南语',
		des: 'Vietnamese',
		tag: {
			Google: 'vi',
			baidu: 'vie',
			youdao: 'vi'
		},
		target: {
			Google: 'all',
			baidu: 'all',
			youdao: '中文'
		}
	},
	{
		label: '印度尼西亚语',
		des: 'Indonesian',
		tag: {
			Google: 'id',
			youdao: 'id'
		},
		target: {
			Google: 'all',
			youdao: '中文'
		}
	},
	{
		label: '粤语',
		des: 'Cantonese',
		tag: {
			baidu: 'yue'
		},
		target: {
			baidu: 'all'
		}
	},
	{
		label: '文言文',
		des: 'Classical Chinese',
		tag: {
			baidu: 'wyw'
		},
		target: {
			baidu: 'all'
		}
	}
]

module.exports = languages