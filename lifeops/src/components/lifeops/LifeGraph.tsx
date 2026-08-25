"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Background,
    Controls,
    ReactFlow,
    type Edge,
    type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { authFetch } from "@/lib/auth/auth-fetch";

interface GraphNode {
    id: string;
    type: string;
    label: string;
}

interface GraphEdge {
    source: string;
    target: string;
    relationship: string;
}

export function LifeGraph() {
    const [graph, setGraph] = useState<{
        nodes: GraphNode[];
        edges: GraphEdge[];
    } | null>(null);

    useEffect(() => {
        authFetch("/api/graph").then((response) => response.json())
            .then((data) => setGraph(data.graph)).catch(console.error);
    }, []);

    const nodes = useMemo<Node[]>(() => {
        if (!graph) { return []; }

        return graph.nodes.map((item, index) => {
            const angle = (index / Math.max(graph.nodes.length,1)) * Math.PI*2;

            const radius = item.type === "user" ? 0 : 280;

            return {
                id: item.id,
                position: {
                    x: 350 + Math.cos(angle)*radius,
                    y: 250 + Math.sin(angle)*radius,
                },
                data: {
                    label: item.label,
                },
                style: {
                    borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: item.type === "user" ? "#18181b" : "#ffffff",
                    color: item.type === "user" ? "#ffffff" : "#27272a",
                    padding: "10px 14px",
                    fontSize: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                },
            };
        });
    },[graph]);

    const edges = useMemo<Edge[]>(() => graph ? graph.edges.map((item, index) => ({
        id: `edge-${index}`,
        source: item.source,
        target: item.target,
        animated: false,
    })) : [], [graph]);

    return (
        <div className="h-[600px] overflow-hidden rounded-[30px] border border-black/[0.05] bg-white">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                nodesDraggable
                panOnDrag
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}