"use strict";

import tools from '../common/tools';
import { WEEK_CN, NUMBER_CN, LEEP_MONTH, NATURE_LIMITS, DATE_UNITS } from './const';
import Overlay from '../overlay';
import Picker from '../picker';

import datepickerTemplate from 'html-loader!./datepicker.html';
/*
 * 默认配置
 */
let defaultConfig = {
    id: '',                             // 初始化容器
    defaultvalue: '',                   // 默认日期(时间戳，字符串，Date对象)
    min: '1970/01/01 00:00',            // 最小值
    max: '2030/01/01 00:00',            // 最大值
    displayformat: 'yyyy/MM/dd HH:mm',     // 日期显示格式
    valueformat: 'yyyy/MM/dd HH:mm',       // 日期值格式
    showtime: true,                        // 是否显示时分的选择
    onChange: function (val) {
        console.log(val);
    }
};

/**
 * 滚动日期组件
 * @class
 * @options: {
        input: {element|string} 输入框对象或输入框id
        defaultvalue: {string} 默认值
        min: {string} 开始时间
        max: {string} 结束时间
        displayformat: {string} 日期显示格式
        valueformat: {string} 日期值格式
        onChange: {function} 值改变回调
   } 
 */
class Datepicker {

    /**
     * 构造函数
     * @constructor
     * @param {object} 配置对象
     */
    constructor (options) {
        let _options = $.extend(true, {} , defaultConfig, options);

        if (_options.input) {
            if (typeof _options.input === 'string') {
                this.input = $('#' + _options.input);
            } else {
                this.input = $(_options.input);
            }
        } else {
            this.input = false;
        }

        this.value = _options.defaultvalue;
        this.min = _options.min;
        this.max = _options.max;
        this.showtime = options.showtime;

        this.displayformat = _options.displayformat.replace('hh', 'HH');
        this.valueformat = _options.valueformat.replace('hh', 'HH');

        this.onChange = _options.onChange;

        this.overlay = null;
        this.picker = null;

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */
    init () {
        if(!this.value) {
            this.currentDate = new Date();
        } else {
            this.currentDate = this.toDate(this.value);
        }

        this.initData();
        this.initInput();
    }

    /**
     * 初始化输入框
     * @returns none
     */
    initInput () {
        if (!this.input) {
            return false;
        }

        let self = this;

        this.input.click(function () {
            self.open();
            self.input.blur();
        });  

        this.input.attr('readonly', 'readonly');
    }

    /**
     * 初始化浮层组件
     * @returns none
     */
    initOverlay () {
        this.overlay = new Overlay({
            mask: true,
            picker: true,
            close: false,
            content: datepickerTemplate        
        });
    }

    /**
     * 初始化选择组件
     * @returns none
     */
    initPicker () {
        let self = this;

        let pickerContainer = this.overlay.findElement('[data-role=picker]');
        let pickerCols = this.getPickerCols();

        this.picker = new Picker({
            container: pickerContainer,
            cols: pickerCols,
            onChange: function (val) {
                self.valueChange(val);
            }
        });

        this.syncPickerValue();
    }

    /**
     * 初始化基础参数
     * @returns none
     */
    getPickerCols() {
        let cols = [];

        let year = this.currentDate.getFullYear(),
            month = this.currentDate.getMonth() + 1,
            date = this.currentDate.getDate(),
            day = this.currentDate.getDay(),
            hour = this.currentDate.getHours(),
            minute = this.currentDate.getMinutes();       

        let beginYear, 
            endYear, 
            beginMonth, 
            endMonth, 
            beginDate, 
            endDate,
            beginHour,
            endHour,
            beiginMinute,
            endMinute;

        if(this.valueformat.indexOf('yyyy') !== -1) {
            beginYear = this.getDate('yyyy', this._min);
            endYear = this.getDate('yyyy', this._max);

            let years = [];

            for (var i = beginYear; i <= endYear; i ++) {
                let text = i < 10 ? '0' + i : i;

                years.push({
                    text: text,
                    value: i
                });
            } 

            cols.push({
                rows: years
            });
        }

        if(this.valueformat.indexOf('MM') !== -1) { 
            beginMonth = 1;
            endMonth = 12;

            if (year === beginYear) {
                beginMonth = this.getDate('MM', this._min);
            }   

            if (year === endYear) {
                endMonth = this.getDate('MM', this._max);
            }

            let months = [];

            for (var i = beginMonth; i <= endMonth; i ++) {
                let text = i < 10 ? '0' + i : i;

                months.push({
                    text: text,
                    value: i
                });
            }

            cols.push({
                rows: months
            });
        }

        if(this.valueformat.indexOf('dd') !== -1) { 
            beginDate = 1;
            endDate = 31;

            if(month === 2) {
                endDate = (year % 4) ? 28 : 29;
            } else {
                endDate = LEEP_MONTH[month] ? 31 : 30;
            }

            if (beginYear === year && 
                beginMonth === month) {
                beginDate = this.getDate('dd', this._min);
            }   

            if (endYear === year && 
                endMonth === month) {
                endDate = this.getDate('dd', this._max);
            }

            let dates = [];

            for (var i = beginDate; i <= endDate; i ++) {
                let text = i < 10 ? '0' + i : i;

                dates.push({
                    text: text,
                    value: i
                });
            }    

            cols.push({
                rows: dates
            });        
        }

        if(this.valueformat.indexOf('yyyy') !== -1 && 
           this.valueformat.indexOf('MM') !== -1 && 
           this.valueformat.indexOf('dd') !== -1) { 
            let days = [];

            days.push({
                text:'星期' + WEEK_CN[day],
                value: day
            });

            cols.push({
                rows: days,
                disabled: true
            });
        }

        if(this.valueformat.indexOf('HH') !== -1 && this.showtime) { 
            beginHour = 0;
            endHour = 23;

            if (beginYear === year && 
                beginMonth === month && 
                beginDate === date) {
                beginHour = this.getDate('HH', this._min);
            }   

            if (endYear === year && 
                endMonth === month && 
                endDate === date) {
                endHour = this.getDate('HH', this._max);
            }

            let hours = [];

            for (var i = beginHour; i <= endHour; i ++) {
                let text = i < 10 ? '0' + i : i;

                hours.push({
                    text: text,
                    value: i
                });
            }

            cols.push({
                rows: hours
            });
        }

        if(this.valueformat.indexOf('mm') !== -1 && this.showtime) { 
            let beginMinutes = 0;
            let endMinutes = 59;

            if (beginYear === year && 
                beginMonth === month && 
                beginDate === date && 
                beginHour === hour) {
                beginMinutes = this.getDate('mm', this._min);
            }   

            if (endYear === year && 
                endMonth === month && 
                endDate === date && 
                endHour === hour) {
                endMinutes = this.getDate('mm', this._max);
            }

            let minutes = [];

            for (var i = beginMinutes; i <= endMinutes; i ++) {
                let text = i < 10 ? '0' + i : i;

                minutes.push({
                    text: text,
                    value: i
                });
            }

            cols.push({
                rows: minutes
            });            
        }

        return cols;
    }

    /**
     * 值变化
     * @param 新的值
     * @returns none
     */
    valueChange (nv) {
        let _format = this.valueformat;
        let date = this.currentDate;
        var pickerVals = [];

        let o = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };

        let i = 0;

        for (let k in o) {
            if (new RegExp("(" + k + ")").test(_format)) {
                o[k] = nv[i];
                i ++;

                if (new RegExp(/y+/).test(_format) && new RegExp(/M+/).test(_format) && new RegExp(/d+/).test(_format) && k === 'd+') {
                    i ++;
                }
            }
        }
        
        this.currentDate = new Date(o['y+'], ( o['M+'] - 1 ), o['d+'], o['H+'], o['m+']);
        
        if (this.currentDate < this._min) {
            this.currentDate = this._min;
        }

        if (this.currentDate > this._max) {
            this.currentDate = this._max;
        }

        this.value = this.getFormatValue();

        this.syncView();

        if (this.onChange && typeof this.onChange) {
            this.onChange(this.value);
        }
    }

