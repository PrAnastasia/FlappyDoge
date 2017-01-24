import GameRunningState from './Game'
import ScoreScreenState from './Score'
import TitleScreenState from './SplashScreen'

    /**
     * Основной класс модуля игры.
	 * @module
	 * @preferred
     */    
    class FlappyDogeGameStarter {
        /**
         * Здесь содержится весь контекст выполнения игры (ассесты, события и пр.).
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Game.html 
         */
        game: Phaser.Game;

        /**
         * Конструктор. Создаёт инстанс Phaser.Game, добавляет в него два состояния - SplashScreen и саму игру и передаёт управление в TitleScreenState.create()
         */
        constructor() {
            this.game = new Phaser.Game(640, 800, Phaser.AUTO, 'content');

            this.game.state.add("GameRunningState", GameRunningState, false);
            this.game.state.add("TitleScreenState", TitleScreenState, false);
			this.game.state.add("ScoreScreenState", ScoreScreenState, false);
            this.game.state.start("TitleScreenState", true, true); // Референс к ключам: https://phaser.io/docs/2.6.2/Phaser.StateManager.html#start
        }
    }

export {
    FlappyDogeGameStarter as default
};