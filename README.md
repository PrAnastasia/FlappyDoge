## Развертывание

Воссоздание игры FlappyBird в другом стиле на движке phaser.io

```
$ Скачать архив
$ Проверить что Node.JS, Npm, Bower, Gulp установлены 
$ Если их нет запустить installib.cmd от имени администратора(!)(только при первом запуске)
$ Выполнить все скрипты(всегда отвечать y)
$ Выполнить start.cmd в папке с приложением
$ Готово. Сервер запущен на 3000 порту (http://localhost:3000)
$ TypeDoc доступен по адресу http://localhost:3000/docs
```

При работе с документацией обязательно убрать галочку с отображения наследуемых методов
![img](http://i.imgur.com/NeLiV8c.png)

## Структура
```
Исходные коды скриптов в /app
Less-Стили в /styles
Ресурсы игры (музыка, звуки, картинки) в /assets

Собранное приложение будет в /public
Собранная документация появится в /docs

Конфиг для ExpressJS в корне, файл server.js
```