text = "这里是每日签到，测试自动化脚本"; // 这是你要发送的文本内容
thread = "7522668935524335620" // 这是话题群的帖子ID，得通过飞书的API获取，我是直接抓取带参数活动获得的。

// 读取并解析JSON配置文件
var configFilePath = "./config.json"; // 请确保路径正确
var configStr = files.read(configFilePath);
if (!configStr) {
    toastLog("错误：无法读取 config.json 文件！");
    exit();
}

var config = JSON.parse(configStr); // 将字符串解析为JSON对象
var password = config.password;
// var thread = config.threadId;
// var text = config.messageText;

// 解锁屏幕
sleep(1000); // 等待1秒钟，确保设备准备就绪
let utils = require("./unlock_utils.js");
utils.swipeUp();
sleep(2000); // 等待滑动完成
utils.unlock(password);

// 启动活动
console.log("启动飞书对应活动...");
shizuku(`su -c 'am start -n "com.ss.android.lark/.threaddetail.ThreadDetailActivity" --es "key_params_thread_source" "这里是每日签到" --es "key_params_thread_id" ${thread} --ez "key_params_show_chat_name" "true" --ez "key_params_load_from_start" "true" --ez "key_params_show_keyboard" "true" --ez "key_params_has_create_thread" "true" --ei "key_params_jump_position" "0" --ez "key_bottom_sheet_container_start" "false"'`)

// 选中输入框并输入
var input_bar = id("kb_rich_text_content_wrapper").findOne();
console.log("输入框已选中，准备输入文本...");
input_bar.click();
setText(text);
sleep(500);

// 点击发送按钮
console.log("文本输入完成，准备发送...");
var send_button = id("right_insets").findOne();
click(send_button.bounds().centerX(), send_button.bounds().centerY());

sleep(1000); // 等待发送完成
let packageName = currentPackage();
// 切换回去
sleep(1500);
home();
// shizuku("am force-stop " + packageName, true);