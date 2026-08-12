import type { ActivityItem, Decision } from "./types";

export const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    type: "bill",
    title: "Electricity bill handled",
    detail: "$87.40 · Due Aug 24",
    time: "10:32 AM",
  },
  {
    id: "activity-2",
    type: "appointment",
    title: "Dental appointment added",
    detail: "Aug 27 · 3:30 PM",
    time: "9:18 AM",
  },
  {
    id: "activity-3",
    type: "receipt",
    title: "Apple receipt archived",
    detail: "AirPods Pro · $399",
    time: "8:46 AM",
  },
];

export const pendingDecision: Decision = {
  id: "decision-1",
  category: "Subscription change",
  title: "Spotify increased its price",
  description:
    "Your Premium subscription increased by 14.3%. LifeOps detected the change automatically.",
  oldValue: "$13.99",
  newValue: "$15.99",
  impact: "+$24/year",
  primaryAction: "Review",
  secondaryAction: "Keep",
};