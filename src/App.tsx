import React, { useState } from "react";
import IdeaGenerator from "./pages/IdeaGenerator";
import SuggestionDisplay from "./pages/SuggestionDisplay";

const App: React.FC = () => {
  const [selectedIdeas, setSelectedIdeas] = useState<
    { id: number; idea: string }[]
  >([]);

  return (
    <div className=" w-full  flex flex-col justify-center items-center my-10">
      <IdeaGenerator onIdeasSelected={setSelectedIdeas} />
      <SuggestionDisplay selectedIdeas={selectedIdeas} />
    </div>
  );
};

export default App;
