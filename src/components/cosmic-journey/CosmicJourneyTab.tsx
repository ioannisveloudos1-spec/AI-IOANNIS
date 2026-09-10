import React, { useState, useEffect, useMemo } from "react";
import { Starfield } from "./Starfield";
import { CosmicProgress } from "./CosmicProgress";
import { IntroScreen } from "./IntroScreen";
import { SceneView } from "./SceneView";
import { EndScreen } from "./EndScreen";
import { CosmicMap } from "./CosmicMap";
import { PantheonPanel } from "./PantheonPanel";
import { CodexPanel } from "./CodexPanel";
import { CosmicGreatYearPanel } from "./CosmicGreatYearPanel";
import { MindGeometryPanel } from "./MindGeometryPanel";
import { COSMIC_STORY_ACTS, StoryScene, StoryChoice } from "../../data/cosmicStory";

interface CosmicJourneyTabProps {
  onSelectWordForCalculator?: (word: string) => void;
}

const STORAGE_KEY = "cosmic_journey_save_v1";

interface SavedJourneyState {
  viewState: "intro" | "journey" | "end";
  currentSceneIndex: number;
  awarenessScore: number;
  unlockedSceneIds: string[];
  completedSceneIds: string[];
  selectedChoices: Record<string, string>; // sceneId -> choiceId
}

