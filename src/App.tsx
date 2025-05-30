import React, { useState, useEffect, useMemo } from 'react';

// Reusable Button
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }
> = ({ variant = 'default', className = '', ...props }) => {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2';

  const variants: Record<string, string> = {
    default: 'bg-pink-600 text-white hover:bg-pink-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

// Card with centered layout
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mx-auto text-center flex flex-col items-center">
    {children}
  </div>
);

// Reusable Input
const Input = ({
  value,
  onChange,
  type = 'text',
}: {
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm text-center"
  />
);

// Layout to center all content
const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full flex flex-col items-center">{children}</div>
  </main>
);

export default function App() {
  const [position, setPosition] = useState(0);
  const [mode, setMode] = useState<'player' | 'computer' | null>(null);
  const [turn, setTurn] = useState('Player 1');
  const [gameOver, setGameOver] = useState(false);
  const [loser, setLoser] = useState('');
  const [target, setTarget] = useState(13);
  const [steps, setSteps] = useState<number[]>([1, 2]);
  const [lastMoveWins, setLastMoveWins] = useState(false);
  const [configured, setConfigured] = useState(false);

  const losingPositions = useMemo(() => {
    const dp = Array(target + 1).fill(false);
    for (let i = target - 1; i >= 0; i--) {
      dp[i] = steps.some((step) => i + step <= target && !dp[i + step]);
    }
    return dp.map((x) => !x);
  }, [target, steps]);

  useEffect(() => {
    if (mode === 'computer' && turn === 'Computer' && !gameOver) {
      const timeout = setTimeout(() => {
        computerMove(position);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [turn, position, gameOver, mode]);

  const resetGame = () => {
    setPosition(0);
    setMode(null);
    setTurn('Player 1');
    setGameOver(false);
    setLoser('');
    setConfigured(false);
  };

  const makeMove = (step: number) => {
    if (gameOver) return;
    const newPosition = position + step;
    if (newPosition > target) return;
    setPosition(newPosition);

    if (newPosition === target) {
      setGameOver(true);
      setLoser(
        lastMoveWins ? (turn === 'Player 1' ? 'Player 2' : 'Player 1') : turn
      );
      return;
    }

    setTurn(
      mode === 'player'
        ? turn === 'Player 1'
          ? 'Player 2'
          : 'Player 1'
        : turn === 'Player'
        ? 'Computer'
        : 'Player'
    );
  };

  const computerMove = (currentPos: number) => {
    if (currentPos >= target || gameOver) return;
    for (let step of steps) {
      if (currentPos + step <= target && losingPositions[currentPos + step]) {
        makeMove(step);
        return;
      }
    }
    for (let step of steps) {
      if (currentPos + step <= target) {
        makeMove(step);
        return;
      }
    }
  };

  // const renderNumberStrip = () => (
  //   <div className="flex overflow-x-auto gap-2 justify-center px-2 mb-6 whitespace-nowrap">
  //     {Array.from({ length: target + 1 }, (_, i) => {
  //       const isCurrent = i === position;
  //       return (
  //         <div
  //           key={i}
  //           className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-semibold transition-all ${
  //             isCurrent
  //               ? 'bg-pink-600 text-white shadow-lg'
  //               : 'bg-gray-100 text-gray-800 shadow-inner'
  //           }`}
  //         >
  //           {i}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  // const renderNumberStrip = () => (
  //   <div className="flex flex-wrap justify-center gap-2 px-2 mb-6">
  //     {Array.from({ length: target + 1 }, (_, i) => {
  //       const isCurrent = i === position;
  //       return (
  //         <div
  //           key={i}
  //           className={`w-12 h-12 flex items-center justify-center rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 border border-gray-300
  //             ${
  //               isCurrent
  //                 ? 'bg-pink-600 text-white shadow-lg scale-110'
  //                 : 'bg-white text-gray-800 hover:bg-pink-100 hover:shadow-md'
  //             }`}
  //         >
  //           {i}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  // const renderNumberStrip = () => {
  //   const numbers = [];
  //   for (let i = 0; i <= target; i++) {
  //     const isCurrent = i === position;
  //     numbers.push(
  //       <div
  //         key={i}
  //         className={`number-cell ${isCurrent ? 'current' : ''}`}
  //         aria-current={isCurrent ? 'true' : undefined}
  //         aria-label={isCurrent ? `Current position ${i}` : `Position ${i}`}
  //         style={{
  //           padding: '0.5rem 1rem',
  //           margin: '0.2rem',
  //           borderRadius: '0.5rem',
  //           backgroundColor: isCurrent ? '#d6336c' : '#f8f9fa',
  //           color: isCurrent ? 'white' : '#212529',
  //           fontWeight: isCurrent ? 700 : 500,
  //           boxShadow: isCurrent
  //             ? '0 0 8px 2px rgba(214, 51, 108, 0.6)'
  //             : 'inset 0 0 3px #ced4da',
  //           minWidth: '40px',
  //           textAlign: 'center',
  //         }}
  //       >
  //         {i}
  //       </div>
  //     );
  //   }
  //   return <div className="flex flex-wrap justify-center mb-4">{numbers}</div>;
  // };

  // const renderNumberStrip = () => {
  //   const numbers = [];
  //   for (let i = 0; i <= target; i++) {
  //     const isCurrent = i === position;
  //     numbers.push(
  //       <div
  //         key={i}
  //         className={`number-cell transition-all duration-300 ${
  //           isCurrent
  //             ? 'bg-pink-600 text-white font-bold shadow-lg'
  //             : 'bg-gray-100 text-gray-800 font-medium shadow-inner'
  //         }`}
  //         style={{
  //           padding: '0.5rem 1rem',
  //           margin: '0.25rem',
  //           borderRadius: '0.5rem',
  //           minWidth: '42px',
  //           textAlign: 'center',
  //         }}
  //       >
  //         {i}
  //       </div>
  //     );
  //   }
  //   // return (
  //   //   <div className="flex flex-wrap justify-center items-center mb-6 w-full max-w-3xl mx-auto">
  //   //     {numbers}
  //   //   </div>
  //   // );
  //   const renderNumberStrip = () => {
  //     const numbers = [];
  //     for (let i = 0; i <= target; i++) {
  //       const isCurrent = i === position;
  //       numbers.push(
  //         <div
  //           key={i}
  //           className={`number-cell ${isCurrent ? 'current' : ''}`}
  //           aria-current={isCurrent ? 'true' : undefined}
  //           aria-label={isCurrent ? `Current position ${i}` : `Position ${i}`}
  //           style={{
  //             padding: '0.5rem 1rem',
  //             margin: '0.2rem',
  //             borderRadius: '0.5rem',
  //             backgroundColor: isCurrent ? '#d6336c' : '#f8f9fa',
  //             color: isCurrent ? 'white' : '#212529',
  //             fontWeight: isCurrent ? 700 : 500,
  //             boxShadow: isCurrent
  //               ? '0 0 8px 2px rgba(214, 51, 108, 0.6)'
  //               : 'inset 0 0 3px #ced4da',
  //             minWidth: '40px',
  //             textAlign: 'center',
  //           }}
  //         >
  //           {i}
  //         </div>
  //       );
  //     }

  //     return (
  //       <div
  //         className="flex flex-wrap justify-center mb-4 px-2 sm:px-4 md:px-6 lg:px-8 overflow-x-auto"
  //         style={{ maxWidth: '100%', overflowX: 'auto' }}
  //       >
  //         {numbers}
  //       </div>
  //     );
  //   };

  // };
  // const renderNumberStrip = () => {
  //   const numbers = [];
  //   for (let i = 0; i <= target; i++) {
  //     const isCurrent = i === position;
  //     numbers.push(
  //       <div
  //         key={i}
  //         className={`number-cell ${isCurrent ? 'current' : ''}`}
  //         aria-current={isCurrent ? 'true' : undefined}
  //         aria-label={isCurrent ? `Current position ${i}` : `Position ${i}`}
  //         style={{
  //           padding: '0.5rem 1rem',
  //           margin: '0.2rem',
  //           borderRadius: '0.5rem',
  //           backgroundColor: isCurrent ? '#d6336c' : '#f8f9fa',
  //           color: isCurrent ? 'white' : '#212529',
  //           fontWeight: isCurrent ? 700 : 500,
  //           boxShadow: isCurrent
  //             ? '0 0 8px 2px rgba(214, 51, 108, 0.6)'
  //             : 'inset 0 0 3px #ced4da',
  //           minWidth: '40px',
  //           textAlign: 'center',
  //           flex: '0 0 auto', // Prevent shrinking
  //         }}
  //       >
  //         {i}
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="overflow-x-auto mb-4 px-2">
  //       <div className="flex w-max">{numbers}</div>
  //     </div>
  //   );
  // };

  const renderNumberStrip = () => {
    const numbers = [];
    for (let i = 0; i <= target; i++) {
      const isCurrent = i === position;
      numbers.push(
        <div
          key={i}
          className={`number-cell ${isCurrent ? 'current' : ''}`}
          aria-current={isCurrent ? 'true' : undefined}
          aria-label={isCurrent ? `Current position ${i}` : `Position ${i}`}
          style={{
            padding: '0.5rem 1rem',
            margin: '0.2rem',
            borderRadius: '0.5rem',
            backgroundColor: isCurrent ? '#d6336c' : '#f8f9fa',
            color: isCurrent ? 'white' : '#212529',
            fontWeight: isCurrent ? 700 : 500,
            boxShadow: isCurrent
              ? '0 0 8px 2px rgba(214, 51, 108, 0.6)'
              : 'inset 0 0 3px #ced4da',
            minWidth: '40px',
            textAlign: 'center',
            flexShrink: 0, // prevent shrinking so they stay inline
          }}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto mb-4">
        <div className="flex whitespace-nowrap">{numbers}</div>
      </div>
    );
  };

  if (!configured) {
    return (
      <Layout>
        <Card>
          <h1 className="text-2xl font-bold mb-6">🎮 Customize Your Game</h1>
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                🎯 Final Number:
              </label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                ➕ Steps (comma-separated):
              </label>
              <Input
                value={steps.join(',')}
                onChange={(e) =>
                  setSteps(e.target.value.split(',').map(Number))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lastMoveWins}
                onChange={(e) => setLastMoveWins(e.target.checked)}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="text-sm">🏆 Last Move Wins</label>
            </div>
            <Button className="w-full mt-4" onClick={() => setConfigured(true)}>
              Start Game
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  if (!mode) {
    return (
      <Layout>
        <Card>
          <h1 className="text-2xl font-bold mb-4">Don't Say {target}!</h1>
          <p className="mb-4 text-sm text-gray-600">Select a game mode:</p>
          <div className="w-full space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                setMode('player');
                setTurn('Player 1');
              }}
            >
              🧑‍🤝‍🧑 Two Player
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setMode('computer');
                setTurn('Player');
              }}
            >
              🤖 Vs Computer
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <h2 className="text-xl font-bold mb-4">Don't Say {target}!</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Current Position:</p>
          <div className="text-3xl font-bold text-pink-600">{position}</div>
        </div>
        <div>
          <p className="mb-2 text-sm">
            Turn: <strong>{turn}</strong>
          </p>
          {gameOver && (
            <p className="text-red-600 font-bold">
              💥 Game Over! {loser} loses.
            </p>
          )}
          {!gameOver &&
            (mode === 'player' ||
              (mode === 'computer' && turn === 'Player')) && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                {steps.map((step) => (
                  <Button
                  key={step}
                  onClick={() => makeMove(step)}
                  disabled={position + step > target}
                  >
                    +{step}
                  </Button>
                ))}
              </div>
            )}
        </div>
        <div></div>
        <Button
          variant="destructive"
          className="mt-6 w-full"
          onClick={resetGame}
          >
          🔄 Restart Game
        </Button>
        <div></div>
          {renderNumberStrip()}
      </Card>
    </Layout>
  );
}
