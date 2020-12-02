/**
 * 获取指定对象
 * @param {element} element 元素对象
 * @param {*} flag 单个 false 所有 true
 */
function getSelector(element, flag = false) {
  return flag
    ? document.querySelectorAll(element)
    : document.querySelector(element);
}

const xp = getSelector("#xp"); //洗牌
const fp = getSelector("#fp"); //发牌

/* AI 通用 */
const qdz_yes = getSelector("#qdz_yes"); //抢地主
const qdz_no = getSelector("#qdz_no"); //不抢
const cp_yes = getSelector("#cp_yes"); //出牌
const cp_no = getSelector("#cp_no"); //不出
/* 玩家 通用 */
const qdz_yes_play = getSelector("#qdz_yes_play"); //抢地主
const qdz_no_play = getSelector("#qdz_no_play"); //不抢
const cp_no_play = getSelector("#cp_no_play"); //不出

/* AI */
const baodan = getSelector("#baodan"); //报单
const baoshuang = getSelector("#baoshuang"); //报双
/* 玩家 */
const baodan_play = getSelector("#baodan_play"); //报单
const baoshuang_play = getSelector("#baoshuang_play"); //报双

/* AI */
const feiji_1 = getSelector("#feiji_1"); // 飞机
const shunzi_1 = getSelector("#shunzi_1"); // 顺子
const liandui_1 = getSelector("#liandui_1"); // 连对
/* 玩家 */
const feiji_1_play = getSelector("#feiji_1_play"); // 飞机
const shunzi_1_play = getSelector("#shunzi_1_play"); // 顺子
const liandui_1_play = getSelector("#liandui_1_play"); // 连对

/* AI */
const san_one_music = getSelector("#san_one_music"); // 3带 1
const san_two_music = getSelector("#san_two_music"); // 3带 2
/* 玩家 */
const san_one_music_paly = getSelector("#san_one_music_paly"); // 3带 1
const san_two_music_paly = getSelector("#san_two_music_paly"); // 3带 2

/* AI */
const si_one_music = getSelector("#si_one_music"); // 4带 2
const si_two_music = getSelector("#si_two_music"); // 4带 一对
/* 玩家 */
const si_one_music_paly = getSelector("#si_one_music_paly"); // 4带 2
const si_two_music_paly = getSelector("#si_two_music_paly"); // 4带 一对

/* AI */
const zhadan_1 = getSelector("#zhadan_1"); // 炸弹
const wangzha_1 = getSelector("#wangzha_1"); // 王炸
/* 玩家 */
const zhadan_1_play = getSelector("#zhadan_1_play"); // 炸弹
const wangzha_1_play = getSelector("#wangzha_1_play"); // 王炸

const winner_1 = getSelector("#winner_1"); // 成功
const loser_1 = getSelector("#loser_1"); // 失败

/* 玩家聊天 */
const chat_sound = [];
for (let i = 1; i < 8; i++) {
  chat_sound.push(getSelector(`#chat_${i}`));
}

// 单牌音频
const dan_sound = [];
for (let i = 1; i <= 15; i++) {
  dan_sound[i] = getSelector(`#dan_${i}`);
}

const dan_player_sound = [];
for (let i = 1; i <= 15; i++) {
  dan_player_sound[i] = getSelector(`#dan_play_${i}`);
}

// 对子音频
const dui_sound = [];
for (let i = 1; i <= 15; i++) {
  dui_sound[i] = getSelector(`#dui_${i}`);
}

const dui_play_sound = [];
for (let i = 1; i <= 15; i++) {
  dui_play_sound[i] = getSelector(`#dui_play_${i}`);
}

// 对压音频
const duiya_sound = [];
for (let i = 1; i <= 3; i++) {
  duiya_sound[i] = getSelector(`#duiya_${i}`);
}
const duiya_play_sound = [];
for (let i = 1; i <= 3; i++) {
  duiya_play_sound[i] = getSelector(`#duiya_play_${i}`);
}

/**
 * 播放音乐入口
 * @param {element} music
 */
