import useSound from "use-sound";

import boopSfx from "../public/sound/menuettm.mp3";

const BoopButton = () => {
  const [play] = useSound(boopSfx);
  function play_() {
    document.getElementById("missed").play();
  }
  // setInterval(() => {
  //   document.getElementById("missed").play();
  //   console.log("played");
  // }, 1000);
  return (
    <div>
      <button onClick={play}>Boop!</button>
      <div>
        <a href={boopSfx} download>
          {boopSfx}
        </a>
      </div>
      <audio src={boopSfx} controls>
        対応していません
      </audio>

      <audio controls loop>
        <source src="../public/sound/menuettm.mp3" type="audio/mp3" />
      </audio>

      <audio controls loop>
        <source
          src="https://www.ne.jp/asahi/music/myuu/wave/menuettm.mp3"
          type="audio/mp3"
        />
      </audio>

      <audio controls id="missed">
        <source
          src="https://soundeffect-lab.info/sound/button/mp3/beep4.mp3"
          type="audio/mp3"
        />
      </audio>

      <audio controls loop>
        <source
          src="https://www.teppy.link/public/sound/missed.mp3"
          type="audio/mp3"
        />
      </audio>
    </div>
  );
};

export default BoopButton;
