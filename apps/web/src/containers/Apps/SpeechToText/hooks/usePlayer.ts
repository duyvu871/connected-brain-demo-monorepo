import { useContext } from 'react';
import { PlayerContext } from '@/providers/speech-to-text/player-provider.tsx';

export const usePlayer = () => {
	const context = useContext(PlayerContext);
	if (!context) {
		throw new Error('usePlayer must be used within a PlayerContext');
	}
	return context;
};