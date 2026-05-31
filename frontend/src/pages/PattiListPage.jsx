import { useState, useEffect } from 'react';
import { fetchPatti } from '../api';

const DEFAULT_PATTI = {
  headers: ['1','2','3','4','5','6','7','8','9','0'],
  rows: [
    ['100','200','300','400','500','600','700','800','900','000'],
    ['678','345','120','789','456','123','890','567','234','127'],
    ['777','444','111','888','555','222','999','666','333','190'],
    ['560','570','580','590','140','150','160','170','180','280'],
    ['470','480','490','130','230','330','340','350','360','370'],
    ['380','390','670','680','690','240','250','260','270','460'],
    ['290','660','238','248','258','268','278','288','450','550'],
    ['119','129','139','149','159','169','179','189','199','235'],
    ['137','237','337','347','357','367','377','116','117','118'],
    ['23','33','15','15','79','44','46','23','46','57'],
  ]
};

export default function PattiListPage() {
  const [patti, setPatti] = useState(DEFAULT_PATTI);

  useEffect(() => {
    fetchPatti().then(data => {
      if (data && data.headers) setPatti(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-lg mx-auto px-3 pb-8">
      <div className="glass-card rounded-xl p-4 my-4 text-center">
        <h2 className="font-display text-2xl font-black gold-gradient mb-1">Patti List</h2>
        <p className="text-amber-600 text-sm font-body">Today Live Result · Bongo Laki Tips · Old &amp; New Charts · bongolaki.cc</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-amber-700/40" style={{ boxShadow: '0 0 20px rgba(255,193,7,0.1)' }}>
        <div className="patti-header text-center py-3">
          <span className="font-display text-lg font-bold text-amber-900">Bongo Laki Patti List</span>
        </div>
        <div className="grid grid-cols-10">
          {patti.headers.map((h, i) => (
            <div key={i} className="patti-cell-dark text-center py-2 font-display font-black text-sm border-r border-amber-900/30 last:border-r-0">{h}</div>
          ))}
        </div>
        {patti.rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-10 border-t border-amber-900/30">
            {row.map((cell, colIdx) => (
              <div key={colIdx} className={`text-center py-2 font-body font-bold text-xs border-r border-amber-900/20 last:border-r-0 leading-tight
                ${rowIdx % 2 === 0 ? 'patti-cell-light' : 'patti-cell-dark'}`}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-900/10 border border-amber-900/30 text-center">
        <p className="text-amber-600 text-xs font-body">Complete Patti List · bongolaki.cc</p>
      </div>
    </div>
  );
}
