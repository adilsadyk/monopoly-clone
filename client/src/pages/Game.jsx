import { useParams } from 'react-router-dom';

export default function Game() {
  const { roomId } = useParams();
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Комната: {roomId}</h2>
      <p>Здесь будет игровое поле и логика игры.</p>
    </div>
  );
}