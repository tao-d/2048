
//构造2048的item类
function _2048Item() {
  this.color = '#cac1b4';
  this.number = null;
  //设置项目的坐标，左下角为原点 -1表示不存在
  this.positionR = -1;  //行  (没有用到)
  this.positionC = -1;  //列  (没有用到)
  this.combineParent = null
  this.afterPositionR = null;  //变换后的行
  this.afterPositionC = null;  //变换后的列
  this.isOpenValue = false;
}
/**
 * 设置类共享的数据
 */

/**
 * 用于存储当前的运行状态
 * 二维数组
 * Array[0][]为第一行
 * Array[1][]为第二行
 * Array[2][]为第三行
 * Array[3][]为第四行
 */
//存放item类
_2048Item.prototype.Array = [[],
[],
[],
[]];

//用于存储当前可活动的子元素
_2048Item.prototype.activeItemCount = 0;


/**
 * 用于改变当前活动子元素的数量
 * @param {string} operator
 * @param {number} number 
 */
_2048Item.prototype.changeActiveItemCount = function (operator, number) {
  switch (operator) {
    case '+':{
      this.activeItemCount += number;
      break;
    }

    case '-':{
      this.activeItemCount -= number;
      break;
    }

  }
  return this.activeItemCount;
}

//返回当前子元素的行坐标
_2048Item.prototype.getpositionR = function () {
  return this.positionR !== -1 ? this.positionR : 'not found';
}
//返回当前子元素的列坐标
_2048Item.prototype.getpositionC = function () {
  return this.positionC !== -1 ? this.positionC : 'not found';
}


/**NullItemList
 * 记录当前数据结构中为空的元素坐标，用于确定新生成的元素位置
 * 将当前数据结构中是为空的行坐标和列坐标存入数组中，通过随机数生成下标来确定新元素生成的位置
 * 例如 NullItemList[randomNumber] = 
 * 当某个元素状态变为空或非空的时候都会更新该数组
 * 变为非空时会寻找该坐标并删除
 * 
 * 变为空且不存在的时候会将该坐标加入该数组
 */
_2048Item.prototype.NullItemList = [];



/**
 * 获取对应数字的 颜色字符串
 * @param {number} number 
 */
_2048Item.prototype.getColor = function (number) {
  switch(number){
    case 0 :{
      return '#cac1b4';
    }
    case 2:{
      return '#fafafa';
    }
    case 4:{
      return '#eae0cb';
    }
    case 8:{
      return '#e6b884';
    }
    case 16:{
      return '#e99a6e';
    }
    case 32:{
      return '#e7726e';
    }
    case 64:{
      return '#eb7262';
    }
    case 128:{
      return '#ee8549';
    }
    case 256:{
      return '#ebcd48';
    }
    case 512:{
      return '#afdfa3';
    }
    case 1024:{
      return '#4dd4c2';
    }
    case 2048:{
      return '#9366ce';
    }
  }
}


/**
 * createFlag
 * 用于判断是否生成新的元素标志
 * = false 不可以生成新的元素
 * = true  可以生成新的元素
 * 
 *  当2048数据结构变化的时候设置为true 
 *  数据结构变化意味着玩家已经进行了一步有效操作，可以生成新的元素
 * 
 *  当2048数据结构无变化的时候设置为false 
 *  当玩家进行了无效操作（触发按键事件但并无数据结构的变化，即无效），不可以生成新的元素
 *  
 *  
 */
_2048Item.prototype.createFlag = false;


/**
 * 用于判断新生成的元素是出现2还是4
 * 
 * 利用随机数去让出现的新元素随机
 * 模拟出现概率(新元素只能出现2或4)
 * 2: 2的个数/length (5/6)
 * 4: 4的个数/length (1/6)
 */
_2048Item.prototype.randomNumberArray = [2,2,2,2,2,4];




/**
 * 随机位置生成元素方法
 */
