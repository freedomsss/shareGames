Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    color: {
      type: String,
      value: "red"
    },
    width: {
      type: String,
      value: "60rpx"
    },
    height: {
      type: String,
      value: "60rpx"
    },
    bgColor: {
      type: String,
      value: "#999"
    },
    radius: {
      type: String,
      value: 20
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  data: {
    hideEffect: true
  },
  attached: function () {
    this.setData({
      innerRadius: this.properties.radius * 1.7 + 10,
      outterRadius: this.properties.radius * 1.7 + 20,
    });
  },
  methods: {

    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */

    // 选中笔刷
    _select(e) {
      this.setData({
        hideEffect: false
      });
      console.log(this.data.hideEffect);
      setTimeout(() => {
        this.setData({
          hideEffect: true
        });
        console.log(this.data.hideEffect);
      }, 500);
      this.triggerEvent("select");
    }
  }
})
