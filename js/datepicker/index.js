"use strict";

import { WEEK_CN, NUMBER_CN, LEEP_MONTH, NATURE_LIMITS } from '../common/base';
import Carousel from './carousel';

/*
 * 默认配置
 */
let defaultConfig = {
    id: "",                               // 初始化容器
    currDate: '',                         // 默认日期(时间戳，字符串，Date对象)
    beginDate: '1970/01/01 00:00',        // 开始日期
    endDate: '2100/01/01 00:00',          // 结束日期
    format: 'yyyy/MM/dd HH:mm:ss',        // 日期格式
    onChange: false
};

/**
 * 滚动日期组件
 * @Class
 */
class Datepicker {

    /**
     * 构造函数
     * @constructor
     * @param {object} 配置对象
     */
    constructor (config) {
        this.config = $.extend({}, defaultConfig, config);
        this.ele = document.getElementById(this.config.id);

        this.curr = {
            yyyy: false,
            MM: false,
            dd: false,
            week: false,
            HH: false,
            mm: false,
            ss: false        
        };

        this.currDate = null;

        this.wrappers = {};
        this.containers = {};
        this.items = {};
        this.units = {};
        this.scrollers = {};

        this.units = {
            yyyy: '年',
            MM: '月',
            dd: '日',
            week: '星期',
            HH: '时',
            mm: '分',
            ss: '秒'
        };

        this.currValue = {};

        this.activeItemNum = {
            yyyy: 5,
            MM: 5,
            dd: 5,
            week: 7,
            HH: 5,
            mm: 5,
            ss: 5
        };

        this.onChange = config.onChange;

        this.dateMark = null;
        this.init();
    }

    /**
     * 初始化
     * @return none
     */
    init () {
        this.basicData();

        this.createElements();
        this.initScrolls();

        this.synLimits();
        this.apply(false);
    }

    /**
     * 初始化基础参数
     * @return none
     */
    basicData () {
        let columnNumber = 0;

        if(this.config.format.indexOf('yyyy') !== -1) {
            this.wrappers.yyyy = true;
            columnNumber ++;
        }

        if(this.config.format.indexOf('MM') !== -1) { 
            this.wrappers.MM = true;
            columnNumber ++;
        }

        if(this.config.format.indexOf('dd') !== -1) { 
            this.wrappers.dd = true;     
            columnNumber ++; 
        }

        if(this.wrappers.yyyy && this.config.format.indexOf('MM') && this.config.format.indexOf('dd')) { 
            this.wrappers.week = true;
            columnNumber ++;
        }

        if(this.config.format.indexOf('HH') !== -1) { 
            this.wrappers.HH = true;      
            columnNumber ++;
        }

        if(this.config.format.indexOf('mm') !== -1) { 
            this.wrappers.mm = true;      
            columnNumber ++; 
        }

        if(this.config.format.indexOf('ss') !== -1) { 
            this.wrappers.ss = true;
            columnNumber ++;
        }

        this.columnWidth = parseInt(100 / columnNumber);
        this.columnYearWidth = 100 % columnNumber;

        this.limits = {
            yyyy: [false, false],
            MM: [1, 12],
            dd: [1, 31],
            HH: [0, 23],
            mm: [0, 59],
            ss: [0, 59]
        };

        if(!this.config.currDate) {
            this.currDate = new Date();
        } else if(this.config.currDate instanceof Date) {
            this.currDate = this.config.currDate;
        } else {
            this.currDate = new Date(this.config.currDate);
        }

        if(!this.config.beginDate) {
            this.beginDate = new Date(defaultConfig.beginDate);
        } else if(this.config.beginDate instanceof Date) {
            this.beginDate = this.config.beginDate;
        } else {
            this.beginDate = new Date(this.config.beginDate);
        }

        if(!this.config.endDate) {
            this.endDate = new Date(defaultConfig.endDate);
        } else if(this.config.endDate instanceof Date) {
            this.endDate = this.config.endDate;
        } else {
            this.endDate = new Date(this.config.endDate);
        }

        if( this.currDate < this.beginDate){
            this.currDate = this.beginDate;
        }else if(this.currDate > this.endDate){
            this.currDate = this.endDate;
        }

        if(this.beginDate) {
            this.limits.yyyy[0] = this.beginDate.getFullYear();
        }

        if(this.endDate) {
            this.limits.yyyy[1] = this.endDate.getFullYear();
        }
    }