_2048Item.prototype.randomItemCreate = function(){
  let randomLength = this.NullItemList.length;
  let randomIndex = Math.floor(Math.random()*randomLength)
  let randomNumber = Math.floor(Math.random()*this.randomNumberArray.length)
  let Regexp = /\d/g;
  let positionArray = null;
  positionArray = this.NullItemList[randomIndex].match(Regexp);
  


  /**
   *  数据逻辑层添加随机生成元素
   */

  //当生成位置已有数据时，重新生成
  if(this.Array[positionArray[0]][positionArray[1]].isOpenValue == true){
    this.randomItemCreate()
    return 0;
  }
  this.Array[positionArray[0]][positionArray[1]].number = this.randomNumberArray[randomNumber];
  this.Array[positionArray[0]][positionArray[1]].isOpenValue = true
  this.Array[positionArray[0]][positionArray[1]].color = this.getColor(this.randomNumberArray[randomNumber])
  this.changeActiveItemCount('+',1)
  //将生成元素的位置从NullItemList空元素数组里s删除
  this.setItemNull('remove',positionArray[0],positionArray[1]);
  
  /**
   * 生成元素后
   * 前端显示层生成元素
   * 
   */
   let itemsTrue = document.querySelector('#items-true');
   let newItem = null;
   newItem = document.createElement('div')
   newItem.classList.add('items')
   newItem.row = positionArray[0];
   newItem.col = positionArray[1];
   newItem.style.left = `${positionArray[1]*75}px`
   newItem.style.top= `${(3-positionArray[0])*75}px`
   newItem.innerHTML = this.randomNumberArray[randomNumber]
   newItem.style.backgroundColor = this.getColor(this.randomNumberArray[randomNumber]);
   this.items[positionArray[0]][positionArray[1]] = newItem;
   itemsTrue.appendChild(newItem);
   return positionArray;
   
}


/**
 * 将数据结构目标元素的坐标加入NullItemList或从NullItemList中删除
 * @param {string} action  执行动作 append添加 remove删除
 * @param {number} positionR 
 * @param {number} positionC 
 */
_2048Item.prototype.setItemNull = function(action,positionR,positionC){
  //将该位置元素加入空元素队列
  let positionString = `(${positionR},${positionC})`
  switch(action){
    case 'append':{
      if(this.NullItemList.indexOf(positionString)==-1){
        this.NullItemList.push(positionString)
      }
      break;
    }
    case 'remove':{
      let index = this.NullItemList.indexOf(positionString)
      if(index!==-1){
        this.NullItemList.splice(index,1)
      }
      break;
    }
  }
}

/**
 * item的移动函数
 */
