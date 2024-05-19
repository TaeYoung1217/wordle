window.addEventListener("keydown", (event) => {
  let keyid = event.key.toUpperCase();
  const h1 = document.getElementById(keyid);
  console.log(keyid);

  document.getElementById(keyid).animate(
    [
      // key frames
      { transform: "translateY(0px)" },
      { transform: "translateY(-20px)" },
    ],
    {
      // sync options
      duration: 100,
      iterations: 1,
    }
  );
}); //키를 눌렀을때 키패드 부분에 애니메이션을 주는 부분
