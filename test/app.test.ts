import { ToyRobot } from '../src/app';

// unit testing
let toyRobot = new ToyRobot();

// re initialise our toyrobot instance before each test
beforeEach(() => {
    toyRobot = new ToyRobot();
});

describe('PLACE needs to be the first command used', () => {

    test('Using MOVE before PLACE should fail', () => {
        expect(toyRobot.executeCommand('MOVE').success).toEqual(false);
    });

    test('Using MOVE after PLACE should succeed', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        expect(toyRobot.executeCommand('MOVE').success).toEqual(true);
    });

    test('Using LEFT before PLACE should fail', () => {
        expect(toyRobot.executeCommand('LEFT').success).toEqual(false);
    });

    test('Using LEFT after PLACE should succeed', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        expect(toyRobot.executeCommand('LEFT').success).toEqual(true);
    });

    test('Using RIGHT before PLACE should fail', () => {
        expect(toyRobot.executeCommand('RIGHT').success).toEqual(false);
    });

    test('Using RIGHT after PLACE should succeed', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        expect(toyRobot.executeCommand('RIGHT').success).toEqual(true);
    });

    test('Using REPORT before PLACE should fail', () => {
        expect(toyRobot.executeCommand('REPORT').message).toEqual('ToyRobot must be placed first');
    });

    test('Using REPORT after PLACE should succeed', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: NORTH');
    });

});

describe('PLACE should only accept valid parameters of the form PLACE X,Y,F (int,int,direction)', () => {

    test('Using PLACE with valid parameters should succeed 1', () => {
        expect(toyRobot.executeCommand('PLACE 0,0,NORTH').success).toEqual(true);
    });

    test('Using PLACE with valid parameters should succeed 2', () => {
        expect(toyRobot.executeCommand('PLACE 1,1,EAST').success).toEqual(true);
    });

    test('Using PLACE with valid parameters should succeed 3', () => {
        expect(toyRobot.executeCommand('PLACE 2,2,SOUTH').success).toEqual(true);
    });

    test('Using PLACE with valid parameters should succeed 4', () => {
        expect(toyRobot.executeCommand('PLACE 3,3,WEST').success).toEqual(true);
    });

    test('Using PLACE with no parameters should fail', () => {
        expect(toyRobot.executeCommand('PLACE').success).toEqual(false);
    });

    test('Using PLACE with 1 parameter should fail', () => {
        expect(toyRobot.executeCommand('PLACE 0').success).toEqual(false);
    });

    test('Using PLACE with 2 parameters should fail', () => {
        expect(toyRobot.executeCommand('PLACE 0,0').success).toEqual(false);
    });

    test('Using PLACE with non-numeric X/Y parameters should fail', () => {
        expect(toyRobot.executeCommand('PLACE X,Y,NORTH').success).toEqual(false);
    });

    test('Using PLACE with an invalid direction parameter should fail', () => {
        expect(toyRobot.executeCommand('PLACE 0,0,WEAST').success).toEqual(false);
    });

    test('Using PLACE with negative positional parameters should fail', () => {
        expect(toyRobot.executeCommand('PLACE -1,-1,NORTH').success).toEqual(false);
    });

    test('Using PLACE with an positional parameters greater than the bounds of the table should fail', () => {
        expect(toyRobot.executeCommand('PLACE 10,10,NORTH').success).toEqual(false);
    });

});

describe('MOVE should move the robot to the correct position, based on the direction and table constraints', () => {

    test('MOVE when the robot is facing NORTH should increment Y by 1', () => {
        toyRobot.executeCommand('PLACE 2,2,NORTH');
        toyRobot.executeCommand('MOVE');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 2 | Y: 3 | F: NORTH');
    });

    test('MOVE when the robot is facing EAST should increment X by 1', () => {
        toyRobot.executeCommand('PLACE 2,2,EAST');
        toyRobot.executeCommand('MOVE');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 3 | Y: 2 | F: EAST');
    });

    test('MOVE when the robot is facing SOUTH should decrement Y by 1', () => {
        toyRobot.executeCommand('PLACE 2,2,SOUTH');
        toyRobot.executeCommand('MOVE');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 2 | Y: 1 | F: SOUTH');
    });

    test('MOVE when the robot is facing WEST should decrement X by 1', () => {
        toyRobot.executeCommand('PLACE 2,2,WEST');
        toyRobot.executeCommand('MOVE');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 1 | Y: 2 | F: WEST');
    });

    test('MOVE when the robot is facing NORTH and Y = 4 should fail', () => {
        toyRobot.executeCommand('PLACE 0,4,NORTH');
        expect(toyRobot.executeCommand('MOVE').success).toEqual(false);
    });

    test('MOVE when the robot is facing EAST and X = 4 should fail', () => {
        toyRobot.executeCommand('PLACE 4,0,EAST');
        expect(toyRobot.executeCommand('MOVE').success).toEqual(false);
    });

    test('MOVE when the robot is facing SOUTH and Y = 0 should fail', () => {
        toyRobot.executeCommand('PLACE 0,0,SOUTH');
        expect(toyRobot.executeCommand('MOVE').success).toEqual(false);
    });

    test('MOVE when the robot is facing WEST and X = 0 should fail', () => {
        toyRobot.executeCommand('PLACE 0,0,WEST');
        expect(toyRobot.executeCommand('MOVE').success).toEqual(false);
    });

});

