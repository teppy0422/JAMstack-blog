import useSound from "use-sound";

import boopSfx from "../public/sound/missed.mp3";

const BoopButton = () => {
  const [play] = useSound(boopSfx);

  return (
    <div>
      <button onClick={play}>Boop!</button>
      <div>
        <a href={boopSfx} download>
          {boopSfx}
        </a>
      </div>
      <audio src={boopSfx} controls></audio>

      <audio controls loop>
        <source src="/missed.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default BoopButton;
