// imports

// node readline lib for taking user input 
import * as readline from 'readline';

// supported command
type SupportedCommands = 'PLACE' | 'MOVE' | 'LEFT' | 'RIGHT' | 'REPORT';

// cardinal directions union
type CardinalDirection = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

// response Type
type Response = {
    success: boolean;
    message?: string;
}

// main robot class
export class ToyRobot {

    // table constraints
    tableHeight = 5;
    tableWidth = 5;

    // robot position
    xPosition: number;
    yPosition: number;
    facingDirection: CardinalDirection;

    // whether this robot has been successfully placed
    placed: boolean;

    // cardinal directions
    cardinalDirections: {[key in CardinalDirection]: string } = {
        NORTH: 'NORTH',
        EAST: 'EAST',
        SOUTH: 'SOUTH',
        WEST: 'WEST',
    };

    /**
     * Place a robot on the table as per provided positional and directional information
     * Gracefully handles a number of edge cases like unsupported directional values or placing the robot outside the bounds of the table
     * @param x - string representing integer of X Position of the robot to be placed
     * @param y - string representing integer of Y Position of the robot to be placed
     * @param f - string representing a cardinal direction for the robot to be facing
     * @returns Response containing a success boolean and message if applicable
     */
    place = (x: string, y: string, f: string) => ({ success: true });

    /**
    * move the robot one step in the direction it's facing
    * @returns Response containing a success boolean and message if applicable
    */
    move = () => ({ success: true });
    
    /**
    * turn the robot to the left
    * @returns Response containing a success boolean and message if applicable
    */
    left = () => ({ success: true });

    /**
    * turn the robot to the right
    * @returns Response containing a success boolean and message if applicable
    */
    right = () => ({ success: true });

    // return a string representing the robot's current position and direction
    report = () => ({ success: true });

    // a single reference for the robot's capabilites
    commands: {[key in SupportedCommands]: (...args: string[]) => Response } = {
        PLACE: this.place,
        MOVE: this.move,
        LEFT: this.left,
        RIGHT: this.right,
        REPORT: this.report
    };

    /**
     * Parse and execute a provided command on the current robot state
     * @param inputCommand - string representing a command for the robot to execute, comma delimited if there are arguements
     * @returns an output string if relevant, otherwise null
     */
    executeCommand = (inputCommand: string): Response => ({ success: true });

}

// main
// create toy robot instance
const toyRobot: ToyRobot = new ToyRobot();

// initialise readline loop
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// define main readline loop
const recursiveAsyncReadLine = () => {
    readlineInterface.question('Command: ', (command) => {
        
        // not required, but added for convenience
        if (command === 'EXIT') return readlineInterface.close();

        // run toyRobot executeCommand
        const output = toyRobot.executeCommand(command);

        // if there was output from the function, display it to the console
        if (output) console.log(output);

        // call this function recursivley to allow another command input
        return recursiveAsyncReadLine();
    });
};

// call main control loop
recursiveAsyncReadLine();