describe('LEFT and RIGHT commands should turn the robot in the correct direction', () => {

    test('LEFT when the robot is facing NORTH should turn the robot to WEST', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        toyRobot.executeCommand('LEFT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: WEST');
    });

    test('LEFT when the robot is facing EAST should turn the robot to NORTH', () => {
        toyRobot.executeCommand('PLACE 0,0,EAST');
        toyRobot.executeCommand('LEFT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: NORTH');
    });

    test('LEFT when the robot is facing SOUTH should turn the robot to EAST', () => {
        toyRobot.executeCommand('PLACE 0,0,SOUTH');
        toyRobot.executeCommand('LEFT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: EAST');
    });

    test('LEFT when the robot is facing WEST should turn the robot to SOUTH', () => {
        toyRobot.executeCommand('PLACE 0,0,WEST');
        toyRobot.executeCommand('LEFT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: SOUTH');
    });

    test('RIGHT when the robot is facing NORTH should turn the robot to EAST', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        toyRobot.executeCommand('RIGHT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: EAST');
    });

    test('RIGHT when the robot is facing EAST should turn the robot to SOUTH', () => {
        toyRobot.executeCommand('PLACE 0,0,EAST');
        toyRobot.executeCommand('RIGHT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: SOUTH');
    });

    test('RIGHT when the robot is facing SOUTH should turn the robot to WEST', () => {
        toyRobot.executeCommand('PLACE 0,0,SOUTH');
        toyRobot.executeCommand('RIGHT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: WEST');
    });

    test('RIGHT when the robot is facing WEST should turn the robot to NORTH', () => {
        toyRobot.executeCommand('PLACE 0,0,WEST');
        toyRobot.executeCommand('RIGHT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: NORTH');
    });

});

describe('REPORT should correctly report the robot position and direction', () => {

    const cardinalDirections = Object.keys(toyRobot.cardinalDirections);
    const { tableWidth, tableHeight } = toyRobot;

    for (let x = 0; x < tableWidth; x++) {
        for (let y = 0; y < tableHeight; y++) {
            cardinalDirections.forEach(f => {
                
                test(`REPORT after command PLACE ${x},${y},${f} should return X: ${x} | Y: ${y} | F: ${f}`, () => {
                    toyRobot.executeCommand(`PLACE ${x},${y},${f}`);
                    expect(toyRobot.executeCommand('REPORT').message).toEqual(`X: ${x} | Y: ${y} | F: ${f}`);
                });

            });
        }
    }

});

describe('Additional Cases', () => {

    test('Using the PLACE command after the robot is already placed should correctly update the robot to the new position', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        toyRobot.executeCommand('PLACE 3,2,SOUTH');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 3 | Y: 2 | F: SOUTH');
    });

});

describe('The example cases should all work as specified', () => {

    test('Example Scenario A', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        toyRobot.executeCommand('MOVE');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 1 | F: NORTH');
    });

    test('Example Scenario B', () => {
        toyRobot.executeCommand('PLACE 0,0,NORTH');
        toyRobot.executeCommand('LEFT');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 0 | Y: 0 | F: WEST');
    });


    test('Example Scenario C', () => {
        toyRobot.executeCommand('PLACE 1,2,EAST');
        toyRobot.executeCommand('MOVE');
        toyRobot.executeCommand('MOVE');
        toyRobot.executeCommand('LEFT');
        toyRobot.executeCommand('MOVE');
        expect(toyRobot.executeCommand('REPORT').message).toEqual('X: 3 | Y: 3 | F: NORTH');
    });


});
