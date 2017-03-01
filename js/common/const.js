/**
 * 基础数据
 */

// 星期月份的中文
export let WEEK_CN = ['一','二','三','四','五','六','日'];
export let NUMBER_CN = ['一','二','三','四','五','六','七', '八', '九', '十', '十一', '十二'];

// 月份的大小
export let LEEP_MONTH = {
    1: true,
    2: false,
    3: true,
    4: false,
    5: true,
    6: false,
    7: true,
    8: true,
    9: false,
    10: true,
    11: false,
    12: true
};

export let DATE_UNITS = {
    yyyy: '年',
    MM: '月',
    dd: '日',
    week: '星期',
    HH: '时',
    mm: '分',
    ss: '秒'
};

// 时间的边界
export let NATURE_LIMITS = {
    yyyy: [false, false],
    MM: [1, 12],
    dd: [1, 12],
    HH: [0, 23],
    mm: [0, 59],
    ss: [0, 59]   
};

export let EVENTS = {
    'ACTION:MASK:CLICK': 'ACTION:MASK:CLICK'
};