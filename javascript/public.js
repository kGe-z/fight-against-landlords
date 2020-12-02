// 生成牌面HTML代码的函数
function makePoker(poker) {
  const { num, color } = poker; // [牌数, 花色]
  // 普通花色的坐标数据
  const arr = [
    [-43, -222], //方块
    [-43, -47], //梅花
    [-158, -47], //红桃
    [-158, -222], //黑桃
  ];
  let x, y;

  // 判断是否是大小王
  if (num != 14 && num != 15) {
    x = arr[color][0];
    y = arr[color][1];
  } else {
    // 获取大小王的 图片定位
    x = color == 0 ? -158 : -43;
    y = color == 0 ? -46 : -46;
  }

  return `
    <li
      data-num="${num}"
      data-color="${color}"
      style="width: 100px; height: 138px; background: url(../assets/images/${num}.png) ${x}px ${y}px"
      ></li>
  `;
}

// 生成左右 AI 牌组渲染
function makeAIPoker() {
  return '<li class="back"></li>';
}

//排序函数
function sortPoker(poker) {
  poker.sort((x, y) => {
    if (x.num != y.num) {
      return y.num - x.num; // 如果点不同的话就按点数来排序
    } else {
      return y.color - x.color; // 如果点相同的话就按花色来的排序
    }
  });
}

//排序函数
function sortPoker_r(poker) {
  poker.sort((x, y) => {
    if (x.num != y.num) {
      return x.num - y.num; // 如果点不同的话就按点数来排序
    } else {
      return x.color - y.color; // 如果点相同的话就按花色来的排序
    }
  });
}

// 抢地主之前的给牌play_4函数
function render_pre() {
  $(".all_poker li").remove();

  for (let i = 0; i < all_poker.length; i++) {
    $(".play_4").append(makePoker(all_poker[i]));
    if (i === 0) {
      $(".play_4 li:last").css({
        left: "240px",
      });
    } else if (i === 2) {
      $(".play_4 li:last").css({
        left: "120px",
      });
    }
  }
}

//出牌动画函数
function move() {
  $(".main_content_bottom").on("click", ".play_2 li", function () {
    //只绑定玩家2的牌
    if ($(this).hasClass("select")) {
      // 去掉被选中的样式
      $(this).removeClass("select");
      const num = $(this).data("num");
      const color = $(this).data("color");

      // 通过循环得到选中元素的下标
      game_data.select.poker.map((item, index) => {
        if (item.num == num && item.color == color) {
          // 通过下标删除数组中对应的元素
          game_data.select.poker.splice(index, 1);
        }
      });
    } else {
      // 把选择中牌变成被选中的样式
      $(this).addClass("select");
      // 把选中的牌的数据放入，选择的牌组数据中

      const num = $(this).data("num");
      const color = $(this).data("color");
      game_data.select.poker.push({ num, color });
    }
  });
}

//接触按钮绑定
function clickOff() {
  $(".main_bottom_bottom").off("click", ".go_play .pass");
  $(".main_bottom_bottom").off("click", ".go_play .play");
  $(".main_bottom_bottom").off("click", ".go_play .tips");
  $(".main_content_bottom").off("click", ".play_2 li");
}

// 加倍
function redouble() {
  const multiple = $(".multiple span").html().split(" ")[1];
  $(".multiple span").html(`x ${+multiple * 2}`);
}

/**
 * 提示对比函数入口
 * @param {Function} callback 回调函数
 */
function autoTipsPoker(callback, aiPokerNum) {
  try {
    // 如果提示牌已经被选过
    if (
      game_data.tips.poker.length > 0 &&
      JSON.stringify(game_data.tips.poker) ==
        JSON.stringify(game_data.select.poker)
    ) {
      return aiPokerNum ? callback(aiPokerNum) : callback();
    } else return false;
  } catch (error) {
    game_data.poker = JSON.parse(JSON.stringify(player[1].poker));
    return false;
  }
}

// 提示 type = 0 桌面没牌
function TipsPoker0() {
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (item.num == tip.num && item.color == tip.color) {
        game_data.poker.splice(i, 1);
      }
    });
  });
  return true;
}

// 提示 type = 1 单牌
function TipsPoker1() {
  let res = false;
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num < tip.num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });

  for (let i = game_data.poker.length - 1; i >= 0; i--) {
    if (game_data.poker[i].num > game_data.desktop.max) {
      game_data.select.poker = [].concat(game_data.poker[i]);
      res = true;
      return res;
    }
  }

  return res;
}

// 提示 type = 2 对子
function TipsPoker2() {
  let res = false;
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num < tip.num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });

  for (let i = game_data.poker.length - 1; i >= 0; i--) {
    // 如果有两张牌大于桌面的牌
    if (
      game_data.poker[i].num > game_data.desktop.max &&
      game_data.poker[i].num == game_data.poker[i - 1].num
    ) {
      game_data.select.poker = [].concat(
        game_data.poker[i],
        game_data.poker[i - 1]
      );
      res = true;
      return res;
    }
  }

  return res;
}

// 提示 type = 3 三张
function TipsPoker3() {
  let res = false;
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num == tip.num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });

  for (let i = game_data.poker.length - 1; i >= 0; i--) {
    // 如果有张牌大于桌面的牌
    if (
      game_data.poker[i].num > game_data.desktop.max &&
      game_data.poker[i].num == game_data.poker[i - 1].num &&
      game_data.poker[i - 1].num == game_data.poker[i - 2].num
    ) {
      game_data.select.poker = [].concat(
        game_data.poker[i],
        game_data.poker[i - 1],
        game_data.poker[i - 2]
      );
      res = true;
      return res;
    }
  }

  return res;
}

