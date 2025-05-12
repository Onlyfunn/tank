const game = document.querySelector(".game");
const man = document.querySelector(".man");
const lake = document.querySelector(".lake");
const boss = document.querySelector(".boss");
const record = document.querySelector(".record");
let minutes = new Date().getMinutes();
let secondes = new Date().getSeconds();
dateSeconds = minutes * 60 + secondes;

let audioBubbles = new Audio("../img/bubbles.mp3");
audioBubbles.loop = true;

let audionBack = new Audio("../img/penisromana.mp3");
audionBack.loop = true;
let audioBoom = new Audio("../img/vzryv.mp3");
let audioSosed = new Audio("../img/sosed.mp3");
let audioTree = new Audio("../img/tree.mp3");
let audioTank = new Audio("../img/tank.mp3");
let audioFire = new Audio("../img/fire.mp3");
let audioDead = new Audio("../img/dead.mp3");

let windowHeight = document.documentElement.clientHeight;
let windowWidth = document.documentElement.clientWidth;

let mouseDirectionX;
let mouseDirectionY;

let mouseX;
let mouseY;

//Получение угла по координатам курсора
function calculateAngle(a, b) {
  const angleRad = Math.atan2(b, a);
  const angleDeg = angleRad * (180 / Math.PI);
  return angleDeg;
}

//Вращение объекта в сторону курсора
function rotateObject(e) {
  audionBack.play();
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseDirectionX =
    e.clientX -
    man.getBoundingClientRect().left -
    parseInt(getComputedStyle(man).width) / 2;
  mouseDirectionY =
    (e.clientY -
      man.getBoundingClientRect().top -
      parseInt(getComputedStyle(man).width) / 2) *
    -1;
  man.style.rotate = `${-calculateAngle(mouseDirectionX, mouseDirectionY)}deg`;
}

//Функция движения с ограничением в окно бразуера
function goObject(e) {
  if (
    (man.getBoundingClientRect().x > 30 &&
      document.documentElement.clientWidth - 140 >
        man.getBoundingClientRect().x) ||
    (man.getBoundingClientRect().x < 30 && mouseDirectionX > 0) ||
    (man.getBoundingClientRect().x >
      document.documentElement.clientWidth - 140 &&
      mouseDirectionX < 0)
  ) {
    man.style.left = `${
      parseInt(getComputedStyle(man).left) +
      Math.sin(Math.atan2(mouseDirectionX, mouseDirectionY)) * 10
    }px`;
  }
  if (
    (man.getBoundingClientRect().y > 30 &&
      document.documentElement.clientHeight - 140 >
        man.getBoundingClientRect().y) ||
    (man.getBoundingClientRect().y < 30 && mouseDirectionY < 0) ||
    (man.getBoundingClientRect().y >
      document.documentElement.clientHeight - 140 &&
      mouseDirectionY > 0)
  ) {
    man.style.top = `${
      parseInt(getComputedStyle(man).top) +
      -Math.cos(Math.atan2(mouseDirectionX, mouseDirectionY)) * 10
    }px`;
  }

  //Погружение в озеро
  if (
    man.getBoundingClientRect().x > lake.getBoundingClientRect().x &&
    man.getBoundingClientRect().x <
      lake.getBoundingClientRect().x + lake.clientWidth &&
    man.getBoundingClientRect().y > lake.getBoundingClientRect().y &&
    man.getBoundingClientRect().y <
      lake.getBoundingClientRect().y + lake.clientHeight
  ) {
    man.classList.add("_lake");

    audioBubbles.play();
  } else {
    man.classList.remove("_lake");
    audioBubbles.pause();
  }
}

let fire;
let intervalAttack;
let flag = true;

let countAttack = 0;

