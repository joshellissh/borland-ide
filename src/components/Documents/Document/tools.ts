export function getHighestDocument(excludeId: number): string | undefined {
    let maxZ = 0;
    let maxElem: Element | undefined = undefined;

    document.querySelectorAll('.Document:not(#document' + excludeId + ')').forEach(element => {
        const z = parseInt(window.getComputedStyle(element).zIndex);
        if (!isNaN(z)) {
            maxZ = Math.max(maxZ, z);
            maxElem = element;
        }
    });

    if (maxElem == undefined) {
        return undefined;
    }

    return (maxElem as Element).id;
}


export function getHighestDocumentIndex(): number {
    let maxZ = 0;
    document.querySelectorAll('.Document').forEach(element => {
        const z = parseInt(window.getComputedStyle(element).zIndex);
        if (!isNaN(z)) {
            maxZ = Math.max(maxZ, z);
        }
    });
    return maxZ;
}