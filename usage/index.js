import Overlay from '../js/overlay';
import Datepicker from '../js/datepicker';

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
        type: 'half-popup',
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
        close: true
    });
});

/**
 * 确认窗口
 */
$('#confirm').click(function () {
    Overlay.confirm({
        mask: true,
        type: 'popup',
        close: true
    });
});