// 提示 type = 4 三带1
function TipsPoker4(aiPokerNum) {
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num == game_data.tips.poker[1].num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });

  let res = false;
  for (let i = game_data.poker.length - 1; i >= 0; i--) {
    // 如果有三带一大于桌面的牌
    if (
      game_data.poker[i].num > game_data.desktop.max &&
      game_data.poker[i].num == game_data.poker[i - 1].num &&
      game_data.poker[i - 1].num == game_data.poker[i - 2].num
    ) {
      game_data.select.poker = [].concat(
        game_data.poker[i],
        game_data.poker[i - 1],
        game_data.poker[i - 2]
      );

      for (let j = aiPokerNum.length - 1; j >= 0; j--) {
        if (
          aiPokerNum[j] != aiPokerNum[j - 1] &&
          JSON.stringify(game_data.select.poker).indexOf(
            JSON.stringify(player[1].poker[j])
          ) == -1
        ) {
          game_data.select.poker.push(player[1].poker[j]);
          res = true;
          return res;
        }
      }
    }
  }

  return res;
}

// 提示 type = 5 三带1
function TipsPoker5(aiPokerNum) {
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num == game_data.tips.poker[2].num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });

  let res = false;
  for (let i = game_data.poker.length - 1; i >= 0; i--) {
    // 如果有三带一大于桌面的牌
    if (
      game_data.poker[i].num > game_data.desktop.max &&
      game_data.poker[i].num == game_data.poker[i - 1].num &&
      game_data.poker[i - 1].num == game_data.poker[i - 2].num
    ) {
      game_data.select.poker = [].concat(
        game_data.poker[i],
        game_data.poker[i - 1],
        game_data.poker[i - 2]
      );

      for (let j = aiPokerNum.length - 1; j >= 0; j--) {
        if (
          aiPokerNum[j] == aiPokerNum[j - 1] &&
          JSON.stringify(game_data.select.poker).indexOf(
            JSON.stringify(player[1].poker[j])
          ) == -1
        ) {
          game_data.select.poker.push(
            player[1].poker[j],
            player[1].poker[j - 1]
          );
          res = true;
          return res;
        }
      }
    }
  }

  return res;
}

// 提示 顺子
function TipsPokerShunZi(aiPokerNum) {
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num <= game_data.tips.poker[0].num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });
  let res = false;

  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [].push(player[1].poker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 1; j >= 0; j--) {
      if (firstNum == +aiPokerNum[j] - 1 && aiPokerNum[j] <= 12) {
        game_data.select.poker.push(player[1].poker[j]);
        if (
          game_data.select.poker.length == game_data.desktop.poker.length &&
          aiPokerNum[j] > game_data.desktop.max
        ) {
          res = true;
          return res;
        } else {
          firstNum++;
        }
      }
    }
  }
  game_data.select.poker = [];

  return res;
}

// 提示 连对
function TipsPokerLianDui(aiPokerNum) {
  game_data.poker.map((item, i) => {
    game_data.tips.poker.map((tip) => {
      if (
        item.num <= game_data.tips.poker[0].num ||
        (item.num == tip.num && item.color == tip.color)
      ) {
        game_data.poker.splice(i, 1);
      }
    });
  });
  let res = false;
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [].concat(player[1].poker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 1; j >= 0; j--) {
      if (firstNum == +aiPokerNum[j] && aiPokerNum[j] <= 13 && i != j) {
        game_data.select.poker.push(player[1].poker[j]);

        if (game_data.select.poker.length == game_data.desktop.poker.length) {
          if (aiPokerNum[j] > game_data.desktop.max) {
            res = true;
            return true;
          }
        } else if (game_data.select.poker.length % 2 == 0) {
          firstNum++;
        }
      }
    }
  }

  return res;
}

// 提示 6张 2*3 飞机 12张 4*3飞机 15张 5*3飞机
function TipPokerFeijiBuDai(aiPokerNum) {
  let res = false;
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [];
    game_data.select.poker.push(player[1].poker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 1; j >= 0; j--) {
      if (firstNum == +aiPokerNum[j] && aiPokerNum[j] <= 13) {
        game_data.select.poker.push(player[1].poker[j]);
        if (
          game_data.select.poker.length == game_data.desktop.poker.length &&
          aiPokerNum[j] > game_data.desktop.max
        ) {
          res = true;
          return res;
        } else if (game_data.select.poker.length % 3 == 0) {
          firstNum++;
        }
      }
    }
  }
  game_data.select.poker = [];
  return res;
}

/**
 *
 * @param {array} param0 要出牌的牌组
 * @param {number} param1 要出牌的类型
 * @param {number} param2 要出牌的最大牌点数
 * @returns {boolean} 返回布尔值
 */
