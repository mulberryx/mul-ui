/**
 * 示例文件
 * @author MulberryX
 */

import Overlay from '../js/overlay';
import Picker from '../js/picker';
import Datepicker from '../js/datepicker';

var timer = function (func) {
    var start = new Date();
    func();
    var end = new Date();
    alert(end.getTime() - start.getTime());
};

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

let datepicker1 = new Datepicker({
    id: 'datepicker1',
    input: document.getElementById('datepicker1'),
    defaultvalue: '2017/03/06 00:00',
    min: '2000/01/12 12:12',
    max: '2100/11/16 12:33',
    displayformat: 'yyyy/MM/dd HH:mm',
    valueformat: 'yyyy/MM/dd HH:mm',
    showtime: true,
    onChange: function (val) {
        console.log(val);
    }
});

let datepicker2 = new Datepicker({
    input: 'datepicker2',
    defaultvalue: '2015/06/07 00:00',
    min: '2000/01/12 12:12',
    max: '2100/11/16 12:33',
    displayformat: 'yyyy/MM/dd HH:mm:ss',
    valueformat: 'yyyy/MM/dd HH:mm:ss',
    showtime: false,
    onChange: function (val) {
        console.log(val);
    }
});

let datepicker3 = new Datepicker({
    input: 'datepicker3',
    defaultvalue: '2015/06/07 00:00',
    min: '2000/01/12 12:12',
    max: '2100/11/16 12:33',
    displayformat: 'MM/dd HH:mm',
    valueformat: 'MM/dd HH:mm',
    showtime: true,
    onChange: function (val) {
        console.log(val);
    }
});

let datepicker4 = new Datepicker({
    defaultvalue: '2015/06/07 00:00',
    min: '2000/01/12 12:12',
    max: '2100/11/16 12:33',
    displayformat: 'MM/dd HH:mm',
    valueformat: 'MM/dd HH:mm',
    showtime: true,
    onChange: function (val) {
        console.log(val);
    }
});

$('#datepicker4').click(function (e) {
    datepicker4.open();
    e.target.blur();
});


