import Mask from './mask';
import tools from '../common/tools';
import { EVENTS } from '../common/const';

import alertTemplate from 'html-loader!./templates/alert.html';
import confirmTemplate from 'html-loader!./templates/confirm.html';

/**
 * 浮层
 * @Class
 * @options: {
        mask：   {boolean} 是否显示浮层遮罩
        close：  {boolean} 是否显示关闭按钮
        picker:  {boolean} 是否是选择弹出窗
        content：{string} 弹出窗口的内容
        onInit:  {function} 初始化钩子函数
        onClose：{function} 关闭窗口回调
   }
 */

var $body = $(document.body);

class Overlay {
    /**
     * @constructor
     * @param {object} 配置对象     
     */    
    constructor (options) {
        this.content = options.content;
        this.picker = options.picker;
        this.mask = options.mask;
        this.onClose = options.onClose;
        this.onInit = options.onInit;
        this.isOpen = false;

        this.ele = $('<div class="ui-overlay"></div>');
        this.ele.html(this.content);

        $body.append(this.ele);

        let self = this;

        if ( this.picker ) {
            this.ele.addClass('picker');

            tools.addEventListener(EVENTS['ACTION:MASK:CLICK'], function () {
                if (self.isOpen) {
                    self.close();
                }
            });
        }

        if ( options.close ) {
            this.closeBtn = $('<div class="ui-overlay-close">X</div>');
            this.ele.append(this.closeBtn);

            this.closeBtn.click(function () {
                self.close();
            });
        }

        if ( this.onInit && typeof this.onInit === 'function' ) {
            this.onInit.apply(this);
        }        
    }

    /**
     * 打开浮层
     * @returns none
     */
    open () {
        if (this.mask) {
            Mask.show();
        }
        
        this.isOpen = true;
        this.ele.addClass('open');

        return this;
    }

    /**
     * 关闭浮层
     * @returns none
     */
    close () {
        this.ele.removeClass('open');
        this.isOpen = false;

        if (this.mask) {
            Mask.hide();
        }

        if (this.onClose && typeof this.onClose === 'function') {
            this.onClose.apply(this);
        }
    }

    /**
     * 添加事件
     * @param {string} css选择器
     * @param {string} 事件名称
     * @param {function} 事件处理函数 
     * @returns none
     */
    addEventHandler (cssQuery, event, handler) {
        this.ele.find(cssQuery).on(event, handler);
    }

    /**
     * 添加内容
     * @param {string} css选择器
     * @param {string} 内容 
     * @returns none
     */
    setContent (cssQuery, content) {
        this.ele.find(cssQuery).html(content);
    }

    /**
     * 移除弹出窗 
     * @returns none
     */
    remove () {

    }
}

/**
 * 创建窗口
 * @param {object} 浮层配置对象  
 * @returns none
 */
Overlay.create = function (options) {
    return new Overlay(options);
};

/**
 * 打开一个提示窗口
 * @param {object} 提示窗口配置对象  
    {
        message: {string} 显示的信息
        onConfirm: {function} 关闭窗口的回调 
    }
 * @returns none
 */
Overlay.alert = function (options) {
    let _options = {
        mask: true,
        close: false,
        content: alertTemplate,
        onInit: function () {
            let self = this;

            this.addEventHandler('#confirm', 'click', function () {
                self.close();
            
                if (options.onConfirm && typeof options.onConfirm === 'function') {
                    options.onConfirm.apply(self);
                }
            });

            this.setContent('#message', options.message);
            this.open();           
        }
    };

    new Overlay(_options);
};

/**
 * 打开一个确认窗口
 * @param {object} 确认窗口配置对象  
    {
        message: {string} 显示的信息
        onConfirm: {function} 确认的回调函数
        onCancel: {function} 取消的回调函数
    }
 * @returns none
 */
Overlay.confirm = function (options) {
    let _options = {
        mask: true,
        close: false,
        content: confirmTemplate,
        onInit: function () {
            let self = this;

            this.addEventHandler('#confirm', 'click', function () {
                self.close();
            
                if (options.onConfirm && typeof options.onConfirm === 'function') {
                    options.onConfirm.apply(self);
                }
            });

            this.addEventHandler('#cancel', 'click', function () {
                self.close();

                if (options.onCancel && typeof options.onCancel === 'function') {
                    options.onCancel.apply(self);
                }        
            });

            this.setContent('#message', options.message);
            this.open();
        }
    };

    new Overlay(_options);
};

export default Overlay;