/* 
    牌型分类：
    1       单张
    2       对子
    3       3张  
    4       3带 1    
    5       3带 2
    6       顺子
    7  6张   4带2
		8: 6张 2*3 飞机
    9: 6张  连对
		10: 6张 顺子
		11: 7张 顺子
		12: 8张 顺子
		13: 8张 连对
		14: 8张 飞机
		15: 8张 4带2对
		16: 9张 顺子
		17: 9张 3*3飞机
		18: 10张 顺子
		19：10张 连对
		20: 10张 3带2大飞机
		21: 11张 顺子
		22: 12张 顺子
		23: 12张 连对 
		24: 12张 4*3飞机
		25: 12张 3带1小飞机
		26: 14张 连对
		27: 15张 5*3飞机
		28: 15张 3*3带2大飞机
		29: 16张 连对
		30: 16张 4*3带1小飞机
		31: 18张 连对
		32: 20张 连对
		33: 20张 4*3带2大飞机
    998     普通炸
    999     王炸
*/
function validatePokers(data) {
  // 为了方便牌型判断需要先把选中的牌组数据进行排序
  sortPoker_r(data.poker);
  // 用于分析牌组的张数
  const poker = data.poker;
  const len = poker.length;

  // 判断长度返回结果
  switch (len) {
    // 代表不出
    case 0:
      return false;
    // 判断一张牌的情况
    case 1:
      data.type = 1; // 设置当前选择的牌型
      data.max = poker[0].num;
      return true; // 符合规则返回true
    // 判断两张牌的情况
    case 2:
      //判断是否为王炸
      if (
        (poker[0].num == 14 && poker[1].num == 15) ||
        (poker[0].num == 15 && poker[1].num == 14)
      ) {
        data.type = 999; // 设置牌型为王炸
        data.max = 15;
      } else if (poker[0].num != poker[1].num) {
        // 如果不是王炸和
        return false;
      } else {
        // 判断是否为对子
        data.type = 2;
        data.max = poker[0].num;
      }
      return true;
    // 判断三张牌的情况
    case 3:
      if (poker[0].num == poker[2].num) {
        data.type = 3; // 设置牌型为3张
        data.max = poker[0].num; // 设置牌型的判断值
        return true;
      }
      return false;
    // 判断四张牌的情况
    case 4:
      if (poker[0].num == poker[3].num) {
        data.type = 998; // 设置牌型为普通炸弹
        data.max = poker[0].num; // 设置牌型的判断值
        return true;
      } else if (poker[0].num == poker[2].num || poker[1].num == poker[3].num) {
        // 牌型：3444 4443
        data.type = 4; // 设置牌型为三带一
        data.max = poker[1].num; // 设置牌型的判断值
        return true;
      }
      return false;
    // 判断五张牌的情况
    case 5:
      // 牌型：34567 33444 44455
      // 判断是否为顺子 34567
      if (Shunzi(poker)) {
        data.type = 6; // 设置牌型为顺子
        data.max = poker[len - 1].num;
        return true;
      }

      // 判断是否为三带二 33444 44455
      if (
        (poker[0].num == poker[2].num && poker[3].num == poker[4].num) ||
        (poker[0].num == poker[1].num && poker[2].num == poker[4].num)
      ) {
        data.type = 5; // 设置牌型为三带二
        data.max = poker[2].num; // 设置牌型的判断值
        return true;
      }
      return false;
    // 判断六张牌的情况
    case 6:
      // 牌型：345678 333444 334455 334444 444455  344445 345555 555567

      // 判断是否为四带二 555567 344445 345555  334444 444455
      if (
        poker[0].num == poker[3].num ||
        poker[1].num == poker[4].num ||
        poker[2].num == poker[5].num
      ) {
        data.type = 7; // 设置牌型为四带二
        data.max = poker[2].num; // 设置牌型的判断值
        return true;
      }

      // 判断是否为飞机 333444
      else if (
        +poker[0].num + 1 == poker[5].num &&
        poker[0].num != 13 &&
        poker[5] != 13
      ) {
        data.type = 8; // 设置牌型为飞机
        data.max = poker[5].num; // 设置牌型的判断值
        return true;
      }

      // 判断是否为连对
      else if (checkDouble(poker)) {
        data.type = 9; // 设置牌型为连对
        data.max = poker[len - 1].num; // 设置牌型的判断值
        return true;
      }

      // 判断是否为顺子 345678
      else if (Shunzi(poker)) {
        data.type = 10;
        data.max = poker[len - 1].num; // 设置牌型的判断值
        return true;
      }
      return false;
    // 七张牌的情况
    case 7:
      // 牌型: 3456789
      // 先判断是否为顺子
      if (Shunzi(poker)) {
        data.type = 11; // 设置牌型为顺子
        data.max = poker[len - 1].num; // 设置牌型的判断值
        return true;
      }
      return false;
    // 八张牌的情况
    case 8:
      //牌型: 345678910 33445566 33344456 44445566 33444455 33445555
      // 先判断是否为顺子
      if (Shunzi(poker)) {
        data.type = 12; // 设置牌型为顺子
        data.max = poker[len - 1].num; // 设置牌型的判断值
        return true;
      }

      // 判断是否为八张牌的飞机 33344456 34445556 34555666
      else if (planeEight(poker)) {
        data.type = 14;
        data.max = poker[5].num;
        return true;
      }

      // 判断是否为连对
      else if (checkDouble(poker)) {
        data.type = 13; // 设置牌型为连对
        data.max = poker[len - 1].num; // 设置牌型的判断值
        return true;
      }

      // 判断是否为 4带2对
      else if (
        poker[0].num == poker[3].num ||
        poker[1].num == poker[4].num ||
        poker[2].num == poker[5].num
      ) {
        data.type = 15; // 设置牌型为 4带2对
        data.max = poker[2].num; // 设置牌型的判断值
        return true;
      }

      return false;
    // 九张牌的情况
    case 9:
      // 牌型: 34567891011 333444555
      // 判断是否为顺子 34567891011
      if (Shunzi(poker)) {
        data.type = 16;
        data.max = poker[len - 1].num;
        return true;
      }

      // 判断是否为飞机 333444555
      else if (planeWithout(poker)) {
        data.type = 17;
        data.max = poker[len - 1].num;
        return true;
      }

      return false;
    // 十张牌的情况
    case 10:
      // 牌型： 3344556677 3456789101112
      const plane_res = planeTen(poker);

      // 判断是否为连对
      if (checkDouble(poker)) {
        data.type = 19;
        data.max = poker[len - 1].num;
        return true;
      }

      // 判断是否为 顺子 345678910jk
      else if (Shunzi(poker)) {
        data.type = 18;
        data.max = poker[len - 1].num;
        return true;
      }

      // 判断是否为 3带 2的飞机 333444555678 344455566678 345556667778
      else if (plane_res) {
        data.type = 20;
        data.max = +plane_res;
        return true;
      }
      return false;
    // 十一张牌的情况
    case 11:
      // 牌型: 345678910jkl
      if (Shunzi(poker)) {
        data.type = 21;
        data.max = poker[len - 1].num;
        return true;
      }
      return false;
    // 十二张牌的情况
    case 12:
      const twelve_res = planeTwelve(poker);
      // 判断是否为顺子
      if (Shunzi(poker)) {
        data.type = 22;
        data.max = poker[len - 1].num;
        return true;
      }
      // 判断是否为连对
      else if (checkDouble(poker)) {
        data.type = 23;
        data.max = poker[len - 1].num;
        return true;
      }

      // 判断是否为 12张的纯飞机
      else if (planeWithout(poker)) {
        data.type = 24;
        data.max = poker[len - 1].num;
        return true;
      }

      // 判断是否为 3*1的飞机
      else if (twelve_res) {
        data.type = 25;
        data.max = +twelve_res;
        return true;
      }

      return false;
    // 十四张牌的情况
    case 14:
      // 判断是否为连对
      if (checkDouble(poker)) {
        data.type = 26;
        data.max = poker[len - 1].num;
        return true;
      }

      return false;
    // 十五张牌的情况
    case 15:
      const out_res = planeWithout(poker);
      const fifteen_res = planeFifteen(poker);

      // 15张不带牌点数的飞机
      if (out_res) {
        data.type = 27;
        data.max = +out_res;
        return true;
      }
      // 15张 3*3 + 2*3 的飞机
      else if (fifteen_res) {
        data.type = 28;
        data.max = +fifteen_res;
        return true;
      }

      return false;
    // 十六张牌的情况
    case 16:
      const sixteen_res = checkDouble(poker);
      // 16 张连对
      if (sixteen_res) {
        data.type = 29;
        data.max = +sixteen_res;
        return true;
      }
      return false;
    // 十八张牌的情况
    case 18:
      const eighteen_res = checkDouble(poker);
      // 18 张连对
      if (eighteen_res) {
        data.type = 31;
        data.max = +eighteen_res;
        return true;
      }

      return false;
    // 二十张牌的情况
    case 20:
      const twenty_res = checkDouble(poker);
      // 20 张连对
      if (twenty_res) {
        data.type = 32;
        data.max = +twenty_res;
        return true;
      }

      return false;
    // 其余的情况
    default:
      return false;
  }
}

