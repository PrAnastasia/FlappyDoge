/// <reference path="../bower_components/phaser/typescript/phaser.d.ts" />	
    /**
     * Класс представляющий собой конечное состояние игры 
	 * @module
     */
    class ScoreScreenState extends Phaser.State {

        /**
         * Контекст выполнения игры
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Game.html 
         */
        game: Phaser.Game;
		
		/**
         * Canvas объект, который будет отрисовывать текущий счёт на сцене.
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Text.html
         */
        scoreText: Phaser.Text;
		
		/**
         * Текущий счёт игры (количество пройденных труб)
         */
        score: number;
		
		/**
         * Переменная для хранения максимального счёта. 
         */
        topScore: number;
		
        /**
         * Конструктор сцены 
         */
        constructor() {
            super();
        }

        /**
         * Надписи окончания игры на экране 
         * Объект в рамках Framework'a: https://phaser.io/docs/2.6.2/Phaser.Sprite.html
         */
		clickText: Phaser.Sprite;
		restartText: Phaser.Sprite;

        /**
        * Этот метод запускается сразу же после того, как будет создан инстанс этого класса.
        * Метод загружает в game спрайт
        *
        * @method https://phaser.io/docs/2.6.2/Phaser.State.html#preload
        */
        preload() {
            this.load.image("gameover", "gameover.png");
			this.load.image("restart", "restart.png");
        }

        /**
         * Метод отрабатывающий сразу же после preload()
         * Инициализирует clickText и начинает ловить нажатия мышки, рисует анимацию и добавляет текст на сцену.
         *
         * @method https://phaser.io/docs/2.6.2/Phaser.State.html#create
         */
        create() {
            this.clickText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-200, 'gameover');
            this.clickText.anchor.setTo(0.5, 0.5);
			this.restartText = this.game.add.sprite(0, this.clickText.y + this.clickText.height + 70, 'restart');
			this.game.stage.setBackgroundColor("#000000");
			this.score = localStorage.getItem("FlappyScore")==null ? 0 : +localStorage.getItem("FlappyScore");
			this.topScore = localStorage.getItem("topFlappyScore")==null ? 0 : +localStorage.getItem("topFlappyScore");
			this.scoreText = this.game.add.text(this.game.world.centerX-50, this.game.world.centerY+40, "-", {
                font: "bold 20px Arial",
                fill: "#FFFFFF"
            });
			this.scoreText.text = "SCORE: "+this.score+ "\nBEST: "+this.topScore;;
            this.input.onTap.addOnce(this.titleClicked,this); 
        }

        /**
         * Метод, который отработает при клике по страйпу собаки. Меняет текущую сцену (Phaser.State) на GameRunningState
         */
        titleClicked (){
            this.game.state.start("GameRunningState");
        }
		
    }

export {
    ScoreScreenState as default
};