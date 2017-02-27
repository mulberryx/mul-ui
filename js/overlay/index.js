import Mask from './mask';

let alertTemplate = require('html-loader!./templates/alert.html');
let confirmTemplate = require('html-loader!./templates/confirm.html');

/**
 * 浮层
 * @Class
 * @options: {
        content：{string},
        mask：{boolean},
        close：{boolean} 是否显示关闭按钮
        type：{string}  1、popup 2、half-popup 
        onClose：{function} 关闭窗口回调
   }
 * @forbidden：1、Overlay禁止直接实例化
 */

class Overlay {
    /**
     * 浮层
     * @constructor
     * @param {object} 配置对象     
     */    
    constructor (options) {
        this.content = options.content;
        this.type = options.type || 'popup';
        this.mask = options.mask;
        this.onClose = options.onClose;
        this.onInit = options.onInit;

        this.ele = $('<div class="ui-overlay ' + this.type +'"></div>');
        this.ele.html(content);

        if (options.close) {
            let self = this;

            this.closeBtn = $('<div class="ui-overlay-close">X</div>');
            this.ele.append(this.closeBtn);

            this.closeBtn.click(function () {
                self.close();
            });
        }

        $(document.body).append(this.ele);
    }

    /**
     * 打开浮层
     * @return none
     */
    open () {
        this.ele.show();

        if (this.mask) {
            Mask.show();
        }

        return this;
    }

    /**
     * 关闭浮层
     * @return none
     */
    close () {
        this.ele.hide();

        if (this.mask) {
            Mask.hide();
        }

        if (this.onClose && typeof this.onClose === 'function') {
            this.onClose();
        }
    }
}

/**
 * 创建窗口
 * @param {object} 浮层配置对象  
 * @return none
 */
Overlay.create = function (options) {
    return new Overlay(options);
};

/**
 * 打开一个提示窗口
 * @param {object} 提示窗口配置对象  
 * @return none
 */
Overlay.alert = function (options) {
    let _options = {
        mask: true,
        close: false,
        content: confirmTemplate,
        onClose: options.onClose
    };

    let overlay = new Overlay(_options);
    let message = overlay.getContent();

    _options.content
    _options.mask
    _options.close
};

/**
 * 打开一个确认窗口
 * @param {object} 确认窗口配置对象  
    message: {string} 显示的信息
    onConfirm: {function} 确认的回调函数
    onCancel: {function} 取消的回调函数
 * @return none
 */
Overlay.confirm = function (options) {
    let _options = {
        mask: true,
        close: false,
        content: alertTemplate,
        onClose: options.onCancel
    };

    let overlay = new Overlay(_options);
    let message = overlay.getContent();

    _options.content
    _options.mask
    _options.close
};

export default Overlay