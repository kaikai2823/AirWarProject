var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
*角色类
*/
var Role = /** @class */ (function (_super) {
    __extends(Role, _super);
    function Role() {
        var _this = _super.call(this) || this;
        //射击属性
        _this.shootType = 0;
        //射击间隔
        _this.shootInterval = 100;
        //下次射击时间
        _this.shootTime = Laya.Browser.now() + 1000;
        //当前动作
        _this.action = "";
        //是否是子弹
        _this.isBullet = false;
        return _this;
    }
    Role.prototype.init = function (_type, _camp, _hp, _speed, _hitRadius) {
        this.type = _type;
        this.camp = _camp;
        this.hp = _hp;
        this.speed = _speed;
        this.hitRadius = _hitRadius;
        if (!Role.cached) {
            Role.cached = true;
            //缓存飞行动画
            Laya.Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], "hero_fly");
            //缓存击中爆炸效果
            Laya.Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png",
                "war/hero_down3.png", "war/hero_down4.png"], "hero_down");
            //缓存敌机1飞行动画
            Laya.Animation.createFrames(["war/enemy1_fly1.png"], "enemy1_fly");
            //缓存敌机1爆炸动作
            Laya.Animation.createFrames(["war/enemy1_down1.png", "war/enemy1_down2.png", "war/enemy1_down3.png",
                "war/enemy1_down4.png"], "enemy1_down");
            //缓存敌机2飞行动画
            Laya.Animation.createFrames(["war/enemy2_fly1.png"], "enemy2_fly");
            //缓存敌机2爆炸动作
            Laya.Animation.createFrames(["war/enemy2_down1.png", "war/enemy2_down2.png", "war/enemy2_down3.png",
                "war/enemy2_down4.png"], "enemy2_down");
            //缓存敌机2碰撞动作
            Laya.Animation.createFrames(["war/enemy2_hit.png"], "enemy2_hit");
            //缓存敌机3飞行动画
            Laya.Animation.createFrames(["war/enemy3_fly1.png", "war/enemy3_fly2.png"], "enemy3_fly");
            //缓存敌机3爆炸动作
            Laya.Animation.createFrames(["war/enemy3_down1.png", "war/enemy3_down2.png", "war/enemy3_down3.png",
                "war/enemy3_down4.png", "war/enemy3_down5.png", "war/enemy3_down6.png"], "enemy3_down");
            //缓存敌机3碰撞动作
            Laya.Animation.createFrames(["war/enemy3_hit.png"], "enemy3_hit");
            //缓存子弹动画
            Laya.Animation.createFrames(["war/bullet1.png"], "bullet1_fly");
            //缓存强化包
            Laya.Animation.createFrames(["war/ufo1.png"], "ufo1_fly");
            //缓存医疗包
            Laya.Animation.createFrames(["war/ufo2.png"], "ufo2_fly");
        }
        if (!this.body) {
            this.body = new Laya.Animation();
            this.addChild(this.body);
            //添加动画播放完成事件，给每一个新创建的body增加一个监听事件
            this.body.on(Laya.Event.COMPLETE, this, this.onPlayComplete);
        }
        //播放飞机动画
        this.playAction("fly");
    };
    Role.prototype.onPlayComplete = function () {
        if (this.action === "down") {
            this.body.stop();
            this.visible = false;
        }
        else if (this.action === "hit") {
            this.playAction("fly");
        }
    };
    Role.prototype.playAction = function (action) {
        //记录当前播放动画的类型
        this.action = action;
        //动画播放控制，根据不同的类型播放动画
        this.body.play(0, true, this.type + "_" + action);
        //获取动画大小区域
        var bound = this.body.getBounds();
        //设置机身居中
        this.body.pos(-bound.width / 2, -bound.height / 2);
    };
    Role.cached = false; //是否缓存动画
    return Role;
}(Laya.Sprite));
//# sourceMappingURL=Role.js.map