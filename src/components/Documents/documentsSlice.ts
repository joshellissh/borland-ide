import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {DocumentInfo} from "../../types.ts";
import {RootState} from "../../store.ts";

export interface DocumentsState {
    active: number;
    documentNumber: number;
    documents: Map<number, DocumentInfo>;
}


const initialState: DocumentsState = {
    active: 0,
    documentNumber: 0,
    documents: new Map([
        [0, {
            id: 0,
            name: "NONAME00.CPP",
            position: {x: 10, y: 10},
            size: {width: 60, height: 10},
        }]
    ])
};


export const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        newDocument: state => {
            const newDocNum = state.documentNumber + 1;
            state.documentNumber += 1;
            state.documents.set(
                newDocNum,
                {
                    id: newDocNum,
                    name: "NONAME" + newDocNum.toString().padStart(2, "0") + ".CPP",
                    position: {x: newDocNum, y: newDocNum + 1},
                    size: {width: -1, height: -1}
                }
            );
            state.active = newDocNum;
        },
        closeDocument: (state, payload: PayloadAction<number>) => {
            state.documents.delete(payload.payload);
        },
        updateDocument: ((state, payload: PayloadAction<DocumentInfo>) => {
            const obj = payload.payload;
            if (obj.id === null || obj.id === undefined) {
                throw new Error("Document ID is undefined");
            }

            const doc = state.documents.get(obj.id);
            if (doc === undefined) {
                throw new Error("Document not found");
            }

            const name = obj.name ?? doc.name;
            const position = obj.position ?? doc.position;
            const size = obj.size ?? doc.size;
            const maximized = obj.maximized ?? doc.maximized;
            const nonMaxSize = obj.nonMaxSize ?? doc.nonMaxSize;
            const nonMaxPosition = obj.nonMaxPosition ?? doc.nonMaxPosition;

            state.documents.set(
                obj.id,
                {
                    id: obj.id,
                    name: name,
                    position: position,
                    size: size,
                    maximized: maximized,
                    nonMaxSize: nonMaxSize,
                    nonMaxPosition: nonMaxPosition,
                }
            );
        }),
        setActiveDocument: ((state, payload: PayloadAction<number>) => {
            state.active = payload.payload;
        }),
    }
});

export const selectActive = (state: RootState) => state.documents.active;
export const selectDocuments = (state: RootState) => state.documents.documents;

export const { newDocument, closeDocument, setActiveDocument, updateDocument } = documentsSlice.actions;
export default documentsSlice.reducer;