function sound(music) {
  music.play();
}

/**
 * 停止音乐入口
 * @param {element} music
 */
function SoundPause(music) {
  music.pause();
}

/**
 * 播放出牌音效
 * @param {object} data
 */
/* 
  3 1
  4 2
  5 3
  6 4
  7 5
  8 6
  9 7
  10 8
  J 9
  Q 10
  K 11
  A 12
  2 13
  x 14
  d 15
*/

let ShunZi_music = 0; // 顺子对压
let LianDui_music = 0; // 连对对压
let FeiJi_music = 0; // 飞机对压

const liandui_map = new Map().set(1);

function SoundPlay(data) {
  const type = data.type;
  const isPlayer = game_data.play == 1;
  switch (type) {
    //判断单张音效
    case 1:
      sound(isPlayer ? dan_player_sound[data.max] : dan_sound[data.max]);
      break;
    // 判断对子音效
    case 2:
      sound(isPlayer ? dui_play_sound[data.max] : dui_sound[data.max]);
      break;
    // 判断连对音效
    case 9:
    case 13:
    case 19:
    case 23:
    case 26:
    case 29:
    case 31:
    case 32:
      LianDui_music = LianDui_music > 3 ? 1 : LianDui_music;
      if (isPlayer) {
        sound(
          LianDui_music == 0 ? liandui_1_play : duiya_play_sound[LianDui_music]
        );
      } else {
        sound(LianDui_music == 0 ? liandui_1 : duiya_sound[LianDui_music]);
      }
      ++LianDui_music;
      break;
    // 判断顺子音效
    case 6:
    case 10:
    case 11:
    case 12:
    case 16:
    case 18:
    case 21:
    case 22:
      ShunZi_music = ShunZi_music > 3 ? 1 : ShunZi_music;
      if (isPlayer) {
        sound(
          ShunZi_music == 0 ? shunzi_1_play : duiya_play_sound[ShunZi_music]
        );
      } else {
        sound(ShunZi_music == 0 ? shunzi_1 : duiya_sound[ShunZi_music]);
      }

      ++ShunZi_music;
      break;
    // 判断飞机音效
    case 8:
    case 14:
    case 17:
    case 20:
    case 24:
    case 25:
    case 27:
    case 28:
    case 30:
    case 33:
      FeiJi_music = FeiJi_music > 3 ? 1 : FeiJi_music;
      if (isPlayer) {
        sound(FeiJi_music == 0 ? feiji_1_play : duiya_play_sound[FeiJi_music]);
      } else {
        sound(FeiJi_music == 0 ? feiji_1 : duiya_sound[FeiJi_music]);
      }
      ++FeiJi_music;
      break;
    // 判断是否为 3带1
    case 4:
      sound(isPlayer ? san_one_music_paly : san_one_music);
      break;
    // 判断是否为 3带2
    case 5:
      sound(isPlayer ? san_two_music_paly : san_two_music);
      break;
    // 判断是否为 3带2
    case 7:
      sound(isPlayer ? si_one_music_paly : si_one_music);
      break;
    // 判断是否为 3带2
    case 15:
      sound(isPlayer ? si_two_music_paly : si_two_music);
      break;
    // 判断是否为 3带2
    case 998:
      sound(isPlayer ? zhadan_1_play : zhadan_1);
      break;
    // 判断是否为 3带2
    case 999:
      sound(isPlayer ? wangzha_1_play : wangzha_1);
      break;
    default:
      sound(cp_yes);
  }
}

// 获取 item 对象
const chat_item = getSelector(".chat_item", true);
$(".chat_hover").on("click", ".chat_item", (e) => {
  index = Array.prototype.indexOf.call(chat_item, e.target);

  // 设置聊天术语
  $(".chat span").html($(chat_item).eq(index).html());

  $(".chat_hover").slideUp();
  $(".user_wrap .chat").stop().fadeIn();
  // 播放聊天音频
  sound(chat_sound[index]);
  setTimeout(() => {
    $(".user_wrap .chat").stop().fadeOut();
  }, 2000);
});
