'use strict';

gameApp.service("KeyPressHandler", function() {
    var KeyPressEnum = {
        DownUnprocessed: 0,
        DownProcessed: 1,
        Up: 2
    };

    /*
    Originally tried to rely on the KeyDown event however there is always a delay between the first keyDown and subsequent keyDown events, so instead we monitor
    both keyDown and keyUp.  If a keyDown occurs then we check (from end to beginning) if we already have a keyDown for that key in our buffer.  If we do then
    no need to add another.  Otherwise we add it.
    If a keyUp occurs then we check if we have a keyDown in our buffer (from end to beginning) .  If we do and it is not the first key in the buffer
    (and thus has never been processed then we can throw away that keyDown and do nothing with the keyUp.  If however the only keyDown event is the first key
    in our buffer then we need to check if that key has been processed (i.e. has it resulted in an attempted character move). If it has then we can throw
    that keyDown away as it has now been dealt with - however if it has not been processed then we can not throw it away just yet as we will want to at least
    move once with that keyDown.  Therefore we update the entry to have a 'keyPressType' of 'Up' so we know to remove it when it is next processed.

    When the gameEngine requests the next movement details we simply look at the first key in the buffer - this is what is returned.  However, if it is not
    marked as processed then we mark it as processed - and if it is marked as 'up' then we remove it ready to process the next entry when it is called next time

    Separate to this we monitor the fire key (keyDown and keyUp) just to see if the player is trying to fire at the same time.
     */

    function KeyPressDetails(direction) {
        this.direction = direction;
        this.keyPressType = KeyPressEnum.DownUnprocessed;
    };

    return {
        keyPress: function(keyCode) {
            if (isFireKey(keyCode)) {
                this.isFiring = true;
                return;
            }

            var direction = processKeyCode(keyCode);
            if (direction == DirectionEnum.None) {
                return;
            }

            if (!this.keyPressList) {
                this.keyPressList = [];
            }

            if (this.keyPressList.length) {
                for (var i = this.keyPressList.length - 1; i >= 0; i--) {
                    if (this.keyPressList[i].direction === direction) {
                        if (this.keyPressList[i].keyPressType === KeyPressEnum.Up) {
                            // Previous key entry was an 'up' so we will add a new entry to the end of the list so it is ordered correctly
                            this.keyPressList.push(new KeyPressDetails(direction));
                        }

                        return;
                    }
                }
            }

            this.keyPressList.push(new KeyPressDetails(direction));
        },

        keyRelease: function(keyCode) {
            if (isFireKey(keyCode)) {
                this.isFiring = false;
                return;
            }

            var direction = processKeyCode(keyCode);
            if (direction == DirectionEnum.None) {
                return;
            }

            for (var i = this.keyPressList.length - 1; i >= 0; i--) {
                if (this.keyPressList[i].direction === direction) {
                    if (this.keyPressList[i].keyPressType !== KeyPressEnum.DownUnprocessed || i != 0) {
                        this.keyPressList.splice(i, 1);
                    } else{
                        this.keyPressList[i].keyPressType = KeyPressEnum.Up;
                    }

                    break;
                }
            }
        },

        getNextMovement: function() {
            var direction = DirectionEnum.None;

            if (this.keyPressList && this.keyPressList.length) {
                direction = this.keyPressList[0].direction;

                switch (this.keyPressList[0].keyPressType) {
                    case KeyPressEnum.DownUnprocessed:
                        this.keyPressList[0].keyPressType = KeyPressEnum.DownProcessed;
                        break;

                    case KeyPressEnum.Up:
                        this.keyPressList.splice(0, 1);
                        break;
                }
            }

            if (typeof this.isFiring == 'undefined') {
                this.isFiring = false;
            }

            return { direction: direction, isFiring: this.isFiring };
        }
    };

    function processKeyCode(keyCode) {
        switch (keyCode) {
            case 37: //left
                return DirectionEnum.Left;

            case 38: //up
                return DirectionEnum.Up;

            case 39: //right
                return DirectionEnum.Right;

            case 40: //down
                return DirectionEnum.Down;

            default:
                return DirectionEnum.None;
        }
    }

    function isFireKey(keyCode) {
        return keyCode == 32;  // space bar
    }

});