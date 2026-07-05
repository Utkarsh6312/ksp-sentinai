import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { Network as NetworkIcon, X, Info } from 'lucide-react';
import mockData from '../data/mockSchema.json';

const NetworkGraph = ({ theme }) => {
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = [];
    const edges = [];

    const fontColor = theme === 'dark' ? '#ffffff' : '#0f172a';
    const edgeColor = theme === 'dark' ? '#475569' : '#cbd5e1';
    const edgeHighlight = theme === 'dark' ? '#94a3b8' : '#64748b';

    // Add Case Nodes
    mockData.CaseMaster.forEach(c => {
      nodes.push({
        id: `case_${c.CaseMasterID}`,
        label: `FIR: ${c.CrimeNo}`,
        shape: 'hexagon',
        color: { 
          background: '#1e3a8a', 
          border: '#3b82f6',
          highlight: { background: '#2563eb', border: '#60a5fa' }
        },
        font: { color: fontColor, face: 'Outfit' },
        size: 30,
        shadow: { enabled: true, color: 'rgba(59, 130, 246, 0.4)', size: 10, x: 0, y: 0 }
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
          color: { 
            background: '#9f1239', 
            border: '#e11d48',
            highlight: { background: '#be123c', border: '#fb7185' }
          },
          font: { color: fontColor, face: 'Outfit', size: 12 },
          size: 18,
          shadow: { enabled: true, color: 'rgba(225, 29, 72, 0.4)', size: 10, x: 0, y: 0 }
        });
      }
      // Edge from Case to Accused
      edges.push({
        from: `case_${a.CaseMasterID}`,
        to: accusedId,
        color: { color: edgeColor, highlight: edgeHighlight },
        arrows: 'to',
        smooth: { type: 'curvedCW', roundness: 0.2 }
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
          color: { 
            background: '#065f46', 
            border: '#10b981',
            highlight: { background: '#047857', border: '#34d399' }
          },
          font: { color: fontColor, face: 'Outfit', size: 12 },
          size: 18,
          shadow: { enabled: true, color: 'rgba(16, 185, 129, 0.4)', size: 10, x: 0, y: 0 }
        });
      }
      edges.push({
        from: `case_${v.CaseMasterID}`,
        to: victimId,
        color: { color: edgeColor, opacity: 0.5, highlight: edgeHighlight },
        dashes: [5, 5],
        arrows: 'to',
        smooth: { type: 'curvedCCW', roundness: 0.2 }
      });
    });

    const data = { nodes, edges };
    const options = {
      height: '100%',
      width: '100%',
      nodes: {
        borderWidth: 2,
        borderWidthSelected: 4,
      },
      edges: {
        width: 2,
        selectionWidth: 3,
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.4,
          springLength: 180,
          damping: 0.09
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true
      }
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }
    
    networkRef.current = new Network(containerRef.current, data, options);
    const network = networkRef.current;

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        let nodeData = null;
        let type = '';

        if (nodeId.startsWith('case_')) {
          const id = parseInt(nodeId.split('_')[1]);
          const caseObj = mockData.CaseMaster.find(c => c.CaseMasterID === id);
          if(caseObj) { nodeData = caseObj; type = 'FIR'; }
        } else if (nodeId.startsWith('accused_')) {
          const id = parseInt(nodeId.split('_')[1]);
          const accObj = mockData.Accused.find(a => a.AccusedMasterID === id);
          if(accObj) { nodeData = accObj; type = 'Accused'; }
        } else if (nodeId.startsWith('victim_')) {
          const id = parseInt(nodeId.split('_')[1]);
          const vicObj = mockData.Victim.find(v => v.VictimMasterID === id);
          if(vicObj) { nodeData = vicObj; type = 'Victim'; }
        }
        
        if(nodeData) setSelectedNode({ type, data: nodeData });
      } else {
        setSelectedNode(null);
      }
    });
    
    network.on("hoverNode", function () {
      network.canvas.body.container.style.cursor = 'pointer';
    });
    network.on("blurNode", function () {
      network.canvas.body.container.style.cursor = 'default';
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [theme]); // Re-render graph when theme changes for font colors

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-70px)] md:h-full flex flex-col page-enter pb-20 md:pb-8">
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            Suspect Network Graph
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-1.5 flex items-center text-xs md:text-sm">
            <NetworkIcon className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
            Discover relationships between FIRs, Accused, and Victims.
          </p>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-2xl p-1 relative shadow-lg dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: theme === 'dark' ? 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' : 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Legend */}
        <div className="absolute top-2 left-2 md:top-6 md:left-6 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 md:p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl transform scale-75 md:scale-100 origin-top-left pointer-events-none md:pointer-events-auto">
          <h4 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 border-b border-slate-200 dark:border-slate-700/50 pb-2">Graph Legend</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 group">
              <div className="w-5 h-5 bg-blue-900 border-2 border-ksp-blue flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md dark:shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">FIR / Case</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-5 h-5 bg-rose-900 border-2 border-ksp-crimson rounded-full transform group-hover:scale-110 transition-transform shadow-md dark:shadow-[0_0_8px_rgba(225,29,72,0.5)]"></div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Accused</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-5 h-5 bg-emerald-900 border-2 border-emerald-500 rounded-full transform group-hover:scale-110 transition-transform shadow-md dark:shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Victim</span>
            </div>
          </div>
        </div>
        
        {/* Details Panel */}
        {selectedNode && (
          <div className="absolute top-2 right-2 md:top-6 md:right-6 z-20 w-64 md:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-300 dark:border-slate-700 shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden animate-fadeUp">
            <div className={`p-4 border-b flex justify-between items-center ${
              selectedNode.type === 'FIR' ? 'bg-ksp-blue/10 dark:bg-ksp-blue/20 border-ksp-blue/20 dark:border-ksp-blue/30' :
              selectedNode.type === 'Accused' ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20 dark:border-rose-500/30' :
              'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 dark:border-emerald-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-slate-800 dark:text-white" />
                <h3 className="font-bold text-slate-900 dark:text-white tracking-wide">{selectedNode.type} Details</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedNode.type === 'FIR' && (
                <>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Crime No:</span> <span className="text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs ml-2">{selectedNode.data.CrimeNo}</span></p>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Date:</span> <span className="text-slate-900 dark:text-white ml-2">{selectedNode.data.IncidentFromDate}</span></p>
                  <p className="text-sm mt-3"><span className="text-slate-500 dark:text-slate-400 block mb-1">Brief Facts:</span> <span className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed block bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">{selectedNode.data.BriefFacts}</span></p>
                </>
              )}
              {selectedNode.type === 'Accused' && (
                <>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Name:</span> <span className="text-slate-900 dark:text-white font-medium ml-2">{selectedNode.data.AccusedName}</span></p>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Age/Gender:</span> <span className="text-slate-900 dark:text-white ml-2">{selectedNode.data.Age} / {selectedNode.data.Gender}</span></p>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Caste:</span> <span className="text-slate-900 dark:text-white ml-2">{selectedNode.data.Caste}</span></p>
                  <p className="text-sm mt-3"><span className="text-slate-500 dark:text-slate-400 block mb-1">Address:</span> <span className="text-slate-700 dark:text-slate-300 text-xs block bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50">{selectedNode.data.Address}</span></p>
                </>
              )}
              {selectedNode.type === 'Victim' && (
                <>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Name:</span> <span className="text-slate-900 dark:text-white font-medium ml-2">{selectedNode.data.VictimName}</span></p>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Age/Gender:</span> <span className="text-slate-900 dark:text-white ml-2">{selectedNode.data.Age} / {selectedNode.data.Gender}</span></p>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Caste:</span> <span className="text-slate-900 dark:text-white ml-2">{selectedNode.data.Caste}</span></p>
                  <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Injury Type:</span> <span className="text-rose-600 dark:text-rose-400 ml-2 text-xs font-semibold uppercase tracking-wider">{selectedNode.data.InjuryType}</span></p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Graph Container */}
        <div ref={containerRef} className="absolute inset-0 z-10 focus:outline-none"></div>
      </div>
    </div>
  );
};

export default NetworkGraph;