    /**
     * 数据变化，触发同步
     * @returns none
     */
    apply () {
        let currentDate = this.currentDate;

        this._min = this.toDate(this.min);
        this._max = this.toDate(this.max);

        if (currentDate < this._min) {
            currentDate = this._min;
        }

        if (currentDate > this._max) {
            currentDate = this._max;
        }

        if (currentDate !== this.currentDate) {
            this.currentDate = currentDate;
            this.value = this.getFormatValue();

            if (this.onChange && typeof this.onChange) {
                this.onChange(this.value);
            }       
        }

        this.syncView();
    }

    /**
     * 数据同步至视图
     * @returns none
     */
    syncView () {
        if (this.input) {
            this.input.val(this.getFormatValue(this.displayformat));
        }

        if (this.picker) {
            this.picker.setCols(this.getPickerCols());
            this.syncPickerValue();
        }        
    }

    /**
     * 初始化数据
     * @returns none
     */
    initData () {
        this._min = this.toDate(this.min);
        this._max = this.toDate(this.max);

        if (this.currentDate < this._min) {
            this.currentDate = this._min;
        }

        if (this.currentDate > this._max) {
            this.currentDate = this._max;
        }

        this.value = this.getFormatValue();

        if (this.input) {
            this.input.val(this.getFormatValue(this.displayformat));
        }
    }