/**
 * 校验是否为顺子
 * @param {array} poker 校验的牌组
 * @returns { boolean | number}
 */
function Shunzi(poker) {
  // 如果是 2 则直接返回false
  const len = poker.length;
  let res = true;
  for (let i = 0; i < len; i++) {
    if (poker[i].num == 13) {
      res = false;
      return res;
    }
  }

  for (let i = 0; i < len - 1; i++) {
    if (+poker[i].num + 1 != poker[i + 1].num) {
      res = false;
      break;
    } else {
      res = +poker[len - 1].num;
    }
  }
  return res;
}

/**
 * 校验是否为连对
 * @param {array} poker 校验的牌组
 * @returns { boolean | number}
 */
function checkDouble(poker) {
  let res, res1, res2;

  //如果是 2 大小王 直接返回 false
  for (let i = 0; i < poker.length - 1; i++) {
    if (poker[i].num == 13 || poker[i].num == 14 || poker[i].num == 15) {
      res = false;
      return res;
    }
  }

  // 用来判断是不是成对
  for (let i = 0; i < poker.length - 2; i += 2) {
    res1 = +poker[i].num + 1 != poker[i + 2].num ? false : true;
  }

  // 用来判断是不是连号
  for (let i = 0; i < poker.length; i += 2) {
    res2 = poker[i].num != poker[i + 1].num ? false : true;
  }

  //同时满足2个条件
  res = res1 == true && res2 == true ? +poker[poker.length - 1].num : false;

  return res;
}

/**
 * 校验是否为八张飞机
 * @param {array} poker 校验的牌组
 * @returns { boolean | number}
 */
