import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import mockData from '../data/mockSchema.json';

const NetworkGraph = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = [];
    const edges = [];

    // Add Case Nodes
    mockData.CaseMaster.forEach(c => {
      nodes.push({
        id: `case_${c.CaseMasterID}`,
        label: `FIR: ${c.CrimeNo}`,
        shape: 'hexagon',
        color: { background: '#3b82f6', border: '#2563eb' },
        font: { color: '#ffffff' },
        size: 25
      });
    });

    // Add Accused Nodes & Edges
    mockData.Accused.forEach(a => {
      const accusedId = `accused_${a.AccusedMasterID}`;
      // Add node if not exists
      if (!nodes.find(n => n.id === accusedId)) {
        nodes.push({
          id: accusedId,
          label: `Accused: ${a.AccusedName}`,
          shape: 'dot',
          color: { background: '#e11d48', border: '#be123c' },
          font: { color: '#ffffff' },
          size: 15
        });
      }
      // Edge from Case to Accused
      edges.push({
        from: `case_${a.CaseMasterID}`,
        to: accusedId,
        color: { color: '#64748b' },
        arrows: 'to'
      });
    });

    // Add Victim Nodes & Edges
    mockData.Victim.forEach(v => {
      const victimId = `victim_${v.VictimMasterID}`;
      if (!nodes.find(n => n.id === victimId)) {
        nodes.push({
          id: victimId,
          label: `Victim: ${v.VictimName}`,
          shape: 'dot',
          color: { background: '#10b981', border: '#059669' },
          font: { color: '#ffffff' },
          size: 15
        });
      }
      edges.push({
        from: `case_${v.CaseMasterID}`,
        to: victimId,
        color: { color: '#64748b', opacity: 0.5 },
        dashes: true,
        arrows: 'to'
      });
    });

    const data = { nodes, edges };
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 150
        }
      }
    };

    const network = new Network(containerRef.current, data, options);

    return () => {
      network.destroy();
    };
  }, []);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white tracking-wide">Suspect Network Graph</h2>
        <p className="text-slate-400 mt-1">Discover relationships between FIRs, Accused, and Victims.</p>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-2 relative shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute top-6 left-6 z-10 bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md">
          <h4 className="text-white text-sm font-bold mb-3">Legend</h4>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-ksp-blue border-2 border-blue-600 rounded-sm"></div>
            <span className="text-slate-300 text-xs">FIR / Case</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-ksp-crimson border-2 border-rose-700 rounded-full"></div>
            <span className="text-slate-300 text-xs">Accused</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-full"></div>
            <span className="text-slate-300 text-xs">Victim</span>
          </div>
        </div>
        
        <div ref={containerRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default NetworkGraph;
