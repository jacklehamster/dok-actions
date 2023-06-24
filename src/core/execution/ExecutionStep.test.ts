import { Context, createContext } from "../context/Context";
import { ExecutionStep, execute } from "./ExecutionStep";

describe('ExecutionStep', () => {
    const context: Context = createContext();
    it('execute all steps', () => {
        const steps:ExecutionStep[] = [
            jest.fn(),
            jest.fn(),
        ];
        execute(steps, {}, context);
        expect(steps[0]).toBeCalledWith({}, context);
        expect(steps[1]).toBeCalledWith({}, context);
    });
    it('execute with parameters', () => {
        const steps:ExecutionStep[] = [
            jest.fn(),
        ];
        execute(steps, {test: 123, test2: "test2", test3: [1, 2, 3]}, context);
        expect(steps[0]).toBeCalledWith({
            test: 123,
            test2: "test2",
            test3: [1, 2, 3],
        }, context);
    });
});