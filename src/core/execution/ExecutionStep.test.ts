import { Context } from "../context/Context";
import { ExecutionStep, execute } from "./ExecutionStep";

describe('ExecutionStep', () => {
    const context: Context = {
        parameters: [],
    };
    it('execute all steps', () => {
        const steps:ExecutionStep[] = [
            jest.fn(),
            jest.fn(),
        ];
        execute(steps, {}, context);
        expect(steps[0]).toBeCalledWith(context, {});
        expect(steps[1]).toBeCalledWith(context, {});
    });
});