_2048Item.prototype.calculateMove = function (direction) {
  // TODO
  let downNumber = null;
  let upNumber = null;
  switch (direction) {
    case 'left': {
      for (let index in this.Array) {
        //计算起始的元素位置
        downNumber = 0

        //计算结束的元素位置
        upNumber = 3

        while (downNumber < upNumber) {
          //计算空位位置

          if (this.Array[index][downNumber].isOpenValue == false) {
            //寻找不是空位的元素
            let find = downNumber + 1;
            while (find <= upNumber) {
              if (this.Array[index][find].isOpenValue == true) {
                this.Array[index][downNumber].isOpenValue = true;
                this.Array[index][downNumber].positionR = downNumber;
                this.Array[index][downNumber].positionC = index;
                this.Array[index][downNumber].number = this.Array[index][find].number;
                this.Array[index][find].isOpenValue = false;
                this.Array[index][find].number = null;
                //当触发了items的移动后将createFlag设置为true，可以生成新元素
                if(!this.createFlag){
                  this.createFlag = true
                }
                //传入数据逻辑层信息，触发前端动态页面
                this.animated('move',{
                    beforePositionR:index,
                    beforePositionC:find,
                    afterPositionR:index,
                    afterPositionC:downNumber,
                    direction:'left',
                    // dist:Math.abs(find-downNumber)
                    dist:downNumber
                })
                this.setItemNull('append',index,find);
                this.setItemNull('remove',index,downNumber);
                break;
              }
              find += 1;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if (find > upNumber) {
              break;
            }
            else {
              downNumber += 1;
            }

          }
          else {
            downNumber += 1
          }
        }
      }
      break;
    }

    case 'up': {

      for (let index in this.Array) {
        //计算起始的元素位置
        downNumber = 3;

        //计算结束的元素位置
        upNumber = 0;
        while (downNumber > upNumber) {
          //计算空位位置

          if (this.Array[downNumber][index].isOpenValue == false) {
            //寻找不是空位的元素
            let find = downNumber - 1;
            while (find >= upNumber) {
              if (this.Array[find][index].isOpenValue == true) {
                this.Array[downNumber][index].isOpenValue = true;
                this.Array[downNumber][index].positionR = downNumber;
                this.Array[downNumber][index].positionC = index;
                this.Array[downNumber][index].number = this.Array[find][index].number
                this.Array[find][index].isOpenValue = false;
                this.Array[find][index].number = null
                //当触发了items的移动后将createFlag设置为true，可以生成新元素
                if(!this.createFlag){
                  this.createFlag = true
                }
                //传入数据逻辑层信息，触发前端动态页面
                this.animated('move',{
                  beforePositionR:find,
                  beforePositionC:index,
                  afterPositionR:downNumber,
                  afterPositionC:index,
                  direction:'up',
                  // dist:Math.abs(find-downNumber)
                  dist:3-downNumber
              })
                this.setItemNull('append',find,index);
                this.setItemNull('remove',downNumber,index);
                break;
              }
              find -= 1;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if (find < upNumber) {
              break;
            }
            else {
              downNumber -= 1;
            }

          }
          else {
            downNumber -= 1
          }
        }
      }
      break;
    }

    case 'right': {

      for (let index in this.Array) {
        //计算起始的元素位置
        downNumber = 3

        //计算结束的元素位置
        upNumber = 0
        while (downNumber > upNumber) {
          //计算空位位置
          if (this.Array[index][downNumber].isOpenValue == false) {
            
            //寻找不是空位的元素
            let find = downNumber - 1;
            while (find >= upNumber) {
              if (this.Array[index][find].isOpenValue == true) {
                this.Array[index][downNumber].isOpenValue = true;
                this.Array[index][downNumber].positionR = index;
                this.Array[index][downNumber].positionC = downNumber;
                this.Array[index][downNumber].number = this.Array[index][find].number
                this.Array[index][find].isOpenValue = false;
                this.Array[index][find].number = null;
                //当触发了items的移动后将createFlag设置为true，可以生成新元素
                if(!this.createFlag){
                  this.createFlag = true
                }
                this.animated('move',{
                  beforePositionR:index,
                  beforePositionC:find,
                  afterPositionR:index,
                  afterPositionC:downNumber,
                  direction:'right',
                  dist:downNumber
              })
                this.setItemNull('append',index,find);
                this.setItemNull('remove',index,downNumber);
                
                break;
              }
              find -= 1;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if (find < upNumber) {
              break;
            }
            else {
              downNumber -= 1;
            }
          }
          else {
            downNumber -= 1
          }
        }
      }
      break;
    }

    case 'down': {
      for (let index in this.Array) {
        //计算起始的元素位置
        downNumber = 0;

        //计算结束的元素位置
        upNumber = 3;
        while (downNumber < upNumber) {
          //计算空位位置
          
          if (this.Array[downNumber][index].isOpenValue == false) {
            //寻找不是空位的元素
            let find = downNumber + 1;
            while (find <= upNumber) {
              if (this.Array[find][index].isOpenValue == true) {
                //将该位置设置为非空 交换信息
                this.Array[downNumber][index].isOpenValue = true;
                this.Array[downNumber][index].positionR = downNumber;
                this.Array[downNumber][index].positionC = index;
                this.Array[downNumber][index].number = this.Array[find][index].number
                this.Array[find][index].isOpenValue = false;
                this.Array[find][index].number = null;
                //当触发了items的移动后将createFlag设置为true，可以生成新元素
                if(!this.createFlag){
                  this.createFlag = true
                }
                this.animated('move',{
                  beforePositionR:find,
                  beforePositionC:index,
                  afterPositionR:downNumber,
                  afterPositionC:index,
                  direction:'down',
                  dist:3-downNumber
              })
              this.setItemNull('append',find,index);
              this.setItemNull('remove',downNumber,index);
                break;
              }
              find += 1;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if (find > upNumber) {
              break;
            }
            else {
              downNumber += 1;
            }

          }
          else {
            downNumber += 1
          }
        }
      }
      break;
    }
  }
}
/**
 * item的结合函数
 * 
 */

_2048Item.prototype.calculateCombineFlag = [true,true,true,true];

_2048Item.prototype.calculateCombine = function (direction) {
  // TODO
  let downNumber = null;
  let upNumber = null;
  switch (direction) {

    //所有子元素向左移动时
    case 'left':
      {
        //循环4次
        for (let index in this.Array) {
        
          //计算起始的元素位置
          downNumber = 0;

          //计算结束的元素位置
          upNumber = 3;
          
          //寻找相同的相邻元素

          while (downNumber < upNumber) {
            //当下标元素处于不活动状态，继续循环
            if (this.Array[index][downNumber].isOpenValue == false) {
              downNumber += 1;
              continue;
            }
            //当下标元素与方向上的最近元素相等，合并
            let find = downNumber + 1 ; 
            while(find <= upNumber){
              if(this.Array[index][find].isOpenValue)
              {
                if(this.Array[index][find].number === this.Array[index][downNumber].number){
                  
                  this.Array[index][downNumber].number*=2;
                  this.Array[index][downNumber].color = this.getColor(this.Array[index][downNumber].number)
                  this.Array[index][find].isOpenValue = false; 
                  this.Array[index][find].number = null;
                  this.Array[index][find].positionR = -1;
                  this.Array[index][find].positionC = -1;

                  //下面是关于前端显示层的操作
                  this.items[index][find].row = index; //设置被合并的元素行坐标
                  this.items[index][find].col = find;  //设置被合并的元素列坐标
                  //combineParent 指向合并的元素
                  this.items[index][find].combineParent = this.items[index][downNumber];
                  //将元素动画属性设置为combine
                  this.items[index][find].animated = 'combine';
                  this.items[index][downNumber].animated = 'combine';
                  if(!this.createFlag){
                    this.createFlag = true
                  }
                  this.addScore(Number(this.Array[index][downNumber].number));
                  //将被结合的元素加入到置空队列

                  this.setItemNull('append',index,find);
                  this.changeActiveItemCount('-',1);
                }
                break;
              }
                find++;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出结合函数循环
            if(find>upNumber){
              break;
            }
            else{
              downNumber++;
            }
          }
        }
        break;
      }

    case 'up':
      {
        //循环4次
        for (let index in this.Array) {
          //计算起始的元素位置
          downNumber = 3;

          //计算结束的元素位置
          upNumber = 0;

          while (downNumber > upNumber) {
            //当下标元素处于不活动状态，继续循环
            if (this.Array[downNumber][index].isOpenValue == false) {
              downNumber -= 1;
              continue;
            }
            let find = downNumber - 1 ; 
            while(find >= upNumber){
              if(this.Array[find][index].isOpenValue)
              {
                if(this.Array[find][index].number === this.Array[downNumber][index].number){
                  this.Array[downNumber][index].number*=2;
                  this.Array[downNumber][index].color = this.getColor(this.Array[downNumber][index].number);
                  this.Array[find][index].isOpenValue = false; 
                  this.Array[find][index].number = null;
                  this.Array[find][index].positionR = -1;
                  this.Array[find][index].positionC = -1;

                  //下面是关于前端显示层的操作
                  this.items[find][index].row = downNumber;
                  this.items[find][index].col = index;
                  //combineParent 指向合并的元素
                  this.items[find][index].combineParent = this.items[downNumber][index];
                  this.items[find][index].animated = 'combine';
                  this.items[downNumber][index].animated = 'combine';
                  this.addScore(Number(this.Array[downNumber][index].number));

                  //将被结合的元素加入到置空队列
                  this.setItemNull('append',find,index);
                  this.changeActiveItemCount('-',1);
                }
                break;
              }
                find--;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if(find<upNumber){
              break;
            }
            else{
              downNumber--;
            }
          }
        }
        break;
      }

    case 'right':
      {
        //循环4次
        for (let index in this.Array) {

          //计算起始的元素位置
          downNumber = 3;

          //计算结束的元素位置
          upNumber = 0;
          while (downNumber > upNumber) {
            if (this.Array[index][downNumber].isOpenValue == false) {
              downNumber -= 1;
              continue;
            }

            //当下标元素与方向上的最近元素相等，合并
            let find = downNumber - 1; 
            while(find >= upNumber){
              if(this.Array[index][find].isOpenValue)
              {
                if(this.Array[index][find].number === this.Array[index][downNumber].number){
                  this.Array[index][downNumber].number*=2;
                  this.Array[index][downNumber].color = this.getColor(this.Array[index][downNumber].number)
                  this.Array[index][find].isOpenValue = false; 
                  this.Array[index][find].number = null;
                  this.Array[index][find].positionR = -1;
                  this.Array[index][find].positionC = -1;

                  //下面是关于前端显示层的操作
                  this.items[index][find].row = index;
                  this.items[index][find].col = downNumber;
                  //combineParent 指向合并的元素
                  this.items[index][find].combineParent = this.items[index][downNumber];
                  this.items[index][find].animated = 'combine';
                  this.items[index][downNumber].animated = 'combine';
                  this.addScore(Number(this.Array[index][downNumber].number));
                  //将被结合的元素加入到置空队列

                  this.setItemNull('append',index,find);
                  this.changeActiveItemCount('-',1);
                  
                }
                break;
              }
                find--;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if(find<upNumber){
              break;
            }
            else{
              downNumber--;
            }  
          }
        }
        break;
      }

    case 'down':
      {
        //循环4次
        for (let index in this.Array) {

          //计算起始的元素位置
          downNumber = 0;

          //计算结束的元素位置
          upNumber = 3;
          while (downNumber < upNumber) {
            if (this.Array[downNumber][index].isOpenValue == false) {
              downNumber += 1;
              continue;
            }
            let find = downNumber + 1 ; 
            while(find <= upNumber){
              if(this.Array[find][index].isOpenValue)
              {
                if(this.Array[find][index].number === this.Array[downNumber][index].number){
                  this.Array[downNumber][index].number*=2;
                  this.Array[downNumber][index].color = this.getColor(this.Array[downNumber][index].number);
                  this.Array[find][index].isOpenValue = false; 
                  this.Array[find][index].number = null;
                  this.Array[find][index].positionR = -1;
                  this.Array[find][index].positionC = -1;

                  //下面是关于前端显示层的操作
                  this.items[find][index].row = downNumber;
                  this.items[find][index].col = index;
                  //combineParent 指向合并的元素
                  this.items[find][index].combineParent = this.items[downNumber][index];
                  this.items[find][index].animated = 'combine';
                  this.items[downNumber][index].animated = 'combine';
                  this.addScore(Number(this.Array[downNumber][index].number));
                  //将被结合的元素加入到置空队列
                  this.setItemNull('append',find,index);
                  this.changeActiveItemCount('-',1);               
                }
                break;
              }
                find++;
            }
            //当find>upNumber说明空位后已无子元素存在，可以退出移动函数循环
            if(find>upNumber){
              break;
            }
            else{
              downNumber++;
            }

          }
        }
        break;
      }
  }
      //检测合并了的子元素并进行前端操作
      for(let i = 0 ;i<4;i++){
        for(let j =0;j<4;j++){
          //当目标位置元素不为空且
          if(this.items[i][j]!=null&&this.items[i][j].animated==='combine'){
            if(!this.createFlag){
              this.createFlag = true;
            }
            let that = this.items[i][j];
            let forwardPositionR = null;
            let forwardPositionC = null;
            while(that.combineParent!=null){
              that = that.combineParent;
            }
            forwardPositionR = that.row;
            forwardPositionC = that.col;
            this.animated('combine',{
              backPositionR: i,
              backPositionC: j,
              direction:direction,
              //若移动的方向为水平方向，则传入第几列作为移动的距离参考坐标
              dist:direction==='left'||direction==='right'?forwardPositionC:forwardPositionR,
              //判断移动方向上元素是否是被结合（消失的）
              dispear:!!this.items[i][j].combineParent,
            })

            //将更改位置的items的forward指向重置设置为空
            //重置进行items元素的animated
            if(this.items[i][j]!=null)
             this.items[i][j].animated = null;
          }
        }
      }
}


/**
 * 随机位置生成元素方法
 * items是存储前端层的元素，与视图有关
 * 让程序可以通过items的坐标来具体控制前端的
 */
_2048Item.prototype.items = [[],[],[],[]];


/**
 * item在页面中的动画效果
 * animatedType 传递动画种类
 * animatedInformation 传递动画执行的信息
 */
_2048Item.prototype.animated = function (animatedType,animatedInformation) {
  //TODO
  //有两种动画效果 move combine 
  //move
  switch(animatedType){
    
    //move动画
    case 'move':{
      /**
       * move的animatedInformation
       * {
       *    beforePositionR:开始元素的行坐标
       *    beforepositionC:开始元素的列坐标
       *    afterPositionR:结束元素的行坐标
       *    afterpositionC:结束元素的列坐标
       *    direction:移动的方向
       *    dist:移动的坐标
       * }
       */
      let beforePositionR = animatedInformation.beforePositionR;
      let beforePositionC = animatedInformation.beforePositionC;
      let afterPositionR = animatedInformation.afterPositionR;
      let afterPositionC = animatedInformation.afterPositionC;
      let dist = animatedInformation.dist;
      
      switch(animatedInformation.direction){
        case 'left':{
          this.items[beforePositionR][beforePositionC].style.left = ` ${dist*75}px `
          this.items[beforePositionR][beforePositionC].style.opacity = `1`;
          break;
        }
        case 'up':{
          this.items[beforePositionR][beforePositionC].style.top= ` ${dist*75}px `
          this.items[beforePositionR][beforePositionC].style.opacity = `1`;
          break;
        }
        case 'right':{
          this.items[beforePositionR][beforePositionC].style.left = ` ${dist*75}px `
          this.items[beforePositionR][beforePositionC].style.opacity = `1`;
          break;
        }
        case 'down':{
          this.items[beforePositionR][beforePositionC].style.top = ` ${dist*75}px `
          this.items[beforePositionR][beforePositionC].style.opacity = `1`;
          break;
        }
      }
        this.items[afterPositionR][afterPositionC] = this.items[beforePositionR][beforePositionC];
        this.items[afterPositionR][afterPositionC].row = afterPositionR;
        this.items[afterPositionR][afterPositionC].col = afterPositionC;
        this.items[beforePositionR][beforePositionC] = null;
        break;
    }

    //combine
    case 'combine':{
      /**
       * move的animatedInformation
       * {
       *    backPositionR:开始元素的行坐标
       *    backPositionC:开始元素的列坐标
       *    forwardPositionR:结束元素的行坐标
       *    forwardPositionC:结束元素的列坐标
       *    direction:移动的方向
       *    dispear:是否合并后消失
       * }
       */
      let backPositionR = animatedInformation.backPositionR;
      let backPositionC = animatedInformation.backPositionC;
      let dist = animatedInformation.dist;
      let dispear = animatedInformation.dispear;
      //获取容纳前端元素的容器元素items-true 控制items元素的移动与删除
      let itemsTrue = document.querySelector('#items-true');

      switch(animatedInformation.direction){
        case 'left':{
          this.items[backPositionR][backPositionC].style.left = ` ${dist*75}px `
           if(dispear){
            let removeItem = this.items[backPositionR][backPositionC];
            this.items[backPositionR][backPositionC].style.zIndex = 1;
            this.items[backPositionR][backPositionC].style.opacity = `0`;
            this.items[backPositionR][backPositionC] = null;
            //前端 设置定时器让元素在300ms后移除
            setTimeout(()=>{
              itemsTrue.removeChild(removeItem);
            },300)
           }
           else{
             //设置元素变化后的层级，innerHTML内容 背景颜色，字体大小和数字
            this.items[backPositionR][backPositionC].style.zIndex = 2;
            this.items[backPositionR][backPositionC].innerHTML = this.Array[backPositionR][backPositionC].number;
            this.items[backPositionR][backPositionC].style.backgroundColor = 
              this.getColor(this.Array[backPositionR][backPositionC].number)
              if(this.Array[backPositionR][backPositionC].number>16){
                this.items[backPositionR][backPositionC].style.color = 'white';
                if(this.Array[backPositionR][backPositionC].number>100){
                  this.items[backPositionR][backPositionC].style.fontSize = '22px';
                }
              }
           }
          break;
        }
        case 'up':{
          this.items[backPositionR][backPositionC].style.top= ` ${(3-dist)*75}px `
           if(dispear){
            let removeItem = this.items[backPositionR][backPositionC];
            this.items[backPositionR][backPositionC].style.zIndex = 1;
            this.items[backPositionR][backPositionC].style.opacity = `0`
            this.items[backPositionR][backPositionC] = null;
            //前端 设置定时器让元素在300ms后移除
            setTimeout(()=>{
              itemsTrue.removeChild(removeItem); 
            },300)
           }
           else{
              //设置元素变化后的层级，innerHTML内容 背景颜色，字体大小和数字
            this.items[backPositionR][backPositionC].style.zIndex = 2;
            
            this.items[backPositionR][backPositionC].innerHTML = this.Array[backPositionR][backPositionC].number;
            this.items[backPositionR][backPositionC].style.backgroundColor = 
              this.getColor(this.Array[backPositionR][backPositionC].number)
              if(this.Array[backPositionR][backPositionC].number>16){
                this.items[backPositionR][backPositionC].style.color = 'white';
                if(this.Array[backPositionR][backPositionC].number>100){
                  this.items[backPositionR][backPositionC].style.fontSize = '22px';
                }
              }
           }
          break;
        }
        case 'right':{
          this.items[backPositionR][backPositionC].style.left = ` ${dist*75}px `
           if(dispear){
            let removeItem = this.items[backPositionR][backPositionC];
            this.items[backPositionR][backPositionC].style.zIndex = 1;
            this.items[backPositionR][backPositionC].style.opacity = `0`
            this.items[backPositionR][backPositionC] = null;
            //前端 设置定时器让元素在300ms后移除
            setTimeout(()=>{
              itemsTrue.removeChild(removeItem)
            },300)
           }
           else{
              //设置元素变化后的层级，innerHTML内容 背景颜色，字体大小和数字
            this.items[backPositionR][backPositionC].style.zIndex = 2;
            
            this.items[backPositionR][backPositionC].innerHTML = this.Array[backPositionR][backPositionC].number;
            this.items[backPositionR][backPositionC].style.backgroundColor = 
              this.getColor(this.Array[backPositionR][backPositionC].number)
              if(this.Array[backPositionR][backPositionC].number>16){
                this.items[backPositionR][backPositionC].style.color = 'white';
                if(this.Array[backPositionR][backPositionC].number>100){
                  this.items[backPositionR][backPositionC].style.fontSize = '22px';
                }
              }
           }
          break;
        }
        case 'down':{

          this.items[backPositionR][backPositionC].style.top= ` ${(3-dist)*75}px `

           if(dispear){
            let removeItem = this.items[backPositionR][backPositionC];
            this.items[backPositionR][backPositionC].style.zIndex = 1;
            this.items[backPositionR][backPositionC].style.opacity = `0`
            this.items[backPositionR][backPositionC] = null;
            //前端 设置定时器让元素在300ms后移除
            setTimeout(()=>{
              itemsTrue.removeChild(removeItem);
            },300)
           }
           else{
              //设置元素变化后的层级，innerHTML内容 背景颜色，字体大小和数字
            this.items[backPositionR][backPositionC].style.zIndex = 2;
            this.items[backPositionR][backPositionC].style.backgroundColor = 
              this.getColor(this.Array[backPositionR][backPositionC].number)
            this.items[backPositionR][backPositionC].innerHTML = this.Array[backPositionR][backPositionC].number;
            if(this.Array[backPositionR][backPositionC].number>16){
                this.items[backPositionR][backPositionC].style.color = 'white';
                if(this.Array[backPositionR][backPositionC].number>100){
                  this.items[backPositionR][backPositionC].style.fontSize = '22px';
                }
              }
           }
          break;
        }
      }
      break;
    }
  }
  
}

//统计得分
_2048Item.prototype.score = 0;


//获取当前得分的方法
_2048Item.prototype.getScore = function(number){
  return this.score
}

//累加得分方法
_2048Item.prototype.addScore = function(number){
  return this.score +=number
}

//设置得分
_2048Item.prototype.setScore = function(number){
  return this.score = number;
}

//设置keyControl来控制按键触发的频率，以此达到节流控制效果
_2048Item.prototype.keyControl = true;

//按键触发的事件
_2048Item.prototype.keyEvent = function(ev){
  let event = ev||window.event;
  //用于控制按键事件触发频率
  if(!this.keyControl)
  {
    return 0;
  }
  else{
    this.keyControl = false
    setTimeout(()=>{
      this.keyControl = true;
    },400)
  }
  switch(event.keyCode){
    //左方向键事件
    case 37:{
      setTimeout(()=>{
        this.calculateCombine('left')
        this.calculateMove('left')
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.createFlag = false;
              this.scoreSpan.innerHTML = this.getScore();
            }
          },400)
      },10)
      break;
    }
    //上方向键事件
    case 38:{
      setTimeout(()=>{
        this.calculateCombine('up')
        this.calculateMove('up')
          //设置定时器为400ms，保证在前端的动画效果完毕后再生成，保证正常游戏正常流程和视觉效果
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.scoreSpan.innerHTML = this.getScore();
              this.createFlag = false;
            }
          },400)
      },10)
      break;
    }
    //右方向键事件
    case 39:{
      setTimeout(()=>{
        this.calculateCombine('right')
        this.calculateMove('right')
        //设置定时器为400ms，保证在前端的动画效果完毕后再生成，保证正常游戏正常流程和视觉效果
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.scoreSpan.innerHTML = this.getScore();
              this.createFlag = false;
            }
          },400)
      },10)
      break;
    }
    //下方向键事件
    case 40:{
      setTimeout(()=>{
        this.calculateCombine('down')
        this.calculateMove('down')
        //设置定时器为400ms，保证在前端的动画效果完毕后再生成，保证正常游戏正常流程和视觉效果
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.scoreSpan.innerHTML = this.getScore();
              this.createFlag = false;
            }
          },400)
      },10)
      break;
    }
  }
  this.scoreSpan.innerHTML = this.getScore();
}

