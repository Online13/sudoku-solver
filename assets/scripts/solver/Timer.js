/**
 * Permet de gerer le chronometre
 * @property {number} begin le debut d'un chronometre
 * @property {number} end la fin
 */
class Timer {
	constructor() {
		this.begin = 0;
		this.end = 0;
	}

	/**
	 * Recuperer le timestamp courant
	 * @return {number}
	 */
	static time() {
		return (new Date()).getTime();
	}
	/**
	 * Commencer a chronometrer
	 */
	start() {
		this.begin = Timer.time();
	}
	/**
	 * Arret du chronometre
	 */
	stop() {
		this.end = Timer.time();
	}
	/**
	 * Remet le chronometre a zero
	 */
	reset() {
		this.begin = this.end = 0;
	}
	/**
	 * Recupere la duree
	 * @returns {number} duree 
	 */
	get duration() {
		return (this.end - this.begin);
	}
}

export default Timer;