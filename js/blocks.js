/*resultview.js*/
'use strict';
import { MainView } from "./mainview.js";
import { GameView } from "./gameview.js";
import { ResultView } from "./resultview.js";

export class BlocksGame {
    #canvas;
    #context;

    #viewname = "";
    /**メイン画面 */
    #mainView = null;
    /**ゲーム画面 */
    #gameView = null;
    /**結果画面 */
    #resultView = null;
    /* */
    #intervalId = null;
    // インターバル時間
    #INTERVAL_TIME_MS = 1000 / 60;

    constructor(canvasId) {
        this.#canvas = document.getElementById(canvasId);
        if( this.#canvas === null){
            throw new Error("canvasが見つかりません");
        }
        this.#context =this.#canvas.getContext("2d");

        this.#mainView = new MainView(this.#context);
        this.#gameView = new GameView(this.#context);
        this.#resultView = new ResultView(this.#context);

        this.#viewname = "MainView";
        this.#start();
        // this.#mainView.draw();
        // this.#gameView.draw();
        // this.#resultView.draw();
    }

    //インターバルを開始する
    #start() {
        this.#intervalId = setInterval(() => {
            this.#run();
        }, this.#INTERVAL_TIME_MS);
    }

    //インターバルを停止する
    #stop() {
        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    #run() {
        switch (this.#viewname) {
            case "MainView":
                console.log("MainView")
                //ゲーム画面を描画する
                this.#gameView.draw();
                //メイン画面を描画する
                this.#mainView.draw();
                //メイン画面が非表示フラグになっている場合は次の画面に切り替える
                if(this.#mainView.isVisible === false) {
                    this.#viewname = "GameView";
                }
                break;
            case "GameView":
                console.log("GameView")
                //画面をクリアする
                this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
                //ゲームを更新する
                this.#gameView.update();
                //ゲーム画面を描画する
                this.#gameView.draw();
                if(this.#gameView.isVisible === false) {
                    this.#viewname = "ResultView";
                }
                break;
            case "ResultView":
                console.log("ResultView")
                this.#resultView.draw(this.#gameView.resultMessage);
                this.#stop();
                break;
        }
    }
    setKeydownKey(key) {
        switch(this.#viewname) {
            case "MainView":
                this.#mainView.executePlayerAction({[key]: true});
                break;
            case "GameView":
                this.#gameView.executePlayerAction({[key]: true});
                break;
            case "ResultView":
                console.log("ResultView");
                //結果画面を描画する
                this.#resultView.draw(this.#gameView.resultMessage);
                //ゲームを停止する
                this.#stop();
                break;
        }
    }
setKeyupKey(key) {
    switch(this.#viewname) {
        case "MainView":
            break;
        case "GameView":
            this.#gameView.executePlayerAction({[key]: false});
            break;
        case "ResultView":
            break;
    }
}
}