//绑定方向键事件
_2048Item.prototype.bindKeyEvent = function(){

  document.addEventListener('keyup',this.keyEvent.bind(this)
  ,false);
}




// //touchStart事件
// _2048Item.prototype.touchStartEvent = function(ev){
//   //TODO
//   let event = ev||window.event
//   console.log(event);
// }
// //touchEnd事件
// _2048Item.prototype.touchEndEvent = function(ev){
//   let event = ev||window.event
//   console.log(event);
// }

_2048Item.prototype.touchEvent = function(){
  const LENGTH = 50
  const TIMEHANDLER = 400
  let timerTurn = true
  let touchTurn = false
  let touchTurnTimer = null
  let startX = null
  let startY = null
  let endX = null
  let endY = null
  let changeX = null
  let changeY = null
  let change = null
  function touchStartEvent(ev){
    let event = ev||window.event
    startX = event.touches[0].clientX
    startY = event.touches[0].clientY
    touchTurn = true
    // clearTimeout(touchTurnTimer)
    touchTurnTimer = setTimeout(()=>{
      touchTurn = false
    },TIMEHANDLER)
  }

  function touchEndEvent(ev){
    let event = ev||window.event
    // console.log(event);
    // console.log(!touchTurn&&!timerTurn);
    console.log('touchTurn',touchTurn);
    console.log('timerTurn',timerTurn);
    if(!touchTurn||!timerTurn){
      // return 0;
      console.log('无法接受滑屏输入');
      return
    }
    timerTurn = false;
    touchTurn = false;
    setTimeout(()=>{
      timerTurn = true
    },TIMEHANDLER)
    // console.log(endX);
    endX = event.changedTouches[0].clientX
    endY = event.changedTouches[0].clientY
    // console.log(endY);
    changeX = endX - startX
    changeY = endY - startY
    change = Math.max(Math.abs(changeX),Math.abs(changeY))
    // console.log(change);
    console.log(Math.sign(changeX));
    console.log(Math.sign(changeY));
    if(change>=LENGTH){
      if(Math.abs(changeX)>Math.abs(changeY)){
        switch(Math.sign(changeX)){
          case 1:{
            this.moveFunction('right')
            // console.log('滑动方向为右');
            break;
          }
          case -1:{
            this.moveFunction('left')
            // console.log('滑动方向为左');
            break;
          }
        }
      }
      else{
        switch(Math.sign(changeY)){
          case 1:{
            this.moveFunction('down')
            // console.log('滑动方向为下');
            break;
          }
          case -1:{
            this.moveFunction('up')
            // console.log('滑动方向为上');
            break;
          }
        }
      }
    }
  }
  document.addEventListener('touchstart',touchStartEvent.bind(this)
  ,false)
  document.addEventListener('touchend',touchEndEvent.bind(this)
  ,false)

}

