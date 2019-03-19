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
        //设置射击类型
        this.hero.shootType = 1;
        //主角的初始位置
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
     * 遍历舞台上所有的对象，并且更改状态，敌机的创建，移动和回收
     */
    Game.prototype.onLoop = function () {
        //遍历舞台上所有飞机，更改飞机状态
        for (var i = Laya.stage.numChildren - 1; i > 0; i--) {
            //遍历舞台所有的对象，包括背景和主角，转换为 Role 类型
            var role = Laya.stage.getChildAt(i);
            //判断是否为敌机，主角的speed为0
            if (role && role.speed) {
                //根据飞机的速度改变位置
                role.y += role.speed;
                //判断敌机是否移动到显示区域外面
                if (role.y > 1000 || !role.visible || (role.isBullet && role.y < -20)) {
                    //从舞台中移除
                    role.removeSelf();
                    //回收之前重置属性
                    role.isBullet = false;
                    role.visible = true;
                    //回收对象池
                    Laya.Pool.recover("role", role);
                }
            }
            //处理发射子弹逻辑，根据射击类型判断是哪个阵营的
            if (role.shootType > 0) {
                //获取当前时间
                var time = Laya.Browser.now();
                //如果当前时间大于下次射击时间
                if (time > role.shootTime) {
                    //更新下次射击时间
                    role.shootTime = time + role.shootInterval;
                    //从对象池中创建一个子弹
                    var bullet = Laya.Pool.getItemByClass("role", Role);
                    //初始化子弹信息
                    bullet.init("bullet1", role.camp, 1, -5, 1);
                    //设置角色为子弹类型
                    bullet.isBullet = true;
                    //设置子弹位置
                    bullet.pos(role.x, role.y - role.hitRadius - 10);
                    //添加到舞台上
                    Laya.stage.addChild(bullet);
                }
            }
        }
        //检测碰撞
        for (var i = Laya.stage.numChildren - 1; i > 0; i--) {
            //获取角色对象1
            var role1 = Laya.stage.getChildAt(i);
            if (role1.hp < 1)
                continue;
            for (var j = i - 1; j > 0; j--) {
                //如果角色死亡，请忽略
                if (!role.visible)
                    continue;
                //获取角色对象2
                var role2 = Laya.stage.getChildAt(j);
                if (role2.hp > 0 && role1.camp != role2.camp) {
                    //计算碰撞区域
                    var hitRadius = role1.hitRadius + role2.hitRadius;
                    //根据距离判断是否碰撞
                    if (Math.abs(role1.x - role2.x) < hitRadius && Math.abs(role1.y - role2.y) < hitRadius) {
                        //碰撞之后掉血
                        this.lostHp(role1, 1);
                        this.lostHp(role2, 1);
                    }
                }
            }
        }
        //如果主角死亡，则停止游戏循环
        if (this.hero.hp < 1) {
            Laya.timer.clear(this, this.onLoop);
        }
        //每隔30帧创建新的敌机
        if (Laya.timer.currFrame % 60 === 0) {
            this.createEnemy(2);
        }
    };
    Game.prototype.lostHp = function (role, lostHp) {
        //减血
        role.hp -= lostHp;
        if (role.hp > 0) {
            //如果未死亡，播放被击打画面
            role.playAction("hit");
        }
        else {
            if (role.isBullet) {
                //如果是子弹
                role.visible = false;
            }
            else {
                role.playAction("down");
            }
        }
    };
    /**
     * 主角跟随鼠标移动
     */
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