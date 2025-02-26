import { useRef, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import ScratchCard, { ScratchCardRef } from "./components/ScratchCard";
import Card from "./components/Card";
import Button from "./components/Button";
import "./App.css";
import Reward from "./components/Reward";

const shuffle = (arr: Array<string>): Array<string> => {
  return arr.sort(() => Math.random() - 0.5);
};

const deepClone = <T extends object>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const defaultReward = [
  { name: "🍎", value: 1 },
  { name: "🍌", value: 2 },
  { name: "🍒", value: 3 },
  { name: "🍓", value: 4 },
  { name: "🍊", value: 5 },
];

function App() {
  const [rewards, setRewards] = useState(deepClone(defaultReward));

  const [rewardPool, setRewardPool] = useState<Array<string>>([]);
  const rewardRefs = useRef<ScratchCardRef[]>([]);

  const startGame = () => {
    const pool = rewards.reduce((acc, reward) => {
      return [...acc, ...Array(reward.value).fill(reward.name)];
    }, [] as Array<string>);

    setRewardPool(shuffle(pool));
  };

  const resetGame = () => {
    rewardRefs.current.forEach((ref) => {
      ref.reset();
    });

    setRewardPool([]);
    setRewards(deepClone(defaultReward));
  };

  return (
    <div className="flex">
      <div className="w-80">
        <Card className="justify-center items-center p-6">
          <h1 className="text-4xl">刮刮乐</h1>
          <div>
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="mt-4 rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                  {reward.name}
                </div>
                <Reward
                  value={reward.value}
                  setValue={(value) => {
                    const newRewards = [...rewards];
                    newRewards[index].value = value;
                    setRewards(newRewards);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="m-4 space-x-6">
            <Button onClick={startGame}>开始</Button>
            <Button onClick={resetGame}>重置</Button>
          </div>
        </Card>
      </div>
      <div className="flex-grow bg-blue-50 m-6 shadow-sm border border-slate-200">
        <div className="m-4 space-x-4 space-y-4">
          {rewardPool.map((reward, index) => (
            <ScratchCard
              className="inline-block shadow-sm border-slate-200 border rounded-lg"
              key={index}
              reward={reward}
              ref={(element) => {
                if (element) {
                  rewardRefs.current.push(element);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