//方向触发事件
_2048Item.prototype.moveFunction = function(direction){
  switch(direction){
    case 'up':{
      setTimeout(()=>{
        this.calculateCombine('up')
        this.calculateMove('up')
          //设置定时器为400ms，保证在前端的动画效果完毕后再生成，保证正常游戏正常流程和视觉效果
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.scoreSpan.innerHTML = this.getScore();
              this.createFlag = false;
            }
          },400)
      },10)
      break;
    }
    case 'down':{
      setTimeout(()=>{
        this.calculateCombine('down')
        this.calculateMove('down')
        //设置定时器为400ms，保证在前端的动画效果完毕后再生成，保证正常游戏正常流程和视觉效果
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.scoreSpan.innerHTML = this.getScore();
              this.createFlag = false;
            }
          },400)
      },10)
      break;
    }
    case 'left':{
      setTimeout(()=>{
        this.calculateCombine('left')
        this.calculateMove('left')
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.createFlag = false;
              this.scoreSpan.innerHTML = this.getScore();
            }
          },400)
      },10)
      break;
    }
    case 'right':{
      setTimeout(()=>{
        this.calculateCombine('right')
        this.calculateMove('right')
        //设置定时器为400ms，保证在前端的动画效果完毕后再生成，保证正常游戏正常流程和视觉效果
          setTimeout(()=>{
            //当createFlag为true 表示允许生成新的元素，并将该标志设置为false，同时更新计算得分
            if(this.createFlag)
            {
              this.randomItemCreate();
              this.scoreSpan.innerHTML = this.getScore();
              this.createFlag = false;
            }
          },400)
      },10)
      break;
    }
  }
}


