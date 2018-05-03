/**
 * 图组件
 * @author steudnera
 */

import Chart from './Chart'

const charts = {}

export default {
  /**
   * 创建一个图
   * @param {string} 画板 id
   * @param {object} 配置对象
   * @return none
   */
  create: (id, options) => {
    const canvas = document.getElementById(id)
    const ctx = canvas.getContext('2d')
    
    charts[id] = new Chart(canvas, options)
  },
  /**
   * 清空图
   * @param {string} 画板id
   * @return none
   */
  clean: (id) => {
    charts[id].clean()
  },
  /**
   * 更新配置项
   * @param {object} 配置项
   * @return none
   */
  updateOptions: (id, options) => {
    chart[id].updateOptions(options)
  },
  /**
   * 更新数据
   * @param {object} 新数据
   * @return none
   */
  updateData: (id, data) => {
    chart[id].updateData(data)
  },
}
