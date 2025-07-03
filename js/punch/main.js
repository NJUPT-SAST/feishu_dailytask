// 读取并解析JSON配置文件
var configFilePath = "./config.json"; // 请确保路径正确
var configStr = files.read(configFilePath);
if (!configStr) {
    toastLog("错误：无法读取 config.json 文件！");
    exit();
}

var config = JSON.parse(configStr); // 将字符串解析为JSON对象
var password = config.password;

// 解锁屏幕
sleep(1000);
let utils = require("./unlock_utils.js");
utils.swipeUp();
sleep(2000); // 等待滑动完成
utils.unlock(password)

// 启动飞书对应活动
shizuku('su -c \'am start -n com.ss.android.lark/.threadwindow.ThreadWindowActivity -f 0x10000000 --el launch_tab_id 100001 --ez extra_need_badge true --ez key_is_show_group_profile false --es chatID 7516928169706946563 --ez key_show_apply_chat false --ez extra_is_secret_chat false --ez need_show_position false --ez key_param_from_offline_push false --ez key_show_forseti_page false --ez launch_tabs_refresh false --ez key_newintent_rebuild_chat true --ez extra_is_cloud_apply false --ei showPosition -1 --ez extra_is_recommend_topic false --ei key_ai_chat_type 0 --ez from_tour false --ez show_single_page false --ez switch_to_inbox false --es gochatwin_from feed --ez key_bottom_sheet_container_start false --ei extra_chat_mode 0 --ez extra_chat_chatwindow_hide_title false --ez key_param_immediate_open_chat false\'')

// 开始操作
scrollToBottomWithSwipe("com.ss.android.lark:id/message_view", 14);
sleep(999); // 等待列表加载完成
smartClickCheckinButton();

// 切换回去
sleep(1499);
home();
// shizuku("am force-stop " + packageName, true)


/**
 * 最终完美版 - V7
 * 优化了坐标点击的位置，使其更精确地落在按钮的视觉区域内。
 */
function smartClickCheckinButton() {
    // --- 步骤 1 & 2: 定位卡片容器的逻辑保持不变 ---
    console.log("定位“飞书提醒”所在的卡片容器...");
    const anchor = textContains("飞书提醒 ").visibleToUser(true).findOne(5000); // 兼容"飞书提醒 "的空格问题
    if (!anchor) {
        console.error("错误: 找不到“飞书提醒”锚点。");
        return;
    }
    let messageContainer = anchor.parent().parent();
    if (!messageContainer) {
        console.error("错误: 未能找到正确的卡片容器。");
        return;
    }
    console.log("✓ 成功定位到卡片父容器。");

    // --- 步骤 3: 找到目标区域的逻辑保持不变 ---
    console.log("正在卡片内查找目标点击区域...");
    const targetArea = messageContainer.findOne(className("com.lynx.tasm.behavior.ui.LynxFlattenUI"));
    if (!targetArea) {
        console.error("致命错误：在卡片容器内未能找到目标区域 (Lynx控件)。");
        return;
    }

    // --- 步骤 4: 核心优化！计算更精确的点击坐标 ---
    const bounds = targetArea.bounds();
    
    // 水平位置仍然是中心点
    const clickX = bounds.centerX();
    
    // 垂直位置调整为从顶部向下 85% 的地方，更准确地命中按钮
    const clickY = bounds.top + Math.round(bounds.height() * 0.85); 

    console.log(`✓ 找到了目标区域，将在优化后的精确点 (${clickX}, ${clickY}) 进行点击...`);
    
    if (click(clickX, clickY)) {
        console.log("✓✓✓ 精确坐标点击成功！任务完成！");
    } else {
        console.error("错误：精确坐标点击执行失败。");
    }
}

/**
 * 使用 swipe 手势滚动到指定列表的底部
 * (当 scrollForward 失效时的最佳替代方案)
 * @param {string} scrollableViewId - 可滚动控件的ID，我们用它来确定滑动的区域
 * @param {number} swipes - 执行滑动的次数
 */
function scrollToBottomWithSwipe(scrollableViewId, swipes) {
    swipes = swipes || 20; // 默认滑动20次

    // 步骤 1: 找到列表，我们只需要它的位置和大小信息
    let scrollableArea = id(scrollableViewId).findOne(3000);
    if (!scrollableArea) {
        console.error(`错误：找不到ID为 "${scrollableViewId}" 的控件以确定滑动区域。`);
        return;
    }

    console.log("已找到列表，将使用 swipe 手势进行滚动...");

    // 步骤 2: 获取滑动区域的边界
    const bounds = scrollableArea.bounds();

    // 步骤 3: 在这个区域内，从下向上滑动
    // 为了避免滑到屏幕边缘的导航栏等，我们在区域内部进行操作
    const startX = bounds.centerX();
    const startY = bounds.bottom - 200; // 从靠近底部200像素的地方开始
    const endY = bounds.top + 200; // 滑动到靠近顶部200像素的地方

    for (let i = 0; i < swipes; i++) {
        console.log(`执行第 ${i + 1}/${swipes} 次滑动...`);
        
        // 执行滑动，持续时间300-400毫秒比较真实
        swipe(startX, startY, startX, endY, 350);
        
        // 等待UI响应
        sleep(500);
    }

    console.log(`✓ 已完成 ${swipes} 次滑动操作。`);
}
