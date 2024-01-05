import { AppStateEnum } from "../model/GameModel";
import { GameModelHelper } from "../model/GameModelHelper";

export class FSMState { }

export class NONE extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.NONE);
    }
}

export class START_SCREEN_FIRST extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN_FIRST);
    }
}

export class START_SCREEN_NOVICE extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN_NOVICE);
    }
}

export class START_SCREEN extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN);
    }
}

export class GAME_SCREEN extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
    }
}

export class GAME_SCREEN_PAUSE extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
    }
}

export class GAME_VICTORY extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
    }
}

export class GAME_NO_MORE_MOVES extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
    }
}

export class GAME_NO_MORE_MOVES_ADS extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES_ADS);
    }
}

export class GAME_NO_MORE_MOVES_CHOOSING extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES_CHOOSING);
    }
}

export class GAME_DEFEATED extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATED);
    }
}

export class GAME_DEFEATED_ADS extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATED_ADS);
    }
}

export class GAME_DEFEATED_CHOOSING extends FSMState {
    constructor() {
        super();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATED_CHOOSING);
    }
}