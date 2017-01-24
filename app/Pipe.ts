/// <reference path="../bower_components/phaser/typescript/phaser.d.ts" />    

import GameRunningState from './Game'
    /**
     * Класс предствляет собой трубу (кость), через которые скачет пёс
	 * @module
     */
    export class Pipe extends Phaser.Sprite {

        /**
         * Ключ, который показывает, нужно ли добавлять очков за прохождение через элемент (по умолчанию = true), выставляется в false, после того, как очки были начислены
         */
        private giveScore: boolean;

        /**
         * Сюда сохраняется контекст выполенения, через него имеем доступ к полю со счётом и методу для обновления текста со счётом на сцене
         */
        context: GameRunningState;

        /**
         * Конструктор "трубы"
         * @param context Сюда передаём инстанс контекста выполнения
         * @param x x-координата верхнего левого края трубы
         * @param y y-координата верхнего левого края трубы
         * @param speed скорость с которой должна лететь труба
         */
        constructor(context: GameRunningState, x: number, y: number, speed: number) {
            super(context.game, x, y, "pipe");
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.velocity.x = speed;
            this.giveScore = true;
            this.context = context;
        }

        /**
         * Унаследовнный метод от Phaser.Game в котором происходит обработка тика игры
         * Здесь мы проверяем нужно ли дать очки игроку за прохождение и улетел ли уже объект со сцены, чтобы его можно было удалить.
         *
         * @method https://phaser.io/docs/2.6.2/Phaser.State.html#update
         */
        update() {
            if(this.x+this.width<this.context.bird.x && this.giveScore){
                this.giveScore = false;
                this.context.score+=0.5;
                this.context.updateScore(true);
            }
            if(this.x<-this.width){
                this.destroy();
            }
        }

    };

export {
    Pipe as default
};