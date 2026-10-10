import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, HardDrive, Folder, File, RefreshCw, Search, X, Info, AlertCircle } from 'lucide-react';

const panel = {
  position: 'fixed', inset: 0, zIndex: 9999, background: '#111018',
  color: '#eceaf5', display: 'flex', flexDirection: 'column',
  fontFamily: 'Inter, Segoe UI, sans-serif', fontSize: 13
};
const button = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 12px',
  borderRadius: 8, border: '1px solid #393548', background: '#201d2b',
  color: '#e9e5f5', cursor: 'pointer', fontSize: 12
};
const muted = { color: '#a6a0b8' };

function prettySize(bytes) {
  if (bytes == null) return 'Unavailable';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = bytes / 1024, index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(size < 10 ? 1 : 0)} ${units[index]}`;
}

export default function DataExplorer({ onClose }) {
  const api = window.jassData;
  const [drives, setDrives] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refreshDrives() {
    if (!api?.getDrives) {
      setError('Filesystem bridge is unavailable. Close and restart the desktop app.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await api.getDrives();
      setDrives(result);
      setNotice(`${result.length} accessible drive root(s) found.`);
    } catch (e) {
      setError(e?.message || 'Could not detect drives.');
    } finally {
      setLoading(false);
    }
  }

  async function openDirectory(directoryPath) {
    if (!directoryPath) return;
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const result = await api.listDirectory(directoryPath);
      setCurrentPath(directoryPath);
      setEntries(result);
      setSelected(null);
      setQuery('');
    } catch (e) {
      setError(e?.message || 'Could not read this folder.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshDrives(); }, []);

  const visibleEntries = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return entries;
    return entries.filter(item => item.name.toLocaleLowerCase().includes(q));
  }, [entries, query]);

  function goUp() {
    if (!currentPath) return;
    const normalized = currentPath.replace(/[\\/]+$/, '');
    const root = /^[A-Za-z]:$/.test(normalized)
      || normalized === '';
    if (root) {
      setCurrentPath('');
      setEntries([]);
      setSelected(null);
      return;
    }
    const parent = normalized.replace(/[\\/][^\\/]*$/, '');
    if (parent && parent !== normalized) openDirectory(parent);
  }

  return (
    <div style={panel}>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid #302b3d',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{background:'#302344',borderRadius:10,padding:10,color:'#c6a7ff'}}><HardDrive size={21}/></div>
          <div>
            <div style={{fontSize:18,fontWeight:700}}>Data Explorer</div>
            <div style={{...muted,marginTop:4}}>Browse and inspect local and external storage</div>
          </div>
        </div>
        <button style={button} onClick={onClose}><X size={16}/> Back to LayoutLab</button>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'240px minmax(0,1fr) 260px',flex:1,minHeight:0}}>
        <aside style={{borderRight:'1px solid #302b3d',padding:16,overflowY:'auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <strong>DRIVES</strong>
            <button style={{...button,padding:7}} title="Refresh drives" onClick={refreshDrives}><RefreshCw size={14}/></button>
          </div>
          {drives.map(drive => (
            <button key={drive.path} onClick={() => openDirectory(drive.path)}
              style={{...button,width:'100%',marginBottom:8,justifyContent:'flex-start',background:currentPath.toLowerCase()===drive.path.toLowerCase()?'#38294e':'#201d2b',borderColor:currentPath.toLowerCase()===drive.path.toLowerCase()?'#8d64c7':'#393548'}}>
              <HardDrive size={16}/><span style={{textAlign:'left',overflowWrap:'anywhere'}}>{drive.name}<small style={{display:'block',...muted,marginTop:3}}>{drive.path}</small></span>
            </button>
          ))}
          {!drives.length && !loading && <p style={muted}>No accessible drives found.</p>}
          <div style={{...muted,fontSize:11,marginTop:16,lineHeight:1.6}}>Drive availability depends on Windows permissions and whether the disk is connected.</div>
        </aside>

        <section style={{display:'flex',flexDirection:'column',minWidth:0,minHeight:0}}>
          <div style={{padding:16,borderBottom:'1px solid #302b3d',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
            <button style={button} disabled={!currentPath || loading} onClick={goUp}><ArrowLeft size={15}/> Up</button>
            <div style={{flex:1,minWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',...muted}} title={currentPath}>{currentPath || 'Select a drive to begin'}</div>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#201d2b',border:'1px solid #393548',borderRadius:8,padding:'8px 10px',minWidth:180}}>
              <Search size={15} style={muted}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter this folder..." style={{background:'transparent',border:0,outline:0,color:'#eceaf5',width:'100%',minWidth:0}}/>
            </div>
          </div>

          {error && <div style={{margin:14,padding:12,border:'1px solid #74444b',background:'#321e27',borderRadius:8,display:'flex',gap:8,alignItems:'center'}}><AlertCircle size={17}/>{error}</div>}
          {notice && <div style={{padding:'8px 16px',...muted}}>{notice}</div>}

          <div style={{display:'grid',gridTemplateColumns:'minmax(160px,1fr) 100px 155px',gap:12,padding:'12px 18px',borderBottom:'1px solid #302b3d',...muted,fontSize:11,textTransform:'uppercase',letterSpacing:'.06em'}}>
            <span>Name</span><span style={{textAlign:'right'}}>Size</span><span>Modified</span>
          </div>
          <div style={{overflowY:'auto',flex:1}}>
            {visibleEntries.map(entry => (
              <div key={entry.path} onClick={()=>setSelected(entry)}
                onDoubleClick={()=>entry.isDirectory && !entry.isSymbolicLink && openDirectory(entry.path)}
                style={{display:'grid',gridTemplateColumns:'minmax(160px,1fr) 100px 155px',gap:12,alignItems:'center',padding:'12px 18px',borderBottom:'1px solid #252130',background:selected?.path===entry.path?'#302641':'transparent',cursor:'pointer'}}>
                <div style={{display:'flex',alignItems:'center',gap:9,minWidth:0}}>
                  {entry.isDirectory ? <Folder size={17} color="#c7a0ff" style={{flexShrink:0}}/> : <File size={17} color="#aaa3bc" style={{flexShrink:0}}/>}
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={entry.name}>{entry.name}</span>
                  {entry.isSymbolicLink && <span style={{...muted,fontSize:10}}>LINK</span>}
                </div>
                <span style={{textAlign:'right',...muted}}>{entry.isDirectory?'—':prettySize(entry.size)}</span>
                <span style={{...muted,fontSize:11}}>{entry.modified ? new Date(entry.modified).toLocaleString() : '—'}</span>
              </div>
            ))}
            {!loading && currentPath && visibleEntries.length===0 && <div style={{padding:32,textAlign:'center',...muted}}>{entries.length ? 'No matching items.' : 'This folder is empty.'}</div>}
            {!currentPath && !loading && <div style={{padding:36,textAlign:'center',...muted}}><HardDrive size={28}/><p>Select a drive on the left to browse its folders.</p></div>}
            {loading && <div style={{padding:24,textAlign:'center',...muted}}>Loading…</div>}
          </div>
          <footer style={{padding:'10px 18px',borderTop:'1px solid #302b3d',...muted}}>{visibleEntries.length} item(s) {query ? 'matching filter' : 'in this view'} · Double-click a folder to open it</footer>
        </section>

        <aside style={{borderLeft:'1px solid #302b3d',padding:18,overflowY:'auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}><Info size={17} color="#c6a7ff"/><strong>ITEM DETAILS</strong></div>
          {!selected ? <p style={muted}>Select a file or folder to inspect its metadata.</p> : <>
            <div style={{background:'#201d2b',borderRadius:10,padding:14,marginBottom:16,overflowWrap:'anywhere'}}>{selected.isDirectory?<Folder size={25} color="#c7a0ff"/>:<File size={25}/>}<div style={{fontWeight:650,marginTop:10}}>{selected.name}</div></div>
            {[
              ['Type',selected.isDirectory?'Folder':(selected.name.includes('.')?selected.name.split('.').pop().toUpperCase()+' file':'File')],
              ['Size',selected.isDirectory?'—':prettySize(selected.size)],
              ['Modified',selected.modified?new Date(selected.modified).toLocaleString():'Unavailable'],
              ['Path',selected.path],
              ['Symbolic link',selected.isSymbolicLink?'Yes':'No']
            ].map(([label,value])=><div key={label} style={{marginBottom:15}}><div style={{...muted,fontSize:11,marginBottom:5}}>{label}</div><div style={{overflowWrap:'anywhere',lineHeight:1.5}}>{value}</div></div>)}
            {selected.isDirectory && !selected.isSymbolicLink && <button style={{...button,width:'100%',justifyContent:'center'}} onClick={()=>openDirectory(selected.path)}>Open folder</button>}
          </>}
          <div style={{marginTop:24,padding:12,border:'1px solid #393548',borderRadius:9,...muted,lineHeight:1.6}}>Read-only milestone: this workspace does not yet copy, move, rename, or delete files.</div>
        </aside>
      </div>
    </div>
  );
}