function planeEight(poker) {
  // let res = false;
  // for (let i = 0; i < 3; i++) {
  //   // 8张飞机有3种情况
  //   if (
  //     poker[i].num == poker[i + 1].num &&
  //     poker[i + 1].num == poker[i + 2].num &&
  //     poker[i].num != 13 && //前三张相等并且没有2
  //     poker[i + 3].num == poker[i + 4].num &&
  //     poker[i + 4].num == poker[i + 5].num &&
  //     poker[i + 3].num != 13 && //后三张相等并且没有2
  //     +poker[i].num + 1 == poker[i + 5].num
  //   ) {
  //     // 6张连牌第一张+1等于最后一张
  //     res = +poker[i + 5];
  //     break;
  //   }
  // }
  // return res
  // 判断是否为飞机
  if (
    (poker[0].num == poker[2].num &&
      poker[3].num == poker[5].num &&
      poker[0].num * 1 + 1 == poker[3].num) || // 判断前6张牌是否连续
    (poker[2].num == poker[4].num &&
      poker[5].num == poker[7].num &&
      poker[2].num * 1 + 1 == poker[5].num) || // 判断后6张牌是否连续
    (poker[1].num == poker[3].num &&
      poker[4].num == poker[6].num &&
      poker[1].num * 1 + 1 == poker[4].num) // 判断中间6张牌是否连续
  ) {
    type = 777; // 设置牌型为飞机
    max = poker[5].num; // 设置牌型的判断值
    return true;
  } else return false
}

/**
 * 10张3带2飞机
 * @param {array} poker 校验的牌组
 * @returns { boolean | number}
 */
function planeTen(poker) {
  let res = false;
  for (let i = 0; i < 5; i += 2) {
    if (
      poker[i].num == poker[i + 1].num &&
      poker[i + 1].num == poker[i + 2].num &&
      poker[i].num != 13 &&
      poker[i + 3].num == poker[i + 4].num &&
      poker[i + 4].num == poker[i + 5].num &&
      poker[i + 3].num != 13 &&
      +poker[i].num + 1 == poker[i + 5].num
    ) {
      if (
        i == 0 &&
        poker[6].num == poker[7].num &&
        poker[8].num == poker[9].num
      ) {
        res = +poker[i + 5].num;
        break;
      } else if (
        i == 2 &&
        poker[0].num == poker[1].num &&
        poker[8].num == poker[9].num
      ) {
        res = +poker[i + 5].num;
        break;
      } else if (
        i == 4 &&
        poker[0].num == poker[1].num &&
        poker[2].num == poker[3].num
      ) {
        res = +poker[i + 5].num;
        break;
      }
    }
  }
  return res;
}

/**
 * 12张 3带1小飞机
 * @param {array} poker 校验的牌组
 * @returns { boolean | number}
 */
function planeTwelve(poker) {
  let res = false;
  for (let i = 0; i < 4; i++) {
    //12张3*3+3*1的飞机有4种情况
    if (
      poker[i].num == poker[i + 1].num &&
      poker[i + 1].num == poker[i + 2].num &&
      poker[i].num != 13 && //前3张相等并且没有2
      poker[i + 3].num == poker[i + 4].num &&
      poker[i + 4].num == poker[i + 5].num &&
      poker[i + 3].num != 13 && //中3张相等并且没有2
      poker[i + 6].num == poker[i + 7].num &&
      poker[i + 7].num == poker[i + 8].num &&
      poker[i + 6].num != 13 && //后3张相等并且没有2
      +poker[i].num + 1 == poker[i + 5].num &&
      +poker[i + 5].num + 1 == poker[i + 8].num
    ) {
      res = +poker[i + 8].num;
      break;
    }
  }
  return res;
}

/**
 * 15张 3*3 + 2*3 的飞机
 * @param {array} poker 校验的牌组
 * @returns { boolean | number }
 */
function planeFifteen(poker) {
  let res = false;
  for (let i = 0; i < 7; i += 2) {
    if (
      poker[i].num == poker[i + 1].num &&
      poker[i + 1].num == poker[i + 2].num &&
      poker[i].num != 13 &&
      poker[i + 3].num == poker[i + 4].num &&
      poker[i + 4].num == poker[i + 5].num &&
      poker[i + 3].num != 13 &&
      poker[i + 6].num == poker[i + 7].num &&
      poker[i + 7].num == poker[i + 8].num &&
      poker[i + 6].num != 13 &&
      +poker[i].num + 1 == poker[i + 5].num &&
      +poker[i + 3].num + 1 == poker[i + 8].num
    ) {
      if (
        i == 0 &&
        poker[9].num == poker[10].num &&
        poker[11].num == poker[12].num &&
        poker[13].num == poker[14].num
      ) {
        res = +poker[i + 8].num;
        break;
      } else if (
        i == 2 &&
        poker[0].num == poker[1].num &&
        poker[11].num == poker[12].num &&
        poker[13].num == poker[14].num
      ) {
        res = +poker[i + 8].num;
        break;
      } else if (
        i == 4 &&
        poker[0].num == poker[1].num &&
        poker[2].num == poker[3].num &&
        poker[13].num == poker[14].num
      ) {
        res = +poker[i + 8].num;
        break;
      } else if (
        i == 6 &&
        poker[0].num == poker[1].num &&
        poker[2].num == poker[3].num &&
        poker[4].num == poker[5].num
      ) {
        res = +poker[i + 8].num;
        break;
      }
    }
  }
  return res;
}

/**
 * 校验不带牌点数的 9, 12, 15张的飞机
 * @param {array} poker
 * @returns { boolean | number}
 */
