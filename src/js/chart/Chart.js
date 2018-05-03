/**
 * 图
 * @author steudnera
 */

import Canvas from './Canvas'

/**
 * 图表类
 */
export default class Chart {
  /**
   * 构造函数
   * @param {canvas} canvas 对象 
   * @param {object} 配置对象
   */
  constructor (canvas, options) {
    this.chartConfig = options.chart
    this.canvasConfig = options.canvas
    
    this.canvas = new Canvas(canvas)
  }
  
  /**
   * 更新数据
   * @param {object} 新数据
   * @return none
   */
  updateData (data) {
    this.data = Object.assign({}, this.data, data)
    this.canvas.draw(this.data, this.chartConfig)
  }
  
  /**
   * 更新配置
   * @param {object} 新配置
   * @return none
   */
  updateOptions (options) {
    this.chartConfig = options.chart
    this.canvasConfig = options.canvas
  
    this.canvas.adjust()
    this.canvas.draw(this.data, this.chartConfig)
  }
  
  /**
   * 清除画板
   * @return none
   */
  clean () {
    this.canvas.clean()
  }
}