    /**
     * 创建节点
     * @return none
     */
    createElements () {

        // 创建外层容器
        this.main = document.createElement('div');
        this.main.className = 'datepicker';

        this.dateMark = document.createElement('div');
        this.dateMark.className = 'date-mark'; 

        this.main.appendChild(this.dateMark);

        // 创建节点
        let units = this.units;

        let wrappers = this.wrappers;
        let containers = this.containers;

        let items = this.items;

        let _main = this.main;     // 容器

        for(let name in wrappers) {
            let _wrapper = wrappers[name] = document.createElement('div');
            _wrapper.className = 'wrapper ' + name;

            if(name ==='yyyy') {
                _wrapper.style.width = this.columnWidth + this.columnYearWidth + '%';
            } else {
                _wrapper.style.width = this.columnWidth + '%';
            }
            

            let _container = containers[name] = document.createElement('ul');
            _container.className = 'container';

            let ic = items[name];
            let len = name === 'week' ? 7 : 5;

            for(let i = 0; i < len; i ++ ) {
                let snap = document.createElement('li');
                snap.className = 'item item-' + (i + 1);

                let val = document.createElement('span');
                val.className = "val"; 

                let beginYear = this.beginDate.getFullYear();

                switch(name) {
                    case 'week':
                        val.innerHTML = WEEK_CN[i];
                        snap.setAttribute('data-value', i + 1);

                        break;
                    case 'dd':
                        val.innerHTML = i + 1;
                        snap.setAttribute('data-value', i + 1);

                        break;                    
                    case 'MM':
                        val.innerHTML = i + 1;
                        snap.setAttribute('data-value', i + 1);

                        break;
                    case 'yyyy':
                        val.innerHTML = beginYear + i;
                        snap.setAttribute('data-value', beginYear + i);

                        break;
                    case 'HH':
                        val.innerHTML = i + 1;
                        snap.setAttribute('data-value', i + 1);

                        break;                    
                    default:
                        val.innerHTML = '0' + i;
                        snap.setAttribute('data-value', i);

                        break;                                                        
                }

                let _unit = units[name];

                let unit = document.createTextNode(_unit);

                // 显示顺序不同
                if(name !== 'week') {
                    snap.appendChild(val);
                    snap.appendChild(unit);
                } else {
                    snap.appendChild(unit);
                    snap.appendChild(val);
                }

                _container.appendChild(snap);

                if(!this.items[name]) {
                    this.items[name] = [];
                }
            }

            _wrapper.appendChild(_container);
            _main.appendChild(_wrapper);
        }

        this.ele.replaceWith(_main);
    }

    /**
     * 初始化滚动列
     * @return none
     */
    initScrolls () {
        if(this.config.format.indexOf('yyyy') !== -1) {
            this.initYear();
        }

        if(this.config.format.indexOf('MM') !== -1) {
            this.initMonth();
        }

        if(this.config.format.indexOf('dd') !== -1) {
            this.initDay();
        }

        if(this.config.format.indexOf('HH') !== -1) {
            this.initHour();
        }

        if(this.config.format.indexOf('mm') !== -1) {
            this.initMinute();
        }

        if(this.config.format.indexOf('ss') !== -1) {
            this.initSecond();
        }
    }

