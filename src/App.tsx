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
  { name: "B站大会员", value: 1 },
  { name: "¥8.8", value: 1 },
  { name: "¥18.8", value: 1 },
  { name: "¥28.8", value: 1 },
  { name: "疯狂星期四", value: 1 },
  { name: "小鱼挂件", value: 1 },
  { name: "鱼尾标项链", value: 1 },
  { name: "海螺香薰", value: 1 },
  { name: "玲珑の贝壳", value: 1 },
  { name: "贝壳肌理画", value: 1 },
  { name: "Q版金属贴", value: 1 },
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
    <div className="flex flex-col md:flex-row m-4">
      <div className="w-full md:w-96">
        <Card className="justify-center items-center p-6 w-full md:max-w-full">
          <h1 className="text-4xl">刮刮乐</h1>
          <div>
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="mt-4 rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm flex-shrink-0 w-25 text-center">
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
        <div className="m-2">
          {rewardPool.map((reward, index) => (
            <ScratchCard
              className="inline-block m-2 mx-3 shadow-sm border-slate-200 border rounded-lg"
              key={index}
              finishPercent={60}
              onComplete={() => {
                alert(`恭喜你获得了奖品: ${reward}`);
              }}
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
