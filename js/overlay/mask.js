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
        document.body.append(this.ele[0]);
    }

    /**
     * 显示遮罩
     * @return none     
     */
    show () {
        this.ele.show();
    }

    /**
     * 隐藏遮罩
     * @return none
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
     * @return none     
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
     * @return none
     */
    hide () {
        this.num --;

        if (this.num === 0) {
            this.ins.hide();
        }
    }
}