    /**
     * 将组件值同步至picker
     * @returns none
     */
    syncPickerValue () {
        let _format = this.valueformat;
        let date = this.currentDate;
        var pickerVals = [];

        let o = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };

        for (let k in o) {
            if (new RegExp(k).test(_format)) {
                pickerVals.push(o[k]);
            }
        }               

        if (new RegExp(/y+/).test(_format) && new RegExp(/M+/).test(_format) && new RegExp(/d+/).test(_format)) {
            pickerVals = tools.insert(pickerVals, date.getDay(), 3);
        }

        this.picker.setValue(pickerVals);
    }

    /**
     * 设置限制开始值
     * @param { number | string } 时间戳 | 符合格式的字符串
     * @returns none
     */
    setMin (min) {
        this.min = min;
        this.apply();
    }

    /**
     * 设置限制结束值
     * @param { number | string } 时间戳 | 符合格式的字符串
     * @returns none
     */
    setMax (max) {
        this.max = max;
        this.apply();
    }

    /**
     * 设置当前选择下标
     * @param {string} 当前值
     * @returns none
     */
    setValue (val) {
        this.value = val;
        this.currentDate = this.toDate(this.value);

        if (this.picker) {
            this.syncPickerValue();
        }

        if (this.onChange && typeof this.onChange) {
            this.onChange(this.value);
        }        

        this.apply();
    }

    /**
     * 获取当前选中值
     * @returns none
     */
    getValue () {
        return this.value;
    }    

    /**
     * 获取日期（年|月 ..）的值
     * @param {string} 年月日的正则
     * @param {date} 日期
     * @returns none
     */
    getDate (name, date) {
        if (!(date instanceof Date)) {
            date = this.toDate(date);
        }

        let val;

        switch (name) {
            case 'yyyy':
                val = date.getFullYear();
                break;
            case 'MM':
                val = date.getMonth() + 1;
                break;
            case 'dd':
                val = date.getDate();
                break;
            case 'day':
                val = date.getDay();
                break;
            case 'HH':
                val = date.getHours();
                break;
            case 'mm':
                val = date.getMinutes(); 
                break;
        }

        return val;
    }

    /**
     * 格式化当前日期
     * @param {string} 日期格式
     * @returns {string} 格式化后的日期
     */
    getFormatValue (format) {
        let _format = format || this.valueformat;
        let date = this.currentDate;

        let o = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };

        for (let k in o) {
            if (new RegExp('(' + k + ')').test(_format)) {
                let val = o[k];

                if (k !== 'y+') {
                    _format = _format.replace(RegExp.$1, (RegExp.$1.length == 1) ? ( val ) : (('00' + val).substr(('' + val).length)));
                } else {
                    _format = _format.replace(RegExp.$1, val);
                }
            }
        }

        return _format;        
    }

    /**
     * 字符串转日期对象
     * @param {string} 被转换的字符串
     * @returns none
     */    
    toDate (str) {
        let reg = /^(\d{4})[-\/]((0?[1-9])|(1[0-2]))([-\/](([0-2]?[1-9])|31)([\sT](([0-1]?[0-9])|(2[0-3]))(:([0-5]?[0-9])(:([0-5]?[0-9]))?)?)?)?$/;
        let reg1 = /^(\d{4})[-\/]((0?[1-9])|(1[0-2]))([-\/](([0-2]?[1-9])|31))?$/;
        let reg2 = /^(([0-1]?[0-9])|(2[0-3]))(:([0-5]?[0-9])(:([0-5]?[0-9]))?)?$/

        let today = new Date();

        if (reg.test(str)) {
            let arr = str.split(/[\sT]/);
            let date = arr[0];
            let time = arr[1];

            let _arr = date.split(/[\/-]/);

            if (!reg1.test(date)) {
                _arr.push('01');
            }

            let _str = _arr.join('\/');
            
            if (time && reg2.test(time)) {
                let __arr = time.split(/:/);

                for (var i = 0, len = 3; i < len; i ++) {
                    __arr[i] = __arr[i] || '00';
                }

                _str += ' ';
                _str += __arr.join(':');
            }

            return new Date(_str);
        } else {
            return new Date();
        }  
    }

    /**
     * 打开日期选择组件
     * @returns none
     */    
    open () {
        if (!this.overlay) {
            this.initOverlay();
            this.initPicker();
        }

        this.overlay.open();
    }
}

/**
 * 添加控件值变更监听
 * @param { object } 日期控件配置
 * @returns { datepicker } 日期选择控件
 */
Datepicker.create = function (options) {
    return new Datepicker(options);
};

export default Datepicker