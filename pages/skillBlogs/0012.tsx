import React from "react";
import DraggableBox from "../../components/DraggableBox"; // DraggableBoxをインポート

const App: React.FC = () => {
  return (
    <div>
      <h1>ドラッグ可能なボックス</h1>
      <DraggableBox />
      <DraggableBox />
      <DraggableBox />
    </div>
  );
};

export default App;
