const app = getApp();

var drawInfos = [];
var startX = 0;
var startY = 0;
var bgColor = "#f8f8f8";
var begin = false;
var curDrawArr = []; // 绘图坐标系
Page({
  data:{
    avatarUrl: '../../../images/code-func-sum.png',
    curWidthIndex: 0, // 当前线条粗细索引
    bgColor: bgColor,
    lineWidthArr: [2, 5, 10, 20],
    currentColor: 'red',
    avaliableColors: ["black", "red", "blue",
      "gray", "#ff4081","#009681",
      "#259b24", "green", "#0000CD",
      "#1E90FF", "#ADD8E6", "#FAEBD7",
      "#FFF0F5"]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染
   */
  onReady: function() {
    this.context = wx.createCanvasContext('firstCanvas'); // 创建 canvas 绘图上下文（指定 canvasId）
    this.hiddenCanvasContext = wx.createCanvasContext("secondCanvas");
    this.init();
    this.fillBackground(this.context);
    this.draw();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },
  /*************************************ui事件*******************************************/
  // 绘制开始 手指开始按到屏幕上
  touchStart: function (e) {
    this.lineBegin(e.touches[0].x, e.touches[0].y);
    curDrawArr.push({
      x: e.touches[0].x,
      y: e.touches[0].y
    });
  },
  // 绘制中 手指在屏幕上移动
  touchMove: function (e) {
    if (begin) {
      this.lineAddPoint(e.touches[0].x, e.touches[0].y);
      this.draw(true);
      curDrawArr.push({
        x: e.touches[0].x,
        y: e.touches[0].y
      });
    }
  },

  // 绘制结束 手指抬起
  touchEnd: function () {
    drawInfos.push({
      drawArr: curDrawArr,
      color: this.data.currentColor,
      lineWidth: this.data.lineWidthArr[this.data.curWidthIndex],
    });
    curDrawArr = [];
    this.lineEnd();
  },
  // 点击设置线条颜色
  clickChangeWidth(e){
    let index = e.currentTarget.dataset.index;
    this.setLineWidthByIndex(index);
  },
  // 点击撤销上一步
  clickFallback: function () {
    if (drawInfos.length >= 1) {
      drawInfos.pop();
    }
    this.reDraw();
  },
  // 根据保存的绘制信息重新绘制
  reDraw: function () {
    this.init();
    this.fillBackground(this.context);
    // this.draw(false);
    for (var i = 0; i < drawInfos.length; i++) {
      this.context.strokeStyle = drawInfos[i].color;
      this.context.setLineWidth(drawInfos[i].lineWidth);
      let drawArr = drawInfos[i].drawArr;
      this.lineBegin(drawArr[0].x, drawArr[0].y)
      for (var j = 1; j < drawArr.length; j++) {
        this.lineAddPoint(drawArr[j].x, drawArr[j].y);
        // this.draw(true);
      }

      this.lineEnd();
    }

    this.draw();
  },
  // 点击切换到擦除
  clickErase: function () {
    this.setCurrentColor(bgColor);
  },
  // 点击清空canvas
  clickClearAll: function () {
    this.fillBackground(this.context);
    this.draw();
    drawInfos = [];
    this.init();
  },
  /*************************************界面绑定函数*******************************************/
  // 初始化
  init: function () {
    this.context.setLineCap('round'); // 让线条圆润
    this.context.strokeStyle = this.data.currentColor; // 设置线条颜色
    this.context.setLineWidth(this.data.lineWidthArr[this.data.curWidthIndex]); // 设置线条宽度
    this.setData({
      currentColor: this.data.currentColor,
      curWidthIndex: this.data.curWidthIndex
    });
  },
  // canvas上下文设置背景为白色
  fillBackground: function (context) {
    context.setFillStyle(bgColor); //设置绘图填充颜色
    context.fillRect(0, 0, 500, 500); // 绘制一个矩形
    context.fill(); // 创建一个矩形
  },
  // 绘制canvas
  // isReverse: 是否保留之前的像素
  draw: function (isReverse = false, cb) {
    this.context.draw(isReverse, () => {
      if (cb && typeof (cb) == "function") {
        cb();
      }
    });
  },
  // 开始绘制线条
  lineBegin: function (x, y) {
    begin = true;
    this.context.beginPath()
    startX = x;
    startY = y;
    this.context.moveTo(startX, startY)
    this.lineAddPoint(x, y);
  },
  // 绘制线条中间添加点
  lineAddPoint: function (x, y) {
    this.context.moveTo(startX, startY)
    this.context.lineTo(x, y)
    this.context.stroke();
    startX = x;
    startY = y;
  },
  // 绘制线条结束
  lineEnd: function () {
    this.context.closePath();
    begin = false;
  },
  // 设置线条宽度
  setLineWidthByIndex(index){
    let width = this.data.lineWidthArr[index];
    this.context.setLineWidth(width);
    this.setData({
      curWidthIndex: index
    });
  },
  // 点击设置线条颜色
  clickChangeColor: function (e) {
    let color = e.currentTarget.dataset.color;
    this.setCurrentColor(color);
  },
  // 设置线条颜色
  setCurrentColor: function (color) {
    this.data.currentColor = color;
    this.context.strokeStyle = color;
    this.setData({
      currentColor: color
    });
  },
  /*********************************生成海报*************************************************/
// 将canvas导出为临时图像文件
// canvasId： 要导出的canvas的id
// cb: 回调函数
  store: function (canvasId, cb) {
    wx.canvasToTempFilePath({
      destWidth: 400,
      destHeight: 300,
      canvasId: canvasId,
      success: function (res) {
        typeof (cb) == 'function' && cb(res.tempFilePath);
      },
      fail: function (res) {
        console.log("store fail");
        console.log(res);
      }
    })
  },
// 点击分享
// 现在的功能是拼接一个分享出去的图像，然后保存到本地相册
  clickShare: function () {
    let that = this;
    // 截图的时候屏蔽用户操作
    wx.showLoading({
      title: '请稍等',
      mask: true
    })
    // 300毫秒后恢复正常
    setTimeout(() => {
      wx.hideLoading();
    }, 300);

    // 截图用户绘制的canvaas
    this.store("firstCanvas", filePath => {
      // 生成海报并分享
      that.generatePost(filePath, () => {
        that.store("secondCanvas", filePath => {
          // that.sharePost(filePath);
        });
      });
    });
  },
  // 生成海报
  generatePost: function (filePath, cb) {
    // 测试
    this.fillBackground(this.hiddenCanvasContext);

    // this.hiddenCanvasContext.drawImage("/images/userinfo/reward.jpg", 0, 0, 400, 400)
    this.hiddenCanvasContext.drawImage(filePath);
    // end of 测试
    this.drawHiddenCanvas(cb);
  },
  // 绘制用户看不到的canvas
  drawHiddenCanvas: function (cb) {
    this.hiddenCanvasContext.draw(false, () => {
      if (cb && typeof (cb) == "function") {
        cb();
      }
    });
  },
});


