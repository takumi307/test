document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const goldDisplay = document.getElementById('gold');
    const attackPowerDisplay = document.getElementById('attack-power');
    const enemyHpDisplay = document.getElementById('enemy-hp');
    const upgradeCostDisplay = document.getElementById('upgrade-cost');
    const upgradeAttackButton = document.getElementById('upgrade-attack');
    const enemyArea = document.getElementById('enemy');

    // ゲームの状態
    let gold = 0;
    let attackPower = 1;
    let enemy = {
        maxHp: 10,
        currentHp: 10,
        goldReward: 5,
    };
    let upgradeCost = 10;

    // UIを更新する関数
    function updateUI() {
        goldDisplay.textContent = gold;
        attackPowerDisplay.textContent = attackPower;
        enemyHpDisplay.textContent = enemy.currentHp;
        upgradeCostDisplay.textContent = upgradeCost;
    }

    // 新しい敵を生成する関数
    function spawnNewEnemy() {
        const newMaxHp = Math.floor(enemy.maxHp * 1.2);
        const newGoldReward = Math.floor(enemy.goldReward * 1.1);
        enemy = {
            maxHp: newMaxHp,
            currentHp: newMaxHp,
            goldReward: newGoldReward,
        };
    }

    // 攻撃処理
    function attackEnemy(damage) {
        enemy.currentHp -= damage;
        if (enemy.currentHp <= 0) {
            gold += enemy.goldReward;
            spawnNewEnemy();
        }
        updateUI();
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