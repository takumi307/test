package com.example.idlerpg;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.FrameLayout;

import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    // UI Elements
    private TextView stageTextView;
    private TextView goldTextView;
    private TextView attackPowerTextView;
    private TextView enemyHpTextView;
    private FrameLayout enemyView;
    private Button upgradeAttackButton;

    // Game State
    private long gold = 0;
    private int attackPower = 1;
    private long upgradeCost = 10;
    private int currentStage = 1;
    private int currentSubStage = 1;

    private static class Enemy {
        long maxHp;
        long currentHp;
        long goldReward;
    }
    private Enemy currentEnemy = new Enemy();

    // Game Loop
    private final Handler gameLoopHandler = new Handler();
    private final Runnable gameLoopRunnable = new Runnable() {
        @Override
        public void run() {
            // Auto-attack
            attackEnemy(attackPower);
            // Repeat this runnable after 1 second
            gameLoopHandler.postDelayed(this, 1000);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize UI Elements
        stageTextView = findViewById(R.id.stageTextView);
        goldTextView = findViewById(R.id.goldTextView);
        attackPowerTextView = findViewById(R.id.attackPowerTextView);
        enemyHpTextView = findViewById(R.id.enemyHpTextView);
        enemyView = findViewById(R.id.enemyView);
        upgradeAttackButton = findViewById(R.id.upgradeAttackButton);

        // Set up event listeners
        enemyView.setOnClickListener(v -> attackEnemy(attackPower));

        upgradeAttackButton.setOnClickListener(v -> {
            if (gold >= upgradeCost) {
                gold -= upgradeCost;
                attackPower++;
                upgradeCost = (long) (upgradeCost * 1.5);
                updateUI();
            }
        });

        // Start the game
        spawnNewEnemy();
        updateUI();
        gameLoopHandler.postDelayed(gameLoopRunnable, 1000);
    }

    private void attackEnemy(int damage) {
        if (currentEnemy.currentHp <= 0) return;

        currentEnemy.currentHp -= damage;

        if (currentEnemy.currentHp <= 0) {
            currentEnemy.currentHp = 0; // Prevent negative HP
            gold += currentEnemy.goldReward;

            // Stage progression
            currentSubStage++;
            if (currentSubStage > 10) {
                currentSubStage = 1;
                currentStage++;
            }
            spawnNewEnemy();
        }
        updateUI();
    }

    private void spawnNewEnemy() {
        int stageMultiplier = (currentStage - 1) * 10 + (currentSubStage - 1);
        long newMaxHp = (long) (10 * Math.pow(1.25, stageMultiplier));
        long newGoldReward = (long) (5 * Math.pow(1.15, stageMultiplier));

        currentEnemy.maxHp = newMaxHp;
        currentEnemy.currentHp = newMaxHp;
        currentEnemy.goldReward = newGoldReward;
    }

    private void updateUI() {
        stageTextView.setText(String.format(Locale.getDefault(), "ステージ: %d-%d", currentStage, currentSubStage));
        goldTextView.setText(String.format(Locale.getDefault(), "ゴールド: %d", gold));
        attackPowerTextView.setText(String.format(Locale.getDefault(), "攻撃力: %d", attackPower));
        enemyHpTextView.setText(String.format(Locale.getDefault(), "HP: %d", currentEnemy.currentHp));
        upgradeAttackButton.setText(String.format(Locale.getDefault(), "攻撃力強化 (コスト: %d)", upgradeCost));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Stop the game loop when the activity is destroyed to prevent memory leaks
        gameLoopHandler.removeCallbacks(gameLoopRunnable);
    }
}