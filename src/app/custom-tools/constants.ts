import { NavigationItem } from './types';

export const navigation: NavigationItem[] = [
  {
    title: "Basic Info",
    icon: "settings",
    description: "Tool name, description, and basic settings",
    to: "basic-info",
    tabId: 1,
  },
  {
    title: "Input Schema",
    icon: "file",
    description: "Define input properties and types",
    to: "input-schema",
    tabId: 2,
  },
  {
    title: "Webhook Config",
    icon: "link",
    description: "Webhook settings and integration",
    to: "webhook-config",
    tabId: 3,
  },
];
