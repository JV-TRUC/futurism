(function() {
	'use strict';

	var _ = require('lodash');


	/**
	 * Keep track of who's turn it is
	 * mark players with active = true when it is their turn
	 * put a time limit on turn durations
	 * @param {array.<Player>} players
	 * @param {number} timePerTurn
	 * @param {function} callback
	 * @constructor
	 */
	var TurnTicker = function(players, timePerTurn, callback) {
		var self = this;
		var intervalId;
		var startTime;
		var turn = 0;
		var running = false;
		var turnOwners = [];


		/**
		 * Start turn progression
		 */
		self.start = function() {
			running = true;
			nextTurn();
		};


		/**
		 * Pause turn progression
		 */
		self.stop = function() {
			running = false;
		};


		/**
		 * Return how long this turn has lasted
		 * @returns {number}
		 */
		self.getElapsed = function() {
			return (+new Date()) - startTime;
		};


		/**
		 * Called when a turn is completed
		 */
		self.endTurn = function() {
			turnOwners = [];
			clearTimeout(intervalId);
			if(running) {
				if(callback) {
					callback(self.getElapsed());
				}
				nextTurn();
			}
		};


		/**
		 * Test if it is a players turn
		 * @param player
		 * @returns {boolean}
		 */
		self.isTheirTurn = function(player) {
			return (turnOwners.indexOf(player) !== -1);
		};


		/**
		 * Move a turn to the next player in line
		 */
		var nextTurn = function() {
			turn++;
			startTime = +new Date();
			fillTurnOwners();
			intervalId = setTimeout(self.endTurn, timePerTurn);
		};


		/**
		 * set active to true if it is a players turn
		 */
		var fillTurnOwners = function() {
			var index = turn % (players.length);
			var player = players[index];
			turnOwners = [player];
		};


		/**
		 * auto start for easiness
		 */
		self.start();
	};


	module.exports = TurnTicker;

}());