function planeWithout(poker) {
  let res = false;
  let res1 = true;
  let res2 = true;
  const len = poker.length;

  // 如果为 2 则直接返回 false
  for (let j = 0; j <= len - 1; j++) {
    if (poker[j].num == 13) return res;
  }

  for (let i = 0; i < 2; i++) {
    // 九张牌的飞机 333444555
    if (len == 9) {
      if (
        poker[i].num != poker[i + 1].num &&
        poker[i + 3].num != poker[i + 4].num &&
        poker[i + 6].num != poker[i + 7].num
      ) {
        res1 = false;
        break;
      }
    }
    // 12 张的飞机 333444555666
    else if (len == 12) {
      if (
        poker[i].num != poker[i + 1].num &&
        poker[i + 3].num != poker[i + 4].num &&
        poker[i + 6].num != poker[i + 7].num &&
        poker[i + 9].num != poker[i + 10].num
      ) {
        res1 = false;
        break;
      }
    }
    // 15 张的飞机 333444555666777
    else if (len == 15) {
      if (
        poker[i].num != poker[i + 1].num &&
        poker[i + 3].num != poker[i + 4].num &&
        poker[i + 6].num != poker[i + 7].num &&
        poker[i + 9].num != poker[i + 10].num &&
        poker[12].num != poker[13].num
      ) {
        res1 = false;
        break;
      }
    }
  }

  // 333444555
  for (let i = 0; i < len - 5; i += 3) {
    if (+poker[i].num + 1 != poker[i + 3].num) {
      res2 = false;
      break;
    }
  }
  if (res1 == true && res2 == true) res = +poker[len - 1].num;

  return res;
}

/**
 * 检查当前手牌是否大于桌上的牌的函数
 */
