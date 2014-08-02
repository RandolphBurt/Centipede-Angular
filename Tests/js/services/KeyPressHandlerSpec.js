describe('KeyPressHandler', function() {
    var keyPressHandler;
    var characterDirection;

    beforeEach(module('gameApp'));

    beforeEach(inject(function($injector) {
        keyPressHandler = $injector.get("keyPressHandlerService")
        characterDirection = $injector.get("characterDirection")
    }));

    describe('getNextMovement', function() {
        it('should return "no direction" if no keys ever pressed', function() {
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it('should return "no direction" if no movement keys pressed', function() {
            keyPressHandler.keyPress(123);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it('should return direction and then no direction if movement key quickly pressed and released before called getNextMovement', function() {
            // moving left
            keyPressHandler.keyPress(37);
            keyPressHandler.keyRelease(37);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.left, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it('should indicate fire once if fire key quickly pressed and released before calling getNextMovement', function() {
            keyPressHandler.keyPress(32);
            keyPressHandler.keyRelease(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: true} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );

        });

        it ('should continue to return movement until the key is released', function() {
            // moving down
            keyPressHandler.keyPress(40);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.down, isFiring: false} );
            keyPressHandler.keyRelease(40);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it ('should continue to return movement all the time the key is pressed', function() {
            // moving right (39)
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );
            keyPressHandler.keyRelease(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it ('should return firing information as well as movement information', function() {
            // moving up (38)
            keyPressHandler.keyPress(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up and firing
            keyPressHandler.keyPress(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );

            // moving up
            keyPressHandler.keyRelease(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up and firing
            keyPressHandler.keyPress(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );

            // just firing
            keyPressHandler.keyRelease(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: true} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: true} );

            // no movement or firing
            keyPressHandler.keyRelease(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it ('should return appropriate movement despite other keys being pressed', function() {
            // moving up (38)
            keyPressHandler.keyPress(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            keyPressHandler.keyPress(123);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up and firing
            keyPressHandler.keyPress(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );

            // just firing
            keyPressHandler.keyRelease(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: true} );
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: true} );

            // no movement or firing
            keyPressHandler.keyRelease(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );

            keyPressHandler.keyRelease(123);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it ('should ignore subsequent key presses that are released before initial release', function() {
            // moving up (38)
            keyPressHandler.keyPress(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up - ignore down (40)
            keyPressHandler.keyPress(40);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up - ignore down (40)
            keyPressHandler.keyRelease(40);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // no movement
            keyPressHandler.keyRelease(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

        it ('should use subsequent key presses that are released after initial release', function() {
            // moving up (38)
            keyPressHandler.keyPress(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up - ignore down (40)
            keyPressHandler.keyPress(40);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up and firing
            keyPressHandler.keyPress(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: true} );

            // moving up
            keyPressHandler.keyRelease(32);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up - ignore right (39)
            keyPressHandler.keyPress(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving up - ignore down (40)
            keyPressHandler.keyRelease(40);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.up, isFiring: false} );

            // moving right - up is released
            keyPressHandler.keyRelease(38);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.right, isFiring: false} );

            keyPressHandler.keyRelease(39);
            expect(keyPressHandler.getNextMovement()).toEqual( { direction: characterDirection.none, isFiring: false} );
        });

    });
});