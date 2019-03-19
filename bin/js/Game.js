/*
* 程序入口
*/
var Game = /** @class */ (function () {
    function Game() {
        //敌机血量
        this.hps = [1, 2, 10];
        //敌机速度
        this.speeds = [3, 2, 1,];
        //敌机的被击半径
        this.radius = [15, 30, 70];
        //初始化引擎，设置游戏宽高
        Laya.init(400, 852);
        //创建循环滚动的背景
        var bg = new BackGround();
        //把背景添加到舞台上并显示出来
        Laya.stage.addChild(bg);
        //预加载图集资源
        Laya.loader.load("res/atlas/war.atlas", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.ATLAS);
    }
    /**
     * 函数主要功能是创建主角和随机创建敌人
     */
    Game.prototype.onLoaded = function () {
        this.hero = new Role();
        //初始化角色
        this.hero.init("hero", 0, 1, 0, 30);
        this.hero.pos(200, 500);
        Laya.stage.addChild(this.hero);
        //监听鼠标移动事件
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        //创建敌人
        //this.createEnemy(10);
        //循环创建敌人
        Laya.timer.frameLoop(1, this, this.onLoop);
    };
    /**
     * 敌机的创建，移动和回收
     */
    Game.prototype.onLoop = function () {
        //遍历舞台上所有飞机，更改飞机状态
        for (var i = Laya.stage.numChildren - 1; i > 0; i--) {
            //遍历舞台所有的对象，包括背景和主角，转换为 Role 类型
            var role = Laya.stage.getChildAt(i);
            //判断是否为敌机，主角的speed为0
            if (role) {
                //根据飞机的速度改变位置
                role.y += role.speed;
                //判断敌机是否移动到显示区域外面
                if (role.y > 1000) {
                    //从舞台中移除
                    role.removeSelf();
                    //回收对象池
                    Laya.Pool.recover("role", role);
                }
            }
        }
        //每隔30帧创建新的敌机
        if (Laya.timer.currFrame % 60 == 0) {
            this.createEnemy(2);
        }
    };
    Game.prototype.onMouseMove = function () {
        this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    };
    //手动创建敌机
    Game.prototype.createEnemy = function (num) {
        for (var i = 0; i < num; i++) {
            //随机出现敌人的随机数
            var r = Math.random();
            //根据随机数，随机敌人
            var type = r < 0.7 ? 0 : r < 0.95 ? 1 : 2;
            //创建敌人，从对象池里面创建对象
            var enemy = Laya.Pool.getItemByClass("role", Role);
            //初始化角色
            enemy.init("enemy" + (type + 1), 1, this.hps[type], this.speeds[type], this.radius[type]);
            //随机位置
            enemy.pos(Math.random() * 400 + 40, Math.random() * 100);
            //添加到舞台
            Laya.stage.addChild(enemy);
        }
    };
    return Game;
}());
new Game();
//# sourceMappingURL=Game.js.map