import Tools from '../common/tools';
import { EVENTS } from '../common/const';

/**
 * 浮层遮罩
 * @Class
 */
class Mask {
    /**
     * 浮层遮罩
     * @constructor
     */
    constructor () {
        this.ele = $('<div class="ui-overlay-mask"></div>');
        this.ele.click(function () {
            Tools.triggerEvent(EVENTS['ACTION:MASK:CLICK']);
        });

        document.body.appendChild(this.ele[0]);
    }

    /**
     * 显示遮罩
     * @returns none     
     */
    show () {
        this.ele.show();
    }

    /**
     * 隐藏遮罩
     * @returns none
     */
    hide () {
        this.ele.hide();
    }
}

export default {
    ins: null,
    num: 0,
    
    /**
     * 显示遮罩
     * @returns none     
     */    
    show () {
        if (!this.ins) {
            this.ins = new Mask();
        }
        
        this.num ++;
        this.ins.show();
    },

    /**
     * 隐藏遮罩
     * @returns none
     */
    hide () {
        this.num --;

        if (this.num === 0) {
            this.ins.hide();
        }
    }
}