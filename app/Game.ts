/// <reference path="../bower_components/phaser/typescript/phaser.d.ts" />

import Pipe from './Pipe'
    /**
     * Состояние с самой игрой. 
	 * @module
     */
    class GameRunningState extends Phaser.State {

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
			this.game.load.image('gameBackground', 'background.png');
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

export {
    GameRunningState as default
};