// _2048Item.prototype.bindTouchEndEvent = function(){
//   this.touchEndEvent(ev,startX,startY)
// }


//绑定移动端滑屏事件
_2048Item.prototype.bindTouchEvent = function(){
  // document.addEventListener('touchstart',this.touchStartEvent.bind(this)
  // ,false)
  // document.addEventListener('touchend',this.touchEndEvent.bind(this)
  // ,false)
  this.touchEvent()
}




//scoreSpan的dom元素
_2048Item.prototype.scoreSpan = null;

//newGamebtn的dom元素
_2048Item.prototype.newGameBtn = null;

_2048Item.prototype.bindScoreSpan = function(){
  let scoreSpan = document.querySelector('#score-number');
  return this.scoreSpan = scoreSpan;
}

//类的初始化方法
_2048Item.prototype.init = function () {
  this.Array = [[],[],[],[]];
  this.setScore(0);
  this.bindScoreSpan();
  this.bindNewGameBtn();
  this.bindKeyEvent();
  this.bindTouchEvent();
  this.scoreSpan.innerHTML = this.getScore()
  //4
  for (let i in this.Array) {
    //4
    for (let j in this.Array) {
      this.Array[i].push(new _2048Item())
      this.items[i][j] = null;
      this.NullItemList.push(`(${i},${j})`);
    }
  }
  //开始游戏时，随机生成两个数字
  for(let i = 0 ; i<2;i++){
    this.randomItemCreate();
  }
}

//绑定New Game按钮事件监听
_2048Item.prototype.bindNewGameBtn = function(){
  this.newGameBtn = document.querySelector('.game-button');
  this.newGameBtn.innerHTML = `New Game`;
  this.newGameBtn.addEventListener('click',this.newGameBtnEvent.bind(this)
  ,false)
}
 
//new Game按钮触发事件
_2048Item.prototype.newGameBtnEvent = function(ev){
  this.Array = [[],[],[],[]];
  this.NullItemList = []
  this.setScore(0);
  this.scoreSpan.innerHTML = this.getScore();
  let itemsTrue = document.querySelector('#items-true');
  alert(`new game`)
  for(let i = 0;i < 4; i++){
    for(let j = 0;j < 4; j++){
      //重置前端显示层的数据与显示
      if(this.items[i][j]!=null)
      {
        itemsTrue.removeChild(this.items[i][j]);
        this.items[i][j] = null;
      }
      this.Array[i].push(new _2048Item())
      this.NullItemList.push(`(${i},${j})`);
    }
  }
  for(let i = 0;i<2;i++){
    this.randomItemCreate();
  }
}




let _2048_1 = new _2048Item();
_2048_1.init();




