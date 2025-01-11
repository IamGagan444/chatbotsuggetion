import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdeaWithSuggestions, SuggestionDisplayProps } from "@/types";
import LoadingDots from "./LoadingDots";
import { motion } from "framer-motion";

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({
  selectedIdeas,
}) => {
  const [suggestions, setSuggestions] = useState<IdeaWithSuggestions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://chatbot-for-idea-suggestions.onrender.com/api/generate-suggestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedIdeas }),
        }
      );
      const data = await response.json();
      setSuggestions(data?.data);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full md:w-[700px] mx-10 px-4">
      <div className="">
        {selectedIdeas.length === 2 && (
          <div>
            {loading ? (
              <div className="my-4 flex justify-center items-center text-2xl font-bold space-x-4">
                Wait For AI Result <LoadingDots />
              </div>
            ) : (
              <Button
                onClick={generateSuggestions}
                disabled={loading}
                className="my-2"
              >
                Generate Suggestions
              </Button>
            )}
          </div>
        )}
        {suggestions?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <h2 className="text-xl font-bold mb-2">Suggestions:</h2>
            {suggestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="mb-2">
                  <CardHeader>
                    <CardTitle className="font-bold">{item.idea}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.suggestions?.length > 0 ? (
                      <motion.ul
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 },
                          },
                        }}
                      >
                        {item.suggestions.map((suggestion, i) => (
                          <motion.li
                            key={i}
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              visible: { opacity: 1, x: 0 },
                            }}
                            className="mb-2"
                          >
                            <strong>{suggestion.title}:</strong>{" "}
                            {suggestion.description}
                          </motion.li>
                        ))}
                      </motion.ul>
                    ) : (
                      <p>No suggestions available</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuggestionDisplay;
