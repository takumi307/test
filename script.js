document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const stageDisplay = document.getElementById('stage');
    const goldDisplay = document.getElementById('gold');
    const attackPowerDisplay = document.getElementById('attack-power');
    const enemyHpDisplay = document.getElementById('enemy-hp');
    const upgradeCostDisplay = document.getElementById('upgrade-cost');
    const upgradeAttackButton = document.getElementById('upgrade-attack');
    const enemyArea = document.getElementById('enemy');
    const bossTimerDisplay = document.getElementById('boss-timer');
    const timerDisplay = document.getElementById('timer');
    const playerElement = document.getElementById('player');

    // ゲームの状態
    let gold = 0;
    let attackPower = 1;
    let upgradeCost = 10;
    let currentStage = 1;
    let currentSubStage = 1;

    let enemy = {
        maxHp: 10,
        currentHp: 10,
        goldReward: 5,
        isBoss: false,
    };
    let bossTimer = 30;
    let bossTimerInterval = null;

    // UIを更新する関数
    function updateUI() {
        stageDisplay.textContent = `${currentStage}-${currentSubStage}`;
        goldDisplay.textContent = gold;
        attackPowerDisplay.textContent = attackPower;
        enemyHpDisplay.textContent = enemy.currentHp;
        upgradeCostDisplay.textContent = upgradeCost;

        // ボスの場合のスタイル変更
        const enemyElement = document.getElementById('enemy');
        if (enemy.isBoss) {
            enemyElement.classList.add('boss');
            document.querySelector('#enemy-area h2').textContent = 'ボス';
            bossTimerDisplay.style.display = 'block';
            timerDisplay.textContent = bossTimer;
        } else {
            enemyElement.classList.remove('boss');
            document.querySelector('#enemy-area h2').textContent = '敵';
            bossTimerDisplay.style.display = 'none';
        }
    }

    // 新しい敵を生成する関数
    function spawnNewEnemy() {
        // タイマーが動いていたら止める
        if (bossTimerInterval) {
            clearInterval(bossTimerInterval);
            bossTimerInterval = null;
        }

        const isBossStage = currentSubStage === 10;
        const stageMultiplier = (currentStage - 1) * 10 + (currentSubStage - 1);
        let newMaxHp = Math.floor(10 * Math.pow(1.25, stageMultiplier));
        let newGoldReward = Math.floor(5 * Math.pow(1.15, stageMultiplier));

        if (isBossStage) {
            newMaxHp *= 3; // ボスはHPが3倍
            newGoldReward *= 5; // ボスは報酬が5倍
        }

        enemy = {
            maxHp: newMaxHp,
            currentHp: newMaxHp,
            goldReward: newGoldReward,
            isBoss: isBossStage,
        };

        if (enemy.isBoss) {
            startBossTimer();
        }
    }

    // 攻撃処理
    function attackEnemy(damage) {
        if (enemy.currentHp <= 0) return; // 既に倒されている場合は何もしない

        // Player attack animation
        playerElement.classList.add('player-attack');
        setTimeout(() => {
            playerElement.classList.remove('player-attack');
        }, 200); // Animation duration is 0.2s

        const actualDamage = Math.min(damage, enemy.currentHp);
        showDamagePopup(actualDamage);

        enemy.currentHp -= actualDamage;
        if (enemy.currentHp <= 0) {
            enemy.currentHp = 0; // HPがマイナスにならないように
            gold += enemy.goldReward;

            if (enemy.isBoss) {
                clearInterval(bossTimerInterval); // ボスを倒したらタイマーを止める
                bossTimerInterval = null;
            }

            // ステージ進行
            currentSubStage++;
            if (currentSubStage > 10) {
                currentSubStage = 1;
                currentStage++;
            }

            spawnNewEnemy();
        }
        updateUI();
    }

    function failBoss() {
        alert("時間切れ！ステージ1-1に戻ります。");
        currentStage = 1;
        currentSubStage = 1;
        spawnNewEnemy();
        updateUI();
    }

    function showDamagePopup(damage) {
        const popup = document.createElement('div');
        popup.textContent = damage;
        popup.className = 'damage-popup';
        enemyArea.appendChild(popup);

        // Remove the popup after the animation finishes (1s)
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    function startBossTimer() {
        bossTimer = 30; // タイマーをリセット
        bossTimerInterval = setInterval(() => {
            bossTimer--;
            if (bossTimer <= 0) {
                clearInterval(bossTimerInterval);
                bossTimerInterval = null;
                failBoss();
            }
            updateUI(); // タイマー表示を更新
        }, 1000);
    }

    // 自動攻撃
    setInterval(() => {
        attackEnemy(attackPower);
    }, 1000);

    // 手動攻撃
    enemyArea.addEventListener('click', () => {
        attackEnemy(attackPower);
    });

    // 攻撃力強化
    upgradeAttackButton.addEventListener('click', () => {
        if (gold >= upgradeCost) {
            gold -= upgradeCost;
            attackPower++;
            upgradeCost = Math.floor(upgradeCost * 1.5);
            updateUI();
        }
    });

    // 初期UIの更新
    updateUI();
});