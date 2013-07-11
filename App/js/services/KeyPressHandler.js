'use strict';

gameApp.service("KeyPressHandler", function() {
    var KeyPressEnum = {
        Down: 0,
        Up: 1
    };

    /*
    Originally tried to rely on the KeyDown event however there is always a delay between the first keyDown and subsequent keyDown events, so instead we monitor
    both keyDown and keyUp.  If a keyDown occurs then we check (from end to beginning) if we already have a keyDown for that key in our buffer.  If we do then
    no need to add another.  Otherwise we add it.
    If a keyUp occurs then we check if we have a keyDown in our buffer (from end to beginning) .  If we do and it is not the first key in the buffer
    (and thus has never been processed then we can throw away that keyDown and do nothing with the keyUp.  If however the only keyDown event is the first key
    in our buffer then we need to check if that key has been processed (i.e. has it resulted in an attempted character move). If it has then we can throw
    that keyDown away as it has now been dealt with - however if it has not been processed then we can not throw it away just yet as we will want to at least
    move once with that keyDown.  Therefore we add the keyUp event to the buffer.
    When the gameEngine requests the next movement details we simply look at the first key in the buffer - this is what is returned.  However, if it is not
    marked as processed then we mark it as processed - and we also check if there is a keyUp event in our queue.  If there is then that means we can throw away
    the keyDown and keyUp (as the user has now let go of the button) and therefore the next movement will be whatever is next in the buffer.
    Separate to this we monitor the fire key (keyDown and keyUp) just to see if the player is trying to fire at the same time.
     */

    function KeyPressDetails(direction, keyPressEnum) {
        this.keyPressType = keyPressEnum;
        this.direction = direction;
        this.processed = false;
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
                        if (this.keyPressList[i].keyPressType == KeyPressEnum.Up) {
                            this.keyPressList.push(new KeyPressDetails(direction, KeyPressEnum.Down));
                        }

                        return;
                    }
                }
            }

            this.keyPressList.push(new KeyPressDetails(direction, KeyPressEnum.Down));
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
                    if (this.keyPressList[i].processed || i != 0) {
                        this.keyPressList.splice(i, 1);
                    } else{
                        this.keyPressList.push(new KeyPressDetails(direction, KeyPressEnum.Up));
                    }

                    break;
                }
            }
        },

        getNextMovement: function() {
            var direction = DirectionEnum.None;

            if (this.keyPressList && this.keyPressList.length) {
                direction = this.keyPressList[0].direction;
                if (!this.keyPressList[0].processed) {
                    this.keyPressList[0].processed = true;
                    for (var i = 1; i < this.keyPressList.length; i++) {
                        if (this.keyPressList[i].direction == direction && this.keyPressList[i].keyPressType == KeyPressEnum.Up) {
                            this.keyPressList.splice(i, 1);
                            this.keyPressList.splice(0, 1);
                            break;
                        }
                    }
                }
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