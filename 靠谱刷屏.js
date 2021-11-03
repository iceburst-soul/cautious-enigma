/*  靠谱刷屏
    更新日志 
    1.0:可以寻人定时喊话，功能强大(迫真)
    1.1:可自定义刷屏文本
    1.2:新增UI界面、空输入判断
    1.3:新增时间的正则判断，只允许输入纯数字
    1.4:新增返回功能，目前可从聊天（含文件传输界面）返回至搜索框
    1.4.1:返回函数优化，支持绝大部分场景返回
*/
// ============必要声明============
"ui";
auto();
importClass(com.stardust.autojs.core.accessibility.AccessibilityBridge.WindowFilter);
    let bridge = runtime.accessibilityBridge;
    let bridgeField = runtime.getClass().getDeclaredField("accessibilityBridge");
    let configField = bridgeField.getType().getDeclaredField("mConfig");
    configField.setAccessible(true);
    configField.set(bridge, configField.getType().newInstance());
 
    bridge.setWindowFilter(new JavaAdapter(AccessibilityBridge$WindowFilter, {
        filter: function (info) {
            return true;
        }
    }));
// ============功能函数============
function back_Upper() {
//     1.4版本返回函数
//     if(text("发送").findOne(100) !== null || text("手机文件").findOne(100) !== null || text("我的电脑").findOne(100) !== null || text("手机静音").findOne(1200) !== null) {
//         back();
//         //返回过快，上一级界面还没消失完全第二次if判断可能就会开始，必须sleep
//         sleep(1000);
//         if (text("发送").findOne(100) !== null || text("手机文件").findOne(100) !== null || text("我的电脑").findOne(100) !== null || text("手机静音").findOne(1200) !== null) {
//             back();
//         } else {
//         }
//     }else{
//     }
// }
    while (id("dz1").findOne(100) !== null ||  id("lpm").findOne(100) !== null || id("ivTitleBtnLeft").findOne(100) !== null) {
        back();
        sleep(1000);
    }
}
function fill() {
    // 刷屏
    var setTime = ui.time.text();
    var setContent = ui.con.text();
    var time = setInterval(function () {
      className('EditText').findOne().setText(setContent)
      text('发送').findOne().click()
    }, 0)
    //到时取消循环
    setTimeout(function () {
      clearInterval(time)
    }, setTime * 1000)
    var over = setInterval(function () {
      clearInterval(over)
      toast('执行完成');
      exit();
    }, setTime * 1000)
  }
function main() {
    var thread1 = threads.start(function(){
        var target = ui.tar.text();
        // 启动QQ
        app.launchApp("QQ");
        // 返回主界面
        back_Upper();
        // 判断是否有搜索框
        if (id("et_search_keyword").findOne(1200) !==null && text("取消").findOne(1200) !== null){
            // 向搜索栏输入目标
            id("et_search_keyword").setText(target);
            setScreenMetrics(1080, 2340);
            click(100,440);
            click(100,440);
            fill();
        }else{
            // 打开搜素栏
            desc("搜索").findOne().click();
            //执行过快，下一级界面还没出现就填入目标了，因为id相同所以会填在主界面，必须sleep
            sleep("1000"); 
            // 向搜索栏输入目标
            id("et_search_keyword").setText(target);
            setScreenMetrics(1080, 2340);
            click(100,440);
            click(100,440);
            fill();
        }
    })
}
// ============界面布局============
ui.layout(
    <vertical padding = "16">
        <text text = "请输入刷屏目标" textSize = "16sp" marginTop = "16" textColor = "black"/>
        <input id = "tar" text = ""/>
        <text text = "请输入刷屏时间" textSize = "16sp" marginTop = "16" textColor = "black"/>
        <input id = "time" text = ""/>
        <text text = "请输入刷屏内容" textSize = "16sp" marginTop = "16" textColor = "black"/>
        <input id = "con" text = ""/>
        <button id = "ok" text = "启动" marginTop = "50" />
    </vertical>
);
    ui.ok.on("click",() => {
        var checkNumber = /^([+-]?)\d*\.?\d+$/;
        if(ui.tar.text().length !== 0 && ui.time.text().length !== 0 && ui.con.text().length !== 0 && checkNumber.test(ui.time.text()) == true){
            main();
        }else{
            toast("请正确补全信息");
        }
    });
