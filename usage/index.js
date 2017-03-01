/**
 * 示例文件
 * @author MulberryX
 */

import Overlay from '../js/overlay';
import Picker from '../js/picker';
import Datepicker from '../js/datepicker';

/**
 * 半浮层
 */
$('#half-popup').click(function () {
    Overlay.create({
        mask: true,
        picker: true,
        closeIcon: false
    }).open(); 
});

/**
 * 窗口浮层
 */
$('#popup').click(function () {
    Overlay.create({
        mask: true,
        type: 'popup',
        closeIcon: true
    }).open();
});

/**
 * 提示窗口
 */
$('#alert').click(function () {
    Overlay.alert({
        mask: true,
        type: 'popup',
        closeIcon: false,
        message: 'hello, 我是一个提示窗口'
    });
});

/**
 * 确认窗口
 */
$('#confirm').click(function () {
    Overlay.confirm({
        mask: true,
        type: 'popup',
        closeIcon: false,
        message: 'hello, 我是一个确认窗口'
    });
});

/**
 * picker 平铺
 */
let picker = new Picker({
    container: 'picker',
    cols: [{
        rows: [{
            text: '赵',
            value: 0
        },{
            text: '钱',
            value: 1
        },{
            text: '孙',
            value: 2
        },{
            text: '李',
            value: 3
        },{
            text: '周',
            value: 4
        },{
            text: '吴',
            value: 5
        },{
            text: '郑',
            value: 6
        },{
            text: '王',
            value: 7
        },{
            text: '陈',
            value: 8
        },{
            text: '林',
            value: 9
        },{
            text: '严',
            value: 10
        },{
            text: '程',
            value: 11
        }]
    }, {
        rows: [{
            text: '杰伦',
            value: 0
        },{
            text: '磊',
            value: 1
        },{
            text: '明',
            value: 2
        },{
            text: '鹏',
            value: 3
        }]
    },
    {
        rows: [{
            text: '先生',
            value: 0
        }, {
            text: '小姐',
            value: 1          
        }]
    }],
    defaultvalue: [7, 2, 1],
    onChange: function (value) {
        console.log(value);
    }
});

/**
 * picker 浮层
 */

let datepicker = new Datepicker({
    id: 'datepicker',
    defaultvalue: '2014/06/07 00:00:00',
    beginDate: '2014/03/07 00:00:00',
    endDate: '2019/12/07 00:00:00',
    format: 'yyyy/MM/dd HH:mm:dd',
    onChange: function (val) {
        console.log(val);
    }
});
