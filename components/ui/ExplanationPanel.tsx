'use client';

/**
 * Explanation Panel Component
 * Displays detailed step-by-step explanations during algorithm execution
 */

import { AlgorithmStep } from '@/types';
import { useAnimationStore } from '@/lib/stores/animationStore';
import { useEffect, useRef, useState } from 'react';
import { getAlgorithmLearningContent } from '@/lib/utils/algorithmLearningContent';

interface ExplanationPanelProps {
  step: AlgorithmStep | null;
  isPlaying: boolean;
  selectedAlgorithm: string;
}

export function ExplanationPanel({ step, isPlaying, selectedAlgorithm }: ExplanationPanelProps) {
  const { steps, currentStepIndex, setCurrentStepIndex } = useAnimationStore();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const stepItemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const learningContent = getAlgorithmLearningContent(selectedAlgorithm);

  const stepHistory = steps;

  const asArrayData = (value: unknown): number[] | null => {
    if (Array.isArray(value) && value.every((item) => typeof item === 'number')) {
      return value as number[];
    }

    if (value && typeof value === 'object') {
      const maybeArray = (value as { array?: unknown }).array;
      if (Array.isArray(maybeArray) && maybeArray.every((item) => typeof item === 'number')) {
        return maybeArray as number[];
      }
    }

    return null;
  };

  const getChangedArrayIndices = (before: number[], after: number[]): number[] => {
    const maxLength = Math.max(before.length, after.length);
    const changed: number[] = [];

    for (let index = 0; index < maxLength; index += 1) {
      if (before[index] !== after[index]) {
        changed.push(index);
      }
    }

    return changed;
  };

  const stringifyValue = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) return `[${value.slice(0, 8).map((item) => stringifyValue(item)).join(', ')}${value.length > 8 ? ', ...' : ''}]`;
    if (value && typeof value === 'object') return JSON.stringify(value);
    return 'N/A';
  };

  const buildStepInsights = (historyStep: AlgorithmStep): string[] => {
    const insights: string[] = [];
    const beforeData = historyStep.beforeState?.data;
    const afterData = historyStep.afterState?.data;
    const beforeArray = asArrayData(beforeData);
    const afterArray = asArrayData(afterData);
    const affected = historyStep.affectedIndices ?? [];
    const metadata = historyStep.afterState?.metadata as Record<string, unknown> | undefined;

    insights.push(historyStep.detailedExplanation || historyStep.description);

    if (affected.length > 0) {
      insights.push(`Focus indices: ${affected.join(', ')}.`);
    }

    if (historyStep.type === 'compare' && beforeArray && affected.length >= 2) {
      const [first, second] = affected;
      insights.push(
        `Compared values ${beforeArray[first]} (index ${first}) and ${beforeArray[second]} (index ${second}).`
      );
    }

    if (historyStep.type === 'swap' && beforeArray && afterArray && affected.length >= 2) {
      const [first, second] = affected;
      insights.push(
        `Swapped index ${first} (${beforeArray[first]} → ${afterArray[first]}) with index ${second} (${beforeArray[second]} → ${afterArray[second]}).`
      );
    }

    if (historyStep.type === 'insert' && afterArray && affected.length >= 1) {
      const insertIndex = affected[affected.length - 1];
      insights.push(`Inserted/updated value ${afterArray[insertIndex]} at index ${insertIndex}.`);
    }

    if (beforeArray && afterArray) {
      const changedIndices = getChangedArrayIndices(beforeArray, afterArray);
      if (changedIndices.length > 0) {
        const preview = changedIndices
          .slice(0, 6)
          .map((index) => `i${index}: ${beforeArray[index]}→${afterArray[index]}`)
          .join(', ');
        insights.push(`State change: ${preview}${changedIndices.length > 6 ? ', ...' : ''}.`);
      }
    }

    if (metadata) {
      const metaHints: string[] = [];

      if (typeof metadata.depth === 'number') {
        metaHints.push(`recursion depth ${metadata.depth}`);
      }
      if (typeof metadata.phase === 'string') {
        metaHints.push(`phase: ${metadata.phase}`);
      }
      if (typeof metadata.left === 'number' && typeof metadata.right === 'number') {
        metaHints.push(`range [${metadata.left}..${metadata.right}]`);
      }
      if (typeof metadata.low === 'number' && typeof metadata.high === 'number') {
        metaHints.push(`window [${metadata.low}..${metadata.high}]`);
      }
      if (typeof metadata.mid === 'number') {
        metaHints.push(`mid index ${metadata.mid}`);
      }
      if (typeof metadata.pivotIndex === 'number') {
        metaHints.push(`pivot index ${metadata.pivotIndex}`);
      }
      if (typeof metadata.pivotValue === 'number') {
        metaHints.push(`pivot value ${metadata.pivotValue}`);
      }
      if (typeof metadata.target === 'number') {
        metaHints.push(`target ${metadata.target}`);
      }

      if (metaHints.length > 0) {
        insights.push(`Logic context: ${metaHints.join(', ')}.`);
      }
    }

    if (historyStep.variables && Object.keys(historyStep.variables).length > 0) {
      const variableSummary = Object.entries(historyStep.variables)
        .slice(0, 5)
        .map(([key, value]) => `${key}=${stringifyValue(value)}`)
        .join(', ');
      insights.push(`Tracked variables: ${variableSummary}.`);
    }

    insights.push(`Pseudocode line: ${historyStep.pseudocodeLine}.`);

    return insights;
  };

  const detailedHistory = stepHistory.map((historyStep, index) => ({
    index,
    step: historyStep,
    insights: buildStepInsights(historyStep),
  }));

  const recursionTreeSteps = stepHistory
    .map((historyStep, index) => {
      const metadata = historyStep.afterState?.metadata as Record<string, unknown> | undefined;
      const depthValue = metadata?.depth;
      const phaseValue = metadata?.phase;
      const left = metadata?.left;
      const right = metadata?.right;
      const low = metadata?.low;
      const high = metadata?.high;

      if (typeof depthValue !== 'number') {
        return null;
      }

      const depth = Math.max(0, depthValue);
      const phase = typeof phaseValue === 'string' ? phaseValue : 'step';

      let rangeText = '';
      if (typeof left === 'number' && typeof right === 'number') {
        rangeText = `[${left}..${right}]`;
      } else if (typeof low === 'number' && typeof high === 'number') {
        rangeText = `[${low}..${high}]`;
      }

      return {
        index,
        id: historyStep.id,
        depth,
        phase,
        description: historyStep.description,
        rangeText,
      };
    })
    .filter((item): item is { index: number; id: string; depth: number; phase: string; description: string; rangeText: string } => item !== null);

  const toggleStepExpansion = (index: number) => {
    setCurrentStepIndex(index);
    setExpandedSteps((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const currentStepNode = stepItemRefs.current[currentStepIndex];
    if (!currentStepNode) return;

    currentStepNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [currentStepIndex, isPlaying]);

  const getStepIcon = () => {
    switch (step.type) {
      case 'compare':
        return '🔍';
      case 'swap':
        return '🔄';
      case 'insert':
        return '➕';
      case 'delete':
        return '➖';
      case 'highlight':
        return '✨';
      case 'traverse':
        return '👉';
      default:
        return '📝';
    }
  };

  const getStepColor = () => {
    switch (step.type) {
      case 'compare':
        return 'from-yellow-500 to-amber-500';
      case 'swap':
        return 'from-red-500 to-rose-500';
      case 'insert':
        return 'from-emerald-500 to-green-500';
      case 'delete':
        return 'from-red-500 to-pink-500';
      case 'highlight':
        return 'from-cyan-500 to-blue-500';
      case 'traverse':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-cyan-500 to-purple-500';
    }
  };

  if (!step) return null;

  return (
    <div
      data-playing={isPlaying}
      className="w-full h-full max-w-none transition-all duration-500 translate-x-0 opacity-100"
    >
      <div className={`bg-gradient-to-br ${getStepColor()} p-[2px] rounded-xl shadow-2xl h-full`}>
        <div className="bg-slate-900 rounded-xl p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{getStepIcon()}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {step.type.charAt(0).toUpperCase() + step.type.slice(1)} Operation
              </h3>
              <p className="text-base text-cyan-300">Step {step.id.split('-')[1]}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-lg text-white font-semibold mb-2">{step.description}</p>
            {step.detailedExplanation && (
              <p className="text-cyan-200 text-base leading-relaxed">
                {step.detailedExplanation}
              </p>
            )}
          </div>

          {/* Variables Display */}
          {step.variables && Object.keys(step.variables).length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
              <h4 className="text-purple-400 font-semibold text-base mb-2">Variables:</h4>
              <div className="space-y-1">
                {Object.entries(step.variables).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-base">
                    <span className="text-cyan-300 font-mono">{key}:</span>
                    <span className="text-white font-mono font-bold">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-purple-400">Operations</p>
              <p className="text-white font-bold">{step.metrics.operationCount}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-purple-400">Comparisons</p>
              <p className="text-white font-bold">{step.metrics.comparisonCount}</p>
            </div>
          </div>

          <div className="mt-4 bg-slate-800/50 rounded-lg p-3">
            <h4 className="text-purple-400 font-semibold text-base mb-2">Learning Guide</h4>

            <div className="mb-3">
              <p className="text-cyan-200 font-semibold">Basic knowledge required</p>
              <ul className="list-disc pl-5 text-sm text-cyan-100 space-y-1 mt-1">
                {learningContent.prerequisites.map((item, index) => (
                  <li key={`prerequisite-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-cyan-200 font-semibold">Technique</p>
              <p className="text-sm text-cyan-100 mt-1">{learningContent.technique}</p>
            </div>

            <div className="mb-3">
              <p className="text-cyan-200 font-semibold">Branching logic</p>
              <ul className="list-disc pl-5 text-sm text-cyan-100 space-y-1 mt-1">
                {learningContent.branching.map((item, index) => (
                  <li key={`branch-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-cyan-200 font-semibold">Real-life examples</p>
              <ul className="list-disc pl-5 text-sm text-cyan-100 space-y-1 mt-1">
                {learningContent.realLifeExamples.map((item, index) => (
                  <li key={`real-life-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-cyan-200 font-semibold">Possible interview Q&A</p>
              <div className="space-y-2 mt-1">
                {learningContent.interviewQA.map((item, index) => (
                  <div key={`qa-${index}`} className="text-sm">
                    <p className="text-amber-300">Q: {item.question}</p>
                    <p className="text-cyan-100">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-cyan-200 font-semibold">Practice questions</p>
              <ul className="list-disc pl-5 text-sm text-cyan-100 space-y-1 mt-1">
                {learningContent.practiceQuestions.map((item, index) => (
                  <li key={`practice-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {stepHistory.length > 1 && (
            <div className="mt-4 bg-slate-800/50 rounded-lg p-3">
              <h4 className="text-purple-400 font-semibold text-base mb-2">Step History (click to expand/collapse)</h4>
              <div className="space-y-2">
                {detailedHistory.map(({ step: historyStep, index, insights }) => {
                  const isCurrent = index === currentStepIndex;
                  const isExpanded = expandedSteps.has(index);
                  return (
                    <div
                      ref={(node) => {
                        stepItemRefs.current[index] = node;
                      }}
                      key={historyStep.id}
                      className={`rounded text-sm border transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/20 border-cyan-400/70 text-cyan-100'
                          : 'bg-slate-700/50 border-slate-600 text-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleStepExpansion(index)}
                        className="w-full text-left px-2 py-2 flex items-start justify-between gap-2 hover:bg-slate-700/60 rounded"
                      >
                        <span className="min-w-0">
                          <span className="font-semibold mr-2">#{index + 1}</span>
                          <span>{historyStep.description}</span>
                        </span>
                        <span className="text-cyan-300 shrink-0">{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-600/70 space-y-1 text-sm text-cyan-100">
                          {insights.map((insight, insightIndex) => (
                            <p key={`${historyStep.id}-insight-${insightIndex}`} className="leading-relaxed">
                              • {insight}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {recursionTreeSteps.length > 0 && (
            <div className="mt-4 bg-slate-800/50 rounded-lg p-3">
              <h4 className="text-purple-400 font-semibold text-base mb-2">Recursion Tree (divide & conquer)</h4>
              <div className="space-y-1">
                {recursionTreeSteps.map((treeStep) => {
                  const isCurrent = treeStep.index === currentStepIndex;
                  return (
                    <button
                      key={`${treeStep.id}-${treeStep.index}`}
                      onClick={() => setCurrentStepIndex(treeStep.index)}
                      className={`w-full text-left rounded text-sm transition-colors border ${
                        isCurrent
                          ? 'bg-purple-500/30 border-purple-300/70 text-purple-100'
                          : 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700'
                      }`}
                      style={{ padding: '0.35rem 0.5rem', marginLeft: `${treeStep.depth * 14}px`, width: `calc(100% - ${treeStep.depth * 14}px)` }}
                    >
                      <span className="font-semibold mr-2">#{treeStep.index + 1}</span>
                      <span className="text-cyan-300 mr-2">{treeStep.phase}</span>
                      {treeStep.rangeText && <span className="text-amber-300 mr-2">{treeStep.rangeText}</span>}
                      <span>{treeStep.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
