import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface GwStatusState {
  displayText: string;
  isLive: boolean;
  gwNumber: number | null;
  loading: boolean;
}

export function useGwStatus(): GwStatusState {
  const [state, setState] = useState<GwStatusState>({
    displayText: 'LOADING...',
    isLive: false,
    gwNumber: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchGwStatus() {
      try {
        // Query active GW (is_current = true)
        const { data: currentRows } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, is_current, finished')
          .eq('is_current', true)
          .limit(1);

        const current = currentRows?.[0];
        const isCurrentActive = current
          ? current.is_current === true && current.finished === false
          : false;

        if (isCurrentActive && current) {
          setState({
            displayText: `Live Now - GW${current.gw_number}`,
            isLive: true,
            gwNumber: current.gw_number,
            loading: false,
          });
        } else {
          // If no active GW, fetch next GW (is_next = true)
          const { data: nextRows } = await supabase
            .from('fpl_gameweeks')
            .select('gw_number')
            .eq('is_next', true)
            .limit(1);

          const nextGw = nextRows?.[0]?.gw_number ?? (current?.gw_number ? current.gw_number + 1 : 1);

          setState({
            displayText: `Waiting - GW${nextGw}`,
            isLive: false,
            gwNumber: nextGw,
            loading: false,
          });
        }
      } catch (err) {
        console.error('[useGwStatus] Error:', err);
        setState({
          displayText: 'GW STATUS - N/A',
          isLive: false,
          gwNumber: null,
          loading: false,
        });
      }
    }

    fetchGwStatus();
  }, []);

  return state;
}