//Функция огня
function goFire(e) {
  if (flag) {
    flag = false;
    if (fire) {
      fire.remove();
    }
    if (intervalAttack) {
      clearInterval(intervalAttack);
    }
    fire = document.createElement("div");
    man.after(fire);
    fire.classList.add("fire");
    audioBoom.play();
    fire.style.left = `${
      man.getBoundingClientRect().x +
      parseInt(getComputedStyle(man).width) / 2 -
      parseInt(getComputedStyle(fire).widh)
    }px`;
    fire.style.top = `${
      man.getBoundingClientRect().y + parseInt(getComputedStyle(man).width) / 2
    }px`;
    fire.style.left = `${
      man.getBoundingClientRect().x +
      parseInt(getComputedStyle(man).width) / 2 -
      parseInt(getComputedStyle(fire).height)
    }px`;
    fire.style.rotate = `${calculateAngle(
      mouseDirectionX,
      -mouseDirectionY
    )}deg`;
    let fireDirectionX = mouseDirectionX;
    let fireDirectionY = mouseDirectionY;

    const cd = document.querySelector(".cooldown");
    cd.classList.add("_active");
    setTimeout(() => {
      cd.classList.remove("_active");
      flag = true;
    }, 3000);

    intervalAttack = setInterval(function (e) {
      fire.style.left = `${
        parseInt(fire.style.left) +
        Math.sin(Math.atan2(fireDirectionX, fireDirectionY)) * 60
      }px`;
      fire.style.top = `${
        parseInt(fire.style.top) +
        -Math.cos(Math.atan2(fireDirectionX, fireDirectionY)) * 60
      }px`;
      if (
        parseInt(fire.style.top) <= 30 ||
        parseInt(fire.style.top) >= document.documentElement.clientHeight - 90
      ) {
        clearInterval(intervalAttack);
        fire.remove();
      }
      if (
        parseInt(fire.style.left) <= 30 ||
        parseInt(fire.style.left) >= document.documentElement.clientWidth - 90
      ) {
        clearInterval(intervalAttack);
        fire.remove();
      }
      let fireConflictTree = false;
      trees.forEach((item) => {
        if (
          fire.getBoundingClientRect().x + fire.getBoundingClientRect().width >
            item.getBoundingClientRect().x &&
          fire.getBoundingClientRect().x <
            item.getBoundingClientRect().x +
              item.getBoundingClientRect().width &&
          fire.getBoundingClientRect().y + fire.getBoundingClientRect().height >
            item.getBoundingClientRect().y &&
          fire.getBoundingClientRect().y <
            item.getBoundingClientRect().y + item.getBoundingClientRect().height
        ) {
          fireConflictTree = true;
          item.src = "img/fire.gif";
          setTimeout(() => item.remove(), 1000);
          audioFire.play();
          setTimeout(() => audioFire.pause(), 1000);
          clearInterval(intervalAttack);
          fire.remove();
        }
      });
      if (
        fire.getBoundingClientRect().x + fire.getBoundingClientRect().width >
          boss.getBoundingClientRect().x &&
        fire.getBoundingClientRect().x <
          boss.getBoundingClientRect().x + boss.getBoundingClientRect().width &&
        fire.getBoundingClientRect().y + fire.getBoundingClientRect().height >
          boss.getBoundingClientRect().y &&
        fire.getBoundingClientRect().y <
          boss.getBoundingClientRect().y + boss.getBoundingClientRect().height
      ) {
        countAttack += 1;
        console.log(countAttack);
        if (countAttack % 3 == 0) {
          audioSosed.play();
          boss.children[0].style.filter =
            "sepia(100%) saturate(600%) hue-rotate(-50deg)";
          setTimeout(() => (boss.children[0].style.filter = `none`), 2000);
        }
        let audioDamage = new Audio("../img/damage.mp3");
        audioDamage.play();
        let damage = document.createElement("div");
        boss.append(damage);
        damage.classList.add("damage");
        damage.innerHTML = `${10}`;
        setTimeout(() => damage.remove(), 400);
        if (countAttack % 3 != 0) {
          boss.children[0].style.filter = `sepia(100%) saturate(600%) hue-rotate(-50deg)`;
          setTimeout(() => (boss.children[0].style.filter = `none`), 400);
        }
        boss.children[1].children[0].style.left = `${
          parseInt(boss.children[1].children[0].style.left) - 10
        }%`;
        if (parseInt(boss.children[1].children[0].style.left) == 0) {
          boss.remove();
          audioDead.play();
          let dateSeconds2 =
            new Date().getMinutes() * 60 +
            new Date().getSeconds() -
            dateSeconds;
          console.log(dateSeconds2);
          let razMin = Math.floor(dateSeconds2 / 60);
          let razSec = dateSeconds2 % 60;
          record.innerHTML = `Вы справились за ${razMin}мин и ${razSec}сек`;
          setTimeout(() => (record.innerHTML = ``), 2000);
        }
        clearInterval(intervalAttack);
        fire.remove();
      }
    }, 100);
  }
}

