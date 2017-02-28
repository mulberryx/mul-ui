import tools from '../common/tools';

import Overlay from '../overlay';
import Carousel from '../carousel';
import pickerTemplate from 'html-loader!./picker.html'

let templateRender = tools.tmpl(pickerTemplate);

/**
 * Picker 选择组件
 * @class
 * @options: {
        container: {string} 容器id
        cols: {array} 选择数组
        onChange：{function} 关闭窗口回调
   }
 */

class Picker {
    /**
     * @constructor
     * @param {object} 配置对象     
     */    
    constructor (options) {
        this.container = $('#' + options.container);
        this.container.html(templateRender(options));

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */
    init () {
        let cols = this.container.find('.ui-picker-items-col');

        cols.each(function (idx, ele) {
            var container = $(ele);
            var wrapper = container.find('.ui-picker-items-col-wrapper');

            let options = {
                snap: ".ui-picker-item",
                container: container[0],
                wrapper: wrapper[0],
                onChange: function (data) {
                    
                }
            };

            new Carousel(options)            
        });
    }

    /**
     * 渲染函数
     * @returns none
     */
    render () {

    }

    /**
     * 打开选择组件
     * @returns none
     */
    open () {
        
    }

    /**
     * 关闭选择组件
     * @returns none
     */
    close () {

    }    
}

export default Picker;