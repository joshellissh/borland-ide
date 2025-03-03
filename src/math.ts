export function constrain(value: number, min: number, max: number): number {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }

    return value;
}

export function lerp(x: number, y: number, a: number) { return x * (1 - a) + y * a; }

export function findClosestMultiple(num: number, multipleOf: number): number {
    if (multipleOf === 0) { return num; }
    const quotient = Math.round(num / multipleOf);
    return quotient * multipleOf;
}