function createTree() {
  let tree = document.createElement("img");
  game.append(tree);
  tree.src = "img/tree.png";
  tree.classList.add("tree");
  tree.style.left = `${Math.random() * (windowWidth - 200)}px`;
  tree.style.top = `${Math.random() * (windowHeight - 200)}px`;

  if (
    (tree.getBoundingClientRect().x + tree.getBoundingClientRect().width >
      lake.getBoundingClientRect().x &&
      tree.getBoundingClientRect().x - tree.getBoundingClientRect().width <
        lake.getBoundingClientRect().x + lake.getBoundingClientRect().width &&
      tree.getBoundingClientRect().y + tree.getBoundingClientRect().height >
        lake.getBoundingClientRect().y &&
      tree.getBoundingClientRect().y - tree.getBoundingClientRect().height <
        lake.getBoundingClientRect().y + lake.getBoundingClientRect().height) || // спавн вне озера
    (tree.getBoundingClientRect().x + tree.getBoundingClientRect().width >
      document.documentElement.clientWidth / 2 - man.clientWidth &&
      tree.getBoundingClientRect().x <
        document.documentElement.clientWidth / 2 + man.clientWidth &&
      tree.getBoundingClientRect().y + tree.getBoundingClientRect().height >
        document.documentElement.clientHeight / 2 - man.clientHeight &&
      tree.getBoundingClientRect().y <
        document.documentElement.clientWidth / 2 + man.clientHeight) // спавн не в центре
  ) {
    tree.remove();
    createTree();
  }
}

let trees;

function createTrees() {
  for (let i = 0; i < 7; i++) {
    createTree();
  }
  trees = document.querySelectorAll(".tree");
}

document.addEventListener("DOMContentLoaded", function (e) {
  createTrees();
  boss.style.left = `0px`;
  boss.style.top = `0px`;
  setInterval(() => {
    let randomX = Math.random();
    let randomY = Math.random();

    if (
      randomX * 2000 <
        document.documentElement.clientWidth - boss.clientWidth &&
      randomY * 2000 < document.documentElement.clientHeight - boss.clientHeight
    ) {
      boss.style.left = `${randomX * 2000}px`;
      boss.style.top = `${randomY * 2000}px`;
    }
  }, 200);
});
window.addEventListener("mousemove", rotateObject);
document.addEventListener("keydown", function (e) {
  if (e.code == "Space") {
    audioTank.play();
    let conflictSide;
    let treeConflict = false;
    trees.forEach((item) => {
      let conflictSides = [
        man.getBoundingClientRect().x +
          man.getBoundingClientRect().width -
          item.getBoundingClientRect().x,
        item.getBoundingClientRect().x +
          item.getBoundingClientRect().width -
          man.getBoundingClientRect().x,
        man.getBoundingClientRect().y +
          man.getBoundingClientRect().height -
          item.getBoundingClientRect().y,
        item.getBoundingClientRect().y +
          item.getBoundingClientRect().height -
          man.getBoundingClientRect().y,
      ];
      if (
        man.getBoundingClientRect().x + man.getBoundingClientRect().width >
          item.getBoundingClientRect().x &&
        man.getBoundingClientRect().x <
          item.getBoundingClientRect().x + item.getBoundingClientRect().width &&
        man.getBoundingClientRect().y + man.getBoundingClientRect().height >
          item.getBoundingClientRect().y &&
        man.getBoundingClientRect().y <
          item.getBoundingClientRect().y + item.getBoundingClientRect().height
      ) {
        conflictSide = conflictSides.indexOf(
          Math.min(
            conflictSides[0],
            conflictSides[1],
            conflictSides[2],
            conflictSides[3]
          )
        );
        if (
          (conflictSide == 0 && mouseX > item.getBoundingClientRect().x) ||
          (conflictSide == 1 &&
            mouseX <
              item.getBoundingClientRect().x +
                item.getBoundingClientRect().width) ||
          (conflictSide == 2 && mouseY > item.getBoundingClientRect().y) ||
          (conflictSide == 3 &&
            mouseY <
              item.getBoundingClientRect().x +
                item.getBoundingClientRect().height)
        ) {
          treeConflict = true;
          audioTree.play();
        }
      }
    });
    if (!treeConflict) {
      goObject();
    }
  }
});
document.addEventListener("keyup", function () {
  audioTank.pause();
});
window.addEventListener("click", goFire);
