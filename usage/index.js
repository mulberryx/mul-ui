import Overlay from '../js/overlay';
import Datepicker from '../js/datepicker';
import Picker from '../js/picker';

/**
 * 示例文件
 * @author MulberryX
 */

/**
 * 日期选择
 */
Datepicker.create({
    id: "datepicker1",
    currDate: new Date('2016/06/10 11:30'),
    beginDate: new Date('1990/12/12 10:00'),
    endDate: new Date('2050/12/12 10:05'),
    format: 'yyyy/MM/dd HH:mm'
});


/**
 * 半浮层
 */
$('#half-popup').click(function () {
    Overlay.create({
        mask: true,
        picker: true,
        close: true
    }).open(); 
});

/**
 * 窗口浮层
 */
$('#popup').click(function () {
    Overlay.create({
        mask: true,
        type: 'popup',
        close: true
    }).open();
});

/**
 * 提示窗口
 */
$('#alert').click(function () {
    Overlay.alert({
        mask: true,
        type: 'popup',
        close: false,
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
        close: false,
        message: 'hello, 我是一个确认窗口'
    });
});

/**
 * picker 平铺
 */

let picker = new Picker({
    container: 'picker',
    cols: [
        {
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
                value: 8
            },{
                text: '陈',
                value: 9
            },{
                text: '林',
                value: 10
            },{
                text: '严',
                value: 11
            },{
                text: '程',
                value: 12
            }],
            textAlign: 'center',
            defaultvalue: 7
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
            }],
            textAlign: 'center',
            defaultvalue: 2
        },
        {
            rows: [{
                text: '先生',
                value: 0
            }, {
                text: '小姐',
                value: 1          
            }],
            textAlign: 'center',
            defaultvalue: 0     
        }
    ],
    onChange: function (value) {
        console.log(value);
    }
});

/**
 * picker 浮层
 */

// let picker2 = new Picker();