    /**
     * 初始化年滚动
     * @return none
     */
    initYear () {
        let _this = this;

        let endYear = this.endDate.getFullYear();
        let beginYear = this.beginDate.getFullYear();
        
        let realitySnapNumber = endYear - beginYear;

        let snapHeight = this.containers['yyyy'].children[0].offsetHeight || 50;

        let options = {
            realitySnapNumber: realitySnapNumber,
            snap: ".item",
            wrapper: this.wrappers.yyyy,
            container: this.containers.yyyy,
            infinite: true,
            currMove: - snapHeight,
            onScrollEnd: function (idx) {
                _this.curr.yyyy = idx;
                _this.apply(true);
            },
            onSnapChange: function(idx, direction) {
                let items = _this.containers.yyyy.children;
                let first;
                let last;

                if(direction > 0) {
                    first = parseInt(items[0].getAttribute('data-value')) - 1;
                    last = parseInt(items[4].getAttribute('data-value')) - 1;
                } else {
                    first = parseInt(items[0].getAttribute('data-value')) + 1;
                    last = parseInt(items[4].getAttribute('data-value')) + 1;
                }

                let min = _this.limits.yyyy[0];
                let max = _this.limits.yyyy[1];

                let middleIndex = _this.getMiddleIndex('yyyy');
                let _direction = idx - middleIndex;

                if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                    for(let i = 0, len = _this.activeItemNum.yyyy; i < len; i ++) {
                        let item = items[i];
                        let val = item.getAttribute('data-value');

                        if(direction < 0) {
                            val ++;
                        } else {
                            val --;
                        }

                        item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                        item.setAttribute('data-value', val);                     
                    }

                    _this.curr.yyyy = middleIndex;

                    return true;
                } else {
                    items[_this.curr.yyyy].className = items[_this.curr.yyyy].className.replace(' active', '');
                    items[idx].className += ' active';

                    _this.curr.yyyy = idx;
                    return false;
                }
            },
            onBeforeScroll: function() {
                let snaps = _this.containers.yyyy.children;
                let len = snaps.length;

                for(let i = 0; i < len; i ++) {
                    snaps[i].className = snaps[i].className.replace(' active', '');
                }
            }
        };

