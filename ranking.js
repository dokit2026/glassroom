const KEY='glassroom.exhibition.ranking.v1';
export function readRecords(storage){try{const r=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(r)?r.filter(x=>typeof x.name==='string'&&Number.isFinite(x.ms)&&x.ms>=0).sort((a,b)=>a.ms-b.ms):[]}catch{return []}}
export function rankOf(records,ms){return 1+records.filter(r=>r.ms<ms).length}
export function formatTime(ms){let s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')+'.'+Math.floor(ms%1000/100)}
export function saveRecord(storage,records,name,ms){name=name.trim().slice(0,16);if(!name)throw Error('ニックネームを入力してください');if(!Number.isFinite(ms)||ms<0)throw Error('タイムを取得できませんでした');const entry={name,ms,date:new Date().toISOString()};const next=[...records,entry].sort((a,b)=>a.ms-b.ms);storage.setItem(KEY,JSON.stringify(next));return {records:next,entry,rank:rankOf(next,ms)}}
