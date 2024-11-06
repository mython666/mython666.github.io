class TreasureMap {
    static async getInitialClue() {
        return "在古老的图书馆里找到了第一个线索...";
    }

    static async findOldMap() {
        return "在图书馆的一个秘密房间里找到了一张古老的地图...";
    }

    static async decodeAncientScript(clue) {
        if (!clue) {
            throw new Error("没有线索可以解码!");
        }
        return "解码成功!宝藏在一座古老的神庙中...";
    }

    static async interpretRunes() {
        return "地图上的古文揭示了一个神秘洞穴的位置...";
    }

    static async searchTemple(location) {
        const random = Math.random();
        if (random < 0.5) {
            throw new Error("糟糕!遇到了神庙守卫!");
        }
        return "找到了一个神秘的箱子...";
    }

    static async exploreCave() {
        return "在神秘洞穴中找到了一把金色钥匙...";
    }

    static async openTreasureBox(key) {
        return "恭喜!你找到了传说中的宝藏!";
    }
}

let currentStepIndex = localStorage.getItem('currentStepIndex') || 0;
currentStepIndex = parseInt(currentStepIndex);
let consecutiveFails = 0; // 连续失败计数器
const steps = Array.from(document.getElementsByClassName('step'));

function updateStep(step, message) {
    step.classList.remove('hidden');
    step.classList.add('show');
    step.querySelector('p').textContent = message;
    step.querySelector('img').src = step.getAttribute('data-image');
}

async function nextStep() {
    try {
        if (currentStepIndex === 0) {
            const clue = await TreasureMap.getInitialClue();
            updateStep(steps[currentStepIndex], clue);
        } else if (currentStepIndex === 1) {
            const oldMap = await TreasureMap.findOldMap();
            updateStep(steps[currentStepIndex], oldMap);
        } else if (currentStepIndex === 2) {
            const location = await TreasureMap.decodeAncientScript(steps[0].querySelector('p').textContent);
            updateStep(steps[currentStepIndex], location);
        } else if (currentStepIndex === 3) {
            const runes = await TreasureMap.interpretRunes();
            updateStep(steps[currentStepIndex], runes);
        } else if (currentStepIndex === 4) {
            const box = await TreasureMap.searchTemple(steps[2].querySelector('p').textContent);
            updateStep(steps[currentStepIndex], box);
        } else if (currentStepIndex === 5) {
            const cave = await TreasureMap.exploreCave();
            updateStep(steps[currentStepIndex], cave);
        } else if (currentStepIndex === 6) {
            const key = "golden_key";
            const treasure = await TreasureMap.openTreasureBox(key);
            updateStep(steps[currentStepIndex], treasure);
        }

        currentStepIndex++;
        localStorage.setItem('currentStepIndex', currentStepIndex);

        if (currentStepIndex < steps.length) {
            setTimeout(() => {
                window.location.reload(); // 刷新页面
            }, 2000); // 每2秒自动调用一次 nextStep
        } else {
            alert("恭喜！你完成了寻宝任务！");
            localStorage.removeItem('currentStepIndex'); // 清除步数记录
        }
    } catch (error) {
        updateStep(steps[currentStepIndex], `任务失败: ${error}`);
        currentStepIndex++;
        localStorage.setItem('currentStepIndex', currentStepIndex);

        if (currentStepIndex < steps.length) {
            setTimeout(() => {
                window.location.reload(); // 刷新页面
            }, 2000); // 每2秒自动调用一次 nextStep
        } else {
            alert("任务失败！");
            localStorage.removeItem('currentStepIndex'); // 清除步数记录
        }
    }
}

// 启动主函数
if (currentStepIndex < steps.length) {
    nextStep();
} else {
    alert("恭喜！你已经完成了寻宝任务！");
    localStorage.removeItem('currentStepIndex'); // 清除步数记录
}