        this.scrollers.yyyy = new Carousel(options);
    }


    /**
     * 初始化月份滚动
     * @return none
     */
    initMonth () {
        let _this = this;
        let snapHeight = this.containers.MM.children[0].offsetHeight || 50;

        let options = {
            realitySnapNumber: 12,
            snap: ".item",
            wrapper: this.wrappers.MM,
            container: this.containers.MM,
            infinite: true,
            currMove: - snapHeight,
            onScrollEnd: function (idx) {
                _this.curr.MM = idx;
                _this.apply(true);
            },
            onSnapChange: function (idx, direction) {
                let items = _this.containers.MM.children;
                let first;
                let last;

                if(direction > 0) {
                    first = parseInt(items[0].getAttribute('data-value')) - 1;
                    last = parseInt(items[4].getAttribute('data-value')) - 1;
                }  else {
                    first = parseInt(items[0].getAttribute('data-value')) + 1;
                    last = parseInt(items[4].getAttribute('data-value')) + 1;
                }

                let min = _this.limits.MM[0];
                let max = _this.limits.MM[1];

                let middleIndex = _this.getMiddleIndex('MM');
                let _direction = idx - middleIndex;

                if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                    for(let i = 0, len = _this.activeItemNum.MM; i < len; i ++) {
                        let item = items[i];
                        let val = item.getAttribute('data-value');

                        if(direction < 0) {
                            val ++;
                        } else {
                            val --;
                        }

                        item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                        item.setAttribute('data-value', val);                     
                    }

                    _this.curr.MM = middleIndex;

                    return true;
                } else {
                    items[_this.curr.MM].className = items[_this.curr.MM].className.replace(' active', '');
                    items[idx].className += ' active';

                    _this.curr.MM = idx;
                    return false;
                }
            },
            onBeforeScroll: function () {
                let snaps = _this.containers.MM.children;
                let len = snaps.length;

                for (let i = 0; i < len; i ++) {
                    snaps[i].className = snaps[i].className.replace(' active', '');
                }
            }
        };

        this.scrollers.MM = new Carousel(options);
    };

    /**
     * 初始化日期滚动
     * @return none
     */
    initDay () {
        let _this = this;
        let snapHeight = this.containers['dd'].children[0].offsetHeight || 50;

        let options = {
            realitySnapNumber: 31,
            snap: ".item",
            wrapper: this.wrappers.dd,
            container: this.containers.dd,
            infinite: true,
            currMove: - snapHeight,
            onScrollEnd: function (idx) {
                _this.curr.dd = idx;
                _this.apply(true);
            },
            onSnapChange: function (idx, direction) {
                let items = _this.containers.dd.children;
                let first;
                let last;

                if(direction > 0) {
                    first = parseInt(items[0].getAttribute('data-value')) - 1;
                    last = parseInt(items[4].getAttribute('data-value')) - 1;
                }  else {
                    first = parseInt(items[0].getAttribute('data-value')) + 1;
                    last = parseInt(items[4].getAttribute('data-value')) + 1;
                }

                let min = _this.limits.dd[0];
                let max = _this.limits.dd[1];

                let middleIndex = _this.getMiddleIndex('dd');
                let _direction = idx - middleIndex;

                if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                    for(let i = 0, len = _this.activeItemNum.dd; i < len; i ++) {
                        let item = items[i];
                        let val = item.getAttribute('data-value');

                        if(direction < 0) {
                            val ++;
                        } else {
                            val --;
                        }

                        item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                        item.setAttribute('data-value', val);                     
                    }

                    _this.curr.dd = middleIndex;

                    return true;
                } else {
                    items[_this.curr.dd].className = items[_this.curr.dd].className.replace(' active', '');
                    items[idx].className += ' active';

                    _this.curr.dd = idx;
                    return false;
                }
            },
            onBeforeScroll: function () {
                let snaps = _this.containers.dd.children;
                let len = snaps.length;

                for(let i = 0; i < len; i ++) {
                    snaps[i].className = snaps[i].className.replace(' active', '');
                }
            }
        };

        this.scrollers.dd = new Carousel(options);
    };

    /**
     * 初始化小时滚动
     * @return none
     */
    initHour () {
        let _this = this;
        let snapHeight = this.containers['HH'].children[0].offsetHeight || 50;

        let options = {
            realitySnapNumber: 24,
            snap: ".item",
            wrapper: this.wrappers.HH,
            container: this.containers.HH,
            infinite: true,
            currMove: - snapHeight,
            onScrollEnd: function (idx) {
                _this.curr.HH = idx;
                _this.apply(true);
            },
            onSnapChange: function (idx, direction) {
                let items = _this.containers.HH.children;
                let first;
                let last;

                if(direction > 0) {
                    first = parseInt(items[0].getAttribute('data-value')) - 1;
                    last = parseInt(items[4].getAttribute('data-value')) - 1;
                }  else {
                    first = parseInt(items[0].getAttribute('data-value')) + 1;
                    last = parseInt(items[4].getAttribute('data-value')) + 1;
                }

                let min = _this.limits.HH[0];
                let max = _this.limits.HH[1];

                let middleIndex = _this.getMiddleIndex('HH');
                let _direction = idx - middleIndex;

                if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                    for(let i = 0, len = _this.activeItemNum.HH; i < len; i ++) {
                        let item = items[i];
                        let val = item.getAttribute('data-value');

                        if(direction < 0) {
                            val ++;
                        } else {
                            val --;
                        }

                        item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                        item.setAttribute('data-value', val);                     
                    }

                    _this.curr.HH = middleIndex;

                    return true;
                } else {
                    items[_this.curr.HH].className = items[_this.curr.HH].className.replace(' active', '');
                    items[idx].className += ' active';

                    _this.curr.HH = idx;
                    return false;
                }      
            },
            onBeforeScroll: function () {
                let snaps = _this.containers.HH.children;
                let len = snaps.length;

                for(let i = 0; i < len; i ++) {
                    snaps[i].className = snaps[i].className.replace(' active', '');
                }
            }
        };

        this.scrollers.HH = new Carousel(options);
    };

    /**
     * 初始化分钟滚动
     * @return none
     */
    initMinute () {
        let _this = this;
        let snapHeight = this.containers['mm'].children[0].offsetHeight || 50;

        let options = {
            realitySnapNumber: 60,
            snap: ".item",
            wrapper: this.wrappers.mm,
            container: this.containers.mm,
            infinite: true,
            currMove: - snapHeight,
            onScrollEnd: function (idx) {
                _this.curr.mm = idx;
                _this.apply(true);
            },
            onSnapChange: function (idx, direction) {
                let items = _this.containers.mm.children;
                let first;
                let last;

                if(direction > 0) {
                    first = parseInt(items[0].getAttribute('data-value')) - 1;
                    last = parseInt(items[4].getAttribute('data-value')) - 1;
                }  else {
                    first = parseInt(items[0].getAttribute('data-value')) + 1;
                    last = parseInt(items[4].getAttribute('data-value')) + 1;
                }

                let min = _this.limits.mm[0];
                let max = _this.limits.mm[1];

                let middleIndex = _this.getMiddleIndex('mm');
                let _direction = idx - middleIndex;

                if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                    for(let i = 0, len = _this.activeItemNum.mm; i < len; i ++) {
                        let item = items[i];
                        let val = item.getAttribute('data-value');

                        if(direction < 0) {
                            val ++;
                        } else {
                            val --;
                        }

                        item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                        item.setAttribute('data-value', val);                     
                    }

                    _this.curr.mm = middleIndex;
                    return true;
                } else {
                    items[_this.curr.mm].className = items[_this.curr.mm].className.replace(' active', '');
                    items[idx].className += ' active';

                    _this.curr.mm = idx;
                    return false;
                }         
            },
            onBeforeScroll: function () {
                let snaps = _this.containers.mm.children;
                let len = snaps.length;

                for(let i = 0; i < len; i ++) {
                    snaps[i].className = snaps[i].className.replace(' active', '');
                }
            }
        };

        this.scrollers.mm = new Carousel(options);
    };

    /**
     * 初始化秒滚动
     * @return none
     */
    initSecond () {
        let _this = this;
        let snapHeight = this.containers['ss'].children[0].offsetHeight || 50;

        let options = {
            realitySnapNumber: 60,
            snap: ".item",
            wrapper: this.wrappers.ss,
            container: this.containers.ss,
            infinite: true,
            currMove: - snapHeight,
            onScrollEnd: function (idx) {
                _this.curr.ss = idx;
                _this.apply(true);
            },
            onSnapChange: function (idx, direction) {
                let items = _this.containers.ss.children;
                let first;
                let last;

                if(direction > 0) {
                    first = parseInt(items[0].getAttribute('data-value')) - 1;
                    last = parseInt(items[4].getAttribute('data-value')) - 1;
                }  else {
                    first = parseInt(items[0].getAttribute('data-value')) + 1;
                    last = parseInt(items[4].getAttribute('data-value')) + 1;
                }

                let min = _this.limits.ss[0];
                let max = _this.limits.ss[1];

                let middleIndex = _this.getMiddleIndex('ss');
                let _direction = idx - middleIndex;

                if(last <= max && first >= min && ((_direction > 0 && direction < 0) || (_direction < 0 && direction > 0))) {
                    for(let i = 0, len = _this.activeItemNum.ss; i < len; i ++) {
                        let item = items[i];
                        let val = item.getAttribute('data-value');

                        if(direction < 0) {
                            val ++;
                        } else {
                            val --;
                        }

                        item.children[0].innerHTML = val < 10 ? ('0' + val) : val;
                        item.setAttribute('data-value', val);                     
                    }

                    _this.curr.ss = middleIndex;

                    return true;
                } else {
                    items[_this.curr.ss].className = items[_this.curr.ss].className.replace(' active', '');
                    items[idx].className += ' active';

                    _this.curr.ss = idx;
                    return false;
                }
            },
            onBeforeScroll: function () {
                let snaps = _this.containers.ss.children;
                let len = snaps.length;

                for(let i = 0; i < len; i ++) {
                    snaps[i].className = snaps[i].className.replace(' active', '');
                }
            }
        };

        this.scrollers.ss = new Carousel(options);
    };

    /**
     * 让所有数据同步
     * @param { Boolean } 是否需要同步数据 
     * @return none
     */
    apply (syn) {
        if(syn) {
            this.synData();
        } else {        
            this.synView();
        }

        if(this.onChange && typeof this.onChange === 'function') {
            this.onChange(this.currDate.getTime());
        }    
    };

    /*
     * 激活的节点脏检查
     * @param {String} {yyyy || MM ..}
     * @param {String || Number} 当前值
     * @return none
     */
    dirty () { 
        let limits = this.limits;

        for(let type in limits) {
            if(this.config.format.indexOf(type) === -1) {
                continue;
            }

            let len = this.containers[type].children.length;

            let max = limits[type][1];
            let min = limits[type][0];

            let val = this.currValue[type];
            let _activeItemNum = 0;

            let min_distance = val - min;
            let max_distance = max - val;

            _activeItemNum = min_distance + max_distance + 1;
            _activeItemNum = _activeItemNum > len ? len : _activeItemNum;

            this.setActiveItemNum(type, _activeItemNum);
        }

        return true;
    };

    /**
     * 时间变化，其余系统变化
     * @return none
     */
    synData () {
        let year = this.getValue('yyyy');
        let month = this.getValue('MM') - 1;
        let day = this.getValue('dd');
        let hour = this.getValue('HH');
        let minute = this.getValue('mm');
        let second = this.getValue('ss');

        this.currDate = new Date(year, month, day, hour, minute, second);

        let week = this.currDate.getDay();
        let _week = week === 0 ? 7 : week;

        if(this.synLimits()) {
            this.synData();
        } else {
            this.synView(year, month + 1, day, _week, hour, minute, second);
        }
    };


    /**
     * 设置当前选择下标
     * @param {String} {yyyy || MM ..}
     * @param {Number || String} 当前值
     * @return none
     */
    setValue (type, val) {
        if(this.config.format.indexOf(type) === -1 && type !== 'week') {
            return false;
        }

        let idx = val || this.middleIndex;

        let snaps = this.containers[type].children;
        let len = snaps.length;

        if(type === 'week') {
            for(let i = 0; i < len; i ++) {
                snaps[i].className = snaps[i].className.replace(' active', '');
            }

            let snapHeight = this.containers[type].children[0].offsetHeight || 50;

            this.containers[type].style.transform = 'translateY(' + ( (idx - 2) * - snapHeight + 'px' ) + ') translateZ(0px)';
            this.containers[type].children[idx - 1].className += ' active';
            this.curr[type] = idx - 1;

        } else if(this.wrappers[type]){
            let min = this.limits[type][0];
            let max = this.limits[type][1];

            let firstItemOffset = this.getFirstItemOffset(type);
            let lastItemOffset = this.getLastItemOffset(type);
            let middleIndex = this.getMiddleIndex(type);

            if(val - firstItemOffset < min) {
                idx = middleIndex - (min - (val - firstItemOffset));
            } else if(val + lastItemOffset > max) {
                idx = middleIndex + ((val + lastItemOffset) - max);
            } else {
                idx = middleIndex;
            }

            this.curr[type] = idx;

            this.snapChange(type, val, idx);
            this.activate(type, idx);           
        } 
    };

    /**
     * 获取当前选中值
     * @param {String} {yyyy || MM ..}
     * @return none
     */
    getValue (type) {
        let val;

        if(this.config.format.indexOf(type) !== -1) {
            let currIdx = this.curr[type];

            let snaps = this.containers[type] ? this.containers[type].children : [];

            val = snaps[currIdx].getAttribute('data-value');
        } else {
            val = 0;
        }

        let limits = this.limits[type];

        if(val < limits[0]) {
            val = limits[0];
        } else if (val > limits[1]) {
            val = limits[1];
        }

        return parseInt(val);
    };

    /*
     * 获取当前选择下标
     * @param {String} {yyyy || MM ..}
     * @param {String || Number} 当前值
     * @param {String || Number} 当前下标
     * @return none
     */
    snapChange (type, val, idx) {
        let snaps = this.containers[type] ? this.containers[type].children : [];
        let len = snaps.length;

        for(let i = 0; i < len; i ++) {
            let snap = snaps[i];
            let _val = val + (i - idx);

            snaps[i].className = snaps[i].className.replace(' disabled', '');
            snaps[i].setAttribute('data-value', _val);

            if(i >= this.activeItemNum[type]) {
                snaps[i].className += ' disabled';
            }

            if(_val < 10 && type !== 'yyyy')
                _val = '0' + _val;

            snaps[i].children[0].innerHTML = _val;
        }    
    };

    /*
     * 获取当前选择下标
     * @param { String } { yyyy || MM .. }
     * @param { String || Number } 当前值
     * @return none
     */
    activate (type, idx) {
        let snaps = this.containers[type].children;
        let len = snaps.length;
        
        for(let i = 0; i < len; i ++) {
            snaps[i].className = snaps[i].className.replace(' active', '');
        }

        snaps[idx].className += ' active';
        this.scrollers[type].scrollTo(idx, type);
    };

    /**
     * 设置可用节点数量
     * @param { String } 节点类型 
     * @param { Number } 可用节点数量  
     * @return none
     */
    setActiveItemNum (type, value) { 
        this.activeItemNum[type] = value;
        this.scrollers[type].activeItemNum = value;
    };

    /**
     * 获取第一个节点的偏移量
     * @param { String } 节点类型 
     * @return { Number } 第一个节点的偏移量
     */
    getFirstItemOffset (type) { 
        let snapsNum = this.activeItemNum[type];
        return snapsNum % 2 ? parseInt(snapsNum / 2): parseInt(snapsNum / 2) - 1;
    };

    /**
     * 获取最后一个节点的偏移量
     * @param { String } 节点类型 
     * @return { Number } 最后一个节点的偏移量
     */
    getLastItemOffset (type) { 
        let snapsNum = this.activeItemNum[type];
        return parseInt(snapsNum / 2);
    };

    /**
     * 获取最后一个节点的偏移量
     * @param { String } 节点类型 
     * @return { Number } 最后一个节点的偏移量
     */
    getMiddleIndex (type) { 
        let snapsNum = this.activeItemNum[type];
        let ceil = Math.ceil(snapsNum / 2) - 1;

        return ceil;
    }

    /**
     * 时间值区间变化
     * @return none
     */
    synLimits () { 
        let year = this.currDate.getFullYear();
        let month = this.currDate.getMonth() + 1;
        let day = this.currDate.getDate();
        let hour = this.currDate.getHours();
        let minute = this.currDate.getMinutes();
        let second = this.currDate.getSeconds();

        if(month === 2) {
            this.limits.day = [1, (year % 4) ? 28 : 29];
        } else {
            this.limits.day = [1, LEEP_MONTH[month] ? 31 : 30];
        }

        let b_year = this.beginDate.getFullYear();
        let b_month = this.beginDate.getMonth() + 1;
        let b_day = this.beginDate.getDate();
        let b_hour = this.beginDate.getHours();
        let b_minute = this.beginDate.getMinutes();
        let b_second = this.beginDate.getSeconds();

        let e_year = this.endDate.getFullYear();
        let e_month = this.endDate.getMonth() + 1;
        let e_day = this.endDate.getDate();
        let e_hour = this.endDate.getHours();
        let e_minute = this.endDate.getMinutes();
        let e_second = this.endDate.getSeconds();

        let limits = {
            yyyy: [b_year, e_year],
            MM: [1, 12],
            dd: [1, 31],
            HH: [0, 23],
            mm: [0, 59],
            ss: [0, 59]        
        };        

        if(year <= b_year) {
            limits.MM[0] = b_month;
        } else {
            limits.MM[0] = 1;
        }

        if(year >= e_year) {
            limits.MM[1] = e_month;
        } else {
            limits.MM[1] = 12;
        }    

        if(year <= b_year && month <= b_month) {
            limits.dd[0] = b_day;
        } else {
            limits.dd[0] = 1;
        }

        if(year >= e_year && month >= e_month) {
            limits.dd[1] = e_day;
        } else {
            if(month === 2) {
                limits.dd[1] = (year % 4) ? 28 : 29;
            } else {
                limits.dd[1] = LEEP_MONTH[month] ? 31 : 30;
            }
        }

        if(year <= b_year && month <= b_month && day <= b_day) {
            limits.HH[0] = b_hour;
        } else {
            limits.HH[0] = 0;
        }

        if(year >= e_year && month >= e_month && day >= e_day) {
            limits.HH[1] = e_hour;
        } else {
            limits.HH[1] = 23;
        }    

        if(year <= b_year && month <= b_month && day <= b_day && hour <= b_hour) {
            limits.mm[0] = b_minute;
        } else {
            limits.mm[0] = 0;
        }

        if(year >= e_year && month >= e_month && day >= e_day && hour >= e_hour) {
            limits.mm[1] = e_minute;
        } else {
            limits.mm[1] = 59;
        }    

        if(year <= b_year && month <= b_month && day <= b_day && hour <= b_hour && minute <= b_minute) {
            limits.ss[0] = b_second;
        } else {
            limits.ss[0] = 0;
        }

        if(year >= e_year && month >= e_month && day >= e_day && hour >= e_hour && minute >= e_minute) {
            limits.ss[1] = e_second;
        } else {
            limits.ss[1] = 59;
        }      

        let limitsChanged = false;

        for(let item in limits) {
            if(item !== 'yyyy') {
                let newLimits = limits[item];
                let oldLimits = this.limits[item];

                if(newLimits[0] !== oldLimits[0] || newLimits[1] !== oldLimits[1]) {
                    limitsChanged = true;
                }
            }
        }

        this.limits = limits;

        return limitsChanged;   
    };

    /**
     * 值反馈至view
     * @param { Number(7)} 年，月，日，星期几，时，分，秒 
     * @return none
     */
    synView () {
        let _arguments = arguments;

        if(_arguments[0] === undefined) {
            _arguments = [];

            _arguments[0] = this.currDate.getFullYear();
            _arguments[1] = this.currDate.getMonth() + 1;
            _arguments[2] = this.currDate.getDate();

            let week = this.currDate.getDay();
            _arguments[3] = week === 0 ? 7 : week;

            _arguments[4] = this.currDate.getHours();
            _arguments[5] = this.currDate.getMinutes();
            _arguments[6] = this.currDate.getSeconds();        
        }

        this.currValue['yyyy'] = _arguments[0];
        this.currValue['MM'] = _arguments[1];
        this.currValue['dd'] = _arguments[2];
        this.currValue['week'] = _arguments[3];
        this.currValue['HH'] = _arguments[4];
        this.currValue['mm'] = _arguments[5];
        this.currValue['ss'] = _arguments[6];

        this.dirty();

        this.setValue('yyyy', _arguments[0]);
        this.setValue('MM', _arguments[1]);
        this.setValue('dd', _arguments[2]);
        this.setValue('week', _arguments[3]);
        this.setValue('HH', _arguments[4]);
        this.setValue('mm', _arguments[5]);
        this.setValue('ss', _arguments[6]);
    }

    /**
     * 设置限制开始值
     * @param { Number | String } 时间戳 | 符合格式的字符串
     * @return none
     */
    setBeginDate (beginDate) {
        if(!beginDate) {
            return false;
        } else if(beginDate instanceof Date) {
            this.beginDate = beginDate;
        } else {
            this.beginDate = new Date(beginDate);
        }

        this.synLimits()
        this.apply(true);

        return true;
    }

    /**
     * 设置限制结束值
     * @param { Number | String } 时间戳 | 符合格式的字符串
     * @return none
     */
    setEndDate (endDate) {
        if(!endDate) {
            return false;
        } else if(endDate instanceof Date) {
            this.endDate = endDate;
        } else {
            this.endDate = new Date(endDate);
        }

        this.synLimits();
        this.apply(true);

        return true;
    }

    /**
     * 获取或者设置值
     * @param { Number | String } 时间戳 | 符合格式的字符串
     * @return { Number | Datepicker } 时间戳 | 日期控件
     */
    value (value) {
        if(value) {
            this.currDate = new Date(value);

            if(this.currDate < this.beginDate) {
                this.currDate = this.beginDate;
            } else if(this.currDate > this.endDate) {
                this.currDate = this.endDate;
            }

            this.apply(false);

            return this;
        } else {
            return this.currDate.getTime();
        }
    }

    /**
     * 添加控件值变更监听
     * @param { Function } 值变更回调
     * @return none
     */
    addListener (event, func) {
        this.onChange = func;
    }
}

/**
 * 添加控件值变更监听
 * @param { Object } 日期控件配置
 * @return { Datepicker } 日期选择控件
 */
Datepicker.create = function (options) {
    return new Datepicker(options);
};

export default Datepicker