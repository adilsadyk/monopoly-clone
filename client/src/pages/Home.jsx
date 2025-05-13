import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

export default function Home() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = nanoid(6);
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-6">
      <h1 className="text-5xl font-bold text-gray-800">Монополия Онлайн</h1>
      <div className="flex gap-4">
        <button onClick={createRoom} className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600">
          Создать комнату
        </button>
        <Link to="/game/manual" className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-600">
          Присоединиться вручную
        </Link>
      </div>
      <Link to="/rules" className="text-blue-700 underline mt-4">
        Правила игры
      </Link>
    </div>
  );
}
