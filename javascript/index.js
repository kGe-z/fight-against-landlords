// 生成牌组数据,其中最先定义好大王和小王牌的数据
const all_poker = [
  { num: 14, color: 0 },
  { num: 15, color: 1 },
];

// 是否在动画中
let animated = false;
// let animated = true;

/**
 * 初始化游戏数据
 */
const game_data = {
  boss: null, // 当前哪位玩家是地主
  play: null, // 当前到哪位玩家出牌
  round: 0,
  // 当前玩家选择中的牌的数据
  select: {
    type: 0, // 选中牌的牌型
    poker: [], // 选中牌的数据
    max: 0, // 选中牌的牌型中用于判断大小的值
  },
  // 提示出牌数组
  tips: {
    poker: [],
  },
  // 玩家牌组
  poker: null,
  // 当前桌面牌组数据
  desktop: {
    type: 0, // 选中牌的牌型
    poker: [], // 选中牌的数据
    max: 0, // 选中牌的牌型中用于判断大小的值
  },
  pass: 1,
};
const player = JSON.parse(localStorage.getItem("player")) || [
  {
    name: "吉大懂王张建国",
    gold: 0,
    poker: [],
  },
  {
    name: "阿斯顿",
    gold: 0,
    poker: [],
  },
  {
    name: "流氓头子",
    gold: 0,
    poker: [],
  },
];
$(function () {
  let click = 0; //游戏开始开关变量

  /**
   * 生成桌面牌组
   */
  let poker_html = "";
  // 初始化玩家信息
  initUserInfo();

  function loadCards() {
    // 生成牌组
    for (let i = 1; i <= 13; i++) {
      for (let j = 0; j <= 3; j++) {
        all_poker.push({ num: i, color: j });
      }
    }

    // 1 中间初始化牌组（假牌组）
    for (let i = 0; i < 54; i++) {
      // 给中间的容器添加牌组
      // 给点牌组重叠感觉
      poker_html += `<li class="back" style='top: ${-(i / 4)}px; left: ${-(
        i / 4
      )}px'></li>`;
    }

    $(".all_poker").html(poker_html);
  }

  /**
   * 发牌
   */
  $(".main_content_top").on("click", ".all_poker li", function () {
    if (click === 0) {
      click++;
      //执行洗牌动画
      clearPoker();
      sound(xp);
      // 把初始牌组的数据顺序打乱三次
      for (let i = 0; i < 3; i++) {
        all_poker.sort((x, y) => Math.random() - 0.5);
      }
    } else {
      // 发牌动画
      animated && dealPoker();
    }
  });

  /**
   * 洗牌动画
   */
  function clearPoker() {
    // 先保存原牌组的HTML代码
    poker_html = $(".main_content_top").html();

    // 1 删除原牌组
    $(".main_content_top ul").remove();

    let ul = "";
    ul += '<ul class="all_poker" style="left:0px">';
    for (var i = 1; i <= 54; i++) {
      ul += `<li class="back" style="left: ${-(i / 4)}px"></li>`;
    }
    ul += "</ul>";

    $(".main_content_top").append(ul);

    /**
     * 动画效果开始
     *  向下 向左 旋转 制造混淆视觉 回到最初位置
     */

    // 上下洗牌 动画
    let p = 54;
    const timer1 = setInterval(function () {
      $(".all_poker li")
        .eq(p)
        .css({
          top: 50 - p + "px",
          left: -(p / 5) + "px",
          "transform-origin": "0px,0px",
          transition: "1s",
        });
      p--;
      p < 0 && clearInterval(timer1);
    }, 10);

    // 向左平移动画
    setTimeout(function () {
      p = 54;
      const timer3 = setInterval(function () {
        $(".all_poker li")
          .eq(p)
          .css({
            left: -p * 10 + 200 + "px",
            "transform-origin": "0px,0px",
            transition: "0.5s",
          });
        p--;
        if (p < 0) {
          clearInterval(timer3);
        }
      }, 50);
    }, 1000);

    // 旋转动画 制造混淆视觉
    setTimeout(function () {
      p = 54;
      const timer2 = setInterval(function () {
        $(".all_poker li")
          .eq(p)
          .css({
            transform: "rotate(360deg)",
            top: -(p / 3) + "px",
            left: -(p / 3) + "px",
            "transform-origin": "0px,0px",
            transition: "1s",
          });
        p--;
        p < 0 && clearInterval(timer2);
      }, 30);
    }, 3500);

    // 回到最初位置
    setTimeout(function () {
      p = 54;
      const timer4 = setInterval(function () {
        $(".all_poker li")
          .eq(p)
          .css({
            top: -(p / 4) + "px",
            left: -(p / 4) + "px",
            "transform-origin": "0px,0px",
            transition: ".1s",
          });
        p--;
        if (p < 0) {
          clearInterval(timer4);
        }
      }, 30);
    }, 5500);

    // 等动画效果完毕后再执行恢复到原来的样子
    setTimeout(function () {
      $(".main_content_top").html(poker_html);
      animated = true;
      SoundPause(xp);
    }, 7500);
  }

  /**
   * 发牌动画
   */
  function dealPoker() {
    // 发牌回数
    let round = 0;

    // 发牌动画
    function go() {
      sound(fp);

      // 左边发牌
      $(".all_poker li:last").animate(
        { top: "200px", left: "-250px" },
        100,
        () => {
          $(".all_poker li:last").remove();
          player[0].poker.push(all_poker.pop()); //左边玩家牌组++

          // 左边渲染牌组
          $(".play_1").append(makeAIPoker());
          $(".play_1 li:last").css({ top: 25 * round + "px" });

          // 中间发牌
          $(".all_poker li:last").animate({ top: "400px" }, 100, () => {
            $(".all_poker li:last").remove();
            player[1].poker.push(all_poker.pop()); //中间玩家牌组++

            // 中间渲染牌组
            $(".play_2").append(
              makePoker(player[1].poker[player[1].poker.length - 1])
            );

            $(".play_2 li:last").css({
              left: 30 * round + $(".play_2").width() * 0.42 + "px",
            });
            $(".play_2").css({ left: -10 * round + "px" });
            // 右边发牌
            $(".all_poker li:last").animate(
              { top: "200px", left: "250px" },
              100,
              () => {
                $(".all_poker li:last").remove();
                player[2].poker.push(all_poker.pop()); //右边玩家牌组++
                // 右边渲染牌组
                $(".play_3").append(makeAIPoker());
                $(".play_3 li:last").css({ top: 25 * round + "px" });

                if (++round <= 16) go();
                else {
                  // 桌面三张牌使用动画方法翻开
                  $(".all_poker li").eq(0).animate(
                    {
                      left: "120px",
                    },
                    400
                  );

                  $(".all_poker li").eq(1).animate(
                    {
                      left: "-120px",
                    },
                    400
                  );
                  $(".all_poker li").animate({ top: "-182px" }, 300);

                  $(".main_content_top").off("click", ".all_poker li"); //解绑
                  // 先得到已经重新整理好的三个玩家牌组数据
                  sortPoker(player[0].poker);
                  sortPoker(player[1].poker);
                  sortPoker(player[2].poker);

                  // 为玩家添加动画牌组排序
                  $(".play_2 li").css({ left: "70%", transition: "all .6s" });

                  // 等0.5秒之后重新生成排序好的牌
                  setTimeout(() => {
                    //先删除2号玩家的牌
                    $(".play_2 li").remove();
                    const len = player[1].poker.length;
                    for (var i = 0; i < len; i++) {
                      //生成2号玩家的牌
                      const poker_html = makePoker(player[1].poker[i]);
                      $(".play_2").append(poker_html);
                      // $(".play_2 li:last").css({ left: 30 * i + "px" });
                      $(".play_2 li:last").css({
                        left: 30 * i + $(".play_2").width() * 0.42 + "px",
                      });
                      $(".play_2").css({ left: -10 * i + "px" });
                    }
                    SoundPause(fp);
                    /**
                     * 发牌结束 进入抢地主阶段
                     */
                    $(".gold").show();
                    player.map((item, index) => {
                      $(".gold span").eq(index).html(item.poker.length);
                    });

                    getBoss();
                  }, 300);
                }
              }
            );
          });
        }
      );
    }

    go();
  }

  /**
   * 抢地主
   * @param {Number} num 玩家
   * @param {Array} get_data 抢地主队列
   */
  function getBoss(num, get_data = [null, null, null]) {
    // 先随机谁开始抢地主
    // if (num === undefined) num = Math.floor(Math.random() * 3);
    if (num === undefined) num = 1;

    // 如果当前玩家已经不抢地主了，所以跳过他再下一个去抢地主
    if (get_data[num] === 0) {
      num = ++num > 2 ? 0 : num;
      getBoss(num, get_data);
      return false;
    }

    // 可以通过num的值来判断第已经选择了几次
    if (game_data.round == 3) {
      // 如果三个玩家都不抢地主的情况
      if (get_data[0] == get_data[1] && get_data[1] == get_data[2]) {
        if (get_data[0] == 0) {
          alert("本局无人抢地主，流局！！");
          window.location.href = window.location.href;
        }
      } else {
        if (get_data[0] == 1 && get_data[1] == 0 && get_data[2] == 0) {
          setBoss(0);
        } else if (get_data[0] == 0 && get_data[1] == 1 && get_data[2] == 0) {
          setBoss(1);
        } else if (get_data[0] == 0 && get_data[1] == 0 && get_data[2] == 1) {
          setBoss(2);
        }
      }
      if (game_data.boss != undefined) return false;
    }
    // 所有的组件先隐藏
    $(".landlord").hide();

    // 把对应选择权的玩家的组件显示
    if (num == 1) {
      $(".landlord").show();

      // 解绑事件
      $(".landlord .confirm").off(); // 把目标 元素上的所有事件解除
      $(".landlord .cancel").off();
    }
    // 把对应选择权的玩家的组件显示
    AIshowClock(num, get_data);
  }

  /**
   * 显示抢地主 + 时钟
   * @param {Number} num 玩家
   * @param {Array} get_data 抢地主队列
   */
  function AIshowClock(num, get_data) {
    if (game_data.round > 4) return false;
    //绑定抢地主方法
    const landlordNum = num + 1;
    $(`.play_${landlordNum}`).parent().find(".clock_wrap").show();

    if (landlordNum !== 2) {
      //AI时间改成3秒
      $(`.play_${landlordNum}`).parent().find(".clock_wrap .clock").html(3);
      $("body").off("click", ".landlord button"); //解绑
    } else {
      $(`.play_${landlordNum}`).parent().find(".clock_wrap .clock").html(30);
      $(".landlord").show();

      $(".main_bottom_bottom").on("click", ".landlord button", function () {
        const index = $(this).data("index");
        $(".clock_wrap").hide();
        $(".landlord").hide();
        clearInterval(int);

        // 玩家抢地主
        SetLandlords(index, num, get_data, int);
      });
    }

    //先开启计时器
    const int = setInterval(function () {
      let n = Number(
        $(`.play_${landlordNum}`).parent().find(".clock_wrap .clock").html()
      );
      $(`.play_${landlordNum}`)
        .parent()
        .find(".clock_wrap .clock")
        .html(--n);
      if (n <= 0) {
        $(".clock_wrap").hide();
        $(".landlord").hide();
        clearInterval(int);
        //======================================================================================
        //时间到零，自动pass
        //检测牌桌上是否有牌，有就直接pass，没就自动出最小的牌
        const index = num == 1 ? 0 : AIGetBoss(num);

        SetLandlords(index, num, get_data, int);
      }
    }, 1000);
  }

  /**
   * 判断AI抢地主
   * @param {Number} index 索引
   * @param {Number} num 玩家
   * @param {Array} get_data 抢地主队列
   */
  function SetLandlords(index, num, get_data, int) {
    if (index > 0) {
      // 抢地主音频
      sound(num == 1 ? qdz_yes_play : qdz_yes);

      // 显示抢地主
      getBossTitle(num, "抢地主");

      get_data[num] = 1; // 设置当前玩的选择
      // 加倍
      redouble();

      game_data.round++;

      // 如果当前玩家抢地主是第四轮抢的话就肯定能抢到地主了
      if (game_data.round == 4) {
        setBoss(num);
      } else {
        num = ++num > 2 ? 0 : num;

        getBoss(num, get_data);
      }
    } else {
      //否则继续下一个抢
      // 不抢音频
      sound(num == 1 ? qdz_no_play : qdz_no);

      // 显示抢地主
      getBossTitle(num, "不抢");

      get_data[num] = 0; // 设置当前玩的选择

      game_data.round++;
      let boss;
      // 第四次选择不抢的话也肯得到谁是地主了
      $(".clock_wrap").hide();

      if (game_data.round == 4) {
        let pre_get = num - 1 < 0 ? 2 : num - 1;

        if (get_data[pre_get] == 1) {
          boss = pre_get;
        } else {
          boss = pre_get - 1 < 0 ? 2 : pre_get - 1;
        }

        setBoss(boss);
      } else {
        num = ++num > 2 ? 0 : num;

        getBoss(num, get_data);
      }
    }
  }

  /**
   * AI自动抢地主
   * @param {number} num 玩家
   * @returns {boolean} 返回布尔值
   */
  function AIGetBoss(num) {
    // 获取牌组
    const ai_poker = player[num].poker;

    const ai_getboss_poker = [];

    ai_poker.map((item) => {
      const { num } = item;
      // 如果存在 大小王 或者 2 和 1 则添加至数组进行判断
      if (num == 14 || num == 15 || num == 13 || num == 12) {
        ai_getboss_poker.push(num);
      }
    });

    let num1 = 0;
    let num2 = 0;
    let num3 = 0;

    ai_getboss_poker.map((item) => {
      // item 可能为 String 类型  添加 + 转化为数字类型
      switch (+item) {
        case 15:
        case 14:
          num1++;
          return;
        case 13:
          num2++;
          return;
        case 12:
          num3++;
          return;
      }
    });

    // 如果符合条件就抢地主
    const flag = num1 >= 1 || num2 >= 2 || num3 >= 2;

    return flag ? 1 : 0;
  }

  /**
   * 设置地主 + 动画
   * @param {Number} num 玩家
   */
  function setBoss(num) {
    // 设置当前地主玩家
    game_data.boss = num;

    render_pre();
    $(".user_info .name").eq(num).html("地主");
    $(".avatar .dz").eq(num).show();

    player[num].poker.push(...all_poker);
    sortPoker(player[num].poker);
    if (num === 1) {
      // 中间渲染牌组
      // 为玩家添加动画牌组排序
      $(".play_2 li").animate(
        { left: "70%", transition: "all .6s" },
        500,
        () => {
          //先删除2号玩家的牌
          $(".play_2 li").remove();
          const len = player[num].poker.length;
          for (var i = 0; i < len; i++) {
            //生成2号玩家的牌
            const poker_html = makePoker(player[num].poker[i]);
            $(".play_2").append(poker_html);

            $(".play_2 li:last").css({
              left: 30 * i + $(".play_2").width() * 0.42 + "px",
            });
            $(".play_2").css({ left: -10 * i + "px" });
          }
        }
      );
    } else {
      // 右边渲染牌组
      for (let i = 0; i < all_poker.length; i++) {
        $(`.play_${num + 1}`).append(makeAIPoker());
        $(`.play_${num + 1} li:last`).css({
          top: 25 * (i + 17) + "px",
        });
      }
    }

    //地主牌生成需要400毫秒，所以要等500毫秒才地主牌给玩家
    setTimeout(function () {
      game_data.play = num; // 设置当前出牌的玩家
      game_data.poker = JSON.parse(JSON.stringify(player[1].poker));
      startGame(0); //开始游戏
    }, 1000);
  }

  /**
   * 开始游戏
   */
  function startGame() {
    const index = game_data.play + 1;
    // if (index == 2) move(); //只有在轮到玩家2的时候才绑定出牌

    // 实时刷新剩余牌数
    for (let i = 0; i < player.length; i++)
      $(".gold span").eq(i).html(player[i].poker.length);

    //绑定打牌玩家可以点击牌的事件函数
    $(`.play_${index}`).parent().find(".clock_wrap").show();

    if (index === 2) $(".go_play").show();

    //先开启计时器
    const n = index !== 2 ? 3 : 30;
    //AI时间改成 3 s 玩家时间改成 30 s
    $(`.play_${index}`).parent().find(".clock_wrap .clock").html(n);

    // 设置定时器
    const int = setInterval(function () {
      // 获取当前剩余时间
      let num = Number(
        $(`.play_${index}`).parent().find(".clock_wrap .clock").html()
      );
      $(`.play_${index}`)
        .parent()
        .find(".clock_wrap .clock")
        .html(--num);
      if (num == 5 && index == 2) {
        //玩家2才会花都谢语音
        // sound(huadouxiele);
      }
      if (num <= 0) {
        $(`.play_${index}`).parent().find(".clock_wrap").hide();
        if (index === 2) $(".go_play").hide();
        // 关闭定时器
        clearInterval(int);
        //======================================================================================
        //时间到零，自动pass
        //检测牌桌上是否有牌，有就直接pass，没就自动出最小的牌
        if (game_data.desktop.poker.length == 0) {
          //Ai自动出最小的牌
          autoPlay(index);
          playCard(int);
        } else {
          if (index === 2) {
            //需要恢复回自己时间到自动过牌
            passCard(int);
          } else {
            //自动分析牌型出牌出牌
            aiPlayer(index)
              ? playCard(int) //打得过
              : passCard(int); //打不过就PASS;
          }
        }
      }
    }, 1000);

    //清除默认的右键事件并且重新绑定右键出牌
    if (index == 2) {
      move(); //只有在轮到玩家2的时候才绑定出牌

      $(document).contextmenu("body", function (e) {
        e.preventDefault();
      });
      $("body").bind("mousedown", function (e) {
        if (e.button == 2) {
          //右键
          $(".go_play .play").trigger("click");
        }
      });

      //================================出牌点击按钮==============================================================
      $(".main_bottom_bottom").on("click", ".go_play .play", () => {
        playCard(int);
      });
      //================================PASS按钮==================================================================
      $(".main_bottom_bottom").on("click", ".go_play .pass", () =>
        passCard(int)
      );
      //================================提示按钮==================================================================
      $(".main_bottom_bottom").on("click", ".go_play .tips", () => {
        tipsCard(index);
      });
    }
  }

  /**
   * 自动出牌
   * @param {number} index 当前出牌玩家
   */
  function autoPlay(index) {
    //还要修改这个函数 自动会出其他牌型和下家报单的时候不能出单张
    // 获取当前出牌玩家的身份和牌组
    const nowRank = $(".name")
      .eq(index - 1)
      .html();
    const nowPoker = player[index - 1].poker;

    // 获取下一个玩家的身份和牌组
    let nextPoker, nextRank;
    if (index == 1) {
      nextPoker = player[1].poker;
      nextRank = $(".name").eq(1).html();
    } else if (index == 2) {
      nextPoker = player[2].poker;
      nextRank = $(".name").eq(2).html();
    } else if (index == 3) {
      nextPoker = player[1].poker;
      nextRank = $(".name").eq(0).html();
    }

    const pokerNum = []; //牌编号

    //分离提取牌型数据
    nowPoker.map((item) => {
      pokerNum.push(item.num);
    });

    if (nowRank == nextRank && nextPoker.length === 1) {
      //下家剩一个牌并且是一个阵容的时候
      game_data.select.poker.push(nowPoker[nowPoker.length - 1]); //打出最小
    } else if (nowRank == nextRank && nextPoker.length === 2) {
      //下家剩2张并且是一个阵容
      for (let i = pokerNum.length - 1; i >= 0; i--) {
        //打出一个对子放你过
        if (pokerNum[i] == pokerNum[i - 1]) {
          game_data.select.poker.push(nowPoker[i], nowPoker[i - 1]);
          return true;
        }
      }

      //没有对子的话继续按常规出牌
      Routine(nowPoker, pokerNum);
    } else if (nowRank != nextRank && nextPoker.length === 1) {
      //下家剩一个牌并且不是一个阵容的时候
      for (var i = nowPoker.length - 1; i >= 0; i--) {
        //优先出对子
        if (nowPoker[i] == nowPoker[i - 1]) {
          game_data.select.poker.push(nowPoker[i]);
          game_data.select.poker.push(nowPoker[i - 1]);
          return true;
        }
      }
      game_data.select.poker.push(nowPoker[0]); //没有对子的话要顶大，0为最大的牌
    } else {
      //继续按常规出牌
      Routine(nowPoker, pokerNum);
    }
  }

  /**
   * AI出牌
   * @param {number} index (当前玩家 + 1)
   */
  function aiPlayer(index) {
    const aiPokerNum = []; //牌编号
    // 获取自己的身份
    const now_rank = $(".name")
      .eq(index - 1)
      .html();
    // 获取自己的牌组
    const aiPoker = player[index - 1].poker;

    //分离提取牌型数据
    aiPoker.map((item) => {
      aiPokerNum.push(item.num);
    });

    //先判断牌型   再判断大小   再判断身份
    let next_play, next_rank, pre_rank;

    // 获取下一个人的牌组和身份
    if (game_data.play == 0) {
      next_play = player[1].poker;
      next_rank = $(".name").eq(1).html();
      pre_rank = $(".name").eq(3).html();
    } else if (game_data.play == 1) {
      next_play = player[2].poker;
      next_rank = $(".name").eq(2).html();
      pre_rank = $(".name").eq(0).html();
    } else if (game_data.play == 2) {
      next_play = player[0].poker;
      next_rank = $(".name").eq(0).html();
      pre_rank = $(".name").eq(1).html();
    }

    // 获取桌面牌的类型
    const type = game_data.desktop.type;

    switch (type) {
      // 桌面无牌
      case 0:
        game_data.select.poker.push(aiPoker[aiPoker.length - 1]);
        return true;
      //单张
      case 1:
        //单张的时候要进行顶大，只要不是一个阵营
        if (now_rank != next_rank && next_play.length == 1) {
          //并且能打过
          if (aiPokerNum[0] > game_data.desktop.max) {
            game_data.select.poker.push(aiPoker[0]);
            return true;
          } else return false;
        } else {
          //否则按常规出牌
          return rushPoker(now_rank, pre_rank, rushDan, aiPokerNum, aiPoker);
        }
      // 对子
      case 2:
        return rushPoker(now_rank, pre_rank, rushDouble, aiPokerNum, aiPoker);
      // 三张牌
      case 3:
        return rushPoker(now_rank, pre_rank, rushThree, aiPokerNum, aiPoker);
      // 四张牌 三带一
      case 4:
        return rushPoker(now_rank, pre_rank, rushAAAB, aiPokerNum, aiPoker);
      // 五张牌 三带二
      case 5:
        return rushPoker(now_rank, pre_rank, rushAAABB, aiPokerNum, aiPoker);
      // 5张、6张、7张、8张、9张、10张、11张、12张 顺子
      case 6:
      case 10:
      case 11:
      case 12:
      case 16:
      case 18:
      case 21:
      case 22:
        return rushPoker(now_rank, pre_rank, rushShunzi, aiPokerNum, aiPoker);
      // 6张、8张、10张、12张、14张、16张、18张、20张连对
      case 9:
      case 13:
      case 19:
      case 23:
      case 26:
      case 29:
      case 31:
      case 32:
        return rushPoker(now_rank, pre_rank, rushLiandui, aiPokerNum, aiPoker);
      //6张 2*3 飞机 12张 4*3飞机 15张 5*3飞机
      case 8:
      case 24:
      case 27:
        return rushPoker(now_rank, pre_rank, rushSanShun, aiPokerNum, aiPoker);
      // 带单飞机 8张 飞机 12张 3带1小飞机 16张 4*3带1小飞机
      case 14:
      case 25:
      case 30:
        return rushPoker(
          now_rank,
          pre_rank,
          rushPlaneSingle,
          aiPokerNum,
          aiPoker
        );
      // 炸弹
      case 998:
        return rushPoker(now_rank, pre_rank, rushBombing, aiPokerNum, aiPoker);
    }
  }

  /**
   * 常规出牌
   * @param {array} nowPoker 当前牌组
   * @param {array} pokerNum 分离提取牌型数据
   */
  function Routine(nowPoker, pokerNum) {
    // 分离提取牌型数据的长度
    const len = pokerNum.length;

    if (
      pokerNum[len - 1] === pokerNum[len - 2] &&
      pokerNum[len - 2] === pokerNum[len - 3]
    ) {
      game_data.select.poker.push(
        nowPoker[len - 1],
        nowPoker[len - 2],
        nowPoker[len - 3]
      );

      for (var i = len - 1; i >= 0; i--) {
        if (pokerNum[i] !== pokerNum[len - 1]) {
          game_data.select.poker.push(nowPoker[i]);
          return true;
        }
      }
    } else if (pokerNum[len - 1] === pokerNum[len - 2]) {
      game_data.select.poker.push(nowPoker[len - 1], nowPoker[len - 2]);
      return true;
    } else {
      // 清空数组
      game_data.select.poker.length = 0;
      game_data.select.poker.push(nowPoker[nowPoker.length - 1]);
      return true;
    }
  }

  /**
   * 出牌
   * @param {number} int 定时器
   */
  const poker_2_left = +$(".now_poker_2").offset().left;
  function playCard(int) {
    //对出牌进行检测
    if (!validatePokers(game_data.select)) {
      showTip("出牌格式错误");
    } else {
      //判断牌面大小牌型
      if (checkVS()) {
        game_data.poker = JSON.parse(JSON.stringify(player[1].poker));
        //播发PASS音效
        sound(cp_yes);

        //播放出牌音频
        SoundPlay(game_data.select);

        // 判断是否为炸弹或者王炸
        if (game_data.select.type == 998 || game_data.select.type == 999)
          redouble();

        //说明能打出去
        game_data.pass = 1;
        const index = game_data.play + 1;

        //关计时器
        clearInterval(int);
        // 解除原来绑定的事件
        clickOff();
        $(".main_content_bottom").unbind("mousedown"); //解除右键出牌的绑定事件

        //判断第几个玩家出牌，出牌的上上个玩家的牌被清空
        if (index == 1) {
          $(".now_poker_2 li").remove();
        } else if (index == 2) {
          $(".now_poker_3 li").remove();
        } else if (index == 3) {
          $(".now_poker_1 li").remove();
        }

        // 1、如果能出的话，首选需要把手牌的数据替换掉桌面的数据
        game_data.desktop.type = game_data.select.type;
        game_data.desktop.max = game_data.select.max;
        // 由于数组也是引用赋值，所以数组的拷贝需要使用循环进行遍历
        game_data.desktop.poker = [];
        game_data.select.poker.map((item) => {
          game_data.desktop.poker.push({
            num: item.num,
            color: item.color,
          });
        });

        // 出牌动画
        pokerAnimation(game_data.select.type);

        //让玩家的牌出到对应的位置
        const desktop_arr = game_data.desktop.poker;
        sortPoker(desktop_arr);

        desktop_arr.map((item, i) => {
          const li = makePoker(item);
          $(`.now_poker_${index}`).append(li);

          $(".now_poker_" + index + " li:last").css({
            left: 30 * i + "px",
          });

          if (index == 3) {
            const poker_right = 70 + 20 * i;
            $(`.now_poker_3`).css({
              right: +i > 2 ? poker_right + "px" : "70px",
            });
          }

          if (index == 2) {
            $(`.now_poker_2`).css({
              left: i > 5 ? poker_2_left * 0.62 - 10 * i + "px" : "50%",
            });
          }
        });

        // 删除玩家手牌对应出牌的数据
        delPoker();
        $(`.play_${index} li`).remove();

        //按钮隐藏
        $(`.play_${index}`).parent().find(".clock_wrap").hide();
        if (index === 2) $(".go_play").hide();

        // 实时 保单/双
        doubleEntry(player[game_data.play].poker);

        // 玩家手牌数据删除后，有可能玩家就已经没朋手牌了。所以每一次出牌都应该先进行本局游戏的胜负
        if (player[game_data.play].poker.length == 0) {
          // 进入结算阶段
          gameClose(game_data.play);
          clearInterval(int);
          return false;
        }

        // 将牌组重新排好顺序
        sortPoker(player[1].poker);
        for (var i = 0; i < player[index - 1].poker.length; i++) {
          if (index === 2) {
            // 重新生成1号玩家的牌
            $(".play_2").append(makePoker(player[1].poker[i]));

            $(".play_2 li:last").css({
              left: 30 * i + $(".play_2").width() * 0.42 + "px",
            });
            $(".play_2").css({ left: -10 * i + "px" });
          } else {
            // 重新生成玩家的牌
            $(`.play_${index}`).append(makeAIPoker());
            $(`.play_${index} li:last`).css({ top: 25 * i + "px" });
          }
        }

        // 选中的牌组数据要清空
        game_data.select.type = 0;
        game_data.select.poker = [];
        game_data.select.max = 0;

        game_data.play = ++game_data.play > 2 ? 0 : game_data.play; // 设置下一个出牌的玩家
        // 使用自调函数让下一个玩家出牌
        startGame(); //递归调用开始打牌函数
        // playPoker(0);
      } else {
        showTip("出牌格式错误");
      }
    }
  }

  /**
   * 不出
   * @param {number} int 定时器
   */
  function passCard(int) {
    // 如果要出的牌
    if (game_data.desktop.poker.length == 0) {
      return false;
    }

    game_data.poker = JSON.parse(JSON.stringify(player[1].poker));
    //播发PASS音效
    sound(game_data.play == 1 ? cp_no_play : cp_no);

    // 显示不出
    getBossTitle(game_data.play, "不出");

    // 清除对压的数据
    if (game_data.pass > 1) {
      ShunZi_music = 0; // 顺子对压
      LianDui_music = 0; // 连对对压
      FeiJi_music = 0; // 飞机对压
    }

    // sound(cp_no);
    const index = +game_data.play + 1;
    //点击pass，所有被选中的牌会被取消选中
    if (index == 2) {
      for (let i = 0; i < 21; i++) {
        if ($(`.play_2 li`).eq(i).hasClass("select")) {
          //如果牌已经选中了，就弹下去
          $(`.play_2 li`).eq(i).removeClass("select");
          game_data.select.poker.splice(0, 1);
        }
      }
    }

    clearInterval(int);
    //按钮隐藏
    $(".go_play").hide();
    clickOff();

    game_data.pass++;
    //点击pass，上上个玩家的牌也会消失
    if (index === 1) $(".now_poker_2 li").remove();
    else if (index === 2) $(".now_poker_3 li").remove();
    else if (index === 3) $(".now_poker_1 li").remove();

    if (game_data.pass > 2) {
      game_data.pass = 1;

      //pass两次，清空台面所有牌
      game_data.desktop.poker.length = 0;
      game_data.desktop.max = 0;
      game_data.desktop.type = 0;

      $(".now_poker_1 li").remove();
      $(".now_poker_2 li").remove();
      $(".now_poker_3 li").remove();
    }

    $(`.play_${index}`).parent().find(".clock_wrap").hide();

    game_data.play = ++game_data.play > 2 ? 0 : game_data.play; // 设置下一个出牌的玩家
    startGame(); //继续游戏下一个玩家出牌
  }

  /**
   * 提示
   * @param {number} index  当前玩家
   */
  function tipsCard(index) {
    /* 判断出牌 */
    if (tipsPlayer(index)) {
      game_data.tips.poker = game_data.select.poker;
      sortTips();
    } else {
      showTip("没有牌可以打出");
    }
  }

  // 提示牌组
  function sortTips() {
    $(".play_2 li").removeClass("select");
    $(".play_2 li").each(function (i, play) {
      const num = $(this).data("num");
      const color = $(this).data("color");
      game_data.tips.poker.map((item) => {
        if (item.num == num && item.color == color)
          !$(this).hasClass("select") && $(this).addClass("select");
      });
    });
  }

  /**
   * 提示出牌
   * @param {number} index (当前玩家 + 1)
   */
  function tipsPlayer(index) {
    const aiPokerNum = []; //牌编号
    // 获取自己的身份
    const now_rank = $(".name")
      .eq(index - 1)
      .html();
    // 获取自己的牌组
    const aiPoker = player[index - 1].poker;

    //分离提取牌型数据
    aiPoker.map((item) => {
      aiPokerNum.push(item.num);
    });
    //先判断牌型   再判断大小   再判断身份
    let next_play, next_rank, pre_rank;

    // 获取下一个人的牌组和身份
    if (game_data.play == 0) {
      next_play = player[1].poker;
      next_rank = $(".name").eq(1).html();
      pre_rank = $(".name").eq(3).html();
    } else if (game_data.play == 1) {
      next_play = player[2].poker;
      next_rank = $(".name").eq(2).html();
      pre_rank = $(".name").eq(0).html();
    } else if (game_data.play == 2) {
      next_play = player[0].poker;
      next_rank = $(".name").eq(0).html();
      pre_rank = $(".name").eq(1).html();
    }
    // 获取桌面牌的类型
    const type = game_data.desktop.type;
    if (index == 2 && game_data.poker.length == 1) {
      game_data.poker = JSON.parse(JSON.stringify(player[1].poker));
    }

    switch (type) {
      // 桌面无牌
      case 0:
        // 如果之前选中的牌组跟选中的数组一样
        if (autoTipsPoker(TipsPoker0)) {
          game_data.select.poker = [].concat(
            game_data.poker[game_data.poker.length - 1]
          );
        } else {
          game_data.select.poker = [].concat(aiPoker[aiPoker.length - 1]);
        }
        return true;
      //单张
      case 1:
        // 单牌并且能打过
        if (!autoTipsPoker(TipsPoker1)) {
          let res = false;
          for (let i = aiPokerNum.length - 1; i >= 0; i--) {
            if (aiPokerNum[i] > game_data.desktop.max) {
              game_data.select.poker = [].concat(aiPoker[i]);
              res = true;
              break;
            }
          }
          return res;
        } else return true;
      // 对子
      case 2:
        if (!autoTipsPoker(TipsPoker2)) {
          for (let i = aiPokerNum.length - 1; i >= 0; i--) {
            if (
              aiPokerNum[i] > game_data.desktop.max &&
              aiPokerNum[i] == aiPokerNum[i - 1]
            ) {
              game_data.select.poker = [].concat(aiPoker[i], aiPoker[i - 1]);
              return true;
            }
          }
        } else return true;
      // 三张牌
      case 3:
        if (!autoTipsPoker(TipsPoker3)) {
          // 如果有三张牌大于桌面的牌
          for (let i = aiPokerNum.length - 1; i >= 0; i--) {
            if (
              aiPokerNum[i] > game_data.desktop.max &&
              aiPokerNum[i] == aiPokerNum[i - 1] &&
              aiPokerNum[i - 1] == aiPokerNum[i - 2]
            ) {
              game_data.select.poker = [].concat(
                aiPoker[i],
                aiPoker[i - 1],
                aiPoker[i - 2]
              );

              return true;
            }
          }
        } else return true;
      // 四张牌 三带一
      case 4:
        return rushPoker(now_rank, pre_rank, rushAAAB, aiPokerNum, aiPoker);
      // 五张牌 三带二
      case 5:
        return rushPoker(now_rank, pre_rank, rushAAABB, aiPokerNum, aiPoker);
      // 5张、6张、7张、8张、9张、10张、11张、12张 顺子
      case 6:
      case 10:
      case 11:
      case 12:
      case 16:
      case 18:
      case 21:
      case 22:
        return rushPoker(now_rank, pre_rank, rushShunzi, aiPokerNum, aiPoker);
      // 6张、8张、10张、12张、14张、16张、18张、20张连对
      case 9:
      case 13:
      case 19:
      case 23:
      case 26:
      case 29:
      case 31:
      case 32:
        return rushPoker(now_rank, pre_rank, rushLiandui, aiPokerNum, aiPoker);
      //6张 2*3 飞机 12张 4*3飞机 15张 5*3飞机
      case 8:
      case 24:
      case 27:
        return rushPoker(now_rank, pre_rank, rushSanShun, aiPokerNum, aiPoker);
      // 带单飞机 8张 飞机 12张 3带1小飞机 16张 4*3带1小飞机
      case 14:
      case 25:
      case 30:
        return rushPoker(
          now_rank,
          pre_rank,
          rushPlaneSingle,
          aiPokerNum,
          aiPoker
        );
      // 炸弹
      case 998:
        return rushPoker(now_rank, pre_rank, rushBombing, aiPokerNum, aiPoker);
    }
  }

  // 显示聊天弹窗
  $(".mine .chat").click((e) => {
    e.stopPropagation();
    $(".chat_hover").stop().slideToggle();
  });
  $(".main").click(() => {
    if ($(".chat_hover").is(":visible")) $(".chat_hover").slideUp();
  });

  /*
  20 100
  19 110
  18 120
  17 130
  16 140
  15 150
  13 200
  11 270
  10 260
  9 260
  8 280
  7 300
  1 380
  */

  // 开始渲染
  loadCards();
});
