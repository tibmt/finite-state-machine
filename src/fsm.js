class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        if (this.config === undefined){
            throw Error();
        }
        this.state = this.config.initial;
        this.history = {
            stateUndo: [],
            stateRedo: [],
        };
    }
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
            return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state] === undefined){
            throw Error();
        }
        this.history.stateUndo.push(this.state);
        this.history.stateRedo = [];
        return this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let marker = false;
        for (let index in this.config.states[this.state].transitions) {
            if(index === event) {
                marker = true;
            }
        }
        if (!marker){
            throw Error();
        }
        this.history.stateUndo.push(this.state);
        this.history.stateRedo = [];
        this.state = this.config.states[this.state].transitions[event];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        return this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let Arr = [];
        if (!event){
            for(let state in this.config.states) {
                Arr.push(state);
            }
            return Arr;
        }
        for(let state in this.config.states) {
            for(let transition in this.config.states[state].transitions) {
                if (transition === event) {
                    Arr.push(state);
                }
            }
        }
        return Arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.stateUndo.length === 0) {
            return false;
        }
        let element = this.history.stateUndo.pop();
        this.history.stateRedo.push(this.state);
        this.state = element;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.history.stateRedo.length === 0) {
            return false;
        }
        let element = this.history.stateRedo.pop();
        this.history.stateUndo.push(this.state);
        this.state = element;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.state = this.config.initial;
        this.history.stateUndo = [];
        this.history.stateRedo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
