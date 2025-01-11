import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea } from "@/types";
import LoadingDots from "./LoadingDots";
import { motion } from "framer-motion";

interface IdeaGeneratorProps {
  onIdeasSelected: (selectedIdeas: Idea[]) => void;
}

const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ onIdeasSelected }) => {
  const [query, setQuery] = useState<string>("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const generateIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://chatbot-for-idea-suggestions.onrender.com/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      console.log("generated data", data);

      // Assuming the API returns an array of ideas with relevance, impact, and feasibility scores
      setIdeas(data?.data);
      setSelectedIdeas([]);
    } catch (error) {
      console.error("Error generating ideas:", error);
    }
    setLoading(false);
  };

  const selectIdea = (idea: Idea) => {
    if (selectedIdeas.length < 2 && !selectedIdeas.includes(idea)) {
      const updatedSelection = [...selectedIdeas, idea];
      setSelectedIdeas(updatedSelection);
      onIdeasSelected(updatedSelection);
    }
  };

  const calculatePriority = (idea: Idea) => {
    return idea.relevance + idea.impact + idea.feasibility;
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[300px] custom360px:w-[350px] custom550:w-[500px] md:w-[700px]">
          <CardHeader>
            <CardTitle>Idea Suggestion Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="mb-4">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What new app should I build?"
                className="w-full"
              />
            </div>
            <div>
              {loading ? (
                <motion.div
                  className="my-4 flex justify-center items-center text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Wait For AI Result <LoadingDots />
                </motion.div>
              ) : (
                <Button
                  onClick={generateIdeas}
                  disabled={loading || !query}
                  className="my-2"
                >
                  Generate Suggestions
                </Button>
              )}
            </div>
            {ideas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                <h2 className="text-xl font-bold mb-2">Generated Ideas:</h2>
                {ideas
                  .sort((a, b) => calculatePriority(b) - calculatePriority(a))
                  .map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="mb-2">
                        <CardContent>
                          <p><strong>Idea:</strong> {idea.idea}</p>
                          <p><strong>Relevance:</strong> {idea.relevance}</p>
                          <p><strong>Impact:</strong> {idea.impact}</p>
                          <p><strong>Feasibility:</strong> {idea.feasibility}</p>
                          <p><strong>Priority Score:</strong> {calculatePriority(idea)}</p>
                          <Button
                            onClick={() => selectIdea(idea)}
                            disabled={
                              selectedIdeas.includes(idea) ||
                              selectedIdeas.length >= 2
                            }
                          >
                            {selectedIdeas.includes(idea)
                              ? "Selected"
                              : "Select"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default IdeaGenerator;

