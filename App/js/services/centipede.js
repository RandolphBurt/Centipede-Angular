angular.module("gameApp")
    .factory("centipedeService", ["globalSettings", "graphicsEngineService", "gameBoardService", "characterDirection", "boardLocation", "sprite", "characterState", "coordinateSystem",
    function(globalSettings, graphicsEngineService, gameBoardService, characterDirection, boardLocation, sprite, characterState, coordinateSystem) {
        "use strict";

        var centipedes = [];

        var upBoundary = (globalSettings.gameBoardHeight - globalSettings.playerAreaHeight) + 1;
        var downBoundary = globalSettings.gameBoardHeight - 1;
        var leftBoundary = 0;
        var rightBoundary = globalSettings.gameBoardWidth - 1;

        var setPositionFromDirection = function(centipede) {
            centipede.prevX = centipede.x;
            centipede.prevY = centipede.y;

            switch (centipede.currentDirection) {
                case characterDirection.down:
                    centipede.y++;
                    break;
                case characterDirection.up:
                    centipede.y--;
                    break;
                case characterDirection.right:
                    centipede.x++;
                    break;
                case characterDirection.left:
                    centipede.x--;
                    break;
            }
        };

        var setSpeed = function(centipede) {
            centipede.dx = (centipede.x - centipede.prevX) / centipede.framesPerMove;
            centipede.dy = (centipede.y - centipede.prevY) / centipede.framesPerMove;
        };

        var setDirectionVertical = function(centipede) {
            if (centipede.previousDirection === characterDirection.down && centipede.y >= downBoundary) {
                centipede.currentDirection = characterDirection.up;
            } else if (centipede.previousDirection === characterDirection.up && centipede.y <= upBoundary) {
                centipede.currentDirection = characterDirection.down;
            } else {
                centipede.currentDirection = centipede.previousDirection;
            }
        };
        
        var moveCentipede = function(centipede, animation) {
            if ((animation + 1) % centipede.framesPerMove !== 0) {
                return;
            }

            var collisionType = gameBoardService.checkCollision(centipede.x, centipede.y, false);

            if (centipede.fallingStraightDown || collisionType === boardLocation.poisonMushroom) {
                if (centipede.y === downBoundary) {
                    centipede.fallingStraightDown = false;
                } else {
                    centipede.fallingStraightDown = true;
                    centipede.currentDirection = characterDirection.down;
                }
            }

            if (!centipede.fallingStraightDown) {
                if (centipede.currentDirection === characterDirection.right) {
                    if (centipede.x >= rightBoundary || collisionType === boardLocation.mushroom) {
                        setDirectionVertical(centipede);
                        centipede.previousDirection = characterDirection.right;
                    }
                } else if (centipede.currentDirection === characterDirection.left) {
                    if (centipede.x <= leftBoundary || collisionType == boardLocation.mushroom) {
                        setDirectionVertical(centipede);
                        centipede.previousDirection = characterDirection.left;
                    }
                } else {
                    var nowDirection = centipede.currentDirection;

                    if (centipede.previousDirection === characterDirection.right) {
                        centipede.currentDirection = characterDirection.left;
                    } else {
                        centipede.currentDirection = characterDirection.right;
                    }
                    centipede.previousDirection = nowDirection;

                    if (centipede.currentDirection === characterDirection.right && centipede.x >= rightBoundary) {
                        centipede.currentDirection = characterDirection.left;
                    } else if (centipede.currentDirection === characterDirection.left && centipede.x <= leftBoundary) {
                        centipede.currentDirection = characterDirection.right;
                    }
                }
            }

            setPositionFromDirection(centipede);

            var prevBodyX = centipede.prevX;
            var prevBodyY = centipede.prevY;
            for (var i = 0; i < centipede.body.length; i++) {
                var centipedeBody = centipede.body[i];
                centipedeBody.prevX = centipedeBody.x;
                centipedeBody.prevY = centipedeBody.y;
                centipedeBody.x = prevBodyX;
                centipedeBody.y = prevBodyY;
                setSpeed(centipedeBody);

                prevBodyX = centipedeBody.prevX;
                prevBodyY = centipedeBody.prevY;
            }

            setSpeed(centipede);
        };

        var renderImage = function(x, y, image) {
            graphicsEngineService.drawImage(coordinateSystem.world, x, y, image);
        };

        var createCentipede = function(x, y, bodyLength, framesPerMove, previousDirection, currentDirection, fallingStraightDown) {
            var centipede = {
                x: x,
                y: y,
                previousDirection: previousDirection,
                currentDirection: currentDirection,
                fallingStraightDown: fallingStraightDown,
                framesPerMove: framesPerMove,
                characterState: characterState.active,
                body: []
            };

            setPositionFromDirection(centipede);

            var xBody = centipede.x;
            var yBody = centipede.y;

            var yDiff = centipede.y - centipede.prevY;
            var xDiff = centipede.x - centipede.prevX;

            for (var i = 0; i < bodyLength; i++) {
                xBody -= xDiff;
                yBody -= yDiff;

                var body = {
                    prevX: xBody,
                    prevY: centipede.y,
                    x: xBody - xDiff,
                    y: yBody - yDiff,
                    framesPerMove: framesPerMove
                };

                setSpeed(body);

                centipede.body.push(body);
            }

            centipedes.push(centipede);

            return centipede;
        };

        return {
            create: function(x, y, bodyLength, framesPerMove, previousDirection, currentDirection, fallingStraightDown) {
                createCentipede(x, y, bodyLength, framesPerMove, previousDirection, currentDirection, fallingStraightDown);
            },

            destroy: function() {
                centipedes = [];
            },

            anyAlive: function() {
                return centipedes.length > 0;
            },

            isFirstCentipedeAtEndOfScreen: function() {
                if (centipedes.length > 0) {
                    var firstCentipede = centipedes[0];
                    if (firstCentipede.y === globalSettings.gameBoardHeight - 1 &&
                        (firstCentipede.x === globalSettings.gameBoardWidth - 1 || firstCentipede.x === 0)) {
                        return true;
                    }
                }
                return false;
            },

            isCentipedeAtPlayerTopBoundary: function() {
                for (var i = 0; i < centipedes.length; i++) {
                    var centipede = centipedes[i];
                    if (centipede.x === 0 && centipede.y === upBoundary) {
                        return true;
                    }
                }
                return false;
            },

            update: function(animation) {
                var aliveCentipedes = [];

                for (var i = 0; i < centipedes.length; i++) {
                    var centipede = centipedes[i];
                    if (centipede.characterState === characterState.active) {
                        aliveCentipedes.push(centipede);
                    }
                }

                centipedes = aliveCentipedes;

                for (var j = 0; j < centipedes.length; j++) {
                    moveCentipede(centipedes[j], animation);
                }
            },

            checkCollision: function(x, y, causeSplit) {
                var hit = false;
                for (var j = 0; j < centipedes.length; j++) {
                    var centipede = centipedes[j];

                    if (!causeSplit) {
                        if (centipede.x === x && centipede.y === y) {
                            hit = true;
                        }

                        if (!hit) {
                            for(var i = 0; i < centipede.body.length; i++) {
                                if (centipede.body[i].x === x && centipede.body[i].y === y) {
                                    hit = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        if (centipede.x === x && centipede.y === y) {
                            // we've hit the head of the centipede
                            if (centipede.body.length === 0) {
                                centipede.characterState = characterState.dead;
                            } else {
                                // make the first part of the body the head - and then remove that body part
                                centipede.x = centipede.body[0].x;
                                centipede.y = centipede.body[0].y;
                                centipede.body.splice(0, 1);
                            }
                            hit = true;

                        } else if (centipede.body.length > 0) {
                            if (centipede.body[centipede.body.length - 1].x === x && centipede.body[centipede.body.length - 1].y === y) {
                                // hit the end of the tail/body - so just remove that bit - no new centipede to create
                                centipede.body.pop();
                                hit = true;
                            } else {
                                for (var i = 0; i < centipede.body.length - 1; i++) {
                                    if (centipede.body[i].x === x && centipede.body[i].y === y) {
                                        // split centipede
                                        var newCentipede = createCentipede(
                                            centipede.body[i + 1].x,
                                            centipede.body[i + 1].y,
                                            0,
                                            centipede.framesPerMove,
                                            (centipede.currentDirection === characterDirection.down || centipede.currentDirection === characterDirection.up) ? centipede.previousDirection : centipede.currentDirection,
                                            characterDirection.down, centipede.fallingStraightDown);

                                        if (i < centipede.body.length - 2) {
                                            // transfer the body across to the new centipede
                                            newCentipede.body = centipede.body.splice(i + 2, centipede.body.length - (i + 2));
                                        }
                                        // finally remove the part of the centipede body that is the new head.
                                        centipede.body.pop();
                                        hit = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return hit;
            },

            draw: function(animation) {
                for (var i = 0; i < centipedes.length; i++) {
                    var centipede = centipedes[i];

                    if (centipede.characterState === characterState.dead) {
                        continue;
                    }

                    var destX = centipede.prevX + (((animation + 1) % centipede.framesPerMove) * centipede.dx);
                    var destY = centipede.prevY + (((animation + 1) % centipede.framesPerMove) * centipede.dy);

                    var image = sprite.centipedeHeadDown;

                    if (centipede.dx > 0) {
                        image = sprite.centipedeHeadRight;
                    } else if (centipede.dx < 0) {
                        image = sprite.centipedeHeadLeft;
                    } else if (centipede.dy < 0) {
                        image = sprite.centipedeHeadUp;
                    }

                    renderImage(destX, destY, image);

                    for (var j = 0; j < centipede.body.length; j++) {
                        var body = centipede.body[j];
                        var bodyDestX = body.prevX + (((animation + 1) % body.framesPerMove) * body.dx);
                        var bodyDestY = body.prevY + (((animation + 1) % body.framesPerMove) * body.dy);

                        image = sprite.centipedeBodyVertical1;

                        if (body.dx > 0) {
                            image = sprite.centipedeBodyRight1;
                        } else if (body.dx < 0) {
                            image = sprite.centipedeBodyLeft1;
                        }

                        image += animation;

                        renderImage(bodyDestX, bodyDestY, image);
                    }
                }
            }
        }
}]);