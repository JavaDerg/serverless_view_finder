export default {
  type: "object",
  properties: {
    nodes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          x: { type: "number" },
          y: { type: "number" },
        },
        required: ["id", "x", "y"],
      },
    },
    elements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          nodes: {
            type: "array",
            items: { type: "number" },
          },
        },
        required: ["id", "nodes"],
      },
    },
  },
  values: {
    type: "object",
    properties: {
      element_id: { type: "number" },
      value: { type: "number" },
    },
    required: ["element_id", "value"],
  },
  required: ["nodes", "elements", "values"],
} as const;

