import React from "react";
import { StoneSolarSquare } from "./StoneSolarSquare";

interface SolarMagicSquareTabProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
  onSaveItem?: (item: {
    text: string;
    normalized: string;
    value: number;
    root: number;
    greekNumeral: string;
    isPhrase: boolean;
    wordCount: number;
    category?: string;
    notes?: string;
  }) => void;
}

export const SolarMagicSquareTab: React.FC<SolarMagicSquareTabProps> = ({
  onOpenAiModal,
  onSaveItem,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <StoneSolarSquare
        onOpenAiModal={onOpenAiModal}
        onSaveItem={onSaveItem}
      />
    </div>
  );
};
