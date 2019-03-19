/*
*角色类
*/
class Role extends Laya.Sprite{
    
    private static cached:boolean = false;//是否缓存动画
    private body:Laya.Animation;

    public type:string;//角色类型
    public camp:number;//阵营
    public hp:number;//血量
    public speed:number;//速度
    public hitRadius:number;//被击半径

    //射击属性
    public shootType:number = 0;
    //射击间隔
    public shootInterval:number = 500;
    //下次射击时间
    public shootTime:number = Laya.Browser.now()+1000;
    //当前动作
    public action:string = "";
    //是否是子弹
    public isBullet:boolean = false;

    constructor(){
        super();
        

    }
    public init(_type:string,_camp:number,_hp:number,_speed:number,_hitRadius:number):void{
        

            this.type = _type;
            this.camp = _camp;
            this.hp = _hp;
            this.speed = _speed;
            this.hitRadius = _hitRadius;

            if(!Role.cached){
                Role.cached = true;
                //缓存飞行动画
                Laya.Animation.createFrames(["war/hero_fly1.png","war/hero_fly2.png"],"hero_fly");
                //缓存击中爆炸效果
                Laya.Animation.createFrames(["war/hero_down1.png","war/hero_down2.png"
                ,"war/hero_down3.png","war/hero_down4.png"],"hero_down");
                //缓存敌机1飞行动画
                Laya.Animation.createFrames(["war/enemy1_fly1.png"],"enemy1_fly");
                //缓存敌机1爆炸动作
                Laya.Animation.createFrames(["war/enemy1_down1.png","war/enemy1_down2.png","war/enemy1_down3.png",
                "war/enemy1_down4.png"],"enemy1_down");

                //缓存敌机2飞行动画
                Laya.Animation.createFrames(["war/enemy2_fly1.png"],"enemy2_fly");
                //缓存敌机2爆炸动作
                Laya.Animation.createFrames(["war/enemy2_down1.png","war/enemy2_down2.png","war/enemy2_down3.png",
                "war/enemy2_down4.png"],"enemy2_down");
                //缓存敌机2碰撞动作
                Laya.Animation.createFrames(["war/enemy2_hit.png"],"enemy2_hit");

                //缓存敌机3飞行动画
                Laya.Animation.createFrames(["war/enemy3_fly1.png","war/enemy3_fly2.png"],"enemy3_fly");
                //缓存敌机3爆炸动作
                Laya.Animation.createFrames(["war/enemy3_down1.png","war/enemy3_down2.png","war/enemy3_down3.png",
                "war/enemy3_down4.png","war/enemy3_down5.png","war/enemy3_down6.png"],"enemy3_down");
                //缓存敌机3碰撞动作
                Laya.Animation.createFrames(["war/enemy3_hit.png"],"enemy3_hit");

                //缓存子弹动画
                Laya.Animation.createFrames(["war/bullet1.png"],"bullet1_fly");

                //缓存强化包
                Laya.Animation.createFrames(["war/ufo1.png"],"ufo1_fly");
                //缓存医疗包
                Laya.Animation.createFrames(["war/ufo2.png"],"ufo2_fly");
            }
        if(!this.body){
            this.body = new Laya.Animation();
            this.addChild(this.body);
            //添加动画播放完成事件，给每一个新创建的body增加一个监听事件
            this.body.on(Laya.Event.COMPLETE,this,this.onPlayComplete);
        }
        //播放飞机动画
        this.playAction("fly");
    }
    onPlayComplete():void{
        if(this.action === "down"){
            this.body.stop();
            this.visible = false;
        }else if(this.action === "hit"){
            this.playAction("fly");
        }
    }

    playAction(action:string):void{

        //记录当前播放动画的类型
        this.action = action;
        //动画播放控制，根据不同的类型播放动画
        this.body.play(0,true,this.type+"_"+action);
        //获取动画大小区域
        var bound:Laya.Rectangle = this.body.getBounds();
        //设置机身居中
        this.body.pos(-bound.width/2,-bound.height/2);
    }
}