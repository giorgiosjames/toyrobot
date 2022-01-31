// imports

// node readline lib for taking user input 
import * as readline from 'readline';

// type imports
import { SupportedCommands, CardinalDirection, CardinalDirectionConfig, Response } from './types';

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

    // cardinal directions definition
    // defines left/right/move mappings for all supported facing directions
    cardinalDirections: {[key in CardinalDirection]: CardinalDirectionConfig } = {
        NORTH: {
            leftDirection: 'WEST',
            rightDirection: 'EAST',
            moveFunction: (x: number, y: number) => [x, y + 1],
        },
        EAST: {
            leftDirection: 'NORTH',
            rightDirection: 'SOUTH',
            moveFunction: (x: number, y: number) => [x + 1, y],
        },
        SOUTH: {
            leftDirection: 'EAST',
            rightDirection: 'WEST',
            moveFunction: (x: number, y: number) => [x, y - 1],
        },
        WEST: {
            leftDirection: 'SOUTH',
            rightDirection: 'NORTH',
            moveFunction: (x: number, y: number) => [x - 1, y],
        },
    };

    // return true if provided position is within the bounds of the current table, false otherwise
    positionOnTable = (x: number, y: number) => x >= 0 && x < this.tableWidth && y >= 0 && y < this.tableHeight;

    /**
     * Place a robot on the table as per provided positional and directional information
     * Gracefully handles a number of edge cases like unsupported directional values or placing the robot outside the bounds of the table
     * @param x - string representing integer of X Position of the robot to be placed
     * @param y - string representing integer of Y Position of the robot to be placed
     * @param f - string representing a cardinal direction for the robot to be facing
     * @returns string | void, string if error, void otherwise
     */
    place = (x: string, y: string, f: string) => {

        // parse positional string to ints
        const xInt = parseInt(x, 10);
        const yInt = parseInt(y, 10);

        // check X, Y and F are all valid integers, otherwise, disallow command
        if ([xInt, yInt].some(val => isNaN(val))) return {
            success: false,
            message: 'Please pass 3 valid integer paramters to PLACE, like PLACE X Y F',
        }; 

        // check X/Y placement position vs tableheight/tablewidth to ensure the robot is on the table, otherwise, disallow command
        if (!this.positionOnTable(xInt, yInt)) return {
            success: false,
            message: 'PLACE failed: Provided positional values would have the robot placed off the table',
        };

        // check facing is a valid cardinal direction, otherwise, disallow command
        if (!Object.keys(this.cardinalDirections).includes(f)) return {
            success: false,
            message: 'Provided Facing Direction is not valid',
        };

        // inputs are valid, assign class variables, casting type for facingDirection as we've confirmed above that it is valid
        this.xPosition = xInt;
        this.yPosition = yInt;
        this.facingDirection = f as CardinalDirection;
        this.placed = true;

        return { success: true };
    };

    /**
    * move the robot one step in the direction it's facing
    * @returns string | void, string if error, void otherwise
    */
    move = () => {
        
        // get direction definition for the current facing direction
        const directionConfig = this.cardinalDirections[this.facingDirection];

        // get new X, Y values for the current direction
        const [newX, newY] = directionConfig.moveFunction(this.xPosition, this.yPosition);

        // check new positional values are valid on the current table
        if (!this.positionOnTable(newX, newY)) return {
            success: false,
            message: 'MOVE failed: This move would see the toy robot falling off the table',
        };

        // apply new move values
        this.xPosition = newX;
        this.yPosition = newY;

        return { success: true };
    };
    
    /**
    * turn the robot to the left, as defined in the cardinalDirections object
    * @returns string | void, string if error, void otherwise
    */
    left = () => {

        // get direction definition for the current facing direction
        const directionConfig = this.cardinalDirections[this.facingDirection];

        // get the new direction based on the config and the left turn
        const newDirection = directionConfig.leftDirection;

        // apply new facing value
        this.facingDirection = newDirection;

        return { success: true };
    };

    /**
    * turn the robot to the right, as defined in the cardinalDirections object
    * @returns string | void, string if error, void otherwise
    */
    right = () => {

        // get direction definition for the current facing direction
        const directionConfig = this.cardinalDirections[this.facingDirection];

        // get the new direction based on the config and the left turn
        const newDirection = directionConfig.rightDirection;

        // apply new facing value
        this.facingDirection = newDirection;

        return { success: true };
    };

    // return a string representing the robot's current position and direction
    report = () => ({
        success: true,
        message: `X: ${this.xPosition} | Y: ${this.yPosition} | F: ${this.facingDirection}`,
    });

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
    executeCommand = (inputCommand: string): Response => {

        // split the input string by space, mapping the first arg to command and spreading the remaining list to args
        const [command, args] = inputCommand.split(' ');

        // split args by comma if there are args provided
        const splitArgs = args ? args.split(',') : [];

        // check if supplied command is available in our command object
        if (!Object.keys(this.commands).includes(command)) return {
            success: false,
            message: `${command} is not a valid command`,
        };

        // check if the robot has been placed before executing a non-place function
        if (command !== 'PLACE' && !this.placed) return {
            success: false,
            message: `ToyRobot must be placed first`,
        };

        // run the corresponding function, casting command as we checked it's validity above
        const output = this.commands[command as SupportedCommands](...splitArgs);

        return output;

    };

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
        if (output && output.message) console.log(output.message);

        // call this function recursivley to allow another command input
        return recursiveAsyncReadLine();
    });
};

// call main control loop
recursiveAsyncReadLine();