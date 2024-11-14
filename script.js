// 从文本文件中读取数据
async function fetchDataFromTxt() {
    try {
        const response = await fetch('data.txt');
        const text = await response.text();
        const data = {};
        text.split('\n').forEach(line => {
            const parts = line.split(': ');
            if (parts.length === 2) {
                data[parts[0]] = parts[1];
            }
        });
        return data;
    } catch (error) {
        console.error("读取数据失败:", error);
        return {};
    }
}



class TreasureMap {
    // 获取初始线索
    static async getInitialClue() {
        return "在古老的图书馆里找到了第一个线索...";
    }

    // 寻找古老地图
    static async findOldMap() {
        return "在图书馆的一个秘密房间里找到了一张古老的地图...";
    }

    // 解码古文
    static async decodeAncientScript(clue) {
        if (!clue) {
            throw new Error("没有线索可以解码!");
        }
        return "解码成功!宝藏在一座古老的神庙中...";
    }

    // 解读符文
    static async interpretRunes() {
        return "地图上的古文揭示了一个神秘洞穴的位置...";
    }

    // 搜索神庙
    static async searchTemple(location) {
        return "找到了一个神秘的箱子...";
    }

    // 探索洞穴
    static async exploreCave() {
        return "在神秘洞穴中找到了一把金色钥匙...";
    }

    // 打开宝藏箱
    static async openTreasureBox(key) {
        return "恭喜!你找到了传说中的宝藏!";
    }
}



// 当前步骤索引，从本地存储加载或默认为0
let currentStepIndex = localStorage.getItem('currentStepIndex') || 0;
currentStepIndex = parseInt(currentStepIndex);

// 获取所有步骤元素
const steps = Array.from(document.getElementsByClassName('step'));

// 更新当前步骤显示信息
function updateStep(step, message) {
    step.querySelector('p').textContent = message;
    step.querySelector('img').src = step.getAttribute('data-image');
    step.classList.remove('hidden');
    step.classList.add('show');
}

// 隐藏所有步骤
function hideAllSteps() {
    steps.forEach(step => {
        step.classList.remove('show');
        step.classList.add('hidden');
    });
}

// 记录玩家信息
function logPlayerInfo(result) {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.gameHistory.push({
        step: currentStepIndex,
        result: result
    });
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
}

// 执行下一步任务
async function nextStep() {
    try {
        hideAllSteps();
        switch (currentStepIndex) {
            case 0:
                const clue = await TreasureMap.getInitialClue();
                updateStep(steps[currentStepIndex], clue);
                break;
            case 1:
                const oldMap = await TreasureMap.findOldMap();
                updateStep(steps[currentStepIndex], oldMap);
                break;
            case 2:
                const location = await TreasureMap.decodeAncientScript(steps[0].querySelector('p').textContent);
                updateStep(steps[currentStepIndex], location);
                break;
            case 3:
                const runes = await TreasureMap.interpretRunes();
                updateStep(steps[currentStepIndex], runes);
                break;
            case 4:
                const box = await TreasureMap.searchTemple(steps[2].querySelector('p').textContent);
                updateStep(steps[currentStepIndex], box);
                break;
            case 5:
                const cave = await TreasureMap.exploreCave();
                updateStep(steps[currentStepIndex], cave);
                break;
            case 6:
                const key = "golden_key";
                const treasure = await TreasureMap.openTreasureBox(key);
                updateStep(steps[currentStepIndex], treasure);
                break;
            default:
                alert("恭喜！你完成了寻宝任务！");
                localStorage.removeItem('currentStepIndex'); // 清除步数记录
                return;
        }

        currentStepIndex++;
        localStorage.setItem('currentStepIndex', currentStepIndex);
        logPlayerInfo('成功');

        if (currentStepIndex < steps.length) {
            setTimeout(nextStep, 2000); // 每2秒自动调用一次 nextStep
        }
    } catch (error) {
        hideAllSteps();
        updateStep(steps[currentStepIndex], `任务失败: ${error}`);
        currentStepIndex++;
        localStorage.setItem('currentStepIndex', currentStepIndex);
        logPlayerInfo('失败');

        if (currentStepIndex < steps.length) {
            setTimeout(nextStep, 2000); // 每2秒自动调用一次 nextStep
        } else {
            alert("任务失败！");
            localStorage.removeItem('currentStepIndex'); // 清除步数记录
        }
    }
}

// 页面加载时初始化玩家信息
window.onload = async function () {
    const storedPlayerInfo = localStorage.getItem('playerInfo');
    if (!storedPlayerInfo) {
        const playerInfo = {
            id: Date.now().toString(),
            nickname: prompt("请输入你的昵称:"),
            gameHistory: []
        };
        localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    }

    const music = document.getElementById('music');
    if (music) {
        // 检查音乐文件是否存在
        music.addEventListener('error', () => {
            console.error("音乐文件加载失败，请检查路径是否正确。");
        });

        // 在用户点击“开始游戏”按钮后播放音乐
        document.getElementById('start-game').addEventListener('click', () => {
            music.play().catch(error => {
                console.error("音乐播放失败:", error);
            });
            nextStep();
        });

        // 恢复音乐播放状态
        const isMusicPlaying = localStorage.getItem('isMusicPlaying') === 'true';
        if (isMusicPlaying) {
            music.play().catch(error => {
                console.error("音乐恢复播放失败:", error);
            });
        }
    }

    // 初始化数据
    const data = await fetchDataFromTxt();
    console.log("读取的数据:", data);
};

// 监听音乐播放状态变化
document.addEventListener('visibilitychange', () => {
    const music = document.getElementById('background-music');
    if (document.hidden) {
        localStorage.setItem('isMusicPlaying', music.paused ? 'false' : 'true');
        music.pause();
    } else {
        if (localStorage.getItem('isMusicPlaying') === 'true') {
            music.play().catch(error => {
                console.error("音乐恢复播放失败:", error);
            });
        }
    }
});

// 启动主函数
if (currentStepIndex < steps.length) {
    nextStep();
} else {
    alert("恭喜！你已经完成了寻宝任务！");
    localStorage.removeItem('currentStepIndex'); // 清除步数记录
}