function checkVS() {
  // 如果桌面上没有牌的话可以直接打出
  if (game_data.desktop.type == 0) return true;

  // 如果出的牌是王炸的话可以直接打出
  if (game_data.select.type == 999) return true;

  // 出的是普通炸弹并且桌上的不是炸弹或者王炸就可以直接打出
  if (game_data.select.type == 998 && game_data.desktop.type != 999) {
    if (game_data.desktop.type == 998) {
      return game_data.select.max > game_data.desktop.max ? true : false;
    } else return true;
  }

  // 如果桌面上的牌是王炸那无论是什么牌都不能打出
  if (game_data.desktop.type == 999) return false;

  // 如果两上牌型一样，长度不一样直接返回false一般组数据大小的判断
  if (
    game_data.select.type == game_data.desktop.type &&
    game_data.select.poker.length == game_data.desktop.poker.length &&
    game_data.select.max > game_data.desktop.max
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * 打出后删除的牌
 */
function delPoker() {
  /* 
    seletc => [{num:1,color:2}, {num:1, color:3}]
    play => [{num:1,color:2}, {num:1, color:3}, {num:2, color:3}]

    需要注意在循环遍历时有可能遍历的数组会发生变化，如果有这样的可以需要小心处理。
    1、尽可能不要直接在遍历时进行变化
    2、或者等遍历完之再作处理
    3、需要变的值可以通过临时变量来复制等操作来完成
  */

  game_data.select.poker.map((item) => {
    player[game_data.play].poker.map((play, index) => {
      if (+item.num == +play.num && +item.color == +play.color) {
        console.log(play, item);
        player[game_data.play].poker.splice(index, 1);
      }
    });
  });
}

/**
 * 报单和报双
 * @param {array} 所剩牌组
 */
function doubleEntry(poker) {
  if (poker.length == 1) {
    // 报单
    sound(game_data.play == 1 ? baodan_play : baodan);
  }
  if (poker.length == 2) {
    // 报双
    sound(game_data.play == 1 ? baoshuang_play : baoshuang);
  }
}

//================================================ AI 自动出牌区域
/**
 * 正常出牌
 * @param {string} now_rank 当前玩家的身份
 * @param {string} pre_rank 上一个玩家的身份
 * @param {function} callback 回调函数
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 */
function rushPoker(now_rank, pre_rank, callback, aiPokerNum, aiPoker) {
  if (game_data.desktop.max >= 9) {
    //大于等于J的时候
    if (now_rank == pre_rank) {
      //判断阵营，如果同队就不出牌
      return false;
    } else {
      return callback(aiPokerNum, aiPoker, now_rank, pre_rank);
    }
  } else {
    //判断阵营，如果同队或者出三带1以上牌型就不出牌
    if (now_rank == pre_rank && game_data.desktop.type >= 3) {
      return false;
    } else {
      return callback(aiPokerNum, aiPoker, now_rank, pre_rank);
    }
  }
}

/**
 * 出单张牌
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushDan(aiPokerNum, aiPoker, now_rank, pre_rank) {
  // 如果有单张牌大于桌面的牌
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    if (aiPokerNum[i] > game_data.desktop.max) {
      game_data.select.poker.push(aiPoker[i]);
      // game_data.select.max = aiPoker[i].num
      return true;
    }
  }

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 出两张牌
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushDouble(aiPokerNum, aiPoker, now_rank, pre_rank) {
  // 如果有两张牌大于桌面的牌
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    if (
      aiPokerNum[i] > game_data.desktop.max &&
      aiPokerNum[i] == aiPokerNum[i - 1]
    ) {
      game_data.select.poker.push(aiPoker[i], aiPoker[i - 1]);

      return true;
    }
  }

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 出三张牌
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushThree(aiPokerNum, aiPoker, now_rank, pre_rank) {
  // 如果有三张牌大于桌面的牌
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    if (
      aiPokerNum[i] > game_data.desktop.max &&
      aiPokerNum[i] == aiPokerNum[i - 1] &&
      aiPokerNum[i - 1] == aiPokerNum[i - 2]
    ) {
      game_data.select.poker.push(aiPoker[i], aiPoker[i - 1], aiPoker[i - 2]);

      return true;
    }
  }

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 出三带一
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushAAAB(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    if (
      aiPokerNum[i] > game_data.desktop.max &&
      aiPokerNum[i] == aiPokerNum[i - 1] &&
      aiPokerNum[i - 1] == aiPokerNum[i - 2]
    ) {
      game_data.select.poker.push(aiPoker[i], aiPoker[i - 1], aiPoker[i - 2]);

      for (let j = aiPokerNum.length - 1; j >= 0; j--) {
        if (
          aiPokerNum[j] != aiPokerNum[j - 1] &&
          JSON.stringify(game_data.select.poker).indexOf(
            JSON.stringify(aiPoker[j])
          ) == -1
        ) {
          game_data.select.poker.push(aiPoker[j]);
          return true;
        }
      }
    }
  }

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 出三带二
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushAAABB(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    if (
      aiPokerNum[i] > game_data.desktop.max &&
      aiPokerNum[i] == aiPokerNum[i - 1] &&
      aiPokerNum[i - 1] == aiPokerNum[i - 2]
    ) {
      game_data.select.poker.push(aiPoker[i], aiPoker[i - 1], aiPoker[i - 2]);

      for (let j = aiPokerNum.length - 1; j >= 0; j--) {
        if (
          aiPokerNum[j] == aiPokerNum[j - 1] &&
          JSON.stringify(game_data.select.poker).indexOf(
            JSON.stringify(aiPoker[j])
          ) == -1
        ) {
          game_data.select.poker.push(aiPoker[j], aiPoker[j - 1]);
          return true;
        }
      }
    }
  }

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 5张、6张、7张、8张、9张、10张、11张、12张 顺子
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushShunzi(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [];
    game_data.select.poker.push(aiPoker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 1; j >= 0; j--) {
      if (firstNum == +aiPokerNum[j] - 1 && aiPokerNum[j] <= 12) {
        game_data.select.poker.push(aiPoker[j]);
        if (
          game_data.select.poker.length == game_data.desktop.poker.length &&
          aiPokerNum[j] > game_data.desktop.max
        ) {
          return true;
        } else {
          firstNum++;
        }
      }
    }
  }
  game_data.select.poker = [];

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 6张、8张、10张、12张、14张、16张、18张、20张连对
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushLiandui(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [];
    game_data.select.poker.push(aiPoker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 1; j >= 0; j--) {
      if (firstNum == +aiPokerNum[j] && aiPokerNum[j] <= 13 && i != j) {
        game_data.select.poker.push(aiPoker[j]);

        if (game_data.select.poker.length == game_data.desktop.poker.length) {
          if (aiPokerNum[j] > game_data.desktop.max) return true;
        } else if (game_data.select.poker.length % 2 == 0) {
          firstNum++;
        }
      }
    }
  }
  game_data.select.poker = [];

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 三顺 6张 2*3 飞机 12张 4*3飞机 15张 5*3飞机
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushSanShun(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [];
    game_data.select.poker.push(aiPoker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 1; j >= 0; j--) {
      if (firstNum == +aiPokerNum[j] && aiPokerNum[j] <= 13) {
        game_data.select.poker.push(aiPoker[j]);
        if (
          game_data.select.poker.length == game_data.desktop.poker.length &&
          aiPokerNum[j] > game_data.desktop.max
        ) {
          return true;
        } else if (game_data.select.poker.length % 3 == 0) {
          firstNum++;
        }
      }
    }
  }
  game_data.select.poker = [];

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 带单飞机 8张 飞机 12张 3带1小飞机 16张 4*3带1小飞机
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushPlaneSingle(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    game_data.select.poker = [];
    game_data.select.poker.push(aiPoker[i]);
    let firstNum = aiPokerNum[i];
    for (let j = aiPokerNum.length - 2; j >= 0; j--) {
      //如果点数相等并且点数是2以下的牌
      if (firstNum == +aiPokerNum[j] && aiPokerNum[j] <= 13) {
        game_data.select.poker.push(aiPoker[j]);
        //先添加三顺
        if (game_data.select.poker.length % 3 == 0) {
          firstNum++;
        }
        //三顺数量满足后开始添加单排
        if (
          (game_data.select.poker.length / 3) * 1 +
            game_data.select.poker.length ==
          game_data.desktop.poker.length
        ) {
          for (let k = aiPokerNum.length - 1; k >= 0; k--) {
            // 	//检索添加的牌不是三顺取走的牌
            if (
              JSON.stringify(game_data.select.poker).indexOf(
                JSON.stringify(aiPoker[k])
              ) == -1
            ) {
              game_data.select.poker.push(aiPoker[k]);
              //当牌数相等并且最大值比较大的时候
              if (
                game_data.select.poker.length ==
                  game_data.desktop.poker.length &&
                aiPokerNum[j] > game_data.desktop.max
              ) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  game_data.select.poker = [];

  // 没有则炸弹
  return validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank);
}

/**
 * 普通炸弹对比
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 * @returns {boolean}
 */
function rushBombing(aiPokerNum, aiPoker, now_rank, pre_rank) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    if (
      aiPokerNum[i] == aiPokerNum[i - 1] &&
      aiPokerNum[i - 1] == aiPokerNum[i - 2] &&
      aiPokerNum[i - 2] == aiPokerNum[i - 3]
    ) {
      if (aiPokerNum[i - 3] > game_data.desktop.max) {
        game_data.select.poker.push(
          aiPoker[i],
          aiPoker[i - 1],
          aiPoker[i - 2],
          aiPoker[i - 3]
        );

        return true;
      }
    }
  }

  // 没有则王炸
  return checkSupBoom(aiPokerNum, aiPoker);
}

