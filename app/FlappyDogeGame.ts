/// <reference path="../bower_components/phaser/typescript/phaser.d.ts" />
/// <reference path="BackgroundHelper.ts" />

import BackgroudHelper from './BackgroundHelper';
/**
 * Основной модуль игры
 * @preferred
 */
module FlappyDogeGame {

    /**
     * Класс предствляет собой трубу (кость), через которые скачет пёс
     */
    class Pipe extends Phaser.Sprite {

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

    }

    export class GameRunningState extends Phaser.State {

        /**
         * Контекст выполнения игры
         * Что предствляет из себя объект в рамках этого Framework'a можно посмотреть тут: https://phaser.io/docs/2.6.2/Phaser.Game.html 
         */
        game: Phaser.Game;

        /**
         * Спрайт собаки (FlappyBird'a)
         * Объект в рамках Framework'a: https://phaser.io/docs/2.6.2/Phaser.Sprite.html
         */
        bird: Phaser.Sprite;

        /**
         * "Сила" с которой падает спрайт собаки (FlappyBird'a)
         */
        birdGravity: number;        

        /**
         * Горизонтальная скорость спрайта собаки (FlappyBird'a)
         */
        birdSpeed: number;          

        /**
         * Сила "взмаха" спрайта собаки (FlappyBird'a)
         */
        birdFlapPower: number;      
        
        /**
         * Время ожидания в мс перед тем как создать новые кости
         */
        pipeInterval: number;       

        /**
         * Размер дыры между костями
         */
        pipeHole: number;

        /**
         * Группа труб, проверка коллизии привязывается именно к этому объекту.
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Group.html
         */
        pipeGroup: Phaser.Group;

        /**
         * Текущий счёт игры (количество пройденных труб)
         */
        score: number;

        /**
         * Canvas объект, который будет отрисовывать текущий счёт на сцене.
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Text.html
         */
        scoreText: Phaser.Text;

        /**
         * Переменная для хранения максимального счёта. 
         * Записывается в localStorage браузера
         * Подробнее: https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage
         */
        topScore: number;

        /**
         * Объект для воспроизведения звука столкновения с трубой
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Sound.html
         */
        hitSound: Phaser.Sound;

        /**
         * Объект для воспроизведения звука получения очка за прохождения группы труб
         */
        pointSound: Phaser.Sound;

        /**
         * Объект для воспроизведения фоновой музыки
         */
        music: Phaser.Sound;

        /**
         * Флаг, ограничивающий возможность запуска фоновой музыки только один раз
         */
        musicStarted: boolean;

        /**
         * Объект для хранения фонового спрайта, позволяющий делать его бесконечный скролл
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.TileSprite.html
         */
        gameBackground: Phaser.TileSprite;
		
		/**
         * Создание ключа для паузы в игре
         */
		spaceKey;
		
		/**
         * Переменная в которой мы буем хранить громкость музыки
         */
		musicVolume: number;

        /**
         * Конструктор сцены игры. Тут только инициализация полей класса.
         */
        constructor() {
            super();
            this.birdGravity = 1000;
            this.birdSpeed = 225;
            this.birdFlapPower = 400;
            this.pipeInterval = 2000;
            this.pipeHole = 200;
            this.score = 0;
            this.musicStarted = false;
			this.musicVolume = 0.5;
        }

        /**
        * Этот метод запускается сразу же после того, как будет создан инстанс этого класса.
        * Метод загружает необходимые ассесты (звуки, спрайты, фон)
        *
        * @method https://phaser.io/docs/2.6.2/Phaser.State.html#preload
        */
        preload() {
            this.game.load.image("bird", "bird.png"); 
            this.game.load.image("pipe", "pipe.png");    
            this.game.load.audio('hit', 'explosion.mp3', true);
            this.game.load.audio('point', 'numkey.wav', true);
            this.game.load.audio('music', 'dogsong.ogg', true);
			this.game.load.image('gameBackground', new BackgroudHelper().getBackgroudImage());
        }
		
		
        /**
         * Метод отрабатывающий в ходе первой загрузки / перезагрузки игры.
         * Здесь выставляются начальные позиции пёсика, создаются таймеры, обнуляется счёт, создаются listener'ы для эвентов и т.д.
         *
         * @method https://phaser.io/docs/2.6.2/Phaser.State.html#create
         */
        create() {
            this.gameBackground = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'gameBackground');
			
            this.pointSound = this.game.add.audio('point');
            this.hitSound = this.game.add.audio('hit');
            this.pipeGroup = this.game.add.group();
            this.music = this.game.add.audio('music');
            if (this.musicStarted) {
                this.music.stop();
            }
            this.music.loopFull(this.musicVolume);
            this.musicStarted = true;
			
            this.score = 0;
            this.topScore = localStorage.getItem("topFlappyScore")==null ? 0 : +localStorage.getItem("topFlappyScore");
                            //читается как взять из хранилища ключ "topFlappyScore" и если он есть, то скатить к числу, иначе поставить 0.
            this.scoreText = this.game.add.text(540, 10, "-", {
                font: "bold 16px Arial",
                fill: "#FFFFFF"
            });
            this.updateScore(false);
			
            this.game.stage.setBackgroundColor("#2F3F4F");
            this.game.stage.disableVisibilityChange = true;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.bird = this.game.add.sprite(80,240,"bird");
            this.bird.anchor.set(0.5);
            this.game.physics.arcade.enable(this.bird);
            this.bird.body.gravity.y = this.birdGravity;
            this.game.input.onDown.add(this.flap, this);
            this.game.time.events.loop(this.pipeInterval, () => this.addPipes());
            this.addPipes();

