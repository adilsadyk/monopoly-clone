import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_SERVER);

const initialMoney = 1500;
const totalTiles = 25;

export default function Game() {
  const { roomId } = useParams();

  const [position, setPosition] = useState(0);
  const [money, setMoney] = useState(initialMoney);
  const [dice, setDice] = useState(null);
  const [ownedTiles, setOwnedTiles] = useState([]);
  const [tileOwners, setTileOwners] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ socket подключён, id:', socket.id);
      socket.emit('joinRoom', roomId);
    });

    /*;socket.on('diceRolled', ({ player, result }) => {
      console.log('🎯 Получен результат броска:', result);
      if (player === socket.id) {
        setDice(result);
        handleMove(result);
      }
    });*/

    socket.on('diceRolled', ({ player, result }) => {
      if (player !== socket.id) return;
      setDice(result);
    });    

    return () => {
      if (socket.connected) {
        console.log('⛔ отключаюсь от сокета...');
        socket.disconnect();
      }
    };
  }, [roomId]);
  useEffect(() => {
    if (dice !== null) {
      handleMove(dice);
    }
  }, [dice]);
  
  const rollDice = () => {
    console.log('🎲 Бросаю кубик...');
    socket.emit('rollDice', roomId);
  };

  const handleMove = (steps) => {
    setPosition(prev => {
      const newPos = (prev + steps) % totalTiles;
  
      const owner = tileOwners[newPos];
  
      if (owner === socket.id) return newPos;
  
      if (owner) {
        setMoney(m => m - 100);
      } else {
        if (money >= 200) {
          const buy = confirm('Купить эту клетку за 200?');
          if (buy) {
            setMoney(m => m - 200);
            setOwnedTiles(prevTiles => [...prevTiles, newPos]);
            setTileOwners(prevOwners => ({ ...prevOwners, [newPos]: socket.id }));
          }
        }
      }
  
      return newPos;
    });
  };
  

  const getTileStyle = (index) => {
    const isPlayerHere = position === index;
    const isOwned = tileOwners[index];
    return `border p-2 h-16 flex items-center justify-center text-sm ${
      isPlayerHere ? 'bg-yellow-300 font-bold' : isOwned ? 'bg-green-200' : 'bg-white'
    }`;
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Комната: {roomId}</h2>
      <p className="mb-2">Баланс: 💰 {money}</p>
      <button onClick={rollDice} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mb-4">
        Бросить кубик 🎲
      </button>
      {dice && <p className="mb-4">Ты выбросил: {dice}</p>}

      <div className="grid grid-cols-5 gap-1 w-[300px] mx-auto">
        {Array.from({ length: totalTiles }, (_, i) => (
          <div key={i} className={getTileStyle(i)}>
            {position === i ? '🎩' : i}
          </div>
        ))}
      </div>
    </div>
  );
}
