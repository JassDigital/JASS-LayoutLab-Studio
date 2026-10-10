import React, { useMemo, useState } from 'react';
import DataExplorer from './DataExplorer.jsx';
import ReactDOM from 'react-dom';
import JSZip from 'jszip';
import { GridLayout, useContainerWidth } from 'react-grid-layout';
import { MuuriComponent } from 'muuri-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PanelsTopLeft, Boxes, LayoutGrid, Columns3, Grip, Code2, Download, Plus, Save, RotateCcw, Monitor, Tablet, Smartphone, ChevronDown, Search, SlidersHorizontal, Check, Sparkles, Layers, CircleHelp, Move, Maximize2, X, FileCode2, ExternalLink, HardDrive } from 'lucide-react';
import './styles.css';

const libraryItems = [
  {id:'autoresponsive-react',name:'AutoResponsive',kind:'Auto-arranging grid',desc:'Automatically arranges tiles into a responsive grid.',status:'Planned adapter',url:'https://github.com/xudafeng/autoresponsive-react'},
  {id:'react-grid-layout',name:'React Grid Layout',kind:'Drag + resize',desc:'Interactive dashboard grid with responsive breakpoints.',status:'Export adapter ready',url:'https://github.com/react-grid-layout/react-grid-layout'},
  {id:'muuri-react',name:'Muuri React',kind:'Sortable grid',desc:'Draggable, sortable and filterable tile layouts.',status:'Native adapter integrated',url:'https://github.com/Paol-imi/muuri-react'},
  {id:'react-masonry-component',name:'Masonry',kind:'Masonry',desc:'Variable-height masonry gallery.',status:'CSS prototype',url:'https://github.com/eiriklv/react-masonry-component'},
  {id:'react-reflex',name:'React Reflex',kind:'Split panes',desc:'Resizable regions for advanced application workspaces.',status:'Planned adapter',url:'https://github.com/leefsmp/Re-Flex'},
  {id:'react-spaces',name:'React Spaces',kind:'Anchored panels',desc:'Nested, anchored and scrollable regions.',status:'Planned adapter',url:'https://github.com/aeagle/react-spaces'},
  {id:'react-layman',name:'React Layman',kind:'Tiling + tabs',desc:'Dynamic tiling layout manager with tabs.',status:'Planned adapter',url:'https://github.com/Jeshwin/react-layman'},
  {id:'hedron',name:'Hedron',kind:'Flex grid',desc:'Minimal flexbox grid system.',status:'Planned adapter',url:'https://github.com/JSBros/hedron'},
  {id:'m-react-splitters',name:'React Splitters',kind:'Splitters',desc:'TypeScript splitter component.',status:'Planned adapter',url:'https://github.com/martinnov92/React-Splitters'},
  {id:'react-stonecutter',name:'Stonecutter',kind:'Animated grid',desc:'Animated grid layout transitions.',status:'Planned adapter',url:'https://github.com/dantrain/react-stonecutter'},
  {id:'react-colrow',name:'Colrow',kind:'Flex columns',desc:'Responsive flexbox rows and columns.',status:'Planned adapter',url:'https://github.com/phphe/react-colrow'},
  {id:'react-schematic',name:'Schematic',kind:'Styled schematic',desc:'Build responsive layouts from styled schematics.',status:'Planned adapter',url:'https://github.com/umeshmk/react-schematic'}
];
const initialTiles = [
  {id:1,title:'Analytics overview',type:'Analytics',size:'large',icon:'chart',color:'violet',detail:'Traffic and engagement'},
  {id:2,title:'Data sources',type:'Infrastructure',size:'medium',icon:'database',color:'blue',detail:'12 connected sources'},
  {id:3,title:'Project status',type:'Operations',size:'small',icon:'activity',color:'green',detail:'All systems operational'},
  {id:4,title:'Document workspace',type:'Workspace',size:'wide',icon:'file',color:'amber',detail:'Recent files and activity'},
  {id:5,title:'Team activity',type:'Collaboration',size:'medium',icon:'users',color:'pink',detail:'Latest team updates'}
];
const iconFor = {chart:'◒',database:'▤',activity:'⌁',file:'▧',users:'♧'};
function App(){
  const [showDataExplorer, setShowDataExplorer] = useState(false);
  const [pattern,setPattern] = useState('responsive'); const [selectedLib,setSelectedLib] = useState('react-grid-layout');
  const [tiles,setTiles] = useState(initialTiles); const [selected,setSelected] = useState(1); const [columns,setColumns] = useState(3); const [gap,setGap] = useState(16); const [radius,setRadius] = useState(14);
  const [rglLayout,setRglLayout] = useState([{i:'1',x:0,y:0,w:6,h:4},{i:'2',x:6,y:0,w:3,h:4},{i:'3',x:9,y:0,w:3,h:4},{i:'4',x:0,y:4,w:8,h:4},{i:'5',x:8,y:4,w:4,h:4}]);
  const { width: gridWidth, containerRef: gridContainerRef, mounted: gridMounted } = useContainerWidth();
  const [device,setDevice] = useState('desktop'); const [showCode,setShowCode] = useState(false); const [search,setSearch] = useState(''); const [toast,setToast] = useState(''); const [preset,setPreset] = useState('Dashboard starter');
  const selectedTile = tiles.find(t=>t.id===selected) || tiles[0]; const lib = libraryItems.find(l=>l.id===selectedLib) || libraryItems[1];
  const visibleLibraries = libraryItems.filter(l=>(l.name+' '+l.kind+' '+l.desc).toLowerCase().includes(search.toLowerCase()));
  const notify = (s)=>{setToast(s);window.setTimeout(()=>setToast(''),2600)};
  const updateTile=(key,value)=>setTiles(old=>old.map(t=>t.id===selected?{...t,[key]:value}:t));
  const addTile=()=>{const id=Math.max(0,...tiles.map(t=>t.id))+1;setTiles(old=>[...old,{id,title:`New panel ${id}`,type:'Custom',size:'medium',icon:'file',color:'violet',detail:'Customize this panel'}]);setRglLayout(old=>[...old,{i:String(id),x:0,y:Infinity,w:4,h:4}]);setSelected(id);notify('Panel added to canvas')};
  const savePreset=()=>{localStorage.setItem('jass-layoutlab-preset',JSON.stringify({pattern,selectedLib,tiles,columns,gap,radius}));setPreset('Saved locally');notify('Layout preset saved in this browser')};
  const reset=()=>{setTiles(initialTiles);setRglLayout([{i:'1',x:0,y:0,w:6,h:4},{i:'2',x:6,y:0,w:3,h:4},{i:'3',x:9,y:0,w:3,h:4},{i:'4',x:0,y:4,w:8,h:4},{i:'5',x:8,y:4,w:4,h:4}]);setPattern('responsive');setColumns(3);setGap(16);setRadius(14);setSelected(1);setPreset('Dashboard starter');notify('Starter layout restored')};
  const generated = useMemo(()=>`import React from 'react';
import { GridLayout, useContainerWidth } from 'react-grid-layout';
import { MuuriComponent } from 'muuri-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Layout.css';

const initialLayout = ${JSON.stringify(rglLayout)};
const panels = ${JSON.stringify(tiles)};

export default function Layout() {
  const { width, containerRef, mounted } = useContainerWidth();
  const [layout, setLayout] = React.useState(initialLayout);
  const cols = width < 520 ? 1 : width < 850 ? 6 : 12;
  const responsiveLayout = layout.map(item => ({ ...item, x: cols === 1 ? 0 : Math.min(item.x, cols - item.w), w: cols === 1 ? 1 : Math.min(item.w, cols) }));
  return (
    <main className="layout-page">
      <header className="layout-heading"><h1>JASS LayoutLab Export</h1><p>Drag panels to move them and use the corner handles to resize.</p></header>
      <div className="layout-grid-host" ref={containerRef}>
        {mounted && <GridLayout width={width} layout={responsiveLayout} onLayoutChange={setLayout} gridConfig={{ cols, rowHeight: 34, margin: [${gap}, ${gap}], containerPadding: [0, 0] }} dragConfig={{ enabled: true, handle: '.drag-handle' }} resizeConfig={{ enabled: true }}>
          {panels.map(panel => <section key={String(panel.id)} className={\`layout-card \${panel.color}\`}>
            <div className="drag-handle">⠿ <span>{panel.type}</span></div><h2>{panel.title}</h2><p>{panel.detail}</p>
          </section>)}
        </GridLayout>}
      </div>
    </main>
  );
}
`,[tiles,rglLayout,gap]);
  const muuriGenerated = useMemo(()=>`import React from 'react';
import { MuuriComponent } from 'muuri-react';
import './Layout.css';

const panels = ${JSON.stringify(tiles)};

export default function Layout() {
  const [query, setQuery] = React.useState('');
  const visiblePanels = panels.filter(panel => (panel.title + ' ' + panel.type + ' ' + panel.detail).toLowerCase().includes(query.toLowerCase()));
  return <main className="layout-page">
    <header className="layout-heading"><h1>JASS LayoutLab — Muuri</h1><p>Drag tiles to rearrange them. Search filters the visible cards.</p><input aria-label="Filter panels" placeholder="Filter panels..." value={query} onChange={event => setQuery(event.target.value)} /></header>
    <MuuriComponent dragEnabled dragSort={true} layoutDuration={250} dragReleaseDuration={250} gridProps={{ className: 'muuri-grid' }}>
      {visiblePanels.map(panel => <article key={String(panel.id)} className={'muuri-item ' + panel.color}><div className="muuri-item-content"><div className="drag-handle">⠿ <span>{panel.type}</span></div><h2>{panel.title}</h2><p>{panel.detail}</p></div></article>)}
    </MuuriComponent>
  </main>;
}
`,[tiles]);
  async function exportProject(){
    const zip=new JSZip(); const deps={react:'^19.0.0','react-dom':'^19.0.0',vite:'^6.1.0','@vitejs/plugin-react':'latest'};
    if(selectedLib==='react-grid-layout') deps['react-grid-layout']='^2.2.4'; else if(selectedLib==='muuri-react') deps['muuri-react']='^3.1.7'; else if(selectedLib==='autoresponsive-react') deps['autoresponsive-react']='latest'; else deps[selectedLib]='latest'; if(selectedLib==='react-grid-layout') deps['react-resizable']='^3.0.5';
    zip.file('package.json',JSON.stringify({name:'jass-layoutlab-export',version:'1.0.0',private:true,type:'module',scripts:{dev:'vite',build:'vite build',preview:'vite preview'},dependencies:deps},null,2));
    zip.file('index.html','<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>LayoutLab Export</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>');
    zip.file('vite.config.js',"import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({plugins:[react()]});\n");
    zip.file('src/main.jsx',`import React from 'react';\nimport ReactDOM from 'react-dom';\nimport Layout from './Layout.jsx';\nimport './Layout.css';\ncreateRoot(document.getElementById('root')).render(<React.StrictMode><Layout /></React.StrictMode>);\n`);
    zip.file('src/Layout.jsx',selectedLib==='muuri-react'?muuriGenerated:generated);
    zip.file('src/Layout.css',`.layout-page{min-height:100vh;background:#f5f3fa;padding:28px;font-family:Inter,system-ui,sans-serif;color:#211b2e}.layout-heading{margin:0 auto 22px;max-width:1200px}.layout-heading h1{margin:0 0 6px;font-size:24px}.layout-heading p{margin:0;color:#716a80;font-size:14px}.layout-grid-host{max-width:1200px;margin:0 auto}.layout-card{height:100%;padding:18px;border-radius:${radius}px;background:white;border:1px solid #e6e1ef;box-shadow:0 8px 24px #231b3510;overflow:hidden}.layout-card h2{font:600 18px system-ui;margin:16px 0 8px}.layout-card p{font:14px/1.5 system-ui;color:#716a80}.drag-handle{display:flex;align-items:center;gap:8px;color:#8c7ad0;font-size:12px;cursor:move;user-select:none}.layout-card.blue{border-top:3px solid #66b8e6}.layout-card.green{border-top:3px solid #5ac6a0}.layout-card.amber{border-top:3px solid #e7ae61}.layout-card.pink{border-top:3px solid #dc81c0}.react-grid-item{transition:all 180ms ease}.react-resizable-handle{opacity:.65}.muuri-grid{position:relative;max-width:1200px;margin:auto;min-height:400px}.muuri-item{position:absolute;display:block;width:calc(33.333% - 12px);margin:6px;z-index:1}.muuri-item-content{background:#fff;border:1px solid #e5dfef;border-radius:12px;padding:18px;min-height:145px;box-shadow:0 8px 24px #231b3510}.muuri-item-content h2{font-size:17px;margin:18px 0 7px}.muuri-item-content p{font-size:13px;color:#716a80}`);
    zip.file('README.md',`# JASS LayoutLab exported layout\n\nSelected layout pattern: ${pattern}\nSelected library: ${lib.name} (${selectedLib})\n\n## Run\n\n1. Install Node.js LTS.\n2. Run \`npm install\`.\n3. Run \`npm run dev\`.\n4. Run \`npm run build\` to verify a production build.\n\nReact Grid Layout exports use the native GridLayout component with drag and resize. Muuri React exports use MuuriComponent with native drag sorting and a working text filter. Other library selections are currently catalog selections only; their native adapters are not yet implemented.\n`);
    const blob=await zip.generateAsync({type:'blob'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download='JASS-LayoutLab-React-Export.zip';a.click();URL.revokeObjectURL(url);notify('React/Vite export downloaded');
  }
  return <div className="app-shell">
  {showDataExplorer && <DataExplorer onClose={() => setShowDataExplorer(false)} />}
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><PanelsTopLeft size={22}/></div><div><strong>JASS <span>LayoutLab</span></strong><small>STUDIO <b>v0.3.4</b></small></div></div>
      <div className="side-label">WORKSPACE</div><button className="nav active"><LayoutGrid size={17}/> Layout canvas <span className="nav-dot"/></button><button className="nav" onClick={()=>setShowDataExplorer(true)}><HardDrive size={17}/> Data Explorer</button>
      <button className="nav" onClick={()=>setShowCode(!showCode)}><Code2 size={17}/> Code preview</button><button className="nav" onClick={savePreset}><Save size={17}/> Saved layouts</button>
      <div className="side-label library-heading"><span>LAYOUT LIBRARIES</span><span className="count">{libraryItems.length}</span></div>
      <div className="library-search"><Search size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a library..."/></div>
      <div className="library-list">{visibleLibraries.map(item=><button key={item.id} className={'library-item '+(selectedLib===item.id?'chosen':'')} onClick={()=>{setSelectedLib(item.id);notify(`${item.name} selected`)}}><span className="lib-mark">{item.name.slice(0,1)}</span><span className="lib-copy"><b>{item.name}</b><small>{item.kind}</small></span>{selectedLib===item.id&&<Check size={14} className="lib-check"/>}</button>)}</div>
      <div className="sidebar-bottom"><div className="status-line"><span className="green-dot"/> Workspace ready</div><div className="profile"><div className="avatar">J</div><div><b>JASS Digital Lab</b><small>Local workspace</small></div><CircleHelp size={16}/></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>Layout canvas</b> <ChevronDown size={14}/></div><div className="top-actions"><span className="save-state"><span className="green-dot"/> {preset==='Saved locally'?'Saved locally':'All changes local'}</span><button className="btn secondary" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="btn primary" onClick={exportProject}><Download size={15}/> Export React project</button></div></header>
      <section className="page-heading"><div><div className="eyebrow"><Sparkles size={13}/> VISUAL LAYOUT WORKBENCH</div><h1>Build layouts. <span>See them adapt.</span></h1><p>Explore React layout approaches, tune the canvas, and export a starter project.</p></div><button className="btn secondary preset-btn" onClick={savePreset}><Save size={15}/> Save preset</button></section>
      <section className="toolbar"><div className="tool-left"><div className="select-wrap"><Layers size={15}/><select value={pattern} onChange={e=>setPattern(e.target.value)}><option value="responsive">Responsive grid</option><option value="masonry">Masonry wall</option><option value="split">Split workspace</option><option value="tiles">Tiled dashboard</option></select><ChevronDown size={14}/></div><div className="toolbar-sep"/><span className="library-pill">Using <b>{lib.name}</b></span><a className="external-link" href={lib.url} target="_blank" rel="noreferrer" title="Open library repository"><ExternalLink size={14}/></a></div><div className="device-tools"><button title="Desktop preview" className={device==='desktop'?'device active':'device'} onClick={()=>setDevice('desktop')}><Monitor size={16}/></button><button title="Tablet preview" className={device==='tablet'?'device active':'device'} onClick={()=>setDevice('tablet')}><Tablet size={16}/></button><button title="Mobile preview" className={device==='mobile'?'device active':'device'} onClick={()=>setDevice('mobile')}><Smartphone size={16}/></button><span className="viewport-label">{device==='desktop'?'1440 px':device==='tablet'?'820 px':'390 px'}</span></div></section>
      <div className="work-area"><section className="canvas-wrap"><div className="canvas-topline"><div><span className="canvas-live"/> <b>Live canvas</b><span className="muted">· {tiles.length} panels</span></div><div className="canvas-tools"><button title="Add panel" onClick={addTile}><Plus size={15}/> Add panel</button><button title="Canvas settings" onClick={()=>document.getElementById('inspector')?.scrollIntoView({behavior:'smooth'})}><SlidersHorizontal size={15}/></button></div></div>
        {showCode?<div className="code-view"><div className="code-head"><FileCode2 size={16}/> Layout.jsx <button onClick={()=>setShowCode(false)}><X size={15}/></button></div><pre>{selectedLib==='muuri-react'?muuriGenerated:generated}</pre><button className="btn secondary" onClick={()=>{navigator.clipboard?.writeText(selectedLib==='muuri-react'?muuriGenerated:generated);notify('JSX copied if clipboard permission is available')}}>Copy JSX</button></div>:<div className={'canvas-viewport '+device}>{selectedLib==='muuri-react' ? <div className="muuri-preview" style={{'--gap':`${gap}px`,'--radius':`${radius}px`}}><MuuriComponent dragEnabled dragSort={true} layoutDuration={250} gridProps={{className:'muuri-preview-grid'}}>{tiles.map(tile=><div key={String(tile.id)} className="muuri-preview-item" style={{width:`calc(${100/columns}% - ${gap}px)`,margin:`${gap/2}px`}}><article onClick={()=>setSelected(tile.id)} className={`panel-card ${tile.size} ${tile.color} ${selected===tile.id?'selected':''}`} style={{borderRadius:radius}}><div className="panel-card-head"><span className="panel-icon">{iconFor[tile.icon]||'▧'}</span><span className="panel-type">{tile.type}</span><button className="grip-btn" title="Drag tile"><Grip size={15}/></button></div><h3>{tile.title}</h3><p>{tile.detail}</p><div className="panel-card-foot"><span className="tiny-status"/> Sortable tile <span className="panel-id">LL-{String(tile.id).padStart(3,'0')}</span></div></article></div>)}</MuuriComponent></div> : selectedLib==='react-grid-layout' && pattern!=='masonry' && pattern!=='split' ? <div className="native-grid-host" ref={gridContainerRef} style={{'--gap':`${gap}px`,'--radius':`${radius}px`}}>{gridMounted&&<GridLayout width={gridWidth} layout={rglLayout.map(item=>({...item,w:device==='mobile'?12:item.w,x:device==='mobile'?0:item.x}))} onLayoutChange={setRglLayout} gridConfig={{cols:device==='mobile'?12:12,rowHeight:25,margin:[gap,gap],containerPadding:[0,0]}} dragConfig={{enabled:true,handle:'.grip-btn'}} resizeConfig={{enabled:true}}>{tiles.map(tile=><article key={String(tile.id)} onClick={()=>setSelected(tile.id)} className={`panel-card ${tile.size} ${tile.color} ${selected===tile.id?'selected':''}`} style={{borderRadius:radius,height:'100%'}}><div className="panel-card-head"><span className="panel-icon">{iconFor[tile.icon]||'▧'}</span><span className="panel-type">{tile.type}</span><button className="grip-btn" title="Drag panel"><Grip size={15}/></button></div><h3>{tile.title}</h3><p>{tile.detail}</p><div className="panel-card-foot"><span className="tiny-status"/> Ready <span className="panel-id">LL-{String(tile.id).padStart(3,'0')}</span></div>{selected===tile.id&&<span className="selection-tag"><Move size={11}/> Selected</span>}</article>)}</GridLayout>}</div> : <div className={'canvas-grid pattern-'+pattern} style={{'--columns':columns,'--gap':`${gap}px`,'--radius':`${radius}px`}}>{tiles.map(tile=><article key={tile.id} onClick={()=>setSelected(tile.id)} className={`panel-card ${tile.size} ${tile.color} ${selected===tile.id?'selected':''}`} style={{borderRadius:radius}}><div className="panel-card-head"><span className="panel-icon">{iconFor[tile.icon]||'▧'}</span><span className="panel-type">{tile.type}</span><button className="grip-btn" title="Select panel"><Grip size={15}/></button></div><h3>{tile.title}</h3><p>{tile.detail}</p><div className="panel-card-foot"><span className="tiny-status"/> Ready <span className="panel-id">LL-{String(tile.id).padStart(3,'0')}</span></div>{selected===tile.id&&<span className="selection-tag"><Move size={11}/> Selected</span>}</article>)}</div>}</div>}
        <div className="canvas-footer"><span><Move size={13}/> Select a panel to edit its properties</span><span><Maximize2 size={13}/> {device==='desktop'?'Canvas fit to workspace':`Preview: ${device}`}</span></div>
      </section>
      <aside className="inspector" id="inspector"><div className="inspector-title"><div><SlidersHorizontal size={17}/><b>Inspector</b></div><span className="inspector-dots">•••</span></div><div className="inspector-section"><div className="section-title">SELECTED PANEL <span>{String(selectedTile.id).padStart(2,'0')}</span></div><label>Panel title</label><input className="text-field" value={selectedTile.title} onChange={e=>updateTile('title',e.target.value)}/><label>Category</label><input className="text-field" value={selectedTile.type} onChange={e=>updateTile('type',e.target.value)}/><label>Description</label><textarea className="text-field textarea" value={selectedTile.detail} onChange={e=>updateTile('detail',e.target.value)}/><label>Panel size</label><div className="size-options">{['small','medium','large','wide'].map(s=><button key={s} className={selectedTile.size===s?'picked':''} onClick={()=>updateTile('size',s)}>{s[0].toUpperCase()+s.slice(1)}</button>)}</div><label>Accent color</label><div className="color-options">{['violet','blue','green','amber','pink'].map(c=><button aria-label={c} key={c} className={`swatch ${c} ${selectedTile.color===c?'picked':''}`} onClick={()=>updateTile('color',c)}>{selectedTile.color===c&&<Check size={13}/>}</button>)}</div></div>
      <div className="inspector-section"><div className="section-title">CANVAS LAYOUT</div><div className="range-label"><label>Columns</label><b>{columns}</b></div><input type="range" min="1" max="5" value={columns} onChange={e=>setColumns(+e.target.value)}/><div className="range-label"><label>Gap</label><b>{gap}px</b></div><input type="range" min="6" max="32" step="2" value={gap} onChange={e=>setGap(+e.target.value)}/><div className="range-label"><label>Corner radius</label><b>{radius}px</b></div><input type="range" min="0" max="28" step="2" value={radius} onChange={e=>setRadius(+e.target.value)}/></div>
      <div className="inspector-section library-info"><div className="section-title">LIBRARY DETAILS</div><div className="lib-detail-name"><span className="lib-mark large-mark">{lib.name.slice(0,1)}</span><div><b>{lib.name}</b><small>{lib.kind}</small></div></div><p>{lib.desc}</p><span className={'adapter-status '+(lib.status==='Export adapter ready'?'ready':'planned')}>{lib.status}</span><a href={lib.url} target="_blank" rel="noreferrer">Repository documentation <ExternalLink size={12}/></a></div>
      <div className="inspector-bottom"><span className="green-dot"/> Changes update the canvas instantly</div></aside></div>
      <footer className="app-footer"><span>JASS LayoutLab Studio <b>v0.3.4</b></span><span>React + Vite + Electron <i/> Local-first workspace</span><span>Native adapters are added and verified incrementally.</span></footer>
    </main>{toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}

ReactDOM.render(<React.StrictMode><App/></React.StrictMode>, document.getElementById('root'));


