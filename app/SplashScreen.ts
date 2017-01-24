/// <reference path="../bower_components/phaser/typescript/phaser.d.ts" />    
    /**
     * Класс представляющий собой начальное состояние игры (SplashScreen)
	 * @module
     */
    class TitleScreenState extends Phaser.State {

        /**
         * Контекст выполнения игры
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Game.html 
         */
        game: Phaser.Game;

        /**
         * Конструктор сцены со SplashScreen'ом
         */
        constructor() {
            super();
        }

        /**
         * Спрайт собаки на начальном экране
         * Объект в рамках Framework'a: https://phaser.io/docs/2.6.2/Phaser.Sprite.html
         */
        titleScreenImage: Phaser.Sprite;
		clickText: Phaser.Sprite;

        /**
        * Этот метод запускается сразу же после того, как будет создан инстанс этого класса.
        * Метод загружает в game спрайт собаки.
        *
        * @method https://phaser.io/docs/2.6.2/Phaser.State.html#preload
        */
        preload() {
            this.load.image("logo", "TitleDoggo.gif");
			this.load.image("click", "click.png");
        }

        /**
         * Метод отрабатывающий сразу же после preload()
         * Инициализирует titleScreenImage и начинает ловить нажатия мышки, рисует анимацию и добавляет текст на сцену.
         *
         * @method https://phaser.io/docs/2.6.2/Phaser.State.html#create
         */
        create() {
            this.titleScreenImage = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-100, 'logo');
            this.titleScreenImage.anchor.setTo(0.5, 0.5);
            this.game.add.tween(this.titleScreenImage.scale).to({ x: 2, y: 2 }, 2000, Phaser.Easing.Bounce.Out, true);
			this.clickText = this.game.add.sprite(40, this.titleScreenImage.y + this.titleScreenImage.height + 20,"click");
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
    TitleScreenState as default
};