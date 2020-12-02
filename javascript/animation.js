// 飞机动画
function FlyAnimate() {
  $(".fly").animate({ left: "100%", top: "-300px" }, 4500);
}

// 连对动画
function LianduiAnimate() {
  $(".liandui p:eq(0)").animate({ top: "0" }, 500);
  $(".liandui p:eq(1)")
    .animate({ top: "-150px" }, 100)
    .animate({ top: "0" }, 500);
  $(".liandui p:eq(2)")
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "0px" }, 500);
  $(".liandui p:eq(3)")
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "0px" }, 500);
  $(".liandui p:eq(4)")
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "0px" }, 500);
  $(".liandui p:eq(5)")
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "0px" }, 500);
  $(".liandui p:eq(6)")
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "-150px" }, 100)
    .animate({ top: "0px" }, 500);
  $(".liandui").animate({ opacity: "1" }, 850, function () {
    $(".liandui").animate({ opacity: "0" }, 1500);
  });
}

// 顺子动画
function ShunziAnimate() {
  $(".shunzi")
    .animate({ left: "35%" }, 1200)
    .animate({ left: "50%", opacity: "1" }, 600)
    .animate({ left: "-650px" }, 1000)
    .animate({ left: "100%" }, 1);

  $(".star img:eq(1),.star img:eq(5)")
    .animate({ opacity: "0.7" }, 2500)
    .animate({ opacity: "1" }, 500)
    .animate({ opacity: "0" }, 2000);

  $(".star img:eq(2),.star img:eq(6)")
    .animate({ opacity: "0.5" }, 2500)
    .animate({ opacity: "1" }, 500)
    .animate({ opacity: "0" }, 3200);

  $(".star img:eq(4),.star img:eq(0)")
    .animate({ opacity: "0.8" }, 2500)
    .animate({ opacity: "1" }, 500)
    .animate({ opacity: "0" }, 2300);

  $(".star img:eq(3)")
    .animate({ opacity: "0.4" }, 2500)
    .animate({ opacity: "1" }, 500)
    .animate({ opacity: "0" }, 1500);
}

// 炸弹动画
function ZhadanAnimate() {
  $(".zhadan").fadeIn();
  $(".zhadan img:eq(0)")
    .animate({ opacity: "1" }, 500)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(1)")
    .animate({ opacity: "1" }, 800)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(2)")
    .animate({ opacity: "1" }, 1100)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(4)")
    .animate({ opacity: "1" }, 1400)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(7)")
    .animate({ opacity: "1" }, 1700)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(6)")
    .animate({ opacity: "1" }, 2000)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(5)")
    .animate({ opacity: "1" }, 2300)
    .animate({ opacity: "0" }, 500);
  $(".zhadan img:eq(3)")
    .animate({ opacity: "1" }, 2700)
    .animate({ opacity: "0" }, 500);

  $(".zhadan")
    .animate({ top: "60%" }, 1000)
    .animate({ top: "30%" }, 400)
    .animate({ top: "60%" }, 400)
    .animate({ top: "50%" }, 300)
    .animate({ top: "60%" }, 200)
    .animate({ top: "50%" }, 400)
    .animate({ opacity: "0" }, 500, () => {
      $(".zhadan").fadeOut();
    });
}

/* 动画入口 */
function pokerAnimation(type) {
  switch (type) {
    /* 顺子动画 */
    case 6:
    case 10:
    case 11:
    case 12:
    case 16:
    case 18:
    case 21:
    case 22:
      ShunziAnimate();
      break;
    /* 连对动画 */
    case 9:
    case 13:
    case 19:
    case 23:
    case 26:
    case 29:
    case 31:
    case 32:
      LianduiAnimate();
      break;
    /* 炸弹动画 */
    case 998:
    case 999:
      ZhadanAnimate();
      break;
    /* 飞机动画 */
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
      FlyAnimate();
      break;
  }
}
