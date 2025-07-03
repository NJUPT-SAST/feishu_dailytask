/**
 * 调试专用函数 V2：
 * 尝试对找到的Lynx控件进行“向下挖掘”，探索其子节点
 */
function debug_exploreChildren() {
    console.log("正在定位“飞书提醒”卡片...");
    const anchor = textContains("飞书提醒 ").visibleToUser(true).findOne(3000);
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

    // 找到那个大的可点击区域
    const lynxContainer = messageContainer.findOne(className("com.lynx.tasm.behavior.ui.LynxFlattenUI").clickable(true));

    if (!lynxContainer) {
        console.error("错误：未能找到那个大的可点击Lynx区域。");
        return;
    }
    
    console.log(`✓ 找到了父级Lynx控件，尺寸(宽x高): ${lynxContainer.bounds().width()} x ${lynxContainer.bounds().height()}`);
    console.log("--- 开始向下挖掘：探索其子节点 ---");
    
    // 核心：获取所有子节点
    const children = lynxContainer.children();

    if (children.empty()) {
        console.log("挖掘结果：此Lynx控件内部没有可被识别的子节点。");
        console.log("结论：我们的脚本已经定位到了最深层级，无法再向下选择。");
    } else {
        console.log(`挖掘成功！找到 ${children.length} 个子节点，信息如下：`);
        children.forEach((child, index) => {
            let bounds = child.bounds();
            console.log(
                `[子节点 ${index + 1}] ` +
                `类名: ${child.className()}, ` +
                `文本: "${child.text()}", ` +
                `尺寸(宽x高): ${bounds.width()} x ${bounds.height()}`
            );
        });
        console.log("结论：可以从这些子节点中进一步筛选。");
    }
    console.log("--- 调试结束 ---");
}

// --- 执行调试 ---
debug_exploreChildren();