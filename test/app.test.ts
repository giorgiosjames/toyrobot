import { ToyRobot } from '../src/app';

// unit testing
let toyRobot: ToyRobot;

// re initialise our toyrobot instance before each test
beforeEach(() => {
    toyRobot = new ToyRobot();
});

describe('Example Section', () => {

    test('Example Test', () => {
        expect(1 + 1).toEqual(2);
    });

});
