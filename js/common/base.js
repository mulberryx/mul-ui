/**
 * 基础数据
 */

// 中文
export var WEEK_CN = ['一','二','三','四','五','六','日'];
export var NUMBER_CN = ['一','二','三','四','五','六','七', '八', '九', '十', '十一', '十二'];

// 月份的大小
export var LEEP_MONTH = {
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

// 规定时间的边界
export var NATURE_LIMITS = {
    yyyy: [false, false],
    MM: [1, 12],
    dd: [1, 12],
    HH: [0, 23],
    mm: [0, 59],
    ss: [0, 59]   
};