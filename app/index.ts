/**
 * Корневой файл прилоежния
 */
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="./imports/bootstrap.d.ts" />
;

import $ = require('jquery');
window['jQuery'] = window['$'] = $; // Twitter Bootstrap needs jQuery as global object
import Bootstrap = require('bootstrap');
[Bootstrap]			// Use these variables somehow so imports will be compiled

import FlappyDogeGameStarter from './Start';

class FireStarter {

	/**
	 * Переменная gamе - инстанс класса Start из FlappyDogeGame, конструктор которого уже и делает все магию и запускает приложение.
	 */
	static game: FlappyDogeGameStarter;

	/**
	 * Метод, с помощью которого инициализируется переменная game и запускается сама игра.
	 */
	static RunApp(): void {
		window.onload = () => {
		    FireStarter.game = new FlappyDogeGameStarter();
		    $(".container").height($(document).height()); 
			$(".volumeCont input[type=range]").change(function() { 
		    	var _volume = Math.round($(".volumeCont input[type=range]").val() * 100);
				$("#currentVolume")[0].innerHTML=_volume.toString();
			});
		};
	}
};

FireStarter.RunApp();