/**
 * 检索王炸和炸弹
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 * @param {string} now_rank 当前玩家身份
 * @param {string} pre_rank 上一个玩家身份
 */
function validateBomb(aiPokerNum, aiPoker, now_rank, pre_rank) {
  // 检索炸弹
  const boom = checkBoom(aiPokerNum, aiPoker);
  // 检索王炸
  const supBoom = checkSupBoom(aiPokerNum, aiPoker);

  // 如果都存在
  if (boom && supBoom) {
    game_data.select.poker.splice(game_data.select.poker.length - 1);
    game_data.select.poker.splice(game_data.select.poker.length - 1);
  }

  if (boom || (supBoom && now_rank != pre_rank)) {
    return boom ? boom : supBoom;
  }

  return false;
}

/**
 * 检索炸弹
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 */
function checkBoom(aiPokerNum, aiPoker) {
  for (let i = aiPokerNum.length - 1; i >= 0; i--) {
    // 如果四张连续的牌都相等
    if (
      aiPokerNum[i] == aiPokerNum[i - 1] &&
      aiPokerNum[i - 1] == aiPokerNum[i - 2] &&
      aiPokerNum[i - 2] == aiPokerNum[i - 3]
    ) {
      game_data.select.poker.push(
        aiPoker[i],
        aiPoker[i - 1],
        aiPoker[i - 2],
        aiPoker[i - 3]
      );

      return true;
    }
  }
  return false;
}

/**
 * 检索炸弹
 * @param {array} aiPokerNum 当前玩家是牌点数
 * @param {array} aiPoker 当前玩家的牌组
 */
function checkSupBoom(aiPokerNum, aiPoker) {
  if (aiPokerNum[0] == 15 && aiPokerNum[1] == 14) {
    game_data.select.poker.push(aiPoker[0], aiPoker[1]);

    return true;
  }
  return false;
}

// 初始化玩家信息
function initUserInfo() {
  player.map((item, index) => {
    $(".username").eq(index).html(item.name);
  });

  // 初始化积分
  $(".integral span").eq(0).html(player[0].gold);
  $(".integral span").eq(1).html(player[2].gold);
  $(".integral span").eq(2).html(player[1].gold);
}

/**
 * 结算阶段函数
 */
function gameClose(num) {
  // 获取本局赢取的分数
  const multiple = $(".multiple span").html().split(" ")[1];
  const count = +multiple * 100;

  let result_list = "";
  // 本局是地主赢了还是农民赢了
  if (game_data.boss == num) {
    sound(game_data.boss == 1 ? winner_1 : loser_1);
    // 除了地主外其它玩家都进行减分
    for (let i = 0; i < 3; i++) {
      if (i != game_data.boss) {
        player[i].gold -= count / 2;
      }
    }

    // 地主玩家加分
    player[game_data.boss].gold += count;

    // 渲染图片
    $(".more_main_top .more_top_result").html(
      game_data.boss == 1 ? "胜利" : "失败"
    );

    for (let i = 0; i < 3; i++) {
      result_list += `
        <div class="more_item flex jc_sa">
          <div class="player_name f_1">
            ${renderPlayer(i)}
          </div>
          <div class="player_integral f_1">${player[i].gold}</div>
          <div class="player_result f_1">${
            game_data.boss == i ? count : -(count / 2)
          }</div>
        </div>
      `;
    }
  } else {
    sound(game_data.boss == 1 ? loser_1 : winner_1);
    // 地主玩家减分
    player[game_data.boss].gold -= count;

    // 除了地主外其它玩家都进行加分
    for (let i = 0; i < 3; i++) {
      if (i != game_data.boss) {
        player[i].gold += count / 2;
      }
    }

    $(".more_top_result").html(game_data.boss == 1 ? "失败" : "胜利");

    for (let i = 0; i < 3; i++) {
      result_list += `
        <div class="more_item flex jc_sa">
          <div class="player_name f_1">
            ${renderPlayer(i)}
          </div>
          <div class="player_integral f_1">${player[i].gold}</div>
          <div class="player_result f_1">${
            game_data.boss == i ? -count : count / 2
          }</div>
        </div>
      `;
    }
  }

  $(".result_list").html(result_list);
  $(".mine .integral span").html(player[1].gold);
  $(".more_game").fadeIn();

  player.map((item) => {
    item.poker.length = 0;
  });

  localStorage.setItem("player", JSON.stringify(player));
}

// 重新游戏
function restart() {
  window.location.href = window.location.href;
}

// 积分榜昵称渲染
function renderPlayer(i) {
  if (i == game_data.boss) {
    return `<img class="player_boss" src="../assets/images/dizhu.png" height="20" width="20" alt=""> ${player[i].name}`;
  } else {
    return `${player[i].name}`;
  }
}

// 显示错误提示
function showTip(title) {
  $(".tip").html(title);
  $(".tip").fadeIn();
  setTimeout(() => {
    $(".tip").fadeOut();
  }, 1500);
}

// 显示当前抢地主提示
function getBossTitle(num, title) {
  $(".qdz").eq(num).html(title);

  $(".qdz").eq(num).fadeIn();

  setTimeout(() => {
    $(".qdz").eq(num).fadeOut();
  }, 2500);
}
