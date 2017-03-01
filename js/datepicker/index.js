"use strict";

import tools from '../common/tools';
import { WEEK_CN, NUMBER_CN, LEEP_MONTH, NATURE_LIMITS, DATE_UNITS } from '../common/const';
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
    format: 'yyyy/MM/dd HH:mm:ss',        // 日期格式
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

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */
    init () {
        this.initData();
        this.initOverlay();
        // this.initPicker();

        this.initInput();
    }

    /**
     * 初始化常用的数据
     * @returns none
     */
    initData () {
        if(!this.value) {
            this.currentDate = new Date();
        } else {
            this.currentDate = new Date(this.value);
        }

        this._beginDate = new Date(this.beginDate);
        this._endDate = new Date(this.endDate);

        if (this.currentDate < this._beginDate) {
            this.currentDate = this._beginDate;
        }

        if (this.currentDate > this._endDate) {
            this.currentDate = this._endDate;
        }

        this.value = this.getFormatValue();
    }

    /**
     * 初始化输入框
     * @returns none
     */
    initInput () {
        let self = this;

        this.input.click(function () {
            self.overlay.open();
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
            defaultvalue: [],
            onChange: function () {

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
                years.push({
                    text: i,
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
                beginMonth = this.getDate('month', this._beginDate);
            }   

            if (year === endYear) {
                endMonth = this.getDate('month', this._endDate);
            }

            let months = [];

            for (var i = beginMonth; i <= endMonth; i ++) {
                months.push({
                    text: i,
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

            if (beginYear === year && beginMonth === month) {
                beginDate = this.getDate('dd', this._beginDate);
            }   

            if (endYear === year && endMonth === month) {
                endDate = this.getDate('dd', this._endDate);
            }

            let dates = [];

            for (var i = beginDate; i <= endDate; i ++) {
                dates.push({
                    text: i,
                    value: i
                });
            }    

            cols.push({
                rows: dates
            });        
        }

        if(this.format.indexOf('yyyy') && this.format.indexOf('MM') && this.format.indexOf('dd')) { 
            let days = [];

            days.push({
                text: day,
                value: day
            });

            cols.push({
                rows: days
            });
        }

        if(this.format.indexOf('HH') !== -1) { 
            let beginHour = 0;
            let endHour = 23;

            if (beginYear === year && beginMonth === month && beginDate === date) {
                beginHour = this.getDate('HH', this._beginDate);
            }   

            if (endYear === year && endMonth === month && endDate === date) {
                endHour = this.getDate('HH', this._endDate);
            }

            let hours = [];

            for (var i = beginHour; i <= endHour; i ++) {
                hours.push({
                    text: i,
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

            if (beginYear === year && beginMonth === month && beginDate === date && beginHour === hour) {
                beginMinutes = this.getDate('mm', this._beginDate);
            }   

            if (endYear === year && endMonth === month && endDate === date && endHour === hour) {
                endMinutes = this.getDate('mm', this._endDate);
            }

            let minutes = [];

            for (var i = beginDate; i <= endDate; i ++) {
                minutes.push({
                    text: i,
                    value: i
                });
            }

            cols.push({
                rows: minutes
            });            
        }
    }

    /**
     * 让所有数据同步
     * @param { boolean } 是否需要同步数据 
     * @returns none
     */
    apply (syn) {
        
    }

    /*
     * 激活的节点脏检查
     * @param {string} {yyyy || MM ..}
     * @param {string || Number} 当前值
     * @returns none
     */
    dirty () { 
        
    }

    /**
     * 时间变化，其余系统变化
     * @returns none
     */
    synData () {

    }

    /**
     * 时间值区间变化
     * @returns none
     */
    synLimits () { 
        
    }

    /**
     * 值反馈至view
     * @param { number(7)} 年，月，日，星期几，时，分，秒 
     * @returns none
     */
    synView () {
    
    }

    /**
     * 设置限制开始值
     * @param { number | string } 时间戳 | 符合格式的字符串
     * @returns none
     */
    setBeginDate (beginDate) {

    }

    /**
     * 设置限制结束值
     * @param { number | string } 时间戳 | 符合格式的字符串
     * @returns none
     */
    setEndDate (endDate) {

    }

    /**
     * 设置当前选择下标
     * @param {string} {yyyy || MM ..}
     * @param {number|string} 当前值
     * @returns none
     */
    setValue (type, val) {

    }

    /**
     * 获取当前选中值
     * @returns none
     */
    getValue () {

    }    

    /**
     * 获取日期（年|月 ..）的值
     * @returns none
     */
    getDate (name, date) {
        if (date instanceof Date) {
            date = new Date(date);
        }

        let val;

        switch (name) {
            case 'yyyy':
                val = this.currDate.getFullYear();
                break;
            case 'MM':
                val = this.currDate.getMonth() + 1;
                break;
            case 'dd':
                val = this.currDate.getDate();
                break;
            case 'day':
                val = this.currDate.getDay();
                break;
            case 'HH':
                val = this.currDate.getHours();
                break;
            case 'mm':
                val = this.currDate.getMinutes(); 
                break;
        }

        return val; 
    } 

    /**
     * 格式化当前日期
     * @returns {string} 格式化后的日期
     */
    getFormatValue () {
        var format = this.format;
        var date = this.currentDate;

        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return format;        
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