export const CosmicJourneyTab: React.FC<CosmicJourneyTabProps> = ({
  onSelectWordForCalculator,
}) => {
  // Flatten all 14 scenes across the 4 Acts
  const allScenes: StoryScene[] = useMemo(() => {
    return COSMIC_STORY_ACTS.flatMap((act) => act.scenes);
  }, []);

  // State
  const [viewState, setViewState] = useState<"intro" | "journey" | "end">("intro");
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [awarenessScore, setAwarenessScore] = useState<number>(0);
  const [unlockedSceneIds, setUnlockedSceneIds] = useState<string[]>([allScenes[0]?.id || "act1_scene1"]);
  const [completedSceneIds, setCompletedSceneIds] = useState<string[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  // Modals
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [pantheonOpen, setPantheonOpen] = useState<boolean>(false);
  const [codexOpen, setCodexOpen] = useState<boolean>(false);
  const [greatYearOpen, setGreatYearOpen] = useState<boolean>(false);
  const [mindGeometryOpen, setMindGeometryOpen] = useState<boolean>(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedJourneyState = JSON.parse(saved);
        if (parsed && typeof parsed.currentSceneIndex === "number") {
          setCurrentSceneIndex(Math.min(parsed.currentSceneIndex, allScenes.length - 1));
          setAwarenessScore(parsed.awarenessScore || 0);
          setUnlockedSceneIds(parsed.unlockedSceneIds || [allScenes[0]?.id || "act1_scene1"]);
          setCompletedSceneIds(parsed.completedSceneIds || []);
          setSelectedChoices(parsed.selectedChoices || {});
          if (parsed.viewState) {
            setViewState(parsed.viewState);
          }
        }
      }
    } catch (e) {
      console.error("Error reading cosmic journey progress", e);
    }
  }, [allScenes]);

  // Save state on change
  const saveState = (
    nextViewState = viewState,
    nextSceneIdx = currentSceneIndex,
    nextAwareness = awarenessScore,
    nextUnlocked = unlockedSceneIds,
    nextCompleted = completedSceneIds,
    nextChoices = selectedChoices
  ) => {
    try {
      const stateToSave: SavedJourneyState = {
        viewState: nextViewState,
        currentSceneIndex: nextSceneIdx,
        awarenessScore: nextAwareness,
        unlockedSceneIds: nextUnlocked,
        completedSceneIds: nextCompleted,
        selectedChoices: nextChoices,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving cosmic journey progress", e);
    }
  };

  const handleStartJourney = () => {
    setCurrentSceneIndex(0);
    setAwarenessScore(0);
    const initialUnlocked = [allScenes[0].id];
    setUnlockedSceneIds(initialUnlocked);
    setCompletedSceneIds([]);
    setSelectedChoices({});
    setViewState("journey");
    saveState("journey", 0, 0, initialUnlocked, [], {});
  };

  const handleContinueJourney = () => {
    setViewState("journey");
    saveState("journey");
  };

  const handleRestartJourney = () => {
    handleStartJourney();
  };

  const handleChoiceSelected = (choice: StoryChoice) => {
    const currentScene = allScenes[currentSceneIndex];
    if (!currentScene) return;

    const prevChoiceId = selectedChoices[currentScene.id];
    let scoreDelta = choice.awarenessGain;

    // If changing a previous choice in this scene, adjust delta
    if (prevChoiceId) {
      const prevChoice = currentScene.choices.find((c) => c.id === prevChoiceId);
      if (prevChoice) {
        scoreDelta -= prevChoice.awarenessGain;
      }
    }

    const nextScore = Math.max(0, awarenessScore + scoreDelta);
    const nextChoices = { ...selectedChoices, [currentScene.id]: choice.id };
    const nextCompleted = completedSceneIds.includes(currentScene.id)
      ? completedSceneIds
      : [...completedSceneIds, currentScene.id];

    // Unlock next scene if available
    let nextUnlocked = unlockedSceneIds;
    if (currentSceneIndex + 1 < allScenes.length) {
      const nextSceneId = allScenes[currentSceneIndex + 1].id;
      if (!nextUnlocked.includes(nextSceneId)) {
        nextUnlocked = [...nextUnlocked, nextSceneId];
      }
    }

    setAwarenessScore(nextScore);
    setSelectedChoices(nextChoices);
    setCompletedSceneIds(nextCompleted);
    setUnlockedSceneIds(nextUnlocked);
    saveState(viewState, currentSceneIndex, nextScore, nextUnlocked, nextCompleted, nextChoices);
  };

  const handleAdvanceScene = () => {
    if (currentSceneIndex + 1 < allScenes.length) {
      const nextIdx = currentSceneIndex + 1;
      const nextSceneId = allScenes[nextIdx].id;
      const nextUnlocked = unlockedSceneIds.includes(nextSceneId)
        ? unlockedSceneIds
        : [...unlockedSceneIds, nextSceneId];

      setCurrentSceneIndex(nextIdx);
      setUnlockedSceneIds(nextUnlocked);
      saveState("journey", nextIdx, awarenessScore, nextUnlocked, completedSceneIds, selectedChoices);
    } else {
      // Reached the end
      setViewState("end");
      saveState("end", currentSceneIndex, awarenessScore, unlockedSceneIds, completedSceneIds, selectedChoices);
    }
  };

  const handleSelectSceneFromMap = (sceneId: string) => {
    const foundIdx = allScenes.findIndex((s) => s.id === sceneId);
    if (foundIdx !== -1) {
      setCurrentSceneIndex(foundIdx);
      setViewState("journey");
      saveState("journey", foundIdx, awarenessScore, unlockedSceneIds, completedSceneIds, selectedChoices);
    }
  };

  const currentScene = allScenes[currentSceneIndex] || allScenes[0];

  return (
    <div className="relative min-h-[85vh] bg-[#0a0a0f] text-zinc-100 rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
      {/* Animated Starfield Background */}
      <Starfield />

      {/* Top Header Progress Bar during Journey or End */}
      {viewState !== "intro" && (
        <CosmicProgress
          currentSceneIndex={currentSceneIndex}
          totalScenes={allScenes.length}
          awarenessScore={awarenessScore}
          actTitle={currentScene.actTitle}
          actNumber={currentScene.actNumber}
          onOpenMap={() => setMapOpen(true)}
          onOpenPantheon={() => setPantheonOpen(true)}
          onOpenCodex={() => setCodexOpen(true)}
          onOpenGreatYear={() => setGreatYearOpen(true)}
          onOpenMindGeometry={() => setMindGeometryOpen(true)}
          onRestartJourney={handleRestartJourney}
        />
      )}

      {/* View Router */}
      <div className="relative z-10 p-2 sm:p-4">
        {viewState === "intro" && (
          <IntroScreen
            onStartJourney={handleStartJourney}
            onOpenMap={() => setMapOpen(true)}
            onOpenPantheon={() => setPantheonOpen(true)}
            onOpenCodex={() => setCodexOpen(true)}
            onOpenGreatYear={() => setGreatYearOpen(true)}
            onOpenMindGeometry={() => setMindGeometryOpen(true)}
            onSelectWordForCalculator={onSelectWordForCalculator}
            hasSavedProgress={completedSceneIds.length > 0}
            savedSceneIndex={currentSceneIndex}
            onContinueJourney={handleContinueJourney}
          />
        )}

        {viewState === "journey" && (
          <SceneView
            scene={currentScene}
            onChoiceSelected={handleChoiceSelected}
            onAdvanceScene={handleAdvanceScene}
            selectedChoiceId={selectedChoices[currentScene.id]}
            isLastScene={currentSceneIndex === allScenes.length - 1}
          />
        )}

        {viewState === "end" && (
          <EndScreen
            finalAwarenessScore={awarenessScore}
            onRestartJourney={handleRestartJourney}
            onOpenMap={() => setMapOpen(true)}
            onOpenPantheon={() => setPantheonOpen(true)}
            onOpenCodex={() => setCodexOpen(true)}
            onOpenGreatYear={() => setGreatYearOpen(true)}
            onOpenMindGeometry={() => setMindGeometryOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      {mindGeometryOpen && (
        <MindGeometryPanel
          onClose={() => setMindGeometryOpen(false)}
          onSelectWordForCalculator={onSelectWordForCalculator}
        />
      )}

      {mapOpen && (
        <CosmicMap
          currentSceneId={currentScene.id}
          unlockedSceneIds={unlockedSceneIds}
          completedSceneIds={completedSceneIds}
          onSelectScene={handleSelectSceneFromMap}
          onClose={() => setMapOpen(false)}
        />
      )}

      {greatYearOpen && (
        <CosmicGreatYearPanel
          onClose={() => setGreatYearOpen(false)}
          onSelectWordForCalculator={onSelectWordForCalculator}
        />
      )}

      {pantheonOpen && (
        <PantheonPanel
          onClose={() => setPantheonOpen(false)}
          onSelectWordForCalculator={onSelectWordForCalculator}
        />
      )}

      {codexOpen && (
        <CodexPanel
          onClose={() => setCodexOpen(false)}
          onSelectWordForCalculator={onSelectWordForCalculator}
        />
      )}
    </div>
  );
};
