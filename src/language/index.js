import enLocale from './en'
import zhLocale from './zh_cn'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'
import elementEnLocale from 'element-plus/lib/locale/lang/en'

// 
const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    'zh_cn': {
        ...zhLocale,
        ...elementZhLocale
    }
}

export default messages;