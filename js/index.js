let index = 0; //몇번째 열의 block인지 체크할 전역변수
let attempts = 0; //몇번째 행(기회)인지 체크할 전역변수
let interval; //타이머를 set, clear 하기 위한 전역변수
const answer = "APPLE"; //정답 단어를 담아놓은 전역변수

function appStart() {
  const nextLine = () => {
    if (attempts === 5) {
      //기회가 다되었다면
      gameOver(); //gameOver함수 호출 후 종료
    }

    attempts++;
    index = 0;
  };

  const isNullCheck = (nullcheck) => {
    //빈칸 체크 함수
    for (let i = 0; i < 5; i++) {
      //1개의 row 반복하며 빈칸 있는지 체크
      if (
        document.querySelector(`.boardBlock[data-index='${attempts}${i}']`) === //쿼리셀렉터로 한개 block씩 확인
        null
      )
        nullcheck = false;
      else nullcheck = true;
    }

    return nullcheck; //확인값 반환, true:빈칸없음 , false:빈칸 있음
  };
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었음";
    div.style =
      "display:flex; justify-content:center; align-items:center; font-size:30px; position:absolute; top:50vh; left:35vw;background-color:white;";
    document.body.appendChild(div); //js에서 css에 style 추가
  };

  const gameOver = () => {
    displayGameover(); //게임오버 메세지 출력, css 보완 필요
    window.removeEventListener("keydown", handleKeyDown); //키 입력 이벤트 리스너 삭제
    clearInterval(interval); //타이머 인터벌 삭제, setInterval 반대기능
    return;
  };

  const handleEnterkey = (thisKeypad) => {
    keypadAnimation(thisKeypad);
    //정답확인하는 기능
    let answerNum = 0;
    let nullcheck = true;
    isNullCheck(nullcheck); //정답입력중에 빈칸 있는지 체크
    if (nullcheck) {
      //block에 빈칸이 없으면
      for (let i = 0; i < 5; i++) {
        const block = document.querySelector(
          `.boardBlock[data-index='${attempts}${i}']`
        ); //현재 block 가져오기
        const enterletter = block.innerText; //입력한 알파벳
        const answerletter = answer[i]; //정답 알파벳 인덱스

        if (enterletter === answerletter) {
          //순서와 알파벳이 일치하면
          answerNum++;
          block.style.background = "#6AA964";
        } else if (answer.includes(enterletter)) {
          //정답에 알파벳이 포함되어 있으면
          block.style.background = "#c9b458";
        } else {
          //맞지 않으면
          block.style.background = "#787C7E";
        }
        block.style.color = "white";
      }

      if (answerNum === 5) {
        //다섯글자 다 맞으면
        gameOver();
      } else nextLine(); //아니면 다음기회
    }
  };

  const handleBackspace = (thisKeypad) => {
    keypadAnimation(thisKeypad);
    if (index > 0) {
      const preBlock = document.querySelector(
        `.boardBlock[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
      index--;
    }
  };

  const keypadAnimation = (thisKeypad) => {
    thisKeypad.animate([{ background: "#484b4c", color: "white" }], {
      easing: "ease-in-out",
      duration: 150,
    });
  };

  const blockAnimation = (thisblock) => {
    thisblock.animate(
      //enter, backspace와 겹치지 않기 위해 영문키 눌렀을때 조건문에 애니메이션 삽입
      //키를 눌렀을때 애니메이션
      [
        // key frames
        { transform: "translateY(0px)" }, //시작위치
        { transform: "translateY(-10px)" }, //도착위치
      ],
      { duration: 100, iterations: 1 } //지속시간, 반복횟수
    );
  };

  const handleKeyDown = (event) => {
    //처음 시작 함수
    const key = event.key.toUpperCase(); //누른 키의 key값을 가져와 대문자로 저장
    const keycode = event.keycode; //누른 키의 keycode 저장
    const thisblock = document.querySelector(
      `.boardBlock[data-index='${attempts}${index}']`
    ); //현재 입력한 블록 class 가져오기
    const thisKeypad = document.querySelector(
      `.keyboard-column[data-key='${key}']`
    );

    if (event.key === "Backspace") handleBackspace(thisKeypad);
    //backspace 입력 확인
    else if (index === 5) {
      //행의 마지막 칸이라면
      if (event.key === "Enter") {
        //enter 입력 확인
        handleEnterkey(thisKeypad); //enter 키 눌렀을때 함수 진입
      } else return;
    } else if ("a" <= event.key && event.key <= "z") {
      //알파벳을 눌렀을때
      thisblock.innerText = key;
      index++;
      keypadAnimation(thisKeypad);
      blockAnimation(thisblock);
    }
  };

  const startTimer = () => {
    //타이머 설정
    const startTime = new Date(); //시작 시각 저장
    function setTime() {
      const curTime = new Date(); //현재 시각 저장
      const timer = new Date(curTime - startTime); //현재시간에서 시작시간을 뺀 만큼 경과시간에 저장
      const min = timer.getMinutes().toString().padStart(2, "0"); //getMinutes함수를 통해 '분'을 불러와 스트링으로 변환 후 두자리 출력 및 빈자리는 0으로 채움
      const sec = timer.getSeconds().toString().padStart(2, "0"); //getSeconds함수를 통해 '초'을 불러와 스트링으로 변환 후 두자리 출력 및 빈자리는 0으로 채움

      const timeH1 = document.querySelector(".timer"); //html에 있는 타이머 div를 불러와 저장
      timeH1.innerText = "time" + `${min}:${sec}`; //위에 저장한 시간 변수를 text로 변환하여 출력
    }
    interval = setInterval(setTime, 1000); //반복 지정, 1000ms=1s마다 setTime 함수 호출
  };

  startTimer(); //타이머 시작
  window.addEventListener("keydown", handleKeyDown); //키 누르는 이벤트 발생하면 handleKeyDown 함수 진입
}

appStart();
