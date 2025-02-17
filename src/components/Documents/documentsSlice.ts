import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Dimensions, DocumentInfo, XY} from "../../types.ts";
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
            docPos: {x: 0, y: 1},
            docSize: {width: 80, height: 16}
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
                    docPos: {x: newDocNum, y: newDocNum + 1},
                    docSize: {width: -1, height: -1}
                }
            );
            state.active = newDocNum;
        },
        closeDocument: (state, payload: PayloadAction<number>) => {
            state.documents.delete(payload.payload);
        },
        setDocumentSize: ((state, payload: PayloadAction<{docNum: number, dimensions: Dimensions}>) => {
            const doc = state.documents.get(payload.payload.docNum)!;
            state.documents.set(
                doc.id,
                {
                    id: doc.id,
                    name: doc.name,
                    docPos: doc.docPos,
                    docSize: payload.payload.dimensions
                }
            );
        }),
        setActiveDocument: ((state, payload: PayloadAction<number>) => {
            state.active = payload.payload;
        }),
        setDocumentPosition: ((state, payload: PayloadAction<{docNum: number, pos: XY}>) => {
            const doc = state.documents.get(payload.payload.docNum)!;
            console.log(doc);
            state.documents.set(
                doc.id,
                {
                    id: doc.id,
                    name: doc.name,
                    docPos: payload.payload.pos,
                    docSize: doc.docSize
                }
            );
        }),
    }
});

export const selectActive = (state: RootState) => state.documents.active;
export const selectDocuments = (state: RootState) => state.documents.documents;

export const { newDocument, closeDocument, setDocumentSize, setActiveDocument, setDocumentPosition } = documentsSlice.actions;
export default documentsSlice.reducer;