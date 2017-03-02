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
    id: '',                               // 初始化容器
    defaultvalue: '',                     // 默认日期(时间戳，字符串，Date对象)
    beginDate: '1970/01/01 00:00',        // 开始日期
    endDate: '2100/01/01 00:00',          // 结束日期
    format: 'yyyy/MM/dd HH:mm',        // 日期格式
    onChange: function (val) {
        console.log(val);
    }
};

/**
 * 滚动日期组件
 * @class
 * @options: {
        id: {string} 容器id
        defaultvalue: {string} 默认值
        beginDate: {string} 开始时间
        endDate: {string} 结束时间
        format: {string} 时间格式
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

        this.input = $('#' + _options.id);
        this.value = _options.defaultvalue;
        this.beginDate = _options.beginDate;
        this.endDate = _options.endDate;
        this.format = _options.format;
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
            this.currentDate = new Date(this.value);
        }

        this.syncData();
        this.initInput();
    }

    /**
     * 同步数据
     * @returns none
     */
    syncData () {
        this._beginDate = new Date(this.beginDate);
        this._endDate = new Date(this.endDate);

        if (this.currentDate < this._beginDate) {
            this.currentDate = this._beginDate;
        }

        if (this.currentDate > this._endDate) {
            this.currentDate = this._endDate;
        }

        this.value = this.getFormatValue();
        this.input.val(this.value);
    }

    /**
     * 初始化输入框
     * @returns none
     */
    initInput () {
        let self = this;

        this.input.click(function () {
            if (!self.overlay) {
                self.initOverlay();
                self.initPicker();
            }

            self.overlay.open();
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

        let year = this.currentDate.getFullYear(),
            month = this.currentDate.getMonth() + 1,
            date = this.currentDate.getDate(),
            day = this.currentDate.getDay(),
            hour = this.currentDate.getHours(),
            minute = this.currentDate.getMinutes();

        this.picker = new Picker({
            container: pickerContainer,
            cols: pickerCols,
            defaultvalue: [year, month, date, day, hour, minute],
            onChange: function (val) {
                self.valueChange(val);
            }
        });
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

        if(this.format.indexOf('yyyy') !== -1) {
            beginYear = this.getDate('yyyy', this._beginDate);
            endYear = this.getDate('yyyy', this._endDate);

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

        if(this.format.indexOf('MM') !== -1) { 
            beginMonth = 1;
            endMonth = 12;

            if (year === beginYear) {
                beginMonth = this.getDate('MM', this._beginDate);
            }   

            if (year === endYear) {
                endMonth = this.getDate('MM', this._endDate);
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

        if(this.format.indexOf('dd') !== -1) { 
            beginDate = 1;
            endDate = 31;

            if(month === 2) {
                endDate = (year % 4) ? 28 : 29;
            } else {
                endDate = LEEP_MONTH[month] ? 31 : 30;
            }

            if (beginYear === year && 
                beginMonth === month) {
                beginDate = this.getDate('dd', this._beginDate);
            }   

            if (endYear === year && 
                endMonth === month) {
                endDate = this.getDate('dd', this._endDate);
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

        if(this.format.indexOf('yyyy') !== -1 && 
           this.format.indexOf('MM') !== -1 && 
           this.format.indexOf('dd') !== -1) { 
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

        if(this.format.indexOf('HH') !== -1) { 
            beginHour = 0;
            endHour = 23;

            if (beginYear === year && 
                beginMonth === month && 
                beginDate === date) {
                beginHour = this.getDate('HH', this._beginDate);
            }   

            if (endYear === year && 
                endMonth === month && 
                endDate === date) {
                endHour = this.getDate('HH', this._endDate);
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

        if(this.format.indexOf('mm') !== -1) { 
            let beginMinutes = 0;
            let endMinutes = 59;

            if (beginYear === year && 
                beginMonth === month && 
                beginDate === date && 
                beginHour === hour) {
                beginMinutes = this.getDate('mm', this._beginDate);
            }   

            if (endYear === year && 
                endMonth === month && 
                endDate === date && 
                endHour === hour) {
                endMinutes = this.getDate('mm', this._endDate);
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
        this.currentDate = new Date(nv[0], ( nv[1] - 1 ), nv[2], nv[4], nv[5]);
        this.apply();
    }

    /**
     * 数据变化，触发同步
     * @returns none
     */
    apply () {
        this.syncData();
        this.picker.setCols(this.getPickerCols());

        let year = this.currentDate.getFullYear(),
            month = this.currentDate.getMonth() + 1,
            date = this.currentDate.getDate(),
            day = this.currentDate.getDay(),
            hour = this.currentDate.getHours(),
            minute = this.currentDate.getMinutes();        

        this.picker.setValue([year, month, date, day, hour, minute]);        

        if (this.onChange && typeof this.onChange) {
            this.onChange(this.value);
        }        
    }

    /**
     * 设置限制开始值
     * @param { number | string } 时间戳 | 符合格式的字符串
     * @returns none
     */
    setBeginDate (beginDate) {
        this.beginDate = beginDate;
        this._beginDate = new Date(this.beginDate);

        this.apply();
    }

    /**
     * 设置限制结束值
     * @param { number | string } 时间戳 | 符合格式的字符串
     * @returns none
     */
    setEndDate (endDate) {
        this.endDate = endDate;
        this._endDate = new Date(this.endDate);

        this.apply();
    }

    /**
     * 设置当前选择下标
     * @param {string} 当前值
     * @returns none
     */
    setValue (val) {
        this.value = val;
        this.currentDate = new Date(val);
        this.input.val(this.val);
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
        if (date instanceof Date) {
            date = new Date(date);
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
     * @returns {string} 格式化后的日期
     */
    getFormatValue () {
        let formatValue = this.format;
        let date = this.currentDate;

        let o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "h+": date.getHours(),
            "m+": date.getMinutes()
        };

        if (/(y+)/.test(formatValue)) {
            formatValue = formatValue.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(formatValue)) {
                let val = o[k];
                formatValue = formatValue.replace(RegExp.$1, (RegExp.$1.length == 1) ? (val) : (("00" + val).substr(("" + val).length)));
            }
        }

        return formatValue;        
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