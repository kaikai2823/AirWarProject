/*
* 程序入口
*/
class Game{

    private hero:Role;

    constructor(){
        //初始化引擎，设置游戏宽高
        Laya.init(400,852);
        //创建循环滚动的背景
        var bg:BackGround = new BackGround();
        //把背景添加到舞台上并显示出来
        Laya.stage.addChild(bg);
        //预加载图集资源
        Laya.loader.load("res/atlas/war.atlas",Laya.Handler.create(this,this.onLoaded),null,Laya.Loader.ATLAS);
       
    }
    /**
     * 函数主要功能是创建主角和随机创建敌人
     */
    onLoaded():void{
        this.hero = new Role();
        //初始化角色
        this.hero.init("hero",0,1,0,30);
        //设置射击类型
        this.hero.shootType = 1;
        //主角的初始位置
        this.hero.pos(200,500);
        Laya.stage.addChild(this.hero);
        //监听鼠标移动事件
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        //创建敌人
        //this.createEnemy(10);
        //循环创建敌人
        Laya.timer.frameLoop(1,this,this.onLoop);
    }
    /**
     * 敌机的创建，移动和回收
     */
    onLoop():void{
        //遍历舞台上所有飞机，更改飞机状态
        for(var i:number = Laya.stage.numChildren-1;i>0;i--){
            //遍历舞台所有的对象，包括背景和主角，转换为 Role 类型
            var role:Role = Laya.stage.getChildAt(i) as Role;
            //判断是否为敌机，主角的speed为0
            if(role && role.speed){
                //根据飞机的速度改变位置
                role.y+=role.speed;
                //判断敌机是否移动到显示区域外面
                if(role.y > 1000 || !role.visible ||(role.isBullet && role.y<-20)){
                    //从舞台中移除
                    role.removeSelf();
                    //回收之前重置属性
                    role.isBullet = false;
                    role.visible = true;
                    //回收对象池
                    Laya.Pool.recover("role",role);
                }
            }
        }

        //处理发射子弹逻辑
        if(role.shootType > 0){
            //获取当前时间
            var time:number = Laya.Browser.now();
            //如果当前时间大于下次射击时间
            if(time>role.shootTime){
                //更新下次射击时间
                role.shootTime = time + role.shootInterval;
                //从对象池中创建一个子弹
                var bullet:Role = Laya.Pool.getItemByClass("role",Role);
                //初始化子弹信息
                bullet.init("bullet1",role.camp,1,-5,1);
                //设置角色为子弹类型
                bullet.isBullet = true;
                //设置子弹位置
                bullet.pos(role.x,role.y-role.hitRadius-10);
                //添加到舞台上
                Laya.stage.addChild(bullet);
            }
        }
        
        //检测碰撞
        
        //如果主角死亡，则停止游戏循环

        //每隔30帧创建新的敌机
        if(Laya.timer.currFrame%60 === 0){
            this.createEnemy(2);
        }
    }


    /**
     * 主角跟随鼠标移动
     */
    onMouseMove():void{
        this.hero.pos(Laya.stage.mouseX,Laya.stage.mouseY);
    }

    //敌机血量
    private hps:Array<any> = [1,2,10];
    //敌机速度
    private speeds:Array<any> = [3,2,1,];
    //敌机的被击半径
    private radius:Array<any> = [15,30,70];

    //手动创建敌机
    createEnemy(num:number):void{
        for(var i:number = 0;i<num;i++){
            //随机出现敌人的随机数
            var r:number = Math.random();
            //根据随机数，随机敌人
            var type:number = r<0.7?0:r<0.95?1:2;
            //创建敌人，从对象池里面创建对象
            var enemy:Role = Laya.Pool.getItemByClass("role",Role);
            //初始化角色
            enemy.init("enemy"+(type+1),1,this.hps[type],this.speeds[type],this.radius[type]);
            //随机位置
            enemy.pos(Math.random()*400+40,Math.random()*100);
            //添加到舞台
            Laya.stage.addChild(enemy);
        }
    }
}

new Game();