			this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.spaceKey.onDown.add(this.togglePause, this);
        }
		
		/**
         * Метод который отрабатывает при нажатии пробела и вкл/выкл режим паузы в игре
         */
		togglePause(): void {
		this.game.paused = (this.game.paused) ? false : true;
		}
		
        /**
         * Этот метод выполняется фреймворком раз в тик. 
         * Здесь происходит проверка коллизии, не улетел ли пёс за сцену и скролл заднего фона.
         *
         * @method https://phaser.io/docs/2.6.2/Phaser.State.html#update
         */
        update(){
            this.game.physics.arcade.collide(this.bird, this.pipeGroup, () => this.die(true));
            if(this.bird.y>this.game.height || this.bird.y < -30){
                this.die(false);
            }
            this.gameBackground.tilePosition.x -= 2;
			let currentMusicVolumeSetting = $(".volumeCont input[type=range]").val();
            if (currentMusicVolumeSetting != this.musicVolume) {
                this.musicVolume = currentMusicVolumeSetting;
                this.music.volume = this.musicVolume;
                this.music.update(); 
            }
        }
		

        /**
         * Метод который отрабатывает при клике мыши и заставляет пса (FlappyBird'a) лететь вверх.
         */
        flap(): void {
            this.bird.body.velocity.y = -this.birdFlapPower;
        }

        /**
         * Метод, который обновляет scoreText актуальным значением score.
         * 
         * @param playsound Флаг отвечающий за проигрывания звука получения очков. Всегда равен true, кроме первого вызова из create(), где счёт устанавливается в 0
         */
        updateScore(playsound: boolean): void {
            this.scoreText.text = "Score: "+this.score+"\nBest: "+this.topScore;
            if (playsound === true) this.pointSound.play();    
        }

        /**
         * Метод, который отрабатывает при создании сцены this.create() и далее каждые две секунды. Создаёт два инстанса Pipe с фиксированной дырой между ними, но случайным положением.
         */
        addPipes(): void {
            let pipeHolePosition = this.game.rnd.between(150,630-this.pipeHole);
            let upperPipe = new Pipe(this,640,pipeHolePosition-480,-this.birdSpeed);
            this.game.add.existing(upperPipe);
            this.pipeGroup.add(upperPipe);
            let lowerPipe = new Pipe(this,640,pipeHolePosition+this.pipeHole,-this.birdSpeed);
            this.game.add.existing(lowerPipe);
            this.pipeGroup.add(lowerPipe);
        }

        /**
         * Метод срабатыващий если игрок проиграл. Записывает в localStorage рекорд и перезапускает сцену. 
         *
         * @param playsound Флаг отвечающий за проигрывания звука столкновения. Если отработала проверка коллизии то будет равен true.
         */
        die(playsound: boolean): void {
            localStorage.setItem("topFlappyScore",Math.max(this.score, this.topScore).toString());
			localStorage.setItem("FlappyScore",this.score.toString());
            if (playsound !== false) this.hitSound.play(); 
			this.music.destroy(true);
            this.game.state.start("ScoreScreenState");    
        }

    }

    /**
     * Класс представляющий собой начальное состояние игры (SplashScreen)
     */
    export class TitleScreenState extends Phaser.State {

        /**
         * Контекст выполнения игры
         * Подробнее: https://phaser.io/docs/2.6.2/Phaser.Game.html 
         */
        game: Phaser.Game;
		
		/**
         * Кнопка переключения фона на день
         */
		dayButton;
		
		/**
         * Кнопка переключения фона на ночь
         */
		nightButton;

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
			this.game.load.image("nightButton", "nightButton.png");
			this.game.load.image("dayButton", "dayButton.png");
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
			this.dayButton = this.game.add.button(210, 560, 'dayButton', this.actionOnClick, this);
			this.nightButton = this.game.add.button(375, 575, 'nightButton', this.actionOnClick2, this);
            this.input.onTap.addOnce(this.titleClicked,this); 
        }

        /**
         * Метод, который отработает при клике по страйпу собаки. Меняет текущую сцену (Phaser.State) на GameRunningState
         */
        titleClicked (){
            this.game.state.start("GameRunningState");
        }
		
		/**
         * Метод, который отработает при клике на кнопку
         */
		actionOnClick ():void {
		window.location.href = 'http://localhost:3000/?bgurl=daybg.png';
		this.game.state.start("GameRunningState");
		}
		
		actionOnClick2 ():void {
		window.location.href = 'http://localhost:3000/?bgurl=background.png';
		this.game.state.start("GameRunningState");
		}
		
    }
	
	/**
     * Класс представляющий собой конечное состояние игры 
     */
    export class ScoreScreenState extends Phaser.State {

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
			this.scoreText = this.game.add.text(this.game.world.centerX-50, this.game.world.centerY+40, "-", {
                font: "bold 20px Arial",
                fill: "#FFFFFF"
            });
			this.scoreText.text = "SCORE: "+this.score;
            this.input.onTap.addOnce(this.titleClicked,this); 
        }

        /**
         * Метод, который отработает при клике по страйпу собаки. Меняет текущую сцену (Phaser.State) на GameRunningState
         */
        titleClicked (){
            this.game.state.start("GameRunningState");
        }
		
    }

    /**
     * Основной класс модуля игры.
     */    
    export class Start {
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

}

export {
    FlappyDogeGame as default
};