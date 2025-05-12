import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-4">
      <h1 className="text-4xl font-bold">Монополия Онлайн</h1>
      <div className="flex gap-4">
        <Link to="/game/123" className="bg-blue-500 text-white px-4 py-2 rounded">Создать комнату</Link>
        <Link to="/game/123" className="bg-green-500 text-white px-4 py-2 rounded">Присоединиться</Link>
      </div>
      <Link to="/rules" className="text-blue-700 underline">Правила игры</Link>
    </div>
  );
}