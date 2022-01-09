const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_HEAL = 'HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
const battleLog = [];


function writeToLog (ev, val, playerHealth, monsterHelath){
    logEntry = {
        event: ev,
        value: val,
        finalPlayerHealth: playerHealth,
        finalMonsterHealth: monsterHelath
    };

    switch (ev){
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'Player';
            break;
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'Player';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'Monster',
                finalPlayerHealth: playerHealth,
                finalMonsterHealth: monsterHelath
            };
            break;
        case LOG_EVENT_HEAL:
            logEntry = {
                event: ev,
                value: val,
                target: 'Player',
                finalPlayerHealth: playerHealth,
                finalMonsterHealth: monsterHelath
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: val,
                finalPlayerHealth: playerHealth,
                finalMonsterHealth: monsterHelath
            };
            break;
        default:
            logEntry = {};
    }

    battleLog.push(logEntry);
  
}


function getMaxLifeValue(){
    const enteredValue = prompt('Choose a Maximum life', '100');
    const parsedValue = parseInt(enteredValue);

    if (isNaN(parsedValue) || parsedValue <=0){
        throw{message: 'Invalid Input, enter a number!'};
    }
    return parsedValue;
}

try {
    choosenMaxLife = getMaxLifeValue();
} catch (error) {
    console.error;
    choosenMaxLife = 100;
    alert('Invalid input, default value 100 was selected ');
}

let currentMonsterHealth = choosenMaxLife;
let currentPlayerHealth = choosenMaxLife;
let hasBonus = true;


adjustHealthBars(choosenMaxLife);


function reset(){
    currentMonsterHealth = choosenMaxLife;
    currentPlayerHealth = choosenMaxLife;
    resetGame(choosenMaxLife);
}


function endRound(){
    const initialPlayerHealth = currentPlayerHealth
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonus){
        hasBonus = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert ('You would have died but bonus life saved you!')
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('You Won!');

        writeToLog(
            LOG_EVENT_GAME_OVER,
            'YOU WON',
            currentPlayerHealth,
            currentMonsterHealth
        )

    } else if (currentPlayerHealth <=0 && currentMonsterHealth > 0){
        alert('You Lost!');

        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentPlayerHealth,
            currentMonsterHealth
        )

    } else if ( currentMonsterHealth <= 0 && currentPlayerHealth <=0){
        alert('You have a draw!')

        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentPlayerHealth,
            currentMonsterHealth
        )
    }

    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0){
        reset();
    }
}


function attackMonster(mode){
    let maxDamage;
    let logEvent
    if (mode === MODE_ATTACK){
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK){
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    writeToLog(
        logEvent,
        damage,
        currentPlayerHealth,
        currentMonsterHealth
    );

    endRound();

}
function attackHandler(){
    attackMonster(MODE_ATTACK)
}
function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK)
}


function healHandler(){
    let healValue;
    if (currentPlayerHealth >= choosenMaxLife - HEAL_VALUE){
        alert("You can't heal more.")
        healValue = choosenMaxLife - currentPlayerHealth;
    } else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;

    writeToLog(
        LOG_EVENT_HEAL,
        healValue,
        currentPlayerHealth,
        currentMonsterHealth
    );

    endRound();
}


function printLogHandler(){
    console.log(battleLog);
}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', printLogHandler);